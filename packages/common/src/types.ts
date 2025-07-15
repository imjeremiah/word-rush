/**
 * Additional shared types for Word Rush
 */

// Player types
export interface Player {
  id: string;
  username: string;
  score: number;
  isConnected: boolean;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  isGameActive: boolean;
}

// Letter tile types
export interface LetterTile {
  letter: string;
  points: number;
  x: number;
  y: number;
  id: string;
}

export interface GameBoard {
  tiles: LetterTile[][];
  width: number;
  height: number;
}

// Word validation types
export interface WordSubmission {
  word: string;
  tiles: LetterTile[];
  playerId: string;
  timestamp: number;
}

export interface WordValidationResult {
  isValid: boolean;
  word: string;
  points: number;
  reason?: string;
  playerId: string;
  timestamp: number;
}

// Error types
export interface GameError {
  code: string;
  message: string;
  details?: unknown;
}

// Session types
export interface PlayerSession {
  id: string;
  username: string;
  socketId: string;
  isConnected: boolean;
  lastActivity: number;
  score: number;
  wordsSubmitted: number;
}

// Game room types
export interface GameRoom {
  id: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  isGameActive: boolean;
  gameState?: GameState;
}

// Configuration types
export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  roundDuration: number; // in seconds
  maxRounds: number;
  minPlayers: number;
  maxPlayers: number;
}
