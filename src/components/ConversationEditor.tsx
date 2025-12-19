import React, { useState, useRef } from "react";
import { MessageType, PlatformThemeType } from "../../types/constants";
import { AvatarInput } from "./AvatarInput";

// JSON schema for conversation import
export interface ConversationJson {
  senderName?: string;
  senderAvatarUrl?: string;
  senderHandle?: string;
  receiverName?: string;
  receiverAvatarUrl?: string;
  receiverHandle?: string;
  messages: Array<{
    id?: string;
    text: string;
    sender: "sender" | "receiver";
  }>;
}

interface ConversationEditorProps {
  senderName: string;
  setSenderName: (name: string) => void;
  senderAvatarUrl: string;
  setSenderAvatarUrl: (url: string) => void;
  senderHandle: string;
  setSenderHandle: (handle: string) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  receiverAvatarUrl: string;
  setReceiverAvatarUrl: (url: string) => void;
  receiverHandle: string;
  setReceiverHandle: (handle: string) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  platformTheme: PlatformThemeType;
  disabled?: boolean;
}

export const ConversationEditor: React.FC<ConversationEditorProps> = ({
  senderName,
  setSenderName,
  senderAvatarUrl,
  setSenderAvatarUrl,
  senderHandle,
  setSenderHandle,
  receiverName,
  setReceiverName,
  receiverAvatarUrl,
  setReceiverAvatarUrl,
  receiverHandle,
  setReceiverHandle,
  messages,
  setMessages,
  platformTheme,
  disabled = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [newMessageSender, setNewMessageSender] = useState<"sender" | "receiver">("sender");
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show handle input for Twitter theme
  const showHandle = platformTheme === "twitter";

  // Generate example JSON for user reference
  const exampleJson: ConversationJson = {
    senderName: "Elon Musk",
    senderAvatarUrl: "https://example.com/elon.jpg",
    senderHandle: "@elonmusk",
    receiverName: "Mark Zuckerberg",
    receiverAvatarUrl: "https://example.com/mark.jpg",
    receiverHandle: "@faborig",
    messages: [
      { text: "Hey! How are you?", sender: "sender" },
      { text: "I'm doing great, thanks!", sender: "receiver" },
      { text: "Want to have a cage fight?", sender: "sender" },
    ],
  };

  // Parse and validate JSON
  const parseConversationJson = (jsonStr: string): ConversationJson | null => {
    try {
      const parsed = JSON.parse(jsonStr);
      
      // Validate messages array exists
      if (!parsed.messages || !Array.isArray(parsed.messages)) {
        setJsonError("JSON must contain a 'messages' array");
        return null;
      }

      // Validate each message
      for (let i = 0; i < parsed.messages.length; i++) {
        const msg = parsed.messages[i];
        if (!msg.text || typeof msg.text !== "string") {
          setJsonError(`Message ${i + 1} must have a 'text' field`);
          return null;
        }
        if (!msg.sender || (msg.sender !== "sender" && msg.sender !== "receiver")) {
          setJsonError(`Message ${i + 1} must have 'sender' as "sender" or "receiver"`);
          return null;
        }
      }

      setJsonError(null);
      return parsed as ConversationJson;
    } catch {
      setJsonError("Invalid JSON format");
      return null;
    }
  };

  // Apply parsed JSON to state
  const applyConversationJson = (data: ConversationJson) => {
    if (data.senderName) setSenderName(data.senderName);
    if (data.senderAvatarUrl) setSenderAvatarUrl(data.senderAvatarUrl);
    if (data.senderHandle) setSenderHandle(data.senderHandle);
    if (data.receiverName) setReceiverName(data.receiverName);
    if (data.receiverAvatarUrl) setReceiverAvatarUrl(data.receiverAvatarUrl);
    if (data.receiverHandle) setReceiverHandle(data.receiverHandle);
    
    // Convert messages with IDs
    const messagesWithIds: MessageType[] = data.messages.map((msg, index) => ({
      id: msg.id || `imported-${Date.now()}-${index}`,
      text: msg.text,
      sender: msg.sender,
    }));
    setMessages(messagesWithIds);
    
    setShowJsonImport(false);
    setJsonInput("");
  };

  // Handle paste import
  const handlePasteImport = () => {
    const parsed = parseConversationJson(jsonInput);
    if (parsed) {
      applyConversationJson(parsed);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setJsonError("Please select a .json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseConversationJson(content);
      if (parsed) {
        applyConversationJson(parsed);
      }
    };
    reader.onerror = () => {
      setJsonError("Failed to read file");
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copy example JSON to clipboard
  const copyExampleJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exampleJson, null, 2));
  };

  const addMessage = () => {
    if (!newMessage.trim()) return;
    const message: MessageType = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: newMessageSender,
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="mb-4">
      {/* Import JSON Button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setShowJsonImport(!showJsonImport)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import JSON
        </button>
      </div>

      {/* JSON Import Panel */}
      {showJsonImport && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Import Conversation from JSON</h3>
            <button
              type="button"
              onClick={() => {
                setShowJsonImport(false);
                setJsonInput("");
                setJsonError(null);
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Two options: Paste or Upload */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center">
              <label className="block text-xs text-gray-400 mb-2">Option 1: Paste JSON</label>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
                placeholder='{"messages": [{"text": "Hello", "sender": "sender"}]}'
                className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-xs font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="button"
                onClick={handlePasteImport}
                disabled={!jsonInput.trim()}
                className="mt-2 px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import from Paste
              </button>
            </div>

            <div className="text-center">
              <label className="block text-xs text-gray-400 mb-2">Option 2: Upload File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-24 border-2 border-dashed border-gray-600 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs text-gray-400">Click to select .json file</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Error message */}
          {jsonError && (
            <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs">
              {jsonError}
            </div>
          )}

          {/* Example JSON */}
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Example JSON format:</span>
              <button
                type="button"
                onClick={copyExampleJson}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Copy example
              </button>
            </div>
            <pre className="p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto max-h-32">
              {JSON.stringify(exampleJson, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Participant Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <AvatarInput
          label="Sender"
          name={senderName}
          avatarUrl={senderAvatarUrl}
          handle={senderHandle}
          onNameChange={setSenderName}
          onAvatarChange={setSenderAvatarUrl}
          onHandleChange={setSenderHandle}
          showHandle={showHandle}
          disabled={disabled}
        />
        <AvatarInput
          label="Receiver"
          name={receiverName}
          avatarUrl={receiverAvatarUrl}
          handle={receiverHandle}
          onNameChange={setReceiverName}
          onAvatarChange={setReceiverAvatarUrl}
          onHandleChange={setReceiverHandle}
          showHandle={showHandle}
          disabled={disabled}
        />
      </div>

      {/* Messages List */}
      <label className="block text-sm font-medium text-foreground mb-2">
        Messages
      </label>
      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No messages yet. Add one below.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 p-2 rounded-lg ${
                msg.sender === "sender"
                  ? "bg-blue-500/10 border border-blue-500/30"
                  : "bg-gray-700/50 border border-gray-600"
              }`}
            >
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-medium ${
                    msg.sender === "sender" ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  {msg.sender === "sender" ? senderName || "Sender" : receiverName || "Receiver"}
                </span>
                <p className="text-sm text-white truncate">{msg.text}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteMessage(msg.id)}
                disabled={disabled}
                className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Message */}
      <div className="flex gap-2">
        <select
          value={newMessageSender}
          onChange={(e) => setNewMessageSender(e.target.value as "sender" | "receiver")}
          disabled={disabled}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
        >
          <option value="sender">{senderName || "Sender"}</option>
          <option value="receiver">{receiverName || "Receiver"}</option>
        </select>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addMessage}
          disabled={disabled || !newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
};
