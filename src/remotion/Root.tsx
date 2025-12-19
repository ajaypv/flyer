import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { MessageConversation } from "./MessageComp/MessageConversation";
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
        durationInFrames={calculateMessageDuration(
          defaultMessageConversationProps.messages.length,
          defaultMessageConversationProps.displayMode
        )}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMessageConversationProps}
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
