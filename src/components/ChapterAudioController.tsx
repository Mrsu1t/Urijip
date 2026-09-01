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
          className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,_rgba(190,225,255,0.25)_0%,_rgba(130,180,245,0.08)_50%,_transparent_75%)] blur-md transition-all duration-700 pointer-events-none"
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
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none touch-manipulation"
          style={{
            boxShadow: isPlaying
              ? '0 0 24px 2px rgba(180, 220, 255, 0.25)'
              : '0 0 12px 1px rgba(0, 0, 0, 0.5)',
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
                <stop offset="100%" stopColor="#b4d7ff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Play/Pause Icon */}
          <div className="relative z-10 text-white/80 group-hover:text-white transition-all duration-300 flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" strokeWidth={1.75} />
            )}
          </div>
        </button>

        {/* Cinematic Label */}
        <span
          id="voice-note-action-label"
          className="mt-2.5 font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 group-hover:text-white/90 transition-colors duration-300"
        >
          {isPlaying ? 'PAUSE' : label}
        </span>
      </div>
    </div>
  );
};
