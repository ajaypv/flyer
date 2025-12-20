import { VideoContentInputType } from "./video-content";

// ==========================================
// PREDEFINED TEMPLATES
// For LinkedIn Explainer Videos
// ==========================================

/**
 * Template 1: Daily AI News
 * 5 sections for news digest
 */
export const DAILY_AI_NEWS_TEMPLATE: VideoContentInputType = {
    id: "daily-ai-news",
    title: "AI Daily Digest",
    type: "daily_update",
    format: "portrait",
    background: "aurora",
    colorScheme: "dark",
    sections: [
        {
            id: "intro",
            type: "intro",
            headline: "🚀 AI Today",
            subheadline: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
            duration: 3,
            textAnimation: "kinetic",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "zoom-in-slow",
                intensity: 1.1,
                startScale: 1,
                endScale: 1.05,
            },
        },
        {
            id: "news-1",
            type: "headline",
            headline: "[NEWS_HEADLINE_1]",
            subheadline: "[NEWS_SUMMARY_1]",
            duration: 4,
            textAnimation: "reveal-up",
            textPosition: "center",
            textAlign: "center",
            entrance: "slide-up",
            exit: "fade",
            transition: {
                type: "fade",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "news-2",
            type: "headline",
            headline: "[NEWS_HEADLINE_2]",
            subheadline: "[NEWS_SUMMARY_2]",
            duration: 4,
            textAnimation: "reveal-up",
            textPosition: "center",
            textAlign: "center",
            entrance: "slide-up",
            exit: "fade",
            transition: {
                type: "slide-left",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "news-3",
            type: "headline",
            headline: "[NEWS_HEADLINE_3]",
            subheadline: "[NEWS_SUMMARY_3]",
            duration: 4,
            textAnimation: "reveal-up",
            textPosition: "center",
            textAlign: "center",
            entrance: "slide-up",
            exit: "fade",
            transition: {
                type: "slide-right",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "outro",
            type: "outro",
            headline: "Follow for more updates",
            subheadline: "@yourbrand",
            duration: 2,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "zoom",
            exit: "fade",
        },
    ],
    sound: {
        backgroundMusic: "none",
        musicVolume: 0.3,
        transitionSound: "whoosh",
        textRevealSound: "none",
    },
};

/**
 * Template 2: Startup/YC Explainer
 * 6 sections for company spotlight
 */
export const STARTUP_EXPLAINER_TEMPLATE: VideoContentInputType = {
    id: "startup-explainer",
    title: "Startup Spotlight",
    type: "explainer",
    format: "portrait",
    background: "gradient-mesh",
    colorScheme: "dark",
    sections: [
        {
            id: "intro",
            type: "intro",
            headline: "[COMPANY_NAME]",
            subheadline: "YC [BATCH] | [TAGLINE]",
            duration: 3,
            textAnimation: "kinetic",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            camera: {
                type: "drift",
                intensity: 0.5,
                startScale: 1,
                endScale: 1.02,
            },
        },
        {
            id: "problem",
            type: "headline",
            headline: "The Problem",
            body: "[PROBLEM_STATEMENT]",
            duration: 4,
            textAnimation: "blur-sharpen",
            textPosition: "center",
            textAlign: "center",
            entrance: "blur-in",
            exit: "fade",
            transition: {
                type: "fade-black",
                duration: 0.6,
                easing: "ease-in-out",
            },
        },
        {
            id: "solution",
            type: "headline",
            headline: "The Solution",
            body: "[SOLUTION_DESCRIPTION]",
            duration: 4,
            textAnimation: "reveal-up",
            textPosition: "center",
            textAlign: "center",
            entrance: "slide-up",
            exit: "fade",
            transition: {
                type: "zoom-through",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "features",
            type: "bullet_list",
            headline: "Key Features",
            bullets: ["[FEATURE_1]", "[FEATURE_2]", "[FEATURE_3]"],
            duration: 5,
            textAnimation: "line-by-line",
            textPosition: "center",
            textAlign: "left",
            entrance: "slide-left",
            exit: "fade",
            transition: {
                type: "slide-up",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "stats",
            type: "stats",
            stats: [
                { value: "[METRIC_1]", label: "[LABEL_1]", animateAs: "counter" },
                { value: "[METRIC_2]", label: "[LABEL_2]", animateAs: "counter" },
            ],
            duration: 4,
            textAnimation: "scale-in",
            textPosition: "center",
            textAlign: "center",
            entrance: "zoom",
            exit: "fade",
            transition: {
                type: "fade",
                duration: 0.5,
                easing: "ease-out",
            },
        },
        {
            id: "outro",
            type: "outro",
            headline: "Learn more at [URL]",
            duration: 2,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
        },
    ],
    sound: {
        backgroundMusic: "ambient",
        musicVolume: 0.2,
        transitionSound: "whoosh",
        textRevealSound: "pop",
    },
};

/**
 * Template 3: Model Comparison
 * 6 sections for A vs B battles
 */
export const MODEL_COMPARISON_TEMPLATE: VideoContentInputType = {
    id: "model-comparison",
    title: "Model Showdown",
    type: "comparison",
    format: "landscape",
    background: "3d-grid",
    colorScheme: "dark",
    sections: [
        {
            id: "intro",
            type: "intro",
            headline: "[MODEL_A] vs [MODEL_B]",
            subheadline: "Which one wins?",
            duration: 3,
            textAnimation: "kinetic",
            textPosition: "center",
            textAlign: "center",
            entrance: "zoom",
            exit: "fade",
            camera: {
                type: "zoom-in-fast",
                intensity: 1.3,
                startScale: 0.9,
                endScale: 1,
            },
        },
        {
            id: "model-a",
            type: "headline",
            headline: "[MODEL_A]",
            body: "[MODEL_A_DESCRIPTION]",
            duration: 4,
            textAnimation: "slide-in",
            textPosition: "left",
            textAlign: "left",
            entrance: "slide-left",
            exit: "fade",
            transition: {
                type: "slide-left",
                duration: 0.4,
                easing: "ease-out",
            },
        },
        {
            id: "model-b",
            type: "headline",
            headline: "[MODEL_B]",
            body: "[MODEL_B_DESCRIPTION]",
            duration: 4,
            textAnimation: "slide-in",
            textPosition: "right",
            textAlign: "right",
            entrance: "slide-left",
            exit: "fade",
            transition: {
                type: "slide-right",
                duration: 0.4,
                easing: "ease-out",
            },
        },
        {
            id: "comparison",
            type: "comparison",
            duration: 5,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
            transition: {
                type: "blur-transition",
                duration: 0.6,
                easing: "ease-in-out",
            },
        },
        {
            id: "verdict",
            type: "headline",
            headline: "Winner: [WINNER]",
            body: "[VERDICT_REASON]",
            duration: 4,
            textAnimation: "scale-in",
            textPosition: "center",
            textAlign: "center",
            entrance: "zoom",
            exit: "fade",
            camera: {
                type: "zoom-in-slow",
                intensity: 1.2,
                startScale: 1,
                endScale: 1.1,
            },
            emphasis: [
                {
                    type: "scale-pop",
                    duration: 0.3,
                    delay: 0.5,
                },
            ],
            transition: {
                type: "flash",
                duration: 0.3,
                easing: "ease-out",
            },
        },
        {
            id: "outro",
            type: "outro",
            headline: "What's your pick?",
            subheadline: "Comment below 👇",
            duration: 2,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
        },
    ],
    sound: {
        backgroundMusic: "dramatic",
        musicVolume: 0.25,
        transitionSound: "whoosh",
        textRevealSound: "none",
    },
};

/**
 * Template 4: Quick Announcement
 * 3 sections for breaking news
 */
export const QUICK_ANNOUNCEMENT_TEMPLATE: VideoContentInputType = {
    id: "quick-announcement",
    title: "Breaking News",
    type: "announcement",
    format: "portrait",
    background: "particles",
    colorScheme: "dark",
    sections: [
        {
            id: "intro",
            type: "intro",
            headline: "🔥 Breaking",
            duration: 2,
            textAnimation: "scale-in",
            textPosition: "center",
            textAlign: "center",
            entrance: "zoom",
            exit: "fade",
            camera: {
                type: "shake",
                intensity: 0.3,
                startScale: 1,
                endScale: 1,
            },
        },
        {
            id: "main",
            type: "headline",
            headline: "[ANNOUNCEMENT_HEADLINE]",
            subheadline: "[ANNOUNCEMENT_DETAIL]",
            duration: 5,
            textAnimation: "kinetic",
            textPosition: "center",
            textAlign: "center",
            entrance: "blur-in",
            exit: "fade",
            camera: {
                type: "zoom-in-slow",
                intensity: 1.2,
                startScale: 1,
                endScale: 1.15,
            },
            emphasis: [
                {
                    type: "glow-pulse",
                    duration: 0.5,
                    delay: 1,
                },
            ],
            transition: {
                type: "zoom-through",
                duration: 0.5,
                easing: "ease-in-out",
            },
        },
        {
            id: "outro",
            type: "outro",
            headline: "More details coming soon",
            subheadline: "Stay tuned 🚀",
            duration: 2,
            textAnimation: "fade",
            textPosition: "center",
            textAlign: "center",
            entrance: "fade",
            exit: "fade",
        },
    ],
    sound: {
        backgroundMusic: "none",
        musicVolume: 0.3,
        transitionSound: "pop",
        textRevealSound: "none",
    },
};

// === ALL TEMPLATES ===
export const VIDEO_TEMPLATES = {
    "daily-ai-news": DAILY_AI_NEWS_TEMPLATE,
    "startup-explainer": STARTUP_EXPLAINER_TEMPLATE,
    "model-comparison": MODEL_COMPARISON_TEMPLATE,
    "quick-announcement": QUICK_ANNOUNCEMENT_TEMPLATE,
} as const;

export type TemplateId = keyof typeof VIDEO_TEMPLATES;

// === HELPER FUNCTIONS ===
export const getTemplate = (id: TemplateId): VideoContentInputType => {
    return VIDEO_TEMPLATES[id];
};

export const getTemplateIds = (): TemplateId[] => {
    return Object.keys(VIDEO_TEMPLATES) as TemplateId[];
};

export const cloneTemplate = (id: TemplateId): VideoContentInputType => {
    return JSON.parse(JSON.stringify(VIDEO_TEMPLATES[id]));
};
