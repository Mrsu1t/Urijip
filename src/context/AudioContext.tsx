import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  loadTrack: (src: string) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Lazy Audio element initialization for future ambient track integration
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Handled gracefully without breaking UI
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const loadTrack = (src: string) => {
    if (!audioRef.current) return;
    audioRef.current.src = src;
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        toggleMute,
        setVolume,
        loadTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAmbientAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAmbientAudio must be used within an AudioProvider');
  }
  return context;
};
