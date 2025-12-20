import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { SectionValue, VisualStyleType } from "../../../types/video-content";
import { SceneRenderer } from "./SceneRenderer";
import { TransitionOverlay } from "./effects/TransitionOverlay";

export interface SectionTiming {
    startFrame: number;
    durationFrames: number;
    transitionFrames: number;
    endFrame: number;
}

export interface SceneManagerProps {
    sections: SectionValue[];
    sectionTimings: SectionTiming[];
    globalVisualStyle?: VisualStyleType;
    colorScheme: "dark" | "light" | "brand";
}

export const SceneManager: React.FC<SceneManagerProps> = ({
    sections,
    sectionTimings,
    globalVisualStyle,
    colorScheme,
}) => {
    const frame = useCurrentFrame();

    // Determine which section is currently active
    const getCurrentSectionIndex = () => {
        for (let i = 0; i < sectionTimings.length; i++) {
            const timing = sectionTimings[i];
            if (frame >= timing.startFrame && frame < timing.endFrame) {
                return i;
            }
        }
        return sectionTimings.length - 1;
    };

    const currentSectionIndex = getCurrentSectionIndex();

    return (
        <>
            {sections.map((section, index) => {
                const timing = sectionTimings[index];
                const nextSection = sections[index + 1];

                // Merge global visual style with section-specific
                const mergedVisualStyle = {
                    ...globalVisualStyle,
                    ...section.visualStyle,
                };

                return (
                    <React.Fragment key={section.id}>
                        {/* Scene Content */}
                        <Sequence
                            from={timing.startFrame}
                            durationInFrames={timing.durationFrames}
                            name={`Scene: ${section.type} - ${section.id}`}
                        >
                            <SceneRenderer
                                section={section}
                                timing={timing}
                                visualStyle={mergedVisualStyle as VisualStyleType}
                                colorScheme={colorScheme}
                                isActive={currentSectionIndex === index}
                            />
                        </Sequence>

                        {/* Transition Overlay (between this section and next) */}
                        {nextSection && section.transition && (
                            <Sequence
                                from={timing.endFrame - timing.transitionFrames}
                                durationInFrames={timing.transitionFrames * 2}
                                name={`Transition: ${section.id} → ${nextSection.id}`}
                            >
                                <TransitionOverlay
                                    transition={section.transition}
                                    durationFrames={timing.transitionFrames * 2}
                                />
                            </Sequence>
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};
