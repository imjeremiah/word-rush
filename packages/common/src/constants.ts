/**
 * Shared constants for Word Rush
 * Core game configuration and official Scrabble data used across client and server
 */

/**
 * Default game configuration for MVP implementation
 * Provides standard game parameters for consistent gameplay experience
 * Used as fallback values when custom configuration is not provided
 */
export const DEFAULT_GAME_CONFIG = {
  /** Number of columns in the game board grid (4x4 for MVP) */
  boardWidth: 4,
  /** Number of rows in the game board grid (4x4 for MVP) */
  boardHeight: 4,
  /** Duration of each round in seconds (90 seconds per round) */
  roundDuration: 90,
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
 */
export const TIMING = {
  /** Duration of each round in milliseconds (90 seconds) */
  ROUND_DURATION: 90000,
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
