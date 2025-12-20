import React from "react";
import {
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
    subsets: ["latin"],
    weights: ["500", "600"],
});

export interface AccentTagProps {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    animation?: "slide-in" | "scale" | "fade";
    delay?: number;
}

export const AccentTag: React.FC<AccentTagProps> = ({
    text,
    backgroundColor = "rgba(255, 255, 255, 0.15)",
    textColor = "#ffffff",
    fontSize = 14,
    borderRadius = 20,
    animation = "slide-in",
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Spring animation
    const springValue = spring({
        fps,
        frame: frame - delay,
        config: {
            damping: 18,
            stiffness: 120,
            mass: 0.6,
        },
        durationInFrames: 25,
    });

    // Calculate animation values based on type
    let opacity = 1;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    if (animation === "slide-in") {
        opacity = interpolate(springValue, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
        });
        translateX = interpolate(springValue, [0, 1], [-30, 0], {
            extrapolateRight: "clamp",
        });
    } else if (animation === "scale") {
        opacity = interpolate(springValue, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
        });
        scale = interpolate(springValue, [0, 0.8, 1], [0.5, 1.1, 1], {
            extrapolateRight: "clamp",
        });
    } else if (animation === "fade") {
        opacity = springValue;
    }

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: `${fontSize * 0.4}px ${fontSize * 0.9}px`,
                backgroundColor,
                borderRadius,
                opacity,
                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                backdropFilter: "blur(10px)",
            }}
        >
            <span
                style={{
                    fontFamily,
                    fontSize,
                    fontWeight: 600,
                    color: textColor,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                }}
            >
                {text}
            </span>
        </div>
    );
};

// Row of multiple tags
export interface TagRowProps {
    tags: string[];
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    gap?: number;
    staggerDelay?: number;
}

export const TagRow: React.FC<TagRowProps> = ({
    tags,
    backgroundColor = "rgba(255, 255, 255, 0.15)",
    textColor = "#ffffff",
    fontSize = 14,
    gap = 12,
    staggerDelay = 5,
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap,
                justifyContent: "center",
            }}
        >
            {tags.map((tag, index) => (
                <AccentTag
                    key={index}
                    text={tag}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    fontSize={fontSize}
                    delay={index * staggerDelay}
                    animation="slide-in"
                />
            ))}
        </div>
    );
};
