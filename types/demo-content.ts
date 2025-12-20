import { VideoContentInputType } from "./video-content";

/**
 * APPLE-STYLE DEMO: The AI Revolution
 * Premium, minimalist design with smooth transitions
 * No overlapping text, clean typography, cinematic feel
 */
export const DEMO_LLM_EXPLAINER: VideoContentInputType = {
    id: "ai-revolution-apple",
    title: "The AI Revolution",
    type: "explainer",
    format: "portrait", // Will be toggled by user
    background: "gradient-mesh",
    colorScheme: "dark",
    primaryColor: "#ffffff",
    accentColor: "#0a84ff", // Apple blue
    sections: [
        // === INTRO - Clean, minimal ===
        {
            id: "intro",
            type: "intro",
            headline: "The AI Revolution",
            duration: 4,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "static",
                intensity: 1,
                startScale: 1,
                endScale: 1,
            },
            transition: {
                type: "fade",
                duration: 0.8,
                easing: "ease-in-out",
            },
        },

        // === GPT-4o Intro ===
        {
            id: "gpt4o",
            type: "headline",
            headline: "GPT-4o",
            subheadline: "The Omni Model",
            duration: 4,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "zoom-in-slow",
                intensity: 0.5,
                startScale: 1,
                endScale: 1.02,
            },
            transition: {
                type: "fade",
                duration: 0.8,
                easing: "ease-in-out",
            },
        },

        // === Features - Bullet List ===
        {
            id: "features",
            type: "bullet_list",
            headline: "Capabilities",
            bullets: [
                "Real-time voice",
                "Vision understanding",
                "2x faster responses",
            ],
            duration: 5,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "static",
                intensity: 1,
                startScale: 1,
                endScale: 1,
            },
            transition: {
                type: "fade",
                duration: 0.8,
                easing: "ease-in-out",
            },
        },

        // === Stats - Clean Numbers ===
        {
            id: "stats",
            type: "stats",
            stats: [
                { value: "200M", label: "Weekly Users", animateAs: "counter" },
                { value: "92%", label: "Fortune 500", animateAs: "counter" },
            ],
            duration: 5,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "static",
                intensity: 1,
                startScale: 1,
                endScale: 1,
            },
            transition: {
                type: "fade",
                duration: 0.8,
                easing: "ease-in-out",
            },
        },

        // === Quote ===
        {
            id: "quote",
            type: "quote",
            quote: "The most transformative technology of our lifetime.",
            quoteAttribution: "Sam Altman",
            duration: 4,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "drift",
                intensity: 0.3,
                startScale: 1,
                endScale: 1.01,
            },
            transition: {
                type: "fade",
                duration: 0.8,
                easing: "ease-in-out",
            },
        },

        // === Outro ===
        {
            id: "outro",
            type: "outro",
            headline: "Learn More",
            duration: 3,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "static",
                intensity: 1,
                startScale: 1,
                endScale: 1,
            },
        },
    ],
    sound: {
        backgroundMusic: "ambient",
        musicVolume: 0.15,
        transitionSound: "none",
        textRevealSound: "none",
    },
};

// Export for use
export default DEMO_LLM_EXPLAINER;
