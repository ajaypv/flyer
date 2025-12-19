import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig } from "../themeConfig";

interface DiscordMessageProps {
  message: MessageType;
  senderName: string;
  receiverName: string;
  animationProgress: number;
}

export const DiscordMessage: React.FC<DiscordMessageProps> = ({
  message,
  senderName,
  receiverName,
  animationProgress,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("discord", width, height);
  const sizeScale = theme.scale;
  const name = message.sender === "sender" ? senderName : receiverName;

  // Fade + scale animation
  const animScale = interpolate(animationProgress, [0, 1], [0.95, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animationProgress, [0, 0.5, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  // Discord-style username colors
  const usernameColor = message.sender === "sender" ? "#f3b3ce" : "#7dd3fc";
  const avatarColor = message.sender === "sender" ? "#5865F2" : "#57F287";

  return (
    <div
      style={{
        display: "flex",
        gap: 20 * sizeScale,
        padding: `${8 * sizeScale}px ${24 * sizeScale}px`,
        transform: `scale(${animScale})`,
        opacity,
        transformOrigin: "left center",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 52 * sizeScale,
          height: 52 * sizeScale,
          borderRadius: "50%",
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
            fontSize: 24 * sizeScale,
            fontWeight: 600,
            fontFamily: theme.fontFamily,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Message content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 * sizeScale }}>
          <span
            style={{
              color: usernameColor,
              fontSize: 20 * sizeScale,
              fontWeight: 500,
              fontFamily: theme.fontFamily,
            }}
          >
            {name}
          </span>
          <span
            style={{
              color: theme.timestampColor,
              fontSize: 14 * sizeScale,
              fontFamily: theme.fontFamily,
            }}
          >
            Today at {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
        <p
          style={{
            color: theme.senderTextColor,
            fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            margin: `${6 * sizeScale}px 0 0 0`,
            lineHeight: 1.45,
          }}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};
