import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig, Easing } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_SECONDS,
  MSG_DISPLAY_SECONDS,
  MSG_INTRO_SECONDS,
  secondsToFrames,
} from "../../../../types/constants";
import { MessageRenderer } from "../MessageRenderer";
import { TypingIndicator } from "../TypingIndicator";
import { getScaleFactor } from "../themeConfig";

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
  const { width, height, fps } = useVideoConfig();
  
  // Convert seconds to frames based on actual FPS
  const typingDurationFrames = secondsToFrames(MSG_TYPING_DURATION_SECONDS, fps);
  const displayFrames = secondsToFrames(MSG_DISPLAY_SECONDS, fps);
  const introFrames = secondsToFrames(MSG_INTRO_SECONDS, fps);
  
  const adjustedFrame = frame - introFrames;
  const messageTimePerMessage = typingDurationFrames + displayFrames;

  // Calculate scale factor for responsive sizing
  const baseScale = getScaleFactor(width, height);
  const scale = baseScale * zoomLevel;

  // Calculate which messages should be visible
  const visibleMessages: { message: MessageType; progress: number; showTyping: boolean; index: number }[] = [];

  messages.forEach((message, index) => {
    const messageStartFrame = index * messageTimePerMessage;
    const typingEndFrame = messageStartFrame + typingDurationFrames;

    if (adjustedFrame >= messageStartFrame) {
      const isTyping = adjustedFrame < typingEndFrame;
      const messageProgress = isTyping
        ? 0
        : interpolate(
            adjustedFrame,
            [typingEndFrame, typingEndFrame + Math.round(fps * 0.5)], // 0.5 seconds for animation
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

  // Layout calculations for proper scrolling
  const estimatedMessageHeight = 100 * scale; // Increased for better spacing
  const headerHeight = platformTheme === "imessage" ? 160 * scale : 80 * scale;
  const topPadding = 30 * scale;
  const bottomPadding = 120 * scale; // Large bottom padding for visibility
  const messageGap = 12 * scale;
  
  // Calculate available viewport height (area where messages can be seen)
  const viewportHeight = height - headerHeight - topPadding - bottomPadding;
  
  // Calculate total content height
  const totalContentHeight = visibleMessages.length * (estimatedMessageHeight + messageGap);
  
  // Calculate how much we need to scroll to keep latest message visible
  // We want the newest message to appear in the bottom portion of the viewport
  const targetScrollOffset = Math.max(0, totalContentHeight - viewportHeight);
  
  // Smooth scroll animation using easing
  const lastMessageIndex = visibleMessages.length - 1;
  const lastMessageStartFrame = lastMessageIndex >= 0 ? lastMessageIndex * messageTimePerMessage : 0;
  
  // Animate scroll over the typing duration with smooth easing
  const scrollAnimationDuration = typingDurationFrames + Math.round(fps * 0.33); // Slightly longer for smoother feel
  const scrollProgress = lastMessageIndex >= 0 
    ? interpolate(
        adjustedFrame,
        [lastMessageStartFrame, lastMessageStartFrame + scrollAnimationDuration],
        [0, 1],
        { 
          extrapolateLeft: "clamp", 
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic) // Smooth deceleration
        }
      )
    : 0;
  
  // Calculate previous scroll offset for smooth transition
  const prevVisibleCount = Math.max(0, visibleMessages.length - 1);
  const prevContentHeight = prevVisibleCount * (estimatedMessageHeight + messageGap);
  const prevScrollOffset = Math.max(0, prevContentHeight - viewportHeight);
  
  // Interpolate between previous and target scroll position
  const scrollOffset = interpolate(
    scrollProgress,
    [0, 1],
    [prevScrollOffset, targetScrollOffset],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Messages container with scroll transform */}
      <div
        style={{
          transform: `translateY(-${scrollOffset}px)`,
          display: "flex",
          flexDirection: "column",
          gap: messageGap,
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingLeft: 16 * scale,
          paddingRight: 16 * scale,
        }}
      >
        {visibleMessages.map(({ message, progress, showTyping, index }) => (
          <div
            key={message.id}
            style={{
              opacity: interpolate(progress, [0, 0.3], [0.7, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(progress, [0, 1], [10 * scale, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
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
          </div>
        ))}
      </div>
      
      {/* Bottom gradient fade for visual polish */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 * scale,
          background: `linear-gradient(to top, ${
            platformTheme === "discord" ? "#313338" :
            platformTheme === "slack" ? "#1A1D21" :
            "#000000"
          } 0%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
