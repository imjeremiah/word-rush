/**
 * Game Event Handlers
 * Handles game-specific events like board requests and game state management
 * Provides board generation and game flow control
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@word-rush/common';
import type { DictionaryModule } from '../services/dictionary.js';
import type { generateBoard } from '../services/board.js';

/**
 * Handle board request from client
 * Processes client requests for new game boards and generates high-quality, validated boards:
 * 1. Uses dictionary service to ensure board contains sufficient valid words
 * 2. Generates board using official Scrabble letter distribution and point values
 * 3. Validates generated board meets minimum word count requirements (10+ words)
 * 4. Sends validated board to requesting client for immediate gameplay
 * @param socket - Socket.io connection from the client requesting a new board
 * @param dictionaryService - Functional dictionary service module for word validation during board generation
 * @param generateBoardFn - Functional board generation module that creates and validates game boards
 * @returns void - Sends game:initial-board event with the generated board data
 */
export function handleBoardRequest(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  dictionaryService: DictionaryModule,
  generateBoardFn: typeof generateBoard
): void {
  const newBoard = generateBoardFn(dictionaryService);
  socket.emit('game:initial-board', { board: newBoard });
} 