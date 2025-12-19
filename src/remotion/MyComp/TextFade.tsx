import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const TextFade: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 80,
  });

  const rightStop = interpolate(progress, [0, 1], [200, 0]);
  const leftStop = Math.max(0, rightStop - 60);
  const maskImage = `linear-gradient(-45deg, transparent ${leftStop}%, black ${rightStop}%)`;

  const content: React.CSSProperties = useMemo(() => {
    return {
      maskImage,
      WebkitMaskImage: maskImage,
    };
  }, [maskImage]);

  return (
    <AbsoluteFill>
      <AbsoluteFill className="justify-center items-center">
        <div style={content}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Standalone magical text component with color support
export const MagicalText: React.FC<{
  text: string;
  color?: string;
}> = ({ text, color = "#ffffff" }) => {
  return (
    <TextFade>
      <h1
        className="text-[48px] md:text-[60px] font-bold text-center max-w-[90%] leading-tight"
        style={{
          fontFamily,
          color,
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {text}
      </h1>
    </TextFade>
  );
};
