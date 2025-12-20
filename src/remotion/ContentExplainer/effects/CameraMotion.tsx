import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CameraMovementType } from "../../../../types/video-content";

export interface CameraMotionProps {
    camera?: CameraMovementType;
    durationFrames: number;
    children: React.ReactNode;
}

export const CameraMotion: React.FC<CameraMotionProps> = ({
    camera,
    durationFrames,
    children,
}) => {
    const frame = useCurrentFrame();

    // If no camera movement, just render children
    if (!camera || camera.type === "static") {
        return <AbsoluteFill>{children}</AbsoluteFill>;
    }

    const intensity = camera.intensity ?? 1;
    const startScale = camera.startScale ?? 1;
    const endScale = camera.endScale ?? 1.1;
    const focusX = camera.focusPoint?.x ?? 50;
    const focusY = camera.focusPoint?.y ?? 50;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let rotate = 0;

    switch (camera.type) {
        case "zoom-in-slow":
            scale = interpolate(
                frame,
                [0, durationFrames],
                [startScale, endScale * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "zoom-in-fast":
            scale = interpolate(
                frame,
                [0, durationFrames * 0.5],
                [startScale, endScale * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "zoom-out-slow":
            scale = interpolate(
                frame,
                [0, durationFrames],
                [endScale * intensity, startScale],
                { extrapolateRight: "clamp" }
            );
            break;

        case "zoom-out-fast":
            scale = interpolate(
                frame,
                [0, durationFrames * 0.5],
                [endScale * intensity, startScale],
                { extrapolateRight: "clamp" }
            );
            break;

        case "pan-left":
            translateX = interpolate(
                frame,
                [0, durationFrames],
                [0, -5 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "pan-right":
            translateX = interpolate(
                frame,
                [0, durationFrames],
                [0, 5 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "tilt-up":
            translateY = interpolate(
                frame,
                [0, durationFrames],
                [0, -3 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "tilt-down":
            translateY = interpolate(
                frame,
                [0, durationFrames],
                [0, 3 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "ken-burns":
            // Slow zoom + subtle pan
            scale = interpolate(
                frame,
                [0, durationFrames],
                [startScale, startScale + 0.08 * intensity],
                { extrapolateRight: "clamp" }
            );
            translateX = interpolate(
                frame,
                [0, durationFrames],
                [0, -2 * intensity],
                { extrapolateRight: "clamp" }
            );
            translateY = interpolate(
                frame,
                [0, durationFrames],
                [0, -1 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "drift":
            // Subtle floating movement
            const driftPhase = (frame / durationFrames) * Math.PI * 2;
            translateX = Math.sin(driftPhase) * 1.5 * intensity;
            translateY = Math.cos(driftPhase * 0.7) * 1 * intensity;
            scale = 1 + Math.sin(driftPhase * 0.5) * 0.01 * intensity;
            break;

        case "shake":
            // Micro-shake for energy
            const shakeIntensity = interpolate(
                frame,
                [0, 10, durationFrames],
                [intensity * 0.5, intensity, 0],
                { extrapolateRight: "clamp" }
            );
            translateX = Math.sin(frame * 1.5) * shakeIntensity;
            translateY = Math.cos(frame * 1.2) * shakeIntensity * 0.5;
            break;

        case "dolly-in":
            // Progressive approach (slightly different feel than zoom)
            scale = interpolate(
                frame,
                [0, durationFrames],
                [startScale - 0.05, startScale + 0.05 * intensity],
                { extrapolateRight: "clamp" }
            );
            break;

        case "rack-focus":
            // This is more of a blur effect, handled elsewhere
            // Just do subtle zoom
            scale = interpolate(
                frame,
                [0, durationFrames],
                [1, 1.02],
                { extrapolateRight: "clamp" }
            );
            break;
    }

    // Transform origin based on focus point
    const transformOrigin = `${focusX}% ${focusY}%`;

    return (
        <AbsoluteFill
            style={{
                transform: `scale(${scale}) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`,
                transformOrigin,
            }}
        >
            {children}
        </AbsoluteFill>
    );
};
