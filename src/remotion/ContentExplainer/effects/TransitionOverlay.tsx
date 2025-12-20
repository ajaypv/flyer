import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TransitionValue } from "../../../../types/video-content";

export interface TransitionOverlayProps {
    transition: TransitionValue;
    durationFrames: number;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
    transition,
    durationFrames,
}) => {
    const frame = useCurrentFrame();
    const midpoint = durationFrames / 2;

    // Different transition effects
    switch (transition.type) {
        case "fade-black":
            const fadeBlackOpacity = interpolate(
                frame,
                [0, midpoint, durationFrames],
                [0, 1, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backgroundColor: "black",
                        opacity: fadeBlackOpacity,
                    }}
                />
            );

        case "fade-white":
            const fadeWhiteOpacity = interpolate(
                frame,
                [0, midpoint, durationFrames],
                [0, 1, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backgroundColor: "white",
                        opacity: fadeWhiteOpacity,
                    }}
                />
            );

        case "flash":
            const flashOpacity = interpolate(
                frame,
                [0, 3, midpoint, durationFrames],
                [0, 1, 0.8, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backgroundColor: "white",
                        opacity: flashOpacity,
                    }}
                />
            );

        case "blur-transition":
            const blurAmount = interpolate(
                frame,
                [0, midpoint, durationFrames],
                [0, 15, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backdropFilter: `blur(${blurAmount}px)`,
                        WebkitBackdropFilter: `blur(${blurAmount}px)`,
                    }}
                />
            );

        case "wipe-radial":
            const wipeProgress = interpolate(
                frame,
                [0, durationFrames],
                [0, 150],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        background: `radial-gradient(circle at center, transparent ${wipeProgress}%, black ${wipeProgress + 5}%)`,
                    }}
                />
            );

        case "glitch":
            // Simple glitch simulation with offset bars
            const glitchIntensity = interpolate(
                frame,
                [0, midpoint, durationFrames],
                [0, 1, 0],
                { extrapolateRight: "clamp" }
            );
            const offset1 = Math.sin(frame * 10) * 20 * glitchIntensity;
            const offset2 = Math.cos(frame * 15) * 15 * glitchIntensity;
            return (
                <AbsoluteFill style={{ overflow: "hidden" }}>
                    <div
                        style={{
                            position: "absolute",
                            top: "20%",
                            left: 0,
                            right: 0,
                            height: "10%",
                            backgroundColor: `rgba(255, 0, 0, ${0.3 * glitchIntensity})`,
                            transform: `translateX(${offset1}px)`,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            right: 0,
                            height: "8%",
                            backgroundColor: `rgba(0, 255, 255, ${0.3 * glitchIntensity})`,
                            transform: `translateX(${offset2}px)`,
                        }}
                    />
                </AbsoluteFill>
            );

        case "pixelate":
            // Note: True pixelation would require SVG filters, this is a simplified version
            const pixelOpacity = interpolate(
                frame,
                [0, midpoint, durationFrames],
                [0, 0.8, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backgroundColor: `rgba(0, 0, 0, ${pixelOpacity})`,
                    }}
                />
            );

        // For slide/zoom transitions, they're typically handled in SceneManager
        // This overlay just provides optional extras
        case "zoom-through":
            const zoomBlur = interpolate(
                frame,
                [0, midpoint / 2, midpoint, durationFrames],
                [0, 5, 5, 0],
                { extrapolateRight: "clamp" }
            );
            return (
                <AbsoluteFill
                    style={{
                        backdropFilter: `blur(${zoomBlur}px)`,
                    }}
                />
            );

        default:
            // Most transitions (fade, slide, cut) don't need an overlay
            return null;
    }
};
