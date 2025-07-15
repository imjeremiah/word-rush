/**
 * Word Submission Handlers
 * Handles word validation and submission events from clients
 * Includes path validation, dictionary checking, and scoring
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, LetterTile } from '@word-rush/common';
import { DictionaryService } from '../services/dictionary.js';
import { BoardService } from '../services/board.js';
import { SessionService } from '../services/session.js';

/**
 * Validate that a sequence of tiles forms a valid path
 * @param tiles - Array of LetterTile objects representing the path
 * @returns Validation result with success status and optional error reason
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
 * Validates tile path, checks dictionary, updates score, and sends appropriate response
 * @param socket - Socket connection to the client
 * @param data - Word submission data containing word and tiles
 * @param services - Required services (dictionary, board, session)
 */
export function handleWordSubmit(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { word: string; tiles: LetterTile[] },
  services: {
    dictionaryService: DictionaryService;
    boardService: BoardService;
    sessionService: SessionService;
  }
): void {
  const { word, tiles } = data;
  const { dictionaryService, boardService, sessionService } = services;
  
  // Get player session
  const session = sessionService.getPlayerSession(socket.id);
  if (!session) {
    socket.emit('server:error', { 
      message: 'Player session not found',
      code: 'NO_SESSION'
    });
    return;
  }

  // Validate tile path
  const pathValidation = validateTilePath(tiles);
  if (!pathValidation.isValid) {
    socket.emit('word:invalid', {
      word,
      reason: pathValidation.reason || 'Invalid path'
    });
    return;
  }

  // Validate word using dictionary service
  const isDictionaryValid = dictionaryService.isValidWord(word);
  
  if (isDictionaryValid) {
    // Calculate points using BoardService
    const points = boardService.calculateWordScore(word);
    
    // Update player session score
    sessionService.updatePlayerSession(socket.id, {
      score: session.score + points,
      wordsSubmitted: session.wordsSubmitted + 1
    });

    // Get updated session
    const updatedSession = sessionService.getPlayerSession(socket.id);
    if (updatedSession) {
      // Send score update
      socket.emit('game:score-update', {
        playerId: socket.id,
        score: points,
        totalScore: updatedSession.score
      });
      
      // Send updated session to client so UI can update
      socket.emit('player:session-update', { session: updatedSession });
      
      // Send valid word confirmation
      socket.emit('word:valid', {
        word,
        points,
        score: updatedSession.score
      });
    }
  } else {
    // Send invalid word notification
    socket.emit('word:invalid', {
      word,
      reason: 'Word not found in dictionary'
    });
  }
} 