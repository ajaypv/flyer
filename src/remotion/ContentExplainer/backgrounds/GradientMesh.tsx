import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export interface GradientMeshProps {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    speed?: number;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({
    primaryColor = "#6366f1",
    secondaryColor = "#ec4899",
    accentColor = "#8b5cf6",
    speed = 1,
}) => {
    const frame = useCurrentFrame();

    // Slow morphing animation
    const phase = (frame * speed * 0.015) % (Math.PI * 2);

    // Calculate positions for animated blobs
    const blob1X = 30 + Math.sin(phase) * 15;
    const blob1Y = 25 + Math.cos(phase * 0.8) * 10;

    const blob2X = 70 + Math.cos(phase) * 12;
    const blob2Y = 60 + Math.sin(phase * 0.7) * 15;

    const blob3X = 45 + Math.sin(phase * 1.2) * 20;
    const blob3Y = 75 + Math.cos(phase * 0.9) * 12;

    const blob4X = 80 + Math.cos(phase * 0.6) * 10;
    const blob4Y = 20 + Math.sin(phase * 1.1) * 8;

    return (
        <AbsoluteFill style={{ backgroundColor: "#0f0f1a", overflow: "hidden" }}>
            {/* Base dark gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0f0f1a 100%)",
                }}
            />

            {/* Animated gradient blobs */}
            <div
                style={{
                    position: "absolute",
                    left: `${blob1X}%`,
                    top: `${blob1Y}%`,
                    width: "50%",
                    height: "50%",
                    background: `radial-gradient(circle, ${primaryColor}60 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                    filter: "blur(80px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: `${blob2X}%`,
                    top: `${blob2Y}%`,
                    width: "45%",
                    height: "45%",
                    background: `radial-gradient(circle, ${secondaryColor}50 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                    filter: "blur(70px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: `${blob3X}%`,
                    top: `${blob3Y}%`,
                    width: "40%",
                    height: "40%",
                    background: `radial-gradient(circle, ${accentColor}45 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                    filter: "blur(60px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: `${blob4X}%`,
                    top: `${blob4Y}%`,
                    width: "35%",
                    height: "35%",
                    background: `radial-gradient(circle, ${primaryColor}35 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Subtle noise overlay for texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </AbsoluteFill>
    );
};
