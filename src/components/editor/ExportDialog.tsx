"use client";

import React from "react";
import { ExportState } from "@/hooks/useVideoExport";

interface ExportDialogProps {
  isOpen: boolean;
  state: ExportState;
  onClose: () => void;
  onDownload: () => void;
  onCancel: () => void;
  videoInfo?: {
    width: number;
    height: number;
    duration: number;
    fps: number;
  };
}

export function ExportDialog({
  isOpen,
  state,
  onClose,
  onDownload,
  onCancel,
  videoInfo,
}: ExportDialogProps) {
  if (!isOpen) return null;

  const progress = state.status === "recording" ? state.progress : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={state.status === "done" || state.status === "error" ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {state.status === "done" ? "Export Complete" : "Exporting Video"}
            </h2>
            {(state.status === "done" || state.status === "error" || state.status === "idle") && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Recording State */}
          {state.status === "recording" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20">
                  {/* Circular progress */}
                  <svg className="w-20 h-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 226} 226`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">{progressPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-white/70">Recording video...</p>
                <p className="text-xs text-white/40 mt-1">
                  Please wait while the video plays through
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                onClick={onCancel}
                className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Processing State */}
          {state.status === "processing" && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-sm text-white/70">Processing video...</p>
                <p className="text-xs text-white/40 mt-1">Almost done</p>
              </div>
            </div>
          )}

          {/* Done State */}
          {state.status === "done" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-white/70">Your video is ready!</p>
                {videoInfo && (
                  <p className="text-xs text-white/40 mt-1">
                    {videoInfo.width}×{videoInfo.height} • {state.duration.toFixed(1)}s • WebM
                  </p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-black/30 rounded-lg p-3">
                <video
                  src={state.url}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: "200px" }}
                />
              </div>

              {/* File size */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{(state.blob.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              <button
                onClick={onDownload}
                className="w-full h-11 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video
              </button>
            </div>
          )}

          {/* Error State */}
          {state.status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-white/70">Export failed</p>
                <p className="text-xs text-red-400 mt-1">{state.error}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
