import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
    VideoContentInputType,
    calculateSectionDuration,
    VIDEO_CONTENT_FPS,
} from "../../../types/video-content";
import { DAILY_AI_NEWS_TEMPLATE } from "../../../types/presets";
import { ContentBackgroundRenderer } from "./backgrounds/BackgroundRenderer";
import { SceneManager } from "./SceneManager";
import { BackgroundAudio, AudioTrackId } from "./audio/BackgroundAudio";

export interface ContentExplainerProps {
    content?: VideoContentInputType;
    audioTrackId?: AudioTrackId;
    audioVolume?: number;
}

export const ContentExplainer: React.FC<ContentExplainerProps> = ({
    content = DAILY_AI_NEWS_TEMPLATE,
    audioTrackId = "none",
    audioVolume = 0.3,
}) => {
    const { fps } = useVideoConfig();

    // Calculate frame timings for each section
    const sectionTimings = React.useMemo(() => {
        let currentFrame = 0;
        return content.sections.map((section) => {
            const durationSeconds = calculateSectionDuration(section);
            const durationFrames = Math.ceil(durationSeconds * fps);
            const transitionDuration = section.transition?.duration ?? 0.5;
            const transitionFrames = Math.ceil(transitionDuration * fps);

            const timing = {
                startFrame: currentFrame,
                durationFrames,
                transitionFrames,
                endFrame: currentFrame + durationFrames,
            };

            currentFrame += durationFrames;
            return timing;
        });
    }, [content.sections, fps]);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: content.colorScheme === "light" ? "#ffffff" : "#000000",
            }}
        >
            {/* Background Audio */}
            <BackgroundAudio trackId={audioTrackId} volume={audioVolume} />

            {/* Global Background Layer */}
            <ContentBackgroundRenderer
                background={content.background}
                colorScheme={content.colorScheme}
                primaryColor={content.primaryColor}
                accentColor={content.accentColor}
            />

            {/* Scene Manager - Handles all sections */}
            <SceneManager
                sections={content.sections}
                sectionTimings={sectionTimings}
                globalVisualStyle={content.visualStyle}
                colorScheme={content.colorScheme}
                primaryColor={content.primaryColor}
                accentColor={content.accentColor}
            />
        </AbsoluteFill>
    );
};

// Calculate metadata for dynamic duration
export const calculateContentExplainerMetadata = (
    props: ContentExplainerProps
) => {
    const content = props.content || DAILY_AI_NEWS_TEMPLATE;
    const totalSeconds = content.sections.reduce((acc, section) => {
        return acc + calculateSectionDuration(section) + (section.transition?.duration ?? 0.5);
    }, 0);

    return {
        durationInFrames: Math.ceil(totalSeconds * VIDEO_CONTENT_FPS),
        fps: VIDEO_CONTENT_FPS,
    };
};

