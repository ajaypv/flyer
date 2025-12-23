"use client";

interface DownloadComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateType?: "conversation" | "explainer" | "text";
}

export function DownloadComingSoonDialog({
  isOpen,
  onClose,
  templateType = "conversation",
}: DownloadComingSoonDialogProps) {
  if (!isOpen) return null;

  const cliCommand = templateType === "conversation" 
    ? "node scripts/render-conversation.mjs your-file.json --platform twitter --format portrait --quality fhd"
    : templateType === "explainer"
    ? "pnpm render --composition=ContentExplainer"
    : "pnpm render --composition=MyComp";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Download Coming Soon</h2>
                <p className="text-xs text-white/40">We're working on browser-based export</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Status Message */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm text-amber-200 font-medium">Browser export is under development</p>
                <p className="text-xs text-amber-200/60 mt-1">
                  Direct browser download requires complex video encoding that we're still perfecting.
                </p>
              </div>
            </div>
          </div>

          {/* Workaround Section */}
          <div>
            <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Workarounds Available
            </h3>
            
            <div className="space-y-3">
              {/* Screen Recording */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 font-medium">Screen Recording</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Use your OS screen recorder to capture the video preview while it plays.
                    </p>
                  </div>
                </div>
              </div>

              {/* CLI Rendering */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium">CLI Rendering (Recommended)</p>
                    <p className="text-xs text-white/40 mt-0.5 mb-2">
                      Export your JSON and render using the command line for best quality.
                    </p>
                    <div className="bg-black/40 rounded-lg p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      <code>{cliCommand}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CLI Options */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-white/60 mb-2 font-medium">CLI supports:</p>
            <div className="flex flex-wrap gap-2">
              {["4K Quality", "60 FPS", "Multiple Formats", "ProRes Codec", "Custom Output"].map((feature) => (
                <span key={feature} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/50">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <a 
            href="https://github.com/ajaypv/flyer#cli-rendering"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View CLI Documentation
          </a>
          <button
            onClick={onClose}
            className="h-9 px-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 rounded-lg text-xs font-medium text-white transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
