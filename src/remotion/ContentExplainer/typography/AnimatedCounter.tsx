import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
    subsets: ["latin"],
    weights: ["700", "800"],
});

export interface AnimatedCounterProps {
    value: string;
    label: string;
    prefix?: string;
    suffix?: string;
    color?: string;
    labelColor?: string;
    fontSize?: number;
    labelFontSize?: number;
    animateAs?: "counter" | "static";
    delay?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    label,
    prefix = "",
    suffix = "",
    color = "#ffffff",
    labelColor = "#aaaaaa",
    fontSize = 72,
    labelFontSize = 20,
    animateAs = "counter",
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Parse numeric value for counter animation
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ""));
    const hasNumericValue = !isNaN(numericValue);

    // Spring for entrance animation
    const entranceSpring = spring({
        fps,
        frame: frame - delay,
        config: {
            damping: 15,
            stiffness: 100,
            mass: 0.8,
        },
        durationInFrames: 30,
    });

    // Counter animation (takes longer)
    const counterProgress = interpolate(
        frame - delay,
        [0, 45],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Calculate displayed value
    const displayedValue = React.useMemo(() => {
        if (!hasNumericValue || animateAs === "static") {
            return value;
        }

        // Animate from 0 to target value
        const currentValue = numericValue * counterProgress;

        // Format based on original value format
        if (value.includes(".")) {
            const decimals = value.split(".")[1]?.replace(/[^0-9]/g, "").length || 0;
            return currentValue.toFixed(decimals);
        }

        return Math.round(currentValue).toString();
    }, [value, numericValue, hasNumericValue, animateAs, counterProgress]);

    // Scale animation for pop effect
    const scale = interpolate(entranceSpring, [0, 0.8, 1], [0.5, 1.1, 1], {
        extrapolateRight: "clamp",
    });

    // Opacity
    const opacity = interpolate(entranceSpring, [0, 0.3], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Blur effect
    const blur = interpolate(entranceSpring, [0, 0.5, 1], [5, 1, 0]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity,
                transform: `scale(${scale})`,
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
        >
            {/* Value */}
            <div
                style={{
                    fontFamily,
                    fontSize,
                    fontWeight: 800,
                    color,
                    letterSpacing: "-0.02em",
                }}
            >
                {prefix}
                {displayedValue}
                {suffix}
            </div>

            {/* Label */}
            <div
                style={{
                    fontFamily,
                    fontSize: labelFontSize,
                    fontWeight: 500,
                    color: labelColor,
                    marginTop: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                }}
            >
                {label}
            </div>
        </div>
    );
};

// Grid layout for multiple counters
export interface CounterGridProps {
    items: AnimatedCounterProps[];
    columns?: number;
    gap?: number;
}

export const CounterGrid: React.FC<CounterGridProps> = ({
    items,
    columns = 2,
    gap = 48,
}) => {
    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: "10%",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap,
                    width: "100%",
                    maxWidth: 800,
                }}
            >
                {items.map((item, index) => (
                    <AnimatedCounter
                        key={index}
                        {...item}
                        delay={index * 10}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};
