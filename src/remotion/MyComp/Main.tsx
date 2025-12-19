import { z } from "zod";
import { AbsoluteFill, Sequence } from "remotion";
import { CompositionProps, INTRO_FRAMES } from "../../../types/constants";
import { MagicalText } from "./TextFade";
import { TypingText } from "./TypingText";
import { BackgroundRenderer } from "./BackgroundRenderer";
import { getTextColorForBackground } from "./backgrounds/SolidBackground";

export const Main = ({
  title,
  textAnimation = "magical",
  background = "black",
}: z.infer<typeof CompositionProps>) => {
  const textColor = getTextColorForBackground(background);

  return (
    <AbsoluteFill>
      {/* Background layer */}
      <BackgroundRenderer background={background} />

      {/* Text animation layer - starts after intro */}
      <Sequence from={INTRO_FRAMES}>
        {textAnimation === "typing" ? (
          <TypingText text={title} color={textColor} />
        ) : (
          <MagicalText text={title} color={textColor} />
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
