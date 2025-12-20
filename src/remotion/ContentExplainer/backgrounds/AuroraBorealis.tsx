import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface AuroraBorealisProps {
    primaryColor?: string;
    secondaryColor?: string;
    speed?: number;
    intensity?: number;
}

export const AuroraBorealis: React.FC<AuroraBorealisProps> = ({
    primaryColor = "#00ff88",
    secondaryColor = "#0088ff",
    speed = 1,
    intensity = 1,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Slow wave motion
    const wavePhase = (frame * speed * 0.02) % (Math.PI * 2);
    const slowRotation = interpolate(frame, [0, durationInFrames], [0, 15]);

    // Multiple aurora bands with different phases
    const bands = [
        { offset: 0, width: 60, opacity: 0.4, hueShift: 0 },
        { offset: 20, width: 80, opacity: 0.3, hueShift: 20 },
        { offset: -15, width: 50, opacity: 0.35, hueShift: -10 },
        { offset: 35, width: 70, opacity: 0.25, hueShift: 30 },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: "#0a0a15", overflow: "hidden" }}>
            {/* Deep space gradient base */}
            <div
                style={{
                    position: "absolute",
                    inset: "-20%",
                    background: `
            radial-gradient(ellipse at 30% 70%, rgba(15, 25, 50, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, rgba(25, 15, 45, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, #0a0a15 0%, #050510 100%)
          `,
                }}
            />

            {/* Aurora bands */}
            {bands.map((band, index) => {
                const bandPhase = wavePhase + index * 0.5;
                const wave1 = Math.sin(bandPhase) * 30;
                const wave2 = Math.cos(bandPhase * 0.7) * 20;
                const yOffset = band.offset + wave1;
                const scaleX = 1 + Math.sin(bandPhase * 0.5) * 0.1;

                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            top: `${25 + yOffset}%`,
                            left: "-20%",
                            right: "-20%",
                            height: `${band.width * intensity}%`,
                            background: `linear-gradient(
                180deg,
                transparent 0%,
                ${primaryColor}${Math.round(band.opacity * 255 * intensity).toString(16).padStart(2, '0')} 30%,
                ${secondaryColor}${Math.round(band.opacity * 200 * intensity).toString(16).padStart(2, '0')} 50%,
                ${primaryColor}${Math.round(band.opacity * 180 * intensity).toString(16).padStart(2, '0')} 70%,
                transparent 100%
              )`,
                            transform: `
                rotate(${slowRotation + band.hueShift}deg)
                scaleX(${scaleX})
                translateY(${wave2}px)
              `,
                            filter: `blur(${40 + index * 10}px) hue-rotate(${band.hueShift}deg)`,
                            transformOrigin: "center center",
                        }}
                    />
                );
            })}

            {/* Glow orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "20%",
                    width: 400,
                    height: 400,
                    background: `radial-gradient(circle, ${primaryColor}30 0%, transparent 70%)`,
                    transform: `translate(${Math.sin(wavePhase) * 50}px, ${Math.cos(wavePhase * 0.8) * 30}px)`,
                    filter: "blur(60px)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "15%",
                    width: 350,
                    height: 350,
                    background: `radial-gradient(circle, ${secondaryColor}25 0%, transparent 70%)`,
                    transform: `translate(${Math.cos(wavePhase) * 40}px, ${Math.sin(wavePhase * 0.6) * 40}px)`,
                    filter: "blur(50px)",
                }}
            />

            {/* Subtle stars */}
            {Array.from({ length: 80 }).map((_, i) => {
                const x = (Math.sin(i * 137.5) * 0.5 + 0.5) * 100;
                const y = (Math.cos(i * 137.5) * 0.5 + 0.5) * 100;
                const size = 1 + (i % 3);
                const twinkle = Math.sin(frame * 0.08 + i * 0.5) * 0.5 + 0.5;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${x}%`,
                            top: `${y}%`,
                            width: size,
                            height: size,
                            backgroundColor: `rgba(200, 220, 255, ${0.15 + twinkle * 0.35})`,
                            borderRadius: "50%",
                            boxShadow: `0 0 ${size * 2}px rgba(200, 220, 255, ${twinkle * 0.2})`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
