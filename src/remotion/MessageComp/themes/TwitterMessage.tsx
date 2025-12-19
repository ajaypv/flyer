import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { MessageType } from "../../../../types/constants";
import { getResponsiveThemeConfig, getScaleFactor } from "../themeConfig";

interface TwitterMessageProps {
  message: MessageType;
  senderName: string;
  senderHandle: string;
  senderAvatarUrl?: string;
  receiverName: string;
  receiverHandle: string;
  receiverAvatarUrl?: string;
  animationProgress: number;
  isReply?: boolean;
  messageIndex: number;
  zoomLevel?: number;
}

// Get initial from name for fallback avatar
const getInitial = (name: string): string => {
  if (!name || name.trim().length === 0) return "?";
  const trimmed = name.trim();
  const firstChar = trimmed.charAt(0);
  return firstChar ? firstChar.toUpperCase() : "?";
};

export const TwitterMessage: React.FC<TwitterMessageProps> = ({
  message,
  senderName,
  senderHandle,
  senderAvatarUrl,
  receiverName,
  receiverHandle,
  receiverAvatarUrl,
  animationProgress,
  isReply = false,
  messageIndex,
  zoomLevel = 1.0,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig("twitter", width, height);
  const isSender = message.sender === "sender";
  const baseScale = getScaleFactor(width, height);
  
  // Use a more moderate scale for Twitter to prevent text overflow
  // Portrait needs less aggressive scaling for the header
  const isPortrait = height > width;
  const scale = (isPortrait ? 1.6 : baseScale) * zoomLevel;
  const headerScale = (isPortrait ? 1.4 : baseScale) * zoomLevel; // Smaller scale for header text

  const displayName = isSender ? senderName : receiverName;
  const handle = isSender ? senderHandle : receiverHandle;
  const avatarUrl = isSender ? senderAvatarUrl : receiverAvatarUrl;

  // Fade-in animation
  const opacity = interpolate(animationProgress, [0, 0.3, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(animationProgress, [0, 1], [10 * scale, 0], {
    extrapolateRight: "clamp",
  });

  // Generate relative timestamp
  const getTimestamp = () => {
    const times = ["2h", "1h", "45m", "30m", "15m", "5m", "2m", "1m"];
    return times[messageIndex % times.length];
  };

  // Random engagement numbers for realism
  const getEngagement = () => {
    const base = (messageIndex + 1) * 7;
    return {
      replies: base + Math.floor(base * 0.3),
      retweets: base * 2 + Math.floor(base * 0.5),
      likes: base * 5 + Math.floor(base * 1.2),
      views: `${(base * 10 + Math.floor(base * 2.5)).toLocaleString()}`,
    };
  };

  const engagement = getEngagement();
  
  // Base sizes
  const avatarSize = 40 * scale;
  const baseFontSize = 15;
  const headerFontSize = baseFontSize * headerScale;
  const contentFontSize = baseFontSize * scale;
  const iconSize = 16 * scale;
  const engagementFontSize = 12 * scale;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: `${14 * scale}px ${16 * scale}px`,
        borderBottom: isReply ? "none" : `1px solid ${theme.borderColor}`,
        position: "relative",
      }}
    >
      {/* Thread connecting line */}
      {isReply && (
        <div
          style={{
            position: "absolute",
            left: 16 * scale + avatarSize / 2,
            top: 0,
            width: 2 * scale,
            height: 14 * scale,
            backgroundColor: theme.borderColor,
          }}
        />
      )}

      <div style={{ display: "flex", gap: 10 * scale }}>
        {/* Avatar */}
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "50%",
            backgroundColor: "#333639",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span
              style={{
                color: "#fff",
                fontSize: 18 * scale,
                fontWeight: 600,
              }}
            >
              {getInitial(displayName)}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          {/* Header: Name + Handle + Timestamp on same line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4 * headerScale,
              marginBottom: 4 * scale,
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            {/* Name */}
            <span
              style={{
                color: theme.usernameColor,
                fontSize: headerFontSize,
                fontWeight: 700,
                fontFamily: theme.fontFamily,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: isPortrait ? "35%" : "auto",
                flexShrink: isPortrait ? 1 : 0,
              }}
            >
              {displayName}
            </span>
            
            {/* Verified badge */}
            {(displayName.includes("Musk") || displayName.includes("Gates") || displayName.includes("Bezos") || displayName.includes("Zuckerberg")) && (
              <svg
                viewBox="0 0 22 22"
                style={{
                  width: 16 * headerScale,
                  height: 16 * headerScale,
                  fill: "#1D9BF0",
                  flexShrink: 0,
                }}
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            )}
            
            {/* Handle */}
            <span
              style={{
                color: theme.handleColor,
                fontSize: headerFontSize,
                fontFamily: theme.fontFamily,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
              }}
            >
              {handle}
            </span>
            
            {/* Dot separator */}
            <span
              style={{
                color: theme.handleColor,
                fontSize: headerFontSize,
                fontFamily: theme.fontFamily,
                flexShrink: 0,
              }}
            >
              ·
            </span>
            
            {/* Timestamp */}
            <span
              style={{
                color: theme.handleColor,
                fontSize: headerFontSize,
                fontFamily: theme.fontFamily,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {getTimestamp()}
            </span>
          </div>

          {/* Tweet content */}
          <p
            style={{
              color: theme.senderTextColor,
              fontSize: contentFontSize,
              fontFamily: theme.fontFamily,
              margin: 0,
              lineHeight: 1.35,
              marginBottom: 12 * scale,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.text}
          </p>

          {/* Action bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "100%",
              paddingRight: 20 * scale,
            }}
          >
            {/* Reply */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * scale,
                color: theme.handleColor,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: iconSize,
                  height: iconSize,
                  fill: "currentColor",
                }}
              >
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
              </svg>
              <span style={{ fontSize: engagementFontSize }}>{engagement.replies}</span>
            </div>

            {/* Retweet */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * scale,
                color: theme.handleColor,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: iconSize,
                  height: iconSize,
                  fill: "currentColor",
                }}
              >
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
              </svg>
              <span style={{ fontSize: engagementFontSize }}>{engagement.retweets}</span>
            </div>

            {/* Like */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * scale,
                color: theme.handleColor,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: iconSize,
                  height: iconSize,
                  fill: "currentColor",
                }}
              >
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
              </svg>
              <span style={{ fontSize: engagementFontSize }}>{engagement.likes}</span>
            </div>

            {/* Views */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4 * scale,
                color: theme.handleColor,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: iconSize,
                  height: iconSize,
                  fill: "currentColor",
                }}
              >
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
              </svg>
              <span style={{ fontSize: engagementFontSize }}>{engagement.views}</span>
            </div>

            {/* Share */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: theme.handleColor,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: iconSize,
                  height: iconSize,
                  fill: "currentColor",
                }}
              >
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
