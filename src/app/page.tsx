"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  defaultMyCompProps,
  defaultMessageConversationProps,
  CompositionProps,
  MessageConversationProps,
  VIDEO_FPS,
  TextAnimationStyleType,
  BackgroundStyleType,
  VideoModeType,
  PlatformThemeType,
  DisplayModeType,
  MessageType,
  VideoFormatType,
  VIDEO_FORMAT_CONFIGS,
  calculateDuration,
  calculateMessageDuration,
} from "../../types/constants";
import {
  VIDEO_FORMAT_DIMENSIONS,
  VIDEO_CONTENT_FPS,
  calculateTotalFrames,
} from "../../types/video-content";
import { DEMO_LLM_EXPLAINER } from "../../types/demo-content";
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { Main } from "../remotion/MyComp/Main";
import { MessageConversation } from "../remotion/MessageComp/MessageConversation";
import { ContentExplainer } from "../remotion/ContentExplainer";
import { AUDIO_TRACKS, AudioTrackId } from "../remotion/ContentExplainer/audio/BackgroundAudio";

// Extended video mode type to include explainer
type ExtendedVideoModeType = VideoModeType | "explainer";

const Home: NextPage = () => {
  // Video mode state - extended to include explainer
  const [videoMode, setVideoMode] = useState<ExtendedVideoModeType>("explainer");

  // Video format state
  const [videoFormat, setVideoFormat] = useState<VideoFormatType>("portrait");

  // Explainer format state (portrait/landscape toggle)
  const [explainerFormat, setExplainerFormat] = useState<"portrait" | "landscape">("portrait");

  // Explainer audio state
  const [audioTrackId, setAudioTrackId] = useState<AudioTrackId>("explainer");
  const [audioVolume, setAudioVolume] = useState<number>(0.3);

  // Explainer background state
  const [explainerBackground, setExplainerBackground] = useState<string>("aurora");

  // Custom JSON input state
  const [useCustomJson, setUseCustomJson] = useState<boolean>(false);
  const [customJsonInput, setCustomJsonInput] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [parsedCustomContent, setParsedCustomContent] = useState<VideoContentInputType | null>(null);

  // Parse custom JSON when input changes
  useEffect(() => {
    if (!customJsonInput.trim()) {
      setParsedCustomContent(null);
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(customJsonInput);
      setParsedCustomContent(parsed as VideoContentInputType);
      setJsonError(null);
    } catch (e) {
      setJsonError((e as Error).message);
      setParsedCustomContent(null);
    }
  }, [customJsonInput]);

  // Load sample JSON
  const loadSampleJson = async () => {
    try {
      const response = await fetch("/sample-video.json");
      const text = await response.text();
      setCustomJsonInput(text);
      setUseCustomJson(true);
    } catch (e) {
      console.error("Failed to load sample JSON:", e);
    }
  };

  // Text mode state
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [textAnimation, setTextAnimation] = useState<TextAnimationStyleType>(
    defaultMyCompProps.textAnimation
  );
  const [background, setBackground] = useState<BackgroundStyleType>(
    defaultMyCompProps.background
  );

  // Message conversation state
  const [senderName, setSenderName] = useState<string>(
    defaultMessageConversationProps.senderName
  );
  const [senderAvatarUrl, setSenderAvatarUrl] = useState<string>(
    defaultMessageConversationProps.senderAvatarUrl || ""
  );
  const [senderHandle, setSenderHandle] = useState<string>(
    defaultMessageConversationProps.senderHandle || "@user"
  );
  const [receiverName, setReceiverName] = useState<string>(
    defaultMessageConversationProps.receiverName
  );
  const [receiverAvatarUrl, setReceiverAvatarUrl] = useState<string>(
    defaultMessageConversationProps.receiverAvatarUrl || ""
  );
  const [receiverHandle, setReceiverHandle] = useState<string>(
    defaultMessageConversationProps.receiverHandle || "@user"
  );
  const [messages, setMessages] = useState<MessageType[]>(
    defaultMessageConversationProps.messages
  );
  const [platformTheme, setPlatformTheme] = useState<PlatformThemeType>(
    defaultMessageConversationProps.platformTheme
  );
  const [displayMode, setDisplayMode] = useState<DisplayModeType>(
    defaultMessageConversationProps.displayMode
  );
  const [zoomLevel, setZoomLevel] = useState<number>(
    defaultMessageConversationProps.zoomLevel
  );

  // Text mode input props
  const textInputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      textAnimation,
      background,
    };
  }, [text, textAnimation, background]);

  // Message mode input props
  const messageInputProps: z.infer<typeof MessageConversationProps> = useMemo(() => {
    return {
      senderName,
      senderAvatarUrl: senderAvatarUrl || undefined,
      senderHandle: senderHandle || undefined,
      receiverName,
      receiverAvatarUrl: receiverAvatarUrl || undefined,
      receiverHandle: receiverHandle || undefined,
      messages,
      platformTheme,
      displayMode,
      zoomLevel,
    };
  }, [
    senderName,
    senderAvatarUrl,
    senderHandle,
    receiverName,
    receiverAvatarUrl,
    receiverHandle,
    messages,
    platformTheme,
    displayMode,
    zoomLevel,
  ]);

  // Explainer mode input props - with dynamic format and audio
  const explainerInputProps = useMemo(() => {
    // Use custom content if available, otherwise demo content
    const baseContent = (useCustomJson && parsedCustomContent)
      ? parsedCustomContent
      : DEMO_LLM_EXPLAINER;

    return {
      content: {
        ...baseContent,
        format: explainerFormat,
        background: explainerBackground,
      },
      audioTrackId,
      audioVolume,
    };
  }, [explainerFormat, explainerBackground, audioTrackId, audioVolume, useCustomJson, parsedCustomContent]);

  // Calculate dynamic duration based on mode
  const durationInFrames = useMemo(() => {
    if (videoMode === "text") {
      return calculateDuration(text, textAnimation);
    } else if (videoMode === "explainer") {
      // Use custom content sections if available
      const contentSections = (useCustomJson && parsedCustomContent)
        ? parsedCustomContent.sections
        : DEMO_LLM_EXPLAINER.sections;
      return calculateTotalFrames(contentSections);
    } else {
      return calculateMessageDuration(messages.length, displayMode);
    }
  }, [videoMode, text, textAnimation, messages.length, displayMode, useCustomJson, parsedCustomContent]);

  // Get video dimensions based on mode
  const getVideoDimensions = () => {
    if (videoMode === "explainer") {
      return VIDEO_FORMAT_DIMENSIONS[explainerFormat];
    }
    return VIDEO_FORMAT_CONFIGS[videoFormat];
  };

  const { width: videoWidth, height: videoHeight } = getVideoDimensions();

  // Calculate player container style for responsive preview
  const isPortrait = videoHeight > videoWidth;
  const playerContainerStyle = isPortrait
    ? { maxWidth: "360px", margin: "0 auto" }
    : { width: "100%" };

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div
          className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16"
          style={playerContainerStyle}
        >
          {videoMode === "explainer" ? (
            <Player
              component={ContentExplainer}
              inputProps={explainerInputProps}
              durationInFrames={durationInFrames}
              fps={VIDEO_CONTENT_FPS}
              compositionHeight={videoHeight}
              compositionWidth={videoWidth}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          ) : videoMode === "text" ? (
            <Player
              component={Main}
              inputProps={textInputProps}
              durationInFrames={durationInFrames}
              fps={VIDEO_FPS}
              compositionHeight={videoHeight}
              compositionWidth={videoWidth}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          ) : (
            <Player
              component={MessageConversation}
              inputProps={messageInputProps}
              durationInFrames={durationInFrames}
              fps={VIDEO_FPS}
              compositionHeight={videoHeight}
              compositionWidth={videoWidth}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          )}
        </div>
        {/* Mode Selector - custom for 3 modes */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setVideoMode("explainer")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${videoMode === "explainer"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            🎬 Explainer
          </button>
          <button
            onClick={() => setVideoMode("text")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${videoMode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => setVideoMode("message")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${videoMode === "message"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            💬 Message
          </button>
        </div>

        {/* Demo content info for explainer mode */}
        {videoMode === "explainer" && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 text-center">🤖 AI Revolution Demo</h3>

            {/* Format Toggle */}
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={() => setExplainerFormat("portrait")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${explainerFormat === "portrait"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                📱 Portrait (9:16)
              </button>
              <button
                onClick={() => setExplainerFormat("landscape")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${explainerFormat === "landscape"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                🖥️ Landscape (16:9)
              </button>
            </div>

            {/* Background Selector */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm font-medium mb-2 block text-center">
                🎨 Background Style
              </label>
              <select
                value={explainerBackground}
                onChange={(e) => setExplainerBackground(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aurora">✨ Aurora (Apple Style)</option>
                <option value="gradient-mesh">🌈 Gradient Mesh</option>
                <option value="organic-blobs">🫧 Organic Blobs</option>
                <option value="3d-grid">📐 3D Grid (Retro)</option>
                <option value="shooting-stars">⭐ Shooting Stars</option>
                <option value="ice-galaxy">❄️ Ice Galaxy</option>
                <option value="hyperspeed">🚀 Hyperspeed</option>
                <option value="solid-dark">⬛ Solid Dark</option>
                <option value="solid-light">⬜ Solid Light</option>
              </select>
            </div>

            {/* Audio Track Selector */}
            <div className="border-t border-gray-700 pt-4 mt-2">
              <label className="text-gray-300 text-sm font-medium mb-2 block text-center">
                🎵 Background Music
              </label>
              <select
                value={audioTrackId}
                onChange={(e) => setAudioTrackId(e.target.value as AudioTrackId)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AUDIO_TRACKS.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>

              {/* Volume Slider */}
              {audioTrackId !== "none" && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-gray-400 text-sm">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm w-8 text-right">
                    {Math.round(audioVolume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Custom JSON Input */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium">
                  📄 Custom JSON
                </label>
                <button
                  onClick={() => setUseCustomJson(!useCustomJson)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${useCustomJson
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {useCustomJson ? "✓ Using Custom" : "Use Demo"}
                </button>
              </div>

              {/* Load Sample Button */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={loadSampleJson}
                  className="flex-1 bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  📥 Load Sample JSON
                </button>
                {customJsonInput && (
                  <button
                    onClick={() => {
                      setCustomJsonInput("");
                      setUseCustomJson(false);
                    }}
                    className="bg-red-600/20 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* JSON Textarea */}
              <textarea
                value={customJsonInput}
                onChange={(e) => setCustomJsonInput(e.target.value)}
                placeholder='Paste your JSON here...

{
  "id": "my-video",
  "title": "My Video",
  "sections": [...]
}'
                className={`w-full h-32 bg-gray-900 text-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 resize-none ${jsonError
                  ? "border border-red-500 focus:ring-red-500"
                  : "border border-gray-700 focus:ring-blue-500"
                  }`}
              />

              {/* Error Message */}
              {jsonError && (
                <p className="text-red-400 text-xs mt-1">
                  ⚠️ JSON Error: {jsonError}
                </p>
              )}

              {/* Success indicator - Enhanced */}
              {parsedCustomContent && !jsonError && (
                <div className={`mt-3 p-3 rounded-lg border ${useCustomJson
                    ? "bg-green-600/20 border-green-500/50"
                    : "bg-gray-700/50 border-gray-600"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${useCustomJson ? "text-green-400" : "text-gray-300"}`}>
                        {useCustomJson ? "✓ Using Custom JSON" : "📄 JSON Ready"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        "{parsedCustomContent.title || "Untitled"}" • {parsedCustomContent.sections?.length || 0} sections
                      </p>
                    </div>
                    <button
                      onClick={() => setUseCustomJson(!useCustomJson)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${useCustomJson
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {useCustomJson ? "✓ Active" : "Use This"}
                    </button>
                  </div>
                  {useCustomJson && (
                    <p className="text-green-300 text-xs mt-2 flex items-center gap-1">
                      🎬 Video is now playing your custom JSON content
                    </p>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-500 text-xs mt-4 text-center">
              {useCustomJson && parsedCustomContent
                ? `Custom: ${parsedCustomContent.title || "Untitled"}`
                : "Using: AI Revolution Demo"
              }
            </p>
          </div>
        )}

        {/* Only show controls for text/message modes */}
        {videoMode !== "explainer" && (
          <RenderControls
            videoMode={videoMode as VideoModeType}
            // Video format props
            videoFormat={videoFormat}
            setVideoFormat={setVideoFormat}
            // Text mode props
            text={text}
            setText={setText}
            textAnimation={textAnimation}
            setTextAnimation={setTextAnimation}
            background={background}
            setBackground={setBackground}
            inputProps={textInputProps}
            // Message mode props
            senderName={senderName}
            setSenderName={setSenderName}
            senderAvatarUrl={senderAvatarUrl}
            setSenderAvatarUrl={setSenderAvatarUrl}
            senderHandle={senderHandle}
            setSenderHandle={setSenderHandle}
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            receiverAvatarUrl={receiverAvatarUrl}
            setReceiverAvatarUrl={setReceiverAvatarUrl}
            receiverHandle={receiverHandle}
            setReceiverHandle={setReceiverHandle}
            messages={messages}
            setMessages={setMessages}
            platformTheme={platformTheme}
            setPlatformTheme={setPlatformTheme}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            messageInputProps={messageInputProps}
            // Common props
            durationInFrames={durationInFrames}
          />
        )}
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
};

export default Home;
