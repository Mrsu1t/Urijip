import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { VoiceSoundWave } from './VoiceSoundWave';
import { ChapterAudioController } from './ChapterAudioController';
import { useChapterAudio } from '../hooks/useChapterAudio';
import { TheVoiceChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';

/**
 * VOICE NOTE INTEGRATION POINT
 * Real audio file URL for The Voice chapter (11 November 2025).
 */
export const VOICE_NOTE_AUDIO_SRC = 'https://www.image2url.com/r2/default/audio/1788283760310-6fbad665-7ecc-4489-92cb-c3b6d394345f.ogg';

export const TheVoiceChapter: React.FC<TheVoiceChapterProps> = ({
  onProgressChange,
  className = '',
  voiceNoteSrc = VOICE_NOTE_AUDIO_SRC,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dedicated isolated chapter audio controller hook
  const audio = useChapterAudio({
    src: voiceNoteSrc,
    simulatedDurationSeconds: 14,
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

  // Pause audio automatically if user leaves Chapter 3 entirely
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

  // 1. Chapter Title: "THE VOICE" & "11 NOVEMBER 2025" (0.00 -> 0.13)
  const titleOpacity = scrollProgress <= 0.04 ? 1 : bell(scrollProgress, 0.0, 0.06, 0.13);
  const titleY = range(scrollProgress, 0.0, 0.13, 0, -16);

  // 2. Fragment 1: "A TikTok Live." (0.11 -> 0.22)
  const frag1Opacity = bell(scrollProgress, 0.11, 0.165, 0.22);
  const frag1Y = range(scrollProgress, 0.11, 0.22, 18, -12);

  // 3. Fragment 2: "Then I heard your voice." (0.20 -> 0.31)
  const frag2Opacity = bell(scrollProgress, 0.20, 0.255, 0.31);
  const frag2Y = range(scrollProgress, 0.20, 0.31, 18, -12);

  // 4. Fragment 3 & 4: "I complimented it." / "I followed you." (0.29 -> 0.41)
  const frag3Opacity = bell(scrollProgress, 0.29, 0.35, 0.41);
  const frag3Y = range(scrollProgress, 0.29, 0.41, 18, -12);

  // 5. Fragment 5 & 6: "And somehow..." / "TikTok became Snapchat." (0.39 -> 0.51)
  const frag4Opacity = bell(scrollProgress, 0.39, 0.45, 0.51);
  const frag4Y = range(scrollProgress, 0.39, 0.51, 18, -12);

  // 6. Fragment 7 & 8: "Snapchat became WhatsApp." & "Apparently, neither of us knew how to end a conversation." (0.49 -> 0.61)
  const frag5Opacity = bell(scrollProgress, 0.49, 0.55, 0.61);
  const frag5Y = range(scrollProgress, 0.49, 0.61, 18, -12);

  // 7. Fragment 9 & 10: "And eventually..." / "WhatsApp became real life." (0.59 -> 0.71)
  const frag6Opacity = bell(scrollProgress, 0.59, 0.65, 0.71);
  const frag6Y = range(scrollProgress, 0.59, 0.71, 18, -12);

  // 8. Climax Line 1: "Before I knew your face," (0.69 -> 0.81)
  const climax1Opacity = bell(scrollProgress, 0.69, 0.74, 0.81);
  const climax1Y = range(scrollProgress, 0.69, 0.81, 18, -10);

  // 9. Climax Line 2: "I knew your voice." (0.76 -> 0.90) - Major Reveal
  const climax2Opacity = range(scrollProgress, 0.76, 0.83, 0, 1) * (scrollProgress > 0.89 ? range(scrollProgress, 0.89, 0.94, 1, 0) : 1);
  const climax2Y = range(scrollProgress, 0.76, 0.83, 22, 0);

  // 10. Sound Wave visual intensity (Active especially during voice moments and audio playback)
  const soundWaveIntensity = audio.isPlaying
    ? 1.0
    : frag2Opacity > 0.05
    ? frag2Opacity * 0.9
    : climax2Opacity > 0.05
    ? climax2Opacity * 1.0
    : frag3Opacity > 0.05
    ? frag3Opacity * 0.6
    : 0.25;

  // 11. First Call Bridge: "20 → 21 NOVEMBER 2025" (0.88 -> 1.00)
  const bridgeOpacity = range(scrollProgress, 0.88, 0.95, 0, 1);
  const bridgeY = range(scrollProgress, 0.88, 0.95, 20, 0);

  // Step Indicators for easy jumping and scanning
  const steps = [
    { label: 'The Beginning • 11 Nov 2025', target: 0.05 },
    { label: '"A TikTok Live"', target: 0.16 },
    { label: '"Then I heard your voice"', target: 0.25 },
    { label: '"I complimented it"', target: 0.35 },
    { label: 'TikTok → Snapchat', target: 0.45 },
    { label: 'Snapchat → WhatsApp', target: 0.55 },
    { label: 'WhatsApp → Real Life', target: 0.65 },
    { label: '"Before I knew your face..."', target: 0.74 },
    { label: '"I knew your voice."', target: 0.84 },
    { label: 'First Call Setup • 20-21 Nov', target: 0.96 },
  ];

  return (
    <section
      ref={containerRef}
      id="the-voice-chapter"
      className={`relative w-full min-h-[620vh] bg-transparent ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Chapter III: THE VOICE Narrative"
    >
      {/* Sticky Viewport Stage (100svh) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-5 sm:py-8 overflow-hidden select-none">
        
        {/* Top Header / Constellation Chapter Marker with Audio Indicator */}
        <header className="w-full flex items-center justify-between flex-shrink-0 z-30 pt-1 sm:pt-2">
          <div className="flex items-center gap-2">
            <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20 text-[10px] sm:text-xs">
              11 NOV 2025
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-4 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#ffafd7]/40" />
            <span className="font-mono-label text-[10px] sm:text-xs text-[#e2e2e2] tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-shadow-subtle">
              Chapter III • The Beginning
            </span>
            <div className="w-4 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#ffafd7]/40" />
          </div>

          <button
            type="button"
            onClick={audio.togglePlay}
            aria-label={audio.isPlaying ? "Pause voice note" : "Play voice note"}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#ffafd7]/25 bg-[#ffafd7]/[0.08] hover:bg-[#ffafd7]/[0.16] text-[10px] sm:text-xs font-mono-label text-[#ffafd7] backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${audio.isPlaying ? 'bg-[#ffafd7] animate-ping' : 'bg-[#ffafd7]/60'}`} />
            <span>{audio.isPlaying ? 'PLAYING' : 'VOICE NOTE'}</span>
          </button>
        </header>

        {/* Center Stage: Sequential Memory Fragments & Climax */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[380px]">

          {/* 1. Chapter Title & Starting Date (11 NOVEMBER 2025) */}
          <div
            id="voice-chapter-title-card"
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
                11 NOVEMBER 2025
              </span>
            </div>
            <h2
              id="the-voice-hero-title"
              className="font-editorial text-[clamp(2.6rem,8.5vw,5.75rem)] font-bold text-white uppercase tracking-[0.16em] sm:tracking-[0.22em] starlight-heavy-glow leading-none select-none mb-3"
            >
              THE VOICE
            </h2>
            <p className="font-editorial italic text-[clamp(1.2rem,3vw,1.85rem)] text-[#e2e2e2] font-medium tracking-wide max-w-md mx-auto text-shadow-subtle mb-4">
              Traveling back to the night everything began.
            </p>

            {/* Voice Note Audio Controller at the Beginning of Chapter 3 */}
            <ChapterAudioController
              isPlaying={audio.isPlaying}
              progress={audio.progress}
              currentTime={audio.currentTime}
              duration={audio.duration}
              onTogglePlay={audio.togglePlay}
              label="LISTEN TO HER VOICE"
              subtext="11 Nov 2025 • The Night Everything Began"
              className="mt-1"
            />
          </div>

          {/* 2. Fragment 1: "A TikTok Live." */}
          <div
            id="voice-fragment-1"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag1Opacity,
              transform: `translateY(${frag1Y}px)`,
              visibility: frag1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.85rem,4.8vw,3.2rem)] text-white font-medium leading-snug tracking-wide text-shadow-subtle">
              A TikTok Live.
            </p>
          </div>

          {/* 3. Fragment 2: "Then I heard your voice." with Ethereal Sound Wave */}
          <div
            id="voice-fragment-2"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag2Opacity,
              transform: `translateY(${frag2Y}px)`,
              visibility: frag2Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <VoiceSoundWave intensity={soundWaveIntensity} isPlaying={audio.isPlaying} className="mb-2" />
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.5rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              Then I heard your voice.
            </p>
          </div>

          {/* 4. Fragment 3: "I complimented it." / "I followed you." */}
          <div
            id="voice-fragment-3"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag3Opacity,
              transform: `translateY(${frag3Y}px)`,
              visibility: frag3Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.75rem,4.5vw,3rem)] text-white font-medium leading-snug text-shadow-subtle">
              I complimented it.
            </p>
            <div className="w-12 h-[1px] bg-white/40 mx-auto" />
            <p className="font-body font-medium text-[clamp(1.15rem,2.7vw,1.7rem)] text-slate-100 tracking-wide text-shadow-subtle">
              I told you how much I loved it, and I followed you first.
            </p>
          </div>

          {/* 5. Fragment 4: "And somehow..." / "TikTok became Snapchat." */}
          <div
            id="voice-fragment-4"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag4Opacity,
              transform: `translateY(${frag4Y}px)`,
              visibility: frag4Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              And somehow...
            </span>
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.5rem)] text-white font-semibold leading-snug tracking-wide text-shadow-subtle">
              TikTok became Snapchat.
            </p>
          </div>

          {/* 6. Fragment 5: "Snapchat became WhatsApp." + Playful comedy line */}
          <div
            id="voice-fragment-5"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag5Opacity,
              transform: `translateY(${frag5Y}px)`,
              visibility: frag5Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial text-[clamp(2rem,5.2vw,3.5rem)] text-white font-semibold leading-snug tracking-wide text-shadow-subtle">
              Snapchat became WhatsApp.
            </p>
            <p className="font-body font-medium text-[clamp(1.05rem,2.4vw,1.45rem)] text-slate-100 italic max-w-lg mx-auto text-shadow-subtle">
              Apparently, neither of us knew how to end a conversation.
            </p>
          </div>

          {/* 7. Fragment 6: "And eventually..." / "WhatsApp became real life." */}
          <div
            id="voice-fragment-6"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center space-y-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: frag6Opacity,
              transform: `translateY(${frag6Y}px)`,
              visibility: frag6Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <span className="font-editorial italic text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold text-shadow-subtle">
              And eventually...
            </span>
            <p className="font-editorial text-[clamp(2.1rem,5.5vw,3.85rem)] text-white font-bold leading-snug tracking-wide starlight-heavy-glow">
              WhatsApp became real life.
            </p>
          </div>

          {/* 8. Climax Line 1: "Before I knew your face," */}
          <div
            id="voice-climax-line-1"
            className="absolute text-center max-w-2xl px-4 transition-all duration-100 ease-out z-30 pointer-events-none"
            style={{
              opacity: climax1Opacity,
              transform: `translateY(${climax1Y}px)`,
              visibility: climax1Opacity > 0.005 ? 'visible' : 'hidden',
            }}
          >
            <p className="font-editorial italic text-[clamp(1.85rem,4.8vw,3.2rem)] text-white font-medium leading-snug tracking-wide text-shadow-subtle">
              Before I knew your face,
            </p>
          </div>

          {/* 9. Climax Line 2: "I knew your voice." (Grand Emotional Reveal + Audio Interaction) */}
          <div
            id="voice-climax-line-2"
            className="absolute text-center max-w-3xl px-4 flex flex-col items-center justify-center transition-all duration-100 ease-out z-30"
            style={{
              opacity: climax2Opacity,
              transform: `translateY(${climax2Y}px)`,
              visibility: climax2Opacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: climax2Opacity > 0.45 ? 'auto' : 'none',
            }}
          >
            <VoiceSoundWave intensity={soundWaveIntensity} isPlaying={audio.isPlaying} className="mb-1 sm:mb-2" isFocused />
            
            <h2
              id="i-knew-your-voice-title"
              className="font-editorial text-[clamp(2.3rem,6.8vw,4.85rem)] font-bold text-white uppercase tracking-[0.14em] sm:tracking-[0.2em] starlight-heavy-glow leading-tight select-none mb-2 sm:mb-3"
            >
              I knew your voice.
            </h2>

            <p className="font-body font-medium text-[clamp(1.05rem,2.3vw,1.4rem)] text-slate-100 tracking-wide max-w-xl mx-auto leading-relaxed mb-5 sm:mb-6 text-shadow-subtle">
              Your voice was the first part of you that found me.
            </p>

            {/* Elegant Circular Audio Play/Pause Interaction */}
            <ChapterAudioController
              isPlaying={audio.isPlaying}
              progress={audio.progress}
              currentTime={audio.currentTime}
              duration={audio.duration}
              onTogglePlay={audio.togglePlay}
              label="LISTEN"
              subtext="There's something I'd like you to hear."
              className="mt-1 sm:mt-2"
            />
          </div>

          {/* 10. Bridge to Next Chapter: 20 → 21 NOVEMBER 2025 */}
          <div
            id="first-call-setup-bridge"
            className="absolute text-center max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-150 ease-out z-30"
            style={{
              opacity: bridgeOpacity,
              transform: `translateY(${bridgeY}px)`,
              visibility: bridgeOpacity > 0.005 ? 'visible' : 'hidden',
              pointerEvents: bridgeOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#ffafd7]/40" />
              <span className="glass-chip text-[#ffafd7] border-[#ffafd7]/20">
                20 → 21 NOVEMBER 2025
              </span>
              <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#ffafd7]/40" />
            </div>

            <h3 className="font-editorial text-[clamp(1.85rem,4.8vw,3.2rem)] font-medium text-white leading-snug tracking-wide max-w-xl mb-4 text-shadow-subtle">
              When one conversation wasn&apos;t enough...
            </h3>

            <p className="font-body font-medium text-[clamp(1.05rem,2.4vw,1.35rem)] text-[#e2e2e2] leading-relaxed max-w-md mx-auto mb-6 text-shadow-subtle">
              and the two of us talked straight into the next day.
            </p>

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-36 h-36 rounded-full bg-[radial-gradient(circle,_rgba(212,108,166,0.15)_0%,_transparent_70%)] blur-xl pointer-events-none"
            />
          </div>

        </div>

        {/* Bottom Narrative Timeline & Scroll Helper */}
        <footer className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-2">
          {/* Interactive Micro-Step Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 max-w-[90vw] overflow-x-auto py-1">
            {steps.map((step, idx) => {
              const isActive = Math.abs(scrollProgress - step.target) < 0.06;
              return (
                <button
                  key={`voice-step-${idx}`}
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
            <span>{scrollProgress > 0.9 ? 'The story continues' : 'Scroll gently through memory'}</span>
          </div>
        </footer>

      </div>
    </section>
  );
};
