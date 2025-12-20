import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface OutroSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    // Simple fade in
    const opacity = interpolate(frame, [0, 25], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Subtle scale
    const scale = interpolate(frame, [0, 25], [0.97, 1], {
        extrapolateRight: "clamp",
    });

    // Subheadline fades in after headline
    const subheadlineOpacity = interpolate(frame, [15, 40], [0, 1], {
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
                opacity,
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
                {/* Main CTA Headline */}
                {section.headline && (
                    <h1
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 56,
                            fontWeight: 600,
                            color: textColor,
                            margin: 0,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                        }}
                    >
                        {section.headline}
                    </h1>
                )}

                {/* Handle/Subheadline */}
                {section.subheadline && (
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 24,
                            fontWeight: 500,
                            color: secondaryTextColor,
                            margin: 0,
                            marginTop: 8,
                            opacity: subheadlineOpacity,
                        }}
                    >
                        {section.subheadline}
                    </p>
                )}
            </div>
        </AbsoluteFill>
    );
};
