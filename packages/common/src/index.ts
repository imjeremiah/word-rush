/**
 * Word Rush Common Package
 * Shared types and utilities between client and server
 */

// Import types from types.ts
import { WordValidationResult, GameBoard, LetterTile } from './types';

// Socket.io event types for type-safe client-server communication
export interface ServerToClientEvents {
  'server:welcome': (data: { message: string; socketId: string }) => void;
  'server:error': (data: { message: string; code?: string }) => void;
  'server:rate-limit': (data: { message: string; retryAfter: number }) => void;
  'word:validation-result': (data: WordValidationResult) => void;
  'game:board-update': (data: { board: GameBoard }) => void;
}

export interface ClientToServerEvents {
  'word:submit': (data: { word: string; tiles: LetterTile[] }) => void;
  'game:join': (data: { playerName: string }) => void;
  'game:leave': () => void;
}

export interface InterServerEvents {
  // Future inter-server events will be added here if needed
}

export interface SocketData {
  // Future socket data will be added here
}

// Game-related types (imported from types.ts)
// These are re-exported for convenience

// Utility types
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';

export interface DifficultyConfig {
  minWordLength: number;
  scoreMultiplier: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { minWordLength: 2, scoreMultiplier: 1.0 },
  medium: { minWordLength: 3, scoreMultiplier: 1.2 },
  hard: { minWordLength: 4, scoreMultiplier: 1.5 },
  extreme: { minWordLength: 5, scoreMultiplier: 2.0 },
};

export * from './types';
export * from './constants';
