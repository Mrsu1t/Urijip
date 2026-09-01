/**
 * URIJIP - Cinematic Birthday & Love Story Experience
 * PHASE 1: Visual Foundation, Star Field & Opening Experience
 * PHASE 2: STARLIGHT Chapter — The Eyes & The Light Within
 * PHASE 3: THE VOICE Chapter — 11 November 2025 & The Memory of Sound
 * PHASE 4: THE FIRST CALL Chapter — 20 → 21 November 2025 & The Midnight Birthday
 * PHASE 5: THE DAY WE FINALLY MET — 18 February 2026 & The Question
 * PHASE 6: URIJIP — Our Home (Identity & Sacred Sanctuary)
 * PHASE 7: THINGS I NOTICE ABOUT YOU — Observational Love & The Little Things
 * PHASE 8: THE SAFE PLACE — Sanctuary & The Sacred Vow
 */

import React, { useState, useEffect, useRef } from 'react';
import { StarField } from './components/StarField';
import { AmbientBackground } from './components/AmbientBackground';
import { OpeningExperience } from './components/OpeningExperience';
import { StarlightChapter } from './components/StarlightChapter';
import { TheVoiceChapter } from './components/TheVoiceChapter';
import { ChapterTransitionGateway } from './components/ChapterTransitionGateway';
import { FirstCallChapter } from './components/FirstCallChapter';
import { FirstMeetingChapter } from './components/FirstMeetingChapter';
import { UrijipChapter } from './components/UrijipChapter';
import { ThingsINoticeChapter } from './components/ThingsINoticeChapter';
import { SafePlaceChapter } from './components/SafePlaceChapter';
import { BirthdayChapter } from './components/BirthdayChapter';
import { SecondPhaseChapter } from './components/SecondPhaseChapter';
import { ShootingStarSpawner } from './components/ShootingStarSpawner';
import { ConstellationEasterEgg } from './components/ConstellationEasterEgg';
import { HiddenMoon } from './components/HiddenMoon';
import { MoonUniverseExperience } from './components/MoonUniverseExperience';
import { TransitionInfrastructure } from './components/TransitionInfrastructure';
import { BackgroundAudioController } from './components/BackgroundAudioController';
import { AudioProvider } from './context/AudioContext';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phaseTwoProgress, setPhaseTwoProgress] = useState(0);
  const [phaseThreeProgress, setPhaseThreeProgress] = useState(0);
  const [phaseFourProgress, setPhaseFourProgress] = useState(0);
  const [phaseFiveProgress, setPhaseFiveProgress] = useState(0);
  const [phaseSixProgress, setPhaseSixProgress] = useState(0);
  const [phaseSevenProgress, setPhaseSevenProgress] = useState(0);
  const [phaseEightProgress, setPhaseEightProgress] = useState(0);
  const [phaseElevenProgress, setPhaseElevenProgress] = useState(0);
  const [phaseTwelveProgress, setPhaseTwelveProgress] = useState(0);
  
  // Phase 9 Easter Egg Lifecycle State: 'idle' | 'star_caught' | 'transitioning' | 'constellation_world'
  const [easterEggState, setEasterEggState] = useState<'idle' | 'star_caught' | 'transitioning' | 'constellation_world'>('idle');

  // Phase 10 Moon Universe Lifecycle State: 'idle' | 'approaching' | 'transitioning' | 'universe_world'
  const [moonEasterEggState, setMoonEasterEggState] = useState<'idle' | 'approaching' | 'transitioning' | 'universe_world'>('idle');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToNext = () => {
    const targetY = window.innerHeight * 0.95;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // Dynamic star density calculations across phases:
  // In Phase 2: As photograph reveals (0.4 -> 0.8), gently dim stars.
  // In Phase 3: As user travels into memory, stars return to deep night radiance.
  // In Phase 4: Stars pulse with deep midnight starlight clarity, brightening gently as midnight arrives.
  // In Phase 5: Early in chapter, subtle stars exist; midway, fewer stars with warmer glow; near end, a meaningful few remain amidst serene starlight tones.
  // In Phase 6 (URIJIP): Stars represent warmth, memory & belonging.
  // In Phase 7 (THINGS I NOTICE): Warm morning environment inside home with calm subtle drifting stars.
  // In Phase 8 (THE SAFE PLACE): Stars are almost motionless, like faint distant memories ("The night is still there. But it no longer feels lonely.").
  // In Phase 11 (HER BIRTHDAY): Faint stars accompany warm moonlight/cyan glow, returning to full midnight brilliance as the chapter darkens.
  // In Phase 12 (THE SECOND PHASE): Warm, gentle stars accompany the anticipation and transition toward the playlist and eternal home.
  const starDensityModifier =
    phaseTwelveProgress > 0.02
      ? 0.75 + Math.sin(phaseTwelveProgress * Math.PI) * 0.25
      : phaseElevenProgress > 0.02
      ? phaseElevenProgress < 0.75
        ? 0.28
        : 0.28 + (phaseElevenProgress - 0.75) * 3.4
      : phaseEightProgress > 0.02
      ? Math.max(0.18, 0.28 - phaseEightProgress * 0.1)
      : phaseSevenProgress > 0.02
      ? Math.max(0.22, 0.38 - phaseSevenProgress * 0.12)
      : phaseSixProgress > 0.02
      ? Math.max(0.28, 0.48 - phaseSixProgress * 0.18)
      : phaseFiveProgress > 0.02
      ? Math.max(0.48, 1.0 - phaseFiveProgress * 0.52)
      : phaseFourProgress > 0.02
      ? 1.1 + (phaseFourProgress >= 0.4 && phaseFourProgress <= 0.75 ? 0.25 : 0.05)
      : phaseThreeProgress > 0.05
      ? 1.15 + Math.sin(phaseThreeProgress * Math.PI) * 0.15
      : phaseTwoProgress > 0.4 && phaseTwoProgress < 0.95
      ? Math.max(0.45, 1 - (phaseTwoProgress - 0.4) * 0.9)
      : 1.1;

  const starSpeedMultiplier =
    phaseTwelveProgress > 0.02
      ? 0.45 + (phaseTwelveProgress > 0.3 ? 0.25 : 0.0)
      : phaseElevenProgress > 0.02
      ? phaseElevenProgress < 0.75
        ? 0.16
        : 0.16 + (phaseElevenProgress - 0.75) * 1.8
      : phaseEightProgress > 0.02
      ? 0.18
      : phaseSevenProgress > 0.02
      ? 0.3
      : phaseSixProgress > 0.02
      ? 0.35
      : 0.8;

  const handleStarCaught = () => {
    setEasterEggState('star_caught');
    setTimeout(() => {
      setEasterEggState('transitioning');
      setTimeout(() => {
        setEasterEggState('constellation_world');
      }, 700);
    }, 350);
  };

  const handleCloseConstellation = () => {
    setEasterEggState('idle');
  };

  const handleMoonTrigger = () => {
    setMoonEasterEggState('approaching');
    setTimeout(() => {
      setMoonEasterEggState('transitioning');
      setTimeout(() => {
        setMoonEasterEggState('universe_world');
      }, 650);
    }, 450);
  };

  const handleCloseMoonUniverse = () => {
    setMoonEasterEggState('idle');
  };

  return (
    <AudioProvider>
      <div
        ref={containerRef}
        id="urijip-app-root"
        className="relative min-h-[6600vh] w-full bg-[#04060A] text-[#EAEFF8] font-body selection:bg-white/20 selection:text-white"
      >
        {/* Top-Left Background Audio Play/Pause Controller */}
        <BackgroundAudioController />

        {/* 1. Procedural Star Field Canvas (Fixed viewport layer) */}
        <StarField
          density={starDensityModifier}
          speedMultiplier={starSpeedMultiplier}
          scrollProgress={scrollProgress}
        />

        {/* 2. Deep Atmospheric Ambient Lighting (Fixed viewport background) */}
        <AmbientBackground scrollProgress={scrollProgress} />

        {/* Phase 10: Hidden Celestial Moon (Quiet discoverable object in sky) */}
        <HiddenMoon
          onTriggerUniverse={handleMoonTrigger}
          isTriggering={moonEasterEggState === 'approaching' || moonEasterEggState === 'transitioning'}
          disabled={easterEggState !== 'idle' || moonEasterEggState !== 'idle'}
        />

        {/* 3. Primary Content Scroll Track */}
        <main className="relative w-full flex flex-col">
          {/* Phase 1: Opening Experience Viewport */}
          <OpeningExperience
            scrollProgress={scrollProgress}
            onScrollClick={handleScrollToNext}
          />

          {/* Phase 2: STARLIGHT Cinematic Chapter */}
          <StarlightChapter
            onProgressChange={setPhaseTwoProgress}
          />

          {/* Phase 3: THE VOICE Cinematic Chapter */}
          <TheVoiceChapter
            onProgressChange={setPhaseThreeProgress}
          />

          {/* Cinematic Interruption / Transition Gateway: Crossing into the Deep Night */}
          <ChapterTransitionGateway />

          {/* Phase 4: THE FIRST CALL Cinematic Chapter (20 → 21 November 2025) */}
          <FirstCallChapter
            onProgressChange={setPhaseFourProgress}
          />

          {/* Phase 5: THE DAY WE FINALLY MET Cinematic Chapter (18 February 2026) */}
          <FirstMeetingChapter
            onProgressChange={setPhaseFiveProgress}
          />

          {/* Phase 6: URIJIP Cinematic Chapter (Our Home) */}
          <UrijipChapter
            onProgressChange={setPhaseSixProgress}
          />

          {/* Phase 7: THINGS I NOTICE ABOUT YOU Cinematic Chapter */}
          <ThingsINoticeChapter
            onProgressChange={setPhaseSevenProgress}
          />

          {/* Phase 8: THE SAFE PLACE Cinematic Chapter */}
          <SafePlaceChapter
            onProgressChange={setPhaseEightProgress}
          />

          {/* Phase 11: HER BIRTHDAY Cinematic Chapter */}
          <BirthdayChapter
            onProgressChange={setPhaseElevenProgress}
          />

          {/* Phase 12: THE SECOND PHASE OF THIS ADVENTURE (Final Primary Chapter) */}
          <SecondPhaseChapter
            onProgressChange={setPhaseTwelveProgress}
          />
        </main>

        {/* Phase 9: Dynamic Shooting Star Easter Egg Spawner */}
        <ShootingStarSpawner
          onTriggerEasterEgg={handleStarCaught}
          isCaught={easterEggState === 'star_caught' || easterEggState === 'transitioning'}
          disabled={easterEggState !== 'idle' || moonEasterEggState !== 'idle'}
        />

        {/* Phase 9 & 10: Deep Midnight Cinematic Fade Transition Curtain */}
        <div
          className={`fixed inset-0 bg-[#000003] pointer-events-none transition-opacity duration-700 ease-in-out ${
            easterEggState === 'transitioning' ||
            easterEggState === 'constellation_world' ||
            moonEasterEggState === 'transitioning' ||
            moonEasterEggState === 'universe_world'
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{ zIndex: 90 }}
        />

        {/* Phase 9: Deep Midnight Constellation Hidden Experience */}
        {easterEggState === 'constellation_world' && (
          <ConstellationEasterEgg
            isOpen={true}
            onClose={handleCloseConstellation}
          />
        )}

        {/* Phase 10: Hidden Universe Experience ("YOU ARE MY UNIVERSE") */}
        {moonEasterEggState === 'universe_world' && (
          <MoonUniverseExperience
            isOpen={true}
            onClose={handleCloseMoonUniverse}
          />
        )}
      </div>
    </AudioProvider>
  );
}
