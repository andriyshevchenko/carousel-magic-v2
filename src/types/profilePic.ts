// ── LinkedIn Profile Picture – Type Definitions ──

export const PFP_SIZE = 400; // Export at 400×400px (LinkedIn recommended minimum)

export type BackgroundType = 'solid' | 'gradient' | 'theme-match';

export interface ProfilePicConfig {
  /** The uploaded image as a data URL */
  originalImage: string | null;
  /** The background-removed image as a data URL (transparent PNG) */
  processedImage: string | null;
  /** Background type */
  backgroundType: BackgroundType;
  /** Solid background color */
  solidColor: string;
  /** Gradient start color */
  gradientStart: string;
  /** Gradient end color */
  gradientEnd: string;
  /** Gradient angle in degrees */
  gradientAngle: number;
  /** Theme ID to auto-match background from */
  themeId: string;
  /** Whether to show circle crop preview */
  circlePreview: boolean;
  /** Image scale (zoom) 0.5 - 2.0 */
  imageScale: number;
  /** Image X offset */
  offsetX: number;
  /** Image Y offset */
  offsetY: number;
  /** Whether background removal is in progress */
  processing: boolean;
  /** Whether the model is loading */
  modelLoading: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Edge softening intensity (0 = none, 1-5 = subtle to strong) */
  edgeSoftening: number;
  /** Drop shadow behind the person */
  dropShadow: boolean;
  /** Vignette overlay (darkens edges for depth) */
  vignette: boolean;
}

export const DEFAULT_PROFILE_PIC_CONFIG: ProfilePicConfig = {
  originalImage: null,
  processedImage: null,
  backgroundType: 'gradient',
  solidColor: '#011627', // Night Owl bg
  gradientStart: '#011627',
  gradientEnd: '#01263f',
  gradientAngle: 160,
  themeId: 'night-owl',
  circlePreview: true,
  imageScale: 1.0,
  offsetX: 0,
  offsetY: 0,
  processing: false,
  modelLoading: false,
  progress: 0,
  edgeSoftening: 2,
  dropShadow: true,
  vignette: true,
};

export interface GradientPreset {
  id: string;
  name: string;
  start: string;
  end: string;
  angle: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  // Theme-matched gradients (subtle, low-contrast for professional look)
  { id: 'night-owl', name: 'Night Owl', start: '#011627', end: '#01263f', angle: 160 },
  { id: 'night-owl-warm', name: 'Night Owl Warm', start: '#021d2e', end: '#0d3557', angle: 135 },
  { id: 'dracula', name: 'Dracula', start: '#282a36', end: '#353849', angle: 135 },
  { id: 'one-dark', name: 'One Dark', start: '#282c34', end: '#333842', angle: 135 },
  { id: 'catppuccin', name: 'Catppuccin', start: '#1e1e2e', end: '#272738', angle: 135 },
  { id: 'github-dark', name: 'GitHub Dark', start: '#0d1117', end: '#141a22', angle: 135 },

  // Professional gradients
  { id: 'ocean', name: 'Ocean', start: '#0f2027', end: '#2c5364', angle: 135 },
  { id: 'midnight', name: 'Midnight', start: '#0f0c29', end: '#302b63', angle: 135 },
  { id: 'slate', name: 'Slate', start: '#1c1c1c', end: '#2d2d2d', angle: 180 },
  { id: 'cobalt', name: 'Cobalt', start: '#193549', end: '#15232d', angle: 135 },
  { id: 'navy', name: 'Navy', start: '#0a192f', end: '#172a45', angle: 135 },

  // Light backgrounds
  { id: 'light-clean', name: 'Light Clean', start: '#f5f5f5', end: '#e0e0e0', angle: 180 },
  { id: 'warm-light', name: 'Warm Light', start: '#fafaf9', end: '#f5f0e8', angle: 180 },
  { id: 'cool-blue', name: 'Cool Blue', start: '#e8f4f8', end: '#d1ecf1', angle: 135 },
];

export const SOLID_COLOR_PRESETS: string[] = [
  '#011627', // Night Owl
  '#282a36', // Dracula
  '#282c34', // One Dark
  '#1e1e2e', // Catppuccin
  '#0d1117', // GitHub Dark
  '#193549', // Cobalt
  '#1c1c1c', // Pure dark
  '#5a7896', // Mid blue-gray
  '#ffffff', // White
  '#f5f5f5', // Light gray
  '#0a192f', // Navy
  '#2d3748', // Cool gray
  '#1a202c', // Dark gray
];

// ═══════════════════════════════════════════════════
//  Composition Presets — one-click full-look presets
// ═══════════════════════════════════════════════════

export interface CompositionPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  config: Partial<ProfilePicConfig>;
}

export const COMPOSITION_PRESETS: CompositionPreset[] = [
  {
    id: 'light-clean',
    name: 'Light Clean',
    emoji: '⬜',
    description: 'Classic professional headshot',
    config: {
      backgroundType: 'gradient',
      gradientStart: '#f5f5f5',
      gradientEnd: '#e0e0e0',
      gradientAngle: 180,
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
  {
    id: 'warm-light',
    name: 'Warm Light',
    emoji: '🌤️',
    description: 'Warm, friendly & approachable',
    config: {
      backgroundType: 'gradient',
      gradientStart: '#fafaf9',
      gradientEnd: '#f5f0e8',
      gradientAngle: 180,
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
  {
    id: 'cool-blue',
    name: 'Cool Blue',
    emoji: '🧊',
    description: 'Icy blue, complements navy banner',
    config: {
      backgroundType: 'gradient',
      gradientStart: '#e8f4f8',
      gradientEnd: '#d1ecf1',
      gradientAngle: 135,
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
  {
    id: 'mid-bluegray',
    name: 'Blue-Gray',
    emoji: '🌊',
    description: 'Balanced mid-tone, blue family',
    config: {
      backgroundType: 'solid',
      solidColor: '#5a7896',
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
  {
    id: 'night-owl-subtle',
    name: 'Night Owl',
    emoji: '🦉',
    description: 'Dark, matches banner theme',
    config: {
      backgroundType: 'gradient',
      gradientStart: '#011627',
      gradientEnd: '#01263f',
      gradientAngle: 160,
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
  {
    id: 'dark-solid',
    name: 'Pure Dark',
    emoji: '⬛',
    description: 'Solid banner-match (#011627)',
    config: {
      backgroundType: 'solid',
      solidColor: '#011627',
      imageScale: 1.1,
      offsetX: 0,
      offsetY: -5,
      edgeSoftening: 2,
      dropShadow: true,
      vignette: true,
    },
  },
];
