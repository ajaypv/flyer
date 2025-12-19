import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  MessageType,
  PlatformThemeType,
  MSG_TYPING_DURATION_FRAMES,
  MSG_DISPLAY_FRAMES,
  MSG_TRANSITION_FRAMES,
  MSG_INTRO_FRAMES,
} from "../../../../types/constants";
import { MessageRenderer } from "../MessageRenderer";
import { TypingIndicator } from "../TypingIndicator";

interface PairedModeProps {
  messages: MessageType[];
  senderName: string;
  receiverName: string;
  platformTheme: PlatformThemeType;
}

export const PairedMode: React.FC<PairedModeProps> = ({
  messages,
  senderName,
  receiverName,
  platformTheme,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - MSG_INTRO_FRAMES;

  // Group messages into pairs
  const pairs: MessageType[][] = [];
  for (let i = 0; i < messages.length; i += 2) {
    pairs.push(messages.slice(i, i + 2));
  }

  // Time per pair: typing1 + typing2 + display + transition
  const timePerPair =
    2 * MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES;

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

  const firstTypingEnd = MSG_TYPING_DURATION_FRAMES;
  const secondTypingEnd = 2 * MSG_TYPING_DURATION_FRAMES;
  const displayEnd = secondTypingEnd + MSG_DISPLAY_FRAMES;

  const isFirstTyping = frameInCurrentPair < firstTypingEnd;
  const isSecondTyping =
    secondMessage && frameInCurrentPair >= firstTypingEnd && frameInCurrentPair < secondTypingEnd;
  const isDisplaying = frameInCurrentPair >= secondTypingEnd && frameInCurrentPair < displayEnd;
  const isFading = frameInCurrentPair >= displayEnd;

  // Calculate animation progress for messages
  const firstMessageProgress =
    frameInCurrentPair >= firstTypingEnd
      ? interpolate(
          frameInCurrentPair,
          [firstTypingEnd, firstTypingEnd + 15],
          [0, 1],
          { extrapolateRight: "clamp" }
        )
      : 0;

  const secondMessageProgress =
    secondMessage && frameInCurrentPair >= secondTypingEnd
      ? interpolate(
          frameInCurrentPair,
          [secondTypingEnd, secondTypingEnd + 15],
          [0, 1],
          { extrapolateRight: "clamp" }
        )
      : 0;

  // Fade out opacity
  const fadeOpacity = isFading
    ? interpolate(
        frameInCurrentPair,
        [displayEnd, displayEnd + MSG_TRANSITION_FRAMES],
        [1, 0],
        { extrapolateRight: "clamp" }
      )
    : 1;

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
            receiverName={receiverName}
            platformTheme={platformTheme}
            animationProgress={firstMessageProgress}
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
                receiverName={receiverName}
                platformTheme={platformTheme}
                animationProgress={secondMessageProgress}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
