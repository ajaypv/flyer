import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_FRAMES,
  MSG_DISPLAY_FRAMES,
  MSG_TRANSITION_FRAMES,
  MSG_INTRO_FRAMES,
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
  const adjustedFrame = frame - MSG_INTRO_FRAMES;

  const messageTimePerMessage =
    MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES;

  // Find current message index
  const currentMessageIndex = Math.floor(adjustedFrame / messageTimePerMessage);
  const frameInCurrentMessage = adjustedFrame % messageTimePerMessage;

  if (currentMessageIndex < 0 || currentMessageIndex >= messages.length) {
    return null;
  }

  const currentMessage = messages[currentMessageIndex];
  const isTyping = frameInCurrentMessage < MSG_TYPING_DURATION_FRAMES;
  const isFading =
    frameInCurrentMessage >= MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES;

  // Calculate animation progress
  const messageProgress = isTyping
    ? 0
    : interpolate(
        frameInCurrentMessage,
        [MSG_TYPING_DURATION_FRAMES, MSG_TYPING_DURATION_FRAMES + 15],
        [0, 1],
        { extrapolateRight: "clamp" }
      );

  // Calculate fade out opacity
  const fadeOpacity = isFading
    ? interpolate(
        frameInCurrentMessage,
        [
          MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES,
          MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES,
        ],
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
