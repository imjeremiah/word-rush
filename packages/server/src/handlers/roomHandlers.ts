/**
 * Room Event Handlers
 * Handles all room-related socket events including creation, joining, ready states, and match starting
 * Manages Socket.io room broadcasting and real-time lobby updates
 */

import { Socket } from 'socket.io';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  MatchSettings,
  DEFAULT_MATCH_SETTINGS,
  DifficultyLevel
} from '@word-rush/common';
import type { roomService } from '../services/room.js';
import type { generateBoard } from '../services/board.js';
import type { DictionaryModule } from '../services/dictionary.js';

type RoomServiceType = typeof roomService;

/**
 * Handle room creation request from client
 * Creates a new multiplayer lobby with unique room code and adds host to Socket.io room
 * Validates input parameters and initializes room with default or custom settings
 * @param socket - Socket.io connection from the host player
 * @param data - Room creation request data
 * @param data.playerName - Host's chosen username (1-50 characters)
 * @param data.settings - Match configuration settings (optional, uses defaults)
 * @param roomServiceInstance - Room management service for creating and tracking rooms
 * @returns void - Sends room:created event with room code or server:error on failure
 */
export function handleRoomCreate(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { playerName: string; settings: MatchSettings },
  roomServiceInstance: RoomServiceType
): void {
  try {
    const { playerName, settings = DEFAULT_MATCH_SETTINGS } = data;
    
    // Validate input
    if (!playerName || playerName.trim().length === 0) {
      socket.emit('server:error', {
        message: 'Player name is required',
        code: 'INVALID_PLAYER_NAME'
      });
      return;
    }

    // Leave any existing room first
    const existingRoom = roomServiceInstance.getRoomByPlayerId(socket.id);
    if (existingRoom) {
      socket.leave(existingRoom.roomCode);
      roomServiceInstance.leaveRoom(existingRoom.roomCode, socket.id);
    }

    // Create the room
    const room = roomServiceInstance.createRoom(socket.id, playerName.trim(), settings);
    
    // Join the Socket.io room for broadcasting
    socket.join(room.roomCode);
    
    // Send confirmation to the host
    socket.emit('room:created', {
      roomId: room.id,
      roomCode: room.roomCode
    });

    // Send room state to the host
    socket.emit('room:joined', { room });

    console.log(`[${new Date().toISOString()}] Room ${room.roomCode} created by ${playerName}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error creating room:`, error);
    socket.emit('server:error', {
      message: 'Failed to create room',
      code: 'ROOM_CREATE_ERROR'
    });
  }
}

/**
 * Handle room join request from client
 * Adds player to existing room and notifies all room members of the new player
 * Validates room exists, has space, and isn't in an active game
 * @param socket - Socket.io connection from the joining player
 * @param data - Room join request data
 * @param data.roomCode - 4-character room code to join (case insensitive)
 * @param data.playerName - Joining player's chosen username (1-50 characters)
 * @param roomServiceInstance - Room management service for joining rooms
 * @returns void - Sends room:joined to player and room:player-joined to room members or error events
 */
export function handleRoomJoin(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { roomCode: string; playerName: string },
  roomServiceInstance: RoomServiceType
): void {
  try {
    const { roomCode, playerName } = data;
    
    // Validate input
    if (!roomCode || !playerName || playerName.trim().length === 0) {
      socket.emit('server:error', {
        message: 'Room code and player name are required',
        code: 'INVALID_INPUT'
      });
      return;
    }

    // Leave any existing room first
    const existingRoom = roomServiceInstance.getRoomByPlayerId(socket.id);
    if (existingRoom) {
      socket.leave(existingRoom.roomCode);
      roomServiceInstance.leaveRoom(existingRoom.roomCode, socket.id);
      
      // Notify the old room
      socket.to(existingRoom.roomCode).emit('room:player-left', {
        playerId: socket.id,
        room: existingRoom
      });
    }

    // Attempt to join the room
    const joinResult = roomServiceInstance.joinRoom(roomCode.toUpperCase(), socket.id, playerName.trim());
    
    if (!joinResult.success) {
      socket.emit('room:not-found', {
        message: joinResult.error
      });
      return;
    }

    const room = joinResult.room;
    
    // Join the Socket.io room for broadcasting
    socket.join(room.roomCode);
    
    // Send room state to the new player
    socket.emit('room:joined', { room });

    // Find the newly joined player
    const newPlayer = room.players.find(p => p.id === socket.id);
    if (newPlayer) {
      // Notify other players in the room
      socket.to(room.roomCode).emit('room:player-joined', {
        player: newPlayer,
        room
      });
    }

    console.log(`[${new Date().toISOString()}] Player ${playerName} joined room ${room.roomCode}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error joining room:`, error);
    socket.emit('server:error', {
      message: 'Failed to join room',
      code: 'ROOM_JOIN_ERROR'
    });
  }
}

/**
 * Handle room leave request from client
 * Removes player from their current room and notifies remaining room members
 * Handles host transfer if the leaving player was the host
 * @param socket - Socket.io connection from the leaving player
 * @param roomServiceInstance - Room management service for leaving rooms
 * @returns void - Sends room:left to player and room:player-left to room members
 */
export function handleRoomLeave(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  roomServiceInstance: RoomServiceType
): void {
  try {
    const room = roomServiceInstance.getRoomByPlayerId(socket.id);
    if (!room) {
      socket.emit('room:left', {
        message: 'You were not in any room'
      });
      return;
    }

    // Leave the Socket.io room
    socket.leave(room.roomCode);
    
    // Remove from room service
    const updatedRoom = roomServiceInstance.leaveRoom(room.roomCode, socket.id);
    
    // Send confirmation to the leaving player
    socket.emit('room:left', {
      message: 'You have left the room'
    });

    // If room still exists, notify remaining players
    if (updatedRoom) {
      socket.to(room.roomCode).emit('room:player-left', {
        playerId: socket.id,
        room: updatedRoom
      });
    }

    console.log(`[${new Date().toISOString()}] Player left room ${room.roomCode}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error leaving room:`, error);
    socket.emit('server:error', {
      message: 'Failed to leave room',
      code: 'ROOM_LEAVE_ERROR'
    });
  }
}

/**
 * Handle player ready state change
 * Updates player's ready status and notifies all room members
 * Only affects players in lobby state (not during active games)
 * @param socket - Socket.io connection from the player changing ready state
 * @param data - Ready state data
 * @param data.isReady - New ready status (true/false)
 * @param roomServiceInstance - Room management service for updating ready state
 * @returns void - Sends room:player-ready to all room members or error events
 */
export function handlePlayerSetReady(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { isReady: boolean },
  roomServiceInstance: RoomServiceType
): void {
  try {
    const { isReady } = data;
    const room = roomServiceInstance.getRoomByPlayerId(socket.id);
    
    if (!room) {
      socket.emit('server:error', {
        message: 'You are not in any room',
        code: 'NOT_IN_ROOM'
      });
      return;
    }

    if (room.isGameActive) {
      socket.emit('server:error', {
        message: 'Cannot change ready state during active game',
        code: 'GAME_ACTIVE'
      });
      return;
    }

    // Update ready state
    const updatedRoom = roomServiceInstance.updatePlayerReady(room.roomCode, socket.id, isReady);
    
    if (updatedRoom) {
      // Notify all players in the room
      socket.to(room.roomCode).emit('room:player-ready', {
        playerId: socket.id,
        isReady,
        room: updatedRoom
      });
      
      // Also notify the player who changed their state
      socket.emit('room:player-ready', {
        playerId: socket.id,
        isReady,
        room: updatedRoom
      });
    }

    console.log(`[${new Date().toISOString()}] Player ${socket.id} set ready to ${isReady} in room ${room.roomCode}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error setting ready state:`, error);
    socket.emit('server:error', {
      message: 'Failed to update ready state',
      code: 'READY_UPDATE_ERROR'
    });
  }
}

/**
 * Handle room settings update (host only)
 * Updates match configuration settings and notifies all room members
 * Only available to the room host and during lobby state
 * @param socket - Socket.io connection from the host player
 * @param data - Settings update data
 * @param data.settings - New match configuration settings
 * @param roomServiceInstance - Room management service for updating settings
 * @returns void - Sends room:settings-updated to all room members or error events
 */
export function handleRoomUpdateSettings(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { settings: MatchSettings },
  roomServiceInstance: RoomServiceType
): void {
  try {
    const { settings } = data;
    const room = roomServiceInstance.getRoomByPlayerId(socket.id);
    
    if (!room) {
      socket.emit('server:error', {
        message: 'You are not in any room',
        code: 'NOT_IN_ROOM'
      });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('server:error', {
        message: 'Only the host can update room settings',
        code: 'NOT_HOST'
      });
      return;
    }

    if (room.isGameActive) {
      socket.emit('server:error', {
        message: 'Cannot update settings during active game',
        code: 'GAME_ACTIVE'
      });
      return;
    }

    // Update settings
    const updatedRoom = roomServiceInstance.updateRoomSettings(room.roomCode, socket.id, settings);
    
    if (updatedRoom) {
      // Notify all players in the room
      socket.to(room.roomCode).emit('room:settings-updated', {
        settings,
        room: updatedRoom
      });
      
      // Also notify the host
      socket.emit('room:settings-updated', {
        settings,
        room: updatedRoom
      });
    }

    console.log(`[${new Date().toISOString()}] Room settings updated in ${room.roomCode}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating room settings:`, error);
    socket.emit('server:error', {
      message: 'Failed to update room settings',
      code: 'SETTINGS_UPDATE_ERROR'
    });
  }
}

/**
 * Handle match start request (host only)
 * Initiates the match if all players are ready and minimum requirements are met
 * Generates initial board and broadcasts match start to all room members
 * @param socket - Socket.io connection from the host player
 * @param roomServiceInstance - Room management service for starting matches
 * @param generateBoardFn - Board generation function for creating the initial game board
 * @param dictionaryService - Dictionary service for board generation validation
 * @returns void - Sends match:starting then match:started to all room members or error events
 */
export function handleMatchStart(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  roomServiceInstance: RoomServiceType,
  generateBoardFn: typeof generateBoard,
  dictionaryService: DictionaryModule,
  io: any
): void {
  try {
    const room = roomServiceInstance.getRoomByPlayerId(socket.id);
    
    if (!room) {
      socket.emit('server:error', {
        message: 'You are not in any room',
        code: 'NOT_IN_ROOM'
      });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('server:error', {
        message: 'Only the host can start the match',
        code: 'NOT_HOST'
      });
      return;
    }

    if (room.isGameActive) {
      socket.emit('server:error', {
        message: 'Game is already active',
        code: 'GAME_ACTIVE'
      });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('server:error', {
        message: 'Need at least 2 players to start',
        code: 'INSUFFICIENT_PLAYERS'
      });
      return;
    }

    // Check if all players are ready
    const notReadyPlayers = room.players.filter(p => !p.isReady);
    if (notReadyPlayers.length > 0) {
      socket.emit('server:error', {
        message: 'All players must be ready to start',
        code: 'PLAYERS_NOT_READY'
      });
      return;
    }

    // Start the match
    const updatedRoom = roomServiceInstance.startMatch(room.roomCode, socket.id);
    
    if (!updatedRoom || !updatedRoom.gameState) {
      socket.emit('server:error', {
        message: 'Failed to start match',
        code: 'MATCH_START_ERROR'
      });
      return;
    }

    // Notify all players that match is starting (with countdown)
    socket.to(room.roomCode).emit('match:starting', { countdown: 3 });
    socket.emit('match:starting', { countdown: 3 });

    // After short delay, start the first round using the new round management system
    setTimeout(() => {
      roomServiceInstance.startRound(room.roomCode, io, dictionaryService);
      console.log(`[${new Date().toISOString()}] Match started in room ${room.roomCode}`);
    }, 3000); // 3 second countdown

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error starting match:`, error);
    socket.emit('server:error', {
      message: 'Failed to start match',
      code: 'MATCH_START_ERROR'
    });
  }
}

/**
 * Handle player difficulty selection
 * Updates player's difficulty level and notifies room members for lobby display
 * Affects minimum word length and score multiplier during gameplay
 * @param socket - Socket.io connection from the player setting difficulty
 * @param data - Difficulty selection data
 * @param data.difficulty - Chosen difficulty level (easy/medium/hard/extreme)
 * @param roomServiceInstance - Room management service for updating player data
 * @returns void - Updates player difficulty and broadcasts to room or sends error events
 */
export function handlePlayerSetDifficulty(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { difficulty: DifficultyLevel },
  roomServiceInstance: RoomServiceType
): void {
  try {
    const { difficulty } = data;
    const room = roomServiceInstance.getRoomByPlayerId(socket.id);
    
    if (!room) {
      socket.emit('server:error', {
        message: 'You are not in any room',
        code: 'NOT_IN_ROOM'
      });
      return;
    }

    // Update player difficulty
    const updatedRoom = roomServiceInstance.setPlayerDifficulty(room.roomCode, socket.id, difficulty);
    
    if (updatedRoom) {
      // Notify all players in the room about the updated room state
      socket.to(room.roomCode).emit('room:joined', { room: updatedRoom });
      socket.emit('room:joined', { room: updatedRoom });
    }

    console.log(`[${new Date().toISOString()}] Player ${socket.id} set difficulty to ${difficulty} in room ${room.roomCode}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error setting difficulty:`, error);
    socket.emit('server:error', {
      message: 'Failed to set difficulty',
      code: 'DIFFICULTY_SET_ERROR'
    });
  }
} 