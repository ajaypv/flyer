import React, { useState } from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig } from "../themeConfig";

interface DiscordMessageProps {
  message: MessageType;
  senderName: string;
  senderAvatarUrl?: string;
  receiverName: string;
  receiverAvatarUrl?: string;
  animationProgress: number;
  zoomLevel?: number;
}

// Get initial from name for fallback avatar
const getInitial = (name: string): string => {
  if (!name || name.trim().length === 0) return "?";
  const trimmed = name.trim();
  const firstChar = trimmed.charAt(0);
  return firstChar ? firstChar.toUpperCase() : "?";
};

export const DiscordMessage: React.FC<DiscordMessageProps> = ({
  message,
  senderName,
  senderAvatarUrl,
  receiverName,
  receiverAvatarUrl,
  animationProgress,
  zoomLevel = 1.0,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("discord", width, height);
  const sizeScale = theme.scale * zoomLevel;
  const isSender = message.sender === "sender";
  const name = isSender ? senderName : receiverName;
  const avatarUrl = isSender ? senderAvatarUrl : receiverAvatarUrl;

  const [imageError, setImageError] = useState(false);

  // Fade + scale animation
  const animScale = interpolate(animationProgress, [0, 1], [0.95, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animationProgress, [0, 0.5, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  // Discord-style username colors
  const usernameColor = isSender ? "#f3b3ce" : "#7dd3fc";
  const avatarColor = isSender ? "#5865F2" : "#57F287";
  const showFallback = !avatarUrl || imageError;

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
      {/* Avatar - Discord uses circles */}
      <div
        style={{
          width: 52 * sizeScale,
          height: 52 * sizeScale,
          borderRadius: "50%",
          backgroundColor: showFallback ? avatarColor : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {showFallback ? (
          <span
            style={{
              color: "#fff",
              fontSize: 24 * sizeScale,
              fontWeight: 600,
              fontFamily: theme.fontFamily,
            }}
          >
            {getInitial(name)}
          </span>
        ) : (
          <img
            src={avatarUrl}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={() => setImageError(true)}
          />
        )}
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
