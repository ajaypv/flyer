import React from "react";
import { DisplayModeType } from "../../types/constants";

interface DisplayModeSelectorProps {
  value: DisplayModeType;
  onChange: (value: DisplayModeType) => void;
  disabled?: boolean;
}

const modes: { value: DisplayModeType; label: string; description: string }[] = [
  {
    value: "auto-scroll",
    label: "Auto-scroll",
    description: "Messages scroll up as new ones appear",
  },
  {
    value: "one-at-a-time",
    label: "One at a time",
    description: "Each message fades in and out",
  },
  {
    value: "paired",
    label: "Paired",
    description: "Show sender & receiver together",
  },
];

export const DisplayModeSelector: React.FC<DisplayModeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Display Mode
      </label>
      <div className="flex flex-col gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mode.value)}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
              value === mode.value
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  value === mode.value
                    ? "border-blue-500"
                    : "border-gray-500"
                }`}
              >
                {value === mode.value && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <div>
                <span
                  className={`text-sm font-medium ${
                    value === mode.value ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {mode.label}
                </span>
                <p className="text-xs text-gray-500">{mode.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
