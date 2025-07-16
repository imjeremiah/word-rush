/**
 * Additional shared types for Word Rush
 * Core type definitions used across client and server for type-safe communication
 */

/**
 * Tile movement data for cascade animations
 * Represents a single tile moving from one position to another
 */
export interface TileMovement {
  /** Source position */
  from: { x: number; y: number };
  /** Destination position */
  to: { x: number; y: number };
  /** Letter content of the moving tile */
  letter: string;
  /** Point value of the moving tile */
  points: number;
  /** Unique identifier for the tile */
  id: string;
}

/**
 * New tile data for cascade animations
 * Represents a new tile appearing at a position
 */
export interface NewTileData {
  /** Position where the tile appears */
  position: { x: number; y: number };
  /** Letter content of the new tile */
  letter: string;
  /** Point value of the new tile */
  points: number;
  /** Unique identifier for the tile */
  id: string;
}

/**
 * Complete tile change data for incremental board updates
 * Contains all information needed to animate board changes without full regeneration
 */
export interface TileChanges {
  /** Positions of tiles that were removed */
  removedPositions: { x: number; y: number }[];
  /** Tiles that fell down due to gravity */
  fallingTiles: TileMovement[];
  /** New tiles that appeared at the top */
  newTiles: NewTileData[];
  /** Sequence number for synchronization */
  sequenceNumber: number;
  /** Timestamp when changes were calculated */
  timestamp: number;
}

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
  /** Player's chosen difficulty level affecting minimum word length and score multiplier */
  difficulty?: DifficultyLevel;
  /** Whether the player is ready to start the match (lobby state) */
  isReady?: boolean;
  /** Timestamp of last valid word submission for speed bonus calculation */
  lastWordTimestamp?: number;
  /** Current round score (resets each round) */
  roundScore?: number;
  /** Number of crowns earned (match wins) during this session for King of the Hill progression */
  crowns?: number;
}

/**
 * Match configuration settings for lobby setup
 * Defines the rules and parameters for a multiplayer match
 * 🚀 PHASE 5A: Enhanced with advanced game mode support
 */
export interface MatchSettings {
  /** Number of rounds in the match (e.g., Best of 3) */
  totalRounds: number;
  /** Duration of each round in seconds */
  roundDuration: number;
  /** Cost in points to request a shuffle (when board is not dead) */
  shuffleCost: number;
  /** Speed bonus multiplier for rapid word submissions */
  speedBonusMultiplier: number;
  /** Time window in seconds for speed bonus eligibility */
  speedBonusWindow: number;
  /** Minimum number of possible words before a board is considered "dead" */
  deadBoardThreshold: number;
  /** Advanced game mode for themed or special gameplay */
  gameMode: import('./constants.js').GameMode;
}

/**
 * Difficulty level configuration
 * Each difficulty affects minimum word length and score multiplier
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';

/**
 * Match status enumeration
 * Tracks the current state of a multiplayer match
 */
export type MatchStatus = 'lobby' | 'starting' | 'active' | 'round-end' | 'finished';

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
  /** Current match status */
  matchStatus: MatchStatus;
  /** Current game board state */
  board?: GameBoard;
  /** Match configuration settings */
  settings: MatchSettings;
  /** Round start timestamp for timing calculations */
  roundStartTime?: number;
  /** Match winner if game is finished */
  winner?: Player;
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
  /** Number of crowns earned (match wins) during this session for King of the Hill progression */
  crowns: number;
}

/**
 * Game room/lobby data structure
 * Manages multiplayer lobbies and room state
 */
export interface GameRoom {
  /** Unique room identifier for joining/referencing */
  id: string;
  /** Shareable room code for easy joining (e.g., "ABCD") */
  roomCode: string;
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
  /** Match configuration settings for this room */
  settings: MatchSettings;
  /** Timestamp when the room was created */
  createdAt: number;
  /** Timestamp of last activity for cleanup */
  lastActivity: number;
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
