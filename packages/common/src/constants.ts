/**
 * Shared constants for Word Rush
 * Core game configuration and official Scrabble data used across client and server
 */

/**
 * Default game configuration for Phase 4: Premium Visual Transformation
 * Upgraded to 7x7 board for enhanced strategic gameplay and visual presence
 * Extended duration to accommodate larger board complexity
 */
export const DEFAULT_GAME_CONFIG = {
  /** Number of columns in the game board grid (upgraded to 7x7 for Phase 4) */
  boardWidth: 7,
  /** Number of rows in the game board grid (upgraded to 7x7 for Phase 4) */
  boardHeight: 7,
  /** Duration of each round in seconds (extended to 120 seconds for 7x7 complexity) */
  roundDuration: 120,
  /** Maximum number of rounds per match (Best of 3 for MVP) */
  maxRounds: 3,
  /** Minimum players required to start a match */
  minPlayers: 2,
  /** Maximum players allowed in a single match */
  maxPlayers: 8,
};

/**
 * Official Scrabble letter distribution and point values
 * Exact letter frequencies and scoring from tournament Scrabble rules
 * Used for both random board generation and word scoring calculations
 * Each entry contains: count (tiles in bag) and points (scoring value)
 */
export const LETTER_DISTRIBUTION = {
  /** A: 9 tiles, 1 point each */
  A: { count: 9, points: 1 },
  /** B: 2 tiles, 3 points each */
  B: { count: 2, points: 3 },
  /** C: 2 tiles, 3 points each */
  C: { count: 2, points: 3 },
  /** D: 4 tiles, 2 points each */
  D: { count: 4, points: 2 },
  /** E: 12 tiles, 1 point each (most common letter) */
  E: { count: 12, points: 1 },
  /** F: 2 tiles, 4 points each */
  F: { count: 2, points: 4 },
  /** G: 3 tiles, 2 points each */
  G: { count: 3, points: 2 },
  /** H: 2 tiles, 4 points each */
  H: { count: 2, points: 4 },
  /** I: 9 tiles, 1 point each */
  I: { count: 9, points: 1 },
  /** J: 1 tile, 8 points (rare letter) */
  J: { count: 1, points: 8 },
  /** K: 1 tile, 5 points */
  K: { count: 1, points: 5 },
  /** L: 4 tiles, 1 point each */
  L: { count: 4, points: 1 },
  /** M: 2 tiles, 3 points each */
  M: { count: 2, points: 3 },
  /** N: 6 tiles, 1 point each */
  N: { count: 6, points: 1 },
  /** O: 8 tiles, 1 point each */
  O: { count: 8, points: 1 },
  /** P: 2 tiles, 3 points each */
  P: { count: 2, points: 3 },
  /** Q: 1 tile, 10 points (highest value letter) */
  Q: { count: 1, points: 10 },
  /** R: 6 tiles, 1 point each */
  R: { count: 6, points: 1 },
  /** S: 4 tiles, 1 point each */
  S: { count: 4, points: 1 },
  /** T: 6 tiles, 1 point each */
  T: { count: 6, points: 1 },
  /** U: 4 tiles, 1 point each */
  U: { count: 4, points: 1 },
  /** V: 2 tiles, 4 points each */
  V: { count: 2, points: 4 },
  /** W: 2 tiles, 4 points each */
  W: { count: 2, points: 4 },
  /** X: 1 tile, 8 points (rare letter) */
  X: { count: 1, points: 8 },
  /** Y: 2 tiles, 4 points each */
  Y: { count: 2, points: 4 },
  /** Z: 1 tile, 10 points (highest value letter) */
  Z: { count: 1, points: 10 },
};

/**
 * Weighted letter bag for random tile selection
 * Flattened array where each letter appears according to its official count
 * Used for board generation to ensure proper letter distribution
 * Example: 'A' appears 9 times, 'E' appears 12 times, 'Q' appears 1 time
 */
export const LETTER_BAG = Object.entries(LETTER_DISTRIBUTION).flatMap(
  ([letter, config]) => Array(config.count).fill(letter)
);

/**
 * Socket.io event names for type-safe communication
 * Centralized event name constants to prevent typos and ensure consistency
 * Organized by direction: SERVER (server-to-client) and CLIENT (client-to-server)
 */
export const SOCKET_EVENTS = {
  /** Events sent from server to client */
  SERVER: {
    /** Initial welcome message sent when client connects */
    WELCOME: 'server:welcome',
    /** Error notifications sent to client */
    ERROR: 'server:error',
  },
  /** Events sent from client to server (extensible for future features) */
  CLIENT: {
    // Future client events will be added here
  },
} as const;

/**
 * Game timing constants in milliseconds
 * Performance targets and timeout values for responsive gameplay
 * Updated for Phase 4 with extended round duration
 */
export const TIMING = {
  /** Duration of each round in milliseconds (120 seconds for 7x7 board) */
  ROUND_DURATION: 120000,
  /** Maximum allowed time for word validation (150ms target) */
  WORD_VALIDATION_TIMEOUT: 150,
  /** Grace period for player reconnection attempts (30 seconds) */
  RECONNECT_TIMEOUT: 30000,
};

/**
 * Performance targets for monitoring and optimization
 * Concrete metrics the application must meet for acceptable user experience
 */
export const PERFORMANCE_TARGETS = {
  /** Maximum acceptable latency for word validation (milliseconds) */
  MAX_LATENCY: 150,
  /** Target frame rate for smooth Phaser rendering */
  TARGET_FPS: 60,
  /** Maximum concurrent players the server must support */
  MAX_CONCURRENT_PLAYERS: 50,
};

/**
 * 🚀 PHASE 5A: Advanced Game Modes Configuration
 * Enhanced gameplay modes that provide themed word validation and special letter distribution
 */
export const GAME_MODES = {
  /** Standard mode with full dictionary */
  STANDARD: 'standard',
  /** Animals-themed mode with only animal words */
  ANIMALS: 'animals',
  /** Science-themed mode with scientific terms */
  SCIENCE: 'science',
  /** High-value letter mode with increased rare letter frequency */
  HIGH_VALUE: 'high_value',
} as const;

export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];

/**
 * Themed word categories for advanced game modes
 * Pre-defined word lists for category-specific gameplay
 */
export const THEME_CATEGORIES = {
  [GAME_MODES.ANIMALS]: [
    'CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'TIGER', 'BEAR', 'WOLF', 'FOX', 'DEER',
    'HORSE', 'COW', 'PIG', 'SHEEP', 'GOAT', 'DUCK', 'CHICKEN', 'RABBIT', 'MOUSE', 'RAT',
    'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'MONKEY', 'GORILLA', 'PANDA', 'KOALA', 'KANGAROO',
    'PENGUIN', 'EAGLE', 'HAWK', 'OWL', 'CROW', 'ROBIN', 'SPARROW', 'PEACOCK',
    'WHALE', 'DOLPHIN', 'SHARK', 'OCTOPUS', 'STARFISH', 'CRAB', 'LOBSTER',
    'BUTTERFLY', 'BEE', 'ANT', 'SPIDER', 'SNAKE', 'LIZARD', 'FROG', 'TURTLE'
  ],
  [GAME_MODES.SCIENCE]: [
    'ATOM', 'MOLECULE', 'ELEMENT', 'PROTON', 'NEUTRON', 'ELECTRON', 'NUCLEUS',
    'CHEMISTRY', 'PHYSICS', 'BIOLOGY', 'GEOLOGY', 'ASTRONOMY', 'GRAVITY',
    'ENERGY', 'FORCE', 'MASS', 'VELOCITY', 'ACCELERATION', 'FRICTION',
    'MAGNET', 'ELECTRIC', 'CURRENT', 'VOLTAGE', 'CIRCUIT', 'BATTERY',
    'CARBON', 'OXYGEN', 'HYDROGEN', 'NITROGEN', 'HELIUM', 'SODIUM',
    'DNA', 'RNA', 'PROTEIN', 'ENZYME', 'CELL', 'TISSUE', 'ORGAN',
    'VIRUS', 'BACTERIA', 'VACCINE', 'ANTIBIOTIC', 'MEDICINE',
    'PLANET', 'STAR', 'GALAXY', 'SOLAR', 'LUNAR', 'COMET', 'METEOR'
  ]
} as const;

/**
 * High-value letter distribution for challenging gameplay
 * Increases frequency of rare, high-point letters
 */
export const HIGH_VALUE_LETTER_BIAS = {
  J: 3, // Increased from 1 to 3
  Q: 3, // Increased from 1 to 3  
  X: 3, // Increased from 1 to 3
  Z: 3, // Increased from 1 to 3
  K: 2, // Increased from 1 to 2
  V: 3, // Increased from 2 to 3
  W: 3, // Increased from 2 to 3
  Y: 3, // Increased from 2 to 3
} as const;
