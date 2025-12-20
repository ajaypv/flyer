import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_SECONDS,
  MSG_DISPLAY_SECONDS,
  MSG_TRANSITION_SECONDS,
  MSG_INTRO_SECONDS,
  secondsToFrames,
} from "../../../../types/constants";
import { MessageRenderer } from "../MessageRenderer";
import { TypingIndicator } from "../TypingIndicator";

interface PairedModeProps {
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

export const PairedMode: React.FC<PairedModeProps> = ({
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
  const { fps } = useVideoConfig();
  
  // Convert seconds to frames based on actual FPS
  const typingDurationFrames = secondsToFrames(MSG_TYPING_DURATION_SECONDS, fps);
  const displayFrames = secondsToFrames(MSG_DISPLAY_SECONDS, fps);
  const transitionFrames = secondsToFrames(MSG_TRANSITION_SECONDS, fps);
  const introFrames = secondsToFrames(MSG_INTRO_SECONDS, fps);
  
  const adjustedFrame = frame - introFrames;

  // Group messages into pairs
  const pairs: MessageType[][] = [];
  for (let i = 0; i < messages.length; i += 2) {
    pairs.push(messages.slice(i, i + 2));
  }

  // Time per pair: typing1 + typing2 + display + transition
  const timePerPair = 2 * typingDurationFrames + displayFrames + transitionFrames;

  // Find current pair index
  const currentPairIndex = Math.floor(adjustedFrame / timePerPair);
  const frameInCurrentPair = adjustedFrame % timePerPair;

  if (currentPairIndex < 0 || currentPairIndex >= pairs.length) {
    return null;
  }

  const currentPair = pairs[currentPairIndex];
  const [firstMessage, secondMessage] = currentPair;

  // Timeline within pair:
  // 0 - TYPING_DURATION: First message typing
  // TYPING_DURATION - 2*TYPING_DURATION: Second message typing (if exists)
  // 2*TYPING_DURATION - 2*TYPING_DURATION + DISPLAY: Both messages displayed
  // After: Fade out

  const firstTypingEnd = typingDurationFrames;
  const secondTypingEnd = 2 * typingDurationFrames;
  const displayEnd = secondTypingEnd + displayFrames;

  const isFirstTyping = frameInCurrentPair < firstTypingEnd;
  const isSecondTyping =
    secondMessage && frameInCurrentPair >= firstTypingEnd && frameInCurrentPair < secondTypingEnd;
  const isFading = frameInCurrentPair >= displayEnd;

  // Animation duration (0.5 seconds)
  const animationDuration = Math.round(fps * 0.5);

  // Calculate animation progress for messages
  const firstMessageProgress =
    frameInCurrentPair >= firstTypingEnd
      ? interpolate(
          frameInCurrentPair,
          [firstTypingEnd, firstTypingEnd + animationDuration],
          [0, 1],
          { extrapolateRight: "clamp" }
        )
      : 0;

  const secondMessageProgress =
    secondMessage && frameInCurrentPair >= secondTypingEnd
      ? interpolate(
          frameInCurrentPair,
          [secondTypingEnd, secondTypingEnd + animationDuration],
          [0, 1],
          { extrapolateRight: "clamp" }
        )
      : 0;

  // Fade out opacity
  const fadeOpacity = isFading
    ? interpolate(
        frameInCurrentPair,
        [displayEnd, displayEnd + transitionFrames],
        [1, 0],
        { extrapolateRight: "clamp" }
      )
    : 1;

  // Calculate message indices for the current pair
  const firstMessageIndex = currentPairIndex * 2;
  const secondMessageIndex = currentPairIndex * 2 + 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "40px",
        gap: 16,
        opacity: fadeOpacity,
      }}
    >
      {/* First message */}
      {isFirstTyping ? (
        <TypingIndicator
          platformTheme={platformTheme}
          sender={firstMessage.sender}
          senderName={senderName}
          receiverName={receiverName}
        />
      ) : (
        <div style={{ width: "100%", maxWidth: 600 }}>
          <MessageRenderer
            message={firstMessage}
            senderName={senderName}
            senderAvatarUrl={senderAvatarUrl}
            senderHandle={senderHandle}
            receiverName={receiverName}
            receiverAvatarUrl={receiverAvatarUrl}
            receiverHandle={receiverHandle}
            platformTheme={platformTheme}
            animationProgress={firstMessageProgress}
            messageIndex={firstMessageIndex}
            zoomLevel={zoomLevel}
          />
        </div>
      )}

      {/* Second message (if exists) */}
      {secondMessage && (
        <>
          {isSecondTyping ? (
            <TypingIndicator
              platformTheme={platformTheme}
              sender={secondMessage.sender}
              senderName={senderName}
              receiverName={receiverName}
            />
          ) : frameInCurrentPair >= secondTypingEnd ? (
            <div style={{ width: "100%", maxWidth: 600 }}>
              <MessageRenderer
                message={secondMessage}
                senderName={senderName}
                senderAvatarUrl={senderAvatarUrl}
                senderHandle={senderHandle}
                receiverName={receiverName}
                receiverAvatarUrl={receiverAvatarUrl}
                receiverHandle={receiverHandle}
                platformTheme={platformTheme}
                animationProgress={secondMessageProgress}
                messageIndex={secondMessageIndex}
                isReply={true}
                zoomLevel={zoomLevel}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
