/**
 * Game Event Handlers
 * Handles game-specific events like board requests and game state management
 * Provides board generation and game flow control
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@word-rush/common';
import { BoardService } from '../services/board.js';

/**
 * Handle board request from client
 * Generates and sends a new game board to the requesting player
 * @param socket - Socket connection to the client
 * @param boardService - Board service for generating game boards
 */
export function handleBoardRequest(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  boardService: BoardService
): void {
  const newBoard = boardService.generateBoard();
  socket.emit('game:initial-board', { board: newBoard });
} 