/**
 * URIJIP - Shared TypeScript Interfaces & Types
 */

import type { ReactNode } from 'react';

export interface StarParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: 1 | 2 | 3; // 1: deep distant, 2: mid-space, 3: foreground luminous
  color: string;
}

export interface StarFieldProps {
  density?: number;
  speedMultiplier?: number;
  scrollProgress?: number;
  className?: string;
}

export interface OpeningSequenceState {
  currentStage: 'init' | 'line1' | 'line2' | 'line3' | 'focalStar' | 'readyToScroll';
  progress: number;
  hasStartedScrolling: boolean;
}

export interface StarlightFocusProps {
  visible: boolean;
  scrollProgress?: number;
  className?: string;
}

export interface AnimatedTextLineProps {
  children: ReactNode;
  delay?: number;
  isEmphasized?: boolean;
  className?: string;
  id?: string;
}

export interface ScrollIndicatorProps {
  visible: boolean;
  scrollProgress: number;
  onClick?: () => void;
}

export interface StarlightEyesPhotoProps {
  revealProgress: number; // 0 (hidden in dark) to 1 (fully revealed)
  isLuminous?: boolean;
  className?: string;
  customSrc?: string;
}

export interface StarlightChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface TheVoiceChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
  voiceNoteSrc?: string | null;
}

export interface FirstCallChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
  orchestraTrackSrc?: string | null;
}

export interface FirstMeetingChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface UrijipChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface ThingsINoticeChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface SafePlaceChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface BirthdayChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface SecondPhaseChapterProps {
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export interface ShootingStarSpawnerProps {
  onTriggerEasterEgg: () => void;
  isCaught?: boolean;
  disabled?: boolean;
}

export interface ConstellationEasterEggProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface HiddenMoonProps {
  onTriggerUniverse: () => void;
  isTriggering?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface MoonUniverseExperienceProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MidnightClockMotifProps {
  progress?: number; // 0 to 1
  currentTimeLabel?: string;
  isMidnight?: boolean;
  className?: string;
}

export interface VoiceNotePlaceholderProps {
  id?: string;
  className?: string;
  isVisible?: boolean;
}

export type ChapterIdentifier =
  | 'NIGHT'
  | 'STARLIGHT'
  | 'VOICE'
  | 'CONNECTION'
  | 'FIRST_MEETING'
  | 'HOME'
  | 'HER'
  | 'LOVE'
  | 'UNIVERSE'
  | 'BIRTHDAY'
  | 'VIDEO'
  | 'SPOTIFY';
