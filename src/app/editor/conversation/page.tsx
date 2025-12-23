"use client";

import { useMemo, useState, useCallback } from "react";
import { EditorLayout } from "@/components/editor/EditorLayout";
import {
  EditorSection,
  EditorInput,
  EditorSelect,
  EditorButtonGroup,
  EditorSlider,
  EditorColorGrid,
} from "@/components/editor/EditorSection";
import { VideoPlayer } from "@/components/editor/VideoPlayer";
import { JsonImporter } from "@/components/editor/JsonImporter";
import { MessageConversation } from "@/remotion/MessageComp/MessageConversation";
import {
  defaultMessageConversationProps,
  MessageType,
  PlatformThemeType,
  DisplayModeType,
  VideoFormatType,
  VIDEO_FORMAT_CONFIGS,
  VIDEO_FPS,
  calculateMessageDuration,
  DEFAULT_AVATARS,
} from "../../../../types/constants";

interface ConversationJson {
  senderName?: string;
  senderAvatarUrl?: string;
  senderHandle?: string;
  receiverName?: string;
  receiverAvatarUrl?: string;
  receiverHandle?: string;
  platformTheme?: PlatformThemeType;
  displayMode?: DisplayModeType;
  zoomLevel?: number;
  messages: MessageType[];
}

export default function ConversationEditorPage() {
  // Format
  const [videoFormat, setVideoFormat] = useState<VideoFormatType>("portrait");

  // Participants
  const [senderName, setSenderName] = useState(defaultMessageConversationProps.senderName);
  const [senderAvatarUrl, setSenderAvatarUrl] = useState(defaultMessageConversationProps.senderAvatarUrl || "");
  const [senderHandle, setSenderHandle] = useState(defaultMessageConversationProps.senderHandle || "@user");
  const [receiverName, setReceiverName] = useState(defaultMessageConversationProps.receiverName);
  const [receiverAvatarUrl, setReceiverAvatarUrl] = useState(defaultMessageConversationProps.receiverAvatarUrl || "");
  const [receiverHandle, setReceiverHandle] = useState(defaultMessageConversationProps.receiverHandle || "@user");

  // Messages
  const [messages, setMessages] = useState<MessageType[]>(defaultMessageConversationProps.messages);

  // Style
  const [platformTheme, setPlatformTheme] = useState<PlatformThemeType>(defaultMessageConversationProps.platformTheme);
  const [displayMode, setDisplayMode] = useState<DisplayModeType>(defaultMessageConversationProps.displayMode);
  const [zoomLevel, setZoomLevel] = useState(defaultMessageConversationProps.zoomLevel);

  // Input props
  const inputProps = useMemo(() => ({
    senderName,
    senderAvatarUrl: senderAvatarUrl || undefined,
    senderHandle: senderHandle || undefined,
    receiverName,
    receiverAvatarUrl: receiverAvatarUrl || undefined,
    receiverHandle: receiverHandle || undefined,
    messages,
    platformTheme,
    displayMode,
    zoomLevel,
  }), [senderName, senderAvatarUrl, senderHandle, receiverName, receiverAvatarUrl, receiverHandle, messages, platformTheme, displayMode, zoomLevel]);

  // Duration
  const durationInFrames = useMemo(() => {
    return calculateMessageDuration(messages.length, displayMode);
  }, [messages.length, displayMode]);

  const { width, height } = VIDEO_FORMAT_CONFIGS[videoFormat];
  const estimatedDuration = Math.round(durationInFrames / VIDEO_FPS);

  // Message handlers
  const addMessage = useCallback(() => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      text: "",
      sender: messages.length % 2 === 0 ? "sender" : "receiver",
    };
    setMessages([...messages, newMessage]);
  }, [messages]);

  const updateMessage = useCallback((id: string, text: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, text } : m)));
  }, [messages]);

  const toggleMessageSender = useCallback((id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, sender: m.sender === "sender" ? "receiver" : "sender" } : m)));
  }, [messages]);

  const removeMessage = useCallback((id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  }, [messages]);

  // JSON import
  const handleJsonImport = useCallback((data: ConversationJson) => {
    if (data.senderName) setSenderName(data.senderName);
    if (data.senderAvatarUrl) setSenderAvatarUrl(data.senderAvatarUrl);
    if (data.senderHandle) setSenderHandle(data.senderHandle);
    if (data.receiverName) setReceiverName(data.receiverName);
    if (data.receiverAvatarUrl) setReceiverAvatarUrl(data.receiverAvatarUrl);
    if (data.receiverHandle) setReceiverHandle(data.receiverHandle);
    if (data.platformTheme) setPlatformTheme(data.platformTheme);
    if (data.displayMode) setDisplayMode(data.displayMode);
    if (data.zoomLevel) setZoomLevel(data.zoomLevel);
    if (data.messages) setMessages(data.messages);
  }, []);

  // Avatar presets
  const selectPresetAvatar = useCallback((type: "sender" | "receiver", avatar: typeof DEFAULT_AVATARS[0]) => {
    if (type === "sender") {
      setSenderName(avatar.name);
      setSenderAvatarUrl(avatar.url);
      setSenderHandle(avatar.handle);
    } else {
      setReceiverName(avatar.name);
      setReceiverAvatarUrl(avatar.url);
      setReceiverHandle(avatar.handle);
    }
  }, []);

  // Video preview
  const videoPreview = (
    <div
      className="rounded-xl overflow-hidden shadow-2xl shadow-violet-500/5 border border-white/5"
      style={{
        maxWidth: height > width ? "320px" : "100%",
      }}
    >
      <VideoPlayer
        component={MessageConversation}
        inputProps={inputProps}
        durationInFrames={durationInFrames}
        fps={VIDEO_FPS}
        width={width}
        height={height}
      />
    </div>
  );

  return (
    <EditorLayout
      title="Chat Conversation"
      icon="💬"
      videoPreview={videoPreview}
      videoInfo={{ width, height, duration: estimatedDuration, fps: VIDEO_FPS }}
      durationInFrames={durationInFrames}
    >
      {/* Import */}
      <EditorSection title="Import" defaultOpen={false}>
        <JsonImporter<ConversationJson>
          onImport={handleJsonImport}
          sampleUrl="/conversations/elon-vs-zuck.json"
        />
      </EditorSection>

      {/* Format */}
      <EditorSection title="Format">
        <EditorButtonGroup
          label="Aspect Ratio"
          options={[
            { value: "portrait", label: "9:16" },
            { value: "landscape", label: "16:9" },
            { value: "square", label: "1:1" },
          ]}
          value={videoFormat}
          onChange={(v) => setVideoFormat(v as VideoFormatType)}
          size="sm"
        />
      </EditorSection>

      {/* Platform */}
      <EditorSection title="Platform">
        <EditorColorGrid
          options={[
            { value: "imessage", label: "iMessage", icon: "🍎" },
            { value: "twitter", label: "Twitter", icon: "𝕏" },
            { value: "discord", label: "Discord", icon: "🎮" },
            { value: "slack", label: "Slack", icon: "💼" },
          ]}
          value={platformTheme}
          onChange={(v) => setPlatformTheme(v as PlatformThemeType)}
          columns={2}
        />

        <EditorSelect
          label="Animation"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value as DisplayModeType)}
          options={[
            { value: "auto-scroll", label: "Auto Scroll" },
            { value: "one-at-a-time", label: "One at a Time" },
            { value: "paired", label: "Paired Messages" },
          ]}
        />

        <EditorSlider
          label="Zoom"
          value={zoomLevel}
          onChange={setZoomLevel}
          min={0.5}
          max={2}
          step={0.1}
          valueFormatter={(v) => `${Math.round(v * 100)}%`}
        />
      </EditorSection>

      {/* Sender */}
      <EditorSection title="Sender" badge="Person 1">
        <div className="flex gap-1 mb-3">
          {DEFAULT_AVATARS.slice(0, 3).map((avatar) => (
            <button
              key={avatar.name}
              onClick={() => selectPresetAvatar("sender", avatar)}
              className="flex-1 h-9 bg-black/20 hover:bg-black/30 border border-white/5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <img src={avatar.url} alt={avatar.name} className="w-5 h-5 rounded-full" />
              <span className="text-[10px] text-white/50">{avatar.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <EditorInput
          label="Name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Name"
        />
        <EditorInput
          label="Handle"
          value={senderHandle}
          onChange={(e) => setSenderHandle(e.target.value)}
          placeholder="@username"
        />
        <EditorInput
          label="Avatar URL"
          value={senderAvatarUrl}
          onChange={(e) => setSenderAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
      </EditorSection>

      {/* Receiver */}
      <EditorSection title="Receiver" badge="Person 2">
        <div className="flex gap-1 mb-3">
          {DEFAULT_AVATARS.slice(3, 6).map((avatar) => (
            <button
              key={avatar.name}
              onClick={() => selectPresetAvatar("receiver", avatar)}
              className="flex-1 h-9 bg-black/20 hover:bg-black/30 border border-white/5 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <img src={avatar.url} alt={avatar.name} className="w-5 h-5 rounded-full" />
              <span className="text-[10px] text-white/50">{avatar.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <EditorInput
          label="Name"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="Name"
        />
        <EditorInput
          label="Handle"
          value={receiverHandle}
          onChange={(e) => setReceiverHandle(e.target.value)}
          placeholder="@username"
        />
        <EditorInput
          label="Avatar URL"
          value={receiverAvatarUrl}
          onChange={(e) => setReceiverAvatarUrl(e.target.value)}
          placeholder="https://..."
        />
      </EditorSection>

      {/* Messages */}
      <EditorSection title="Messages" badge={String(messages.length)}>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="flex gap-1.5 items-center group"
            >
              <button
                onClick={() => toggleMessageSender(message.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                  message.sender === "sender"
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "bg-white/5 text-white/40 border border-white/10"
                }`}
                title="Toggle sender"
              >
                {message.sender === "sender" ? "1" : "2"}
              </button>
              <input
                value={message.text}
                onChange={(e) => updateMessage(message.id, e.target.value)}
                placeholder={`Message ${index + 1}`}
                className="flex-1 h-8 px-2 bg-black/20 border border-white/5 rounded-md text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-violet-500/30"
              />
              <button
                onClick={() => removeMessage(message.id)}
                className="flex-shrink-0 w-6 h-6 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-3.5 h-3.5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addMessage}
          className="w-full h-8 border border-dashed border-white/10 hover:border-violet-500/30 rounded-lg text-white/30 hover:text-violet-400 transition-all text-xs flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Message
        </button>
      </EditorSection>
    </EditorLayout>
  );
}
