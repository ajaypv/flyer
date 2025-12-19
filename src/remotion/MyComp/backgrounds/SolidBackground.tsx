import React from "react";
import { AbsoluteFill } from "remotion";

export const SolidBackground: React.FC<{
  color: "black" | "white";
}> = ({ color }) => {
  const backgroundColor = color === "black" ? "#000000" : "#FFFFFF";

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
      }}
    />
  );
};

// Helper function to get contrasting text color
export const getTextColorForBackground = (background: string): string => {
  if (background === "white") {
    return "#000000";
  }
  // For black, shooting-stars, and ice-galaxy, use white text
  return "#FFFFFF";
};
