import React from "react";
import { BackgroundStyleType } from "../../types/constants";

const options: { value: BackgroundStyleType; label: string; preview: React.CSSProperties }[] = [
  { 
    value: "black", 
    label: "Black", 
    preview: { backgroundColor: "#000000" } 
  },
  { 
    value: "white", 
    label: "White", 
    preview: { backgroundColor: "#FFFFFF", border: "1px solid #eaeaea" } 
  },
  { 
    value: "shooting-stars", 
    label: "Stars", 
    preview: { 
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    } 
  },
  { 
    value: "ice-galaxy", 
    label: "Galaxy", 
    preview: { 
      background: "linear-gradient(135deg, #1a1a2e 0%, #533483 50%, #0f3460 100%)",
    } 
  },
];

export const BackgroundSelector: React.FC<{
  value: BackgroundStyleType;
  onChange: (value: BackgroundStyleType) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Background
      </label>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col items-center p-2 rounded-geist border transition-all
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-focused-border-color"}
              ${value === option.value 
                ? "border-focused-border-color ring-2 ring-focused-border-color/20" 
                : "border-unfocused-border-color"
              }
            `}
          >
            <div 
              className="w-full aspect-video rounded-sm mb-1"
              style={option.preview}
            />
            <div className="text-xs text-foreground">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
