import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UrijipChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { Sparkles, Heart, Shield, Home } from 'lucide-react';

export const UrijipChapter: React.FC<UrijipChapterProps> = ({
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
  // ATMOSPHERIC PALETTE TRANSFORMATION (Night Sky -> Aurora -> Starlight Warmth)
  // -------------------------------------------------------------
  const nightSkyAlpha = range(scrollProgress, 0.0, 0.35, 0.35, 0.7);
  const auroraWarmthAlpha = range(scrollProgress, 0.20, 0.55, 0, 0.5);
  const warmCreamAlpha = range(scrollProgress, 0.45, 0.85, 0, 0.4);

  // -------------------------------------------------------------
  // SCROLL PROGRESS INTERPOLATION CHOREOGRAPHY (0.00 to 1.00)
  // -------------------------------------------------------------

  // 1. Initial Breathing Transition & "There's a name I gave you." (0.00 -> 0.11)
  const frag1Opacity = bell(scrollProgress, 0.0, 0.05, 0.11);
  const frag1Y = range(scrollProgress, 0.0, 0.11, 10, -12);

  // 2. Fragment 2: "Because you became something more than someone I love." (0.09 -> 0.19)
  const frag2Opacity = bell(scrollProgress, 0.09, 0.14, 0.19);
  const frag2Y = range(scrollProgress, 0.09, 0.19, 18, -12);

  // 3. Fragment 3: "Home." (0.17 -> 0.26)
  const frag3Opacity = bell(scrollProgress, 0.17, 0.215, 0.26);
  const frag3Y = range(scrollProgress, 0.17, 0.26, 18, -10);

  // 4. THE GRAND REVEAL: "URIJIP" • 우리집 • "Our home." (0.24 -> 0.38)
  // HIGHEST TYPOGRAPHIC & IDENTITY EMPHASIS
  const urijipRevealOpacity = bell(scrollProgress, 0.24, 0.31, 0.38);
  const urijipRevealY = range(scrollProgress, 0.24, 0.38, 20, -10);

  // 5. The Meaning of Home: "Home is where I don't have to pretend..." (0.36 -> 0.48)
  const meaningOpacity = bell(scrollProgress, 0.36, 0.42, 0.48);
  const meaningY = range(scrollProgress, 0.36, 0.48, 18, -12);

  // 6. The Responsibility of Home: "Calling you home isn't just about how you make me feel..." (0.46 -> 0.58)
  const responsibilityOpacity = bell(scrollProgress, 0.46, 0.52, 0.58);
  const responsibilityY = range(scrollProgress, 0.46, 0.58, 18, -12);

  // 7. The Promise: "I will do my best to never make you regret trusting me." (0.56 -> 0.68)
  // DEDICATED VISUAL MOMENT
  const promiseOpacity = bell(scrollProgress, 0.56, 0.62, 0.68);
  const promiseY = range(scrollProgress, 0.56, 0.68, 20, -10);

  // 8. The Three Home Lines: "I hope I'm always your room. Your pillow. Your Superman." (0.66 -> 0.77)
  const threeLinesOpacity = bell(scrollProgress, 0.66, 0.715, 0.77);
  const threeLinesY = range(scrollProgress, 0.66, 0.77, 18, -10);

  // 9. Soft Humor: "Although... Given that we're both last-borns... I may need occasional adult supervision too." (0.75 -> 0.85)
  const humorOpacity = bell(scrollProgress, 0.75, 0.80, 0.85);
  const humorY = range(scrollProgress, 0.75, 0.85, 18, -10);

  // 10. The Ending of Phase 6: "That's why I call you Urijip. You are home to me." (0.83 -> 1.00)
  const finalEndingOpacity = range(scrollProgress, 0.83, 0.90, 0, 1);
  const finalEndingY = range(scrollProgress, 0.83, 0.90, 20, 0);

  // Micro-step Timeline dots
  const steps = [
    { label: '"There\'s a name I gave you"', target: 0.05 },
    { label: '"More than someone I love"', target: 0.14 },
    { label: '"Home"', target: 0.21 },
    { label: 'URIJIP • 우리집 • Our Home', target: 0.31 },
    { label: 'The Meaning of Home', target: 0.42 },
    { label: 'The Responsibility of Home', target: 0.52 },
    { label: 'The Sacred Promise', target: 0.62 },
    { label: 'Room • Pillow • Superman', target: 0.71 },
    { label: 'Last-Born Supervision', target: 0.80 },
    { label: '"You are home to me"', target: 0.93 },
  ];

  return (
    <section
      ref={containerRef}
      id="urijip-home-chapter"
      className={`relative w-full min-h-[820vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter VI: URIJIP — OUR HOME"
    >
      {/* ------------------------------------------------------------- */}
      {/* ABSTRACT VISUAL HOME MOTIF & COLOR TRANSFORMATION LAYERS     */}
      {/* Deep Night Sky & Aurora Emerald / Cyan Glow                   */}
      {/* ------------------------------------------------------------- */}

      {/* Layer A: Expansive Night Sky Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 110% 95% at 50% 50%, rgba(15, 23, 42, 0.7) 0%, rgba(10, 15, 30, 0.5) 50%, transparent 100%)',
          opacity: nightSkyAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 5,
        }}
      />

      {/* Layer B: Expansive Aurora Cyan/Emerald Radiance */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 100%)',
          opacity: auroraWarmthAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 6,
        }}
      />

      {/* Layer C: Starlight Luminous Sanctuary Pool */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(186, 230, 253, 0.05) 45%, transparent 80%)',
          opacity: warmCreamAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 7,
        }}
      />

      {/* Concentric Soft Luminous Expanding Rings representing Arrival at Home */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: range(scrollProgress, 0.22, 0.42, 0, 0.75) * (scrollProgress > 0.88 ? range(scrollProgress, 0.88, 1.0, 1, 0.5) : 1),
          zIndex: Z_INDEX_TOKENS.ambientGlow + 8,
        }}
      >
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
          className="w-[70vw] max-w-[650px] h-[70vw] max-h-[650px] rounded-full border border-white/20 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_0%,_transparent_70%)] blur-md pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.05, 0.98, 1.05],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[90vw] max-w-[820px] h-[90vw] max-h-[820px] rounded-full border border-cyan-400/10 pointer-events-none"
        />
      </div>

      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Chapter VI Sanctuary Marker */}
        <header className="w-full flex flex-col items-center flex-shrink-0 z-30 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] text-slate-300 font-medium">
              Chapter VI • The Name of Home
            </span>
            <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
          </div>
        </header>

        {/* Center Stage: Sequential Memory & Revelation Moments */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 1. Fragment 1: "There's a name I gave you." */}
          <div
            id="urijip-fragment-1"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-3 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag1Opacity,
              transform: `translateY(${frag1Y}px)`,
              visibility: frag1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.28em] text-slate-300">
              The Origin
            </span>
            <h3 className="font-editorial text-[clamp(2rem,5.5vw,3.75rem)] font-light text-white leading-snug tracking-wide starlight-heavy-glow">
              There&apos;s a name I gave you.
            </h3>
            <p className="font-body font-light text-xs sm:text-sm text-slate-300 italic">
              A word that holds everything.
            </p>
          </div>

          {/* 2. Fragment 2: "Because you became something more than someone I love." */}
          <div
            id="urijip-fragment-2"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag2Opacity,
              transform: `translateY(${frag2Y}px)`,
              visibility: frag2Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.4rem,3.5vw,2.2rem)] text-slate-200">
              Because you became...
            </p>
            <p className="font-editorial text-[clamp(1.85rem,4.8vw,3.35rem)] text-white font-normal leading-snug tracking-wide starlight-heavy-glow">
              something more than someone I love.
            </p>
          </div>

          {/* 3. Fragment 3: "Home." */}
          <div
            id="urijip-fragment-3"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-3 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag3Opacity,
              transform: `translateY(${frag3Y}px)`,
              visibility: frag3Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <h2
              id="the-word-home"
              className="font-editorial text-[clamp(3rem,9vw,6.5rem)] font-light text-white tracking-[0.18em] leading-none starlight-heavy-glow"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(56, 189, 248, 0.35)',
              }}
            >
              Home.
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-2" />
            <p className="font-body font-light text-xs sm:text-sm text-slate-300 uppercase tracking-[0.25em]">
              Where the heart rests
            </p>
          </div>

          {/* 4. THE GRAND REVEAL: URIJIP • 우리집 • "Our home." */}
          {/* HIGHEST TYPOGRAPHIC & IDENTITY MOMENT */}
          <div
            id="urijip-title-reveal"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: urijipRevealOpacity,
              transform: `translateY(${urijipRevealY}px)`,
              visibility: urijipRevealOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            {/* Soft subtle identity pill */}
            <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm mb-1">
              <Home className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold">
                Identity
              </span>
            </div>

            {/* URIJIP - Grand Elegant Display */}
            <h1
              id="urijip-grand-identity-title"
              className="font-editorial text-[clamp(3.5rem,12vw,8.5rem)] font-bold text-white uppercase tracking-[0.22em] sm:tracking-[0.32em] leading-none select-none starlight-heavy-glow"
              style={{
                textShadow: '0 0 50px rgba(255, 255, 255, 0.85), 0 0 90px rgba(56, 189, 248, 0.45)',
              }}
            >
              URIJIP
            </h1>

            {/* 우리집 - Korean Hangul Serif Subheading */}
            <p className="font-editorial text-[clamp(1.75rem,5vw,3.25rem)] text-cyan-100/95 font-light tracking-[0.35em] leading-snug">
              우리집
            </p>

            {/* English translation */}
            <p className="font-editorial italic text-[clamp(1.35rem,3.6vw,2.35rem)] text-slate-200 tracking-widest pt-1">
              &ldquo;Our home.&rdquo;
            </p>
          </div>

          {/* 5. THE MEANING OF HOME: "Home is where I don't have to pretend..." */}
          <div
            id="urijip-meaning-of-home"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-3 sm:space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: meaningOpacity,
              transform: `translateY(${meaningY}px)`,
              visibility: meaningOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.28em] text-slate-300 font-medium mb-1">
              The Meaning
            </span>

            <div className="space-y-2 text-white/90">
              <p className="font-editorial text-[clamp(1.3rem,3.2vw,2rem)] font-light">
                Home is where I don&apos;t have to pretend.
              </p>
              <p className="font-editorial italic text-[clamp(1.25rem,3vw,1.9rem)] text-slate-200">
                Where I can be vulnerable.
              </p>
              <p className="font-editorial text-[clamp(1.25rem,3vw,1.9rem)] font-light">
                Where I can breathe.
              </p>
              <p className="font-editorial italic text-[clamp(1.25rem,3vw,1.9rem)] text-slate-200">
                Where I can be completely myself.
              </p>
              <p className="font-editorial text-[clamp(1.25rem,3vw,1.9rem)] font-light">
                Where I know I am accepted.
              </p>
            </div>

            <div className="w-12 h-[1px] bg-white/30 my-2 mx-auto" />

            <p className="font-editorial text-[clamp(1.6rem,4.2vw,2.75rem)] text-white font-normal leading-snug tracking-wide starlight-heavy-glow">
              That&apos;s what being with you feels like.
            </p>
          </div>

          {/* 6. THE RESPONSIBILITY OF HOME: "Calling you home isn't just about how you make me feel..." */}
          <div
            id="urijip-responsibility-of-home"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-3 sm:space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: responsibilityOpacity,
              transform: `translateY(${responsibilityY}px)`,
              visibility: responsibilityOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.05] mb-1">
              <Shield className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-slate-200 font-medium">
                Sacred Trust
              </span>
            </div>

            <p className="font-editorial italic text-[clamp(1.3rem,3.2vw,2rem)] text-slate-200 leading-snug max-w-xl">
              Calling you home isn&apos;t just about how you make me feel.
            </p>

            <p className="font-editorial text-[clamp(1.5rem,3.8vw,2.35rem)] text-white font-light tracking-wide">
              It&apos;s about what I owe you in return.
            </p>

            <div className="space-y-1.5 pt-1 text-white/80">
              <p className="font-editorial text-[clamp(1.15rem,2.6vw,1.65rem)] font-light">You&apos;ve trusted me.</p>
              <p className="font-editorial italic text-[clamp(1.15rem,2.6vw,1.65rem)] text-slate-200">You&apos;ve respected my boundaries.</p>
              <p className="font-editorial text-[clamp(1.15rem,2.6vw,1.65rem)] font-light">You&apos;ve respected my choices.</p>
              <p className="font-editorial italic text-[clamp(1.15rem,2.6vw,1.65rem)] text-slate-200">You&apos;ve made space for my vulnerability.</p>
            </div>

            <div className="pt-2">
              <p className="font-body font-normal text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-200">
                I don&apos;t take that trust lightly.
              </p>
            </div>
          </div>

          {/* 7. THE PROMISE: "I will do my best to never make you regret trusting me." */}
          {/* DEDICATED VISUAL MOMENT */}
          <div
            id="urijip-the-promise"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-5 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: promiseOpacity,
              transform: `translateY(${promiseY}px)`,
              visibility: promiseOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 text-cyan-200/80 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em]">
                The Solemn Vow
              </span>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            </div>

            <h2
              id="promise-statement"
              className="font-editorial text-[clamp(2.25rem,6.8vw,4.85rem)] font-bold text-white leading-[1.25] tracking-wide sm:tracking-wider starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 75px rgba(56, 189, 248, 0.45)',
              }}
            >
              I will do my best to never make you regret trusting me.
            </h2>

            <p className="font-body font-light text-xs sm:text-sm text-slate-300 uppercase tracking-[0.25em]">
              A promise etched across every tomorrow
            </p>
          </div>

          {/* 8. THE THREE HOME LINES: "I hope I'm always your room. Your pillow. Your Superman." */}
          <div
            id="urijip-three-home-lines"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: threeLinesOpacity,
              transform: `translateY(${threeLinesY}px)`,
              visibility: threeLinesOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">
              Every Sanctuary
            </span>

            <p className="font-editorial text-[clamp(1.75rem,4.5vw,3rem)] text-white font-light leading-snug tracking-wide">
              I hope I&apos;m always your room.
            </p>

            <p className="font-editorial italic text-[clamp(2rem,5.2vw,3.5rem)] text-slate-200 font-normal leading-snug tracking-wide">
              Your pillow.
            </p>

            <p className="font-editorial text-[clamp(2.35rem,6vw,4.25rem)] text-white font-bold leading-snug tracking-wider starlight-heavy-glow">
              Your Superman.
            </p>
          </div>

          {/* 9. SOFT HUMOR: "Although... Given that we're both last-borns... I may need occasional adult supervision too." */}
          <div
            id="urijip-last-born-humor"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: humorOpacity,
              transform: `translateY(${humorY}px)`,
              visibility: humorOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-300">
              A Small Disclaimer
            </span>

            <p className="font-editorial italic text-[clamp(1.5rem,3.8vw,2.35rem)] text-slate-200">
              Although...
            </p>

            <p className="font-editorial text-[clamp(1.75rem,4.5vw,3rem)] text-white font-light leading-snug">
              Given that we&apos;re both last-borns...
            </p>

            <div className="px-5 py-2 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm">
              <p className="font-body text-xs sm:text-sm text-slate-200 font-medium tracking-wide">
                I may need occasional adult supervision too.
              </p>
            </div>
          </div>

          {/* 10. THE CULMINATION & ENDING: "That's why I call you Urijip. You are home to me." */}
          <div
            id="urijip-chapter-ending"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-5 transition-all duration-150 ease-out z-30"
            style={{
              opacity: finalEndingOpacity,
              transform: `translateY(${finalEndingY}px)`,
              visibility: finalEndingOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: finalEndingOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.28em] text-slate-300 font-medium">
                Our Home • 우리집
              </span>
              <div className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <p className="font-editorial italic text-[clamp(1.6rem,4vw,2.75rem)] text-slate-200 leading-snug tracking-wide">
              That&apos;s why I call you Urijip.
            </p>

            <h2
              id="you-are-home-to-me-title"
              className="font-editorial text-[clamp(2.5rem,7.5vw,5.5rem)] font-bold text-white leading-tight tracking-wide starlight-heavy-glow"
              style={{
                textShadow: '0 0 45px rgba(255, 255, 255, 0.9), 0 0 90px rgba(56, 189, 248, 0.45)',
              }}
            >
              You are home to me.
            </h2>

            {/* Calm, warm settled home aura */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.35, 0.6, 0.35],
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
                  key={`urijip-step-${idx}`}
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
            <span>{scrollProgress > 0.9 ? 'Chapter VI Complete' : 'Scroll gently through our home'}</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
