"use client";

import { useMemo, useState, useCallback } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";
import {
  EditorSection,
  EditorSelect,
  EditorButtonGroup,
  EditorSlider,
  EditorColorGrid,
} from "@/components/editor/EditorSection";
import { VideoPlayer } from "@/components/editor/VideoPlayer";
import { JsonImporter } from "@/components/editor/JsonImporter";
import { ContentExplainer } from "@/remotion/ContentExplainer";
import { AUDIO_TRACKS, AudioTrackId } from "@/remotion/ContentExplainer/audio/BackgroundAudio";
import {
  VideoContentInputType,
  VIDEO_FORMAT_DIMENSIONS,
  VIDEO_CONTENT_FPS,
  calculateTotalFrames,
  validateVideoContent,
} from "../../../../types/video-content";
import { DEMO_LLM_EXPLAINER } from "../../../../types/demo-content";

const BACKGROUND_OPTIONS = [
  { value: "aurora", label: "Aurora", icon: "✨" },
  { value: "gradient-mesh", label: "Mesh", icon: "🌈" },
  { value: "organic-blobs", label: "Blobs", icon: "🫧" },
  { value: "3d-grid", label: "Grid", icon: "📐" },
  { value: "shooting-stars", label: "Stars", icon: "⭐" },
  { value: "ice-galaxy", label: "Galaxy", icon: "❄️" },
  { value: "hyperspeed", label: "Speed", icon: "🚀" },
  { value: "solid-dark", label: "Dark", icon: "⬛" },
  { value: "solid-light", label: "Light", icon: "⬜" },
];

export default function ExplainerEditorPage() {
  // Content source
  const [useCustomJson, setUseCustomJson] = useState(false);
  const [customContent, setCustomContent] = useState<VideoContentInputType | null>(null);

  // Format & Style
  const [format, setFormat] = useState<"portrait" | "landscape">("portrait");
  const [background, setBackground] = useState("aurora");

  // Audio
  const [audioTrackId, setAudioTrackId] = useState<AudioTrackId>("explainer");
  const [audioVolume, setAudioVolume] = useState(0.3);

  // Base content
  const baseContent = useMemo(() => {
    return useCustomJson && customContent ? customContent : DEMO_LLM_EXPLAINER;
  }, [useCustomJson, customContent]);

  // Input props with overrides
  const inputProps = useMemo(() => ({
    content: {
      ...baseContent,
      format,
      background: background as any,
    },
    audioTrackId,
    audioVolume,
  }), [baseContent, format, background, audioTrackId, audioVolume]);

  // Duration
  const durationInFrames = useMemo(() => {
    return calculateTotalFrames(baseContent.sections);
  }, [baseContent.sections]);

  const { width, height } = VIDEO_FORMAT_DIMENSIONS[format];
  const estimatedDuration = Math.round(durationInFrames / VIDEO_CONTENT_FPS);

  // JSON import handler
  const handleJsonImport = useCallback((data: VideoContentInputType) => {
    setCustomContent(data);
    setUseCustomJson(true);
    if (data.format) setFormat(data.format as "portrait" | "landscape");
    if (data.background) setBackground(data.background);
  }, []);

  // JSON validator
  const jsonValidator = useCallback((data: unknown) => {
    const result = validateVideoContent(data);
    if (!result.success) {
      return { success: false, error: "Invalid video content" };
    }
    return { success: true };
  }, []);

  // Video preview
  const videoPreview = (
    <div
      className="rounded-xl overflow-hidden shadow-2xl shadow-emerald-500/5 border border-white/5"
      style={{
        maxWidth: height > width ? "320px" : "100%",
      }}
    >
      <VideoPlayer
        component={ContentExplainer}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={VIDEO_CONTENT_FPS}
        width={width}
        height={height}
      />
    </div>
  );

  return (
    <EditorLayout
      title="Video Explainer"
      icon="🎬"
      videoPreview={videoPreview}
      videoInfo={{ width, height, duration: estimatedDuration, fps: VIDEO_CONTENT_FPS }}
      durationInFrames={durationInFrames}
    >
      {/* Content Source */}
      <EditorSection title="Content">
        <div className="flex gap-1 p-1 bg-black/30 rounded-lg mb-3">
          <button
            onClick={() => setUseCustomJson(false)}
            className={`flex-1 h-7 rounded-md text-[11px] font-medium transition-all ${
              !useCustomJson
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Demo
          </button>
          <button
            onClick={() => customContent && setUseCustomJson(true)}
            disabled={!customContent}
            className={`flex-1 h-7 rounded-md text-[11px] font-medium transition-all disabled:opacity-30 ${
              useCustomJson
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Custom
          </button>
        </div>

        <JsonImporter<VideoContentInputType>
          onImport={handleJsonImport}
          validator={jsonValidator}
          sampleUrl="/sample-video.json"
        />

        {/* Content Info */}
        <div className="mt-3 p-2.5 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/70 truncate pr-2">
              {baseContent.title}
            </span>
            <span className="text-[10px] text-white/30 flex-shrink-0">
              {baseContent.sections.length} sections
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {baseContent.sections.slice(0, 4).map((section) => (
              <span
                key={section.id}
                className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-white/40 uppercase"
              >
                {section.type}
              </span>
            ))}
            {baseContent.sections.length > 4 && (
              <span className="px-1.5 py-0.5 text-[9px] text-white/30">
                +{baseContent.sections.length - 4}
              </span>
            )}
          </div>
        </div>
      </EditorSection>

      {/* Format */}
      <EditorSection title="Format">
        <EditorButtonGroup
          label="Aspect Ratio"
          options={[
            { value: "portrait", label: "9:16" },
            { value: "landscape", label: "16:9" },
          ]}
          value={format}
          onChange={(v) => setFormat(v as "portrait" | "landscape")}
          size="sm"
        />
      </EditorSection>

      {/* Background */}
      <EditorSection title="Background">
        <EditorColorGrid
          options={BACKGROUND_OPTIONS}
          value={background}
          onChange={setBackground}
          columns={3}
        />
      </EditorSection>

      {/* Audio */}
      <EditorSection title="Audio">
        <EditorSelect
          label="Music Track"
          value={audioTrackId}
          onChange={(e) => setAudioTrackId(e.target.value as AudioTrackId)}
          options={AUDIO_TRACKS.map((track) => ({
            value: track.id,
            label: track.name,
          }))}
        />

        {audioTrackId !== "none" && (
          <EditorSlider
            label="Volume"
            value={audioVolume}
            onChange={setAudioVolume}
            min={0}
            max={1}
            step={0.05}
            valueFormatter={(v) => `${Math.round(v * 100)}%`}
          />
        )}
      </EditorSection>

      {/* Sections */}
      <EditorSection title="Sections" badge={String(baseContent.sections.length)} defaultOpen={false}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {baseContent.sections.map((section, index) => (
            <div
              key={section.id}
              className="p-2 bg-black/20 rounded-lg border border-white/5"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[9px] text-white/40">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-medium text-white/50 uppercase">
                    {section.type}
                  </span>
                </div>
                <span className="text-[9px] text-white/30">
                  {section.duration || 3}s
                </span>
              </div>
              {section.headline && (
                <p className="text-[11px] text-white/70 truncate">{section.headline}</p>
              )}
            </div>
          ))}
        </div>
      </EditorSection>
    </EditorLayout>
  );
}
