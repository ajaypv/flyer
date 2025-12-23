"use client";

import React, { useState } from "react";

interface EditorSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  badge?: string;
}

export function EditorSection({
  title,
  icon,
  children,
  defaultOpen = true,
  collapsible = true,
  badge,
}: EditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 flex items-center justify-between text-left ${
          collapsible ? "hover:bg-white/[0.02] cursor-pointer" : "cursor-default"
        } transition-colors`}
        disabled={!collapsible}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-white/40">{icon}</span>}
          <span className="text-xs font-medium text-white/70 uppercase tracking-wide">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] rounded font-medium">
              {badge}
            </span>
          )}
        </div>
        {collapsible && (
          <svg
            className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/5">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface EditorFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export function EditorField({ label, children, hint }: EditorFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-white/30">{hint}</p>}
    </div>
  );
}

interface EditorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function EditorInput({ label, className = "", ...props }: EditorInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full h-9 px-3 bg-black/30 border border-white/10 rounded-lg text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

interface EditorSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function EditorSelect({ label, options, className = "", ...props }: EditorSelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full h-9 px-3 bg-black/30 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
          paddingRight: '32px'
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a1c]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface EditorTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function EditorTextarea({ label, className = "", ...props }: EditorTextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

interface EditorButtonGroupProps {
  label?: string;
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
}

export function EditorButtonGroup({ label, options, value, onChange, size = "md" }: EditorButtonGroupProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 ${size === "sm" ? "h-7 text-[11px]" : "h-8 text-xs"} rounded-md font-medium transition-all ${
              value === opt.value
                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface EditorSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function EditorSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  showValue = true,
  valueFormatter = (v) => String(v),
}: EditorSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            {label}
          </label>
          {showValue && (
            <span className="text-[10px] text-white/50 font-mono">{valueFormatter(value)}</span>
          )}
        </div>
      )}
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-black/50 pointer-events-none"
          style={{ left: `calc(${percentage}% - 7px)` }}
        />
      </div>
    </div>
  );
}

interface EditorColorGridProps {
  label?: string;
  options: { value: string; label: string; color?: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
  columns?: number;
}

export function EditorColorGrid({ label, options, value, onChange, columns = 3 }: EditorColorGridProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`h-9 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1 ${
              value === opt.value
                ? "bg-violet-500/20 border-violet-500/50 text-violet-300 border"
                : "bg-black/20 border border-white/5 text-white/50 hover:bg-white/5 hover:text-white/70"
            }`}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span className="truncate px-1">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
