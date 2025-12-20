import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionValue } from "../../../../types/video-content";

export interface QuoteSceneProps {
    section: SectionValue;
    progress: number;
    textColor: string;
    secondaryTextColor: string;
    durationFrames: number;
}

export const QuoteScene: React.FC<QuoteSceneProps> = ({
    section,
    textColor,
    secondaryTextColor,
}) => {
    const frame = useCurrentFrame();

    // Quote fade in
    const quoteOpacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Attribution fades in after quote
    const attributionOpacity = interpolate(frame, [25, 50], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
    });

    const quote = section.quote || section.headline || "";
    const attribution = section.quoteAttribution || section.subheadline || "";

    return (
        <AbsoluteFill
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "12%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    maxWidth: "90%",
                    gap: 32,
                }}
            >
                {/* Quote with decorative marks */}
                <div
                    style={{
                        opacity: quoteOpacity,
                    }}
                >
                    {/* Opening quote mark */}
                    <span
                        style={{
                            fontFamily: "Georgia, serif",
                            fontSize: 120,
                            color: textColor,
                            opacity: 0.2,
                            lineHeight: 0.5,
                            display: "block",
                            marginBottom: -20,
                        }}
                    >
                        "
                    </span>

                    {/* Quote text */}
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 36,
                            fontWeight: 400,
                            fontStyle: "italic",
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.5,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {quote}
                    </p>
                </div>

                {/* Attribution */}
                {attribution && (
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 20,
                            fontWeight: 500,
                            color: secondaryTextColor,
                            opacity: attributionOpacity,
                            margin: 0,
                        }}
                    >
                        — {attribution}
                    </p>
                )}
            </div>
        </AbsoluteFill>
    );
};
