import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";
import { TypewriterText, TypewriterBlock } from "../typography/TypewriterText";

export interface CodeSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const CodeScene: React.FC<CodeSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    // Fade in container
    const opacity = interpolate(frame, [0, 15], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Get code lines from body or bullets
    const codeLines = section.bullets || (section.body ? section.body.split("\n") : []);

    return (
        <AbsoluteFill
            style={{
                padding: "8%",
                opacity,
            }}
        >
            {/* Terminal-style container */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* Header with title */}
                {section.headline && (
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontSize: 36,
                                fontWeight: 600,
                                color: textColor,
                                margin: 0,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {section.headline}
                        </h2>
                        {section.subheadline && (
                            <p
                                style={{
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    fontSize: 18,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    marginTop: 8,
                                    opacity: 0.8,
                                }}
                            >
                                {section.subheadline}
                            </p>
                        )}
                    </div>
                )}

                {/* Code block container */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: 16,
                        padding: 32,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    {/* Terminal header */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 20,
                        }}
                    >
                        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27c93f" }} />
                    </div>

                    {/* Typing content */}
                    {codeLines.length > 0 ? (
                        <TypewriterBlock
                            lines={codeLines}
                            color="#00ff88"
                            fontSize={20}
                            speed={0.5}
                            lineDelay={40}
                        />
                    ) : section.body ? (
                        <TypewriterText
                            text={section.body}
                            color="#00ff88"
                            fontSize={20}
                            speed={0.6}
                        />
                    ) : null}
                </div>
            </div>
        </AbsoluteFill>
    );
};
