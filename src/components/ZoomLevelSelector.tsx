import React from "react";

interface ZoomLevelSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const ZoomLevelSelector: React.FC<ZoomLevelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const presets = [
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1.0 },
    { label: "125%", value: 1.25 },
    { label: "150%", value: 1.5 },
  ];

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-foreground mb-2">Zoom Level</div>
      <div className="flex items-center gap-3">
        {/* Preset buttons */}
        <div className="flex gap-1">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              disabled={disabled}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(value - preset.value) < 0.01
                  ? "bg-brand text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              } disabled:opacity-50`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        {/* Slider for fine control */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand disabled:opacity-50"
          />
          <span className="text-xs text-subtitle w-12 text-right">
            {Math.round(value * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
