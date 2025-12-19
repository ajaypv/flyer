import React, { useState } from "react";
import { MessageType } from "../../types/constants";

interface ConversationEditorProps {
  senderName: string;
  setSenderName: (name: string) => void;
  receiverName: string;
  setReceiverName: (name: string) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  disabled?: boolean;
}

export const ConversationEditor: React.FC<ConversationEditorProps> = ({
  senderName,
  setSenderName,
  receiverName,
  setReceiverName,
  messages,
  setMessages,
  disabled = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [newMessageSender, setNewMessageSender] = useState<"sender" | "receiver">("sender");

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
      {/* Names */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Sender Name
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            disabled={disabled}
            placeholder="Alice"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Receiver Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            disabled={disabled}
            placeholder="Bob"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
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
