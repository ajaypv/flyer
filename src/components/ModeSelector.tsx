import React from "react";
import { VideoModeType } from "../../types/constants";

interface ModeSelectorProps {
  value: VideoModeType;
  onChange: (value: VideoModeType) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Video Mode
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("text")}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
            value === "text"
              ? "border-blue-500 bg-blue-500/10 text-blue-400"
              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            <span className="text-sm font-medium">Text</span>
          </div>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("message")}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
            value === "message"
              ? "border-blue-500 bg-blue-500/10 text-blue-400"
              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">Message</span>
          </div>
        </button>
      </div>
    </div>
  );
};
