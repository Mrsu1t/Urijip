import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export const DEFAULT_BACKGROUND_TRACK =
  'https://www.image2url.com/r2/default/audio/1788294708050-913bcd81-c225-45a5-a020-b875a1345447.mp3';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  loadTrack: (src: string) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.65);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userManuallyPausedRef = useRef(false);

  // Initialize and attempt autoplay on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audio.src = DEFAULT_BACKGROUND_TRACK;
    audioRef.current = audio;

    const startPlayback = () => {
      if (userManuallyPausedRef.current) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was blocked by browser policy; will unlock on first user gesture
          setIsPlaying(false);
        });
    };

    // Attempt immediate playback on mount
    startPlayback();

    // Fallback: Unlock autoplay on first user interaction if browser blocked initial play()
    const handleFirstInteraction = () => {
      if (!userManuallyPausedRef.current && audio.paused) {
        startPlayback();
      }
      removeInteractionListeners();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true, once: true });

    return () => {
      removeInteractionListeners();
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    userManuallyPausedRef.current = false;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Background audio playback blocked or interrupted:', err);
      });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    userManuallyPausedRef.current = true;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const loadTrack = useCallback((src: string) => {
    if (!audioRef.current) return;
    audioRef.current.src = src;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        play,
        pause,
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
