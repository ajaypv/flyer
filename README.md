# Flyer - Conversation Video Generator

Generate animated conversation videos with multiple platform themes (Twitter, Discord, Slack, iMessage) and various display modes.

## Features

- 🎨 **Multiple Platform Themes**: Twitter/X, Discord, Slack, iMessage
- 📱 **Video Formats**: Landscape, Portrait, Square, Story
- 🎬 **Display Modes**: Auto-scroll, One-at-a-time, Paired
- 📺 **Quality Options**: SD (480p) to 4K UHD (2160p)
- 🔊 **Platform-specific Sound Effects**: Typing sounds and notification sounds
- 🎯 **Zoom Control**: Adjustable zoom level (0.5x to 2.0x)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the web UI
pnpm dev

# Open Remotion Studio
pnpm remotion
```

## CLI Rendering

Render conversation videos directly from JSON files using the CLI.

### Basic Usage

```bash
node scripts/render-conversation.mjs <json-file> [options]
```

### Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--platform` | `slack`, `discord`, `imessage`, `twitter` | `imessage` | Platform theme |
| `--mode` | `auto-scroll`, `one-at-a-time`, `paired` | `auto-scroll` | Display mode |
| `--format` | `landscape`, `portrait`, `square`, `story` | `landscape` | Video aspect ratio |
| `--quality` | `sd`, `hd`, `fhd`, `2k`, `4k` | `hd` | Video resolution |
| `--fps` | `30`, `60` | `30` | Frames per second |
| `--crf` | `0`-`51` | `18` | Video quality (lower = sharper text) |
| `--codec` | `h264`, `h265`, `prores` | `h264` | Video codec |
| `--output` | `<path>` | `out/conversation-{timestamp}.mp4` | Output file path |
| `--zoom` | `0.5` - `2.0` | `1.0` | Zoom level |

### Quality Presets

| Quality | Landscape | Portrait | Description |
|---------|-----------|----------|-------------|
| `sd` | 640×360 | 360×640 | 480p Standard Definition |
| `hd` | 1280×720 | 720×1280 | 720p HD (default) |
| `fhd` | 1920×1080 | 1080×1920 | 1080p Full HD |
| `2k` | 2560×1440 | 1440×2560 | 1440p 2K |
| `4k` | 3840×2160 | 2160×3840 | 2160p 4K UHD |

### FPS Options

| FPS | Description |
|-----|-------------|
| `30` | Standard 30fps (default, smaller file size) |
| `60` | High 60fps (smoother animations, larger file) |

### CRF Options (Text Sharpness)

Lower CRF = sharper text, larger file size.

| CRF | Description |
|-----|-------------|
| `0` | Lossless (huge file) |
| `15` | Ultra sharp text |
| `18` | Sharp text (default, recommended) |
| `23` | Medium quality |
| `28` | Lower quality (smaller file) |

### Codec Options

| Codec | Description |
|-------|-------------|
| `h264` | H.264/AVC (default, widely compatible) |
| `h265` | H.265/HEVC (better compression, less compatible) |
| `prores` | Apple ProRes 4444 (best quality, huge file, .mov output) |

---

## Examples

### Platform Themes

#### Twitter/X Style
```bash
# Twitter DM style - landscape HD
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter

# Twitter DM style - portrait for TikTok/Reels
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter --format portrait

# Twitter DM style - 4K quality
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform twitter --quality 4k
```

#### Discord Style
```bash
# Discord style - landscape HD
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform discord

# Discord style - portrait Full HD
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform discord --format portrait --quality fhd

# Discord style - square for Instagram
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform discord --format square
```

#### Slack Style
```bash
# Slack style - landscape HD
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform slack

# Slack style - portrait 2K quality
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform slack --format portrait --quality 2k

# Slack style - custom output path
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform slack --output out/slack-chat.mp4
```

#### iMessage Style
```bash
# iMessage style (default) - landscape HD
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform imessage

# iMessage style - story format for Instagram Stories
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform imessage --format story

# iMessage style - portrait 4K
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --platform imessage --format portrait --quality 4k
```

### Display Modes

#### Auto-Scroll Mode (Default)
Messages appear one by one with typing indicator, previous messages scroll up.
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --mode auto-scroll
```

#### One-at-a-Time Mode
Shows one message at a time with transitions between messages.
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --mode one-at-a-time
```

#### Paired Mode
Shows messages in sender/receiver pairs together.
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --mode paired
```

### Video Formats

#### Landscape (16:9) - YouTube, Standard
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --format landscape
```

#### Portrait (9:16) - TikTok, Instagram Reels, YouTube Shorts
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --format portrait
```

#### Square (1:1) - Instagram Feed
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --format square
```

#### Story (9:16) - Instagram/Facebook Stories
```bash
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json --format story
```

### Combined Examples

```bash
# Twitter portrait 4K for TikTok
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform twitter \
  --format portrait \
  --quality 4k \
  --output out/twitter-tiktok-4k.mp4

# Twitter portrait 4K at 60fps for ultra-smooth TikTok
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform twitter \
  --format portrait \
  --quality 4k \
  --fps 60 \
  --output out/twitter-tiktok-4k-60fps.mp4

# Instagram Reels - SHARP TEXT (recommended)
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform twitter \
  --format portrait \
  --quality fhd \
  --fps 60 \
  --crf 15 \
  --output out/instagram-sharp.mp4

# Maximum quality with ProRes (for editing)
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform twitter \
  --format portrait \
  --quality 4k \
  --fps 60 \
  --codec prores \
  --output out/master-quality.mov

# Discord square Full HD for Instagram
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform discord \
  --format square \
  --quality fhd \
  --mode one-at-a-time \
  --output out/discord-instagram.mp4

# Slack landscape 2K with zoom
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform slack \
  --format landscape \
  --quality 2k \
  --zoom 1.2 \
  --output out/slack-zoomed.mp4

# iMessage story format for Instagram Stories at 60fps
node scripts/render-conversation.mjs conversations/elon-vs-zuck.json \
  --platform imessage \
  --format story \
  --quality fhd \
  --fps 60 \
  --mode paired \
  --output out/imessage-story-60fps.mp4
```


---

## Conversation JSON Format

Create a JSON file with your conversation data:

```json
{
  "senderName": "Elon Musk",
  "senderAvatarUrl": "https://example.com/elon-avatar.jpg",
  "senderHandle": "@elonmusk",
  "receiverName": "Mark Zuckerberg",
  "receiverAvatarUrl": "https://example.com/zuck-avatar.jpg",
  "receiverHandle": "@finkd",
  "platformTheme": "twitter",
  "displayMode": "auto-scroll",
  "zoomLevel": 1.0,
  "messages": [
    { "id": "1", "text": "Hey! How are you?", "sender": "sender" },
    { "id": "2", "text": "I'm doing great, thanks!", "sender": "receiver" },
    { "id": "3", "text": "Want to grab coffee?", "sender": "sender" },
    { "id": "4", "text": "Sure! When works for you?", "sender": "receiver" }
  ]
}
```

### JSON Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `senderName` | string | Yes | Display name for the sender |
| `senderAvatarUrl` | string | No | Avatar image URL for sender |
| `senderHandle` | string | No | Username/handle (e.g., @elonmusk) |
| `receiverName` | string | Yes | Display name for the receiver |
| `receiverAvatarUrl` | string | No | Avatar image URL for receiver |
| `receiverHandle` | string | No | Username/handle for receiver |
| `platformTheme` | string | No | Default platform theme |
| `displayMode` | string | No | Default display mode |
| `zoomLevel` | number | No | Default zoom level (0.5-2.0) |
| `messages` | array | Yes | Array of message objects |

### Message Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | No | Unique message ID (auto-generated if missing) |
| `text` | string | Yes | Message content |
| `sender` | string | Yes | Either `"sender"` or `"receiver"` |

---

## Web UI

Start the development server to use the web interface:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to:
- Preview conversations in real-time
- Edit messages interactively
- Import/export JSON conversations
- Adjust all rendering settings
- Render videos via AWS Lambda

---

## npm Scripts

```bash
pnpm dev                    # Start Next.js dev server
pnpm remotion               # Open Remotion Studio
pnpm render                 # Basic Remotion render
pnpm render:conversation    # CLI conversation renderer (shortcut)
pnpm build                  # Build for production
pnpm deploy                 # Deploy to AWS Lambda
```

---

## AWS Lambda Rendering

For cloud-based rendering, set up AWS Lambda:

1. Copy `.env.example` to `.env` and fill in AWS credentials
2. Complete the [Lambda setup guide](https://www.remotion.dev/docs/lambda/setup)
3. Edit `config.mjs` for Lambda settings
4. Run `node deploy.mjs` to deploy

---

## Platform Theme Details

### Twitter/X
- Dark background with blue accent
- Thread header with back arrow
- Notification sound only (no typing sound)

### Discord
- Dark purple/gray background
- Channel header (#general)
- Username colors and timestamps
- Typing and message sounds

### Slack
- Dark background
- Channel header (# conversation)
- Threaded message style
- Typing and ping sounds

### iMessage
- Dark background with blue/gray bubbles
- Contact header with avatar
- Typing and message sounds

---

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
