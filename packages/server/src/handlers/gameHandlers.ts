/**
 * Game Event Handlers
 * Handles game-specific events like board requests and game state management
 * Provides board generation and game flow control
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@word-rush/common';
import type { DictionaryModule } from '../services/dictionary.js';
import { generateBoard, isBoardDead } from '../services/board.js';
import type { roomService } from '../services/room.js';

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

/**
 * Handle shuffle request from client
 * Processes player requests for board shuffles with cost deduction and dead board detection
 * Checks if current board is "dead" (too few words) and either charges shuffle cost or provides free shuffle
 * @param socket - Socket.io connection from the client requesting shuffle
 * @param roomServiceInstance - Room management service for accessing player and room data
 * @param dictionaryService - Dictionary service for dead board detection and new board generation
 * @param generateBoardFn - Board generation function for creating replacement boards
 * @returns void - Sends shuffle:result with new board or shuffle:failed with error details
 */
export function handleShuffleRequest(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  roomServiceInstance: typeof roomService,
  dictionaryService: DictionaryModule,
  generateBoardFn: typeof generateBoard
): void {
  // Check if player is in a multiplayer room
  const room = roomServiceInstance.getRoomByPlayerId(socket.id);
  if (!room) {
    socket.emit('server:error', {
      message: 'You must be in a room to request a shuffle',
      code: 'NOT_IN_ROOM'
    });
    return;
  }

  // Check if game is active
  if (!room.isGameActive || !room.gameState || room.gameState.matchStatus !== 'active') {
    socket.emit('server:error', {
      message: 'Shuffle only available during active gameplay',
      code: 'GAME_NOT_ACTIVE'
    });
    return;
  }

  // Find player in room
  const player = room.players.find(p => p.id === socket.id);
  if (!player) {
    socket.emit('server:error', {
      message: 'Player not found in room',
      code: 'PLAYER_NOT_IN_ROOM'
    });
    return;
  }

  // Check if current board exists
  if (!room.gameState.board) {
    socket.emit('server:error', {
      message: 'No active board to shuffle',
      code: 'NO_BOARD'
    });
    return;
  }

  // Check if board is dead (has too few possible words)
  const boardIsDead = isBoardDead(
    room.gameState.board,
    dictionaryService,
    room.settings.deadBoardThreshold
  );

  let costDeducted = 0;
  
  // If board is not dead, charge shuffle cost
  if (!boardIsDead) {
    const shuffleCost = room.settings.shuffleCost;
    
    if (player.score < shuffleCost) {
      socket.emit('shuffle:failed', {
        reason: 'Insufficient points for shuffle',
        currentScore: player.score,
        costRequired: shuffleCost
      });
      return;
    }
    
    // Deduct shuffle cost
    player.score -= shuffleCost;
    costDeducted = shuffleCost;
  }

  // Generate new board
  const newBoard = generateBoardFn(dictionaryService);
  
  // Update game state board
  room.gameState.board = newBoard;

  // Send shuffle result to requesting player only
  socket.emit('shuffle:result', {
    board: newBoard,
    costDeducted,
    wasDead: boardIsDead
  });

  // Broadcast new board to all other players in room
  socket.to(room.roomCode).emit('game:board-update', {
    board: newBoard
  });

  // If cost was deducted, send score update
  if (costDeducted > 0) {
    const scoreUpdateData = {
      playerId: socket.id,
      score: -costDeducted,
      totalScore: player.score
    };
    
    socket.to(room.roomCode).emit('game:score-update', scoreUpdateData);
    socket.emit('game:score-update', scoreUpdateData);

    // Update leaderboard
    const leaderboard = room.players.map(p => ({
      id: p.id,
      username: p.username,
      score: p.score,
      difficulty: p.difficulty || 'medium' as import('@word-rush/common').DifficultyLevel
    })).sort((a, b) => b.score - a.score);

    socket.to(room.roomCode).emit('game:leaderboard-update', { players: leaderboard });
    socket.emit('game:leaderboard-update', { players: leaderboard });
  }

  console.log(`[${new Date().toISOString()}] Player ${player.username} requested shuffle in room ${room.roomCode} - Cost: ${costDeducted}, Was Dead: ${boardIsDead}`);
} 