"use client";

import { useMemo, useState } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";
import {
  EditorSection,
  EditorButtonGroup,
  EditorTextarea,
  EditorColorGrid,
} from "@/components/editor/EditorSection";
import { VideoPlayer } from "@/components/editor/VideoPlayer";
import { Main } from "@/remotion/MyComp/Main";
import {
  defaultMyCompProps,
  TextAnimationStyleType,
  BackgroundStyleType,
  VideoFormatType,
  VIDEO_FORMAT_CONFIGS,
  VIDEO_FPS,
  calculateDuration,
} from "../../../../types/constants";

const BACKGROUND_OPTIONS = [
  { value: "shooting-stars", label: "Stars", icon: "⭐" },
  { value: "ice-galaxy", label: "Galaxy", icon: "❄️" },
  { value: "hyperspeed", label: "Speed", icon: "🚀" },
  { value: "black", label: "Black", icon: "⬛" },
  { value: "white", label: "White", icon: "⬜" },
];

const PRESETS = [
  "Hello World",
  "Coming Soon",
  "Subscribe Now",
  "Thank You",
  "Watch Now",
  "New Video",
];

export default function TextEditorPage() {
  // Content
  const [text, setText] = useState(defaultMyCompProps.title);

  // Style
  const [textAnimation, setTextAnimation] = useState<TextAnimationStyleType>(defaultMyCompProps.textAnimation);
  const [background, setBackground] = useState<BackgroundStyleType>(defaultMyCompProps.background);

  // Format
  const [videoFormat, setVideoFormat] = useState<VideoFormatType>("landscape");

  // Input props
  const inputProps = useMemo(() => ({
    title: text,
    textAnimation,
    background,
  }), [text, textAnimation, background]);

  // Duration
  const durationInFrames = useMemo(() => {
    return calculateDuration(text, textAnimation);
  }, [text, textAnimation]);

  const { width, height } = VIDEO_FORMAT_CONFIGS[videoFormat];
  const estimatedDuration = Math.round(durationInFrames / VIDEO_FPS);

  // Video preview
  const videoPreview = (
    <div
      className="rounded-xl overflow-hidden shadow-2xl shadow-amber-500/5 border border-white/5"
      style={{
        maxWidth: height > width ? "320px" : "100%",
      }}
    >
      <VideoPlayer
        component={Main}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={VIDEO_FPS}
        width={width}
        height={height}
      />
    </div>
  );

  return (
    <EditorLayout
      title="Text Animation"
      icon="✨"
      videoPreview={videoPreview}
      videoInfo={{ width, height, duration: estimatedDuration, fps: VIDEO_FPS }}
      durationInFrames={durationInFrames}
    >
      {/* Text Content */}
      <EditorSection title="Text">
        <EditorTextarea
          label="Your Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text..."
          rows={3}
        />

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-1">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setText(preset)}
                className={`px-2 py-1 rounded-md text-[10px] transition-all ${
                  text === preset
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-black/20 text-white/40 border border-white/5 hover:text-white/60"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </EditorSection>

      {/* Animation */}
      <EditorSection title="Animation">
        <EditorButtonGroup
          label="Style"
          options={[
            { value: "magical", label: "✨ Magical" },
            { value: "typing", label: "⌨️ Typing" },
          ]}
          value={textAnimation}
          onChange={(v) => setTextAnimation(v as TextAnimationStyleType)}
        />

        <div className="p-2.5 bg-black/20 rounded-lg border border-white/5">
          <p className="text-[10px] text-white/40 leading-relaxed">
            {textAnimation === "magical"
              ? "Magical animation reveals text with a glowing, ethereal effect that fades in beautifully."
              : "Typing animation simulates text being typed character by character like a typewriter."}
          </p>
        </div>
      </EditorSection>

      {/* Background */}
      <EditorSection title="Background">
        <EditorColorGrid
          options={BACKGROUND_OPTIONS}
          value={background}
          onChange={(v) => setBackground(v as BackgroundStyleType)}
          columns={3}
        />
      </EditorSection>

      {/* Format */}
      <EditorSection title="Format">
        <EditorButtonGroup
          label="Aspect Ratio"
          options={[
            { value: "landscape", label: "16:9" },
            { value: "portrait", label: "9:16" },
            { value: "square", label: "1:1" },
          ]}
          value={videoFormat}
          onChange={(v) => setVideoFormat(v as VideoFormatType)}
          size="sm"
        />

        {/* Info */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="p-2 bg-black/20 rounded-lg text-center">
            <div className="text-[10px] text-white/30 mb-0.5">Resolution</div>
            <div className="text-xs text-white/60 font-mono">{width}×{height}</div>
          </div>
          <div className="p-2 bg-black/20 rounded-lg text-center">
            <div className="text-[10px] text-white/30 mb-0.5">Duration</div>
            <div className="text-xs text-white/60 font-mono">{estimatedDuration}s</div>
          </div>
          <div className="p-2 bg-black/20 rounded-lg text-center">
            <div className="text-[10px] text-white/30 mb-0.5">FPS</div>
            <div className="text-xs text-white/60 font-mono">{VIDEO_FPS}</div>
          </div>
        </div>
      </EditorSection>
    </EditorLayout>
  );
}
