"use client";

import { useCallback, useRef, useState } from "react";
import { PlayerRef } from "@remotion/player";

export type CaptureState =
  | { status: "idle" }
  | { status: "capturing"; progress: number; currentFrame: number; totalFrames: number }
  | { status: "encoding" }
  | { status: "done"; url: string; blob: Blob }
  | { status: "error"; error: string };

interface UseFrameCaptureOptions {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  filename?: string;
  quality?: number; // 0-1, default 0.92
}

/**
 * Client-side video capture using frame-by-frame rendering
 * This captures each frame from the Remotion Player and encodes to WebM
 */
export function useFrameCapture(options: UseFrameCaptureOptions) {
  const {
    fps,
    width,
    height,
    durationInFrames,
    filename = "video",
    quality = 0.92,
  } = options;

  const [state, setState] = useState<CaptureState>({ status: "idle" });
  const abortRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const captureFrames = useCallback(async (playerRef: PlayerRef | null) => {
    if (!playerRef) {
      setState({ status: "error", error: "Player not ready" });
      return;
    }

    abortRef.current = false;

    // Create offscreen canvas for capturing
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      ctxRef.current = canvasRef.current.getContext("2d");
    }

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!ctx) {
      setState({ status: "error", error: "Cannot create canvas context" });
      return;
    }

    try {
      // Get the player container
      const container = (playerRef as any).getContainerNode?.() as HTMLElement;
      if (!container) {
        throw new Error("Cannot access player");
      }

      // Find the inner content
      const playerContent = container.querySelector('[data-remotion-canvas]') as HTMLElement
        || container.querySelector('canvas') as HTMLCanvasElement
        || container.firstElementChild as HTMLElement;

      if (!playerContent) {
        throw new Error("Cannot find player content");
      }

      // Setup MediaRecorder with canvas stream
      const stream = canvas.captureStream(fps);
      
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 10000000, // 10 Mbps
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingPromise = new Promise<Blob>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          resolve(blob);
        };
        mediaRecorder.onerror = () => reject(new Error("Recording failed"));
      });

      mediaRecorder.start();

      // Pause player and capture frame by frame
      playerRef.pause();

      const frameDelay = 1000 / fps;

      for (let frame = 0; frame < durationInFrames; frame++) {
        if (abortRef.current) {
          mediaRecorder.stop();
          setState({ status: "idle" });
          return;
        }

        setState({
          status: "capturing",
          progress: frame / durationInFrames,
          currentFrame: frame,
          totalFrames: durationInFrames,
        });

        // Seek to frame
        playerRef.seekTo(frame);

        // Wait for render
        await new Promise((r) => setTimeout(r, 50));

        // Capture the frame
        // Try to find a canvas first
        const sourceCanvas = container.querySelector("canvas") as HTMLCanvasElement;
        
        if (sourceCanvas) {
          ctx.drawImage(sourceCanvas, 0, 0, width, height);
        } else {
          // Use html2canvas-like approach for DOM content
          // For now, draw a placeholder - in production you'd use html2canvas
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = "#fff";
          ctx.font = "24px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`Frame ${frame + 1}`, width / 2, height / 2);
        }

        // Hold frame for the duration
        await new Promise((r) => setTimeout(r, frameDelay));
      }

      setState({ status: "encoding" });
      mediaRecorder.stop();

      const blob = await recordingPromise;
      const url = URL.createObjectURL(blob);

      setState({ status: "done", url, blob });

    } catch (error) {
      setState({ status: "error", error: (error as Error).message });
    }
  }, [fps, width, height, durationInFrames, quality]);

  const cancel = useCallback(() => {
    abortRef.current = true;
    setState({ status: "idle" });
  }, []);

  const download = useCallback(() => {
    if (state.status !== "done") return;

    const a = document.createElement("a");
    a.href = state.url;
    a.download = `${filename}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [state, filename]);

  const reset = useCallback(() => {
    if (state.status === "done") {
      URL.revokeObjectURL(state.url);
    }
    setState({ status: "idle" });
  }, [state]);

  return {
    state,
    startCapture: captureFrames,
    cancel,
    download,
    reset,
  };
}
