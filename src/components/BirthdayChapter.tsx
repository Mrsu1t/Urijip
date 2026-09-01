import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BirthdayChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { Sparkles, Heart } from 'lucide-react';

export const BirthdayChapter: React.FC<BirthdayChapterProps> = ({
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
  // ATMOSPHERIC ENVIRONMENTAL PROGRESSION
  // Cosmic Return -> Warm Rose & Bubblegum Pink -> Warm Cream -> Deep Violet -> Midnight -> Black
  // -------------------------------------------------------------

  // Warm Rose & Bubblegum Glow (Peaks during the intimate birthday message and peaks of Home)
  const warmRoseAlpha =
    scrollProgress < 0.7
      ? range(scrollProgress, 0.0, 0.25, 0.35, 0.75)
      : range(scrollProgress, 0.7, 0.92, 0.75, 0.0);

  // Soft Warm Cream Atmosphere
  const warmCreamAlpha =
    scrollProgress < 0.65
      ? range(scrollProgress, 0.05, 0.3, 0.2, 0.55)
      : range(scrollProgress, 0.65, 0.88, 0.55, 0.0);

  // Violet Twilight Transition (Fades in around 0.68 -> 0.88)
  const violetAlpha =
    scrollProgress >= 0.68 && scrollProgress < 0.94
      ? bell(scrollProgress, 0.68, 0.80, 0.94) * 0.85
      : 0;

  // Midnight & Black Transition (Fades in 0.82 -> 1.0)
  const blackReturnAlpha = range(scrollProgress, 0.82, 0.98, 0, 1);

  // Faint Starlight Visibility Modulation
  // Starlight is soft during pink/cream stages, then intensifies as darkness returns
  const starlightGlowAlpha =
    scrollProgress < 0.7
      ? 0.35
      : range(scrollProgress, 0.7, 1.0, 0.35, 1.0);

  // -------------------------------------------------------------
  // SCROLL-LINKED CHOREOGRAPHY & STAGES
  // -------------------------------------------------------------

  // Stage 0: Transition & Opening "HAPPY BIRTHDAY, MY LOVE." (0.00 -> 0.13)
  const stage0Opacity = scrollProgress <= 0.02 ? 1 : bell(scrollProgress, 0.0, 0.05, 0.13);
  const stage0Y = range(scrollProgress, 0.0, 0.13, 0, -16);

  // Stage 1: "Your first birthday with a boyfriend..." (0.11 -> 0.26)
  const stage1Opacity = bell(scrollProgress, 0.11, 0.18, 0.26);
  const stage1Y = range(scrollProgress, 0.11, 0.26, 16, -14);

  // Stage 2: "Another year of you..." (0.24 -> 0.39)
  const stage2Opacity = bell(scrollProgress, 0.24, 0.31, 0.39);
  const stage2Y = range(scrollProgress, 0.24, 0.39, 16, -14);

  // Stage 3: Personal Birthday Message (0.37 -> 0.52)
  const stage3Opacity = bell(scrollProgress, 0.37, 0.44, 0.52);
  const stage3Y = range(scrollProgress, 0.37, 0.52, 16, -14);

  // Stage 4: Ambition & Dreams / Cooking Callback (0.50 -> 0.65)
  const stage4Opacity = bell(scrollProgress, 0.50, 0.57, 0.65);
  const stage4Y = range(scrollProgress, 0.50, 0.65, 16, -14);

  // Stage 5: "Happy Birthday, Urijip. / Thank you for being home." (0.63 -> 0.78)
  const stage5Opacity = bell(scrollProgress, 0.63, 0.70, 0.78);
  const stage5Y = range(scrollProgress, 0.63, 0.78, 16, -14);

  // Stage 6: The Pause & "The story isn't over. This is only the first phase." (0.76 -> 0.90)
  const stage6Opacity = bell(scrollProgress, 0.76, 0.83, 0.90);
  const stage6Y = range(scrollProgress, 0.76, 0.90, 16, -14);

  // Stage 7: Final Return to Midnight & Black (0.88 -> 1.00)
  const stage7Opacity = range(scrollProgress, 0.88, 0.96, 0, 1);
  const stage7Y = range(scrollProgress, 0.88, 0.96, 20, 0);

  // Timeline Step Navigation
  const steps = [
    { label: 'Happy Birthday', target: 0.05 },
    { label: 'First Birthday', target: 0.18 },
    { label: 'Another Year', target: 0.31 },
    { label: 'My Heart For You', target: 0.44 },
    { label: 'Your Next Chapter', target: 0.57 },
    { label: 'Happy Birthday Urijip', target: 0.70 },
    { label: 'The Story Continues', target: 0.83 },
    { label: 'Deep Night Horizon', target: 0.95 },
  ];

  return (
    <section
      ref={containerRef}
      id="chapter-birthday"
      className={`relative w-full min-h-[620vh] select-none ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Phase 11: Her Birthday"
    >
      {/* Sticky Cinematic Viewport Canvas */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-5 sm:py-7">

        {/* ------------------------------------------------------------- */}
        {/* ATMOSPHERIC BACKGROUND LAYERS */}
        {/* ------------------------------------------------------------- */}

        {/* Layer A: Warm Rose & Bubblegum Ambient Aura */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: warmRoseAlpha,
            background:
              'radial-gradient(ellipse 95% 85% at 50% 45%, rgba(232, 128, 185, 0.22) 0%, rgba(125, 46, 104, 0.18) 40%, rgba(44, 22, 84, 0.08) 75%, transparent 100%)',
          }}
        />

        {/* Layer B: Warm Cream Hearth Center Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] h-[65vh] rounded-full pointer-events-none blur-[95px] transition-opacity duration-700 ease-out"
          style={{
            opacity: warmCreamAlpha,
            background:
              'radial-gradient(circle, rgba(250, 245, 235, 0.18) 0%, rgba(244, 143, 177, 0.14) 45%, rgba(232, 128, 185, 0.05) 75%, transparent 100%)',
          }}
        />

        {/* Layer C: Deep Violet Twilight Atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: violetAlpha,
            background:
              'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(44, 22, 84, 0.75) 0%, rgba(20, 10, 42, 0.65) 55%, rgba(7, 11, 24, 0.9) 100%)',
          }}
        />

        {/* Layer D: Midnight & Pure Black Return Curtain */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: blackReturnAlpha,
            background:
              'radial-gradient(ellipse 90% 80% at 50% 50%, #060912 0%, #04060A 60%, #000002 100%)',
          }}
        />

        {/* Layer E: Faint Constellation Starlight Dust ("The starlight never disappeared. It became part of home.") */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: starlightGlowAlpha }}
        >
          <div className="absolute top-[18%] left-[15%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <div className="absolute top-[28%] right-[22%] w-1 h-1 rounded-full bg-pink-100/60 shadow-[0_0_6px_rgba(255,220,240,0.8)]" />
          <div className="absolute bottom-[32%] left-[24%] w-1 h-1 rounded-full bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
          <div className="absolute top-[64%] right-[18%] w-1.5 h-1.5 rounded-full bg-pink-200/70 shadow-[0_0_8px_rgba(255,200,230,0.8)] animate-pulse" />
          <div className="absolute top-[45%] left-[8%] w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute bottom-[20%] right-[30%] w-1 h-1 rounded-full bg-pink-100/50" />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HEADER: CHAPTER METADATA */}
        {/* ------------------------------------------------------------- */}
        <header className="w-full flex items-center justify-between z-30 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-300/10 border border-pink-200/20 text-pink-200/90 text-[10px] sm:text-xs font-editorial">
              XI
            </span>
            <div className="flex flex-col">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-pink-100/70 font-medium">
                Phase Eleven
              </span>
              <span className="font-editorial text-xs sm:text-sm text-pink-100/90 italic tracking-wider">
                Her Birthday
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-pink-200/15 bg-pink-400/[0.04] backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-pink-200/80" />
            <span className="font-body text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-pink-100/70">
              For You
            </span>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* MAIN NARRATIVE DISPLAY CONTAINER */}
        {/* ------------------------------------------------------------- */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex items-center justify-center z-20 my-auto px-2">

          {/* ========================================================= */}
          {/* STAGE 0: RESTRAINED OPENING — "HAPPY BIRTHDAY, MY LOVE." */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage0Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage0Opacity,
              transform: `translateY(${stage0Y}px)`,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-pink-200/80 mb-4 sm:mb-6 font-medium"
            >
              After everything we&apos;ve explored, I keep coming back to you.
            </motion.p>

            <h1
              id="birthday-main-title"
              className="font-editorial text-[clamp(2.2rem,6.5vw,4.8rem)] font-light text-white leading-[1.15] tracking-wide uppercase starlight-heavy-glow max-w-3xl"
              style={{
                textShadow:
                  '0 0 35px rgba(255, 240, 250, 0.95), 0 0 75px rgba(244, 143, 177, 0.55), 0 0 110px rgba(232, 128, 185, 0.35)',
              }}
            >
              Happy Birthday, My Love.
            </h1>

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-[radial-gradient(circle,_rgba(255,235,245,0.22)_0%,_rgba(244,143,177,0.12)_50%,_transparent_75%)] blur-2xl pointer-events-none mt-4"
            />
          </div>

          {/* ========================================================= */}
          {/* STAGE 1: THE MEANING OF THIS BIRTHDAY */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage1Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage1Opacity,
              transform: `translateY(${stage1Y}px)`,
            }}
          >
            <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">
              <p className="font-editorial text-[clamp(1.75rem,4.6vw,3.2rem)] font-light leading-relaxed text-pink-100">
                Your first birthday with a boyfriend.
              </p>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-pink-200/40 to-transparent mx-auto my-3" />

              <p className="font-editorial italic text-[clamp(1.85rem,4.8vw,3.4rem)] font-normal leading-relaxed text-white starlight-text-glow">
                And somehow, I get to be him.
              </p>

              <p className="font-body text-[clamp(0.95rem,2.1vw,1.25rem)] font-normal text-pink-100/80 max-w-lg mx-auto pt-2 tracking-wide leading-relaxed">
                I&apos;m very happy that I get to be that person.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 2: PERSONALITY CALLBACK — "Another year of you." */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage2Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage2Opacity,
              transform: `translateY(${stage2Y}px)`,
            }}
          >
            <div className="space-y-5 sm:space-y-7 max-w-2xl mx-auto">
              <h2 className="font-editorial text-[clamp(1.9rem,5vw,3.5rem)] font-light text-white leading-tight starlight-heavy-glow">
                Another year of you.
              </h2>

              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-pink-300/40 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.5rem,3.8vw,2.5rem)] font-light text-pink-100 leading-relaxed">
                And somehow, I still get to be part of the story.
              </p>

              <p className="font-body text-[clamp(0.9rem,2vw,1.15rem)] font-normal text-pink-100/75 max-w-md mx-auto leading-relaxed pt-1">
                Every single day with you feels like a gift I never take for granted.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 3: SINCERE PERSONAL BIRTHDAY MESSAGE */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage3Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage3Opacity,
              transform: `translateY(${stage3Y}px)`,
            }}
          >
            <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto text-pink-100">
              <p className="font-editorial text-[clamp(1.4rem,3.4vw,2.2rem)] font-light leading-relaxed text-white">
                I am endlessly grateful for your existence.
              </p>

              <p className="font-body text-[clamp(0.95rem,2.1vw,1.25rem)] font-normal text-pink-100/90 leading-relaxed max-w-xl mx-auto">
                How much you mean to me is something words only ever begin to touch.
              </p>

              <p className="font-editorial italic text-[clamp(1.3rem,3vw,2rem)] font-light text-pink-200/95 leading-relaxed max-w-xl mx-auto">
                I admire the woman you are, and the woman you are becoming every single day.
              </p>

              <p className="font-body text-[clamp(0.9rem,1.9vw,1.15rem)] font-normal text-pink-100/75 leading-relaxed max-w-lg mx-auto pt-1">
                I value everything we have created together, and I am so excited to witness more of your life.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 4: DREAMS & AMBITION CALLBACK */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage4Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage4Opacity,
              transform: `translateY(${stage4Y}px)`,
            }}
          >
            <div className="space-y-5 sm:space-y-7 max-w-2xl mx-auto">
              <p className="font-editorial text-[clamp(1.55rem,3.9vw,2.75rem)] font-light text-white leading-relaxed max-w-xl mx-auto starlight-text-glow">
                I hope this next chapter of your life brings you closer to everything you dream about.
              </p>

              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-pink-200/30 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.45rem,3.6vw,2.4rem)] font-normal text-pink-100 leading-relaxed">
                I&apos;ll be here cheering for you.
              </p>

              <p className="font-body text-[clamp(0.9rem,1.9vw,1.2rem)] font-normal text-pink-100/80 leading-relaxed max-w-lg mx-auto pt-1">
                Especially when you decide to turn that cooking passion into something bigger.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 5: PEAK MESSAGE — "Happy Birthday, Urijip." */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage5Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage5Opacity,
              transform: `translateY(${stage5Y}px)`,
            }}
          >
            <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
              <h2
                id="birthday-urijip-title"
                className="font-editorial text-[clamp(2.4rem,7vw,5rem)] font-bold text-white leading-tight tracking-wide starlight-heavy-glow"
                style={{
                  textShadow:
                    '0 0 40px rgba(255, 240, 250, 0.95), 0 0 85px rgba(244, 143, 177, 0.65), 0 0 125px rgba(232, 128, 185, 0.4)',
                }}
              >
                Happy Birthday, Urijip.
              </h2>

              <p className="font-editorial italic text-[clamp(1.6rem,4.2vw,3rem)] font-light text-pink-100 leading-relaxed starlight-text-glow">
                Thank you for being home.
              </p>

              {/* Glowing Heart of Warmth */}
              <motion.div
                animate={{
                  scale: [1, 1.07, 1],
                  opacity: [0.45, 0.7, 0.45],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,_rgba(255,245,240,0.25)_0%,_rgba(244,143,177,0.15)_45%,_transparent_75%)] blur-2xl pointer-events-none mx-auto mt-2"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 6: THE PAUSE & "The story isn't over." */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage6Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage6Opacity,
              transform: `translateY(${stage6Y}px)`,
            }}
          >
            <div className="space-y-6 sm:space-y-8 max-w-xl mx-auto">
              <p className="font-editorial text-[clamp(1.85rem,5vw,3.4rem)] font-light text-pink-100/90 leading-relaxed tracking-wide starlight-text-glow">
                The story isn&apos;t over.
              </p>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.6rem,4.2vw,2.8rem)] font-light text-white/95 leading-relaxed">
                This is only the first phase.
              </p>

              <p className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-purple-200/50 pt-3">
                Rose → Violet → Midnight
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 7: DEEP MIDNIGHT HORIZON & STARLIT BLACK */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none px-4 ${
              stage7Opacity > 0.01 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage7Opacity,
              transform: `translateY(${stage7Y}px)`,
            }}
          >
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] mx-auto animate-pulse" />

              <p className="font-editorial text-[clamp(1.3rem,3.2vw,2.1rem)] font-light text-white/80 tracking-widest starlight-text-glow pt-2">
                And the stars return.
              </p>

              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-3" />

              <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/30 font-medium">
                End of Phase XI
              </p>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* FOOTER: NARRATIVE TIMELINE & SCROLL HELPER */}
        {/* ------------------------------------------------------------- */}
        <footer className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-2">
          {/* Interactive Micro-Step Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 max-w-[90vw] overflow-x-auto py-1">
            {steps.map((step, idx) => {
              const isActive = Math.abs(scrollProgress - step.target) < 0.05;
              return (
                <button
                  key={`bday-step-${idx}`}
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
            <span>
              {scrollProgress > 0.92
                ? 'Phase XI Complete • Deep Night'
                : 'Scroll to experience her birthday'}
            </span>
          </div>
        </footer>

      </div>
    </section>
  );
};
