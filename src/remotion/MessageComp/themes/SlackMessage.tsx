import React, { useState } from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig } from "../themeConfig";

interface SlackMessageProps {
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

export const SlackMessage: React.FC<SlackMessageProps> = ({
  message,
  senderName,
  senderAvatarUrl,
  receiverName,
  receiverAvatarUrl,
  animationProgress,
  zoomLevel = 1.0,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("slack", width, height);
  const scale = theme.scale * zoomLevel;
  const isSender = message.sender === "sender";
  const name = isSender ? senderName : receiverName;
  const avatarUrl = isSender ? senderAvatarUrl : receiverAvatarUrl;

  const [imageError, setImageError] = useState(false);

  // Slide from left animation
  const translateX = interpolate(animationProgress, [0, 1], [-20 * scale, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(animationProgress, [0, 0.5, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });

  // Generate avatar color based on sender
  const avatarColor = isSender ? "#36C5F0" : "#2EB67D";
  const showFallback = !avatarUrl || imageError;

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
      {/* Avatar - Slack uses rounded squares */}
      <div
        style={{
          width: 48 * scale,
          height: 48 * scale,
          borderRadius: 6 * scale,
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
              fontSize: 22 * scale,
              fontWeight: 700,
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
              borderRadius: 6 * scale,
            }}
            onError={() => setImageError(true)}
          />
        )}
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
