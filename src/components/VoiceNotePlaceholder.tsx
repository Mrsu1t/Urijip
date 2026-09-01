import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoiceNotePlaceholderProps } from '../types';

/**
 * Reusable audio interaction placeholder architecture.
 * Per specification, this is dormant/hidden from the visitor by default (isVisible = false)
 * until a real voice note is attached in future revisions.
 * Does not synthesize speech or invent audio.
 */
export const VoiceNotePlaceholder: React.FC<VoiceNotePlaceholderProps> = ({
  id = 'voice-note-placeholder',
  className = '',
  isVisible = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudioSource] = useState(false); // Set to true when real audio URL is attached

  if (!isVisible) {
    return null;
  }

  const togglePlayback = () => {
    if (!hasAudioSource) {
      // Dormant until real recording is attached
      return;
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      id={id}
      data-audio-state={isPlaying ? 'playing' : 'idle'}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md transition-all duration-300 ${className}`}
      aria-label="Voice Note Audio Player"
    >
      <button
        type="button"
        onClick={togglePlayback}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        aria-label={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="flex flex-col">
        <span className="font-body text-[11px] uppercase tracking-[0.2em] text-white/70">
          Voice Memory
        </span>
        <span className="font-editorial italic text-[10px] text-white/40">
          {hasAudioSource ? 'Recorded voice note' : 'Audio recording pending'}
        </span>
      </div>

      <Volume2 className="w-3.5 h-3.5 text-white/30 ml-auto" />
    </div>
  );
};
