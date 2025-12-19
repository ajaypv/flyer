import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface Star {
  id: number;
  startX: number;
  startY: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

// Deterministic random number generator using seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const generateStars = (count: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      startX: seededRandom(i * 1) * 120 - 10, // Start slightly off-screen
      startY: seededRandom(i * 2) * 120 - 10,
      size: 1 + seededRandom(i * 3) * 3, // 1-4px
      speed: 0.5 + seededRandom(i * 4) * 2, // Varied speeds
      opacity: 0.3 + seededRandom(i * 5) * 0.7, // 0.3-1.0
      delay: seededRandom(i * 6) * 100, // Stagger start times
    });
  }
  return stars;
};

export const ShootingStars: React.FC<{
  starCount?: number;
}> = ({ starCount = 60 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const stars = useMemo(() => generateStars(starCount), [starCount]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f", overflow: "hidden" }}>
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 70%)",
        }}
      />
      
      {/* Stars */}
      {stars.map((star) => {
        // Calculate position with looping
        const adjustedFrame = (frame + star.delay) % (durationInFrames + 50);
        const progress = (adjustedFrame * star.speed) / 100;
        
        // Diagonal movement (top-right to bottom-left)
        const x = star.startX - progress * 30;
        const y = star.startY + progress * 30;
        
        // Fade in and out at edges
        const fadeIn = Math.min(1, progress * 5);
        const fadeOut = Math.max(0, 1 - (progress - 3) * 2);
        const currentOpacity = star.opacity * fadeIn * fadeOut;

        // Trail length based on speed
        const trailLength = star.size * 8 * star.speed;

        return (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${trailLength}px`,
              height: `${star.size}px`,
              background: `linear-gradient(to left, rgba(255, 255, 255, ${currentOpacity}), transparent)`,
              borderRadius: "50%",
              transform: "rotate(-45deg)",
              transformOrigin: "right center",
            }}
          />
        );
      })}

      {/* Static background stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`static-${i}`}
          style={{
            position: "absolute",
            left: `${seededRandom(i * 10 + 1000) * 100}%`,
            top: `${seededRandom(i * 10 + 2000) * 100}%`,
            width: `${1 + seededRandom(i * 10 + 3000) * 2}px`,
            height: `${1 + seededRandom(i * 10 + 3000) * 2}px`,
            backgroundColor: `rgba(255, 255, 255, ${0.1 + seededRandom(i * 10 + 4000) * 0.3})`,
            borderRadius: "50%",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
