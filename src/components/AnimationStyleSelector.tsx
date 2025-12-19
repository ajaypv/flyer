import React from "react";
import { TextAnimationStyleType } from "../../types/constants";

const options: { value: TextAnimationStyleType; label: string; description: string }[] = [
  { value: "typing", label: "Typing", description: "Character by character" },
  { value: "magical", label: "Magical", description: "Gradient reveal" },
];

export const AnimationStyleSelector: React.FC<{
  value: TextAnimationStyleType;
  onChange: (value: TextAnimationStyleType) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Text Animation
      </label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-4 py-3 rounded-geist border transition-all
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-focused-border-color"}
              ${value === option.value 
                ? "border-focused-border-color bg-foreground/5" 
                : "border-unfocused-border-color"
              }
            `}
          >
            <div className="text-sm font-medium text-foreground">{option.label}</div>
            <div className="text-xs text-subtitle mt-1">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
