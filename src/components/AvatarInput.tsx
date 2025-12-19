import React, { useRef, useState } from "react";
import { DEFAULT_AVATARS, DefaultAvatar } from "../../types/constants";

interface AvatarInputProps {
  label: string;
  name: string;
  avatarUrl: string;
  handle: string;
  onNameChange: (name: string) => void;
  onAvatarChange: (url: string) => void;
  onHandleChange: (handle: string) => void;
  showHandle?: boolean;
  disabled?: boolean;
}

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    // Allow data URLs
    if (url.startsWith("data:image/")) return true;
    // Allow http/https URLs
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Extract initial from name for fallback avatar
export const getInitial = (name: string): string => {
  if (!name || name.trim().length === 0) return "?";
  const trimmed = name.trim();
  // Get first character
  const firstChar = trimmed.charAt(0);
  return firstChar ? firstChar.toUpperCase() : "?";
};

export const AvatarInput: React.FC<AvatarInputProps> = ({
  label,
  name,
  avatarUrl,
  handle,
  onNameChange,
  onAvatarChange,
  onHandleChange,
  showHandle = false,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum size is 5MB.");
      return;
    }

    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onAvatarChange(dataUrl);
      setImageError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectDefault = (avatar: DefaultAvatar) => {
    onNameChange(avatar.name);
    onAvatarChange(avatar.url);
    onHandleChange(avatar.handle);
    setShowDropdown(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const showFallback = !avatarUrl || imageError || !isValidUrl(avatarUrl);

  return (
    <div className="mb-4 p-3 bg-background rounded-lg border border-unfocused">
      <div className="text-sm font-medium text-foreground mb-2">{label}</div>
      
      <div className="flex gap-3">
        {/* Avatar Preview */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {showFallback ? (
              <span className="text-white text-xl font-semibold">
                {getInitial(name)}
              </span>
            ) : (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex-1 space-y-2">
          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name"
            disabled={disabled}
            className="w-full px-3 py-1.5 text-sm bg-background border border-unfocused rounded focus:border-brand focus:outline-none text-foreground"
          />

          {/* Handle Input (for Twitter) */}
          {showHandle && (
            <input
              type="text"
              value={handle}
              onChange={(e) => onHandleChange(e.target.value)}
              placeholder="@handle"
              disabled={disabled}
              className="w-full px-3 py-1.5 text-sm bg-background border border-unfocused rounded focus:border-brand focus:outline-none text-foreground"
            />
          )}

          {/* Avatar URL Input */}
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => {
              onAvatarChange(e.target.value);
              setImageError(false);
            }}
            placeholder="Avatar URL (https://...)"
            disabled={disabled}
            className="w-full px-3 py-1.5 text-sm bg-background border border-unfocused rounded focus:border-brand focus:outline-none text-foreground"
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={disabled}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50"
              >
                Defaults ▼
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                  {DEFAULT_AVATARS.map((avatar) => (
                    <button
                      key={avatar.handle}
                      type="button"
                      onClick={() => handleSelectDefault(avatar)}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 text-left text-sm text-white"
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{avatar.name}</div>
                        <div className="text-xs text-gray-400">{avatar.handle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
