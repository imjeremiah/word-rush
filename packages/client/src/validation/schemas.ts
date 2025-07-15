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
  }),

  'word:invalid': z.object({
    word: z.string(),
    reason: z.string(),
  }),

  'game:board-update': z.object({
    board: GameBoardSchema,
  }),

  'game:initial-board': z.object({
    board: GameBoardSchema,
  }),

  'game:score-update': z.object({
    playerId: z.string(),
    score: z.number(),
    totalScore: z.number(),
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
    const validation = validateServerEvent(eventName, data);
    if (validation.success) {
      handler(validation.data);
    } else {
      console.error(`Invalid data received for ${eventName}:`, validation.error);
      // Could emit an error notification here
    }
  };
} 