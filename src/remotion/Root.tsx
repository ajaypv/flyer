import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { MessageConversation, MessageConversationProps } from "./MessageComp/MessageConversation";
import {
  COMP_NAME,
  MESSAGE_COMP_NAME,
  defaultMyCompProps,
  defaultMessageConversationProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  calculateMessageDuration,
  DisplayModeType,
} from "../../types/constants";
import { NextLogo } from "./MyComp/NextLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id={MESSAGE_COMP_NAME}
        component={MessageConversation}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMessageConversationProps}
        calculateMetadata={({ props }: { props: MessageConversationProps }) => {
          // Dynamically calculate duration based on actual message count
          const messageCount = props.messages?.length ?? 0;
          const displayMode: DisplayModeType = props.displayMode ?? "auto-scroll";
          const durationInFrames = calculateMessageDuration(messageCount, displayMode);
          return {
            durationInFrames,
          };
        }}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
