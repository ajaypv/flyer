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
    weights: ["400", "500", "600", "700", "800"],
});

export interface KineticHeadlineProps {
    text: string;
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    textAlign?: "left" | "center" | "right";
    animation?: "word-by-word" | "letter-by-letter" | "all-at-once";
    staggerDelay?: number;
    maxWidth?: string;
}

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
    text,
    color = "#ffffff",
    fontSize = 64,
    fontWeight = 700,
    lineHeight = 1.2,
    textAlign = "center",
    animation = "word-by-word",
    staggerDelay = 3,
    maxWidth = "90%",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const elements = useMemo(() => {
        if (animation === "letter-by-letter") {
            return text.split("");
        } else if (animation === "word-by-word") {
            return text.split(" ");
        }
        return [text];
    }, [text, animation]);

    const renderElement = (element: string, index: number) => {
        const delay = index * staggerDelay;

        // Spring animation for entrance
        const springValue = spring({
            fps,
            frame: frame - delay,
            config: {
                damping: 15,
                stiffness: 100,
                mass: 0.5,
            },
            durationInFrames: 30,
        });

        // Initial blur that clears as element appears
        const blur = interpolate(springValue, [0, 0.5, 1], [8, 2, 0]);

        // Scale effect
        const scale = interpolate(springValue, [0, 1], [0.8, 1], {
            extrapolateRight: "clamp",
        });

        // Y offset for slide-up effect
        const translateY = interpolate(springValue, [0, 1], [30, 0], {
            extrapolateRight: "clamp",
        });

        // Opacity
        const opacity = interpolate(springValue, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
        });

        return (
            <span
                key={index}
                style={{
                    display: "inline-block",
                    opacity,
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    filter: `blur(${blur}px)`,
                    whiteSpace: animation === "word-by-word" ? "pre" : undefined,
                }}
            >
                {element}
                {animation === "word-by-word" && index < elements.length - 1 ? " " : ""}
            </span>
        );
    };

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: textAlign === "center" ? "center" : textAlign === "left" ? "flex-start" : "flex-end",
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
                {elements.map((element, index) => renderElement(element, index))}
            </div>
        </AbsoluteFill>
    );
};
