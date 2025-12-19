import React from "react";
import { PlatformThemeType } from "../../types/constants";

interface PlatformThemeSelectorProps {
  value: PlatformThemeType;
  onChange: (value: PlatformThemeType) => void;
  disabled?: boolean;
}

const themes: { value: PlatformThemeType; label: string; colors: string[]; icon?: string }[] = [
  {
    value: "slack",
    label: "Slack",
    colors: ["#4A154B", "#36C5F0", "#2EB67D"],
  },
  {
    value: "discord",
    label: "Discord",
    colors: ["#5865F2", "#313338", "#2B2D31"],
  },
  {
    value: "imessage",
    label: "iMessage",
    colors: ["#007AFF", "#3C3C3E", "#000000"],
  },
  {
    value: "twitter",
    label: "X / Twitter",
    colors: ["#000000", "#1D9BF0", "#E7E9EA"],
    icon: "X",
  },
];

export const PlatformThemeSelector: React.FC<PlatformThemeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Platform Theme
      </label>
      <div className="flex gap-2">
        {themes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(theme.value)}
            className={`flex-1 px-3 py-3 rounded-lg border-2 transition-all ${
              value === theme.value
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 bg-gray-800 hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span
                className={`text-sm font-medium ${
                  value === theme.value ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {theme.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
