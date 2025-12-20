import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface BulletListSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const BulletListScene: React.FC<BulletListSceneProps> = ({
    section,
    textColor,
    durationFrames,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const bullets = section.bullets || [];

    // Simple fade for headline
    const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Stagger bullets after headline
    const bulletStaggerDelay = 20; // Frames between each bullet
    const bulletStartFrame = 25; // Start bullets after headline fades in

    return (
        <AbsoluteFill
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "8%",
            }}
        >
            {/* Headline - Simple Fade */}
            {section.headline && (
                <h2
                    style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 52,
                        fontWeight: 600,
                        color: textColor,
                        textAlign: "center",
                        opacity: headlineOpacity,
                        marginBottom: 48,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {section.headline}
                </h2>
            )}

            {/* Bullets Container */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 28,
                    maxWidth: "80%",
                }}
            >
                {bullets.map((bullet, index) => {
                    const bulletDelay = bulletStartFrame + index * bulletStaggerDelay;

                    const bulletOpacity = interpolate(
                        frame,
                        [bulletDelay, bulletDelay + 15],
                        [0, 1],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    const bulletTranslateY = interpolate(
                        frame,
                        [bulletDelay, bulletDelay + 15],
                        [20, 0],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                opacity: bulletOpacity,
                                transform: `translateY(${bulletTranslateY}px)`,
                            }}
                        >
                            {/* Bullet Dot */}
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: textColor,
                                    flexShrink: 0,
                                    opacity: 0.7,
                                }}
                            />

                            {/* Bullet Text */}
                            <span
                                style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    fontSize: 32,
                                    fontWeight: 400,
                                    color: textColor,
                                    lineHeight: 1.4,
                                }}
                            >
                                {bullet}
                            </span>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
