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

// Client to server event schemas
export const ClientEventSchemas = {
  'word:submit': z.object({
    word: z.string().min(2).max(20).regex(/^[A-Za-z]+$/, 'Word must contain only letters'),
    tiles: z.array(LetterTileSchema).min(2).max(20),
  }),

  'game:join': z.object({
    playerName: z.string().min(1).max(50).trim(),
  }),

  'game:leave': z.undefined(),

  'game:request-board': z.undefined(),

  'player:reconnect': z.object({
    sessionId: z.string().min(1),
    username: z.string().min(1).max(50).optional(),
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