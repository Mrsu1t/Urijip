import React from 'react';
import { motion } from 'motion/react';
import { AnimatedTextLineProps } from '../types';
import { ANIMATION_TOKENS } from '../tokens';

export const AnimatedTextLine: React.FC<AnimatedTextLineProps> = ({
  children,
  delay = 0,
  isEmphasized = false,
  className = '',
  id,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ANIMATION_TOKENS.duration.slow,
        delay,
        ease: ANIMATION_TOKENS.easing.cinematic,
      }}
      className={`w-full max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 transition-all ${className}`}
    >
      <p
        className={`font-editorial transition-colors duration-700 leading-snug sm:leading-normal break-words text-shadow-subtle ${
          isEmphasized
            ? 'text-[clamp(1.95rem,5.8vw,3.95rem)] font-bold text-white tracking-wide starlight-heavy-glow mt-4 sm:mt-6 md:mt-8'
            : 'text-[clamp(1.3rem,3.4vw,2.35rem)] font-medium text-white tracking-normal'
        }`}
        style={{
          // Ensure zero truncation, guaranteed complete multi-line wrapping and optimal line rhythm
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          hyphens: 'none',
        }}
      >
        {children}
      </p>
    </motion.div>
  );
};
