/**
 * Match Flow Event Handlers
 * Handles round timers, match transitions, and game flow events for multiplayer matches
 * Manages the complete match lifecycle from round start to match completion
 */

import { Server, Socket } from 'socket.io';
import { roomService } from '../services/room.js';

/**
 * Handle starting the first round of a match
 * Called when host starts the game from lobby
 */
export function handleMatchStartFirstRound(
  socket: Socket,
  data: { roomCode: string },
  io: Server,
  dictionaryService: import('../services/dictionary.js').DictionaryModule
): void {
  console.log(`[${socket.id}] Starting first round in room: ${data.roomCode}`);
  
  const room = roomService.getRoom(data.roomCode);
  if (!room) {
    socket.emit('server:error', { message: 'Room not found', code: 'ROOM_NOT_FOUND' });
    return;
  }

  // Verify the socket is in the room
  const player = room.players.find(p => p.id === socket.id);
  if (!player) {
    socket.emit('server:error', { message: 'You are not in this room', code: 'NOT_IN_ROOM' });
    return;
  }

  // Start the first round
  roomService.startRound(data.roomCode, io, dictionaryService);
}

/**
 * Handle force ending current round (admin action)
 */
export function handleMatchForceEndRound(
  socket: Socket,
  data: { roomCode: string },
  io: Server,
  dictionaryService: import('../services/dictionary.js').DictionaryModule
): void {
  console.log(`[${socket.id}] Force ending round in room: ${data.roomCode}`);
  
  const room = roomService.getRoom(data.roomCode);
  if (!room) {
    socket.emit('server:error', { message: 'Room not found', code: 'ROOM_NOT_FOUND' });
    return;
  }

  // Verify the socket is the host
  if (room.hostId !== socket.id) {
    socket.emit('server:error', { message: 'Only the host can force end rounds', code: 'UNAUTHORIZED' });
    return;
  }

  roomService.forceEndRound(data.roomCode, io, dictionaryService);
}

/**
 * Handle starting a new match from lobby
 */
export function handleMatchStartNewMatch(
  socket: Socket,
  data: { roomCode: string },
  io: Server,
  dictionaryService: import('../services/dictionary.js').DictionaryModule
): void {
  console.log(`[${socket.id}] Starting new match in room: ${data.roomCode}`);
  
  const room = roomService.getRoom(data.roomCode);
  if (!room) {
    socket.emit('server:error', { message: 'Room not found', code: 'ROOM_NOT_FOUND' });
    return;
  }

  // Verify the socket is the host
  if (room.hostId !== socket.id) {
    socket.emit('server:error', { message: 'Only the host can start matches', code: 'UNAUTHORIZED' });
    return;
  }

  // Start match using existing room service method
  const updatedRoom = roomService.startMatch(data.roomCode, socket.id);
  if (!updatedRoom) {
    socket.emit('server:error', { message: 'Failed to start match', code: 'MATCH_START_FAILED' });
    return;
  }

  // Start the first round
  roomService.startRound(data.roomCode, io, dictionaryService);
}

/**
 * Handle socket disconnection during active match
 */
export function handleMatchDisconnect(
  socket: Socket,
  io: Server,
  dictionaryService: import('../services/dictionary.js').DictionaryModule
): void {
  try {
    const room = roomService.getRoomByPlayerId(socket.id);
    if (room && room.gameState?.isGameActive) {
      console.log(`[${socket.id}] Player disconnected during active match in room: ${room.id}`);
      
      // If host disconnects during match, transfer host to another player
      if (room.hostId === socket.id && room.players.length > 1) {
        const newHost = room.players.find(p => p.id !== socket.id);
        if (newHost) {
          room.hostId = newHost.id;
          io.to(room.id).emit('room:hostChanged', {
            newHostId: newHost.id,
            newHostName: newHost.username || 'Unknown'
          });
        }
      }

      // Remove player from room
      roomService.leaveRoom(room.id, socket.id);
      
      // If room becomes empty during match, end the match
      if (room.players.length === 0) {
        roomService.forceEndRound(room.id, io, dictionaryService);
      }
    }
  } catch (error) {
    console.error('Error handling disconnect during match:', error);
  }
} 