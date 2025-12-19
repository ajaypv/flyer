"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  defaultMyCompProps,
  CompositionProps,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  TextAnimationStyleType,
  BackgroundStyleType,
  calculateDuration,
} from "../../types/constants";
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { Main } from "../remotion/MyComp/Main";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [textAnimation, setTextAnimation] = useState<TextAnimationStyleType>(
    defaultMyCompProps.textAnimation
  );
  const [background, setBackground] = useState<BackgroundStyleType>(
    defaultMyCompProps.background
  );

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
      textAnimation,
      background,
    };
  }, [text, textAnimation, background]);

  // Calculate dynamic duration based on text length and animation type
  const durationInFrames = useMemo(() => {
    return calculateDuration(text, textAnimation);
  }, [text, textAnimation]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <RenderControls
          text={text}
          setText={setText}
          textAnimation={textAnimation}
          setTextAnimation={setTextAnimation}
          background={background}
          setBackground={setBackground}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
        />
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
};

export default Home;
