import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { PlatformThemeType } from "../../../types/constants";
import { getResponsiveThemeConfig } from "./themeConfig";

interface TypingIndicatorProps {
  platformTheme: PlatformThemeType;
  sender: "sender" | "receiver";
  senderName: string;
  receiverName: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  platformTheme,
  sender,
  senderName,
  receiverName,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = getResponsiveThemeConfig(platformTheme, width, height);
  const scale = theme.scale;
  const name = sender === "sender" ? senderName : receiverName;

  // Bouncing dots animation - scale the bounce amount
  const bounceAmount = 4 * scale;
  const dot1Y = interpolate(Math.sin(frame * 0.3), [-1, 1], [-bounceAmount, bounceAmount]);
  const dot2Y = interpolate(Math.sin(frame * 0.3 + 1), [-1, 1], [-bounceAmount, bounceAmount]);
  const dot3Y = interpolate(Math.sin(frame * 0.3 + 2), [-1, 1], [-bounceAmount, bounceAmount]);

  const opacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  if (platformTheme === "imessage") {
    // iMessage style: gray bubble with three dots
    return (
      <div
        style={{
          display: "flex",
          justifyContent: sender === "sender" ? "flex-end" : "flex-start",
          padding: `${8 * scale}px ${24 * scale}px`,
          opacity,
        }}
      >
        <div
          style={{
            backgroundColor: theme.receiverBubbleColor,
            borderRadius: 28 * scale,
            padding: `${16 * scale}px ${22 * scale}px`,
            display: "flex",
            gap: 6 * scale,
            alignItems: "center",
          }}
        >
          {[dot1Y, dot2Y, dot3Y].map((y, i) => (
            <div
              key={i}
              style={{
                width: 12 * scale,
                height: 12 * scale,
                borderRadius: "50%",
                backgroundColor: theme.typingIndicatorColor,
                transform: `translateY(${y}px)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (platformTheme === "discord") {
    // Discord style: "[name] is typing..." with animated dots
    return (
      <div
        style={{
          padding: `${12 * scale}px ${90 * scale}px`,
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 6 * scale,
        }}
      >
        <span
          style={{
            color: theme.typingIndicatorColor,
            fontSize: 16 * scale,
            fontFamily: theme.fontFamily,
          }}
        >
          <strong style={{ color: theme.usernameColor }}>{name}</strong> is typing
        </span>
        <div style={{ display: "flex", gap: 3 * scale, marginLeft: 4 * scale }}>
          {[dot1Y, dot2Y, dot3Y].map((y, i) => (
            <div
              key={i}
              style={{
                width: 6 * scale,
                height: 6 * scale,
                borderRadius: "50%",
                backgroundColor: theme.typingIndicatorColor,
                transform: `translateY(${y * 0.5}px)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Slack style: "[name] is typing..."
  return (
    <div
      style={{
        padding: `${8 * scale}px ${24 * scale}px ${8 * scale}px ${90 * scale}px`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 6 * scale,
      }}
    >
      <span
        style={{
          color: theme.typingIndicatorColor,
          fontSize: 16 * scale,
          fontFamily: theme.fontFamily,
          fontStyle: "italic",
        }}
      >
        {name} is typing
      </span>
      <div style={{ display: "flex", gap: 3 * scale }}>
        {[dot1Y, dot2Y, dot3Y].map((y, i) => (
          <div
            key={i}
            style={{
              width: 6 * scale,
              height: 6 * scale,
              borderRadius: "50%",
              backgroundColor: theme.typingIndicatorColor,
              transform: `translateY(${y * 0.5}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
