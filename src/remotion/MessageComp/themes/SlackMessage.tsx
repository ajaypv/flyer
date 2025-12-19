import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig } from "../themeConfig";

interface SlackMessageProps {
  message: MessageType;
  senderName: string;
  receiverName: string;
  animationProgress: number;
}

export const SlackMessage: React.FC<SlackMessageProps> = ({
  message,
  senderName,
  receiverName,
  animationProgress,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("slack", width, height);
  const scale = theme.scale;
  const name = message.sender === "sender" ? senderName : receiverName;

  // Slide from left animation
  const translateX = interpolate(animationProgress, [0, 1], [-20 * scale, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animationProgress, [0, 0.5, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  // Generate avatar color based on name
  const avatarColor = message.sender === "sender" ? "#36C5F0" : "#2EB67D";

  return (
    <div
      style={{
        display: "flex",
        gap: 16 * scale,
        padding: `${12 * scale}px ${24 * scale}px`,
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48 * scale,
          height: 48 * scale,
          borderRadius: 6 * scale,
          backgroundColor: avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 22 * scale,
            fontWeight: 700,
            fontFamily: theme.fontFamily,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Message content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 * scale }}>
          <span
            style={{
              color: theme.usernameColor,
              fontSize: 18 * scale,
              fontWeight: 700,
              fontFamily: theme.fontFamily,
            }}
          >
            {name}
          </span>
          <span
            style={{
              color: theme.timestampColor,
              fontSize: 14 * scale,
              fontFamily: theme.fontFamily,
            }}
          >
            {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
        <p
          style={{
            color: theme.senderTextColor,
            fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            margin: `${6 * scale}px 0 0 0`,
            lineHeight: 1.5,
          }}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};
