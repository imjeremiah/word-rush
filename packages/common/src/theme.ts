/**
 * Word Rush Oceanic Depth Theme System
 * Creates a cohesive oceanic depth experience that complements the perfect tile colors
 * Colors flow from deepest ocean to bright surface with coral accents
 */

// OCEANIC COLOR PALETTE - Primary System
export const OCEANIC_PALETTE = {
  // Primary Oceanic Blues (Dark to Light)
  deepestOcean: '#002441',    // Deepest Ocean - backgrounds/edges
  deepOcean: '#013B4F',       // Deep Ocean - secondary backgrounds
  oceanDepth: '#003C53',      // Ocean Depth - alternative dark
  midOcean: '#004F5E',        // Mid Ocean - primary panels
  oceanBlue: '#01606A',       // Ocean Blue - secondary panels
  oceanSurface: '#0B6281',    // Ocean Surface - interactive elements
  oceanFoam: '#0888AD',       // Ocean Foam - active states
  oceanTeal: '#1F7D81',       // Ocean Teal - accents/highlights
  
  // Accent Colors
  coralOrange: '#F2742B',     // Coral Orange - primary actions
  sunsetOrange: '#F79A2D',    // Sunset Orange - secondary actions
} as const;

// TILE_COLORS - Preserved Perfect Tile System (DO NOT CHANGE)
export const TILE_COLORS = {
  points1: '#045476',    // Dark Blue (E, A, I, O, U, L, N, S, T, R)
  points2: '#0A7497',    // Blue (D, G)
  points3: '#149ABC',    // Light Blue (B, C, M, P)
  points4: '#0F9995',    // Teal (F, H, V, W, Y)
  points5: '#FBA731',    // Orange (K)
  points8: '#F88C2B',    // Dark Orange (J, X)
  points10: '#F1742A',   // Red Orange (Q, Z)
} as const;

// BACKGROUND SYSTEM - Oceanic Depth Atmosphere
export const BACKGROUNDS = {
  main: {
    deep: OCEANIC_PALETTE.deepestOcean,     // Primary background start
    light: OCEANIC_PALETTE.deepOcean,       // Primary background end
  },
  title: OCEANIC_PALETTE.midOcean,          // Title card background
  leaderboard: OCEANIC_PALETTE.oceanDepth,  // UI panels
  bottomBar: OCEANIC_PALETTE.oceanDepth,    // Bottom status bar
  boardOutline: OCEANIC_PALETTE.oceanSurface, // Board border
  emptyTile: OCEANIC_PALETTE.oceanBlue,     // Empty tile spaces
} as const;

// GOLDEN TITLE GRADIENT - Preserved Premium Treatment
export const TITLE_GRADIENT = {
  light: '#FEDE5F',      // Exact specification from checklist
  mid: '#FEBA2E',        // Exact specification from checklist  
  deep: '#FE8E1D',       // Exact specification from checklist
} as const;

// INTERACTIVE ELEMENTS - Oceanic UI Controls
export const UI_ELEMENTS = {
  shuffleButton: OCEANIC_PALETTE.sunsetOrange,    // Sunset Orange
  timerRing: OCEANIC_PALETTE.oceanBlue,           // Ocean Blue (background)
  timerProgress: OCEANIC_PALETTE.oceanTeal,       // Ocean Teal (active progress)
  tileSelected: '#FDDC7A',                        // Preserved golden yellow (selection glow)
  tileHover: '#FDDC7A',                           // Preserved golden yellow (hover state)
} as const;

// TEXT COLORS - Oceanic Typography System
export const TEXT_COLORS = {
  universalText: '#FAF0C7',                       // Universal text color for consistency
  tileLetters: '#FAF0C7',                         // Updated - Universal text (on tiles) // old: '#F9F0C6'
  playerNames: OCEANIC_PALETTE.oceanFoam,         // Ocean Foam (leaderboard names)
  playerScores: OCEANIC_PALETTE.sunsetOrange,     // Sunset Orange (score numbers)
  buttonText: OCEANIC_PALETTE.oceanFoam,          // Ocean Foam (button labels)
  timerNumbers: OCEANIC_PALETTE.oceanTeal,        // Ocean Teal (timer display)
  goldHighlight: TITLE_GRADIENT.light,            // Golden highlights
  headings: OCEANIC_PALETTE.oceanFoam,            // Headings
  bodyText: OCEANIC_PALETTE.oceanSurface,         // Body text
  secondaryText: OCEANIC_PALETTE.oceanTeal,       // Secondary text
  disabledText: OCEANIC_PALETTE.deepOcean,        // Disabled text
} as const;

// PARTICLE EFFECTS - "Juicy" Visual Feedback with Oceanic Theme
export const PARTICLE_COLORS = {
  goldBurst: [TITLE_GRADIENT.light, TITLE_GRADIENT.mid],    // Golden gradient burst
  oceanicBlue: [OCEANIC_PALETTE.oceanFoam, OCEANIC_PALETTE.oceanTeal], // Oceanic shimmer
  speedBonus: [OCEANIC_PALETTE.coralOrange, OCEANIC_PALETTE.sunsetOrange],   // Coral energy
  cascadeShimmer: [OCEANIC_PALETTE.oceanTeal, OCEANIC_PALETTE.oceanFoam], // Ocean cascade effect
} as const;

// CROWN SYSTEM - Preserved King of the Hill Progression
export const CROWN_COLORS = {
  gold: TITLE_GRADIENT.light,           // Preserved golden crown
  goldDeep: TITLE_GRADIENT.deep,        // Preserved crown shadow
  glow: '#FCE495',                      // Preserved crown glow effect
} as const;

// LEGACY COMPATIBILITY - Oceanic Theme with Backward Compatibility
export const COLORS = {
  // Primary tile system (preserved - mapped to point values)
  tileBackground: TILE_COLORS.points1,  // Default to 1-point color
  tileText: TEXT_COLORS.tileLetters,
  tileSelected: UI_ELEMENTS.tileSelected,
  tileHover: UI_ELEMENTS.tileHover,
  
  // UI Elements - Oceanic System
  primary: OCEANIC_PALETTE.oceanSurface,          // Ocean Surface (main brand)
  accent: OCEANIC_PALETTE.coralOrange,            // Coral Orange (accent)
  background: BACKGROUNDS.main.light,
  cardBg: BACKGROUNDS.leaderboard,
  border: BACKGROUNDS.boardOutline,
  
  // Text hierarchy - Oceanic
  text: TEXT_COLORS.playerNames,
  textSubtle: TEXT_COLORS.playerScores,
  
  // Feedback colors (preserved)
  success: '#1DD1A1',          // Keep green for success
  error: '#FF5252',            // Keep red for errors
  warning: '#FFC107',          // Keep yellow for warnings
  
  // King of the Hill (preserved)
  gold: CROWN_COLORS.gold,
} as const;

// TYPOGRAPHY SYSTEM - Premium Font Treatment
export const FONTS = {
  heading: 'Nunito',
  body: 'Inter',
  title: 'Luckiest Guy',  // Premium title font for brand consistency
  
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

// DIFFICULTY LEVEL COLORS - Oceanic Progression
export const DIFFICULTY_COLORS = {
  easy: OCEANIC_PALETTE.oceanSurface,     // Ocean Surface
  medium: OCEANIC_PALETTE.oceanTeal,      // Ocean Teal  
  hard: OCEANIC_PALETTE.sunsetOrange,     // Sunset Orange
  extreme: OCEANIC_PALETTE.coralOrange,   // Coral Orange
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
  return `linear-gradient(to bottom, ${TITLE_GRADIENT.light} 0%, ${TITLE_GRADIENT.mid} 50%, ${TITLE_GRADIENT.deep} 100%)`;
}

/**
 * Generate CSS background for main app - Oceanic Depth
 * @returns CSS linear-gradient string
 */
export function getMainBackground(): string {
  return `linear-gradient(135deg, ${BACKGROUNDS.main.deep} 0%, ${BACKGROUNDS.main.light} 100%)`;
}

/**
 * Generate oceanic depth gradient for panels
 * @returns CSS linear-gradient string
 */
export function getOceanicDepthGradient(): string {
  return `linear-gradient(45deg, ${OCEANIC_PALETTE.deepOcean} 0%, ${OCEANIC_PALETTE.midOcean} 100%)`;
}

/**
 * Generate celebratory oceanic gradient for match complete
 * @returns CSS linear-gradient string
 */
export function getCelebratoryGradient(): string {
  return `linear-gradient(135deg, ${OCEANIC_PALETTE.deepestOcean} 0%, ${OCEANIC_PALETTE.oceanBlue} 50%, ${OCEANIC_PALETTE.oceanFoam} 100%)`;
} 