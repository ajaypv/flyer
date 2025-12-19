import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  DisplayModeType,
  MSG_TYPING_DURATION_FRAMES,
  MSG_DISPLAY_FRAMES,
  MSG_TRANSITION_FRAMES,
  MSG_INTRO_FRAMES,
} from "../../../types/constants";
import { getThemeConfig, getScaleFactor } from "./themeConfig";
import { AutoScrollMode } from "./modes/AutoScrollMode";
import { OneAtATimeMode } from "./modes/OneAtATimeMode";
import { PairedMode } from "./modes/PairedMode";

interface MessageConversationProps {
  senderName: string;
  receiverName: string;
  messages: MessageType[];
  platformTheme: PlatformThemeType;
  displayMode: DisplayModeType;
}

export const MessageConversation: React.FC<MessageConversationProps> = ({
  senderName,
  receiverName,
  messages,
  platformTheme,
  displayMode,
}) => {
  const { width, height } = useVideoConfig();
  const theme = getThemeConfig(platformTheme);
  const scale = getScaleFactor(width, height);

  // Calculate sound timing based on display mode
  const getSoundSequences = () => {
    const sequences: { typingStart: number; messageStart: number }[] = [];

    if (displayMode === "auto-scroll") {
      const timePerMessage = MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES;
      messages.forEach((_, index) => {
        sequences.push({
          typingStart: MSG_INTRO_FRAMES + index * timePerMessage,
          messageStart: MSG_INTRO_FRAMES + index * timePerMessage + MSG_TYPING_DURATION_FRAMES,
        });
      });
    } else if (displayMode === "one-at-a-time") {
      const timePerMessage = MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES;
      messages.forEach((_, index) => {
        sequences.push({
          typingStart: MSG_INTRO_FRAMES + index * timePerMessage,
          messageStart: MSG_INTRO_FRAMES + index * timePerMessage + MSG_TYPING_DURATION_FRAMES,
        });
      });
    } else if (displayMode === "paired") {
      const timePerPair = 2 * MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES;
      const pairCount = Math.ceil(messages.length / 2);
      for (let i = 0; i < pairCount; i++) {
        const pairStart = MSG_INTRO_FRAMES + i * timePerPair;
        // First message in pair
        sequences.push({
          typingStart: pairStart,
          messageStart: pairStart + MSG_TYPING_DURATION_FRAMES,
        });
        // Second message in pair (if exists)
        if (i * 2 + 1 < messages.length) {
          sequences.push({
            typingStart: pairStart + MSG_TYPING_DURATION_FRAMES,
            messageStart: pairStart + 2 * MSG_TYPING_DURATION_FRAMES,
          });
        }
      }
    }

    return sequences;
  };

  const soundSequences = getSoundSequences();

  const renderDisplayMode = () => {
    const commonProps = {
      messages,
      senderName: senderName || "Sender",
      receiverName: receiverName || "Receiver",
      platformTheme,
    };

    switch (displayMode) {
      case "auto-scroll":
        return <AutoScrollMode {...commonProps} />;
      case "one-at-a-time":
        return <OneAtATimeMode {...commonProps} />;
      case "paired":
        return <PairedMode {...commonProps} />;
      default:
        return <AutoScrollMode {...commonProps} />;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Sound effects */}
      {soundSequences.map((seq, index) => (
        <React.Fragment key={index}>
          {/* Typing sound - plays during typing indicator */}
          <Sequence from={seq.typingStart} durationInFrames={MSG_TYPING_DURATION_FRAMES}>
            <Audio
              src={staticFile("sound/keyboard-typing-sound-effect-335503.mp3")}
              volume={0.3}
            />
          </Sequence>
          {/* Message sent sound - plays when message appears */}
          <Sequence from={seq.messageStart} durationInFrames={30}>
            <Audio
              src={staticFile("sound/message-envoye-iphone-apple-391098.mp3")}
              volume={0.5}
            />
          </Sequence>
        </React.Fragment>
      ))}

      {/* Platform header (optional visual element) */}
      {platformTheme === "slack" && (
        <div
          style={{
            padding: `${16 * scale}px ${24 * scale}px`,
            borderBottom: `${scale}px solid #3c3f44`,
            display: "flex",
            alignItems: "center",
            gap: 10 * scale,
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 * scale }}>
            # conversation
          </span>
        </div>
      )}

      {platformTheme === "discord" && (
        <div
          style={{
            padding: `${16 * scale}px ${24 * scale}px`,
            borderBottom: `${scale}px solid #3f4147`,
            display: "flex",
            alignItems: "center",
            gap: 10 * scale,
          }}
        >
          <span style={{ color: "#949ba4", fontSize: 26 * scale }}>#</span>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 20 * scale }}>
            general
          </span>
        </div>
      )}

      {platformTheme === "imessage" && (
        <div
          style={{
            padding: `${24 * scale}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6 * scale,
          }}
        >
          <div
            style={{
              width: 80 * scale,
              height: 80 * scale,
              borderRadius: "50%",
              backgroundColor: "#3C3C3E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 32 * scale, fontWeight: 500 }}>
              {(receiverName || "R").charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ color: "#fff", fontSize: 22 * scale, fontWeight: 600 }}>
            {receiverName || "Receiver"}
          </span>
          <span style={{ color: "#8E8E93", fontSize: 16 * scale }}>iMessage</span>
        </div>
      )}

      {/* Messages area */}
      <div style={{ flex: 1, overflow: "hidden" }}>{renderDisplayMode()}</div>
    </AbsoluteFill>
  );
};
