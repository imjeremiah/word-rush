/**
 * Word Rush Common Package
 * Shared types and utilities between client and server
 */

// Import types from types.ts
import { GameBoard, LetterTile, PlayerSession, MatchSettings, DifficultyLevel, GameRoom, Player, TileChanges } from './types.js';

// Socket.io event types for type-safe client-server communication
export interface ServerToClientEvents {
  // Server events
  'server:welcome': (data: { message: string; socketId: string }) => void;
  'server:error': (data: { message: string; code?: string }) => void;
  'server:rate-limit': (data: { message: string; retryAfter: number }) => void;
  
  // Word validation events
  'word:valid': (data: { word: string; points: number; score: number; speedBonus?: boolean }) => void;
  'word:invalid': (data: { word: string; reason: string }) => void;
  
  // Board events
  'game:board-update': (data: { board: GameBoard; removedTiles?: { x: number; y: number }[] }) => void;
  'game:initial-board': (data: { board: GameBoard }) => void;
  'game:tile-changes': (data: TileChanges) => void; // New incremental update event
  'board:resync': (data: { board: GameBoard; boardChecksum: string; timeRemaining: number; sequenceNumber: number; syncType: string }) => void;
  
  // Score and game state events
  'game:score-update': (data: { playerId: string; score: number; totalScore: number; speedBonus?: boolean }) => void;
  'game:leaderboard-update': (data: { players: Array<{ id: string; username: string; score: number; difficulty: DifficultyLevel }> }) => void;
  
  // Player session events
  'player:session-update': (data: { session: PlayerSession }) => void;
  'player:reconnect-success': (data: { message: string; session: PlayerSession }) => void;
  'player:reconnect-failed': (data: { message: string }) => void;
  
  // Room and lobby events
  'room:created': (data: { roomId: string; roomCode: string }) => void;
  'room:joined': (data: { room: GameRoom }) => void;
  'room:left': (data: { message: string }) => void;
  'room:player-joined': (data: { player: Player; room: GameRoom }) => void;
  'room:player-left': (data: { playerId: string; room: GameRoom }) => void;
  'room:player-ready': (data: { playerId: string; isReady: boolean; room: GameRoom }) => void;
  'room:settings-updated': (data: { settings: MatchSettings; room: GameRoom }) => void;
  'room:not-found': (data: { message: string }) => void;
  
  // Match flow events
  'match:starting': (data: { countdown: number }) => void;
  'match:started': (data: { board: GameBoard; boardChecksum: string; timeRemaining: number; currentRound: number; totalRounds: number; playerCount: number }) => void;
  'match:round-end': (data: { scores: Array<{ playerId: string; username: string; score: number; roundScore: number }> }) => void;
  'match:finished': (data: { winner: Player; finalScores: Array<{ playerId: string; username: string; totalScore: number }> }) => void;
  'match:timer-update': (data: { timeRemaining: number }) => void;
  
  // Shuffle events
  'shuffle:result': (data: { board: GameBoard; costDeducted: number; wasDead: boolean }) => void;
  'shuffle:failed': (data: { reason: string; currentScore: number; costRequired: number }) => void;
}

export interface ClientToServerEvents {
  // Word submission
  'word:submit': (data: { word: string; tiles: LetterTile[] }) => void;
  
  // Room management
  'room:create': (data: { playerName: string; settings: MatchSettings }) => void;
  'room:join': (data: { roomCode: string; playerName: string }) => void;
  'room:leave': () => void;
  'room:set-ready': (data: { isReady: boolean }) => void;
  'room:update-settings': (data: { settings: MatchSettings }) => void;
  'room:start-match': () => void;
  
  // Game actions
  'game:join': (data: { playerName: string }) => void;
  'game:leave': () => void;
  'game:request-board': () => void;
  'game:shuffle-request': () => void;
  'board:request-resync': () => void;
  
  // Player actions
  'player:reconnect': (data: { sessionId: string; username?: string }) => void;
  'player:set-difficulty': (data: { difficulty: DifficultyLevel }) => void;
  
  // Match flow events
  'match:start-first-round': (data: { roomCode: string }) => void;
  'match:force-end-round': (data: { roomCode: string }) => void;
  'match:start-new-match': (data: { roomCode: string }) => void;
}

export interface InterServerEvents {
  // Future inter-server events will be added here if needed
}

export interface SocketData {
  // Future socket data will be added here
}

// Game-related types (imported from types.ts)
// These are re-exported for convenience

// Utility types and configurations
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

// Default match settings for lobby creation
export const DEFAULT_MATCH_SETTINGS: MatchSettings = {
  totalRounds: 3,
  roundDuration: 120,
  shuffleCost: 10,
  speedBonusMultiplier: 1.5,
  speedBonusWindow: 3,
  deadBoardThreshold: 25,
};

export * from './types.js';
export * from './constants.js';
export * from './theme.js';
