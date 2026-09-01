import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SafePlaceChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const SafePlaceChapter: React.FC<SafePlaceChapterProps> = ({
  onProgressChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Compute chapter-specific progress smoothly
  useEffect(() => {
    let animationFrameId: number;

    const calculateProgress = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 0) {
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
   * Smooth interpolation helpers
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

  // -------------------------------------------------------------
  // ATMOSPHERIC PALETTE (Warm Cream -> Soft Rose -> Muted Pink -> Soft White)
  // Entering a quiet, warm room of deep safety & stillness
  // -------------------------------------------------------------
  const warmRoomAuraAlpha = range(scrollProgress, 0.0, 0.5, 0.45, 0.7);
  const softRoseGlowAlpha = range(scrollProgress, 0.15, 0.8, 0.35, 0.6);
  const sanctuaryLightAlpha = range(scrollProgress, 0.4, 0.95, 0.25, 0.5);

  // -------------------------------------------------------------
  // SCROLL-LINKED CHOREOGRAPHY
  // -------------------------------------------------------------

  // 0. Chapter Title / Introduction (0.00 -> 0.13)
  const titleOpacity = scrollProgress <= 0.02 ? 1 : bell(scrollProgress, 0.0, 0.05, 0.13);
  const titleY = range(scrollProgress, 0.0, 0.13, 0, -16);

  // 1. What Safety Means (0.11 -> 0.28)
  const meaningOpacity = bell(scrollProgress, 0.11, 0.19, 0.28);
  const meaningY = range(scrollProgress, 0.11, 0.28, 16, -14);

  // 2. What She Does (0.26 -> 0.44)
  const sheDoesOpacity = bell(scrollProgress, 0.26, 0.35, 0.44);
  const sheDoesY = range(scrollProgress, 0.26, 0.44, 16, -14);

  // 3. Being Seen — The New Job Memory (0.42 -> 0.59)
  const beingSeenOpacity = bell(scrollProgress, 0.42, 0.50, 0.59);
  const beingSeenY = range(scrollProgress, 0.42, 0.59, 16, -14);

  // 4. Responsibility & The Sacred Promise (0.57 -> 0.73)
  const promiseOpacity = bell(scrollProgress, 0.57, 0.65, 0.73);
  const promiseY = range(scrollProgress, 0.57, 0.73, 16, -14);

  // 5. Room / Pillow / Superman & Small Playful Release (0.71 -> 0.86)
  const sanctuaryLinesOpacity = bell(scrollProgress, 0.71, 0.78, 0.86);
  const sanctuaryLinesY = range(scrollProgress, 0.71, 0.86, 16, -14);

  // 6. Final Ending: "You are my safe place..." (0.84 -> 1.00)
  const endingOpacity = range(scrollProgress, 0.84, 0.92, 0, 1);
  const endingY = range(scrollProgress, 0.84, 0.92, 20, 0);

  // Micro-step Timeline dots
  const steps = [
    { label: 'The Safe Place', target: 0.05 },
    { label: 'What Safety Means', target: 0.19 },
    { label: 'What You Do', target: 0.35 },
    { label: 'Being Seen', target: 0.50 },
    { label: 'The Promise', target: 0.65 },
    { label: 'Sanctuary', target: 0.78 },
    { label: 'Greatest Gift', target: 0.93 },
  ];

  return (
    <section
      ref={containerRef}
      id="safe-place-chapter"
      className={`relative w-full min-h-[920vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter VIII: THE SAFE PLACE"
    >
      {/* ------------------------------------------------------------- */}
      {/* EXPANSIVE WARM SANCTUARY ATMOSPHERE (Cream & Rose)             */}
      {/* ------------------------------------------------------------- */}

      {/* Layer A: Deep Warm Room Ambient Base */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 110% 95% at 50% 50%, rgba(185, 70, 125, 0.52) 0%, rgba(125, 42, 90, 0.35) 52%, rgba(55, 18, 48, 0.15) 85%, transparent 100%)',
          opacity: warmRoomAuraAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 12,
        }}
      />

      {/* Layer B: Soft Rose & Muted Pink Radiance */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 52%, rgba(244, 143, 177, 0.42) 0%, rgba(219, 39, 119, 0.22) 48%, rgba(157, 23, 77, 0.08) 85%, transparent 100%)',
          opacity: softRoseGlowAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 13,
        }}
      />

      {/* Layer C: Warm Cream Stillness Light Pool */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(255, 248, 240, 0.24) 0%, rgba(254, 215, 226, 0.14) 42%, transparent 80%)',
          opacity: sanctuaryLightAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 14,
        }}
      />

      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">

        {/* Top Header / Chapter VIII Milestone Marker */}
        <header className="w-full flex flex-col items-center flex-shrink-0 z-30 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-200/40" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] text-pink-100/80 font-medium">
              Chapter VIII • Sanctuary & Trust
            </span>
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-200/40" />
          </div>
        </header>

        {/* Center Stage: The Quiet Journey of Emotional Safety */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[390px]">

          {/* 0. Chapter Title / Introduction */}
          <div
            id="safe-place-title-card"
            className="absolute text-center max-w-3xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              visibility: titleOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-pink-200" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em] text-pink-200/80 font-medium">
                Sanctuary
              </span>
            </div>
            <h2
              id="safe-place-main-title"
              className="font-editorial text-[clamp(2.35rem,7.5vw,5.5rem)] font-bold text-white uppercase tracking-[0.14em] sm:tracking-[0.2em] starlight-heavy-glow leading-none select-none mb-4"
              style={{
                textShadow: '0 0 35px rgba(255, 240, 248, 0.85), 0 0 75px rgba(244, 143, 177, 0.45)',
              }}
            >
              THE SAFE PLACE
            </h2>
            <div className="space-y-1 text-pink-100/90 max-w-md mx-auto">
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.9rem)] font-light">
                What you give me is more than love.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.4vw,2.15rem)] text-white font-normal">
                It&apos;s safety.
              </p>
            </div>
          </div>

          {/* 1. What Safety Means */}
          <div
            id="what-safety-means-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: meaningOpacity,
              transform: `translateY(${meaningY}px)`,
              visibility: meaningOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-200/25 bg-pink-300/[0.08] backdrop-blur-sm">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-100 font-semibold">
                Freedom • Honesty
              </span>
            </div>

            <div className="space-y-3 sm:space-y-3.5 text-white/95 max-w-xl mx-auto">
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.85rem)] font-light leading-relaxed">
                I can be vulnerable with you.
              </p>
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.85rem)] font-light leading-relaxed text-pink-100">
                I can have boundaries.
              </p>
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.85rem)] font-light leading-relaxed">
                I can make my own choices.
              </p>
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,1.95rem)] font-light leading-relaxed text-pink-200">
                I can be completely myself.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.5vw,2.2rem)] font-normal leading-relaxed text-white pt-1">
                I don&apos;t have to perform.
              </p>
            </div>
          </div>

          {/* 2. What She Does */}
          <div
            id="what-she-does-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: sheDoesOpacity,
              transform: `translateY(${sheDoesY}px)`,
              visibility: sheDoesOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-200/25 bg-pink-300/[0.08] backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 text-pink-200 fill-pink-200/30" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-100 font-semibold">
                Respect • Space
              </span>
            </div>

            <h3 className="font-editorial text-[clamp(1.5rem,3.8vw,2.4rem)] text-pink-200/90 font-light tracking-wide">
              How You Show Up
            </h3>

            <div className="space-y-2.5 text-white/95 max-w-xl mx-auto">
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,2rem)] font-light leading-snug">
                You respect my boundaries.
              </p>
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,2rem)] font-light leading-snug text-pink-100">
                You respect my choices.
              </p>
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,2rem)] font-light leading-snug">
                You let me be vulnerable around you.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.5vw,2.25rem)] text-white font-normal leading-snug pt-1">
                You make space for me to be myself.
              </p>
            </div>
          </div>

          {/* 3. Being Seen — The New Job Memory */}
          <div
            id="being-seen-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: beingSeenOpacity,
              transform: `translateY(${beingSeenY}px)`,
              visibility: beingSeenOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-200/25 bg-pink-300/[0.08] backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-100 font-semibold">
                Celebrated
              </span>
            </div>

            {/* Special Intimate Memory Box */}
            <div className="p-4 sm:p-5 rounded-2xl border border-pink-200/25 bg-pink-400/[0.09] backdrop-blur-md max-w-xl mx-auto space-y-2">
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.85rem)] text-white/95 leading-relaxed font-light">
                I&apos;ll never forget how genuinely happy you were when I got my new job.
              </p>
            </div>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,2rem)] font-light">
                You didn&apos;t just hear the news.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.5vw,2.25rem)] text-pink-100 font-normal">
                You celebrated it with me.
              </p>
            </div>

            <p className="font-editorial text-[clamp(1.2rem,2.8vw,1.8rem)] text-pink-200/90 pt-1 font-medium">
              That&apos;s what being seen feels like.
            </p>
          </div>

          {/* 4. Responsibility & The Sacred Promise */}
          <div
            id="sacred-promise-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: promiseOpacity,
              transform: `translateY(${promiseY}px)`,
              visibility: promiseOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-200/25 bg-pink-300/[0.08] backdrop-blur-sm">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-100 font-semibold">
                Responsibility & Vow
              </span>
            </div>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.25rem,3.2vw,2rem)] font-light leading-snug">
                Being someone&apos;s safe place is a responsibility.
              </p>
              <p className="font-editorial text-[clamp(1.2rem,3vw,1.85rem)] text-pink-100/90 font-light leading-snug">
                You&apos;ve trusted me with a part of you.
              </p>
              <p className="font-editorial italic text-[clamp(1.25rem,3.2vw,1.95rem)] text-pink-200 font-normal leading-snug">
                I don&apos;t take that lightly.
              </p>
            </div>

            {/* Dedicated Standalone Promise Visual Moment */}
            <div className="pt-3">
              <h2
                id="never-regret-trusting-promise"
                className="font-editorial text-[clamp(1.6rem,4.5vw,3.15rem)] font-normal text-white leading-tight tracking-wide starlight-heavy-glow px-3 py-2 max-w-2xl mx-auto"
                style={{
                  textShadow: '0 0 35px rgba(255, 240, 248, 0.9), 0 0 75px rgba(244, 143, 177, 0.5)',
                }}
              >
                &ldquo;I will do my best to never make you regret trusting me.&rdquo;
              </h2>
            </div>
          </div>

          {/* 5. Room / Pillow / Superman & Small Playful Release */}
          <div
            id="sanctuary-lines-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: sanctuaryLinesOpacity,
              transform: `translateY(${sanctuaryLinesY}px)`,
              visibility: sanctuaryLinesOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-200/25 bg-pink-300/[0.08] backdrop-blur-sm">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-100 font-semibold">
                Sanctuary Lines
              </span>
            </div>

            <div className="space-y-2 text-white/95 max-w-xl mx-auto">
              <p className="font-editorial text-[clamp(1.4rem,3.6vw,2.35rem)] font-light leading-snug">
                I hope I&apos;m always your room.
              </p>
              <p className="font-editorial text-[clamp(1.4rem,3.6vw,2.35rem)] font-light leading-snug text-pink-100">
                Your pillow.
              </p>
              <p className="font-editorial italic text-[clamp(1.5rem,4vw,2.65rem)] font-normal leading-snug text-white pt-1 starlight-heavy-glow">
                Your Superman.
              </p>
            </div>

            {/* Small subtle humorous release */}
            <div className="pt-2 px-4 py-2 rounded-2xl border border-pink-200/15 bg-pink-400/[0.06] backdrop-blur-sm max-w-md mx-auto">
              <p className="font-editorial italic text-xs sm:text-sm text-pink-200/90 leading-relaxed">
                &ldquo;Although... Being Superman probably comes with occasional last-born responsibilities.&rdquo;
              </p>
            </div>
          </div>

          {/* 6. Sacred Ending: "You are my safe place..." */}
          <div
            id="safe-place-ending-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-150 ease-out z-30"
            style={{
              opacity: endingOpacity,
              transform: `translateY(${endingY}px)`,
              visibility: endingOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: endingOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-200/40" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em] text-pink-200 font-medium">
                The Greatest Gift
              </span>
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-200/40" />
            </div>

            <h2
              id="you-are-my-safe-place-title"
              className="font-editorial text-[clamp(2.35rem,6.8vw,5rem)] font-bold text-white leading-tight tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 45px rgba(255, 240, 248, 0.95), 0 0 85px rgba(244, 143, 177, 0.55)',
              }}
            >
              You are my safe place.
            </h2>

            <div className="space-y-2 text-white/95 max-w-lg mx-auto pt-1">
              <p className="font-editorial text-[clamp(1.25rem,3vw,1.9rem)] font-light leading-relaxed text-pink-100">
                And that is one of the greatest gifts you&apos;ve given me.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.4vw,2.2rem)] font-normal leading-relaxed text-white pt-2">
                Thank you for making it safe for me to be me.
              </p>
            </div>

            {/* Ambient luminous still glow */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.4, 0.65, 0.4],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,_rgba(255,245,240,0.22)_0%,_rgba(244,143,177,0.12)_45%,_transparent_75%)] blur-2xl pointer-events-none mt-2"
            />
          </div>

        </div>

        {/* Bottom Narrative Timeline & Scroll Helper */}
        <footer className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-2">
          {/* Interactive Micro-Step Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 max-w-[90vw] overflow-x-auto py-1">
            {steps.map((step, idx) => {
              const isActive = Math.abs(scrollProgress - step.target) < 0.05;
              return (
                <button
                  key={`safe-step-${idx}`}
                  onClick={() => scrollToStep(step.target)}
                  aria-label={step.label}
                  className={`transition-all duration-300 rounded-full flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'w-6 h-1.5 bg-pink-200 shadow-[0_0_8px_rgba(255,220,240,0.9)]'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-pink-200/50'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs text-pink-100/40 uppercase tracking-[0.2em]">
            <span>{scrollProgress > 0.9 ? 'Chapter VIII Complete' : 'Scroll to experience sanctuary'}</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
