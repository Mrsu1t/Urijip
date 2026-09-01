import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MidnightClockMotif } from './MidnightClockMotif';
import { ChapterAudioController } from './ChapterAudioController';
import { BurpingTribunalModal } from './BurpingTribunalModal';
import { useChapterAudio } from '../hooks/useChapterAudio';
import { FirstCallChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { Sparkles, ShieldAlert, Award } from 'lucide-react';

/**
 * ORCHESTRAL SOUNDTRACK INTEGRATION POINT
 * Real audio file URL for Chapter IV (The First Call • 20 → 21 November 2025).
 */
export const FIRST_CALL_ORCHESTRA_AUDIO_SRC = 'https://www.image2url.com/r2/default/audio/1788294198647-95511561-adad-4cb9-93f3-ee9ecd90ba9a.ogg';

export const FirstCallChapter: React.FC<FirstCallChapterProps> = ({
  onProgressChange,
  className = '',
  orchestraTrackSrc = FIRST_CALL_ORCHESTRA_AUDIO_SRC,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTribunalOpen, setIsTribunalOpen] = useState(false);

  // Dedicated isolated chapter audio controller hook for Classical Orchestral Soundtrack
  const audio = useChapterAudio({
    src: orchestraTrackSrc,
    simulatedDurationSeconds: 18,
  });

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

  // Pause audio automatically if user leaves Chapter IV entirely
  useEffect(() => {
    if (audio.isPlaying && (scrollProgress < 0.005 || scrollProgress > 0.995)) {
      audio.pause();
    }
  }, [scrollProgress, audio]);

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
  // SCROLL PROGRESS INTERPOLATION CHOREOGRAPHY (0.00 to 1.00)
  // -------------------------------------------------------------

  // 1. Scene Entry: 20 → 21 NOVEMBER 2025 & "THE FIRST CALL" (0.00 -> 0.12)
  const titleOpacity = scrollProgress <= 0.03 ? 1 : bell(scrollProgress, 0.0, 0.05, 0.12);
  const titleY = range(scrollProgress, 0.0, 0.12, 0, -16);

  // 2. Fragment 1: "Our first call..." / "...was supposed to be a conversation." (0.10 -> 0.21)
  const callFrag1Opacity = bell(scrollProgress, 0.10, 0.155, 0.21);
  const callFrag1Y = range(scrollProgress, 0.10, 0.21, 18, -12);

  // 3. Fragment 2: "But somehow..." / "we talked into the next day." (0.19 -> 0.30)
  const callFrag2Opacity = bell(scrollProgress, 0.19, 0.245, 0.30);
  const callFrag2Y = range(scrollProgress, 0.19, 0.30, 18, -12);

  // 4. Time Progression Dial (0.28 -> 0.48)
  const clockDialOpacity = bell(scrollProgress, 0.28, 0.38, 0.48);
  const clockDialY = range(scrollProgress, 0.28, 0.48, 16, -10);
  const clockProgress = range(scrollProgress, 0.28, 0.44, 0, 1);
  const currentTimeLabel = useMemo(() => {
    if (scrollProgress < 0.32) return '11:15 PM';
    if (scrollProgress < 0.36) return '11:42 PM';
    if (scrollProgress < 0.40) return '11:58 PM';
    return '12:00 AM • MIDNIGHT';
  }, [scrollProgress]);

  // 5. Midnight Transition: "12:00 AM • November 21." / "And then it became my birthday." (0.42 -> 0.54)
  const midnightOpacity = bell(scrollProgress, 0.42, 0.48, 0.54);
  const midnightY = range(scrollProgress, 0.42, 0.54, 18, -12);

  // 6. Emotional Centerpiece 1: "You were the first person to wish me a Happy Birthday." (0.52 -> 0.65)
  // HIGHEST PRIORITY VISUAL EMPHASIS
  const birthdayHeroOpacity = bell(scrollProgress, 0.52, 0.585, 0.66);
  const birthdayHeroY = range(scrollProgress, 0.52, 0.66, 20, -10);

  // 7. Emotional Centerpiece 2: "Happy Birthday." & "You even sang to me." (0.64 -> 0.75)
  const sangOpacity = bell(scrollProgress, 0.64, 0.695, 0.75);
  const sangY = range(scrollProgress, 0.64, 0.75, 18, -12);

  // 8. Comedic Interruption: "Of course... Not everything about that night was poetic." & "THE BURPING COMPETITION" (0.73 -> 0.86)
  const burpingOpacity = bell(scrollProgress, 0.73, 0.795, 0.86);
  const burpingY = range(scrollProgress, 0.73, 0.86, 18, -10);

  // 9. Return to Intimate Atmosphere: "Somewhere in that long, ridiculous conversation..." (0.84 -> 0.94)
  const intimateReturnOpacity = bell(scrollProgress, 0.84, 0.89, 0.94);
  const intimateReturnY = range(scrollProgress, 0.84, 0.94, 18, -10);

  // 10. Next Chapter Tease: "Then came the day we finally met." (0.92 -> 1.00)
  const nextChapterTeaseOpacity = range(scrollProgress, 0.92, 0.97, 0, 1);
  const nextChapterTeaseY = range(scrollProgress, 0.92, 0.97, 20, 0);

  // Subtle warm ambient aura at midnight (0.42 -> 0.75)
  const midnightWarmthAlpha = range(scrollProgress, 0.44, 0.62, 0, 0.35) * (scrollProgress > 0.74 ? range(scrollProgress, 0.74, 0.84, 1, 0) : 1);

  // Step Indicators for easy jumping and scanning
  const steps = [
    { label: '20 → 21 Nov • The First Call', target: 0.05 },
    { label: '"Supposed to be a conversation"', target: 0.15 },
    { label: '"Into the next day"', target: 0.24 },
    { label: 'The Midnight Hour', target: 0.38 },
    { label: '12:00 AM • November 21', target: 0.48 },
    { label: '"First person to wish me"', target: 0.58 },
    { label: '"You even sang to me"', target: 0.69 },
    { label: 'The Burping Competition', target: 0.79 },
    { label: '"Something became real"', target: 0.89 },
    { label: 'The Day We Finally Met', target: 0.96 },
  ];

  return (
    <section
      ref={containerRef}
      id="first-call-chapter"
      className={`relative w-full min-h-[660vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter IV: THE FIRST CALL Narrative"
    >
      {/* Dynamic Midnight Warm Glow Aura */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 245, 215, 0.08) 0%, rgba(30, 48, 80, 0.12) 50%, transparent 80%)',
          opacity: midnightWarmthAlpha,
          zIndex: Z_INDEX_TOKENS.ambientGlow + 1,
        }}
      />

      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Constellation Chapter IV Marker with Audio Indicator */}
        <header className="w-full flex items-center justify-between flex-shrink-0 z-30 pt-1 sm:pt-2">
          <div className="flex items-center gap-2">
            <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20 text-[10px] sm:text-xs">
              20 → 21 NOV 2025
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-4 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#ffafd7]/40" />
            <span className="font-mono-label text-[10px] sm:text-xs text-[#e2e2e2] tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-shadow-subtle">
              Chapter IV • The First Call
            </span>
            <div className="w-4 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#ffafd7]/40" />
          </div>

          <button
            type="button"
            onClick={audio.togglePlay}
            aria-label={audio.isPlaying ? "Pause chapter song" : "Play chapter song"}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#ffafd7]/25 bg-[#ffafd7]/[0.08] hover:bg-[#ffafd7]/[0.16] text-[10px] sm:text-xs font-mono-label text-[#ffafd7] backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${audio.isPlaying ? 'bg-[#ffafd7] animate-ping' : 'bg-[#ffafd7]/60'}`} />
            <span>{audio.isPlaying ? 'PLAYING' : 'SONG'}</span>
          </button>
        </header>

        {/* Center Stage: Sequential Memory Fragments & Climax */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 1. Chapter Entry: 20 → 21 NOVEMBER 2025 & "THE FIRST CALL" */}
          <div
            id="first-call-title-card"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-100 ease-out z-30"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              visibility: titleOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: titleOpacity > 0.35 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20">
                20 → 21 NOVEMBER 2025
              </span>
            </div>
            <h2
              id="the-first-call-hero-title"
              className="font-editorial text-[clamp(2.6rem,8.5vw,5.75rem)] font-bold text-white uppercase tracking-[0.16em] sm:tracking-[0.22em] starlight-heavy-glow leading-none select-none mb-3"
            >
              THE FIRST CALL
            </h2>
            <p className="font-editorial italic text-[clamp(1.2rem,3vw,1.85rem)] text-[#e2e2e2] font-medium tracking-wide max-w-md mx-auto text-shadow-subtle mb-4">
              One conversation became a night.
            </p>

            {/* Song Audio Controller at Beginning of Chapter 4 */}
            <ChapterAudioController
              isPlaying={audio.isPlaying}
              progress={audio.progress}
              currentTime={audio.currentTime}
              duration={audio.duration}
              onTogglePlay={audio.togglePlay}
              label="PLAY CHAPTER IV SONG"
              subtext="Midnight Orchestra • The First Call"
              className="mt-1"
            />
          </div>

          {/* 2. Fragment 1: "Our first call..." / "...was supposed to be a conversation." */}
          <div
            id="first-call-fragment-1"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: callFrag1Opacity,
              transform: `translateY(${callFrag1Y}px)`,
              visibility: callFrag1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              Late November Night
            </span>
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.5rem)] text-white font-semibold leading-snug tracking-wide text-shadow-subtle">
              Our first call...
            </p>
            <div className="w-10 h-[1px] bg-white/40 mx-auto" />
            <p className="font-editorial italic text-[clamp(1.3rem,3.2vw,2.1rem)] text-slate-100 font-medium leading-snug text-shadow-subtle">
              ...was supposed to be a conversation.
            </p>
          </div>

          {/* 3. Fragment 2: "But somehow..." / "we talked into the next day." */}
          <div
            id="first-call-fragment-2"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: callFrag2Opacity,
              transform: `translateY(${callFrag2Y}px)`,
              visibility: callFrag2Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              Hour after hour
            </span>
            <p className="font-editorial italic text-[clamp(1.85rem,4.8vw,3.2rem)] text-white font-medium leading-snug text-shadow-subtle">
              But somehow...
            </p>
            <p className="font-editorial text-[clamp(2.1rem,5.5vw,3.85rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              we talked into the next day.
            </p>
          </div>

          {/* 4. Abstract Time Motif & Clock Dial approaching midnight */}
          <div
            id="first-call-clock-stage"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: clockDialOpacity,
              transform: `translateY(${clockDialY}px)`,
              visibility: clockDialOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <MidnightClockMotif
              progress={clockProgress}
              currentTimeLabel={currentTimeLabel}
              isMidnight={clockProgress >= 0.95}
              className="mb-4"
            />
            <p className="font-editorial italic text-[clamp(1.25rem,3vw,1.8rem)] text-slate-100 font-medium tracking-wide text-shadow-subtle">
              Minutes turned into hours across the quiet night.
            </p>
          </div>

          {/* 5. Midnight Transition: "12:00 AM • November 21." / "And then it became my birthday." */}
          <div
            id="first-call-midnight-arrival"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: midnightOpacity,
              transform: `translateY(${midnightY}px)`,
              visibility: midnightOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="px-4 py-1.5 rounded-full border border-white/30 bg-white/[0.08] backdrop-blur-sm mb-1">
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-white font-semibold text-shadow-subtle">
                12:00 AM • 21 November
              </span>
            </div>
            
            <p className="font-editorial text-[clamp(2.2rem,6vw,4rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              And then it became my birthday.
            </p>

            <p className="font-body font-medium text-[clamp(1.05rem,2.4vw,1.35rem)] text-slate-100 italic text-shadow-subtle">
              One night became something I&apos;ll never forget.
            </p>
          </div>

          {/* 6. EMOTIONAL CENTERPIECE 1: "You were the first person to wish me a Happy Birthday." */}
          {/* HIGHEST VISUAL EMPHASIS */}
          <div
            id="first-call-birthday-hero"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-5 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: birthdayHeroOpacity,
              transform: `translateY(${birthdayHeroY}px)`,
              visibility: birthdayHeroOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-center gap-2 text-slate-200 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-shadow-subtle">
                The First Voice
              </span>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            </div>

            <h2
              id="first-person-wished-title"
              className="font-editorial text-[clamp(2.35rem,7vw,5rem)] font-bold text-white leading-[1.2] tracking-wide sm:tracking-wider starlight-heavy-glow"
              style={{
                textShadow: '0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(56, 189, 248, 0.45)',
              }}
            >
              You were the first person to wish me a Happy Birthday.
            </h2>

            <p className="font-editorial italic text-[clamp(1.25rem,3.2vw,2rem)] text-slate-100 font-medium tracking-wide max-w-xl mx-auto text-shadow-subtle">
              Before anyone else in the world.
            </p>
          </div>

          {/* 7. Emotional Centerpiece 2: "Happy Birthday." & "You even sang to me." + Classical Orchestra Track Architecture */}
          <div
            id="first-call-sang-moment"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30"
            style={{
              opacity: sangOpacity,
              transform: `translateY(${sangY}px)`,
              visibility: sangOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: sangOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <span className="font-body text-xs uppercase tracking-[0.3em] text-slate-200 font-semibold text-shadow-subtle">
              Midnight Melody
            </span>

            <h3 className="font-editorial italic text-[clamp(2.3rem,6.5vw,4.25rem)] text-white font-bold leading-snug tracking-wide text-shadow-subtle">
              &ldquo;Happy Birthday.&rdquo;
            </h3>

            <p className="font-editorial text-[clamp(1.5rem,4.2vw,2.75rem)] text-white font-semibold leading-snug tracking-wide starlight-heavy-glow">
              You even sang to me.
            </p>

            <p className="font-body font-medium text-[clamp(1.05rem,2.4vw,1.35rem)] text-slate-100 max-w-md mx-auto mb-2 text-shadow-subtle">
              In that moment, everything between us felt profoundly real.
            </p>

            {/* Classical Orchestra Soundtrack Controller */}
            <ChapterAudioController
              isPlaying={audio.isPlaying}
              progress={audio.progress}
              currentTime={audio.currentTime}
              duration={audio.duration}
              onTogglePlay={audio.togglePlay}
              label="PLAY MIDNIGHT SONG"
              subtext="Midnight Orchestra • The First Call"
              className="mt-2"
            />
          </div>

          {/* 8. COMEDIC INTERRUPTION: "THE BURPING COMPETITION" */}
          <div
            id="first-call-burping-competition"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30"
            style={{
              opacity: burpingOpacity,
              transform: `translateY(${burpingY}px)`,
              visibility: burpingOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: burpingOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-200/30 bg-cyan-200/[0.08]">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-200" />
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-cyan-100 font-semibold text-shadow-subtle">
                Unscripted Interlude
              </span>
            </div>

            <p className="font-editorial italic text-[clamp(1.2rem,3vw,1.75rem)] text-slate-200 font-medium text-shadow-subtle">
              Of course... not everything about that night was poetic.
            </p>

            <h3
              id="the-burping-competition-title"
              className="font-editorial text-[clamp(2.3rem,6.8vw,4.5rem)] font-bold text-white uppercase tracking-[0.14em] leading-tight starlight-heavy-glow"
            >
              THE BURPING COMPETITION
            </h3>

            <div className="flex items-center justify-center gap-3 text-white">
              <span className="font-editorial text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold text-shadow-subtle">
                I won.
              </span>
              <span className="text-white/60">•</span>
              <span className="font-editorial italic text-[clamp(1.5rem,4vw,2.4rem)] text-cyan-100 font-semibold text-shadow-subtle">
                Obviously.
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-body font-medium text-xs sm:text-sm text-slate-100 tracking-wide text-shadow-subtle">
                This remains an objective historical fact.
              </p>
              <p className="font-body font-medium text-[11px] sm:text-xs text-slate-300 italic text-shadow-subtle">
                (Her legal team has formally disputed the result.)
              </p>
            </div>

            {/* Playful Interactive Review Evidence Button */}
            <div className="pt-2">
              <button
                type="button"
                id="review-burp-evidence-button"
                onClick={() => setIsTribunalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.1] active:scale-95 transition-all text-xs font-body uppercase tracking-[0.2em] text-white/90 hover:text-white cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.08)]"
              >
                <Award className="w-3.5 h-3.5 text-amber-200" />
                <span>Review The Evidence</span>
              </button>
            </div>
          </div>

          {/* 9. RETURN TO INTIMATE ATMOSPHERE */}
          <div
            id="first-call-intimate-return"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: intimateReturnOpacity,
              transform: `translateY(${intimateReturnY}px)`,
              visibility: intimateReturnOpacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.45rem,3.8vw,2.4rem)] text-white font-medium leading-snug text-shadow-subtle">
              Somewhere in that long, ridiculous conversation...
            </p>
            <div className="w-12 h-[1px] bg-white/40 mx-auto" />
            <p className="font-editorial text-[clamp(1.9rem,5vw,3.5rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              something between us started becoming real.
            </p>
          </div>

          {/* 10. NEXT CHAPTER TEASE: "Then came the day we finally met." */}
          <div
            id="first-call-next-chapter-tease"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-150 ease-out z-30"
            style={{
              opacity: nextChapterTeaseOpacity,
              transform: `translateY(${nextChapterTeaseY}px)`,
              visibility: nextChapterTeaseOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: nextChapterTeaseOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
              <span className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
                The Story Continues
              </span>
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <h3
              id="then-came-the-day-we-met-title"
              className="font-editorial text-[clamp(2.1rem,5.8vw,4rem)] font-bold text-white leading-snug tracking-wide max-w-xl mb-4 starlight-heavy-glow"
            >
              Then came the day we finally met.
            </h3>

            <p className="font-body font-medium text-[clamp(1.05rem,2.4vw,1.35rem)] text-slate-100 leading-relaxed max-w-md mx-auto mb-6 text-shadow-subtle">
              When voices across midnight became eyes in the real world.
            </p>

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-40 h-40 rounded-full bg-[radial-gradient(circle,_rgba(220,240,255,0.14)_0%,_transparent_70%)] blur-xl pointer-events-none"
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
                  key={`first-call-step-${idx}`}
                  onClick={() => scrollToStep(step.target)}
                  aria-label={step.label}
                  className={`transition-all duration-300 rounded-full flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/70'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-slate-300 uppercase tracking-[0.2em] font-medium text-shadow-subtle">
            <span>{scrollProgress > 0.9 ? 'Chapter IV Complete' : 'Scroll gently through midnight'}</span>
          </div>
        </footer>

      </div>

      {/* Comedic Interruption Tribunal Modal */}
      <BurpingTribunalModal
        isOpen={isTribunalOpen}
        onClose={() => setIsTribunalOpen(false)}
      />
    </section>
  );
};
