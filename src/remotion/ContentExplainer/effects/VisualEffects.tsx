import React from "react";
import { AbsoluteFill } from "remotion";
import { VisualStyleType } from "../../../../types/video-content";

export interface VisualEffectsProps {
    visualStyle?: VisualStyleType;
    children: React.ReactNode;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({
    visualStyle,
    children,
}) => {
    // If no visual style, just render children
    if (!visualStyle) {
        return <AbsoluteFill>{children}</AbsoluteFill>;
    }

    // Build filter string
    const filters: string[] = [];

    // Color grading
    switch (visualStyle.colorGrade) {
        case "cinematic-warm":
            filters.push("sepia(0.15)", "saturate(1.1)");
            break;
        case "cinematic-cool":
            filters.push("hue-rotate(-10deg)", "saturate(0.95)");
            break;
        case "vintage":
            filters.push("sepia(0.3)", "contrast(0.95)", "saturate(0.85)");
            break;
        case "high-contrast":
            filters.push("contrast(1.15)", "saturate(1.1)");
            break;
        case "monochrome":
            filters.push("grayscale(1)");
            break;
        case "neon":
            filters.push("saturate(1.4)", "contrast(1.1)");
            break;
        case "muted":
            filters.push("saturate(0.7)", "contrast(0.95)");
            break;
    }

    const filterString = filters.length > 0 ? filters.join(" ") : undefined;

    // Vignette effect
    const vignetteStyle: React.CSSProperties | undefined = visualStyle.vignette?.enabled
        ? {
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${visualStyle.vignette.intensity ?? 0.3}) 100%)`,
            pointerEvents: "none",
        }
        : undefined;

    // Bloom effect (simplified as a glow overlay)
    const bloomStyle: React.CSSProperties | undefined = visualStyle.bloom?.enabled
        ? {
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${(visualStyle.bloom.intensity ?? 0.2) * 2}px)`,
            opacity: visualStyle.bloom.intensity ?? 0.2,
            pointerEvents: "none",
            mixBlendMode: "screen" as const,
        }
        : undefined;

    // Grain effect (using pseudo-noise background)
    const grainStyle: React.CSSProperties | undefined = visualStyle.grain?.enabled
        ? {
            position: "absolute",
            inset: 0,
            opacity: visualStyle.grain.intensity ?? 0.1,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay" as const,
        }
        : undefined;

    return (
        <AbsoluteFill style={{ filter: filterString }}>
            {children}

            {/* Vignette overlay */}
            {vignetteStyle && <div style={vignetteStyle as React.CSSProperties} />}

            {/* Bloom overlay */}
            {bloomStyle && <div style={bloomStyle as React.CSSProperties} />}

            {/* Grain overlay */}
            {grainStyle && <div style={grainStyle as React.CSSProperties} />}
        </AbsoluteFill>
    );
};
