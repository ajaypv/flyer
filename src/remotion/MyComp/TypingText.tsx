import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { CHARS_PER_SECOND } from "../../../types/constants";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const TypingText: React.FC<{
  text: string;
  color?: string;
}> = ({ text, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Use consistent typing speed from constants
  const framesPerChar = fps / CHARS_PER_SECOND;

  // Calculate how many characters should be visible
  const visibleChars = Math.min(
    Math.floor(frame / framesPerChar),
    text.length
  );

  // Typing is complete when all characters are visible
  const typingComplete = visibleChars >= text.length;

  // Cursor blink: visible for 15 frames, hidden for 15 frames
  const cursorVisible =
    !typingComplete || Math.floor(frame / 15) % 2 === 0;

  // Hide cursor completely after typing is done + 60 frames
  const framesAfterComplete = frame - text.length * framesPerChar;
  const showCursor = !typingComplete || framesAfterComplete < 60;

  const visibleText = text.slice(0, visibleChars);

  const cursorStyle: React.CSSProperties = useMemo(
    () => ({
      display: showCursor && cursorVisible ? "inline-block" : "none",
      width: "4px",
      height: "1em",
      backgroundColor: color,
      marginLeft: "2px",
      verticalAlign: "text-bottom",
      animation: "none",
    }),
    [showCursor, cursorVisible, color]
  );

  return (
    <AbsoluteFill className="justify-center items-center px-8">
      <h1
        className="text-[48px] md:text-[60px] font-bold text-center max-w-[90%] leading-tight"
        style={{
          fontFamily,
          color,
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {visibleText}
        <span style={cursorStyle} />
      </h1>
    </AbsoluteFill>
  );
};
