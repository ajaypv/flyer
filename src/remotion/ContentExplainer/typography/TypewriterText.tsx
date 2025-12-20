import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface TypewriterTextProps {
    text: string;
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    startDelay?: number;
    speed?: number; // characters per frame
    showCursor?: boolean;
    cursorColor?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    color = "#ffffff",
    fontSize = 24,
    fontWeight = 400,
    startDelay = 0,
    speed = 0.8,
    showCursor = true,
    cursorColor,
}) => {
    const frame = useCurrentFrame();
    const adjustedFrame = Math.max(0, frame - startDelay);

    // Calculate how many characters to show
    const charactersToShow = Math.floor(adjustedFrame * speed);
    const displayedText = text.slice(0, charactersToShow);

    // Cursor blink effect
    const cursorVisible = Math.floor(frame / 15) % 2 === 0;
    const isTyping = charactersToShow < text.length;

    // Cursor opacity
    const cursorOpacity = interpolate(
        frame,
        [startDelay, startDelay + 5],
        [0, 1],
        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );

    return (
        <span
            style={{
                fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                fontSize,
                fontWeight,
                color,
                whiteSpace: "pre-wrap",
                display: "inline",
            }}
        >
            {displayedText}
            {showCursor && (
                <span
                    style={{
                        color: cursorColor || color,
                        opacity: cursorOpacity * (isTyping || cursorVisible ? 1 : 0),
                        fontWeight: 100,
                        marginLeft: 2,
                    }}
                >
                    |
                </span>
            )}
        </span>
    );
};

// Multi-line typewriter that types line by line
export interface TypewriterBlockProps {
    lines: string[];
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    lineDelay?: number; // frames between lines
    speed?: number;
}

export const TypewriterBlock: React.FC<TypewriterBlockProps> = ({
    lines,
    color = "#ffffff",
    fontSize = 20,
    fontWeight = 400,
    lineDelay = 30,
    speed = 0.6,
}) => {
    const frame = useCurrentFrame();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
            }}
        >
            {lines.map((line, index) => {
                const lineStartFrame = index * lineDelay;
                const lineProgress = Math.max(0, frame - lineStartFrame);
                const charsToShow = Math.floor(lineProgress * speed);
                const displayedLine = line.slice(0, charsToShow);
                const isCurrentLine = charsToShow < line.length && charsToShow > 0;
                const cursorVisible = Math.floor(frame / 15) % 2 === 0;

                // Line opacity
                const opacity = interpolate(
                    frame,
                    [lineStartFrame, lineStartFrame + 5],
                    [0, 1],
                    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                );

                if (frame < lineStartFrame) return null;

                return (
                    <div
                        key={index}
                        style={{
                            fontSize,
                            fontWeight,
                            color,
                            opacity,
                        }}
                    >
                        <span style={{ color: "#888888" }}>{">"} </span>
                        {displayedLine}
                        {isCurrentLine && cursorVisible && (
                            <span style={{ opacity: 0.8 }}>|</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
