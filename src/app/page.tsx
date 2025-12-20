"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
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
    return {
      content: {
        ...DEMO_LLM_EXPLAINER,
        format: explainerFormat,
      },
      audioTrackId,
      audioVolume,
    };
  }, [explainerFormat, audioTrackId, audioVolume]);

  // Calculate dynamic duration based on mode
  const durationInFrames = useMemo(() => {
    if (videoMode === "text") {
      return calculateDuration(text, textAnimation);
    } else if (videoMode === "explainer") {
      return calculateTotalFrames(DEMO_LLM_EXPLAINER.sections);
    } else {
      return calculateMessageDuration(messages.length, displayMode);
    }
  }, [videoMode, text, textAnimation, messages.length, displayMode]);

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

            <p className="text-gray-400 text-sm text-center mt-4">
              6 sections • Minimalist design • Smooth fade transitions
            </p>
            <p className="text-gray-500 text-xs mt-2 text-center">
              Edit: types/demo-content.ts
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
