"use client";

import React, { useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { usePlayerContext } from "./EditorLayout";

interface VideoPlayerProps {
  component: React.ComponentType<any>;
  inputProps: any;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper around Remotion Player that registers with EditorLayout for export
 */
export function VideoPlayer({
  component,
  inputProps,
  durationInFrames,
  fps,
  width,
  height,
  className,
  style,
}: VideoPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const playerContext = usePlayerContext();

  // Register player ref with EditorLayout
  useEffect(() => {
    if (playerContext && playerRef.current) {
      playerContext.setPlayerRef(playerRef.current);
    }
    return () => {
      if (playerContext) {
        playerContext.setPlayerRef(null);
      }
    };
  }, [playerContext]);

  return (
    <Player
      ref={playerRef}
      component={component}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionHeight={height}
      compositionWidth={width}
      style={{ width: "100%", ...style }}
      className={className}
      controls
      autoPlay
      loop
    />
  );
}
