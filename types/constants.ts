import { z } from "zod";
export const COMP_NAME = "MyComp";
export const MESSAGE_COMP_NAME = "MessageConversation";

// Video mode options
export const VideoMode = z.enum(["text", "message"]);
export type VideoModeType = z.infer<typeof VideoMode>;

// Text animation style options
export const TextAnimationStyle = z.enum(["typing", "magical"]);
export type TextAnimationStyleType = z.infer<typeof TextAnimationStyle>;

// Background style options
export const BackgroundStyle = z.enum([
  "shooting-stars",
  "ice-galaxy",
  "hyperspeed",
  "black",
  "white",
]);
export type BackgroundStyleType = z.infer<typeof BackgroundStyle>;

// Platform theme options for message conversation
export const PlatformTheme = z.enum(["slack", "discord", "imessage"]);
export type PlatformThemeType = z.infer<typeof PlatformTheme>;

// Display mode options for message conversation
export const DisplayMode = z.enum(["auto-scroll", "one-at-a-time", "paired"]);
export type DisplayModeType = z.infer<typeof DisplayMode>;

// Video format/aspect ratio options
export const VideoFormat = z.enum([
  "landscape", // 16:9 - YouTube, standard
  "portrait", // 9:16 - Instagram Reels, TikTok, YouTube Shorts
  "square", // 1:1 - Instagram Feed
  "story", // 9:16 - Instagram/Facebook Stories
]);
export type VideoFormatType = z.infer<typeof VideoFormat>;

// Video format configurations
export interface VideoFormatConfig {
  width: number;
  height: number;
  label: string;
  description: string;
}

export const VIDEO_FORMAT_CONFIGS: Record<VideoFormatType, VideoFormatConfig> = {
  landscape: {
    width: 1280,
    height: 720,
    label: "Landscape (16:9)",
    description: "YouTube, Standard",
  },
  portrait: {
    width: 1080,
    height: 1920,
    label: "Portrait (9:16)",
    description: "Reels, TikTok, Shorts",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "Square (1:1)",
    description: "Instagram Feed",
  },
  story: {
    width: 1080,
    height: 1920,
    label: "Story (9:16)",
    description: "Instagram/FB Stories",
  },
};

// Helper to get dimensions for a format
export const getFormatDimensions = (format: VideoFormatType) => {
  return VIDEO_FORMAT_CONFIGS[format];
};

// Message schema
export const Message = z.object({
  id: z.string(),
  text: z.string(),
  sender: z.enum(["sender", "receiver"]),
});
export type MessageType = z.infer<typeof Message>;

// Text composition props
export const CompositionProps = z.object({
  title: z.string(),
  textAnimation: TextAnimationStyle.default("magical"),
  background: BackgroundStyle.default("black"),
});

// Message conversation composition props
export const MessageConversationProps = z.object({
  senderName: z.string().default("Sender"),
  receiverName: z.string().default("Receiver"),
  messages: z.array(Message).default([]),
  platformTheme: PlatformTheme.default("imessage"),
  displayMode: DisplayMode.default("auto-scroll"),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
  textAnimation: "magical",
  background: "black",
};

export const defaultMessageConversationProps: z.infer<typeof MessageConversationProps> = {
  senderName: "Alice",
  receiverName: "Bob",
  messages: [
    { id: "1", text: "Hey! How are you?", sender: "sender" },
    { id: "2", text: "I'm doing great, thanks!", sender: "receiver" },
  ],
  platformTheme: "imessage",
  displayMode: "auto-scroll",
};

export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

// Typing animation settings (for text mode)
export const CHARS_PER_SECOND = 10; // Characters typed per second
export const INTRO_FRAMES = 30; // Frames before text starts
export const OUTRO_FRAMES = 90; // Frames after text completes (3 seconds at 30fps)

// Message conversation timing constants
export const MSG_TYPING_DURATION_FRAMES = 45; // 1.5 seconds at 30fps
export const MSG_DISPLAY_FRAMES = 60; // 2 seconds at 30fps
export const MSG_TRANSITION_FRAMES = 15; // 0.5 seconds at 30fps
export const MSG_INTRO_FRAMES = 30; // 1 second intro
export const MSG_OUTRO_FRAMES = 60; // 2 seconds outro

// Calculate duration based on text and animation type (for text mode)
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

// Calculate duration for message conversation mode
export const calculateMessageDuration = (
  messageCount: number,
  displayMode: DisplayModeType
): number => {
  if (messageCount === 0) {
    return MSG_INTRO_FRAMES + MSG_OUTRO_FRAMES;
  }

  switch (displayMode) {
    case "auto-scroll":
      // Auto-scroll: intro + (messages * (typing + display)) + outro
      return (
        MSG_INTRO_FRAMES +
        messageCount * (MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES) +
        MSG_OUTRO_FRAMES
      );

    case "one-at-a-time":
      // One-at-a-time: intro + (messages * (typing + display + transition)) + outro
      return (
        MSG_INTRO_FRAMES +
        messageCount * (MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES) +
        MSG_OUTRO_FRAMES
      );

    case "paired":
      // Paired: intro + (pairs * (2 * typing + display + transition)) + outro
      const pairCount = Math.ceil(messageCount / 2);
      return (
        MSG_INTRO_FRAMES +
        pairCount * (2 * MSG_TYPING_DURATION_FRAMES + MSG_DISPLAY_FRAMES + MSG_TRANSITION_FRAMES) +
        MSG_OUTRO_FRAMES
      );

    default:
      return MSG_INTRO_FRAMES + MSG_OUTRO_FRAMES;
  }
};

// Default duration for backward compatibility
export const DURATION_IN_FRAMES = 200;
