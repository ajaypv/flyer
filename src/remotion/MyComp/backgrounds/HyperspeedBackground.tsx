import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Deterministic random for consistent renders
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

interface LightTrail {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  width: number;
  color: string;
  delay: number;
  speed: number;
}

const generateLightTrails = (count: number): LightTrail[] => {
  const trails: LightTrail[] = [];

  // Left side trails (pink/purple)
  const leftColors = ["#D856BF", "#6750A2", "#C247AC", "#ff5f73", "#a855f7"];
  for (let i = 0; i < count / 2; i++) {
    const seed = i;
    const startX = -10 + seededRandom(seed * 1) * 30;
    const startY = 20 + seededRandom(seed * 2) * 60;
    trails.push({
      id: i,
      startX,
      startY,
      endX: 45 + seededRandom(seed * 3) * 15,
      endY: 95 + seededRandom(seed * 4) * 10,
      controlX: startX + 20 + seededRandom(seed * 5) * 30,
      controlY: startY + 20 + seededRandom(seed * 6) * 30,
      width: 2 + seededRandom(seed * 7) * 4,
      color: leftColors[Math.floor(seededRandom(seed * 8) * leftColors.length)],
      delay: seededRandom(seed * 9) * 30,
      speed: 0.6 + seededRandom(seed * 10) * 0.8,
    });
  }

  // Right side trails (cyan/blue)
  const rightColors = ["#03B3C3", "#0E5EA5", "#324555", "#53c2c6", "#06b6d4"];
  for (let i = count / 2; i < count; i++) {
    const seed = i + 1000;
    const startX = 70 + seededRandom(seed * 1) * 40;
    const startY = 20 + seededRandom(seed * 2) * 60;
    trails.push({
      id: i,
      startX,
      startY,
      endX: 55 + seededRandom(seed * 3) * 15,
      endY: 95 + seededRandom(seed * 4) * 10,
      controlX: startX - 20 - seededRandom(seed * 5) * 30,
      controlY: startY + 20 + seededRandom(seed * 6) * 30,
      width: 2 + seededRandom(seed * 7) * 4,
      color:
        rightColors[Math.floor(seededRandom(seed * 8) * rightColors.length)],
      delay: seededRandom(seed * 9) * 30,
      speed: 0.6 + seededRandom(seed * 10) * 0.8,
    });
  }

  return trails;
};

// Generate SVG path for curved light trail
const generateCurvedPath = (trail: LightTrail): string => {
  return `M ${trail.startX} ${trail.startY} Q ${trail.controlX} ${trail.controlY} ${trail.endX} ${trail.endY}`;
};

export const HyperspeedBackground: React.FC<{
  speedMultiplier?: number;
}> = ({ speedMultiplier = 1 }) => {
  const frame = useCurrentFrame();
  useVideoConfig(); // Required for Remotion context

  const trails = useMemo(() => generateLightTrails(40), []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {/* SVG for curved light trails */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          {/* Glow filters for each color */}
          <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {trails.map((trail) => {
          const adjustedFrame = (frame + trail.delay) * trail.speed * speedMultiplier;
          const cycleLength = 60;
          const progress = (adjustedFrame % cycleLength) / cycleLength;

          // Animate the stroke dash to create flowing effect
          const pathLength = 100;
          const dashLength = interpolate(progress, [0, 1], [0, pathLength]);
          const dashOffset = interpolate(progress, [0, 1], [pathLength, 0]);

          // Fade in and out
          const opacity = interpolate(
            progress,
            [0, 0.1, 0.7, 1],
            [0, 0.9, 0.9, 0]
          );

          // Width grows as it moves
          const strokeWidth = interpolate(
            progress,
            [0, 1],
            [trail.width * 0.3, trail.width * 1.5]
          );

          const isPink = trail.id < 20;

          return (
            <path
              key={trail.id}
              d={generateCurvedPath(trail)}
              fill="none"
              stroke={trail.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${pathLength}`}
              strokeDashoffset={dashOffset}
              opacity={opacity}
              filter={isPink ? "url(#glow-pink)" : "url(#glow-cyan)"}
              style={{
                filter: `drop-shadow(0 0 ${strokeWidth * 2}px ${trail.color})`,
              }}
            />
          );
        })}
      </svg>

      {/* Additional glow spots */}
      {trails.slice(0, 15).map((trail) => {
        const adjustedFrame = (frame + trail.delay) * trail.speed * speedMultiplier;
        const progress = (adjustedFrame % 60) / 60;

        const x = interpolate(
          progress,
          [0, 1],
          [trail.startX, trail.endX]
        );
        const y = interpolate(
          progress,
          [0, 1],
          [trail.startY, trail.endY]
        );
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0]);
        const size = interpolate(progress, [0, 1], [5, 20]);

        return (
          <div
            key={`glow-${trail.id}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              backgroundColor: trail.color,
              opacity,
              filter: `blur(${size / 3}px)`,
              boxShadow: `0 0 ${size * 2}px ${trail.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Road/ground effect at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "15%",
          background:
            "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.8) 50%, transparent 100%)",
        }}
      />

      {/* Subtle center convergence glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "5%",
          width: "200px",
          height: "100px",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at center, rgba(100,100,120,0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
