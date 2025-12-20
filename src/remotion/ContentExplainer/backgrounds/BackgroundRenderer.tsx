import React from "react";
import { BackgroundTypeValue } from "../../../../types/video-content";

// Import backgrounds
import { AuroraBorealis } from "./AuroraBorealis";
import { GradientMesh } from "./GradientMesh";
import { Grid3D } from "./Grid3D";

// Reuse existing backgrounds from MyComp
import { ShootingStars } from "../../MyComp/backgrounds/ShootingStars";
import { IceGalaxy } from "../../MyComp/backgrounds/IceGalaxy";
import { HyperspeedBackground } from "../../MyComp/backgrounds/HyperspeedBackground";
import { SolidBackground } from "../../MyComp/backgrounds/SolidBackground";

export interface ContentBackgroundRendererProps {
    background: BackgroundTypeValue;
    colorScheme: "dark" | "light" | "brand";
    primaryColor?: string;
    accentColor?: string;
}

export const ContentBackgroundRenderer: React.FC<ContentBackgroundRendererProps> = ({
    background,
    colorScheme,
    primaryColor,
    accentColor,
}) => {
    // Get colors based on scheme and overrides
    const getColors = () => {
        if (colorScheme === "brand" && primaryColor) {
            return {
                primary: primaryColor,
                secondary: accentColor || primaryColor,
                accent: accentColor || primaryColor,
            };
        }

        // Default color palettes
        if (colorScheme === "light") {
            return {
                primary: "#6366f1",
                secondary: "#8b5cf6",
                accent: "#ec4899",
            };
        }

        // Dark (default)
        return {
            primary: "#00ff88",
            secondary: "#0088ff",
            accent: "#8b5cf6",
        };
    };

    const colors = getColors();

    switch (background) {
        case "aurora":
            return (
                <AuroraBorealis
                    primaryColor={colors.primary}
                    secondaryColor={colors.secondary}
                />
            );

        case "gradient-mesh":
            return (
                <GradientMesh
                    primaryColor={colors.primary}
                    secondaryColor={colors.secondary}
                    accentColor={colors.accent}
                />
            );

        case "particles":
            // Use shooting stars for particles effect
            return <ShootingStars starCount={100} />;

        case "shooting-stars":
            return <ShootingStars starCount={60} />;

        case "ice-galaxy":
            return <IceGalaxy intensity={1} />;

        case "hyperspeed":
            return <HyperspeedBackground speedMultiplier={1} />;

        case "3d-grid":
            return (
                <Grid3D
                    gridColor={colorScheme === "light" ? "#000000" : "#ffffff"}
                    backgroundColor={colorScheme === "light" ? "#f5f5f5" : "#0a0a15"}
                />
            );

        case "organic-blobs":
            // Use gradient mesh with slower movement for organic feel
            return (
                <GradientMesh
                    primaryColor={colors.primary}
                    secondaryColor={colors.secondary}
                    accentColor={colors.accent}
                    speed={0.5}
                />
            );

        case "solid-light":
            return <SolidBackground color="white" />;

        case "solid-dark":
        default:
            return <SolidBackground color="black" />;
    }
};
