"use client";

import { useCallback, useRef, useState } from "react";
import { PlayerRef } from "@remotion/player";
import { domToCanvas } from "modern-screenshot";

export type ExportState =
  | { status: "idle" }
  | { status: "recording"; progress: number }
  | { status: "processing" }
  | { status: "done"; url: string; blob: Blob; duration: number }
  | { status: "error"; error: string };

interface UseVideoExportOptions {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  filename?: string;
}

/**
 * Client-side video export using modern-screenshot for DOM capture
 * 
 * This approach:
 * 1. Pauses the Remotion Player
 * 2. Seeks frame-by-frame through the video
 * 3. Uses modern-screenshot to capture each frame to canvas
 * 4. Uses MediaRecorder to encode the canvas stream to WebM
 * 5. Produces a downloadable video file
 */
export function useVideoExport(options: UseVideoExportOptions) {
  const { fps, width, height, durationInFrames, filename = "flyer-video" } = options;

  const [state, setState] = useState<ExportState>({ status: "idle" });
  const abortRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startExport = useCallback(
    async (playerRef: PlayerRef | null) => {
      if (!playerRef) {
        setState({ status: "error", error: "Player not initialized" });
        return;
      }

      abortRef.current = false;
      setState({ status: "recording", progress: 0 });

      try {
        // Get the player container element
        const container = (playerRef as any).getContainerNode?.() as HTMLElement;
        if (!container) {
          throw new Error("Cannot access player container");
        }

        // Find the actual video content element inside the player
        const playerContent = findPlayerContent(container);
        if (!playerContent) {
          throw new Error("Cannot find player content element");
        }

        // Create offscreen canvas for rendering
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;

        // Setup MediaRecorder with the canvas stream
        const stream = canvas.captureStream(fps);
        const mimeType = getPreferredMimeType();

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 8000000,
        });
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        const recordingPromise = new Promise<Blob>((resolve, reject) => {
          mediaRecorder.onstop = () => {
            if (abortRef.current) {
              reject(new Error("Cancelled"));
              return;
            }
            const blob = new Blob(chunks, { type: mimeType });
            resolve(blob);
          };
          mediaRecorder.onerror = () => reject(new Error("Recording failed"));
        });

        // Start recording
        mediaRecorder.start();

        // Pause player for frame-by-frame capture
        playerRef.pause();

        // Calculate timing
        const frameDelay = 1000 / fps;
        const totalFrames = durationInFrames;

        // Frame-by-frame capture loop
        for (let frame = 0; frame < totalFrames; frame++) {
          if (abortRef.current) {
            mediaRecorder.stop();
            setState({ status: "idle" });
            return;
          }

          // Update progress
          setState({ status: "recording", progress: frame / totalFrames });

          // Seek to the current frame
          playerRef.seekTo(frame);

          // Wait for the frame to render
          await waitForFrame(60);

          // Capture the current frame
          await captureFrame(ctx, playerContent, width, height);

          // Hold the frame for proper duration
          await waitForFrame(frameDelay * 0.5);
        }

        // Finalize recording
        setState({ status: "processing" });
        mediaRecorder.stop();

        const blob = await recordingPromise;
        const url = URL.createObjectURL(blob);
        const duration = durationInFrames / fps;

        setState({ status: "done", url, blob, duration });
      } catch (error) {
        if (!abortRef.current) {
          setState({ status: "error", error: (error as Error).message });
        }
      }
    },
    [fps, width, height, durationInFrames]
  );

  const cancelExport = useCallback(() => {
    abortRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setState({ status: "idle" });
  }, []);

  const downloadVideo = useCallback(() => {
    if (state.status !== "done") return;

    const link = document.createElement("a");
    link.href = state.url;
    link.download = `${filename}.webm`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state, filename]);

  const reset = useCallback(() => {
    if (state.status === "done") {
      URL.revokeObjectURL(state.url);
    }
    setState({ status: "idle" });
  }, [state]);

  return {
    state,
    startExport,
    cancelExport,
    downloadVideo,
    reset,
    isExporting: state.status === "recording" || state.status === "processing",
    isComplete: state.status === "done",
    progress: state.status === "recording" ? state.progress : 0,
  };
}

/**
 * Find the actual content element inside the Remotion Player
 */
function findPlayerContent(container: HTMLElement): HTMLElement | null {
  // Remotion Player structure varies, try multiple approaches
  const selectors = [
    '[style*="position: relative"]',
    '[style*="position:relative"]',
    'div > div',
  ];

  for (const selector of selectors) {
    const element = container.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
  }

  return container;
}

/**
 * Get the best supported video MIME type
 */
function getPreferredMimeType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "video/webm";
}

/**
 * Wait for a specified number of milliseconds
 */
function waitForFrame(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Capture a DOM element to canvas using modern-screenshot
 */
async function captureFrame(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  width: number,
  height: number
): Promise<void> {
  try {
    // Use modern-screenshot which supports modern CSS color functions
    const capturedCanvas = await domToCanvas(element, {
      width,
      height,
      scale: 1,
      backgroundColor: null,
      style: {
        // Override any problematic styles
      },
      filter: (node) => {
        // Skip script and style tags
        if (node instanceof Element) {
          const tagName = node.tagName.toLowerCase();
          if (tagName === 'script' || tagName === 'noscript') {
            return false;
          }
        }
        return true;
      },
      onCloneNode: (clonedNode) => {
        // Convert modern CSS colors to RGB for compatibility
        if (clonedNode instanceof HTMLElement) {
          convertModernColors(clonedNode);
        }
      },
    });

    // Draw the captured canvas onto our recording canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(capturedCanvas, 0, 0, width, height);
  } catch (error) {
    console.warn("Frame capture failed, using fallback:", error);
    // Fallback: try simpler capture or draw black frame
    await fallbackCapture(ctx, element, width, height);
  }
}

/**
 * Convert modern CSS color functions to RGB equivalents
 */
function convertModernColors(element: HTMLElement): void {
  const style = element.style;
  const computedStyle = window.getComputedStyle(element);
  
  // List of color properties to check
  const colorProps = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'fill',
    'stroke',
  ];

  colorProps.forEach((prop) => {
    try {
      const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('oklab(') || value.includes('lch('))) {
        // Get the computed RGB value from the browser
        const tempEl = document.createElement('div');
        tempEl.style.color = value;
        document.body.appendChild(tempEl);
        const rgb = window.getComputedStyle(tempEl).color;
        document.body.removeChild(tempEl);
        
        // Apply the RGB value
        (style as any)[prop] = rgb;
      }
    } catch {
      // Ignore errors
    }
  });

  // Process children
  Array.from(element.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      convertModernColors(child);
    }
  });
}

/**
 * Fallback capture method using simpler approach
 */
async function fallbackCapture(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  width: number,
  height: number
): Promise<void> {
  try {
    // Try to get any canvas elements inside the player (for Three.js, etc.)
    const canvasElements = element.querySelectorAll('canvas');
    if (canvasElements.length > 0) {
      // Draw the first canvas found
      const sourceCanvas = canvasElements[0] as HTMLCanvasElement;
      ctx.drawImage(sourceCanvas, 0, 0, width, height);
      return;
    }

    // Try to get any video elements
    const videoElements = element.querySelectorAll('video');
    if (videoElements.length > 0) {
      const video = videoElements[0] as HTMLVideoElement;
      ctx.drawImage(video, 0, 0, width, height);
      return;
    }

    // Last resort: draw a placeholder
    ctx.fillStyle = "#0a0a0b";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Frame capture unavailable", width / 2, height / 2);
  } catch {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
  }
}
