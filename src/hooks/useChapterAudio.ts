import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseChapterAudioOptions {
  src?: string | null;
  onEnded?: () => void;
  onError?: (error: Error | null) => void;
  simulatedDurationSeconds?: number;
}

export interface UseChapterAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  error: string | null;
  hasRealSource: boolean;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (timeOrProgress: number) => void;
  reset: () => void;
}

/**
 * Dedicated, isolated audio controller hook for TheVoiceChapter.
 * Supports:
 * - Real audio playback via HTMLAudioElement when a valid source URL is supplied.
 * - Graceful fallback & simulated ethereal playback when using a placeholder source (no crashes/errors).
 * - Complete playback state: isPlaying, duration, currentTime, progress, loading, error, reset.
 */
export function useChapterAudio({
  src,
  onEnded,
  onError,
  simulatedDurationSeconds = 12,
}: UseChapterAudioOptions = {}): UseChapterAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simulationTimerRef = useRef<number | null>(null);
  const hasRealSource = Boolean(src && src.trim().length > 0);

  // Initialize and sync HTMLAudioElement if real source is available
  useEffect(() => {
    if (!hasRealSource || !src) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setDuration(simulatedDurationSeconds);
      return;
    }

    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'metadata';
    audio.src = src;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setCurrentTime(audio.currentTime);
        setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
      }
    };

    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      onEnded?.();
    };

    const handleAudioError = () => {
      // Gracefully handle missing/unreachable audio source without crashing
      setIsLoading(false);
      setIsPlaying(false);
      setError('Audio file not yet attached');
      onError?.(new Error('Audio file unavailable'));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('error', handleAudioError);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, hasRealSource, simulatedDurationSeconds, onEnded, onError]);

  // Clean up simulation timer on unmount
  useEffect(() => {
    return () => {
      if (simulationTimerRef.current !== null) {
        window.clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (simulationTimerRef.current !== null) {
      window.clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    setError(null);

    // Case 1: Real audio element present
    if (audioRef.current && hasRealSource) {
      try {
        setIsLoading(true);
        await audioRef.current.play();
        setIsLoading(false);
        setIsPlaying(true);
      } catch (err) {
        setIsLoading(false);
        // Fallback to ethereal interactive simulation if browser blocks or file not found
        console.warn('Voice note playback using placeholder simulation:', err);
        startSimulation();
      }
      return;
    }

    // Case 2: Placeholder mode (simulate smooth ethereal memory loop)
    startSimulation();
  }, [hasRealSource, simulatedDurationSeconds, onEnded]);

  const startSimulation = useCallback(() => {
    if (simulationTimerRef.current !== null) {
      window.clearInterval(simulationTimerRef.current);
    }

    setIsPlaying(true);
    const totalDuration = simulatedDurationSeconds;
    setDuration(totalDuration);

    const stepMs = 50;
    const increment = stepMs / 1000;

    simulationTimerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + increment;
        if (nextTime >= totalDuration) {
          if (simulationTimerRef.current !== null) {
            window.clearInterval(simulationTimerRef.current);
            simulationTimerRef.current = null;
          }
          setIsPlaying(false);
          setProgress(0);
          onEnded?.();
          return 0;
        }
        setProgress(nextTime / totalDuration);
        return nextTime;
      });
    }, stepMs);
  }, [simulatedDurationSeconds, onEnded]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (timeOrProgress: number) => {
      const targetTime =
        timeOrProgress <= 1 && duration > 1
          ? timeOrProgress * duration
          : Math.max(0, Math.min(duration, timeOrProgress));

      setCurrentTime(targetTime);
      setProgress(duration > 0 ? targetTime / duration : 0);

      if (audioRef.current && hasRealSource) {
        audioRef.current.currentTime = targetTime;
      }
    },
    [duration, hasRealSource]
  );

  const reset = useCallback(() => {
    pause();
    setCurrentTime(0);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [pause]);

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    error,
    hasRealSource,
    play,
    pause,
    togglePlay,
    seek,
    reset,
  };
}
