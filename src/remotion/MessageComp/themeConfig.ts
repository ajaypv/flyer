import { PlatformThemeType } from "../../../types/constants";

export interface ThemeConfig {
  backgroundColor: string;
  senderBubbleColor: string;
  receiverBubbleColor: string;
  senderTextColor: string;
  receiverTextColor: string;
  fontFamily: string;
  fontSize: number;
  avatarStyle: "circle" | "rounded" | "none";
  typingIndicatorColor: string;
  messageAnimation: "slide-left" | "fade-scale" | "slide-up";
  usernameColor: string;
  timestampColor: string;
  // Twitter/X specific
  handleColor?: string;
  linkColor?: string;
  borderColor?: string;
}

export const themeConfigs: Record<PlatformThemeType, ThemeConfig> = {
  slack: {
    backgroundColor: "#1a1d21",
    senderBubbleColor: "transparent",
    receiverBubbleColor: "transparent",
    senderTextColor: "#d1d2d3",
    receiverTextColor: "#d1d2d3",
    fontFamily: "Lato, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 15,
    avatarStyle: "rounded",
    typingIndicatorColor: "#b9bbbe",
    messageAnimation: "slide-left",
    usernameColor: "#ffffff",
    timestampColor: "#616061",
  },
  discord: {
    backgroundColor: "#313338",
    senderBubbleColor: "transparent",
    receiverBubbleColor: "transparent",
    senderTextColor: "#dbdee1",
    receiverTextColor: "#dbdee1",
    fontFamily: "gg sans, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 16,
    avatarStyle: "circle",
    typingIndicatorColor: "#b5bac1",
    messageAnimation: "fade-scale",
    usernameColor: "#f3b3ce",
    timestampColor: "#949ba4",
  },
  imessage: {
    backgroundColor: "#000000",
    senderBubbleColor: "#007AFF",
    receiverBubbleColor: "#3C3C3E",
    senderTextColor: "#FFFFFF",
    receiverTextColor: "#FFFFFF",
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif",
    fontSize: 17,
    avatarStyle: "none",
    typingIndicatorColor: "#8E8E93",
    messageAnimation: "slide-up",
    usernameColor: "#8E8E93",
    timestampColor: "#8E8E93",
  },
  twitter: {
    backgroundColor: "#000000",
    senderBubbleColor: "transparent",
    receiverBubbleColor: "transparent",
    senderTextColor: "#E7E9EA",
    receiverTextColor: "#E7E9EA",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 15,
    avatarStyle: "circle",
    typingIndicatorColor: "#71767B",
    messageAnimation: "fade-scale",
    usernameColor: "#E7E9EA",
    timestampColor: "#71767B",
    handleColor: "#71767B",
    linkColor: "#1D9BF0",
    borderColor: "#2F3336",
  },
};

export const getThemeConfig = (theme: PlatformThemeType): ThemeConfig => {
  return themeConfigs[theme] || themeConfigs.imessage;
};

// Calculate scale factor based on video dimensions
// Portrait videos (9:16) need larger text since they're taller
export const getScaleFactor = (width: number, height: number): number => {
  const isPortrait = height > width;
  const isSquare = height === width;
  
  if (isPortrait) {
    // For portrait (1080x1920), scale up significantly
    return 2.2;
  } else if (isSquare) {
    // For square (1080x1080), moderate scale
    return 1.5;
  }
  // Landscape (1280x720) - base scale
  return 1;
};

// Get responsive theme config based on video dimensions
export const getResponsiveThemeConfig = (
  theme: PlatformThemeType,
  width: number,
  height: number
): ThemeConfig & { scale: number } => {
  const baseConfig = getThemeConfig(theme);
  const scale = getScaleFactor(width, height);
  
  return {
    ...baseConfig,
    fontSize: Math.round(baseConfig.fontSize * scale),
    scale,
  };
};
