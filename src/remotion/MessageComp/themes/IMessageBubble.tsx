import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig } from "../themeConfig";

interface IMessageBubbleProps {
  message: MessageType;
  senderName: string;
  receiverName: string;
  animationProgress: number;
}

export const IMessageBubble: React.FC<IMessageBubbleProps> = ({
  message,
  senderName,
  receiverName,
  animationProgress,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("imessage", width, height);
  const isSender = message.sender === "sender";
  const scale = theme.scale;

  // Slide up animation with iOS-style easing
  const translateY = interpolate(animationProgress, [0, 1], [20 * scale, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animationProgress, [0, 0.3, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });
  const animScale = interpolate(animationProgress, [0, 1], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSender ? "flex-end" : "flex-start",
        padding: `${8 * scale}px ${24 * scale}px`,
        transform: `translateY(${translateY}px) scale(${animScale})`,
        opacity,
        transformOrigin: isSender ? "right bottom" : "left bottom",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          backgroundColor: isSender ? theme.senderBubbleColor : theme.receiverBubbleColor,
          borderRadius: 28 * scale,
          padding: `${14 * scale}px ${22 * scale}px`,
          // iOS-style bubble tail effect
          borderBottomRightRadius: isSender ? 6 * scale : 28 * scale,
          borderBottomLeftRadius: isSender ? 28 * scale : 6 * scale,
        }}
      >
        <p
          style={{
            color: isSender ? theme.senderTextColor : theme.receiverTextColor,
            fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            margin: 0,
            lineHeight: 1.4,
            letterSpacing: -0.4,
            fontWeight: 400,
          }}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};
