"use client";

import { useCallback, useRef, useState } from "react";
import { PlayerRef } from "@remotion/player";

export type RenderState = 
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "recording"; progress: number }
  | { status: "processing" }
  | { status: "done"; url: string; blob: Blob }
  | { status: "error"; error: string };

interface UseClientRenderOptions {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  filename?: string;
}

export function useClientRender(options: UseClientRenderOptions) {
  const { fps, width, height, durationInFrames, filename = "video" } = options;
  
  const [state, setState] = useState<RenderState>({ status: "idle" });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const abortRef = useRef(false);

  const startRender = useCallback(async (playerRef: PlayerRef | null) => {
    if (!playerRef) {
      setState({ status: "error", error: "Player not ready" });
      return;
    }

    abortRef.current = false;
    chunksRef.current = [];
    setState({ status: "preparing" });

    try {
      // Get the player's container element
      const playerContainer = (playerRef as any).getContainerNode?.() as HTMLElement | null;
      if (!playerContainer) {
        throw new Error("Cannot access player container");
      }

      // Find the canvas or video element inside the player
      const canvas = playerContainer.querySelector("canvas");
      const videoElement = playerContainer.querySelector("video");
      
      let stream: MediaStream;

      if (canvas) {
        // If there's a canvas, capture from it
        stream = canvas.captureStream(fps);
      } else if (videoElement) {
        // If there's a video element, capture from it
        stream = (videoElement as any).captureStream(fps);
      } else {
        // Fallback: Create a canvas and draw the player content
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        
        // Use html2canvas approach or capture the DOM
        throw new Error("No canvas found in player. Try using a different composition.");
      }

      // Determine the best codec
      const mimeTypes = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];
      
      let selectedMimeType = "";
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error("No supported video format found in this browser");
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps for good quality
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (abortRef.current) {
          setState({ status: "idle" });
          return;
        }

        setState({ status: "processing" });

        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);

        setState({ status: "done", url, blob });
      };

      mediaRecorder.onerror = (event) => {
        setState({ status: "error", error: "Recording failed" });
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setState({ status: "recording", progress: 0 });

      // Seek to start and play
      playerRef.seekTo(0);
      playerRef.play();

      // Track progress
      const totalDuration = durationInFrames / fps;
      const startTime = Date.now();

      const trackProgress = () => {
        if (abortRef.current) return;

        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / totalDuration, 1);

        setState({ status: "recording", progress });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(trackProgress);
        } else {
          // Recording complete
          setTimeout(() => {
            playerRef.pause();
            mediaRecorder.stop();
          }, 500); // Small buffer to ensure last frames are captured
        }
      };

      animationFrameRef.current = requestAnimationFrame(trackProgress);

    } catch (error) {
      setState({ status: "error", error: (error as Error).message });
    }
  }, [fps, width, height, durationInFrames]);

  const cancelRender = useCallback(() => {
    abortRef.current = true;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    
    setState({ status: "idle" });
  }, []);

  const downloadVideo = useCallback(() => {
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
    startRender,
    cancelRender,
    downloadVideo,
    reset,
  };
}
