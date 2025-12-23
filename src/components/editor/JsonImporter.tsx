"use client";

import React, { useCallback, useRef, useState } from "react";

interface JsonImporterProps<T> {
  onImport: (data: T) => void;
  onError?: (error: string) => void;
  validator?: (data: unknown) => { success: boolean; error?: string };
  sampleUrl?: string;
  placeholder?: string;
}

export function JsonImporter<T>({
  onImport,
  onError,
  validator,
  sampleUrl,
  placeholder = "Paste JSON or drag & drop file...",
}: JsonImporterProps<T>) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseAndValidate = useCallback(
    (text: string) => {
      try {
        const parsed = JSON.parse(text);

        if (validator) {
          const result = validator(parsed);
          if (!result.success) {
            const errorMsg = result.error || "Invalid structure";
            setError(errorMsg);
            setIsValid(false);
            onError?.(errorMsg);
            return;
          }
        }

        setError(null);
        setIsValid(true);
        onImport(parsed as T);
      } catch (e) {
        const errorMsg = (e as Error).message;
        setError(errorMsg);
        setIsValid(false);
        onError?.(errorMsg);
      }
    },
    [onImport, onError, validator]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);

    if (value.trim()) {
      parseAndValidate(value);
    } else {
      setError(null);
      setIsValid(false);
    }
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      parseAndValidate(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/json" || file.name.endsWith('.json'))) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const loadSample = async () => {
    if (!sampleUrl) return;

    try {
      const response = await fetch(sampleUrl);
      const text = await response.text();
      setJsonInput(text);
      parseAndValidate(text);
    } catch (e) {
      setError("Failed to load sample");
    }
  };

  const clearInput = () => {
    setJsonInput("");
    setError(null);
    setIsValid(false);
  };

  return (
    <div className="space-y-2">
      {/* Action Buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 h-8 bg-black/30 hover:bg-black/40 border border-white/10 rounded-lg text-[11px] text-white/60 hover:text-white/80 transition-all flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload
        </button>

        {sampleUrl && (
          <button
            onClick={loadSample}
            className="flex-1 h-8 bg-black/30 hover:bg-black/40 border border-white/10 rounded-lg text-[11px] text-white/60 hover:text-white/80 transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Sample
          </button>
        )}

        {jsonInput && (
          <button
            onClick={clearInput}
            className="h-8 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[11px] text-red-400 transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Textarea with Drag & Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-lg transition-all ${
          isDragging ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#111113]" : ""
        }`}
      >
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full h-28 px-3 py-2 bg-black/30 border rounded-lg text-[11px] font-mono text-white/70 placeholder:text-white/20 focus:outline-none transition-all resize-none ${
            error
              ? "border-red-500/50 focus:border-red-500/70"
              : isValid
              ? "border-emerald-500/50 focus:border-emerald-500/70"
              : "border-white/10 focus:border-violet-500/50"
          }`}
        />

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-violet-500/10 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-dashed border-violet-500/50">
            <span className="text-violet-300 text-xs font-medium">Drop JSON file</span>
          </div>
        )}
      </div>

      {/* Status */}
      {error && (
        <div className="flex items-start gap-1.5 text-red-400 text-[10px]">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{error}</span>
        </div>
      )}

      {isValid && !error && (
        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Valid JSON loaded</span>
        </div>
      )}
    </div>
  );
}
