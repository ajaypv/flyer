"use client";

import { useRouter } from "next/navigation";
import React, { useState, useCallback, createContext, useContext, useRef } from "react";
import { PlayerRef } from "@remotion/player";
import { useVideoExport } from "@/hooks/useVideoExport";
import { ExportDialog } from "./ExportDialog";

// Context to share player ref between EditorLayout and VideoPlayer
interface PlayerContextType {
  setPlayerRef: (ref: PlayerRef | null) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayerContext() {
  return useContext(PlayerContext);
}

interface EditorLayoutProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  videoPreview: React.ReactNode;
  videoInfo?: {
    width: number;
    height: number;
    duration: number;
    fps: number;
  };
  durationInFrames?: number;
}

export function EditorLayout({
  title,
  icon,
  children,
  videoPreview,
  videoInfo,
  durationInFrames,
}: EditorLayoutProps) {
  const router = useRouter();
  const playerRefHolder = useRef<PlayerRef | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Video export hook
  const {
    state: exportState,
    startExport,
    cancelExport,
    downloadVideo,
    reset: resetExport,
    isExporting,
    progress,
  } = useVideoExport({
    fps: videoInfo?.fps || 30,
    width: videoInfo?.width || 1080,
    height: videoInfo?.height || 1920,
    durationInFrames: durationInFrames || (videoInfo?.duration || 10) * (videoInfo?.fps || 30),
    filename: `flyer-${title.toLowerCase().replace(/\s+/g, "-")}`,
  });

  const setPlayerRef = useCallback((ref: PlayerRef | null) => {
    playerRefHolder.current = ref;
  }, []);

  const handleExport = useCallback(() => {
    setShowExportDialog(true);
    startExport(playerRefHolder.current);
  }, [startExport]);

  const handleCloseDialog = useCallback(() => {
    setShowExportDialog(false);
    resetExport();
  }, [resetExport]);

  const handleDownload = useCallback(() => {
    downloadVideo();
  }, [downloadVideo]);

  return (
    <PlayerContext.Provider value={{ setPlayerRef }}>
      <div className="h-screen bg-[#0d0d0f] text-white flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 border-b border-white/5 bg-[#0d0d0f] flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.push("/")}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10" />

            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-base">{icon}</span>
              <span className="text-sm font-medium text-white/80">{title}</span>
            </div>
          </div>

          {/* Center - Video Info */}
          {videoInfo && (
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-white/40">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{videoInfo.width}×{videoInfo.height}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{videoInfo.duration}s</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <span>{videoInfo.fps} fps</span>
              </div>
            </div>
          )}

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="h-8 px-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{Math.round(progress * 100)}%</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Progress Bar (when exporting) */}
        {isExporting && (
          <div className="h-0.5 bg-white/5 flex-shrink-0">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Controls */}
          <aside className="w-80 xl:w-96 border-r border-white/5 bg-[#111113] flex flex-col overflow-hidden flex-shrink-0">
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-2">
                {children}
              </div>
            </div>
          </aside>

          {/* Right Panel - Preview */}
          <main className="flex-1 bg-[#0a0a0b] flex flex-col overflow-hidden">
            {/* Preview Area - Top aligned */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl">
                {videoPreview}
              </div>
            </div>

            {/* Timeline placeholder */}
            <div className="h-16 border-t border-white/5 bg-[#0d0d0f] flex items-center px-4 flex-shrink-0">
              <div className="flex items-center gap-3 text-white/30 text-xs">
                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="flex-1 h-1 bg-white/5 rounded-full max-w-md">
                  <div className="h-full w-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                </div>
                <span className="font-mono">00:00 / {videoInfo ? `00:${String(videoInfo.duration).padStart(2, '0')}` : '00:00'}</span>
              </div>
            </div>
          </main>
        </div>

        {/* Export Dialog */}
        <ExportDialog
          isOpen={showExportDialog}
          state={exportState}
          onClose={handleCloseDialog}
          onDownload={handleDownload}
          onCancel={cancelExport}
          videoInfo={videoInfo}
        />
      </div>
    </PlayerContext.Provider>
  );
}
