import { z } from "zod";
export const COMP_NAME = "MyComp";

// Text animation style options
export const TextAnimationStyle = z.enum(["typing", "magical"]);
export type TextAnimationStyleType = z.infer<typeof TextAnimationStyle>;

// Background style options
export const BackgroundStyle = z.enum(["shooting-stars", "ice-galaxy", "black", "white"]);
export type BackgroundStyleType = z.infer<typeof BackgroundStyle>;

export const CompositionProps = z.object({
  title: z.string(),
  textAnimation: TextAnimationStyle.default("magical"),
  background: BackgroundStyle.default("black"),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
  textAnimation: "magical",
  background: "black",
};

export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

// Typing animation settings
export const CHARS_PER_SECOND = 10; // Characters typed per second
export const INTRO_FRAMES = 30; // Frames before text starts
export const OUTRO_FRAMES = 90; // Frames after text completes (3 seconds at 30fps)

// Calculate duration based on text and animation type
export const calculateDuration = (
  text: string,
  animationType: TextAnimationStyleType
): number => {
  if (animationType === "typing") {
    // For typing: intro + (chars * frames per char) + outro
    const typingFrames = Math.ceil((text.length / CHARS_PER_SECOND) * VIDEO_FPS);
    return INTRO_FRAMES + typingFrames + OUTRO_FRAMES;
  } else {
    // For magical: intro + animation duration (80 frames) + outro
    return INTRO_FRAMES + 80 + OUTRO_FRAMES;
  }
};

// Default duration for backward compatibility
export const DURATION_IN_FRAMES = 200;
