import React from 'react';
import { motion } from 'motion/react';
import { ANIMATION_TOKENS } from '../tokens';

export interface PageTransitionProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isActive = true,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: ANIMATION_TOKENS.duration.slow,
        ease: ANIMATION_TOKENS.easing.cinematic,
      }}
      className={`w-full transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};
