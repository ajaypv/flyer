import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface Grid3DProps {
    gridColor?: string;
    backgroundColor?: string;
    speed?: number;
    perspective?: number;
}

export const Grid3D: React.FC<Grid3DProps> = ({
    gridColor = "#ffffff",
    backgroundColor = "#0a0a15",
    speed = 1,
    perspective = 800,
}) => {
    const frame = useCurrentFrame();

    // Moving grid animation
    const gridOffset = (frame * speed * 2) % 100;

    // Subtle rotation
    const rotateX = 70; // Fixed tilt
    const rotateZ = Math.sin(frame * 0.01) * 2;

    const gridLines = 20;
    const gridSpacing = 100 / gridLines;

    return (
        <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
            {/* Gradient overlay at top */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)`,
                    zIndex: 2,
                }}
            />

            {/* 3D Grid container */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "-50%",
                    right: "-50%",
                    height: "80%",
                    perspective: perspective,
                    transformStyle: "preserve-3d",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
                        transformOrigin: "center bottom",
                    }}
                >
                    {/* Horizontal lines */}
                    {Array.from({ length: gridLines + 5 }).map((_, i) => {
                        const yPos = ((i * gridSpacing + gridOffset) % 120) - 20;
                        const opacity = interpolate(
                            yPos,
                            [0, 50, 100],
                            [0.6, 0.3, 0.1],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        );

                        return (
                            <div
                                key={`h-${i}`}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: `${yPos}%`,
                                    height: 1,
                                    backgroundColor: gridColor,
                                    opacity: opacity * 0.4,
                                }}
                            />
                        );
                    })}

                    {/* Vertical lines */}
                    {Array.from({ length: gridLines * 2 }).map((_, i) => {
                        const xPos = (i / (gridLines * 2)) * 100;
                        const centerDistance = Math.abs(xPos - 50);
                        const opacity = interpolate(
                            centerDistance,
                            [0, 50],
                            [0.5, 0.1],
                            { extrapolateRight: "clamp" }
                        );

                        return (
                            <div
                                key={`v-${i}`}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: `${xPos}%`,
                                    width: 1,
                                    backgroundColor: gridColor,
                                    opacity: opacity * 0.3,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Horizon glow */}
            <div
                style={{
                    position: "absolute",
                    bottom: "15%",
                    left: "20%",
                    right: "20%",
                    height: 200,
                    background: `radial-gradient(ellipse at center, ${gridColor}15 0%, transparent 70%)`,
                    filter: "blur(40px)",
                }}
            />

            {/* Sun/light source */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "50%",
                    width: 200,
                    height: 100,
                    transform: "translateX(-50%)",
                    background: `radial-gradient(ellipse at center, ${gridColor}30 0%, transparent 70%)`,
                    filter: "blur(30px)",
                }}
            />
        </AbsoluteFill>
    );
};
