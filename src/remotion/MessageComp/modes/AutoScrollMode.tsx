import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_FRAMES,
  MSG_DISPLAY_FRAMES,
  MSG_INTRO_FRAMES,
} from "../../../../types/constants";
import { MessageRenderer } from "../MessageRenderer";
import { TypingIndicator } from "../TypingIndicator";

interface AutoScrollModeProps {
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

export const AutoScrollMode: React.FC<AutoScrollModeProps> = ({
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

  const messageTimePerMessage = MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES;

  // Calculate which messages should be visible
  const visibleMessages: { message: MessageType; progress: number; showTyping: boolean; index: number }[] = [];

  messages.forEach((message, index) => {
    const messageStartFrame = index * messageTimePerMessage;
    const typingEndFrame = messageStartFrame + MSG_TYPING_DURATION_FRAMES;

    if (adjustedFrame >= messageStartFrame) {
      const isTyping = adjustedFrame < typingEndFrame;
      const messageProgress = isTyping
        ? 0
        : interpolate(
            adjustedFrame,
            [typingEndFrame, typingEndFrame + 15],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

      visibleMessages.push({
        message,
        progress: messageProgress,
        showTyping: isTyping,
        index,
      });
    }
  });

  // Calculate scroll offset based on number of visible messages
  const totalVisibleHeight = visibleMessages.length * 60; // Approximate height per message
  const containerHeight = 500;
  const scrollOffset = Math.max(0, totalVisibleHeight - containerHeight + 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          transform: `translateY(-${scrollOffset}px)`,
          transition: "transform 0.3s ease-out",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {visibleMessages.map(({ message, progress, showTyping, index }) => (
          <React.Fragment key={message.id}>
            {showTyping ? (
              <TypingIndicator
                platformTheme={platformTheme}
                sender={message.sender}
                senderName={senderName}
                receiverName={receiverName}
              />
            ) : (
              <MessageRenderer
                message={message}
                senderName={senderName}
                senderAvatarUrl={senderAvatarUrl}
                senderHandle={senderHandle}
                receiverName={receiverName}
                receiverAvatarUrl={receiverAvatarUrl}
                receiverHandle={receiverHandle}
                platformTheme={platformTheme}
                animationProgress={progress}
                messageIndex={index}
                zoomLevel={zoomLevel}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
