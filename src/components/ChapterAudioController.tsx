import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';

export interface ChapterAudioControllerProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentTime?: number;
  duration?: number;
  onTogglePlay: () => void;
  label?: string;
  subtext?: string;
  className?: string;
  id?: string;
}

export const ChapterAudioController: React.FC<ChapterAudioControllerProps> = ({
  isPlaying,
  progress = 0,
  currentTime = 0,
  duration = 0,
  onTogglePlay,
  label = 'LISTEN',
  subtext = "There's something I'd like you to hear.",
  className = '',
  id = 'chapter-audio-controller',
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Progress Ring Geometry (Radius = 26, Circumference = 2 * PI * 26 ≈ 163.36)
  const radius = 26;
  const strokeWidth = 1.75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - clampedProgress * circumference;

  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Optional Subtle Invitation Line */}
      {subtext && (
        <p
          id="audio-controller-subtext"
          className="font-editorial italic text-sm sm:text-base text-white/70 tracking-wide mb-3 text-shadow-subtle"
        >
          {subtext}
        </p>
      )}

      {/* Interactive Circular Play Control */}
      <div className="relative flex flex-col items-center">
        {/* Soft Ambient Illumination Aura when playing */}
        <div
          className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,_rgba(212,108,166,0.25)_0%,_rgba(211,192,224,0.1)_50%,_transparent_75%)] blur-md transition-all duration-700 pointer-events-none"
          style={{
            opacity: isPlaying ? 1 : 0.2,
            transform: `scale(${isPlaying ? 1.25 : 0.95})`,
          }}
        />

        {/* Minimal Circular Button Container */}
        <button
          type="button"
          id="voice-note-play-button"
          onClick={onTogglePlay}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onTogglePlay();
            }
          }}
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
          aria-pressed={isPlaying}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ffafd7] focus-visible:outline-none touch-manipulation"
          style={{
            boxShadow: isPlaying
              ? '0 0 24px 2px rgba(212, 108, 166, 0.35)'
              : '0 0 12px 1px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* SVG Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 60 60"
          >
            {/* Background Ring */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={strokeWidth}
            />
            {/* Active Progress Stroke */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="url(#audioProgressGradient)"
              strokeWidth={strokeWidth + 0.5}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-100 ease-out"
            />
            <defs>
              <linearGradient id="audioProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffafd7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Play/Pause Icon */}
          <div className="relative z-10 text-white group-hover:text-[#ffafd7] transition-all duration-300 flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" strokeWidth={1.75} />
            )}
          </div>
        </button>

        {/* Cinematic Label & Timestamp */}
        <span
          id="voice-note-action-label"
          className="mt-2.5 font-mono-label text-[10px] sm:text-xs tracking-[0.25em] text-[#e2e2e2] group-hover:text-[#ffafd7] transition-colors duration-300"
        >
          {isPlaying ? 'PAUSE' : label}
        </span>

        {duration !== undefined && duration > 0 && (
          <span
            id="voice-note-timestamp"
            className="mt-1 font-mono-label text-[9px] sm:text-[10px] text-[#ffafd7]/80 tracking-wider"
          >
            {Math.floor((currentTime || 0) / 60)}:{Math.floor((currentTime || 0) % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  );
};
