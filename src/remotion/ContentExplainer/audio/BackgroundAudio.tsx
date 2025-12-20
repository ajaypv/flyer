import React from "react";
import { Audio, staticFile } from "remotion";

// Available background music tracks
export const AUDIO_TRACKS = [
    {
        id: "none",
        name: "No Music",
        file: null,
    },
    {
        id: "explainer",
        name: "Explainer",
        file: "/sound/video_sound/explainer-333414.mp3",
    },
    {
        id: "infographic",
        name: "Infographic Tutorial",
        file: "/sound/video_sound/infographic-tutorial-explainer-music-351822.mp3",
    },
    {
        id: "tutorial",
        name: "Tutorial Explainer",
        file: "/sound/video_sound/tutorial-infographic-explainer-music-338515.mp3",
    },
] as const;

export type AudioTrackId = typeof AUDIO_TRACKS[number]["id"];

export interface BackgroundAudioProps {
    trackId: AudioTrackId;
    volume?: number;
}

export const BackgroundAudio: React.FC<BackgroundAudioProps> = ({
    trackId,
    volume = 0.3,
}) => {
    // Find the track
    const track = AUDIO_TRACKS.find((t) => t.id === trackId);

    // If no track or "none" selected, render nothing
    if (!track || !track.file) {
        return null;
    }

    return (
        <Audio
            src={staticFile(track.file)}
            volume={volume}
            loop
        />
    );
};

// Helper to get track by ID
export const getAudioTrack = (id: AudioTrackId) => {
    return AUDIO_TRACKS.find((t) => t.id === id);
};

// Get all track options for selector
export const getAudioTrackOptions = () => {
    return AUDIO_TRACKS.map((track) => ({
        value: track.id,
        label: track.name,
    }));
};
