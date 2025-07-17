/**
 * Client-Side Zod Validation Schemas
 * Provides runtime validation for server-to-client socket communication
 */

import { z } from 'zod';

// Base schemas for common data structures
const PlayerSessionSchema = z.object({
  id: z.string(),
  username: z.string(),
  socketId: z.string(),
  isConnected: z.boolean(),
  lastActivity: z.number(),
  score: z.number(),
  wordsSubmitted: z.number(),
});

const LetterTileSchema = z.object({
  letter: z.string().length(1),
  points: z.number().min(0).max(10),
  x: z.number().min(0),
  y: z.number().min(0),
  id: z.string().min(1),
});

const GameBoardSchema = z.object({
  tiles: z.array(z.array(LetterTileSchema)),
  width: z.number().min(1),
  height: z.number().min(1),
});

const DifficultyLevelSchema = z.enum(['easy', 'medium', 'hard', 'extreme']);

const PlayerSchema = z.object({
  id: z.string(),
  username: z.string(),
  score: z.number(),
  isConnected: z.boolean(),
  difficulty: DifficultyLevelSchema.optional(),
  isReady: z.boolean().optional(),
  lastWordTimestamp: z.number().optional(),
  roundScore: z.number().optional(),
});

const MatchSettingsSchema = z.object({
  totalRounds: z.number().min(1),
  roundDuration: z.number().min(15).max(300), // Allow 15 seconds to 5 minutes for flexible game durations
  shuffleCost: z.number().min(0),
  speedBonusMultiplier: z.number().min(1),
  speedBonusWindow: z.number().min(1),
  deadBoardThreshold: z.number().min(1),
});

const GameRoomSchema = z.object({
  id: z.string(),
  roomCode: z.string(),
  hostId: z.string(),
  players: z.array(PlayerSchema),
  maxPlayers: z.number(),
  isGameActive: z.boolean(),
  settings: MatchSettingsSchema,
  createdAt: z.number(),
  lastActivity: z.number(),
});



// Server to client event schemas
export const ServerEventSchemas = {
  'server:welcome': z.object({
    message: z.string(),
    socketId: z.string(),
  }),

  'server:error': z.object({
    message: z.string(),
    code: z.string().optional(),
  }),

  'server:rate-limit': z.object({
    message: z.string(),
    retryAfter: z.number(),
  }),

  'word:valid': z.object({
    word: z.string(),
    points: z.number().min(0),
    score: z.number().min(0),
    speedBonus: z.boolean().optional(),
  }),

  'word:invalid': z.object({
    word: z.string(),
    reason: z.string(),
  }),

  'game:board-update': z.object({
    board: GameBoardSchema,
    removedTiles: z.array(z.object({
      x: z.number(),
      y: z.number(),
    })).optional(),
  }),

  'game:initial-board': z.object({
    board: GameBoardSchema,
  }),

  'game:score-update': z.object({
    playerId: z.string(),
    score: z.number(),
    totalScore: z.number(),
    speedBonus: z.boolean().optional(),
  }),

  'game:leaderboard-update': z.object({
    players: z.array(z.object({
      id: z.string(),
      username: z.string(),
      score: z.number(),
      difficulty: DifficultyLevelSchema.optional(),
    })),
  }),

  'player:session-update': z.object({
    session: PlayerSessionSchema,
  }),

  'player:reconnect-success': z.object({
    message: z.string(),
    session: PlayerSessionSchema,
  }),

  'player:reconnect-failed': z.object({
    message: z.string(),
  }),

  // Room events
  'room:created': z.object({
    roomId: z.string(),
    roomCode: z.string(),
  }),

  'room:joined': z.object({
    room: GameRoomSchema,
  }),

  'room:left': z.object({
    message: z.string(),
  }),

  'room:player-joined': z.object({
    player: PlayerSchema,
    room: GameRoomSchema,
  }),

  'room:player-left': z.object({
    playerId: z.string(),
    room: GameRoomSchema,
  }),

  'room:player-ready': z.object({
    playerId: z.string(),
    isReady: z.boolean(),
    room: GameRoomSchema,
  }),

  'room:settings-updated': z.object({
    settings: MatchSettingsSchema,
    room: GameRoomSchema,
  }),

  'room:not-found': z.object({
    message: z.string(),
  }),

  // Match events
  'match:starting': z.object({
    countdown: z.number(),
  }),

  'match:started': z.object({
    board: GameBoardSchema,
    boardChecksum: z.string(),
    timeRemaining: z.number(),
    currentRound: z.number(),
    totalRounds: z.number(),
    playerCount: z.number(),
  }),

  'match:round-end': z.object({
    roundNumber: z.number(),
    scores: z.array(z.object({
      playerId: z.string(),
      playerName: z.string().optional().default('Unknown'),  // Fix: Handle missing/undefined playerName
      roundScore: z.number().optional().default(0),
      totalScore: z.number().optional().default(0),
      difficulty: z.string().optional().default('medium')
    })),
    isMatchComplete: z.boolean(),
  }),

  'match:finished': z.object({
    winner: z.object({
      id: z.string(),
      username: z.string().optional().default('Unknown'),
      isConnected: z.boolean().optional().default(true),
      score: z.number().optional().default(0)
    }).nullable(),
    finalScores: z.array(z.object({
      rank: z.number(),
      playerId: z.string(),
      playerName: z.string().optional().default('Unknown'),  // Fix: Handle missing/undefined
      roundScore: z.number().optional().default(0),
      totalScore: z.number().optional().default(0),
      difficulty: z.string().optional().default('medium')
    })),
    totalRounds: z.number(),
  }),

  'match:timer-update': z.object({
    timeRemaining: z.number(),
  }),

  // Shuffle events
  'shuffle:result': z.object({
    board: GameBoardSchema,
    costDeducted: z.number(),
    wasDead: z.boolean(),
  }),

  'shuffle:failed': z.object({
    reason: z.string(),
    currentScore: z.number(),
    costRequired: z.number(),
  }),

  'game:tile-changes': z.object({
    removedPositions: z.array(z.object({
      x: z.number(),
      y: z.number(),
    })),
    fallingTiles: z.array(z.object({
      from: z.object({ x: z.number(), y: z.number() }),
      to: z.object({ x: z.number(), y: z.number() }),
      letter: z.string(),
      points: z.number(),
      id: z.string(),
    })),
    newTiles: z.array(z.object({
      position: z.object({ x: z.number(), y: z.number() }),
      letter: z.string(),
      points: z.number(),
      id: z.string(),
    })),
    sequenceNumber: z.number(),
    timestamp: z.number(),
  }),
} as const;

// Type helper to get the inferred type of a schema
export type ServerEventData<T extends keyof typeof ServerEventSchemas> = z.infer<typeof ServerEventSchemas[T]>;

/**
 * Validate incoming server event data
 * @param eventName - The name of the server event
 * @param data - The data to validate
 * @returns Validation result with typed data or error
 */
export function validateServerEvent<T extends keyof typeof ServerEventSchemas>(
  eventName: T,
  data: unknown
): { success: true; data: ServerEventData<T> } | { success: false; error: string } {
  try {
    const schema = ServerEventSchemas[eventName];
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data as ServerEventData<T> };
    } else {
      const errorMessages = result.error.issues.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      console.warn(`Server event validation failed for ${eventName}:`, errorMessages);
      return { success: false, error: errorMessages };
    }
  } catch (error) {
    console.error(`Validation error for ${eventName}:`, error);
    return { success: false, error: 'Validation error occurred' };
  }
}

/**
 * Create a wrapper for socket event handlers that validates incoming data
 * @param eventName - The name of the server event
 * @param handler - The event handler function
 * @returns Wrapped handler with validation
 */
export function withServerEventValidation<T extends keyof typeof ServerEventSchemas>(
  eventName: T,
  handler: (data: ServerEventData<T>) => void
) {
  return (data: unknown) => {
    try {
      const validation = validateServerEvent(eventName, data);
      if (validation.success) {
        handler(validation.data);
      } else {
        console.error(`Invalid data received for ${eventName}:`, validation.error);
        // Could emit an error notification here
      }
    } catch (error) {
      console.error(`Error in socket handler for ${eventName}:`, error);
      // Could emit a notification about the error or fallback to lobby
    }
  };
} 