import React from "react";
import { MessageType, PlatformThemeType } from "../../../types/constants";
import { SlackMessage } from "./themes/SlackMessage";
import { DiscordMessage } from "./themes/DiscordMessage";
import { IMessageBubble } from "./themes/IMessageBubble";

interface MessageRendererProps {
  message: MessageType;
  senderName: string;
  receiverName: string;
  platformTheme: PlatformThemeType;
  animationProgress: number;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  senderName,
  receiverName,
  platformTheme,
  animationProgress,
}) => {
  switch (platformTheme) {
    case "slack":
      return (
        <SlackMessage
          message={message}
          senderName={senderName}
          receiverName={receiverName}
          animationProgress={animationProgress}
        />
      );
    case "discord":
      return (
        <DiscordMessage
          message={message}
          senderName={senderName}
          receiverName={receiverName}
          animationProgress={animationProgress}
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
        />
      );
  }
};
