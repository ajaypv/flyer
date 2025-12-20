#!/usr/bin/env node
/**
 * CLI Script to render explainer videos from JSON files
 * 
 * Usage:
 *   node scripts/render-explainer.mjs <json-file> [options]
 * 
 * Options:
 *   --format <portrait|landscape>  Video format (default: from JSON or portrait)
 *   --quality <sd|hd|fhd|2k|4k>    Video quality (default: fhd)
 *   --fps <30|60>                  Frames per second (default: 30)
 *   --crf <0-51>                   Video quality (lower = sharper, default: 18)
 *   --codec <h264|h265|prores>     Video codec (default: h264)
 *   --output <path>                Output file path (default: out/explainer-<timestamp>.mp4)
 *   --audio <none|explainer|adios|future>  Background audio track (default: explainer)
 *   --volume <0.0-1.0>             Audio volume (default: 0.3)
 * 
 * Examples:
 *   # Basic render
 *   node scripts/render-explainer.mjs public/code-mode-agents.json
 * 
 *   # High quality portrait for Instagram Reels
 *   node scripts/render-explainer.mjs public/code-mode-agents.json --format portrait --quality fhd --fps 60
 * 
 *   # Landscape for YouTube
 *   node scripts/render-explainer.mjs public/code-mode-agents.json --format landscape --quality fhd
 * 
 *   # No audio
 *   node scripts/render-explainer.mjs public/code-mode-agents.json --audio none
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Section duration calculation (must match video-content.ts)
const DEFAULT_SECTION_DURATIONS = {
    intro: 3,
    headline: 4,
    bullet_list: 5,
    image_hero: 4,
    stats: 4,
    comparison: 5,
    quote: 4,
    code: 6,
    outro: 2,
};

// Calculate total frames for explainer video
function calculateTotalFrames(sections, fps = 30) {
    let totalSeconds = 0;
    for (const section of sections) {
        const duration = section.duration || DEFAULT_SECTION_DURATIONS[section.type] || 4;
        totalSeconds += duration;
    }
    return Math.ceil(totalSeconds * fps);
}

// Quality presets
const QUALITY_PRESETS = {
    sd: { label: "480p SD", multiplier: 0.5 },
    hd: { label: "720p HD", multiplier: 1.0 },
    fhd: { label: "1080p Full HD", multiplier: 1.5 },
    "2k": { label: "1440p 2K", multiplier: 2.0 },
    "4k": { label: "2160p 4K UHD", multiplier: 3.0 },
};

// Base video format configurations
const VIDEO_FORMATS = {
    portrait: { baseWidth: 720, baseHeight: 1280 },
    landscape: { baseWidth: 1280, baseHeight: 720 },
};

// Get actual dimensions based on format and quality
function getVideoDimensions(format, quality) {
    const baseFormat = VIDEO_FORMATS[format] || VIDEO_FORMATS.portrait;
    const qualityPreset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.fhd;

    return {
        width: Math.round(baseFormat.baseWidth * qualityPreset.multiplier),
        height: Math.round(baseFormat.baseHeight * qualityPreset.multiplier),
        label: qualityPreset.label,
    };
}

// Parse command line arguments
function parseArgs(args) {
    const result = {
        jsonFile: null,
        format: null,
        quality: "fhd",
        fps: 30,
        crf: 18,
        codec: "h264",
        output: null,
        audio: "explainer",
        volume: 0.3,
        concurrency: 8,  // Default 8 threads
        gl: "angle",     // GPU acceleration by default
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === "--format" && args[i + 1]) {
            result.format = args[++i];
        } else if (arg === "--quality" && args[i + 1]) {
            result.quality = args[++i];
        } else if (arg === "--fps" && args[i + 1]) {
            const fpsValue = parseInt(args[++i], 10);
            result.fps = [30, 60].includes(fpsValue) ? fpsValue : 30;
        } else if (arg === "--crf" && args[i + 1]) {
            const crfValue = parseInt(args[++i], 10);
            result.crf = Math.max(0, Math.min(51, crfValue));
        } else if (arg === "--codec" && args[i + 1]) {
            const codecValue = args[++i].toLowerCase();
            result.codec = ["h264", "h265", "prores"].includes(codecValue) ? codecValue : "h264";
        } else if (arg === "--output" && args[i + 1]) {
            result.output = args[++i];
        } else if (arg === "--audio" && args[i + 1]) {
            result.audio = args[++i];
        } else if (arg === "--volume" && args[i + 1]) {
            result.volume = parseFloat(args[++i]);
        } else if (arg === "--concurrency" && args[i + 1]) {
            result.concurrency = parseInt(args[++i], 10);
        } else if (arg === "--gl" && args[i + 1]) {
            result.gl = args[++i];
        } else if (!arg.startsWith("--") && !result.jsonFile) {
            result.jsonFile = arg;
        }
    }

    return result;
}

// Load and validate JSON file
function loadExplainerContent(jsonPath) {
    const fullPath = path.resolve(projectRoot, jsonPath);

    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Error: JSON file not found: ${fullPath}`);
        process.exit(1);
    }

    try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const data = JSON.parse(content);

        // Validate required fields
        if (!data.sections || !Array.isArray(data.sections)) {
            console.error("❌ Error: JSON must contain a 'sections' array");
            process.exit(1);
        }

        if (data.sections.length === 0) {
            console.error("❌ Error: JSON must contain at least one section");
            process.exit(1);
        }

        return data;
    } catch (err) {
        console.error(`❌ Error parsing JSON: ${err.message}`);
        process.exit(1);
    }
}

// Build props for Remotion
function buildProps(content, options) {
    return {
        content: {
            ...content,
            format: options.format || content.format || "portrait",
        },
        audioTrackId: options.audio || "explainer",
        audioVolume: options.volume || 0.3,
    };
}

// Main function
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
        console.log(`
🎬 Flyer - Explainer Video Renderer
    
Convert JSON to Video - No editing required!

Usage:
  node scripts/render-explainer.mjs <json-file> [options]

Options:
  --format <portrait|landscape>  Video format (default: from JSON or portrait)
  --quality <sd|hd|fhd|2k|4k>    Video resolution (default: fhd)
  --fps <30|60>                  Frames per second (default: 30)
  --crf <0-51>                   Video quality - lower = sharper (default: 18)
  --codec <h264|h265|prores>     Video codec (default: h264)
  --output <path>                Output file path
  --audio <none|explainer|adios|future>  Background music (default: explainer)
  --volume <0.0-1.0>             Audio volume (default: 0.3)

Resolution Options:
  sd   - 480p
  hd   - 720p
  fhd  - 1080p Full HD [default]
  2k   - 1440p 2K
  4k   - 2160p 4K UHD

Examples:
  # Instagram Reels (Portrait 1080p)
  node scripts/render-explainer.mjs public/code-mode-agents.json

  # YouTube (Landscape 1080p)
  node scripts/render-explainer.mjs public/code-mode-agents.json --format landscape

  # High quality 60fps
  node scripts/render-explainer.mjs public/code-mode-agents.json --quality fhd --fps 60 --crf 15

  # No background music
  node scripts/render-explainer.mjs public/code-mode-agents.json --audio none

  # Maximum quality (4K ProRes)
  node scripts/render-explainer.mjs public/code-mode-agents.json --quality 4k --codec prores
        `);
        process.exit(0);
    }

    const options = parseArgs(args);

    if (!options.jsonFile) {
        console.error("❌ Error: Please provide a JSON file path");
        process.exit(1);
    }

    // Load content
    console.log(`📂 Loading explainer from: ${options.jsonFile}`);
    const content = loadExplainerContent(options.jsonFile);

    // Build props
    const props = buildProps(content, options);

    // Get format from props or options
    const format = options.format || content.format || "portrait";

    // Get video dimensions based on format and quality
    const dimensions = getVideoDimensions(format, options.quality);

    // Calculate duration
    const durationInFrames = calculateTotalFrames(content.sections, options.fps);
    const durationInSeconds = (durationInFrames / options.fps).toFixed(1);

    // Determine output path
    const defaultExt = options.codec === "prores" ? ".mov" : ".mp4";
    let outputPath = options.output || `out/explainer-${Date.now()}${defaultExt}`;

    // Ensure correct extension for ProRes
    if (options.codec === "prores" && !outputPath.endsWith(".mov")) {
        outputPath = outputPath.replace(/\.[^.]+$/, ".mov");
    }

    // Create output directory if needed
    const outputDir = path.dirname(path.resolve(projectRoot, outputPath));
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write props to temp file
    const propsPath = path.join(projectRoot, ".temp-explainer-props.json");
    fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

    // Get codec display name
    const codecNames = {
        h264: "H.264",
        h265: "H.265/HEVC",
        prores: "Apple ProRes",
    };

    console.log(`
🎬 Flyer Render Configuration:
   Title: ${content.title || "Untitled"}
   Format: ${format}
   Resolution: ${dimensions.label} (${dimensions.width}x${dimensions.height})
   FPS: ${options.fps}fps
   Codec: ${codecNames[options.codec]}
   CRF: ${options.codec === "prores" ? "N/A (lossless)" : options.crf}
   Sections: ${content.sections.length}
   Duration: ${durationInFrames} frames (${durationInSeconds}s)
   Audio: ${options.audio} (${Math.round(options.volume * 100)}%)
   Output: ${outputPath}
`);

    // Build render arguments
    const renderArgs = [
        "remotion",
        "render",
        "ContentExplainer",
        outputPath,
        `--props=${propsPath}`,
        `--width=${dimensions.width}`,
        `--height=${dimensions.height}`,
        `--fps=${options.fps}`,
        `--concurrency=${options.concurrency}`,
        `--gl=${options.gl}`,
    ];

    // Add codec-specific options
    if (options.codec === "prores") {
        renderArgs.push("--codec=prores");
        renderArgs.push("--prores-profile=4444");
    } else if (options.codec === "h265") {
        renderArgs.push("--codec=h265");
        renderArgs.push(`--crf=${options.crf}`);
    } else {
        renderArgs.push("--codec=h264");
        renderArgs.push(`--crf=${options.crf}`);
    }

    console.log("🚀 Starting render...\n");

    const child = spawn("npx", renderArgs, {
        cwd: projectRoot,
        shell: true,
        stdio: "inherit",
    });

    child.on("close", (code) => {
        // Clean up temp props file
        try {
            if (fs.existsSync(propsPath)) {
                fs.unlinkSync(propsPath);
            }
        } catch {
            // Ignore cleanup errors
        }

        if (code === 0) {
            console.log(`\n✅ Video rendered successfully: ${outputPath}`);
            console.log(`\n💡 Tip: Share your JSON → Video workflow at github.com/yourrepo`);
        } else {
            console.error(`\n❌ Render failed with code: ${code}`);
            process.exit(1);
        }
    });

    child.on("error", (err) => {
        console.error(`\n❌ Error: ${err.message}`);
        process.exit(1);
    });
}

main();
