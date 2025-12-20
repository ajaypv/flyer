#!/usr/bin/env node
/**
 * CLI Script to render conversation videos from JSON files
 * 
 * Usage:
 *   node scripts/render-conversation.mjs <json-file> [options]
 * 
 * Options:
 *   --platform <slack|discord|imessage|twitter>  Platform theme (default: from JSON or imessage)
 *   --mode <auto-scroll|one-at-a-time|paired>    Display mode (default: from JSON or auto-scroll)
 *   --format <landscape|portrait|square|story>   Video format (default: landscape)
 *   --quality <sd|hd|fhd|2k|4k>                  Video quality (default: hd)
 *   --fps <30|60>                                Frames per second (default: 30)
 *   --crf <0-51>                                 Video quality (lower = sharper, default: 18)
 *   --codec <h264|h265|prores>                   Video codec (default: h264)
 *   --output <path>                              Output file path (default: out/conversation.mp4)
 *   --zoom <0.5-2.0>                             Zoom level (default: from JSON or 1.0)
 * 
 * Quality Options:
 *   sd   - 480p (640x360 landscape, 360x640 portrait)
 *   hd   - 720p (1280x720 landscape, 720x1280 portrait) [default]
 *   fhd  - 1080p Full HD (1920x1080 landscape, 1080x1920 portrait)
 *   2k   - 1440p 2K (2560x1440 landscape, 1440x2560 portrait)
 *   4k   - 2160p 4K UHD (3840x2160 landscape, 2160x3840 portrait)
 * 
 * FPS Options:
 *   30   - Standard 30fps (default, smoother file size)
 *   60   - High 60fps (smoother animations, larger file)
 * 
 * CRF Options (for h264/h265):
 *   0    - Lossless (huge file)
 *   15   - Ultra high quality (very sharp text)
 *   18   - High quality [default] (sharp text, good balance)
 *   23   - Medium quality (default ffmpeg)
 *   28   - Lower quality (smaller file, some blur)
 * 
 * Codec Options:
 *   h264   - H.264/AVC (default, widely compatible)
 *   h265   - H.265/HEVC (better compression, less compatible)
 *   prores - Apple ProRes (best quality, huge file, .mov output)
 * 
 * Example:
 *   node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter --format portrait --quality 4k --fps 60 --crf 15
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Message conversation timing constants (must match types/constants.ts)
const MSG_TYPING_DURATION_SECONDS = 1.5; // 1.5 seconds
const MSG_DISPLAY_SECONDS = 2; // 2 seconds
const MSG_TRANSITION_SECONDS = 0.5; // 0.5 seconds
const MSG_INTRO_SECONDS = 1; // 1 second intro
const MSG_OUTRO_SECONDS = 2; // 2 seconds outro

// Calculate frames from seconds based on target FPS
function secondsToFrames(seconds, fps) {
  return Math.round(seconds * fps);
}

// Calculate duration for message conversation mode
function calculateMessageDuration(messageCount, displayMode, fps = 30) {
  const typingFrames = secondsToFrames(MSG_TYPING_DURATION_SECONDS, fps);
  const displayFrames = secondsToFrames(MSG_DISPLAY_SECONDS, fps);
  const transitionFrames = secondsToFrames(MSG_TRANSITION_SECONDS, fps);
  const introFrames = secondsToFrames(MSG_INTRO_SECONDS, fps);
  const outroFrames = secondsToFrames(MSG_OUTRO_SECONDS, fps);

  if (messageCount === 0) {
    return introFrames + outroFrames;
  }

  switch (displayMode) {
    case "auto-scroll":
      // Auto-scroll: intro + (messages * (typing + display)) + outro
      return (
        introFrames +
        messageCount * (typingFrames + displayFrames) +
        outroFrames
      );

    case "one-at-a-time":
      // One-at-a-time: intro + (messages * (typing + display + transition)) + outro
      return (
        introFrames +
        messageCount * (typingFrames + displayFrames + transitionFrames) +
        outroFrames
      );

    case "paired":
      // Paired: intro + (pairs * (2 * typing + display + transition)) + outro
      const pairCount = Math.ceil(messageCount / 2);
      return (
        introFrames +
        pairCount * (2 * typingFrames + displayFrames + transitionFrames) +
        outroFrames
      );

    default:
      return introFrames + outroFrames;
  }
}

// Quality presets (multipliers for base resolution)
const QUALITY_PRESETS = {
  sd: { label: "480p SD", multiplier: 0.5 },
  hd: { label: "720p HD", multiplier: 1.0 },
  fhd: { label: "1080p Full HD", multiplier: 1.5 },
  "2k": { label: "1440p 2K", multiplier: 2.0 },
  "4k": { label: "2160p 4K UHD", multiplier: 3.0 },
};

// Base video format configurations (HD 720p base)
const VIDEO_FORMATS = {
  landscape: { baseWidth: 1280, baseHeight: 720 },
  portrait: { baseWidth: 720, baseHeight: 1280 },
  square: { baseWidth: 1080, baseHeight: 1080 },
  story: { baseWidth: 720, baseHeight: 1280 },
};

// Get actual dimensions based on format and quality
function getVideoDimensions(format, quality) {
  const baseFormat = VIDEO_FORMATS[format] || VIDEO_FORMATS.landscape;
  const qualityPreset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.hd;
  
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
    platform: null,
    mode: null,
    format: "landscape",
    quality: "hd",
    fps: 30,
    crf: 18, // Default CRF for sharp text
    codec: "h264",
    output: null,
    zoom: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "--platform" && args[i + 1]) {
      result.platform = args[++i];
    } else if (arg === "--mode" && args[i + 1]) {
      result.mode = args[++i];
    } else if (arg === "--format" && args[i + 1]) {
      result.format = args[++i];
    } else if (arg === "--quality" && args[i + 1]) {
      result.quality = args[++i];
    } else if (arg === "--fps" && args[i + 1]) {
      const fpsValue = parseInt(args[++i], 10);
      result.fps = [30, 60].includes(fpsValue) ? fpsValue : 30;
    } else if (arg === "--crf" && args[i + 1]) {
      const crfValue = parseInt(args[++i], 10);
      result.crf = Math.max(0, Math.min(51, crfValue)); // Clamp 0-51
    } else if (arg === "--codec" && args[i + 1]) {
      const codecValue = args[++i].toLowerCase();
      result.codec = ["h264", "h265", "prores"].includes(codecValue) ? codecValue : "h264";
    } else if (arg === "--output" && args[i + 1]) {
      result.output = args[++i];
    } else if (arg === "--zoom" && args[i + 1]) {
      result.zoom = parseFloat(args[++i]);
    } else if (!arg.startsWith("--") && !result.jsonFile) {
      result.jsonFile = arg;
    }
  }

  return result;
}

// Validate and load JSON file
function loadConversation(jsonPath) {
  const fullPath = path.resolve(projectRoot, jsonPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: JSON file not found: ${fullPath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(fullPath, "utf-8");
    const data = JSON.parse(content);
    
    // Validate required fields
    if (!data.messages || !Array.isArray(data.messages)) {
      console.error("❌ Error: JSON must contain a 'messages' array");
      process.exit(1);
    }

    // Add IDs to messages if missing
    data.messages = data.messages.map((msg, index) => ({
      id: msg.id || `msg-${index + 1}`,
      text: msg.text,
      sender: msg.sender,
    }));

    return data;
  } catch (err) {
    console.error(`❌ Error parsing JSON: ${err.message}`);
    process.exit(1);
  }
}

// Build props for Remotion
function buildProps(conversation, options) {
  return {
    senderName: conversation.senderName || "Sender",
    senderAvatarUrl: conversation.senderAvatarUrl || undefined,
    senderHandle: conversation.senderHandle || "@user",
    receiverName: conversation.receiverName || "Receiver",
    receiverAvatarUrl: conversation.receiverAvatarUrl || undefined,
    receiverHandle: conversation.receiverHandle || "@user",
    messages: conversation.messages,
    platformTheme: options.platform || conversation.platformTheme || "imessage",
    displayMode: options.mode || conversation.displayMode || "auto-scroll",
    zoomLevel: options.zoom || conversation.zoomLevel || 1.0,
  };
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
📹 Conversation Video Renderer

Usage:
  node scripts/render-conversation.mjs <json-file> [options]

Options:
  --platform <slack|discord|imessage|twitter>  Platform theme
  --mode <auto-scroll|one-at-a-time|paired>    Display mode
  --format <landscape|portrait|square|story>   Video format (default: landscape)
  --quality <sd|hd|fhd|2k|4k>                  Video resolution (default: hd)
  --fps <30|60>                                Frames per second (default: 30)
  --crf <0-51>                                 Video quality - lower = sharper (default: 18)
  --codec <h264|h265|prores>                   Video codec (default: h264)
  --output <path>                              Output file path
  --zoom <0.5-2.0>                             Zoom level

Resolution Options:
  sd   - 480p (640x360 landscape)
  hd   - 720p (1280x720 landscape) [default]
  fhd  - 1080p Full HD (1920x1080 landscape)
  2k   - 1440p 2K (2560x1440 landscape)
  4k   - 2160p 4K UHD (3840x2160 landscape)

FPS Options:
  30   - Standard 30fps [default]
  60   - High 60fps (smoother animations)

CRF Options (lower = sharper text, larger file):
  0    - Lossless (huge file)
  15   - Ultra sharp text
  18   - Sharp text [default]
  23   - Medium quality
  28   - Lower quality

Codec Options:
  h264   - H.264 (default, widely compatible)
  h265   - H.265/HEVC (better compression)
  prores - Apple ProRes (best quality, .mov)

Examples:
  # Standard quality
  node scripts/render-conversation.mjs conversations/elon-vs-zuck.json

  # Instagram Reels - sharp text
  node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter --format portrait --quality fhd --fps 60 --crf 15

  # Maximum quality (ProRes)
  node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter --format portrait --quality 4k --fps 60 --codec prores
    `);
    process.exit(0);
  }

  const options = parseArgs(args);

  if (!options.jsonFile) {
    console.error("❌ Error: Please provide a JSON file path");
    process.exit(1);
  }

  // Load conversation
  console.log(`📂 Loading conversation from: ${options.jsonFile}`);
  const conversation = loadConversation(options.jsonFile);
  
  // Build props
  const props = buildProps(conversation, options);
  
  // Get video dimensions based on format and quality
  const dimensions = getVideoDimensions(options.format, options.quality);
  
  // Determine output path (use .mov for ProRes)
  const defaultExt = options.codec === "prores" ? ".mov" : ".mp4";
  let outputPath = options.output || `out/conversation-${Date.now()}${defaultExt}`;
  
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
  const propsPath = path.join(projectRoot, ".temp-props.json");
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

  // Calculate duration based on message count, display mode, and FPS
  const durationInFrames = calculateMessageDuration(props.messages.length, props.displayMode, options.fps);
  const durationInSeconds = (durationInFrames / options.fps).toFixed(1);

  // Get codec display name
  const codecNames = {
    h264: "H.264",
    h265: "H.265/HEVC",
    prores: "Apple ProRes",
  };

  console.log(`
🎬 Rendering Configuration:
   Platform: ${props.platformTheme}
   Mode: ${props.displayMode}
   Format: ${options.format}
   Resolution: ${dimensions.label} (${dimensions.width}x${dimensions.height})
   FPS: ${options.fps}fps
   Codec: ${codecNames[options.codec]}
   CRF: ${options.codec === "prores" ? "N/A (lossless)" : options.crf}
   Messages: ${props.messages.length}
   Duration: ${durationInFrames} frames (${durationInSeconds}s)
   Sender: ${props.senderName}
   Receiver: ${props.receiverName}
   Output: ${outputPath}
`);

  // Build render arguments
  const renderArgs = [
    "remotion",
    "render",
    "MessageConversation",
    outputPath,
    `--props=${propsPath}`,
    `--width=${dimensions.width}`,
    `--height=${dimensions.height}`,
    `--fps=${options.fps}`,
  ];

  // Add codec-specific options
  if (options.codec === "prores") {
    renderArgs.push("--codec=prores");
    renderArgs.push("--prores-profile=4444"); // Highest quality ProRes
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
