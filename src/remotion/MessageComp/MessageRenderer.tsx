import React from "react";
import { MessageType, PlatformThemeType } from "../../../types/constants";
import { SlackMessage } from "./themes/SlackMessage";
import { DiscordMessage } from "./themes/DiscordMessage";
import { IMessageBubble } from "./themes/IMessageBubble";
import { TwitterMessage } from "./themes/TwitterMessage";

interface MessageRendererProps {
  message: MessageType;
  senderName: string;
  senderAvatarUrl?: string;
  senderHandle?: string;
  receiverName: string;
  receiverAvatarUrl?: string;
  receiverHandle?: string;
  platformTheme: PlatformThemeType;
  animationProgress: number;
  messageIndex?: number;
  isReply?: boolean;
  zoomLevel?: number;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  senderName,
  senderAvatarUrl,
  senderHandle,
  receiverName,
  receiverAvatarUrl,
  receiverHandle,
  platformTheme,
  animationProgress,
  messageIndex = 0,
  isReply = false,
  zoomLevel = 1.0,
}) => {
  switch (platformTheme) {
    case "slack":
      return (
        <SlackMessage
          message={message}
          senderName={senderName}
          senderAvatarUrl={senderAvatarUrl}
          receiverName={receiverName}
          receiverAvatarUrl={receiverAvatarUrl}
          animationProgress={animationProgress}
          zoomLevel={zoomLevel}
        />
      );
    case "discord":
      return (
        <DiscordMessage
          message={message}
          senderName={senderName}
          senderAvatarUrl={senderAvatarUrl}
          receiverName={receiverName}
          receiverAvatarUrl={receiverAvatarUrl}
          animationProgress={animationProgress}
          zoomLevel={zoomLevel}
        />
      );
    case "twitter":
      return (
        <TwitterMessage
          message={message}
          senderName={senderName}
          senderHandle={senderHandle || "@user"}
          senderAvatarUrl={senderAvatarUrl}
          receiverName={receiverName}
          receiverHandle={receiverHandle || "@user"}
          receiverAvatarUrl={receiverAvatarUrl}
          animationProgress={animationProgress}
          messageIndex={messageIndex}
          isReply={isReply}
          zoomLevel={zoomLevel}
        />
      );
    case "imessage":
    default:
      return (
        <IMessageBubble
          message={message}
          senderName={senderName}
          receiverName={receiverName}
          animationProgress={animationProgress}
          zoomLevel={zoomLevel}
        />
      );
  }
};
