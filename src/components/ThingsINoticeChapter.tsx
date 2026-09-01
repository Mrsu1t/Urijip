import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThingsINoticeChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { Sparkles, Heart, Flame, Smile, Utensils, MessageCircle, ChevronRight, Eye } from 'lucide-react';

export const ThingsINoticeChapter: React.FC<ThingsINoticeChapterProps> = ({
  onProgressChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Micro-interaction state for "REVEAL ANOTHER ONE" (Weirdness observations)
  const [weirdnessIndex, setWeirdnessIndex] = useState(0);
  const [sharpTongueRevealed, setSharpTongueRevealed] = useState(false);

  const weirdnessObservations = [
    'She laughs like consequences don’t exist.',
    'She can switch from serious adult to absolute chaos in under three seconds.',
    'Her drunken sleep state is officially a protected wildlife sanctuary.',
    'Her voice tone shifts three octaves depending on whether she is sleepy, excited, or plotting something.',
    'She becomes 100% goofy the exact second she feels safe.',
  ];

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
   * Helper interpolation math functions for smooth bell-curve and linear ranges
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
  // ATMOSPHERIC PALETTE (Deep Night Sky & Aurora Tint)
  // -------------------------------------------------------------
  const nightSkyAlpha = range(scrollProgress, 0.0, 0.45, 0.45, 0.65);
  const auroraAlpha = range(scrollProgress, 0.15, 0.75, 0.2, 0.45);
  const warmMorningCreamAlpha = range(scrollProgress, 0.35, 0.95, 0.1, 0.3);

  // -------------------------------------------------------------
  // SCROLL PROGRESS INTERPOLATION CHOREOGRAPHY (0.00 to 1.00)
  // -------------------------------------------------------------

  // 0. Chapter Title / Introduction (0.00 -> 0.10)
  const titleOpacity = scrollProgress <= 0.02 ? 1 : bell(scrollProgress, 0.0, 0.04, 0.10);
  const titleY = range(scrollProgress, 0.0, 0.10, 0, -16);

  // 1. Quality 01: YOUR SOFTNESS (0.08 -> 0.24)
  const softnessOpacity = bell(scrollProgress, 0.08, 0.15, 0.24);
  const softnessY = range(scrollProgress, 0.08, 0.24, 18, -12);

  // 2. Quality 02: YOUR WEIRDNESS 😂 (0.22 -> 0.42)
  const weirdnessOpacity = bell(scrollProgress, 0.22, 0.31, 0.42);
  const weirdnessY = range(scrollProgress, 0.22, 0.42, 18, -12);

  // 3. Quality 03: YOUR AMBITION (0.40 -> 0.60)
  const ambitionOpacity = bell(scrollProgress, 0.40, 0.49, 0.60);
  const ambitionY = range(scrollProgress, 0.40, 0.60, 18, -12);

  // 4. Quality 04: YOUR LAUGH (0.58 -> 0.74)
  const laughOpacity = bell(scrollProgress, 0.58, 0.65, 0.74);
  const laughY = range(scrollProgress, 0.58, 0.74, 18, -12);

  // 5. Quality 05: THE WAY YOU LOVE (0.72 -> 0.88)
  const loveOpacity = bell(scrollProgress, 0.72, 0.79, 0.88);
  const loveY = range(scrollProgress, 0.72, 0.88, 18, -12);

  // 6. Culmination & Ending of Phase 7 (0.86 -> 1.00)
  const endingOpacity = range(scrollProgress, 0.86, 0.93, 0, 1);
  const endingY = range(scrollProgress, 0.86, 0.93, 20, 0);

  // Micro-step Timeline dots
  const steps = [
    { label: 'Things I Notice About You', target: 0.04 },
    { label: '01 • Your Softness', target: 0.15 },
    { label: '02 • Your Weirdness', target: 0.31 },
    { label: '03 • Your Ambition', target: 0.49 },
    { label: '04 • Your Laugh', target: 0.65 },
    { label: '05 • The Way You Love', target: 0.79 },
    { label: 'Deeply Seen', target: 0.94 },
  ];

  return (
    <section
      ref={containerRef}
      id="things-i-notice-chapter"
      className={`relative w-full min-h-[850vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter VII: THINGS I NOTICE ABOUT YOU"
    >
      {/* ------------------------------------------------------------- */}
      {/* EXPANSIVE NIGHT SKY & AURORA ATMOSPHERE LAYERS               */}
      {/* ------------------------------------------------------------- */}

      {/* Layer A: Broad Deep Blue Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 110% 95% at 50% 45%, rgba(15, 23, 42, 0.6) 0%, rgba(10, 15, 30, 0.4) 50%, transparent 100%)',
          opacity: nightSkyAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 9,
        }}
      />

      {/* Layer B: Aurora Emerald/Cyan Radiance */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.1) 48%, transparent 100%)',
          opacity: auroraAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 10,
        }}
      />

      {/* Layer C: Warm Morning Cream Light Pool */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(186, 230, 253, 0.05) 40%, transparent 80%)',
          opacity: warmMorningCreamAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 11,
        }}
      />

      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Chapter VII Milestone Marker */}
        <header className="w-full flex flex-col items-center flex-shrink-0 z-30 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] text-slate-300 font-medium">
              Chapter VII • Observational Love
            </span>
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
          </div>
        </header>

        {/* Center Stage: The Five Discoveries */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 0. Chapter Title / Introduction */}
          <div
            id="things-i-notice-title-card"
            className="absolute text-center max-w-3xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              visibility: titleOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-cyan-200" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em] text-slate-300 font-medium">
                The Little Things
              </span>
            </div>
            <h2
              id="things-i-notice-main-title"
              className="font-editorial text-[clamp(2.35rem,7.5vw,5.25rem)] font-bold text-white uppercase tracking-[0.12em] sm:tracking-[0.18em] starlight-heavy-glow leading-none select-none mb-4"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.8), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              THINGS I NOTICE ABOUT YOU
            </h2>
            <p className="font-editorial italic text-[clamp(1.2rem,3vw,1.85rem)] text-slate-200 tracking-wide max-w-md mx-auto">
              Not just the obvious things.
            </p>
          </div>

          {/* 1. CHAPTER 01 — YOUR SOFTNESS */}
          <div
            id="notice-softness-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: softnessOpacity,
              transform: `translateY(${softnessY}px)`,
              visibility: softnessOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                01 • Tenderness
              </span>
            </div>

            <h2
              id="your-softness-title"
              className="font-editorial text-[clamp(2.5rem,7vw,5rem)] font-bold text-white tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              YOUR SOFTNESS
            </h2>

            <div className="space-y-2 text-white/90 max-w-xl">
              <p className="font-editorial text-[clamp(1.35rem,3.4vw,2.15rem)] font-light leading-snug">
                You feel things deeply.
              </p>
              <p className="font-editorial italic text-[clamp(1.4rem,3.6vw,2.35rem)] text-slate-100 leading-snug">
                And somehow, that makes you love deeply too.
              </p>
            </div>

            <div className="pt-2 text-slate-300 font-body text-xs sm:text-sm tracking-wide max-w-md">
              Emotionally present. Incredibly empathetic. Completely unafraid to care.
            </div>
          </div>

          {/* 2. CHAPTER 02 — YOUR WEIRDNESS 😂 */}
          <div
            id="notice-weirdness-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30"
            style={{
              opacity: weirdnessOpacity,
              transform: `translateY(${weirdnessY}px)`,
              visibility: weirdnessOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: weirdnessOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <Smile className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                02 • Unfiltered Chemistry
              </span>
            </div>

            <h2
              id="your-weirdness-title"
              className="font-editorial text-[clamp(2.4rem,6.8vw,4.75rem)] font-bold text-white tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.8), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              YOUR WEIRDNESS <span className="text-cyan-200 inline-block">😂</span>
            </h2>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.15rem,2.8vw,1.75rem)] font-light">
                There is the version of you that is mature, responsible and composed.
              </p>
              <p className="font-editorial italic text-[clamp(1.25rem,3.2vw,1.95rem)] text-cyan-100">
                And then... there is you.
              </p>
            </div>

            {/* Core Humorous Line */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-white/20 bg-white/[0.06] backdrop-blur-md max-w-xl mx-auto">
              <p className="font-editorial italic text-[clamp(1.15rem,2.8vw,1.65rem)] text-white/95 leading-relaxed">
                &ldquo;Your voice has more personalities than I have arguments prepared for.&rdquo;
              </p>
            </div>

            {/* Micro-Interaction: REVEAL ANOTHER ONE */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setWeirdnessIndex((prev) => (prev + 1) % weirdnessObservations.length)}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(255,255,255,0.15)] text-xs sm:text-sm font-body font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>REVEAL ANOTHER ONE</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-200" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={weirdnessIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm font-body text-slate-200 italic max-w-md px-2 min-h-[38px] flex items-center justify-center"
                >
                  &ldquo;{weirdnessObservations[weirdnessIndex]}&rdquo;
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 3. CHAPTER 03 — YOUR AMBITION (Cooking as Craft & Zeal) */}
          <div
            id="notice-ambition-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: ambitionOpacity,
              transform: `translateY(${ambitionY}px)`,
              visibility: ambitionOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <Utensils className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                03 • Passion & Craft
              </span>
            </div>

            <h2
              id="your-ambition-title"
              className="font-editorial text-[clamp(2.4rem,6.8vw,4.85rem)] font-bold text-white tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              YOUR AMBITION
            </h2>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.3rem,3.2vw,2rem)] font-light">
                I don&apos;t just admire your cooking.
              </p>
              <p className="font-editorial italic text-[clamp(1.4rem,3.5vw,2.25rem)] text-slate-100 font-normal">
                I admire the passion behind it.
              </p>
            </div>

            {/* Cooking Exploration Points */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 max-w-xl mx-auto text-white/80 text-xs sm:text-sm font-body">
              <span>The way you experiment.</span>
              <span className="text-cyan-300/40">•</span>
              <span>The way you care about getting it right.</span>
              <span className="text-cyan-300/40">•</span>
              <span>The way you light up when someone enjoys what you made.</span>
            </div>

            <div className="pt-1">
              <p className="font-editorial text-[clamp(1.2rem,2.8vw,1.8rem)] text-white font-medium">
                I want to see how far that passion takes you.
              </p>
              {/* Subtle Wordplay Pun */}
              <p className="font-editorial italic text-xs sm:text-sm text-cyan-200/90 pt-1">
                &ldquo;You have a talent for adding a little more flavor to everything.&rdquo;
              </p>
            </div>
          </div>

          {/* 4. CHAPTER 04 — YOUR LAUGH */}
          <div
            id="notice-laugh-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: laughOpacity,
              transform: `translateY(${laughY}px)`,
              visibility: laughOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <Smile className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                04 • Pure Joy
              </span>
            </div>

            <h2
              id="your-laugh-title"
              className="font-editorial text-[clamp(2.5rem,7.2vw,5.25rem)] font-bold text-white tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              YOUR LAUGH
            </h2>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.4rem,3.5vw,2.25rem)] font-light">
                I love your laugh.
              </p>
              <p className="font-editorial italic text-[clamp(1.5rem,3.8vw,2.45rem)] text-slate-100">
                Especially the one you can&apos;t control.
              </p>
              <p className="font-editorial text-[clamp(1.2rem,2.8vw,1.85rem)] text-white/80 font-light">
                The one that comes out when you&apos;re completely yourself.
              </p>
            </div>

            {/* Playful teasing */}
            <div className="pt-2">
              <p className="font-body text-xs sm:text-sm text-slate-200">
                My jokes are responsible for a completely reasonable percentage of it.
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full border border-white/15 bg-white/[0.04] text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                * This statistic is self-reported
              </span>
            </div>
          </div>

          {/* 5. CHAPTER 05 — THE WAY YOU LOVE */}
          <div
            id="notice-love-card"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: loveOpacity,
              transform: `translateY(${loveY}px)`,
              visibility: loveOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 text-cyan-200 fill-cyan-200/30" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                05 • Intentionality
              </span>
            </div>

            <h2
              id="the-way-you-love-title"
              className="font-editorial text-[clamp(2.4rem,6.8vw,4.85rem)] font-bold text-white tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.35)',
              }}
            >
              THE WAY YOU LOVE
            </h2>

            <div className="space-y-2 text-white/90 max-w-xl">
              <p className="font-editorial text-[clamp(1.25rem,3vw,1.9rem)] font-light leading-snug">
                You don&apos;t just listen to the things that matter to me.
              </p>
              <p className="font-editorial italic text-[clamp(1.4rem,3.6vw,2.35rem)] text-slate-100 font-normal leading-snug">
                You celebrate them with me.
              </p>
            </div>

            {/* Special Memory: New Job */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-white/20 bg-white/[0.06] backdrop-blur-md max-w-xl mx-auto">
              <p className="font-editorial text-[clamp(1.15rem,2.8vw,1.65rem)] text-white/95 leading-relaxed">
                I will never forget how truly happy you were when I got my new job.
              </p>
            </div>

            <p className="font-editorial italic text-[clamp(1.15rem,2.8vw,1.7rem)] text-slate-200 pt-1">
              That&apos;s one of the things I mean when I say I feel seen by you.
            </p>
          </div>

          {/* 6. CULMINATION & ENDING: "These are the things I notice..." */}
          <div
            id="notice-chapter-ending"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-150 ease-out z-30"
            style={{
              opacity: endingOpacity,
              transform: `translateY(${endingY}px)`,
              visibility: endingOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: endingOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em] text-slate-300 font-medium">
                Seen & Treasured
              </span>
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <div className="space-y-1.5 text-white/90">
              <p className="font-editorial text-[clamp(1.35rem,3.2vw,2rem)] font-light">
                These are the things I notice.
              </p>
              <p className="font-editorial italic text-[clamp(1.35rem,3.2vw,2rem)] text-slate-200">
                But somehow...
              </p>
              <p className="font-editorial text-[clamp(1.4rem,3.4vw,2.2rem)] font-medium text-white">
                They are also the things I love.
              </p>
            </div>

            <h2
              id="deeply-seen-title"
              className="font-editorial text-[clamp(2.25rem,6.5vw,4.75rem)] font-bold text-white leading-tight tracking-wide starlight-heavy-glow pt-1"
              style={{
                textShadow: '0 0 45px rgba(255, 255, 255, 0.9), 0 0 80px rgba(56, 189, 248, 0.4)',
              }}
            >
              I hope you know how deeply you are seen.
            </h2>

            {/* Playful Interruption: Sharp Tongue */}
            <div className="pt-3">
              {!sharpTongueRevealed ? (
                <button
                  onClick={() => setSharpTongueRevealed(true)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] sm:text-xs uppercase tracking-widest font-body cursor-pointer transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-cyan-200" />
                  <span>One final observation</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-5 py-2.5 rounded-2xl border border-white/20 bg-white/[0.08] backdrop-blur-sm max-w-md mx-auto"
                >
                  <p className="font-body text-xs sm:text-sm text-slate-200 italic">
                    &ldquo;His tongue is sharp. But apparently... she keeps him anyway.&rdquo;
                  </p>
                </motion.div>
              )}
            </div>

            {/* Ambient luminous glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,_rgba(56,189,248,0.1)_45%,_transparent_75%)] blur-2xl pointer-events-none mt-2"
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
                  key={`notice-step-${idx}`}
                  onClick={() => scrollToStep(step.target)}
                  aria-label={step.label}
                  className={`transition-all duration-300 rounded-full flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.2em]">
            <span>{scrollProgress > 0.9 ? 'Chapter VII Complete' : 'Scroll to explore what I notice about you'}</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
