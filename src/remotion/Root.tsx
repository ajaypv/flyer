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
import {
  VIDEO_FORMAT_DIMENSIONS,
  VIDEO_CONTENT_FPS,
  calculateTotalFrames,
} from "../../types/video-content";
import { DAILY_AI_NEWS_TEMPLATE } from "../../types/presets";
import { DEMO_LLM_EXPLAINER } from "../../types/demo-content";
import { NextLogo } from "./MyComp/NextLogo";
import { ContentExplainer, ContentExplainerProps } from "./ContentExplainer";

// Content Explainer composition name
export const CONTENT_EXPLAINER_COMP_NAME = "ContentExplainer";

// Default props for ContentExplainer - using demo content for preview
const defaultContentExplainerProps: ContentExplainerProps = {
  content: DEMO_LLM_EXPLAINER,
};

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
      {/* Content Explainer - Dynamic video content */}
      <Composition
        id={CONTENT_EXPLAINER_COMP_NAME}
        component={ContentExplainer}
        fps={VIDEO_CONTENT_FPS}
        width={VIDEO_FORMAT_DIMENSIONS.portrait.width}
        height={VIDEO_FORMAT_DIMENSIONS.portrait.height}
        defaultProps={defaultContentExplainerProps}
        calculateMetadata={({ props }) => {
          const typedProps = props as ContentExplainerProps;
          const content = typedProps.content || DAILY_AI_NEWS_TEMPLATE;
          // Get format dimensions
          const format = content.format || "portrait";
          const { width, height } = VIDEO_FORMAT_DIMENSIONS[format];

          // Calculate total duration from sections
          const durationInFrames = calculateTotalFrames(content.sections);

          return {
            durationInFrames: Math.max(durationInFrames, 60), // Minimum 2 seconds
            width,
            height,
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
