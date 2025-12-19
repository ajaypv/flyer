import React from "react";
import { VideoFormatType, VIDEO_FORMAT_CONFIGS } from "../../types/constants";

interface VideoFormatSelectorProps {
  value: VideoFormatType;
  onChange: (value: VideoFormatType) => void;
  disabled?: boolean;
}

const formats: VideoFormatType[] = ["landscape", "portrait", "square", "story"];

export const VideoFormatSelector: React.FC<VideoFormatSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Video Format
      </label>
      <div className="grid grid-cols-4 gap-2">
        {formats.map((format) => {
          const config = VIDEO_FORMAT_CONFIGS[format];
          const isPortrait = config.height > config.width;
          const isSquare = config.height === config.width;

          return (
            <button
              key={format}
              type="button"
              disabled={disabled}
              onClick={() => onChange(format)}
              className={`px-2 py-3 rounded-lg border-2 transition-all ${
                value === format
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-800 hover:border-gray-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Aspect ratio preview */}
                <div
                  className={`border-2 ${
                    value === format ? "border-blue-400" : "border-gray-500"
                  }`}
                  style={{
                    width: isPortrait ? 16 : isSquare ? 24 : 32,
                    height: isPortrait ? 28 : isSquare ? 24 : 18,
                    borderRadius: 2,
                  }}
                />
                <div className="text-center">
                  <span
                    className={`text-xs font-medium block ${
                      value === format ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    {format === "landscape"
                      ? "16:9"
                      : format === "portrait" || format === "story"
                      ? "9:16"
                      : "1:1"}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {config.description.split(",")[0]}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
