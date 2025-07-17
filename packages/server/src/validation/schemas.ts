/**
 * Zod Validation Schemas for Socket Events
 * Provides runtime validation for all client-server socket communication
 */

import { z } from 'zod';

// Letter tile schema
const LetterTileSchema = z.object({
  letter: z.string().length(1),
  points: z.number().min(0).max(10),
  x: z.number().min(0),
  y: z.number().min(0),
  id: z.string().min(1),
});

// Match settings schema
const MatchSettingsSchema = z.object({
  totalRounds: z.number().min(1).max(10),
  roundDuration: z.number().min(15).max(300), // 15 seconds to 5 minutes for flexible game durations
  shuffleCost: z.number().min(0).max(50),
  speedBonusMultiplier: z.number().min(1).max(3),
  speedBonusWindow: z.number().min(1).max(10),
  deadBoardThreshold: z.number().min(1).max(30),
});

// Difficulty level schema
const DifficultyLevelSchema = z.enum(['easy', 'medium', 'hard', 'extreme']);

// Client to server event schemas
export const ClientEventSchemas = {
  // Word submission
  'word:submit': z.object({
    word: z.string().min(2).max(20).regex(/^[A-Za-z]+$/, 'Word must contain only letters'),
    tiles: z.array(LetterTileSchema).min(2).max(20),
  }),

  // Room management
  'room:create': z.object({
    playerName: z.string().min(1).max(50).trim(),
    settings: MatchSettingsSchema,
  }),

  'room:join': z.object({
    roomCode: z.string().length(4).regex(/^[A-Z0-9]+$/, 'Room code must be 4 uppercase characters or numbers'),
    playerName: z.string().min(1).max(50).trim(),
  }),

  'room:leave': z.undefined(),

  'room:set-ready': z.object({
    isReady: z.boolean(),
  }),

  'room:update-settings': z.object({
    settings: MatchSettingsSchema,
  }),

  'room:start-match': z.undefined(),

  // Game actions
  'game:join': z.object({
    playerName: z.string().min(1).max(50).trim(),
  }),

  'game:leave': z.undefined(),

  'game:request-board': z.undefined(),

  'game:shuffle-request': z.undefined(),

  // Player actions
  'player:reconnect': z.object({
    sessionId: z.string().min(1),
    username: z.string().min(1).max(50).optional(),
  }),

  'player:set-difficulty': z.object({
    difficulty: DifficultyLevelSchema,
  }),

  // Match flow events
  'match:start-first-round': z.object({
    roomCode: z.string().length(4),
  }),

  'match:force-end-round': z.object({
    roomCode: z.string().length(4),
  }),

  'match:start-new-match': z.object({
    roomCode: z.string().length(4),
  }),
} as const;

// Type helper to get the inferred type of a schema
export type EventData<T extends keyof typeof ClientEventSchemas> = 
  typeof ClientEventSchemas[T] extends z.ZodUndefined 
    ? undefined 
    : z.infer<typeof ClientEventSchemas[T]>;

// Validation function
export function validateSocketEvent<T extends keyof typeof ClientEventSchemas>(
  eventName: T,
  data: unknown
): { success: true; data: EventData<T> } | { success: false; error: string } {
  try {
    const schema = ClientEventSchemas[eventName];
    
    if (schema instanceof z.ZodUndefined) {
      if (data !== undefined) {
        return { success: false, error: 'Event should not have data' };
      }
      return { success: true, data: undefined as EventData<T> };
    }
    
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data as EventData<T> };
    } else {
      const errorMessages = result.error.issues.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      return { success: false, error: errorMessages };
    }
  } catch (error) {
    return { success: false, error: 'Validation error occurred' };
  }
} 