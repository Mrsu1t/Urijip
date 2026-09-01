import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SecondPhaseChapterProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { FINAL_VIDEO_URL, SPOTIFY_PLAYLIST_URL } from '../config';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles } from 'lucide-react';

export const SecondPhaseChapter: React.FC<SecondPhaseChapterProps> = ({
  onProgressChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
   * Smooth interpolation math
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
  // Deep Midnight Sky & Starlight -> Video Spotlight -> Warm Rose / Warm Cream / Soft White Starlight
  // -------------------------------------------------------------

  // Deep Midnight Sky background (Dominant at start: 0.0 -> 0.35)
  const midnightAlpha =
    scrollProgress < 0.4
      ? range(scrollProgress, 0.0, 0.2, 0.95, 0.85)
      : range(scrollProgress, 0.4, 0.65, 0.85, 0.15);

  // Aurora & Emerald/Teal Glow (Expands after video: 0.55 -> 1.0)
  const auroraGlowAlpha =
    scrollProgress < 0.5
      ? 0.05
      : range(scrollProgress, 0.5, 0.78, 0.05, 0.6);

  // Warm Cream Hearth Center Glow (Dominant at final URIJIP & Spotify stage: 0.68 -> 1.0)
  const warmCreamAlpha =
    scrollProgress < 0.65
      ? 0
      : range(scrollProgress, 0.65, 0.9, 0, 0.5);

  // Starlight Luminosity (Always gently present, warmly illuminating the end)
  const starlightLuminosity = range(scrollProgress, 0.0, 1.0, 0.65, 0.85);

  // -------------------------------------------------------------
  // STAGE CHOREOGRAPHY & OPACITIES
  // -------------------------------------------------------------

  // Stage 0: Quiet Opening — "This isn't the end..." (0.00 -> 0.15)
  const stage0Opacity = scrollProgress <= 0.02 ? 1 : bell(scrollProgress, 0.0, 0.06, 0.15);
  const stage0Y = range(scrollProgress, 0.0, 0.15, 0, -16);

  // Stage 1: Phase One Reflection — "Everything you've seen so far..." (0.13 -> 0.28)
  const stage1Opacity = bell(scrollProgress, 0.13, 0.20, 0.28);
  const stage1Y = range(scrollProgress, 0.13, 0.28, 16, -14);

  // Stage 2: Portal Primary CTA — "CLICK TO ENTER THE SECOND PHASE OF THIS ADVENTURE" (0.26 -> 0.42)
  const stage2Opacity = bell(scrollProgress, 0.26, 0.34, 0.42);
  const stage2Y = range(scrollProgress, 0.26, 0.42, 16, -14);

  // Stage 3: Dedicated Cinematic Video Experience (0.40 -> 0.62)
  const stage3Opacity = bell(scrollProgress, 0.40, 0.51, 0.62);
  const stage3Y = range(scrollProgress, 0.40, 0.62, 16, -14);

  // Stage 4: The Final URIJIP Message — "Urijip exists because you made THIS OUR HOME." (0.60 -> 0.76)
  const stage4Opacity = bell(scrollProgress, 0.60, 0.68, 0.76);
  const stage4Y = range(scrollProgress, 0.60, 0.76, 16, -14);

  // Stage 5: Phase Two Teaser — "Phase Two is waiting..." (0.74 -> 0.88)
  const stage5Opacity = bell(scrollProgress, 0.74, 0.81, 0.88);
  const stage5Y = range(scrollProgress, 0.74, 0.88, 16, -14);

  // Stage 6: Final Spotify CTA & Eternal Warm Home (0.86 -> 1.00)
  const stage6Opacity = range(scrollProgress, 0.86, 0.94, 0, 1);
  const stage6Y = range(scrollProgress, 0.86, 0.94, 16, 0);

  // Timeline Step Navigation
  const steps = [
    { label: 'This Isn’t The End', target: 0.06 },
    { label: 'The First Phase', target: 0.20 },
    { label: 'Enter Second Phase', target: 0.34 },
    { label: 'Personal Video', target: 0.51 },
    { label: 'Urijip Our Home', target: 0.68 },
    { label: 'Phase Two Waiting', target: 0.81 },
    { label: 'Enter Phase Two', target: 0.95 },
  ];

  // Video player controls
  const handleTogglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoProgress(videoRef.current.currentTime / videoRef.current.duration);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSpotifyClick = () => {
    if (SPOTIFY_PLAYLIST_URL && SPOTIFY_PLAYLIST_URL.trim().length > 0) {
      window.open(SPOTIFY_PLAYLIST_URL, '_blank', 'noopener,noreferrer');
    } else {
      setToastMessage('Spotify playlist link is being prepared for Phase Two.');
      setTimeout(() => setToastMessage(null), 3800);
    }
  };

  return (
    <section
      ref={containerRef}
      id="chapter-second-phase"
      className={`relative w-full min-h-[660vh] select-none ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="Phase 12: The Second Phase of the Adventure"
    >
      {/* Sticky Cinematic Viewport Canvas */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-5 sm:py-7">

        {/* ------------------------------------------------------------- */}
        {/* ATMOSPHERIC BACKGROUND LAYERS */}
        {/* ------------------------------------------------------------- */}

        {/* Layer A: Midnight & Deep Space Starlight Base */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: midnightAlpha,
            background:
              'radial-gradient(ellipse 95% 85% at 50% 50%, #060912 0%, #04060A 60%, #000002 100%)',
          }}
        />

        {/* Layer B: Aurora Emerald & Cyan Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: auroraGlowAlpha,
            background:
              'radial-gradient(ellipse 90% 80% at 50% 45%, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 80%)',
          }}
        />

        {/* Layer C: Warm Cream Hearth Center Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[960px] h-[70vh] rounded-full pointer-events-none blur-[90px] transition-opacity duration-700 ease-out"
          style={{
            opacity: warmCreamAlpha,
            background:
              'radial-gradient(circle, rgba(250, 245, 235, 0.15) 0%, rgba(186, 230, 253, 0.08) 50%, transparent 80%)',
          }}
        />

        {/* Layer D: Faint Everlasting Constellation Starlight ("The starlight remained. She became home.") */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: starlightLuminosity }}
        >
          <div className="absolute top-[16%] left-[14%] w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
          <div className="absolute top-[26%] right-[19%] w-1 h-1 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          <div className="absolute bottom-[28%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="absolute top-[68%] right-[16%] w-1.5 h-1.5 rounded-full bg-cyan-100/70 shadow-[0_0_8px_rgba(200,245,255,0.8)] animate-pulse" />
          <div className="absolute top-[42%] left-[9%] w-1 h-1 rounded-full bg-white/45" />
          <div className="absolute bottom-[18%] right-[28%] w-1 h-1 rounded-full bg-white/55" />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HEADER: CHAPTER METADATA */}
        {/* ------------------------------------------------------------- */}
        <header className="w-full flex items-center justify-between z-30 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 border border-white/15 text-slate-200 text-[10px] sm:text-xs font-editorial">
              XII
            </span>
            <div className="flex flex-col">
              <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-slate-300 font-medium">
                Phase Twelve
              </span>
              <span className="font-editorial text-xs sm:text-sm text-slate-200 italic tracking-wider">
                The Second Phase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-cyan-200/80" />
            <span className="font-body text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-300">
              The Journey
            </span>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* MAIN CINEMATIC STAGES */}
        {/* ------------------------------------------------------------- */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex items-center justify-center z-20 my-auto px-2">

          {/* ========================================================= */}
          {/* STAGE 0: FINAL OPENING — "This isn't the end." */}
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
            <div className="space-y-5 sm:space-y-7 max-w-2xl mx-auto">
              <h2 className="font-editorial text-[clamp(2.2rem,6vw,4.5rem)] font-light text-white leading-tight starlight-heavy-glow">
                This isn&apos;t the end.
              </h2>

              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.4rem,3.6vw,2.4rem)] font-light text-slate-100 leading-relaxed max-w-xl mx-auto">
                I&apos;ve only shown you what I could put into words.
              </p>

              <p className="font-body text-[clamp(0.95rem,2.1vw,1.25rem)] font-normal text-slate-300 max-w-lg mx-auto leading-relaxed pt-1">
                But there are still things I want you to experience.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 1: PHASE ONE MESSAGE — "Everything you've seen so far..." */}
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
              <p className="font-editorial text-[clamp(1.75rem,4.5vw,3.2rem)] font-light leading-relaxed text-slate-100">
                Everything you&apos;ve seen so far...
              </p>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.9rem,5.2vw,3.6rem)] font-normal leading-relaxed text-white starlight-text-glow">
                ...was only the first phase.
              </p>

              <p className="font-body text-[clamp(0.9rem,2vw,1.15rem)] font-normal text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
                There is still more of us waiting.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 2: PRIMARY PORTAL CTA */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 px-4 ${
              stage2Opacity > 0.01 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage2Opacity,
              transform: `translateY(${stage2Y}px)`,
            }}
          >
            <div className="space-y-6 max-w-2xl mx-auto flex flex-col items-center">
              <p className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-300 font-medium">
                The Portal Awaits
              </p>

              <button
                id="cta-enter-second-phase-adventure"
                onClick={() => scrollToStep(0.51)}
                className="group relative inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 rounded-full border border-cyan-200/40 bg-gradient-to-r from-slate-900/60 via-indigo-950/40 to-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:shadow-[0_0_45px_rgba(56,189,248,0.4)] hover:border-cyan-200/70 transition-all duration-500 cursor-pointer max-w-[90vw]"
                aria-label="Click to enter the second phase of this adventure"
              >
                {/* Luminous Edge */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/10 via-white/20 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="font-editorial text-sm sm:text-lg md:text-xl uppercase tracking-[0.14em] text-white font-medium group-hover:text-cyan-100 transition-colors text-center leading-snug">
                  CLICK TO ENTER THE SECOND PHASE OF THIS ADVENTURE
                </span>
              </button>

              <p className="font-body text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/40 pt-2">
                Scroll down or tap to proceed
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 3: DEDICATED CINEMATIC VIDEO EXPERIENCE */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 px-2 sm:px-4 ${
              stage3Opacity > 0.01 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage3Opacity,
              transform: `translateY(${stage3Y}px)`,
            }}
          >
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Video Player Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-b from-[#0e1220] to-[#04060a] shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center group">

                {/* If a real video file is specified in config */}
                {FINAL_VIDEO_URL && FINAL_VIDEO_URL.trim().length > 0 ? (
                  <>
                    <video
                      ref={videoRef}
                      src={FINAL_VIDEO_URL}
                      className="w-full h-full object-cover"
                      playsInline
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                    />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <button
                          onClick={handleFullscreen}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {/* Progress bar */}
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-300"
                            style={{ width: `${videoProgress * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleTogglePlay}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                              aria-label={isPlaying ? 'Pause video' : 'Play video'}
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </button>
                            <button
                              onClick={handleToggleMute}
                              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                              aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Dedicated Isolated Video Placeholder (Clean, minimal, celestial night sky) */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {/* Atmospheric Backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1)_0%,_rgba(10,17,40,0.85)_75%)] pointer-events-none" />

                    {/* Centralized Play Motif */}
                    <button
                      onClick={handleTogglePlay}
                      className="group/btn relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer z-10"
                      aria-label="Play dedicated video experience"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1 group-hover/btn:scale-110 transition-transform" />
                    </button>

                    <div className="relative z-10 mt-5 space-y-1 max-w-md">
                      <p className="font-editorial text-lg sm:text-xl font-light text-white tracking-wide starlight-text-glow">
                        This is something I made specifically for you.
                      </p>
                      <p className="font-body text-[11px] sm:text-xs text-slate-300 uppercase tracking-[0.2em]">
                        Cinematic Video Experience
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seamless Continue Action */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => scrollToStep(0.68)}
                  className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-body tracking-wider transition-colors cursor-pointer"
                >
                  Continue to Home →
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 4: THE FINAL URIJIP MESSAGE */}
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
            <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">
              <h2
                id="final-urijip-title"
                className="font-editorial text-[clamp(2.5rem,7.5vw,5.5rem)] font-bold text-white leading-none tracking-wide starlight-heavy-glow"
                style={{
                  textShadow:
                    '0 0 45px rgba(255, 255, 255, 0.95), 0 0 90px rgba(186, 230, 253, 0.65), 0 0 130px rgba(56, 189, 248, 0.4)',
                }}
              >
                URIJIP
              </h2>

              <p className="font-editorial text-[clamp(1.5rem,4.2vw,2.85rem)] font-light text-slate-100 leading-relaxed max-w-xl mx-auto">
                Urijip exists because you made{' '}
                <span className="font-semibold text-white tracking-wide underline decoration-cyan-300/40 decoration-1 underline-offset-8">
                  this our home
                </span>
                .
              </p>

              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />

              <p className="font-editorial italic text-[clamp(1.35rem,3.5vw,2.3rem)] font-normal text-white/95 leading-relaxed starlight-text-glow">
                And I&apos;d choose home with you again.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 5: PHASE TWO TEASER */}
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
            <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto text-slate-100">
              <h3 className="font-editorial text-[clamp(1.8rem,4.8vw,3.2rem)] font-light text-white leading-tight starlight-heavy-glow">
                Phase Two is waiting.
              </h3>

              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent mx-auto" />

              <p className="font-editorial text-[clamp(1.3rem,3.2vw,2.1rem)] font-light leading-relaxed text-slate-200">
                Every song carries something.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-md mx-auto pt-2 font-editorial italic text-[clamp(1.15rem,2.8vw,1.75rem)] text-white/90">
                <span>A feeling.</span>
                <span className="text-cyan-300/40">•</span>
                <span>A memory.</span>
                <span className="text-cyan-300/40">•</span>
                <span>A message.</span>
                <span className="text-cyan-300/40">•</span>
                <span className="text-slate-200">A little piece of us.</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STAGE 6: FINAL SPOTIFY CTA & DOORWAY */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 px-4 ${
              stage6Opacity > 0.01 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              opacity: stage6Opacity,
              transform: `translateY(${stage6Y}px)`,
            }}
          >
            <div className="space-y-6 max-w-xl mx-auto flex flex-col items-center">
              <div className="space-y-2">
                <p className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-300 font-medium">
                  The Playlist Awaits
                </p>
                <h3 className="font-editorial text-[clamp(2rem,5.5vw,3.8rem)] font-light text-white leading-tight starlight-heavy-glow">
                  The Music of Us
                </h3>
              </div>

              {/* Spotify Playlist Portal Button */}
              <button
                id="cta-enter-phase-two-spotify"
                onClick={handleSpotifyClick}
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full border border-cyan-200/40 bg-gradient-to-r from-slate-900/60 via-indigo-950/40 to-slate-900/60 backdrop-blur-xl shadow-[0_0_35px_rgba(56,189,248,0.25)] hover:shadow-[0_0_55px_rgba(56,189,248,0.45)] hover:border-cyan-200/70 transition-all duration-500 cursor-pointer"
                aria-label="Enter Phase Two Spotify playlist"
              >
                {/* Luminous Edge */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/15 via-white/20 to-cyan-300/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="font-editorial text-lg sm:text-2xl uppercase tracking-[0.18em] text-white font-medium group-hover:text-cyan-100 transition-colors">
                  ENTER PHASE TWO →
                </span>
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Everlasting Starlight Callback */}
              <div className="pt-4 space-y-2">
                <p className="font-editorial italic text-sm sm:text-base text-slate-300 tracking-wide">
                  The starlight remained. She became home.
                </p>
                <div className="w-8 h-[1px] bg-white/20 mx-auto" />
                <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/30">
                  Urijip • Phase One Complete
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* FOOTER: NARRATIVE TIMELINE & SCROLL HELPER */}
        {/* ------------------------------------------------------------- */}
        <footer className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-2">
          {/* Micro-Step Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 max-w-[90vw] overflow-x-auto py-1">
            {steps.map((step, idx) => {
              const isActive = Math.abs(scrollProgress - step.target) < 0.05;
              return (
                <button
                  key={`p12-step-${idx}`}
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
            <span>
              {scrollProgress > 0.9
                ? 'Phase Two Doorway Open'
                : 'Scroll to enter the second phase'}
            </span>
          </div>
        </footer>

      </div>

      {/* Floating Graceful Toast for Missing Spotify URL during preview */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full border border-white/20 bg-black/85 backdrop-blur-xl text-slate-200 text-xs sm:text-sm font-body tracking-wider shadow-2xl z-50 pointer-events-none"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
