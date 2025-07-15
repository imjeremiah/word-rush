/**
 * Word Submission Handlers
 * Handles word validation and submission events from clients
 * Includes path validation, dictionary checking, and scoring
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, LetterTile } from '@word-rush/common';
import type { DictionaryModule } from '../services/dictionary.js';
import { calculateWordScore, generateBoard } from '../services/board.js';

// Type import only to avoid naming conflicts
type SessionServiceType = typeof import('../services/session.js').sessionService;

/**
 * Validate that a sequence of tiles forms a valid path
 * Ensures the path follows game rules:
 * - Must contain at least 2 tiles
 * - No tile position can be reused within the path
 * - Each consecutive tile must be adjacent (including diagonally)
 * @param tiles - Array of LetterTile objects representing the player's selected path
 * @returns Validation result object containing success status and optional error reason
 */
function validateTilePath(tiles: LetterTile[]): { isValid: boolean; reason?: string } {
  if (!tiles || tiles.length < 2) {
    return { isValid: false, reason: 'Path must contain at least 2 tiles' };
  }

  // Check for duplicate tiles by position
  const usedPositions = new Set<string>();
  for (const tile of tiles) {
    const positionKey = `${tile.x}-${tile.y}`;
    if (usedPositions.has(positionKey)) {
      return { isValid: false, reason: 'Path cannot reuse the same tile' };
    }
    usedPositions.add(positionKey);
  }

  // Check adjacency between consecutive tiles
  for (let i = 1; i < tiles.length; i++) {
    const prevTile = tiles[i - 1];
    const currentTile = tiles[i];
    
    const rowDiff = Math.abs(prevTile.y - currentTile.y);
    const colDiff = Math.abs(prevTile.x - currentTile.x);
    
    // Tiles must be adjacent (including diagonally)
    if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
      return { isValid: false, reason: 'Tiles must be adjacent in the path' };
    }
  }

  return { isValid: true };
}

/**
 * Handle word submission from client
 * Processes player word submissions through the complete validation and scoring pipeline:
 * 1. Validates player session exists
 * 2. Validates tile path follows adjacency rules
 * 3. Checks word against official tournament dictionary
 * 4. Calculates and awards points based on Scrabble scoring
 * 5. Updates player session with new score and word count
 * 6. Sends appropriate success/failure response to client
 * @param socket - Socket.io connection to the client submitting the word
 * @param data - Word submission data containing the word string and tile path
 * @param data.word - The word formed by the player (2-20 characters, letters only)
 * @param data.tiles - Array of LetterTile objects representing the path taken
 * @param services - Required service modules for processing the submission
 * @param services.dictionaryService - Service for validating words against tournament list
 * @param services.generateBoard - Function for generating new game boards (unused in this handler)
 * @param services.sessionService - Service for managing player sessions and scores
 * @returns void - Communicates results via socket events (word:valid, word:invalid, server:error)
 */
export function handleWordSubmit(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { word: string; tiles: LetterTile[] },
  services: {
    dictionaryService: DictionaryModule;
    generateBoard: typeof generateBoard;
    sessionService: SessionServiceType;
  }
): void {
  const { word, tiles } = data;
  const { dictionaryService, sessionService } = services;
  
  // Start latency measurement
  const startTime = Date.now();
  
  // Get player session
  const session = sessionService.getPlayerSession(socket.id);
  if (!session) {
    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`[${new Date().toISOString()}] Word validation latency: ${latency}ms (NO_SESSION error for "${word}")`);
    
    socket.emit('server:error', { 
      message: 'Player session not found',
      code: 'NO_SESSION'
    });
    return;
  }

  // Validate tile path
  const pathValidation = validateTilePath(tiles);
  if (!pathValidation.isValid) {
    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`[${new Date().toISOString()}] Word validation latency: ${latency}ms (PATH_INVALID for "${word}": ${pathValidation.reason})`);
    
    (socket as any).emit('word:invalid', {
      word,
      reason: pathValidation.reason || 'Invalid path'
    });
    return;
  }

  // Validate word using dictionary service
  const isDictionaryValid = dictionaryService.isValidWord(word);
  
  if (isDictionaryValid) {
    // Calculate points using board functions
    const points = calculateWordScore(word);
    
    // Update player session score
    sessionService.updatePlayerSession(socket.id, {
      score: session.score + points,
      wordsSubmitted: session.wordsSubmitted + 1
    });

    // Get updated session
    const updatedSession = sessionService.getPlayerSession(socket.id);
    if (updatedSession) {
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      // Log latency with performance assessment
      const performanceStatus = latency > 150 ? 'SLOW' : 'OK';
      console.log(`[${new Date().toISOString()}] Word validation latency: ${latency}ms (${performanceStatus}) - Valid word "${word}" (${points} points)`);
      
      // Send score update
      socket.emit('game:score-update', {
        playerId: socket.id,
        score: points,
        totalScore: updatedSession.score
      });
      
      // Send updated session to client so UI can update
      socket.emit('player:session-update', { session: updatedSession });
      
      // Send valid word confirmation
      (socket as any).emit('word:valid', {
        word,
        points,
        score: updatedSession.score
      });
    }
  } else {
    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`[${new Date().toISOString()}] Word validation latency: ${latency}ms (DICTIONARY_INVALID for "${word}")`);
    
    // Send invalid word notification
    (socket as any).emit('word:invalid', {
      word,
      reason: 'Word not found in dictionary'
    });
  }
} 