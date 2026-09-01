import React from 'react';
import { motion } from 'motion/react';
import { Z_INDEX_TOKENS } from '../tokens';

interface TransitionInfrastructureProps {
  scrollProgress: number;
}

export const TransitionInfrastructure: React.FC<TransitionInfrastructureProps> = ({
  scrollProgress,
}) => {
  // Fade in at the very end of the scroll journey (scrollProgress > 0.85)
  const opacity = Math.min(1, Math.max(0, (scrollProgress - 0.85) * 6.5));
  const translateY = Math.max(0, (1 - scrollProgress) * 40);

  return (
    <section
      id="chapter-transition-infrastructure"
      className="relative min-h-[70svh] w-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-16 sm:py-24 select-none"
      style={{
        zIndex: Z_INDEX_TOKENS.contentLayer,
      }}
      aria-label="Transition Gateway to Next Chapter"
    >
      <div
        className="w-full max-w-3xl mx-auto flex flex-col items-center text-center transition-all duration-300"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* Constellation Bridge Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
          <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 font-medium">
            Next Chapter • The Story Continues
          </span>
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
        </div>

        {/* Transition Horizon Title */}
        <h2 className="font-editorial text-[clamp(1.75rem,4.5vw,3rem)] font-light text-slate-100 leading-snug tracking-wide max-w-xl break-words px-4 starlight-heavy-glow">
          Thank you for making it safe for me to be me.
        </h2>

        {/* Ambient Chapter Gateway Aura */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.15)_0%,_transparent_70%)] blur-2xl mt-4 pointer-events-none"
        />

        {/* Story Continues Note */}
        <div className="mt-8 px-6 py-2.5 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-sm">
          <p className="font-body text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase">
            Chapter VIII Complete • The Safe Place
          </p>
        </div>
      </div>
    </section>
  );
};
