import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_SECONDS,
  MSG_DISPLAY_SECONDS,
  MSG_TRANSITION_SECONDS,
  MSG_INTRO_SECONDS,
  secondsToFrames,
} from "../../../../types/constants";
import { MessageRenderer } from "../MessageRenderer";
import { TypingIndicator } from "../TypingIndicator";

interface OneAtATimeModeProps {
  messages: MessageType[];
  senderName: string;
  senderAvatarUrl?: string;
  senderHandle?: string;
  receiverName: string;
  receiverAvatarUrl?: string;
  receiverHandle?: string;
  platformTheme: PlatformThemeType;
  zoomLevel?: number;
}

export const OneAtATimeMode: React.FC<OneAtATimeModeProps> = ({
  messages,
  senderName,
  senderAvatarUrl,
  senderHandle,
  receiverName,
  receiverAvatarUrl,
  receiverHandle,
  platformTheme,
  zoomLevel = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Convert seconds to frames based on actual FPS
  const typingDurationFrames = secondsToFrames(MSG_TYPING_DURATION_SECONDS, fps);
  const displayFrames = secondsToFrames(MSG_DISPLAY_SECONDS, fps);
  const transitionFrames = secondsToFrames(MSG_TRANSITION_SECONDS, fps);
  const introFrames = secondsToFrames(MSG_INTRO_SECONDS, fps);
  
  const adjustedFrame = frame - introFrames;
  const messageTimePerMessage = typingDurationFrames + displayFrames + transitionFrames;

  // Find current message index
  const currentMessageIndex = Math.floor(adjustedFrame / messageTimePerMessage);
  const frameInCurrentMessage = adjustedFrame % messageTimePerMessage;

  if (currentMessageIndex < 0 || currentMessageIndex >= messages.length) {
    return null;
  }

  const currentMessage = messages[currentMessageIndex];
  const isTyping = frameInCurrentMessage < typingDurationFrames;
  const isFading = frameInCurrentMessage >= typingDurationFrames + displayFrames;

  // Calculate animation progress
  const animationDuration = Math.round(fps * 0.5); // 0.5 seconds
  const messageProgress = isTyping
    ? 0
    : interpolate(
        frameInCurrentMessage,
        [typingDurationFrames, typingDurationFrames + animationDuration],
        [0, 1],
        { extrapolateRight: "clamp" }
      );

  // Calculate fade out opacity
  const fadeOpacity = isFading
    ? interpolate(
        frameInCurrentMessage,
        [typingDurationFrames + displayFrames, typingDurationFrames + displayFrames + transitionFrames],
        [1, 0],
        { extrapolateRight: "clamp" }
      )
    : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "40px",
        opacity: fadeOpacity,
      }}
    >
      {isTyping ? (
        <TypingIndicator
          platformTheme={platformTheme}
          sender={currentMessage.sender}
          senderName={senderName}
          receiverName={receiverName}
        />
      ) : (
        <div style={{ width: "100%", maxWidth: 600 }}>
          <MessageRenderer
            message={currentMessage}
            senderName={senderName}
            senderAvatarUrl={senderAvatarUrl}
            senderHandle={senderHandle}
            receiverName={receiverName}
            receiverAvatarUrl={receiverAvatarUrl}
            receiverHandle={receiverHandle}
            platformTheme={platformTheme}
            animationProgress={messageProgress}
            messageIndex={currentMessageIndex}
            zoomLevel={zoomLevel}
          />
        </div>
      )}
    </div>
  );
};
