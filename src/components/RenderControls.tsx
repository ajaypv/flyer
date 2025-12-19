import { z } from "zod";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";
import { AnimationStyleSelector } from "./AnimationStyleSelector";
import { BackgroundSelector } from "./BackgroundSelector";
import { PlatformThemeSelector } from "./PlatformThemeSelector";
import { DisplayModeSelector } from "./DisplayModeSelector";
import { ConversationEditor } from "./ConversationEditor";
import { VideoFormatSelector } from "./VideoFormatSelector";
import { ZoomLevelSelector } from "./ZoomLevelSelector";
import {
  COMP_NAME,
  MESSAGE_COMP_NAME,
  CompositionProps,
  MessageConversationProps,
  TextAnimationStyleType,
  BackgroundStyleType,
  VideoModeType,
  VideoFormatType,
  VIDEO_FORMAT_CONFIGS,
  PlatformThemeType,
  DisplayModeType,
  MessageType,
  VIDEO_FPS,
} from "../../types/constants";
import { useRendering } from "../helpers/use-rendering";

export const RenderControls: React.FC<{
  videoMode: VideoModeType;
  // Video format props
  videoFormat: VideoFormatType;
  setVideoFormat: React.Dispatch<React.SetStateAction<VideoFormatType>>;
  // Text mode props
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  textAnimation: TextAnimationStyleType;
  setTextAnimation: React.Dispatch<React.SetStateAction<TextAnimationStyleType>>;
  background: BackgroundStyleType;
  setBackground: React.Dispatch<React.SetStateAction<BackgroundStyleType>>;
  inputProps: z.infer<typeof CompositionProps>;
  // Message mode props
  senderName: string;
  setSenderName: React.Dispatch<React.SetStateAction<string>>;
  senderAvatarUrl: string;
  setSenderAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  senderHandle: string;
  setSenderHandle: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  receiverAvatarUrl: string;
  setReceiverAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  receiverHandle: string;
  setReceiverHandle: React.Dispatch<React.SetStateAction<string>>;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  platformTheme: PlatformThemeType;
  setPlatformTheme: React.Dispatch<React.SetStateAction<PlatformThemeType>>;
  displayMode: DisplayModeType;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayModeType>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  messageInputProps: z.infer<typeof MessageConversationProps>;
  // Common props
  durationInFrames: number;
}> = ({
  videoMode,
  videoFormat,
  setVideoFormat,
  text,
  setText,
  textAnimation,
  setTextAnimation,
  background,
  setBackground,
  inputProps,
  senderName,
  setSenderName,
  senderAvatarUrl,
  setSenderAvatarUrl,
  senderHandle,
  setSenderHandle,
  receiverName,
  setReceiverName,
  receiverAvatarUrl,
  setReceiverAvatarUrl,
  receiverHandle,
  setReceiverHandle,
  messages,
  setMessages,
  platformTheme,
  setPlatformTheme,
  displayMode,
  setDisplayMode,
  zoomLevel,
  setZoomLevel,
  messageInputProps,
  durationInFrames,
}) => {
  // Use appropriate composition based on mode
  const compName = videoMode === "text" ? COMP_NAME : MESSAGE_COMP_NAME;
  const compProps = videoMode === "text" ? inputProps : messageInputProps;

  const { renderMedia, state, undo } = useRendering(compName, compProps);
  const isDisabled = state.status === "invoking";

  // Calculate estimated video duration in seconds
  const estimatedDuration = Math.round(durationInFrames / VIDEO_FPS);

  // Get format info for display
  const formatConfig = VIDEO_FORMAT_CONFIGS[videoFormat];

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          {/* Video Format Selector - shown for both modes */}
          <VideoFormatSelector
            value={videoFormat}
            onChange={setVideoFormat}
            disabled={isDisabled}
          />

          {videoMode === "text" ? (
            // Text mode controls
            <>
              <Input disabled={isDisabled} setText={setText} text={text} />
              <Spacing />
              <AnimationStyleSelector
                value={textAnimation}
                onChange={setTextAnimation}
                disabled={isDisabled}
              />
              <BackgroundSelector
                value={background}
                onChange={setBackground}
                disabled={isDisabled}
              />
            </>
          ) : (
            // Message conversation controls
            <>
              <PlatformThemeSelector
                value={platformTheme}
                onChange={setPlatformTheme}
                disabled={isDisabled}
              />
              <DisplayModeSelector
                value={displayMode}
                onChange={setDisplayMode}
                disabled={isDisabled}
              />
              <ZoomLevelSelector
                value={zoomLevel}
                onChange={setZoomLevel}
                disabled={isDisabled}
              />
              <ConversationEditor
                senderName={senderName}
                setSenderName={setSenderName}
                senderAvatarUrl={senderAvatarUrl}
                setSenderAvatarUrl={setSenderAvatarUrl}
                senderHandle={senderHandle}
                setSenderHandle={setSenderHandle}
                receiverName={receiverName}
                setReceiverName={setReceiverName}
                receiverAvatarUrl={receiverAvatarUrl}
                setReceiverAvatarUrl={setReceiverAvatarUrl}
                receiverHandle={receiverHandle}
                setReceiverHandle={setReceiverHandle}
                messages={messages}
                setMessages={setMessages}
                platformTheme={platformTheme}
                disabled={isDisabled}
              />
            </>
          )}
          <div className="text-sm text-subtitle mb-2">
            {formatConfig.width}x{formatConfig.height} • {estimatedDuration}s
          </div>
          <Spacing />
          <AlignEnd>
            <Button
              disabled={isDisabled || (videoMode === "message" && messages.length === 0)}
              loading={isDisabled}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message} />
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing />
          <AlignEnd>
            <DownloadButton undo={undo} state={state} />
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
