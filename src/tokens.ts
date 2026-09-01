/**
 * URIJIP - Centralized Design Tokens & Theme System
 * Established in Phase 1 to guide the visual foundation and future evolutionary chapters.
 */

export const COLOR_TOKENS = {
  // Phase 1 - Night Sky Opening
  night: {
    base: '#04060A',
    void: '#070B12',
    deepCharcoal: '#0E141D',
    softCharcoal: '#151C28',
    midnightAura: '#0A1322',
  },
  starlight: {
    pure: '#FFFFFF',
    soft: '#EAEFF8',
    muted: '#B0BDD4',
    faint: 'rgba(234, 239, 248, 0.45)',
    glow: 'rgba(220, 235, 255, 0.65)',
    accentGlow: 'rgba(180, 215, 255, 0.35)',
    goldTint: 'rgba(255, 248, 220, 0.85)',
  },
  // Future Chapters Evolution Tokens (Reserved for upcoming phases: BLACK → MIDNIGHT → VIOLET → ROSE → BUBBLEGUM PINK → WARM CREAM)
  evolution: {
    black: '#04060A',
    midnight: '#0A1128',
    violet: '#2C1654',
    rose: '#7D2E68',
    bubblegumPink: '#E880B9',
    warmCream: '#FAF5EB',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  fonts: {
    editorial: "'Cormorant Garamond', Georgia, serif",
    body: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  scales: {
    // Fluid responsive typography rules
    heroTitle: 'clamp(2.25rem, 6vw, 4.25rem)',
    sequenceLine: 'clamp(1.25rem, 3.2vw, 2.25rem)',
    sequenceFinalLine: 'clamp(1.75rem, 4.8vw, 3.5rem)',
    starlightDisplay: 'clamp(2.75rem, 8.5vw, 6rem)',
    subhead: 'clamp(0.95rem, 1.8vw, 1.25rem)',
    caption: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    scrollPrompt: 'clamp(0.75rem, 1.4vw, 0.875rem)',
  },
  lineHeights: {
    tight: 1.15,
    snug: 1.35,
    normal: 1.6,
    relaxed: 1.8,
  },
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0em',
    wide: '0.08em',
    widest: '0.22em',
  },
} as const;

export const ANIMATION_TOKENS = {
  duration: {
    fast: 0.4,
    normal: 0.8,
    slow: 1.4,
    cinematic: 2.2,
    atmospheric: 4.5,
  },
  easing: {
    cinematic: [0.16, 1, 0.3, 1] as const,
    gentle: [0.25, 0.1, 0.25, 1.0] as const,
    softExit: [0.4, 0, 1, 1] as const,
  },
  delays: {
    line1: 1.0,
    line2: 3.0,
    line3: 4.8,
    starlightEmphasis: 5.8,
    starlightFocal: 7.2,
    scrollIndicator: 8.5,
  },
} as const;

export const Z_INDEX_TOKENS = {
  backgroundCanvas: 0,
  ambientGlow: 5,
  starField: 10,
  starlightFocalLayer: 20,
  contentLayer: 30,
  scrollIndicator: 40,
  debugOverlay: 50,
} as const;

export const BREAKPOINT_TOKENS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
