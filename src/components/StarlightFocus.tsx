import React from 'react';
import { motion } from 'motion/react';
import { StarlightFocusProps } from '../types';
import { Z_INDEX_TOKENS, ANIMATION_TOKENS } from '../tokens';

export const StarlightFocus: React.FC<StarlightFocusProps> = ({
  visible,
  scrollProgress = 0,
  className = '',
}) => {
  return (
    <motion.div
      id="starlight-focus-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
      }}
      transition={{
        duration: ANIMATION_TOKENS.duration.slow,
        ease: ANIMATION_TOKENS.easing.cinematic,
      }}
      className={`flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        zIndex: Z_INDEX_TOKENS.starlightFocalLayer,
        transform: `translateY(${-scrollProgress * 80}px) scale(${1 - scrollProgress * 0.12})`,
      }}
    >
      {/* Visual Focal Point: The Bright Star & Celestial Halo */}
      <div className="relative flex items-center justify-center">
        {/* Ambient atmospheric starlight radial bloom */}
        <motion.div
          animate={{
            scale: [1, 1.14, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,_rgba(225,240,255,0.22)_0%,_rgba(180,215,255,0.06)_45%,_transparent_75%)] blur-md pointer-events-none"
        />

        {/* 4-Point Subtle Diffraction Spikes */}
        <div className="absolute w-28 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
        <div className="absolute h-28 w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent pointer-events-none" />

        {/* Diagonal micro diffraction rays */}
        <div className="absolute w-16 h-[1px] rotate-45 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        <div className="absolute h-16 w-[1px] rotate-45 bg-gradient-to-b from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* The Bright Star Core */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.9),0_0_30px_8px_rgba(200,230,255,0.5)]"
        />
      </div>

      {/* 
        ================================================================
        STARLIGHT_IMAGE_PLACEHOLDER
        Reserved placeholder foundation for the future photograph of his eyes.
        Stylized as an ethereal celestial aperture with delicate borders.
        ================================================================
      */}
      <div
        id="STARLIGHT_IMAGE_PLACEHOLDER"
        data-placeholder-id="STARLIGHT_IMAGE_PLACEHOLDER"
        className="mt-6 flex flex-col items-center opacity-0 pointer-events-none transition-opacity duration-700"
        aria-hidden="true"
      >
        {/* Placeholder frame structure ready for Phase 2 image insertion */}
        <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
          <span className="text-[10px] tracking-widest text-white/30 font-sans uppercase">
            STARLIGHT
          </span>
        </div>
      </div>
    </motion.div>
  );
};
