import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Z_INDEX_TOKENS } from '../tokens';

interface ChapterTransitionGatewayProps {
  onTransitionProgress?: (progress: number) => void;
  className?: string;
}

export const ChapterTransitionGateway: React.FC<ChapterTransitionGatewayProps> = ({
  onTransitionProgress,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const calculateProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 0) {
        const currentScroll = -rect.top;
        const p = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        setProgress(p);
        onTransitionProgress?.(p);
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onTransitionProgress]);

  // Interpolation helpers
  const range = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    if (val <= inMin) return outMin;
    if (val >= inMax) return outMax;
    return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
  };

  const bell = (val: number, inStart: number, inPeak: number, inEnd: number) => {
    if (val <= inStart || val >= inEnd) return 0;
    if (val < inPeak) return range(val, inStart, inPeak, 0, 1);
    return range(val, inPeak, inEnd, 1, 0);
  };

  // 1. Stage 1: Voice echoes fade, screen plunges into complete darkness (0.00 -> 0.35)
  const darknessAlpha = range(progress, 0.0, 0.35, 0.2, 0.95);
  
  // 2. Stage 2: "Night deepens..." (0.25 -> 0.65)
  const line1Opacity = bell(progress, 0.25, 0.45, 0.65);
  const line1Y = range(progress, 0.25, 0.65, 14, -10);

  // 3. Stage 3: Deep navy horizon aura emerges (0.50 -> 1.0)
  const navyAuraOpacity = range(progress, 0.5, 0.9, 0, 0.85);

  // 4. Stage 4: "A new memory begins." (0.60 -> 0.95)
  const line2Opacity = range(progress, 0.62, 0.82, 0, 1) * (progress > 0.92 ? range(progress, 0.92, 1.0, 1, 0) : 1);
  const line2Y = range(progress, 0.62, 0.82, 16, 0);

  return (
    <section
      ref={containerRef}
      id="chapter-transition-gateway"
      className={`relative w-full min-h-[160vh] bg-transparent select-none ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Transition into Phase 4: The Deep Night"
    >
      {/* Sticky Stage Viewport */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden">
        
        {/* Dynamic Blackout & Deepening Navy Atmosphere Veil */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            backgroundColor: `rgba(4, 6, 10, ${darknessAlpha})`,
          }}
        />

        {/* Deep Navy Midnight Horizon Aura */}
        <div
          className="absolute w-[85vw] max-w-[900px] h-[50vh] max-h-[500px] rounded-full blur-[100px] pointer-events-none transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(14, 30, 60, 0.6) 0%, rgba(8, 16, 32, 0.25) 50%, transparent 75%)',
            opacity: navyAuraOpacity,
            transform: `scale(${0.8 + navyAuraOpacity * 0.4})`,
          }}
        />

        {/* Horizon Divider Line that expands as memory crosses */}
        <div
          className="absolute w-full flex items-center justify-center pointer-events-none"
          style={{ opacity: navyAuraOpacity }}
        >
          <div className="w-[1px] h-16 sm:h-24 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        </div>

        {/* Center Atmospheric Reveal Text */}
        <div className="relative z-20 text-center max-w-xl px-4 flex flex-col items-center justify-center min-h-[200px]">
          
          {/* Fragment 1: The silence / Night deepens */}
          <div
            className="absolute transition-all duration-150 ease-out pointer-events-none"
            style={{
              opacity: line1Opacity,
              transform: `translateY(${line1Y}px)`,
              visibility: line1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.3em] text-white/45 block mb-2">
              Crossing into memory
            </span>
            <p className="font-editorial text-[clamp(1.5rem,4vw,2.5rem)] font-light text-white/80 leading-snug tracking-wide">
              The night deepens...
            </p>
          </div>

          {/* Fragment 2: A new memory begins */}
          <div
            className="absolute transition-all duration-150 ease-out pointer-events-none"
            style={{
              opacity: line2Opacity,
              transform: `translateY(${line2Y}px)`,
              visibility: line2Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/55 font-medium">
                Chapter IV
              </span>
              <div className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
            </div>

            <p className="font-editorial text-[clamp(1.75rem,4.5vw,3rem)] font-medium text-white leading-snug tracking-wide starlight-heavy-glow">
              A new memory begins.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
