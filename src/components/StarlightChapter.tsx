import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarlightEyesPhoto } from './StarlightEyesPhoto';
import { Z_INDEX_TOKENS } from '../tokens';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StarlightChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export const StarlightChapter: React.FC<StarlightChapterProps> = ({
  onProgressChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Compute scroll progress strictly within this chapter's track
  useEffect(() => {
    let animationFrameId: number;

    const calculateProgress = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 0) {
        // When top of container is at or above viewport top:
        const currentScroll = -rect.top;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        setScrollProgress(progress);
        onProgressChange?.(progress);
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
  }, [onProgressChange]);

  const scrollToStep = (targetProgress: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset;
    const containerTop = currentScrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  /**
   * INTENDED PROGRESSION STEPS:
   *
   * Phase 1 ends in darkness with STARLIGHT.
   * User scrolls:
   * ↓
   * 1. "You once told me..."                                 (0.00 -> 0.18)
   * ↓
   * 2. "I light up your world."                               (0.18 -> 0.36)
   * ↓
   * 3. "Maybe you were right."                                (0.36 -> 0.52)
   * ↓
   * 4. "Because you called me..."                             (0.52 -> 0.66)
   * ↓
   * 5. The darkness begins revealing the photograph of eyes   (0.66 -> 0.78)
   * ↓
   * 6. The photograph becomes fully visible                   (0.78)
   * ↓
   * 7. STARLIGHT title illuminates                            (0.78 -> 0.88)
   * ↓
   * 8. "You called me Starlight because I light up your world." (0.84 -> 1.00)
   * ↓
   * 9. "And I think you were the first person who made me believe it." (0.89 -> 1.00)
   */

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

  // 1. "You once told me..." (Active from start 0.00 up to 0.18)
  const line1Opacity = scrollProgress <= 0.04 
    ? 1 
    : bell(scrollProgress, 0.0, 0.08, 0.18);
  const line1Y = range(scrollProgress, 0.0, 0.18, 0, -18);
  const line1Scale = range(scrollProgress, 0.0, 0.08, 1.0, 1.02);

  // 2. "I light up your world." (0.16 -> 0.36)
  const line2Opacity = bell(scrollProgress, 0.16, 0.25, 0.36);
  const line2Y = range(scrollProgress, 0.16, 0.36, 20, -14);
  const line2Scale = range(scrollProgress, 0.16, 0.25, 0.96, 1.02);

  // 3. "Maybe you were right." (0.34 -> 0.52)
  const line3Opacity = bell(scrollProgress, 0.34, 0.43, 0.52);
  const line3Y = range(scrollProgress, 0.34, 0.52, 20, -14);
  const line3Scale = range(scrollProgress, 0.34, 0.43, 0.96, 1.01);

  // 4. "Because you called me..." (0.50 -> 0.66)
  const line4Opacity = bell(scrollProgress, 0.50, 0.58, 0.66);
  const line4Y = range(scrollProgress, 0.50, 0.66, 18, -10);
  const line4Scale = range(scrollProgress, 0.50, 0.58, 0.97, 1.0);

  // 5 & 6. Darkness reveals the photograph of eyes (0.64 -> 0.78) and gradually recedes as user travels back into memory (0.95 -> 1.00)
  const exitFactor = scrollProgress > 0.94 ? range(scrollProgress, 0.94, 0.99, 1, 0.05) : 1;
  const photoRevealProgress = range(scrollProgress, 0.64, 0.78, 0, 1) * exitFactor;
  const photoContainerOpacity = range(scrollProgress, 0.63, 0.70, 0, 1) * exitFactor;

  // 7. STARLIGHT Title (0.76 -> 1.00)
  const starlightTitleOpacity = range(scrollProgress, 0.76, 0.83, 0, 1) * exitFactor;
  const starlightTitleY = range(scrollProgress, 0.76, 0.83, 24, 0);

  // 8. Key Line 1: "You called me Starlight because I light up your world." (0.83 -> 1.00)
  const keyLine1Opacity = range(scrollProgress, 0.83, 0.90, 0, 1) * exitFactor;
  const keyLine1Y = range(scrollProgress, 0.83, 0.90, 16, 0);

  // 9. Key Line 2: "And I think you were the first person who made me believe it." (0.89 -> 1.00)
  const keyLine2Opacity = range(scrollProgress, 0.89, 0.96, 0, 1) * exitFactor;
  const keyLine2Y = range(scrollProgress, 0.89, 0.96, 16, 0);

  // Step Indicators for easy jumping
  const steps = [
    { label: '"You once told me..."', target: 0.08 },
    { label: '"I light up your world."', target: 0.25 },
    { label: '"Maybe you were right."', target: 0.43 },
    { label: '"Because you called me..."', target: 0.58 },
    { label: 'Reveal Photograph', target: 0.72 },
    { label: 'STARLIGHT & Culmination', target: 0.94 },
  ];

  return (
    <section
      ref={containerRef}
      id="starlight-chapter"
      className={`relative w-full min-h-[500vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter II: STARLIGHT Narrative"
    >
      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Constellation Chapter Marker */}
        <header className="w-full flex flex-col items-center flex-shrink-0 z-30 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/60 font-medium">
              Chapter II • Starlight
            </span>
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
          </div>
        </header>

        {/* Center Stage: Sequential Narrative Lines & Photograph Centerpiece */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 1. "You once told me..." */}
          <div
            id="chapter-line-1"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: line1Opacity,
              transform: `translateY(${line1Y}px) scale(${line1Scale})`,
              visibility: line1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.75rem,4.5vw,3rem)] text-white/95 leading-snug tracking-wide text-shadow-subtle">
              You once told me...
            </p>
          </div>

          {/* 2. "I light up your world." */}
          <div
            id="chapter-line-2"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: line2Opacity,
              transform: `translateY(${line2Y}px) scale(${line2Scale})`,
              visibility: line2Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.65rem)] text-white font-medium leading-tight tracking-wide starlight-heavy-glow">
              I light up your world.
            </p>
          </div>

          {/* 3. "Maybe you were right." */}
          <div
            id="chapter-line-3"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: line3Opacity,
              transform: `translateY(${line3Y}px) scale(${line3Scale})`,
              visibility: line3Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.75rem,4.5vw,3rem)] text-white/90 leading-snug text-shadow-subtle">
              Maybe you were right.
            </p>
          </div>

          {/* 4. "Because you called me..." */}
          <div
            id="chapter-line-4"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: line4Opacity,
              transform: `translateY(${line4Y}px) scale(${line4Scale})`,
              visibility: line4Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.4rem,3.4vw,2.25rem)] text-white/75 tracking-wider">
              Because you called me...
            </p>
          </div>

          {/* 5, 6, 7, 8, 9: Photograph Reveal, STARLIGHT Title & Culminating Lines */}
          <div
            id="chapter-photo-section"
            className="w-full flex flex-col items-center justify-center transition-all duration-150"
            style={{
              opacity: photoContainerOpacity,
              visibility: photoContainerOpacity > 0.01 ? 'visible' : 'hidden',
              pointerEvents: photoContainerOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            {/* 7. STARLIGHT Title (Reveals above photo) */}
            <div
              className="w-full text-center px-4 mb-2 sm:mb-4 transition-all duration-100 ease-out"
              style={{
                opacity: starlightTitleOpacity,
                transform: `translateY(${starlightTitleY}px)`,
                visibility: starlightTitleOpacity > 0.01 ? 'visible' : 'hidden',
              }}
            >
              <h2
                id="starlight-chapter-title"
                className="font-editorial text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-white uppercase tracking-[0.18em] sm:tracking-[0.24em] starlight-heavy-glow leading-none select-none"
              >
                STARLIGHT
              </h2>
            </div>

            {/* 5 & 6. Eyes Photograph Component */}
            <div className="w-full flex justify-center items-center">
              <StarlightEyesPhoto
                revealProgress={photoRevealProgress}
                isLuminous={scrollProgress > 0.78}
                className="w-full"
              />
            </div>

            {/* 8 & 9. Culminating Narrative Lines */}
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 mt-4 sm:mt-6 min-h-[90px] justify-center">
              {/* 8. "You called me Starlight because I light up your world." */}
              <div
                className="transition-all duration-100 ease-out"
                style={{
                  opacity: keyLine1Opacity,
                  transform: `translateY(${keyLine1Y}px)`,
                  visibility: keyLine1Opacity > 0.01 ? 'visible' : 'hidden',
                }}
              >
                <p className="font-editorial italic text-[clamp(1.2rem,3vw,2rem)] text-white/95 leading-snug">
                  "You called me Starlight because I light up your world."
                </p>
              </div>

              {/* 9. "And I think you were the first person who made me believe it." */}
              <div
                className="mt-2 sm:mt-3 transition-all duration-100 ease-out"
                style={{
                  opacity: keyLine2Opacity,
                  transform: `translateY(${keyLine2Y}px)`,
                  visibility: keyLine2Opacity > 0.01 ? 'visible' : 'hidden',
                }}
              >
                <p className="font-body font-light text-[clamp(0.95rem,2.2vw,1.3rem)] text-white/80 tracking-wide">
                  And I think you were the first person who made me believe it.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Narrative Timeline & Scroll Helper */}
        <footer className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-2">
          {/* Interactive Micro-Step Dots */}
          <div className="flex items-center gap-2 mb-2">
            {steps.map((step, idx) => {
              const isActive = Math.abs(scrollProgress - step.target) < 0.1;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToStep(step.target)}
                  aria-label={step.label}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.2em]">
            <span>Scroll gently to progress</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
