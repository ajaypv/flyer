import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SectionValue } from "../../../../types/video-content";
import { KineticHeadline } from "../typography/KineticHeadline";
import { RevealText } from "../typography/RevealText";

export interface ImageHeroSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const ImageHeroScene: React.FC<ImageHeroSceneProps> = ({
    section,
    progress,
    textColor,
    secondaryTextColor,
    durationFrames,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const image = section.image;

    // Ken Burns effect for image
    const kenBurnsScale = interpolate(
        frame,
        [0, durationFrames],
        [1, 1.1],
        {
            extrapolateRight: "clamp",
        }
    );

    // Subtle pan
    const kenBurnsPan = interpolate(
        frame,
        [0, durationFrames],
        [0, -3],
        {
            extrapolateRight: "clamp",
        }
    );

    // Entrance animation
    const entranceSpring = spring({
        fps,
        frame,
        config: {
            damping: 20,
            stiffness: 80,
            mass: 0.8,
        },
        durationInFrames: 35,
    });

    const opacity = interpolate(entranceSpring, [0, 0.4], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Determine layout based on image position
    const isFullscreen = image?.position === "fullscreen" || image?.position === "background";
    const isLeft = image?.position === "left";
    const isRight = image?.position === "right";

    return (
        <AbsoluteFill style={{ opacity }}>
            {/* Fullscreen/Background Image */}
            {isFullscreen && image && (
                <AbsoluteFill>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <Img
                            src={image.url}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: image.fit || "cover",
                                transform: `scale(${kenBurnsScale}) translateX(${kenBurnsPan}%)`,
                            }}
                        />
                        {/* Overlay gradient for text readability */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
                            }}
                        />
                    </div>
                </AbsoluteFill>
            )}

            {/* Split layout (image + text) */}
            {(isLeft || isRight) && (
                <AbsoluteFill
                    style={{
                        flexDirection: isRight ? "row-reverse" : "row",
                        display: "flex",
                    }}
                >
                    {/* Image side */}
                    {image && (
                        <div
                            style={{
                                flex: 1,
                                overflow: "hidden",
                            }}
                        >
                            <Img
                                src={image.url}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: image.fit || "cover",
                                    transform: `scale(${kenBurnsScale})`,
                                }}
                            />
                        </div>
                    )}

                    {/* Text side */}
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "8%",
                            gap: 20,
                        }}
                    >
                        {section.headline && (
                            <KineticHeadline
                                text={section.headline}
                                color={textColor}
                                fontSize={44}
                                fontWeight={700}
                                textAlign="left"
                                animation="word-by-word"
                            />
                        )}
                        {section.body && (
                            <RevealText
                                text={section.body}
                                color={secondaryTextColor}
                                fontSize={20}
                                textAlign="left"
                                animation="line-by-line"
                            />
                        )}
                    </div>
                </AbsoluteFill>
            )}

            {/* Center image with text overlay (default) */}
            {!isFullscreen && !isLeft && !isRight && image && (
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 24,
                        }}
                    >
                        <Img
                            src={image.url}
                            style={{
                                maxWidth: "60%",
                                maxHeight: "50%",
                                objectFit: "contain",
                                borderRadius: 16,
                                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                transform: `scale(${kenBurnsScale * 0.95})`,
                            }}
                        />
                        {section.headline && (
                            <KineticHeadline
                                text={section.headline}
                                color={textColor}
                                fontSize={36}
                                fontWeight={600}
                                textAlign="center"
                                animation="word-by-word"
                            />
                        )}
                    </div>
                </AbsoluteFill>
            )}

            {/* Text overlay for fullscreen images */}
            {isFullscreen && (
                <AbsoluteFill
                    style={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "10%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        {section.headline && (
                            <KineticHeadline
                                text={section.headline}
                                color={textColor}
                                fontSize={48}
                                fontWeight={700}
                                textAlign="center"
                                animation="word-by-word"
                            />
                        )}
                        {section.body && (
                            <RevealText
                                text={section.body}
                                color={secondaryTextColor}
                                fontSize={20}
                                textAlign="center"
                                animation="fade"
                            />
                        )}
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};
