"use client";

import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  bgColor: string;
  route: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: "conversation",
    name: "Chat Conversation",
    description: "Create viral social media conversations with realistic messaging interfaces",
    icon: "💬",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgColor: "bg-violet-500/10",
    route: "/editor/conversation",
    tags: ["Twitter", "Discord", "iMessage", "Slack"],
  },
  {
    id: "explainer",
    name: "Video Explainer",
    description: "Professional explainer videos with cinematic animations and transitions",
    icon: "🎬",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgColor: "bg-emerald-500/10",
    route: "/editor/explainer",
    tags: ["Sections", "Animations", "Audio"],
  },
  {
    id: "text",
    name: "Text Animation",
    description: "Eye-catching animated text with stunning visual effects",
    icon: "✨",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgColor: "bg-amber-500/10",
    route: "/editor/text",
    tags: ["Magical", "Typing", "Effects"],
  },
];

export default function TemplateSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-cyan-950/20 pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Header */}
      <header className="relative border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4v16l16-8z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0b]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Flyer Studio</h1>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Video Creator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors">
                Docs
              </button>
              <button className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Powered by Remotion
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Create stunning videos
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              in minutes
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Professional video templates with real-time preview. 
            No editing experience required.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => router.push(template.route)}
              className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-500 text-left"
            >
              {/* Hover gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${template.bgColor} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {template.icon}
                </div>

                {/* Text */}
                <h3 className="text-base font-medium mb-2 text-white/90 group-hover:text-white transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-xs font-medium text-white/30 group-hover:text-white/70 transition-colors">
                  <span>Open Editor</span>
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className={`h-px bg-gradient-to-r ${template.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "⚡", title: "Real-time Preview", desc: "See changes instantly" },
            { icon: "🎨", title: "Customizable", desc: "Full creative control" },
            { icon: "📱", title: "Multi-format", desc: "Portrait, landscape, square" },
            { icon: "🚀", title: "Fast Export", desc: "Optimized rendering" },
          ].map((feature) => (
            <div key={feature.title} className="text-center p-4">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h4 className="text-sm font-medium text-white/80 mb-1">{feature.title}</h4>
              <p className="text-xs text-white/40">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-white/30">
          <span>Built with Remotion & Next.js</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
