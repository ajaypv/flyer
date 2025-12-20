import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SectionValue } from "../../../../types/video-content";
import { KineticHeadline } from "../typography/KineticHeadline";

export interface ComparisonSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
    section,
    progress,
    textColor,
    secondaryTextColor,
    durationFrames,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entrance animations
    const leftSpring = spring({
        fps,
        frame,
        config: {
            damping: 15,
            stiffness: 100,
            mass: 0.6,
        },
        durationInFrames: 30,
    });

    const rightSpring = spring({
        fps,
        frame: frame - 10, // Slight delay for right side
        config: {
            damping: 15,
            stiffness: 100,
            mass: 0.6,
        },
        durationInFrames: 30,
    });

    const leftOpacity = interpolate(leftSpring, [0, 0.4], [0, 1], {
        extrapolateRight: "clamp",
    });

    const leftTranslateX = interpolate(leftSpring, [0, 1], [-50, 0], {
        extrapolateRight: "clamp",
    });

    const rightOpacity = interpolate(rightSpring, [0, 0.4], [0, 1], {
        extrapolateRight: "clamp",
    });

    const rightTranslateX = interpolate(rightSpring, [0, 1], [50, 0], {
        extrapolateRight: "clamp",
    });

    // VS badge animation
    const vsSpring = spring({
        fps,
        frame: frame - 20,
        config: {
            damping: 12,
            stiffness: 150,
            mass: 0.4,
        },
        durationInFrames: 20,
    });

    const vsScale = interpolate(vsSpring, [0, 0.7, 1], [0, 1.2, 1], {
        extrapolateRight: "clamp",
    });

    const vsOpacity = interpolate(vsSpring, [0, 0.3], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                flexDirection: "row",
                display: "flex",
            }}
        >
            {/* Left side */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5%",
                    opacity: leftOpacity,
                    transform: `translateX(${leftTranslateX}px)`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    {section.headline && (
                        <KineticHeadline
                            text={section.headline.split(" vs ")[0] || "Option A"}
                            color={textColor}
                            fontSize={40}
                            fontWeight={700}
                            textAlign="center"
                            animation="word-by-word"
                        />
                    )}
                </div>
            </div>

            {/* VS Badge (center) */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${vsScale})`,
                    opacity: vsOpacity,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 24,
                        fontWeight: 800,
                        color: textColor,
                        border: `2px solid ${textColor}20`,
                    }}
                >
                    VS
                </div>
            </div>

            {/* Right side */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5%",
                    opacity: rightOpacity,
                    transform: `translateX(${rightTranslateX}px)`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    {section.headline && (
                        <KineticHeadline
                            text={section.headline.split(" vs ")[1] || "Option B"}
                            color={textColor}
                            fontSize={40}
                            fontWeight={700}
                            textAlign="center"
                            animation="word-by-word"
                        />
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};
