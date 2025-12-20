import React, { useMemo } from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
    subsets: ["latin"],
    weights: ["400", "500", "600"],
});

export interface RevealTextProps {
    text: string;
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    textAlign?: "left" | "center" | "right";
    animation?: "line-by-line" | "fade" | "slide-up" | "blur-in";
    staggerDelay?: number;
    maxWidth?: string;
}

export const RevealText: React.FC<RevealTextProps> = ({
    text,
    color = "#ffffff",
    fontSize = 24,
    fontWeight = 400,
    lineHeight = 1.6,
    textAlign = "center",
    animation = "line-by-line",
    staggerDelay = 8,
    maxWidth = "85%",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Split text into lines (by newline or at word boundaries for long text)
    const lines = useMemo(() => {
        if (text.includes("\n")) {
            return text.split("\n");
        }
        // For single-line text, treat as one line
        return [text];
    }, [text]);

    const renderLine = (line: string, index: number) => {
        const delay = index * staggerDelay;

        // Different animations based on type
        let opacity = 1;
        let translateY = 0;
        let blur = 0;

        if (animation === "fade" || animation === "line-by-line") {
            const springValue = spring({
                fps,
                frame: frame - delay,
                config: {
                    damping: 20,
                    stiffness: 80,
                    mass: 0.8,
                },
                durationInFrames: 25,
            });
            opacity = interpolate(springValue, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
            });
            translateY = interpolate(springValue, [0, 1], [15, 0], {
                extrapolateRight: "clamp",
            });
        } else if (animation === "slide-up") {
            const progress = interpolate(frame - delay, [0, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
            opacity = progress;
            translateY = interpolate(progress, [0, 1], [40, 0]);
        } else if (animation === "blur-in") {
            const progress = interpolate(frame - delay, [0, 25], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
            opacity = progress;
            blur = interpolate(progress, [0, 1], [10, 0]);
        }

        return (
            <div
                key={index}
                style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                    marginBottom: index < lines.length - 1 ? "0.5em" : 0,
                }}
            >
                {line}
            </div>
        );
    };

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems:
                    textAlign === "center"
                        ? "center"
                        : textAlign === "left"
                            ? "flex-start"
                            : "flex-end",
                padding: "5%",
            }}
        >
            <div
                style={{
                    fontFamily,
                    fontSize,
                    fontWeight,
                    lineHeight,
                    color,
                    textAlign,
                    maxWidth,
                    wordWrap: "break-word",
                }}
            >
                {lines.map((line, index) => renderLine(line, index))}
            </div>
        </AbsoluteFill>
    );
};
