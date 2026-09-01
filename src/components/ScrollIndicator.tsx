import React from 'react';
import { motion } from 'motion/react';
import { ScrollIndicatorProps } from '../types';
import { Z_INDEX_TOKENS, ANIMATION_TOKENS } from '../tokens';

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  visible,
  scrollProgress,
  onClick,
}) => {
  // Fade out as the user scrolls
  const opacity = visible ? Math.max(0, 1 - scrollProgress * 3.5) : 0;

  return (
    <motion.div
      id="scroll-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity, y: 0 }}
      transition={{
        duration: ANIMATION_TOKENS.duration.normal,
        ease: ANIMATION_TOKENS.easing.cinematic,
      }}
      className={`fixed bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none transition-all duration-300 ${
        opacity <= 0.02 ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
      }`}
      style={{ zIndex: Z_INDEX_TOKENS.scrollIndicator }}
      onClick={onClick}
      aria-label="Scroll down to begin experience"
    >
      <span className="font-mono-label text-[11px] sm:text-xs tracking-[0.25em] text-[#e2e2e2] hover:text-[#ffafd7] transition-colors duration-300 font-medium text-shadow-subtle">
        Scroll to begin
      </span>

      {/* Subtle, elegant breathing indicator stem */}
      <div className="relative w-[1px] h-9 bg-gradient-to-b from-[#ffafd7]/40 via-white/20 to-transparent overflow-hidden">
        <motion.div
          animate={{
            y: [-12, 36],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-3 bg-gradient-to-b from-transparent via-[#ffafd7] to-transparent"
        />
      </div>
    </motion.div>
  );
};
