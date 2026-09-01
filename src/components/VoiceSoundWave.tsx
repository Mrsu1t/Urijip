import React from 'react';
import { motion } from 'motion/react';

interface VoiceSoundWaveProps {
  intensity?: number; // 0 to 1
  className?: string;
  isFocused?: boolean;
  isPlaying?: boolean;
}

export const VoiceSoundWave: React.FC<VoiceSoundWaveProps> = ({
  intensity = 0.5,
  className = '',
  isFocused = false,
  isPlaying = false,
}) => {
  const effectiveIntensity = isPlaying ? Math.max(0.75, intensity) : intensity;
  const baseOpacity = Math.max(0, Math.min(1, effectiveIntensity));

  return (
    <div
      id="voice-sound-wave-container"
      className={`relative w-full max-w-[540px] h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Central Voice Origin Aura */}
      <div
        className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[radial-gradient(circle,_rgba(210,230,255,0.18)_0%,_rgba(140,185,240,0.06)_45%,_transparent_75%)] blur-lg transition-all duration-700"
        style={{
          opacity: baseOpacity * (isPlaying ? 1.4 : isFocused ? 1.2 : 0.8),
          transform: `scale(${0.9 + baseOpacity * (isPlaying ? 0.4 : 0.25)})`,
        }}
      />

      {/* Origin Star / Sound Point */}
      <div
        className="absolute w-2 h-2 rounded-full bg-white transition-all duration-500 shadow-[0_0_12px_2px_rgba(255,255,255,0.9)]"
        style={{
          opacity: Math.min(1, baseOpacity * 1.3),
          transform: `scale(${0.8 + baseOpacity * (isPlaying ? 0.6 : 0.4)})`,
        }}
      />

      {/* Concentric Ethereal Sound Ripples (Expanding outward) */}
      {[0, 1, 2, 3].map((ringIdx) => {
        const delay = ringIdx * (isPlaying ? 0.9 : 1.4);
        return (
          <motion.div
            key={`sound-ring-${ringIdx}`}
            className="absolute rounded-full border border-white/20"
            initial={{ width: 24, height: 24, opacity: 0 }}
            animate={{
              width: [24, 180 + ringIdx * 80, 320 + ringIdx * 90],
              height: [24, 100 + ringIdx * 45, 170 + ringIdx * 50],
              opacity: [0, (isPlaying ? 0.6 : 0.45) * baseOpacity, 0],
              borderColor: [
                'rgba(255, 255, 255, 0.6)',
                'rgba(180, 215, 255, 0.3)',
                'rgba(140, 180, 240, 0)',
              ],
            }}
            transition={{
              duration: isPlaying ? 3.8 : 5.5,
              repeat: Infinity,
              delay,
              ease: 'easeOut',
            }}
            style={{
              boxShadow: '0 0 15px 0px rgba(180, 220, 255, 0.08)',
            }}
          />
        );
      })}

      {/* Gentle Harmonic Wave Curves */}
      <svg
        viewBox="0 0 600 120"
        className="w-full h-full absolute inset-0 overflow-visible opacity-75"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#d0e2ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#d0e2ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGradientSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#8cb9f0" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#c5dcff" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#8cb9f0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Primary Ethereal Harmonic Line */}
        <motion.path
          d="M 20,60 Q 150,30 300,60 T 580,60"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1.25"
          strokeLinecap="round"
          animate={{
            d: isPlaying
              ? [
                  'M 20,60 Q 150,22 300,60 T 580,60',
                  'M 20,60 Q 150,98 300,60 T 580,60',
                  'M 20,60 Q 150,22 300,60 T 580,60',
                ]
              : [
                  'M 20,60 Q 150,32 300,60 T 580,60',
                  'M 20,60 Q 150,88 300,60 T 580,60',
                  'M 20,60 Q 150,32 300,60 T 580,60',
                ],
          }}
          transition={{
            duration: isPlaying ? 3.8 : 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ opacity: baseOpacity * 0.9 }}
        />

        {/* Secondary Harmonic Line (Opposing Phase) */}
        <motion.path
          d="M 40,60 Q 160,85 300,60 T 560,60"
          fill="none"
          stroke="url(#waveGradientSecondary)"
          strokeWidth="0.85"
          strokeLinecap="round"
          animate={{
            d: isPlaying
              ? [
                  'M 40,60 Q 160,98 300,60 T 560,60',
                  'M 40,60 Q 160,22 300,60 T 560,60',
                  'M 40,60 Q 160,98 300,60 T 560,60',
                ]
              : [
                  'M 40,60 Q 160,85 300,60 T 560,60',
                  'M 40,60 Q 160,35 300,60 T 560,60',
                  'M 40,60 Q 160,85 300,60 T 560,60',
                ],
          }}
          transition={{
            duration: isPlaying ? 4.5 : 7.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ opacity: baseOpacity * 0.7 }}
        />
      </svg>

      {/* Floating Stardust Audio Particles */}
      {[
        { x: -90, y: -25, delay: 0 },
        { x: 80, y: -30, delay: 1.2 },
        { x: -140, y: 20, delay: 2.1 },
        { x: 130, y: 28, delay: 0.7 },
        { x: 0, y: -45, delay: 1.8 },
      ].map((pt, idx) => (
        <motion.div
          key={`audio-pt-${idx}`}
          className="absolute w-1 h-1 rounded-full bg-white/70"
          animate={{
            y: [pt.y, pt.y - (isPlaying ? 20 : 12), pt.y],
            opacity: [0.2 * baseOpacity, (isPlaying ? 0.95 : 0.75) * baseOpacity, 0.2 * baseOpacity],
            scale: [0.8, isPlaying ? 1.6 : 1.3, 0.8],
          }}
          transition={{
            duration: isPlaying ? 2.4 : 3.5,
            repeat: Infinity,
            delay: pt.delay,
            ease: 'easeInOut',
          }}
          style={{
            transform: `translate(${pt.x}px, ${pt.y}px)`,
          }}
        />
      ))}
    </div>
  );
};
