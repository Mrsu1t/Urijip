/**
 * URIJIP - Centralized Design Tokens & Theme System
 * Established in Phase 1 to guide the visual foundation and future evolutionary chapters.
 */

/**
 * URIJIP - Centralized Design Tokens & Theme System
 * Starlight Cinematic Design System
 */

export const COLOR_TOKENS = {
  // Starlight Cinematic Surface Spectrum
  surface: '#121414',
  surfaceDim: '#121414',
  surfaceBright: '#37393a',
  surfaceContainerLowest: '#0c0f0f',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainer: '#1e2020',
  surfaceContainerHigh: '#282a2b',
  surfaceContainerHighest: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#d8c0c9',
  
  // Accents & Atmosphere
  primary: '#ffafd7', // Nebula Pink (#D46CA6 / #FFAFD7)
  onPrimary: '#5f0643',
  primaryContainer: '#d66da8',
  nebulaPink: '#D46CA6',
  
  secondary: '#d3c0e0', // Muted Violet / Lavender Starlight
  onSecondary: '#382b45',
  secondaryContainer: '#4f415c',
  
  tertiary: '#c8c5ce',
  onTertiary: '#303037',
  
  outline: '#a08b94',
  outlineVariant: '#53424a',
  surfaceTint: '#ffafd7',
  
  // Deep Space Foundations
  space: {
    black: '#000000',
    deepInk: '#05050A',
    mutedViolet: '#1C1028',
    nebulaGlow: 'rgba(212, 108, 166, 0.15)',
  },

  // Starlight Radiance Tones
  starlight: {
    pure: '#FFFFFF',
    soft: '#EAEFF8',
    muted: '#B0BDD4',
    faint: 'rgba(234, 239, 248, 0.45)',
    glow: 'rgba(255, 175, 215, 0.75)',
    accentGlow: 'rgba(211, 192, 224, 0.55)',
    nebulaTint: 'rgba(212, 108, 166, 0.4)',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  fonts: {
    display: "'Hanken Grotesk', system-ui, sans-serif",
    headline: "'Hanken Grotesk', system-ui, sans-serif",
    body: "'Manrope', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    editorial: "'Cormorant Garamond', 'Noto Serif KR', Georgia, serif",
  },
  scales: {
    // Fluid responsive typography rules
    displayLg: 'clamp(2.75rem, 8.5vw, 5.5rem)',
    headlineLg: 'clamp(2rem, 5.5vw, 3.75rem)',
    sequenceLine: 'clamp(1.25rem, 3.2vw, 2.25rem)',
    sequenceFinalLine: 'clamp(1.75rem, 4.8vw, 3.5rem)',
    bodyMd: 'clamp(1rem, 2vw, 1.15rem)',
    labelSm: 'clamp(0.75rem, 1.2vw, 0.875rem)',
    scrollPrompt: 'clamp(0.75rem, 1.4vw, 0.875rem)',
  },
  lineHeights: {
    display: 1.1,
    headline: 1.2,
    body: 1.6,
    label: 1.4,
  },
  letterSpacing: {
    display: '0.1em',
    headline: '0.05em',
    body: '0.01em',
    label: '0.2em',
    wide: '0.08em',
    widest: '0.22em',
  },
} as const;

export const SHAPE_TOKENS = {
  rounded: {
    sm: '0.125rem', // 2px
    DEFAULT: '0.25rem', // 4px standard
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px (modals/cards)
    full: '9999px',
  },
} as const;

export const SPACING_TOKENS = {
  unit: 8,
  containerMax: '1200px',
  gutter: '24px',
  marginMobile: '20px',
  marginDesktop: '64px',
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
