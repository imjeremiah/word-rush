/**
 * Additional shared types for Word Rush
 * Core type definitions used across client and server for type-safe communication
 */

/**
 * Player representation in the game system
 * Contains all essential player data for session management and gameplay
 */
export interface Player {
  /** Unique identifier for the player, typically matches socket ID */
  id: string;
  /** Display name chosen by the player (1-50 characters) */
  username: string;
  /** Current cumulative score from all valid words submitted */
  score: number;
  /** Connection status indicating if player is actively connected */
  isConnected: boolean;
}

/**
 * Complete game state for multiplayer matches
 * Tracks overall match progress and player standings
 */
export interface GameState {
  /** Array of all players currently in the match */
  players: Player[];
  /** Current round number (1-indexed) */
  currentRound: number;
  /** Total number of rounds configured for this match */
  totalRounds: number;
  /** Remaining time in current round (milliseconds) */
  timeRemaining: number;
  /** Whether the game is currently active and accepting moves */
  isGameActive: boolean;
}

/**
 * Individual letter tile on the game board
 * Represents a single positioned tile with game properties
 */
export interface LetterTile {
  /** Single uppercase letter (A-Z) displayed on the tile */
  letter: string;
  /** Scrabble point value for this letter (1-10) */
  points: number;
  /** Column position on the board grid (0-indexed from left) */
  x: number;
  /** Row position on the board grid (0-indexed from top) */
  y: number;
  /** Unique identifier for this specific tile instance */
  id: string;
}

/**
 * Complete game board structure
 * Contains 2D grid of letter tiles and board dimensions
 */
export interface GameBoard {
  /** 2D array of letter tiles organized as [row][column] */
  tiles: LetterTile[][];
  /** Number of columns in the board grid */
  width: number;
  /** Number of rows in the board grid */
  height: number;
}

/**
 * Word submission data from client to server
 * Contains complete information needed for word validation
 */
export interface WordSubmission {
  /** The word string formed by connecting tiles */
  word: string;
  /** Array of tiles used to form the word (path order matters) */
  tiles: LetterTile[];
  /** ID of the player submitting the word */
  playerId: string;
  /** Timestamp when word was submitted (milliseconds since epoch) */
  timestamp: number;
}

/**
 * Server response to word validation request
 * Provides comprehensive feedback on word submission result
 */
export interface WordValidationResult {
  /** Whether the submitted word is valid according to game rules */
  isValid: boolean;
  /** The word that was validated (normalized) */
  word: string;
  /** Points awarded for this word (0 if invalid) */
  points: number;
  /** Optional explanation for why word was invalid */
  reason?: string;
  /** ID of the player who submitted the word */
  playerId: string;
  /** Timestamp when validation was completed */
  timestamp: number;
}

/**
 * Structured error information for client display
 * Provides user-friendly error handling with categorization
 */
export interface GameError {
  /** Error category code for programmatic handling */
  code: string;
  /** Human-readable error message for display */
  message: string;
  /** Optional additional error context data */
  details?: unknown;
}

/**
 * Complete player session data for persistence
 * Extends Player with session-specific tracking information
 */
export interface PlayerSession {
  /** Unique session identifier, typically matches socket ID */
  id: string;
  /** Player's chosen display name */
  username: string;
  /** Current socket connection ID for this session */
  socketId: string;
  /** Whether player is currently connected via socket */
  isConnected: boolean;
  /** Timestamp of last activity for cleanup purposes (milliseconds since epoch) */
  lastActivity: number;
  /** Current cumulative score from valid word submissions */
  score: number;
  /** Total number of words submitted (valid and invalid) */
  wordsSubmitted: number;
}

/**
 * Game room/lobby data structure
 * Manages multiplayer lobbies and room state
 */
export interface GameRoom {
  /** Unique room identifier for joining/referencing */
  id: string;
  /** Player ID of the room host (has admin controls) */
  hostId: string;
  /** Array of all players currently in the room */
  players: Player[];
  /** Maximum number of players allowed in this room */
  maxPlayers: number;
  /** Whether a game is currently active in this room */
  isGameActive: boolean;
  /** Current game state if a match is in progress */
  gameState?: GameState;
}

/**
 * Configurable game parameters
 * Defines game rules and constraints for match setup
 */
export interface GameConfig {
  /** Number of columns in the game board grid */
  boardWidth: number;
  /** Number of rows in the game board grid */
  boardHeight: number;
  /** Duration of each round in seconds */
  roundDuration: number;
  /** Maximum number of rounds per match */
  maxRounds: number;
  /** Minimum players required to start a match */
  minPlayers: number;
  /** Maximum players allowed in a single match */
  maxPlayers: number;
}
