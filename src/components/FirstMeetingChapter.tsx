import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FirstMeetingChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { Sparkles, Heart, Flame } from 'lucide-react';

export const FirstMeetingChapter: React.FC<FirstMeetingChapterProps> = ({
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
  // COLOR EVOLUTION ATMOSPHERE (Deep Night -> Indigo -> Cyan / Teal -> Starlight)
  // -------------------------------------------------------------
  // Indigo / Night sky aura (0.05 -> 0.40)
  const indigoAlpha = range(scrollProgress, 0.05, 0.35, 0, 0.45);
  // Aurora Cyan aura (0.30 -> 0.70)
  const auroraCyanAlpha = range(scrollProgress, 0.30, 0.65, 0, 0.4);
  // Starlight warm home glow (0.60 -> 1.00)
  const starlightAlpha = range(scrollProgress, 0.60, 0.95, 0, 0.35);

  // -------------------------------------------------------------
  // SCROLL PROGRESS INTERPOLATION CHOREOGRAPHY (0.00 to 1.00)
  // -------------------------------------------------------------

  // 1. Chapter Opening: 18 FEBRUARY 2026 & THE DAY WE FINALLY MET (0.00 -> 0.10)
  const titleOpacity = scrollProgress <= 0.02 ? 1 : bell(scrollProgress, 0.0, 0.04, 0.10);
  const titleY = range(scrollProgress, 0.0, 0.10, 0, -16);

  // 2. The First Moment - Part 1: "The day we finally met." / "And somehow... It didn't feel like a first meeting. It felt familiar." (0.08 -> 0.18)
  const familiarOpacity = bell(scrollProgress, 0.08, 0.13, 0.18);
  const familiarY = range(scrollProgress, 0.08, 0.18, 18, -12);

  // 3. The First Moment - Part 2: "No pretending. No trying to impress each other. No holding back. Just us." (0.16 -> 0.27)
  const justUsOpacity = bell(scrollProgress, 0.16, 0.215, 0.27);
  const justUsY = range(scrollProgress, 0.16, 0.27, 18, -12);

  // 4. The Day Itself (Beats of the memory): "You cooked. We stayed in. We watched shows. We played. We laughed. We were completely ourselves." (0.25 -> 0.37)
  const dayBeatsOpacity = bell(scrollProgress, 0.25, 0.31, 0.37);
  const dayBeatsY = range(scrollProgress, 0.25, 0.37, 18, -12);

  // 5. The Cooking Memory: "She cooked." / "You were already making home look suspiciously natural." (0.35 -> 0.46)
  const cookingOpacity = bell(scrollProgress, 0.35, 0.405, 0.46);
  const cookingY = range(scrollProgress, 0.35, 0.46, 18, -12);

  // 6. CORE EMOTIONAL REVEAL (Most important statement): "We felt like a couple that had already been together for five years." (0.44 -> 0.58)
  const fiveYearsOpacity = bell(scrollProgress, 0.44, 0.51, 0.58);
  const fiveYearsY = range(scrollProgress, 0.44, 0.58, 20, -10);

  // 7. Playful Interruption: "Apparently... we skipped the awkward first-date stage entirely. Very efficient of us." (0.56 -> 0.67)
  const playfulOpacity = bell(scrollProgress, 0.56, 0.615, 0.67);
  const playfulY = range(scrollProgress, 0.56, 0.67, 18, -10);

  // 8. The Question: "And then I asked you something... Will you be my girlfriend?" (0.65 -> 0.77)
  const questionOpacity = bell(scrollProgress, 0.65, 0.71, 0.77);
  const questionY = range(scrollProgress, 0.65, 0.77, 18, -12);

  // 9. The Response: "And just like that... we became us." & "18.02.2026" (0.75 -> 0.86)
  const responseOpacity = bell(scrollProgress, 0.75, 0.805, 0.86);
  const responseY = range(scrollProgress, 0.75, 0.86, 18, -12);

  // 10. Emotional Callback: "Looking back, I think this was the first time I understood why I would eventually call you Urijip." (0.84 -> 0.93)
  const callbackOpacity = bell(scrollProgress, 0.84, 0.885, 0.93);
  const callbackY = range(scrollProgress, 0.84, 0.93, 18, -10);

  // 11. Ending of Phase 5: "18 February 2026. The day we met. The day I asked you to be mine. The day I realized... I'd found somewhere I could call home." (0.91 -> 1.00)
  const endingOpacity = range(scrollProgress, 0.91, 0.96, 0, 1);
  const endingY = range(scrollProgress, 0.91, 0.96, 20, 0);

  // Micro-step Timeline dots
  const steps = [
    { label: '18 Feb • The Day We Met', target: 0.04 },
    { label: '"It felt familiar"', target: 0.13 },
    { label: '"Just us"', target: 0.21 },
    { label: 'The Day Itself', target: 0.31 },
    { label: 'Cooking & Home', target: 0.40 },
    { label: '"Together for 5 years"', target: 0.51 },
    { label: 'Skipped the awkward stage', target: 0.61 },
    { label: '"Will you be my girlfriend?"', target: 0.71 },
    { label: '"We became us"', target: 0.80 },
    { label: 'Found My Home', target: 0.95 },
  ];

  return (
    <section
      ref={containerRef}
      id="first-meeting-chapter"
      className={`relative w-full min-h-[720vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter V: 18 FEBRUARY 2026 — THE DAY WE FINALLY MET"
    >
      {/* ------------------------------------------------------------- */}
      {/* ATMOSPHERIC COLOR TRANSFORMATION LAYERS                       */}
      {/* Deep Night -> Indigo -> Cyan / Aurora -> Starlight Warm Home  */}
      {/* ------------------------------------------------------------- */}

      {/* Layer A: Deep Indigo / Night Sky Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(15, 23, 42, 0.65) 0%, rgba(10, 15, 30, 0.35) 60%, transparent 85%)',
          opacity: indigoAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 2,
        }}
      />

      {/* Layer B: Aurora Cyan Intimacy Aura */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(16, 185, 129, 0.08) 55%, transparent 80%)',
          opacity: auroraCyanAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 3,
        }}
      />

      {/* Layer C: Starlight Warm "Home" Glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, rgba(255, 255, 255, 0.1) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 85%)',
          opacity: starlightAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 4,
        }}
      />

      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Chapter V Milestone Marker */}
        <header className="w-full flex flex-col items-center flex-shrink-0 z-30 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
            <span className="font-body text-[11px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold text-shadow-subtle">
              Chapter V • The First Meeting
            </span>
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
          </div>
        </header>

        {/* Center Stage: Sequential Memory Fragments */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 1. Chapter Opening: 18 FEBRUARY 2026 & THE DAY WE FINALLY MET */}
          <div
            id="first-meeting-title-card"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              visibility: titleOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20">
                18 FEBRUARY 2026
              </span>
            </div>
            <h2
              id="the-day-we-finally-met-title"
              className="font-editorial text-[clamp(2.45rem,7.8vw,5.5rem)] font-bold text-white uppercase tracking-[0.14em] sm:tracking-[0.2em] starlight-heavy-glow leading-none select-none mb-4"
            >
              THE DAY WE FINALLY MET
            </h2>
            <p className="font-editorial italic text-[clamp(1.2rem,3vw,1.85rem)] text-[#e2e2e2] font-medium tracking-wide max-w-md mx-auto text-shadow-subtle">
              When the voices across the screen stepped into reality.
            </p>
          </div>

          {/* 2. The First Moment - Part 1: "The day we finally met... And somehow... It didn't feel like a first meeting. It felt familiar." */}
          <div
            id="first-meeting-familiar-fragment"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: familiarOpacity,
              transform: `translateY(${familiarY}px)`,
              visibility: familiarOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              The First Second
            </span>
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.5rem)] text-white font-semibold leading-snug tracking-wide text-shadow-subtle">
              The day we finally met.
            </p>
            <p className="font-editorial italic text-[clamp(1.4rem,3.4vw,2.25rem)] text-slate-100 font-medium text-shadow-subtle">
              And somehow...
            </p>
            <div className="w-10 h-[1px] bg-white/40 mx-auto" />
            <p className="font-editorial text-[clamp(1.9rem,4.8vw,3.15rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              It didn&apos;t feel like a first meeting.
            </p>
            <p className="font-editorial italic text-[clamp(1.5rem,3.8vw,2.4rem)] text-cyan-200 font-semibold text-shadow-subtle">
              It felt familiar.
            </p>
          </div>

          {/* 3. The First Moment - Part 2: "No pretending. No trying to impress each other. No holding back. Just us." */}
          <div
            id="first-meeting-just-us-fragment"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-3.5 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: justUsOpacity,
              transform: `translateY(${justUsY}px)`,
              visibility: justUsOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial text-[clamp(1.45rem,3.8vw,2.3rem)] text-slate-100 leading-relaxed font-medium text-shadow-subtle">
              No pretending.
            </p>
            <p className="font-editorial text-[clamp(1.45rem,3.8vw,2.3rem)] text-slate-100 leading-relaxed font-medium text-shadow-subtle">
              No trying to impress each other.
            </p>
            <p className="font-editorial text-[clamp(1.45rem,3.8vw,2.3rem)] text-slate-100 leading-relaxed font-medium text-shadow-subtle">
              No holding back.
            </p>
            <div className="w-12 h-[1px] bg-white/40 my-2 mx-auto" />
            <p className="font-editorial text-[clamp(2.4rem,6.5vw,4.5rem)] text-white font-bold tracking-wider starlight-heavy-glow">
              Just us.
            </p>
          </div>

          {/* 4. The Day Itself: "You cooked. We stayed in. We watched shows. We played. We laughed. We were completely ourselves." */}
          <div
            id="first-meeting-day-itself"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-3 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: dayBeatsOpacity,
              transform: `translateY(${dayBeatsY}px)`,
              visibility: dayBeatsOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-slate-200 font-semibold mb-1 text-shadow-subtle">
              Unfiltered Rhythm
            </span>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-xl mx-auto text-white font-medium text-shadow-subtle">
              <span className="font-editorial italic text-[clamp(1.35rem,3.2vw,2.1rem)]">You cooked.</span>
              <span className="text-white/50">•</span>
              <span className="font-editorial text-[clamp(1.35rem,3.2vw,2.1rem)]">We stayed in.</span>
              <span className="text-white/50">•</span>
              <span className="font-editorial italic text-[clamp(1.35rem,3.2vw,2.1rem)]">We watched shows.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-xl mx-auto text-white font-medium text-shadow-subtle">
              <span className="font-editorial text-[clamp(1.35rem,3.2vw,2.1rem)]">We played.</span>
              <span className="text-white/50">•</span>
              <span className="font-editorial italic text-[clamp(1.35rem,3.2vw,2.1rem)]">We laughed.</span>
            </div>

            <div className="pt-2">
              <p className="font-editorial text-[clamp(1.85rem,5vw,3.25rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
                We were completely ourselves.
              </p>
            </div>
          </div>

          {/* 5. The Cooking Memory: "She cooked." / "You were already making home look suspiciously natural." */}
          <div
            id="first-meeting-cooking-memory"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: cookingOpacity,
              transform: `translateY(${cookingY}px)`,
              visibility: cookingOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-200/30 bg-cyan-200/[0.08] backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-cyan-100 font-semibold text-shadow-subtle">
                The Quiet Details
              </span>
            </div>

            <h3 className="font-editorial italic text-[clamp(2.35rem,6vw,4.25rem)] text-white font-semibold tracking-wide text-shadow-subtle">
              She cooked.
            </h3>

            <p className="font-editorial text-[clamp(1.3rem,3.2vw,2rem)] text-slate-100 leading-relaxed max-w-md mx-auto font-medium text-shadow-subtle">
              You were already making home look suspiciously natural.
            </p>
          </div>

          {/* 6. CORE EMOTIONAL REVEAL: "We felt like a couple that had already been together for five years." */}
          {/* HIGHEST VISUAL EMPHASIS */}
          <div
            id="first-meeting-five-years-core"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-5 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: fiveYearsOpacity,
              transform: `translateY(${fiveYearsY}px)`,
              visibility: fiveYearsOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 text-cyan-200 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-shadow-subtle">
                The Core Truth
              </span>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            </div>

            <h2
              id="together-five-years-statement"
              className="font-editorial text-[clamp(2.25rem,6.8vw,4.85rem)] font-bold text-white leading-[1.2] tracking-wide sm:tracking-wider starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.45)',
              }}
            >
              We felt like a couple that had already been together for five years.
            </h2>

            <div className="space-y-1 pt-1">
              <p className="font-editorial italic text-[clamp(1.25rem,3.2vw,2rem)] text-slate-100 font-medium tracking-wide max-w-xl mx-auto text-shadow-subtle">
                Not because we&apos;d known each other for five years.
              </p>
              <p className="font-editorial text-[clamp(1.35rem,3.6vw,2.2rem)] text-white font-bold tracking-wide max-w-xl mx-auto starlight-heavy-glow">
                But because being together felt that natural.
              </p>
            </div>
          </div>

          {/* 7. PLAYFUL MOMENT: "Apparently... we skipped the awkward first-date stage entirely. Very efficient of us." */}
          <div
            id="first-meeting-playful-moment"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: playfulOpacity,
              transform: `translateY(${playfulY}px)`,
              visibility: playfulOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              Unspoken Chemistry
            </span>

            <p className="font-editorial italic text-[clamp(1.75rem,4.4vw,2.8rem)] text-slate-100 font-medium text-shadow-subtle">
              Apparently...
            </p>

            <h3 className="font-editorial text-[clamp(2rem,5.4vw,3.6rem)] text-white font-bold leading-snug tracking-wide text-shadow-subtle">
              we skipped the awkward first-date stage entirely.
            </h3>

            <div className="px-5 py-1.5 rounded-full border border-white/30 bg-white/[0.08] backdrop-blur-sm">
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-100 font-semibold text-shadow-subtle">
                Very efficient of us.
              </span>
            </div>
          </div>

          {/* 8. THE QUESTION: "And then I asked you something... Will you be my girlfriend?" */}
          <div
            id="first-meeting-the-question"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-5 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: questionOpacity,
              transform: `translateY(${questionY}px)`,
              visibility: questionOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20">
              THE TURNING POINT
            </span>

            <p className="font-editorial italic text-[clamp(1.65rem,4.2vw,2.6rem)] text-[#e2e2e2] font-medium text-shadow-subtle">
              And then I asked you something.
            </p>

            <div className="relative py-2">
              <h2
                id="will-you-be-my-girlfriend-title"
                className="font-editorial text-[clamp(2.45rem,7.2vw,5.25rem)] font-bold text-white tracking-wide leading-tight starlight-heavy-glow"
              >
                &ldquo;Will you be my girlfriend?&rdquo;
              </h2>
            </div>

            <p className="font-mono-label text-[11px] text-[#d3c0e0] text-shadow-subtle">
              Intimate • Unforgettable • Real
            </p>
          </div>

          {/* 9. THE RESPONSE: "And just like that... we became us." & "18.02.2026" */}
          <div
            id="first-meeting-the-response"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: responseOpacity,
              transform: `translateY(${responseY}px)`,
              visibility: responseOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.75rem,4.4vw,2.8rem)] text-[#e2e2e2] font-medium text-shadow-subtle">
              And just like that...
            </p>

            <h2 className="font-editorial text-[clamp(2.6rem,7vw,5rem)] font-bold text-white tracking-wide starlight-heavy-glow">
              ...we became us.
            </h2>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ffafd7]/30 bg-[#ffafd7]/[0.08] backdrop-blur-md">
                <Heart className="w-3.5 h-3.5 text-[#ffafd7] fill-[#ffafd7]/60" />
                <span className="font-mono-label text-xs sm:text-sm text-white font-bold text-shadow-subtle">
                  18.02.2026
                </span>
                <Heart className="w-3.5 h-3.5 text-[#ffafd7] fill-[#ffafd7]/60" />
              </div>
            </div>
          </div>

          {/* 10. EMOTIONAL CALLBACK: "Looking back, I think this was the first time I understood why I would eventually call you Urijip." */}
          <div
            id="first-meeting-emotional-callback"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: callbackOpacity,
              transform: `translateY(${callbackY}px)`,
              visibility: callbackOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold text-shadow-subtle">
              Looking Back
            </span>

            <p className="font-editorial italic text-[clamp(1.5rem,4vw,2.6rem)] text-slate-100 leading-relaxed max-w-2xl mx-auto font-medium text-shadow-subtle">
              Looking back, I think this was the first time I understood why I would eventually call you Urijip.
            </p>
          </div>

          {/* 11. ENDING OF PHASE 5: "18 February 2026. The day we met. The day I asked you to be mine. The day I realized... I'd found somewhere I could call home." */}
          <div
            id="first-meeting-chapter-ending"
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
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
                18 February 2026
              </span>
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <div className="space-y-1.5 text-white font-medium text-shadow-subtle">
              <p className="font-editorial text-[clamp(1.45rem,3.6vw,2.2rem)]">The day we met.</p>
              <p className="font-editorial text-[clamp(1.45rem,3.6vw,2.2rem)]">The day I asked you to be mine.</p>
              <p className="font-editorial italic text-[clamp(1.45rem,3.6vw,2.2rem)] text-slate-200">The day I realized...</p>
            </div>

            <h3
              id="found-somewhere-call-home-title"
              className="font-editorial text-[clamp(2.25rem,6.2vw,4.5rem)] font-bold text-white leading-snug tracking-wide starlight-heavy-glow max-w-2xl pt-1"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.5)',
              }}
            >
              I&apos;d found somewhere I could call home.
            </h3>

            {/* Glowing warm home aura preparing for next chapter */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.3, 0.55, 0.3],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.18)_0%,_rgba(56,189,248,0.1)_45%,_transparent_70%)] blur-2xl pointer-events-none mt-2"
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
                  key={`first-meeting-step-${idx}`}
                  onClick={() => scrollToStep(step.target)}
                  aria-label={step.label}
                  className={`transition-all duration-300 rounded-full flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                      : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-slate-300 uppercase tracking-[0.2em] font-medium text-shadow-subtle">
            <span>{scrollProgress > 0.9 ? 'Chapter V Complete' : 'Scroll gently through 18 February'}</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
