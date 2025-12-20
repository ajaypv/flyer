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
export const PlatformTheme = z.enum(["slack", "discord", "imessage", "twitter"]);
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
  senderAvatarUrl: z.string().optional(),
  senderHandle: z.string().optional(),
  receiverName: z.string().default("Receiver"),
  receiverAvatarUrl: z.string().optional(),
  receiverHandle: z.string().optional(),
  messages: z.array(Message).default([]),
  platformTheme: PlatformTheme.default("imessage"),
  displayMode: DisplayMode.default("auto-scroll"),
  zoomLevel: z.number().min(0.5).max(2.0).default(1.0),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
  textAnimation: "magical",
  background: "black",
};

export const defaultMessageConversationProps: z.infer<typeof MessageConversationProps> = {
  senderName: "Elon Musk",
  senderAvatarUrl: "https://pbs.twimg.com/profile_images/1893803697185910784/Na5lOWi5_400x400.jpg",
  senderHandle: "@elonmusk",
  receiverName: "Mark Zuckerberg",
  receiverAvatarUrl: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg",
  receiverHandle: "@faborig",
  messages: [
    { id: "1", text: "Hey! How are you?", sender: "sender" },
    { id: "2", text: "I'm doing great, thanks!", sender: "receiver" },
  ],
  platformTheme: "imessage",
  displayMode: "auto-scroll",
  zoomLevel: 1.0,
};

export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

// Typing animation settings (for text mode)
export const CHARS_PER_SECOND = 10; // Characters typed per second
export const INTRO_FRAMES = 30; // Frames before text starts
export const OUTRO_FRAMES = 90; // Frames after text completes (3 seconds at 30fps)

// Message conversation timing in SECONDS (FPS-independent)
export const MSG_TYPING_DURATION_SECONDS = 1.5;
export const MSG_DISPLAY_SECONDS = 2;
export const MSG_TRANSITION_SECONDS = 0.5;
export const MSG_INTRO_SECONDS = 1;
export const MSG_OUTRO_SECONDS = 2;

// Message conversation timing constants at 30fps (for backward compatibility)
export const MSG_TYPING_DURATION_FRAMES = 45; // 1.5 seconds at 30fps
export const MSG_DISPLAY_FRAMES = 60; // 2 seconds at 30fps
export const MSG_TRANSITION_FRAMES = 15; // 0.5 seconds at 30fps
export const MSG_INTRO_FRAMES = 30; // 1 second intro
export const MSG_OUTRO_FRAMES = 60; // 2 seconds outro

// Helper to convert seconds to frames at given FPS
export const secondsToFrames = (seconds: number, fps: number = VIDEO_FPS): number => {
  return Math.round(seconds * fps);
};

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
// Supports dynamic FPS (30 or 60)
export const calculateMessageDuration = (
  messageCount: number,
  displayMode: DisplayModeType,
  fps: number = VIDEO_FPS
): number => {
  const typingFrames = secondsToFrames(MSG_TYPING_DURATION_SECONDS, fps);
  const displayFrames = secondsToFrames(MSG_DISPLAY_SECONDS, fps);
  const transitionFrames = secondsToFrames(MSG_TRANSITION_SECONDS, fps);
  const introFrames = secondsToFrames(MSG_INTRO_SECONDS, fps);
  const outroFrames = secondsToFrames(MSG_OUTRO_SECONDS, fps);

  if (messageCount === 0) {
    return introFrames + outroFrames;
  }

  switch (displayMode) {
    case "auto-scroll":
      // Auto-scroll: intro + (messages * (typing + display)) + outro
      return (
        introFrames +
        messageCount * (typingFrames + displayFrames) +
        outroFrames
      );

    case "one-at-a-time":
      // One-at-a-time: intro + (messages * (typing + display + transition)) + outro
      return (
        introFrames +
        messageCount * (typingFrames + displayFrames + transitionFrames) +
        outroFrames
      );

    case "paired":
      // Paired: intro + (pairs * (2 * typing + display + transition)) + outro
      const pairCount = Math.ceil(messageCount / 2);
      return (
        introFrames +
        pairCount * (2 * typingFrames + displayFrames + transitionFrames) +
        outroFrames
      );

    default:
      return introFrames + outroFrames;
  }
};

// Default duration for backward compatibility
export const DURATION_IN_FRAMES = 200;

// Default celebrity avatars for quick selection
export interface DefaultAvatar {
  name: string;
  url: string;
  handle: string;
}

export const DEFAULT_AVATARS: DefaultAvatar[] = [
  {
    name: "Elon Musk",
    url: "https://pbs.twimg.com/profile_images/1893803697185910784/Na5lOWi5_400x400.jpg",
    handle: "@elonmusk",
  },
  {
    name: "Mark Zuckerberg",
    url: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg",
    handle: "@faborig",
  },
  {
    name: "Bill Gates",
    url: "https://pbs.twimg.com/profile_images/1674501931842482176/ga4OaPTn_400x400.jpg",
    handle: "@BillGates",
  },
  {
    name: "Jeff Bezos",
    url: "https://pbs.twimg.com/profile_images/1746927278639517696/P3_b4nkd_400x400.jpg",
    handle: "@JeffBezos",
  },
  {
    name: "Sundar Pichai",
    url: "https://pbs.twimg.com/profile_images/864282616597405701/M-FEJMZ0_400x400.jpg",
    handle: "@sundarpichai",
  },
  {
    name: "Tim Cook",
    url: "https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg",
    handle: "@tim_cook",
  },
];
