import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const IceGalaxy: React.FC<{
  intensity?: number;
}> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow rotation animation
  const rotation = interpolate(frame, [0, durationInFrames], [0, 360], {
    extrapolateRight: "clamp",
  });

  // Subtle scale pulse
  const scale = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [1, 1.05 * intensity]
  );

  // Color shift animation
  const hueShift = interpolate(frame, [0, durationInFrames], [0, 30]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a", overflow: "hidden" }}>
      {/* Base gradient layer */}
      <div
        style={{
          position: "absolute",
          inset: "-50%",
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(83, 52, 131, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(15, 52, 96, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(22, 33, 62, 0.8) 0%, transparent 70%)
          `,
          transform: `rotate(${rotation * 0.1}deg) scale(${scale})`,
          filter: `hue-rotate(${hueShift}deg)`,
        }}
      />

      {/* Swirling nebula layer 1 */}
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          background: `
            conic-gradient(
              from ${rotation}deg at 40% 40%,
              transparent 0deg,
              rgba(100, 149, 237, 0.15) 60deg,
              transparent 120deg,
              rgba(138, 43, 226, 0.1) 180deg,
              transparent 240deg,
              rgba(65, 105, 225, 0.12) 300deg,
              transparent 360deg
            )
          `,
          transform: `scale(${1.2 * scale})`,
          filter: "blur(40px)",
        }}
      />

      {/* Swirling nebula layer 2 */}
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background: `
            conic-gradient(
              from ${-rotation * 0.5}deg at 60% 60%,
              transparent 0deg,
              rgba(147, 112, 219, 0.12) 90deg,
              transparent 180deg,
              rgba(70, 130, 180, 0.1) 270deg,
              transparent 360deg
            )
          `,
          transform: `scale(${1.1 * scale})`,
          filter: "blur(60px)",
        }}
      />

      {/* Glow spots */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(100, 149, 237, 0.3) 0%, transparent 70%)",
          transform: `translate(-50%, -50%) scale(${scale})`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "25%",
          bottom: "35%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.25) 0%, transparent 70%)",
          transform: `translate(50%, 50%) scale(${scale * 1.1})`,
          filter: "blur(25px)",
        }}
      />

      {/* Subtle star particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.sin(i * 137.5) * 0.5 + 0.5) * 100;
        const y = (Math.cos(i * 137.5) * 0.5 + 0.5) * 100;
        const size = 1 + (i % 3);
        const twinkle = Math.sin(frame * 0.1 + i) * 0.5 + 0.5;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: `rgba(200, 220, 255, ${0.2 + twinkle * 0.4})`,
              borderRadius: "50%",
              boxShadow: `0 0 ${size * 2}px rgba(200, 220, 255, ${twinkle * 0.3})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
