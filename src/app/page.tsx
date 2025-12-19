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
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { ModeSelector } from "../components/ModeSelector";
import { Main } from "../remotion/MyComp/Main";
import { MessageConversation } from "../remotion/MessageComp/MessageConversation";

const Home: NextPage = () => {
  // Video mode state
  const [videoMode, setVideoMode] = useState<VideoModeType>("text");

  // Video format state
  const [videoFormat, setVideoFormat] = useState<VideoFormatType>("landscape");

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

  // Calculate dynamic duration based on mode
  const durationInFrames = useMemo(() => {
    if (videoMode === "text") {
      return calculateDuration(text, textAnimation);
    } else {
      return calculateMessageDuration(messages.length, displayMode);
    }
  }, [videoMode, text, textAnimation, messages.length, displayMode]);

  // Get video dimensions based on format
  const { width: videoWidth, height: videoHeight } = VIDEO_FORMAT_CONFIGS[videoFormat];

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
          {videoMode === "text" ? (
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
        <ModeSelector value={videoMode} onChange={setVideoMode} />
        <RenderControls
          videoMode={videoMode}
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
