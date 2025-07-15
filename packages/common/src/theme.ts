/**
 * Word Rush Theme Constants
 * Based on theme-rules.md - Flat 2.0 / Modern Material Design
 */

// Primary Colors
export const COLORS = {
  primary: '#4A6BFF',
  accent: '#FF7A59',
  
  // Neutral Colors (Grayscale)
  text: '#2D3748',
  textSubtle: '#718096',
  disabled: '#A0AEC0',
  border: '#E2E8F0',
  background: '#F7FAFC',
  cardBg: '#FFFFFF',
  
  // Feedback Colors
  success: '#1DD1A1',
  error: '#FF5252',
  warning: '#FFC107',
  
  // Game-specific colors
  tileBackground: '#FFFFFF',
  tileText: '#2D3748',
  tileHover: '#E2E8F0',
  tileSelected: '#4A6BFF',
  
  // King of the Hill
  gold: '#FFD700',
} as const;

// Typography
export const FONTS = {
  heading: 'Nunito',
  body: 'Inter',
  
  // Font weights
  weights: {
    regular: 400,
    semiBold: 600,
    bold: 700,
  },
} as const;

// Spacing & Sizing (based on 8px units)
export const SPACING = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius
export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
} as const;

// Shadows
export const SHADOWS = {
  standard: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

// Difficulty level colors
export const DIFFICULTY_COLORS = {
  easy: COLORS.success,
  medium: COLORS.primary,
  hard: COLORS.accent,
  extreme: COLORS.error,
} as const; 