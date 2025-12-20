import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface HeadlineSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const HeadlineScene: React.FC<HeadlineSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    // Simple fade entrance for headline
    const headlineOpacity = interpolate(frame, [0, 25], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Subheadline fades in after headline
    const subheadlineOpacity = interpolate(frame, [15, 40], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
    });

    // Body fades in after subheadline
    const bodyOpacity = interpolate(frame, [30, 55], [0, 1], {
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
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                    textAlign: "center",
                    maxWidth: "85%",
                }}
            >
                {/* Main Headline */}
                {section.headline && (
                    <h1
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 64,
                            fontWeight: 700,
                            color: textColor,
                            opacity: headlineOpacity,
                            margin: 0,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                        }}
                    >
                        {section.headline}
                    </h1>
                )}

                {/* Subheadline */}
                {section.subheadline && (
                    <h2
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 36,
                            fontWeight: 500,
                            color: secondaryTextColor,
                            opacity: subheadlineOpacity,
                            margin: 0,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.3,
                        }}
                    >
                        {section.subheadline}
                    </h2>
                )}

                {/* Body text */}
                {section.body && (
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 24,
                            fontWeight: 400,
                            color: secondaryTextColor,
                            opacity: bodyOpacity,
                            margin: 0,
                            marginTop: 8,
                            lineHeight: 1.5,
                            maxWidth: "600px",
                        }}
                    >
                        {section.body}
                    </p>
                )}
            </div>
        </AbsoluteFill>
    );
};
