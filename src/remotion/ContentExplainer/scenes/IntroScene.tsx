import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface IntroSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    // Simple fade for headline
    const headlineOpacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Slight scale for subtle entrance
    const scale = interpolate(frame, [0, 30], [0.98, 1], {
        extrapolateRight: "clamp",
    });

    // Subheadline fades in after headline
    const subheadlineOpacity = interpolate(frame, [20, 45], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10%",
                transform: `scale(${scale})`,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 20,
                }}
            >
                {/* Main Headline */}
                {section.headline && (
                    <h1
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 80,
                            fontWeight: 700,
                            color: textColor,
                            opacity: headlineOpacity,
                            margin: 0,
                            letterSpacing: "-0.04em",
                            lineHeight: 1.0,
                        }}
                    >
                        {section.headline}
                    </h1>
                )}

                {/* Subheadline */}
                {section.subheadline && (
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 28,
                            fontWeight: 400,
                            color: secondaryTextColor,
                            opacity: subheadlineOpacity,
                            margin: 0,
                            marginTop: 12,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {section.subheadline}
                    </p>
                )}
            </div>
        </AbsoluteFill>
    );
};
