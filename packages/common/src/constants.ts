/**
 * Shared constants for Word Rush
 */

// Default game configuration
export const DEFAULT_GAME_CONFIG = {
  boardWidth: 4,
  boardHeight: 4,
  roundDuration: 90, // 90 seconds per round
  maxRounds: 3,
  minPlayers: 2,
  maxPlayers: 8,
};

// Scrabble letter distribution and point values
export const LETTER_DISTRIBUTION = {
  A: { count: 9, points: 1 },
  B: { count: 2, points: 3 },
  C: { count: 2, points: 3 },
  D: { count: 4, points: 2 },
  E: { count: 12, points: 1 },
  F: { count: 2, points: 4 },
  G: { count: 3, points: 2 },
  H: { count: 2, points: 4 },
  I: { count: 9, points: 1 },
  J: { count: 1, points: 8 },
  K: { count: 1, points: 5 },
  L: { count: 4, points: 1 },
  M: { count: 2, points: 3 },
  N: { count: 6, points: 1 },
  O: { count: 8, points: 1 },
  P: { count: 2, points: 3 },
  Q: { count: 1, points: 10 },
  R: { count: 6, points: 1 },
  S: { count: 4, points: 1 },
  T: { count: 6, points: 1 },
  U: { count: 4, points: 1 },
  V: { count: 2, points: 4 },
  W: { count: 2, points: 4 },
  X: { count: 1, points: 8 },
  Y: { count: 2, points: 4 },
  Z: { count: 1, points: 10 },
};

// Create a weighted array for random letter selection
export const LETTER_BAG = Object.entries(LETTER_DISTRIBUTION).flatMap(
  ([letter, config]) => Array(config.count).fill(letter)
);

// Socket.io event names
export const SOCKET_EVENTS = {
  SERVER: {
    WELCOME: 'server:welcome',
    ERROR: 'server:error',
  },
  CLIENT: {
    // Future client events will be added here
  },
} as const;

// Game timing constants
export const TIMING = {
  ROUND_DURATION: 90000, // 90 seconds in milliseconds
  WORD_VALIDATION_TIMEOUT: 150, // 150ms max for word validation
  RECONNECT_TIMEOUT: 30000, // 30 seconds to reconnect
};

// Performance targets
export const PERFORMANCE_TARGETS = {
  MAX_LATENCY: 150, // milliseconds
  TARGET_FPS: 60,
  MAX_CONCURRENT_PLAYERS: 50,
};
