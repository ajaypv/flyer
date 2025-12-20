import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
    SectionValue,
    VisualStyleType,
} from "../../../types/video-content";
import { SectionTiming } from "./SceneManager";

// Scene components (will be implemented)
import { IntroScene } from "./scenes/IntroScene";
import { HeadlineScene } from "./scenes/HeadlineScene";
import { BulletListScene } from "./scenes/BulletListScene";
import { StatsScene } from "./scenes/StatsScene";
import { OutroScene } from "./scenes/OutroScene";
import { ImageHeroScene } from "./scenes/ImageHeroScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { QuoteScene } from "./scenes/QuoteScene";

// Effects
import { CameraMotion } from "./effects/CameraMotion";
import { VisualEffects } from "./effects/VisualEffects";

export interface SceneRendererProps {
    section: SectionValue;
    timing: SectionTiming;
    visualStyle?: VisualStyleType;
    colorScheme: "dark" | "light" | "brand";
    isActive: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
    section,
    timing,
    visualStyle,
    colorScheme,
    isActive,
}) => {
    const frame = useCurrentFrame();
    useVideoConfig();

    // Calculate progress within this section (0 to 1)
    const progress = Math.min(1, Math.max(0, frame / timing.durationFrames));

    // Get text color based on color scheme
    const textColor = colorScheme === "light" ? "#000000" : "#ffffff";
    const secondaryTextColor = colorScheme === "light" ? "#666666" : "#aaaaaa";

    // Render the appropriate scene component based on section type
    const renderScene = () => {
        const commonProps = {
            section,
            progress,
            textColor,
            secondaryTextColor,
            durationFrames: timing.durationFrames,
        };

        switch (section.type) {
            case "intro":
                return <IntroScene {...commonProps} />;
            case "headline":
                return <HeadlineScene {...commonProps} />;
            case "bullet_list":
                return <BulletListScene {...commonProps} />;
            case "stats":
                return <StatsScene {...commonProps} />;
            case "image_hero":
                return <ImageHeroScene {...commonProps} />;
            case "comparison":
                return <ComparisonScene {...commonProps} />;
            case "quote":
                return <QuoteScene {...commonProps} />;
            case "outro":
                return <OutroScene {...commonProps} />;
            default:
                return <HeadlineScene {...commonProps} />;
        }
    };

    return (
        <AbsoluteFill>
            {/* Camera Motion Wrapper */}
            <CameraMotion
                camera={section.camera}
                durationFrames={timing.durationFrames}
            >
                {/* Visual Effects Layer */}
                <VisualEffects visualStyle={visualStyle}>
                    {/* Scene Content */}
                    {renderScene()}
                </VisualEffects>
            </CameraMotion>
        </AbsoluteFill>
    );
};
