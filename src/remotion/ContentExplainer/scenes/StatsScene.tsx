import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface StatsSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const StatsScene: React.FC<StatsSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    const stats = section.stats || [];

    // Simple fade for headline
    const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Stagger delay for stats
    const statStartFrame = 25;
    const statStagger = 15;

    // Determine layout based on stat count
    const getGridLayout = () => {
        if (stats.length === 1) return "1fr";
        if (stats.length === 2) return "1fr 1fr";
        return `repeat(${Math.min(stats.length, 3)}, 1fr)`;
    };

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
            {/* Headline */}
            {section.headline && (
                <h2
                    style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 44,
                        fontWeight: 600,
                        color: textColor,
                        opacity: headlineOpacity,
                        margin: 0,
                        marginBottom: 56,
                        textAlign: "center",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {section.headline}
                </h2>
            )}

            {/* Stats Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: getGridLayout(),
                    gap: 64,
                    width: "100%",
                    maxWidth: 900,
                }}
            >
                {stats.map((stat, index) => {
                    const delay = statStartFrame + index * statStagger;

                    const statOpacity = interpolate(
                        frame,
                        [delay, delay + 20],
                        [0, 1],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    const translateY = interpolate(
                        frame,
                        [delay, delay + 20],
                        [15, 0],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 12,
                                opacity: statOpacity,
                                transform: `translateY(${translateY}px)`,
                            }}
                        >
                            {/* Stat Value */}
                            <span
                                style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    fontSize: 72,
                                    fontWeight: 700,
                                    color: textColor,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1,
                                }}
                            >
                                {stat.prefix || ""}{stat.value}{stat.suffix || ""}
                            </span>

                            {/* Stat Label */}
                            <span
                                style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    fontSize: 20,
                                    fontWeight: 400,
                                    color: secondaryTextColor,
                                    textAlign: "center",
                                    opacity: 0.8,
                                }}
                            >
                                {stat.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
