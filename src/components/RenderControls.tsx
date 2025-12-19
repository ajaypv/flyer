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
import {
  COMP_NAME,
  CompositionProps,
  TextAnimationStyleType,
  BackgroundStyleType,
  VIDEO_FPS,
} from "../../types/constants";
import { useRendering } from "../helpers/use-rendering";

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  textAnimation: TextAnimationStyleType;
  setTextAnimation: React.Dispatch<React.SetStateAction<TextAnimationStyleType>>;
  background: BackgroundStyleType;
  setBackground: React.Dispatch<React.SetStateAction<BackgroundStyleType>>;
  inputProps: z.infer<typeof CompositionProps>;
  durationInFrames: number;
}> = ({
  text,
  setText,
  textAnimation,
  setTextAnimation,
  background,
  setBackground,
  inputProps,
  durationInFrames,
}) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);
  const isDisabled = state.status === "invoking";

  // Calculate estimated video duration in seconds
  const estimatedDuration = Math.round(durationInFrames / VIDEO_FPS);

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
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
          <div className="text-sm text-subtitle mb-2">
            Estimated duration: {estimatedDuration}s
          </div>
          <Spacing />
          <AlignEnd>
            <Button
              disabled={isDisabled}
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
