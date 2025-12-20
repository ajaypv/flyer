import { z } from "zod";

// ==========================================
// VIDEO CONTENT SCHEMA
// For LinkedIn Explainer Videos
// ==========================================

// === FORMAT OPTIONS ===
export const VideoFormat = z.enum(["portrait", "landscape", "square"]);
export type VideoFormatType = z.infer<typeof VideoFormat>;

export const VIDEO_FORMAT_DIMENSIONS = {
    portrait: { width: 1080, height: 1920 },
    landscape: { width: 1920, height: 1080 },
    square: { width: 1080, height: 1080 },
} as const;

// === CONTENT TYPES ===
export const ContentType = z.enum([
    "news",
    "daily_update",
    "explainer",
    "comparison",
    "announcement",
    "tutorial",
]);
export type ContentTypeValue = z.infer<typeof ContentType>;

// === SECTION TYPES ===
export const SectionType = z.enum([
    "intro",
    "headline",
    "bullet_list",
    "image_hero",
    "stats",
    "comparison",
    "quote",
    "outro",
]);
export type SectionTypeValue = z.infer<typeof SectionType>;

// === TEXT ANIMATIONS ===
export const TextAnimation = z.enum([
    // Reveals
    "fade",
    "typing",
    "kinetic",
    "reveal-up",
    "reveal-down",
    "blur-sharpen",
    "scale-in",
    "slide-in",
    "letter-by-letter",
    "word-by-word",
    "line-by-line",
    // Emphasis
    "highlight-sweep",
    "underline-draw",
    "glow-pulse",
    "color-shift",
]);
export type TextAnimationType = z.infer<typeof TextAnimation>;

// === EASING FUNCTIONS ===
export const Easing = z.enum([
    "linear",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "spring",
    "elastic",
    "back",
    "expo",
]);
export type EasingType = z.infer<typeof Easing>;

// === ANIMATION CONFIG ===
export const AnimationConfig = z.object({
    style: TextAnimation.default("kinetic"),
    duration: z.number().min(0.1).max(5).default(1),
    delay: z.number().min(0).default(0),
    easing: Easing.default("ease-out"),
    stagger: z.number().min(0).optional(),
});
export type AnimationConfigType = z.infer<typeof AnimationConfig>;

// === CAMERA MOVEMENTS ===
export const CameraType = z.enum([
    "static",
    "zoom-in-slow",
    "zoom-in-fast",
    "zoom-out-slow",
    "zoom-out-fast",
    "pan-left",
    "pan-right",
    "tilt-up",
    "tilt-down",
    "ken-burns",
    "drift",
    "shake",
    "dolly-in",
    "rack-focus",
]);
export type CameraTypeValue = z.infer<typeof CameraType>;

export const CameraMovement = z.object({
    type: CameraType.default("static"),
    intensity: z.number().min(0.1).max(3).default(1),
    focusPoint: z
        .object({
            x: z.number().min(0).max(100).default(50),
            y: z.number().min(0).max(100).default(50),
        })
        .optional(),
    startScale: z.number().default(1),
    endScale: z.number().default(1.1),
});
export type CameraMovementType = z.infer<typeof CameraMovement>;

// === TRANSITIONS ===
export const TransitionType = z.enum([
    "cut",
    "fade",
    "fade-black",
    "fade-white",
    "slide-left",
    "slide-right",
    "slide-up",
    "slide-down",
    "zoom-through",
    "blur-transition",
    "morph",
    "wipe-radial",
    "wipe-horizontal",
    "glitch",
    "pixelate",
    "flash",
]);
export type TransitionTypeValue = z.infer<typeof TransitionType>;

export const Transition = z.object({
    type: TransitionType.default("fade"),
    duration: z.number().min(0.1).max(2).default(0.5),
    easing: Easing.default("ease-out"),
    direction: z.enum(["left", "right", "up", "down", "in", "out"]).optional(),
});
export type TransitionValue = z.infer<typeof Transition>;

// === BACKGROUNDS ===
export const BackgroundType = z.enum([
    "aurora",
    "gradient-mesh",
    "particles",
    "shooting-stars",
    "ice-galaxy",
    "hyperspeed",
    "3d-grid",
    "organic-blobs",
    "solid-dark",
    "solid-light",
]);
export type BackgroundTypeValue = z.infer<typeof BackgroundType>;

// === TEXT POSITIONING ===
export const TextPosition = z.enum([
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
]);
export type TextPositionValue = z.infer<typeof TextPosition>;

export const TextAlign = z.enum(["center", "left", "right"]);
export type TextAlignValue = z.infer<typeof TextAlign>;

// === FRAME COMPOSITION ===
export const ContentArea = z.enum([
    "full",
    "center",
    "top-third",
    "bottom-third",
    "left-third",
    "right-third",
    "golden-ratio",
]);
export type ContentAreaValue = z.infer<typeof ContentArea>;

export const FrameComposition = z.object({
    contentArea: ContentArea.default("center"),
    safePadding: z.number().min(0).max(20).default(5),
    balance: z
        .enum(["centered", "left-heavy", "right-heavy", "top-heavy", "bottom-heavy"])
        .default("centered"),
});
export type FrameCompositionType = z.infer<typeof FrameComposition>;

// === COLOR GRADING ===
export const ColorGrade = z.enum([
    "none",
    "cinematic-warm",
    "cinematic-cool",
    "vintage",
    "high-contrast",
    "monochrome",
    "neon",
    "muted",
]);
export type ColorGradeValue = z.infer<typeof ColorGrade>;

// === VISUAL STYLE ===
export const VisualStyle = z.object({
    colorGrade: ColorGrade.default("none"),
    vignette: z
        .object({
            enabled: z.boolean().default(false),
            intensity: z.number().min(0).max(1).default(0.3),
        })
        .optional(),
    grain: z
        .object({
            enabled: z.boolean().default(false),
            intensity: z.number().min(0).max(1).default(0.1),
        })
        .optional(),
    bloom: z
        .object({
            enabled: z.boolean().default(false),
            intensity: z.number().min(0).max(1).default(0.2),
            threshold: z.number().default(0.8),
        })
        .optional(),
});
export type VisualStyleType = z.infer<typeof VisualStyle>;

// === IMAGE CONTENT ===
export const ImageContent = z.object({
    url: z.string(),
    alt: z.string().optional(),
    position: z
        .enum(["fullscreen", "left", "right", "center", "background"])
        .default("center"),
    fit: z.enum(["cover", "contain", "fill"]).default("cover"),
});
export type ImageContentType = z.infer<typeof ImageContent>;

// === STAT ITEM ===
export const StatItem = z.object({
    value: z.string(),
    label: z.string(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    animateAs: z.enum(["counter", "static"]).default("counter"),
});
export type StatItemType = z.infer<typeof StatItem>;

// === EMPHASIS EFFECTS ===
export const EmphasisType = z.enum([
    "spotlight",
    "dim-others",
    "outline-glow",
    "scale-pop",
    "shake",
    "color-highlight",
    "glow-pulse",
    "underline",
    "circle",
    "arrow",
]);
export type EmphasisTypeValue = z.infer<typeof EmphasisType>;

export const EmphasisEffect = z.object({
    type: EmphasisType,
    target: z.string().optional(),
    duration: z.number().default(0.5),
    delay: z.number().default(0),
});
export type EmphasisEffectType = z.infer<typeof EmphasisEffect>;

// === SECTION ===
export const Section = z.object({
    id: z.string(),
    type: SectionType,
    duration: z.number().min(1).max(30).optional(),

    // Content
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    body: z.string().optional(),
    bullets: z.array(z.string()).max(6).optional(),
    image: ImageContent.optional(),
    stats: z.array(StatItem).max(4).optional(),
    quote: z.string().optional(),
    quoteAttribution: z.string().optional(),

    // Positioning
    textPosition: TextPosition.default("center"),
    textAlign: TextAlign.default("center"),

    // Animation
    textAnimation: TextAnimation.default("kinetic"),
    textAnimationConfig: AnimationConfig.optional(),
    entrance: z
        .enum(["fade", "slide-up", "slide-left", "zoom", "blur-in"])
        .default("fade"),
    exit: z.enum(["fade", "slide-down", "zoom-out", "blur-out"]).default("fade"),

    // Transition to next section
    transition: Transition.optional(),

    // Camera
    camera: CameraMovement.optional(),

    // Composition
    composition: FrameComposition.optional(),

    // Visual style override
    visualStyle: VisualStyle.optional(),

    // Background override
    backgroundOverride: BackgroundType.optional(),

    // Emphasis effects
    emphasis: z.array(EmphasisEffect).optional(),
});
export type SectionValue = z.infer<typeof Section>;

// === SOUND CONFIG ===
export const SoundConfig = z.object({
    backgroundMusic: z
        .enum(["ambient", "upbeat", "dramatic", "tech", "none"])
        .default("none"),
    musicVolume: z.number().min(0).max(1).default(0.3),
    transitionSound: z
        .enum(["whoosh", "click", "pop", "none"])
        .default("whoosh"),
    textRevealSound: z.enum(["tick", "pop", "none"]).default("none"),
});
export type SoundConfigType = z.infer<typeof SoundConfig>;

// === BRAND CONFIG ===
export const BrandConfig = z.object({
    name: z.string(),
    logoUrl: z.string().optional(),
    tagline: z.string().optional(),
});
export type BrandConfigType = z.infer<typeof BrandConfig>;

// === VOICEOVER CONFIG ===
export const VoiceoverConfig = z.object({
    enabled: z.boolean().default(false),
    script: z.string().optional(),
    voice: z.enum(["male", "female", "neutral"]).optional(),
});
export type VoiceoverConfigType = z.infer<typeof VoiceoverConfig>;

// === MAIN VIDEO CONTENT INPUT ===
export const VideoContentInput = z.object({
    // Metadata
    id: z.string(),
    title: z.string(),
    type: ContentType,
    generatedAt: z.string().optional(),

    // Format
    format: VideoFormat.default("portrait"),

    // Global styling
    background: BackgroundType.default("aurora"),
    colorScheme: z.enum(["dark", "light", "brand"]).default("dark"),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),

    // Branding
    brand: BrandConfig.optional(),

    // Sections (1-15)
    sections: z.array(Section).min(1).max(15),

    // Sound
    sound: SoundConfig.optional(),

    // Global visual style
    visualStyle: VisualStyle.optional(),

    // Voiceover
    voiceover: VoiceoverConfig.optional(),
});
export type VideoContentInputType = z.infer<typeof VideoContentInput>;

// === DURATION CONSTANTS ===
export const DEFAULT_SECTION_DURATIONS: Record<SectionTypeValue, number> = {
    intro: 3,
    headline: 4,
    bullet_list: 5,
    image_hero: 4,
    stats: 4,
    comparison: 5,
    quote: 4,
    outro: 2,
};

export const VIDEO_CONTENT_FPS = 30;

// === HELPER FUNCTIONS ===
export const calculateSectionDuration = (section: SectionValue): number => {
    if (section.duration) return section.duration;
    return DEFAULT_SECTION_DURATIONS[section.type];
};

export const calculateTotalDuration = (sections: SectionValue[]): number => {
    return sections.reduce((total, section) => {
        const baseDuration = calculateSectionDuration(section);
        const transitionDuration = section.transition?.duration ?? 0.5;
        return total + baseDuration + transitionDuration;
    }, 0);
};

export const calculateTotalFrames = (sections: SectionValue[]): number => {
    return Math.ceil(calculateTotalDuration(sections) * VIDEO_CONTENT_FPS);
};

// === VALIDATION ===
export const validateVideoContent = (input: unknown) => {
    return VideoContentInput.safeParse(input);
};
