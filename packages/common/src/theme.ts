/**
 * Word Rush Premium Theme System - Phase 4
 * Sophisticated 7-tier color system mapped to Scrabble point values
 * Creates a visually stunning, premium gaming experience
 */

// TILE COLORS - Scrabble Point Value Gradient (7-Tier System)
export const TILE_COLORS = {
  points1: '#1599BB',    // Blue Green (E, A, I, O, etc.)
  points2: '#097698',    // Cerulean (D, G)
  points3: '#0B9B92',    // Persian Green (B, C, M, P)
  points4: '#0D7085',    // Caribbean Current (F, H, V, W, Y)
  points5: '#FAA827',    // Orange Web (K)
  points8: '#F2832C',    // Orange Wheel (J, X)
  points10: '#EE6E2A',   // Orange Crayola (Q, Z)
} as const;

// BACKGROUND SYSTEM - Deep Water Gradient Atmosphere
export const BACKGROUNDS = {
  main: {
    deep: '#01243F',     // Oxford Blue (gradient start)
    light: '#01616C',    // Caribbean Current (gradient end)
  },
  title: '#002643',      // Prussian Blue (title card background)
  leaderboard: '#002840', // Prussian Blue (UI panels)
  bottomBar: '#003C53',  // Indigo Dye (bottom status bar)
  boardOutline: '#09637B', // Midnight Green (board border)
  emptyTile: '#00435D',  // Indigo Dye (empty tile spaces)
} as const;

// GOLDEN TITLE GRADIENT - Premium AAA Treatment
export const TITLE_GRADIENT = {
  light: '#FFE265',      // Naples Yellow
  mid: '#FFB92F',        // Selective Yellow  
  deep: '#FF8F1D',       // Dark Orange Web
} as const;

// INTERACTIVE ELEMENTS - UI Controls
export const UI_ELEMENTS = {
  shuffleButton: '#0C5C7E',    // Lapis Lazuli
  timerRing: '#038BB0',        // Bondi Blue (background)
  timerProgress: '#2CFFFF',    // Aqua (active progress)
  tileSelected: '#FAA827',     // Orange Web (selection glow)
  tileHover: '#0D7085',        // Caribbean Current (hover state)
} as const;

// TEXT COLORS - Hierarchical Typography System
export const TEXT_COLORS = {
  tileLetters: '#F9F0C6',      // Lemon Chiffon (on tiles)
  playerNames: '#E1F5E4',      // Honeydew (leaderboard names)
  playerScores: '#8CE6EC',     // Electric Blue (score numbers)
  buttonText: '#D2E9D3',       // Nyanza (button labels)
  timerNumbers: '#E2EEDD',     // Honeydew (timer display)
  goldHighlight: '#FFE265',    // Naples Yellow (golden highlights)
} as const;

// PARTICLE EFFECTS - "Juicy" Visual Feedback
export const PARTICLE_COLORS = {
  goldBurst: ['#FCE495', '#FDE053'],    // Jasmine + Naples Yellow
  electricBlue: ['#A0F5F2', '#74F5F6'], // Ice Blue + Electric Blue
  speedBonus: ['#FFE265', '#FF8F1D'],   // Golden gradient mix
  cascadeShimmer: ['#2CFFFF', '#74F5F6'], // Aqua shimmer effect
} as const;

// CROWN SYSTEM - King of the Hill Progression
export const CROWN_COLORS = {
  gold: '#FFE265',           // Naples Yellow (crown base)
  goldDeep: '#FF8F1D',       // Dark Orange Web (crown shadow)
  glow: '#FCE495',           // Jasmine (crown glow effect)
} as const;

// LEGACY COMPATIBILITY - Backward compatibility with existing components
export const COLORS = {
  // Primary tile system (mapped to point values)
  tileBackground: TILE_COLORS.points1,  // Default to 1-point color
  tileText: TEXT_COLORS.tileLetters,
  tileSelected: UI_ELEMENTS.tileSelected,
  tileHover: UI_ELEMENTS.tileHover,
  
  // UI Elements
  primary: '#1599BB',          // Blue Green (main brand)
  accent: '#FAA827',           // Orange Web (accent)
  background: BACKGROUNDS.main.light,
  cardBg: BACKGROUNDS.leaderboard,
  border: BACKGROUNDS.boardOutline,
  
  // Text hierarchy
  text: TEXT_COLORS.playerNames,
  textSubtle: TEXT_COLORS.playerScores,
  
  // Feedback colors
  success: '#1DD1A1',
  error: '#FF5252',
  warning: '#FFC107',
  
  // King of the Hill
  gold: CROWN_COLORS.gold,
} as const;

// TYPOGRAPHY SYSTEM - Premium Font Treatment
export const FONTS = {
  heading: 'Nunito',
  body: 'Inter',
  
  // Font weights for premium feel
  weights: {
    regular: 400,
    semiBold: 600,
    bold: 700,
    extraBold: 800,  // For golden titles
  },
} as const;

// SPACING & SIZING - 8px Grid System
export const SPACING = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// BORDER RADIUS - Rounded Premium Design
export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  tile: 8,        // Specific radius for game tiles
  button: 6,      // Button border radius
} as const;

// SHADOWS - Depth and Premium Feel
export const SHADOWS = {
  standard: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  tile: '0 4px 8px rgba(0, 0, 0, 0.2)',              // Tile depth shadow
  glow: '0 0 12px',                                   // Glow effect (color specified separately)
  golden: '0 4px 8px rgba(0, 0, 0, 0.3)',           // Golden title shadow
} as const;

// DIFFICULTY LEVEL COLORS - Using tile gradient system
export const DIFFICULTY_COLORS = {
  easy: TILE_COLORS.points1,      // Blue Green
  medium: TILE_COLORS.points3,    // Persian Green  
  hard: TILE_COLORS.points5,      // Orange Web
  extreme: TILE_COLORS.points10,  // Orange Crayola
} as const;

/**
 * Get tile color by Scrabble point value
 * Maps point values to premium gradient colors
 * @param points - Scrabble point value (1, 2, 3, 4, 5, 8, 10)
 * @returns Hex color string for the tile
 */
export function getTileColorByPoints(points: number): string {
  switch(points) {
    case 1: return TILE_COLORS.points1;
    case 2: return TILE_COLORS.points2;
    case 3: return TILE_COLORS.points3;
    case 4: return TILE_COLORS.points4;
    case 5: return TILE_COLORS.points5;
    case 8: return TILE_COLORS.points8;
    case 10: return TILE_COLORS.points10;
    default: return TILE_COLORS.points1;
  }
}

/**
 * Generate CSS gradient string for golden titles
 * @returns CSS linear-gradient string
 */
export function getGoldenGradient(): string {
  return `linear-gradient(135deg, ${TITLE_GRADIENT.light} 0%, ${TITLE_GRADIENT.mid} 50%, ${TITLE_GRADIENT.deep} 100%)`;
}

/**
 * Generate CSS background for main app
 * @returns CSS radial-gradient string
 */
export function getMainBackground(): string {
  return `radial-gradient(ellipse at center, ${BACKGROUNDS.main.light} 0%, ${BACKGROUNDS.main.deep} 100%)`;
} 