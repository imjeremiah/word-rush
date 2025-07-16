/**
 * Room Management Service
 * Handles game room creation, player management, and room cleanup for multiplayer lobbies
 * Provides centralized room state management with automatic cleanup and validation
 */

import { GameRoom, Player, MatchSettings, DEFAULT_MATCH_SETTINGS, MatchStatus } from '@word-rush/common';
import { generateBoard } from './board.js';
import type { DictionaryModule } from './dictionary.js';
import crypto from 'crypto';

/**
 * Generate a checksum for a game board to verify synchronization
 * @param board - Game board to generate checksum for
 * @returns MD5 hash of the board state
 */
function generateBoardChecksum(board: any): string {
  const boardString = JSON.stringify({
    width: board.width,
    height: board.height,
    tiles: board.tiles.map((row: any[]) => 
      row.map(tile => ({ letter: tile.letter, points: tile.points, x: tile.x, y: tile.y }))
    )
  });
  return crypto.createHash('md5').update(boardString).digest('hex');
}

/**
 * Room service module interface for managing multiplayer game rooms
 */
interface RoomModule {
  createRoom: (hostId: string, hostUsername: string, settings: MatchSettings) => GameRoom;
  joinRoom: (roomCode: string, playerId: string, username: string) => { success: true; room: GameRoom } | { success: false; error: string };
  leaveRoom: (roomCode: string, playerId: string) => GameRoom | undefined;
  getRoom: (roomCode: string) => GameRoom | undefined;
  getRoomByPlayerId: (playerId: string) => GameRoom | undefined;
  updatePlayerReady: (roomCode: string, playerId: string, isReady: boolean) => GameRoom | undefined;
  updateRoomSettings: (roomCode: string, hostId: string, settings: MatchSettings) => GameRoom | undefined;
  setPlayerDifficulty: (roomCode: string, playerId: string, difficulty: import('@word-rush/common').DifficultyLevel) => GameRoom | undefined;
  startMatch: (roomCode: string, hostId: string) => GameRoom | undefined;
  startRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  endRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  endMatch: (roomCode: string, io: any) => void;
  returnToLobby: (roomCode: string, io: any) => void;
  forceEndRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  handlePlayerRejoin: (playerId: string, socket: any) => void;
  getAllRooms: () => Map<string, GameRoom>;
  cleanup: () => void;
  deleteRoom: (roomCode: string) => boolean;
}

/**
 * Create a room management service for multiplayer game rooms
 * Manages room lifecycle from creation through cleanup with automatic room codes
 * @param cleanupIntervalMs - Cleanup interval in milliseconds (default: 10 minutes)
 * @returns Room service module with all room management functions
 */
function createRoomService(cleanupIntervalMs: number = 10 * 60 * 1000): RoomModule {
  const rooms = new Map<string, GameRoom>();
  const playerToRoom = new Map<string, string>(); // Track which room each player is in
  const roundTimers = new Map<string, NodeJS.Timeout>(); // Track round timers
  const boardResyncIntervals = new Map<string, NodeJS.Timeout>(); // Track board resync intervals

  /**
   * Generate a unique 4-character room code
   * Creates a human-readable code avoiding confusing characters (0, O, I, 1)
   * @returns Unique 4-character room code (e.g., "ABCD")
   */
  function generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars
    let code: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error('Unable to generate unique room code');
      }
    } while (rooms.has(code));

    return code;
  }

  /**
   * Clean up inactive rooms and orphaned player mappings
   * Removes rooms that have been inactive for more than 30 minutes
   * Cleans up player-to-room mappings for deleted rooms
   */
  function cleanupInactiveRooms(): void {
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    for (const [roomCode, room] of rooms.entries()) {
      if ((now - room.lastActivity) > thirtyMinutes) {
        // Clean up timers and intervals
        if (roundTimers.has(roomCode)) {
          clearInterval(roundTimers.get(roomCode)!);
          roundTimers.delete(roomCode);
        }
        if (boardResyncIntervals.has(roomCode)) {
          clearInterval(boardResyncIntervals.get(roomCode)!);
          boardResyncIntervals.delete(roomCode);
        }
        
        // Remove all players from the mapping
        room.players.forEach(player => {
          playerToRoom.delete(player.id);
        });
        
        rooms.delete(roomCode);
        console.log(`[${new Date().toISOString()}] Cleaned up inactive room: ${roomCode}`);
      }
    }

    // Clean up orphaned player mappings
    for (const [playerId, roomCode] of playerToRoom.entries()) {
      if (!rooms.has(roomCode)) {
        playerToRoom.delete(playerId);
      }
    }
  }

  /**
   * Start periodic board resync to keep all players synchronized
   * Broadcasts current board state every 5 seconds during active gameplay
   * @param roomCode - Room code to sync
   * @param io - Socket.io server instance
   */
  function startPeriodicBoardResync(roomCode: string, io: any): void {
    // Clear any existing resync interval
    if (boardResyncIntervals.has(roomCode)) {
      clearInterval(boardResyncIntervals.get(roomCode)!);
    }

    const resyncInterval = setInterval(() => {
      const room = rooms.get(roomCode.toUpperCase());
      if (!room || !room.gameState || !room.gameState.isGameActive || !room.gameState.board) {
        // Game not active, clear interval
        clearInterval(resyncInterval);
        boardResyncIntervals.delete(roomCode);
        return;
      }

      // Generate current board checksum
      const currentChecksum = generateBoardChecksum(room.gameState.board);
      
      // Broadcast board resync to all players
      const resyncPayload = {
        board: room.gameState.board,
        boardChecksum: currentChecksum,
        timeRemaining: room.gameState.timeRemaining,
        sequenceNumber: Date.now(), // Use timestamp as sequence
        syncType: 'periodic'
      };

      console.log(`[${new Date().toISOString()}] Periodic board resync for room ${roomCode}: checksum=${currentChecksum}`);
      io.to(roomCode).emit('board:resync', resyncPayload);
    }, 5000); // Resync every 5 seconds

    boardResyncIntervals.set(roomCode, resyncInterval);
  }

  /**
   * Handle player rejoin and resync their board state
   * @param playerId - Socket ID of rejoining player
   * @param socket - Socket instance for the rejoining player
   */
  function handlePlayerRejoin(playerId: string, socket: any): void {
    const room = getRoomByPlayerId(playerId);
    if (!room || !room.gameState || !room.gameState.board) {
      socket.emit('player:rejoin-failed', { message: 'No active game found' });
      return;
    }

    // Update player connection status
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = true;
    }

    // Send current board state to rejoining player
    const currentChecksum = generateBoardChecksum(room.gameState.board);
    const rejoinPayload = {
      board: room.gameState.board,
      boardChecksum: currentChecksum,
      timeRemaining: room.gameState.timeRemaining,
      currentRound: room.gameState.currentRound,
      totalRounds: room.gameState.totalRounds,
      playerScore: player?.score || 0,
      syncType: 'rejoin'
    };

    console.log(`[${new Date().toISOString()}] Player ${playerId} rejoined room ${room.roomCode}: sending current board (checksum=${currentChecksum})`);
    socket.emit('board:resync', rejoinPayload);
    socket.emit('player:rejoin-success', { message: 'Successfully rejoined game', room });
  }

  /**
   * Create a new game room with the specified host and settings
   * Generates a unique room code and initializes the room state
   * @param hostId - Socket ID of the player creating the room
   * @param hostUsername - Username of the host player
   * @param settings - Match configuration settings for the room
   * @returns Newly created game room with host as first player
   */
  function createRoom(hostId: string, hostUsername: string, settings: MatchSettings): GameRoom {
    const roomCode = generateRoomCode();
    const now = Date.now();

    const hostPlayer: Player = {
      id: hostId,
      username: hostUsername,
      score: 0,
      isConnected: true,
      isReady: false,
      roundScore: 0,
    };

    const room: GameRoom = {
      id: roomCode,
      roomCode,
      hostId,
      players: [hostPlayer],
      maxPlayers: 8,
      isGameActive: false,
      settings: { ...settings },
      createdAt: now,
      lastActivity: now,
    };

    rooms.set(roomCode, room);
    playerToRoom.set(hostId, roomCode);

    console.log(`[${new Date().toISOString()}] Room created: ${roomCode} by ${hostUsername}`);
    return room;
  }

  /**
   * Join a player to an existing room
   * Validates room exists, has space, and isn't in an active game
   * @param roomCode - 4-character room code to join
   * @param playerId - Socket ID of the joining player
   * @param username - Username of the joining player
   * @returns Success result with updated room or failure result with error message
   */
  function joinRoom(roomCode: string, playerId: string, username: string): { success: true; room: GameRoom } | { success: false; error: string } {
    const room = rooms.get(roomCode.toUpperCase());
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.isGameActive) {
      return { success: false, error: 'Game is already in progress' };
    }

    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    // Check if player is already in the room
    const existingPlayer = room.players.find(p => p.id === playerId);
    if (existingPlayer) {
      existingPlayer.isConnected = true;
      existingPlayer.username = username;
      room.lastActivity = Date.now();
      return { success: true, room };
    }

    // Remove player from any other room first
    const currentRoom = playerToRoom.get(playerId);
    if (currentRoom && currentRoom !== roomCode) {
      leaveRoom(currentRoom, playerId);
    }

    const newPlayer: Player = {
      id: playerId,
      username,
      score: 0,
      isConnected: true,
      isReady: false,
      roundScore: 0,
    };

    room.players.push(newPlayer);
    room.lastActivity = Date.now();
    playerToRoom.set(playerId, roomCode);

    console.log(`[${new Date().toISOString()}] Player ${username} joined room: ${roomCode}`);
    return { success: true, room };
  }

  /**
   * Remove a player from their current room
   * Handles host transfer if the leaving player was the host
   * @param roomCode - Room code to leave
   * @param playerId - Socket ID of the leaving player
   * @returns Updated room after player removal, or undefined if room was deleted
   */
  function leaveRoom(roomCode: string, playerId: string): GameRoom | undefined {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return undefined;

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return room;

    room.players.splice(playerIndex, 1);
    playerToRoom.delete(playerId);
    room.lastActivity = Date.now();

    // If this was the host and there are other players, transfer host to first player
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      console.log(`[${new Date().toISOString()}] Host transferred to ${room.players[0].username} in room: ${roomCode}`);
    }

    // If no players left, delete the room
    if (room.players.length === 0) {
      rooms.delete(roomCode);
      console.log(`[${new Date().toISOString()}] Room deleted (empty): ${roomCode}`);
      return undefined;
    }

    console.log(`[${new Date().toISOString()}] Player left room: ${roomCode}`);
    return room;
  }

  /**
   * Get room by room code
   * @param roomCode - 4-character room code to lookup
   * @returns Game room if found, undefined otherwise
   */
  function getRoom(roomCode: string): GameRoom | undefined {
    return rooms.get(roomCode.toUpperCase());
  }

  /**
   * Find which room a player is currently in
   * @param playerId - Socket ID of the player to find
   * @returns Game room containing the player, or undefined if not in any room
   */
  function getRoomByPlayerId(playerId: string): GameRoom | undefined {
    const roomCode = playerToRoom.get(playerId);
    return roomCode ? rooms.get(roomCode) : undefined;
  }

  /**
   * Update a player's ready status in their room
   * @param roomCode - Room code containing the player
   * @param playerId - Socket ID of the player
   * @param isReady - New ready status
   * @returns Updated room or undefined if not found
   */
  function updatePlayerReady(roomCode: string, playerId: string, isReady: boolean): GameRoom | undefined {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return undefined;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return undefined;

    player.isReady = isReady;
    room.lastActivity = Date.now();

    return room;
  }

  /**
   * Update room settings (host only)
   * @param roomCode - Room code to update
   * @param hostId - Socket ID of the host (must match room host)
   * @param settings - New match settings
   * @returns Updated room or undefined if not authorized/found
   */
  function updateRoomSettings(roomCode: string, hostId: string, settings: MatchSettings): GameRoom | undefined {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room || room.hostId !== hostId) return undefined;

    room.settings = { ...settings };
    room.lastActivity = Date.now();

    return room;
  }

  /**
   * Set a player's difficulty level
   * @param roomCode - Room code containing the player
   * @param playerId - Socket ID of the player
   * @param difficulty - New difficulty level
   * @returns Updated room or undefined if not found
   */
  function setPlayerDifficulty(roomCode: string, playerId: string, difficulty: import('@word-rush/common').DifficultyLevel): GameRoom | undefined {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return undefined;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return undefined;

    player.difficulty = difficulty;
    room.lastActivity = Date.now();

    return room;
  }

  /**
   * Start a match in the room (host only)
   * Validates all players are ready and minimum player count is met
   * @param roomCode - Room code to start match in
   * @param hostId - Socket ID of the host (must match room host)
   * @returns Updated room with active game or undefined if not authorized/ready
   */
  function startMatch(roomCode: string, hostId: string): GameRoom | undefined {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room || room.hostId !== hostId) return undefined;

    // Validate minimum players
    if (room.players.length < 2) {
      return undefined; // Need at least 2 players
    }

    // Validate all players are ready
    const allReady = room.players.every(p => p.isReady);
    if (!allReady) {
      return undefined; // All players must be ready
    }

    room.isGameActive = true;
    room.lastActivity = Date.now();

    // Initialize game state
    room.gameState = {
      players: room.players.map(p => ({ ...p, roundScore: 0 })),
      currentRound: 1,
      totalRounds: room.settings.totalRounds,
      timeRemaining: room.settings.roundDuration * 1000,
      isGameActive: true,
      matchStatus: 'starting' as MatchStatus,
      settings: room.settings,
      roundStartTime: Date.now(),
    };

    console.log(`[${new Date().toISOString()}] Match started in room: ${roomCode}`);
    return room;
  }

  /**
   * Get all active rooms (for debugging/monitoring)
   * @returns Map of all active rooms
   */
  function getAllRooms(): Map<string, GameRoom> {
    return new Map(rooms);
  }

  /**
   * Delete a specific room
   * @param roomCode - Room code to delete
   * @returns True if room was deleted, false if not found
   */
  function deleteRoom(roomCode: string): boolean {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return false;

    // Remove all players from the mapping
    room.players.forEach(player => {
      playerToRoom.delete(player.id);
    });

    rooms.delete(roomCode.toUpperCase());
    console.log(`[${new Date().toISOString()}] Room manually deleted: ${roomCode}`);
    return true;
  }

  // Set up periodic cleanup
  const cleanupInterval = setInterval(cleanupInactiveRooms, cleanupIntervalMs);

  /**
   * Start a new round with timer and board synchronization validation
   * @param roomCode - Room code
   * @param io - Socket.io server instance
   */
  function startRound(roomCode: string, io: any, dictionaryService: DictionaryModule): void {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room || !room.gameState) return;

    console.log(`[${new Date().toISOString()}] Starting round ${room.gameState.currentRound} for room ${roomCode} with ${room.players.length} players`);

    // Set round active state
    room.gameState.matchStatus = 'active';
    room.gameState.isGameActive = true;
    room.isGameActive = true;
    room.gameState.roundStartTime = Date.now();
    room.gameState.timeRemaining = 90000; // 90 seconds in milliseconds

    // Generate new board for this round - ONCE for all players
    const boardGenerationStart = Date.now();
    room.gameState.board = generateBoard(dictionaryService);
    const boardGenerationTime = Date.now() - boardGenerationStart;
    
    // Generate board checksum for validation
    const boardChecksum = generateBoardChecksum(room.gameState.board);
    console.log(`[${new Date().toISOString()}] Board generated for room ${roomCode}: checksum=${boardChecksum}, generation_time=${boardGenerationTime}ms, tiles_count=${room.gameState.board.width * room.gameState.board.height}`);

    // Validate board integrity before sending to players
    if (!room.gameState.board || !room.gameState.board.tiles || room.gameState.board.tiles.length === 0) {
      console.error(`[${new Date().toISOString()}] CRITICAL: Invalid board generated for room ${roomCode}`);
      return;
    }

    // Clear any existing timer
    if (roundTimers.has(roomCode)) {
      clearInterval(roundTimers.get(roomCode)!);
    }

    // Start round timer - broadcast time every 3 seconds instead of every second
    const timer = setInterval(() => {
      const room = rooms.get(roomCode.toUpperCase());
      if (!room || !room.gameState) {
        clearInterval(timer);
        roundTimers.delete(roomCode);
        return;
      }

      const elapsed = Date.now() - (room.gameState.roundStartTime || 0);
      const newTimeRemaining = Math.max(0, 90000 - elapsed);
      const oldTimeRemaining = room.gameState.timeRemaining;
      
      room.gameState.timeRemaining = newTimeRemaining;

      // Helper function to format time for comparison
      const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      };

      // Only broadcast if the display time has changed or if we're in the last 10 seconds
      const oldDisplayTime = formatTime(oldTimeRemaining);
      const newDisplayTime = formatTime(newTimeRemaining);
      const isLastTenSeconds = newTimeRemaining <= 10000;
      
      if (oldDisplayTime !== newDisplayTime || isLastTenSeconds) {
        // Broadcast time update to all players in room
        io.to(roomCode).emit('match:timer-update', {
          timeRemaining: room.gameState.timeRemaining
        });
      }

      // End round when time expires
      if (room.gameState.timeRemaining <= 0) {
        clearInterval(timer);
        roundTimers.delete(roomCode);
        endRound(roomCode, io, dictionaryService);
      }
    }, 3000); // Check every 3 seconds instead of every 1 second

    roundTimers.set(roomCode, timer);

    // Prepare match:started event payload - same board reference for all players
    const matchStartedPayload = {
      board: room.gameState.board,
      boardChecksum, // Add checksum for client validation
      timeRemaining: room.gameState.timeRemaining,
      currentRound: room.gameState.currentRound,
      totalRounds: room.gameState.totalRounds,
      playerCount: room.players.length
    };

    // Log board state before broadcasting
    console.log(`[${new Date().toISOString()}] Broadcasting match:started to ${room.players.length} players in room ${roomCode}: board_checksum=${boardChecksum}`);
    
    // Broadcast round start to all players - using same payload reference
    io.to(roomCode).emit('match:started', matchStartedPayload);
    
    // Additional validation: Log that board instance hasn't changed after broadcast
    const postBroadcastChecksum = generateBoardChecksum(room.gameState.board);
    if (boardChecksum !== postBroadcastChecksum) {
      console.error(`[${new Date().toISOString()}] CRITICAL: Board checksum changed during broadcast! Before: ${boardChecksum}, After: ${postBroadcastChecksum}`);
    } else {
      console.log(`[${new Date().toISOString()}] Board synchronization validated: all players received identical board (checksum=${boardChecksum})`);
    }
    
    // Start periodic board resync to ensure all players stay synchronized
    startPeriodicBoardResync(roomCode, io);
  }

  /**
   * End the current round and transition to summary or next round
   * @param roomCode - Room code
   * @param io - Socket.io server instance
   */
  function endRound(roomCode: string, io: any, dictionaryService: DictionaryModule): void {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room || !room.gameState) return;

    console.log(`Ending round ${room.gameState.currentRound} for room ${roomCode}`);

    // Set round end state
    room.gameState.matchStatus = 'round-end';
    room.gameState.isGameActive = false;
    room.isGameActive = false;

    // Clear board resync interval when round ends
    if (boardResyncIntervals.has(roomCode)) {
      clearInterval(boardResyncIntervals.get(roomCode)!);
      boardResyncIntervals.delete(roomCode);
    }

    // Calculate round summary data
    const roundSummary = {
      roundNumber: room.gameState.currentRound,
      scores: room.players.map(player => ({
        playerId: player.id,
        playerName: player.username || 'Unknown',  // Fix: Use username and provide fallback
        roundScore: player.roundScore || 0,
        totalScore: player.score || 0,  // Fix: Provide fallback for undefined scores
        difficulty: player.difficulty || 'medium'  // Fix: Provide fallback for difficulty
      })),
      isMatchComplete: room.gameState.currentRound >= room.gameState.totalRounds
    };

    // Reset round scores for next round
    room.players.forEach(player => {
      player.roundScore = 0;
    });

    // Broadcast round summary
    io.to(roomCode).emit('match:round-end', roundSummary);

    // Check if match is complete
    if (room.gameState.currentRound >= room.gameState.totalRounds) {
      // Match is complete
      setTimeout(() => {
        endMatch(roomCode, io);
      }, 5000); // Show round summary for 5 seconds
    } else {
      // Start next round after delay
      setTimeout(() => {
        room.gameState!.currentRound++;
        startRound(roomCode, io, dictionaryService);
      }, 5000); // Show round summary for 5 seconds
    }
  }

  /**
   * End the match and declare winner
   * @param roomCode - Room code
   * @param io - Socket.io server instance
   */
  function endMatch(roomCode: string, io: any): void {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room || !room.gameState) return;

    console.log(`Ending match for room ${roomCode}`);

    // Set match finished state
    room.gameState.matchStatus = 'finished';

    // Find winner (highest total score)
    const winner = room.players.reduce((prev, current) => 
      (current.score > prev.score) ? current : prev
    );

    room.gameState.winner = winner;

    // Calculate final match summary with proper winner selection
    const sortedPlayers = room.players
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const matchWinner = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
    
    const matchSummary = {
      winner: matchWinner ? {
        id: matchWinner.id,
        username: matchWinner.username || 'Unknown',  // Fix: Use username with fallback
        isConnected: matchWinner.isConnected || true,  // Fix: Add required fields
        score: matchWinner.score || 0  // Fix: Provide fallback for score
      } : null,
      finalScores: sortedPlayers.map((player, index) => ({
        rank: index + 1,
        playerId: player.id,
        playerName: player.username || 'Unknown',  // Fix: Use username with fallback
        roundScore: player.roundScore || 0,  // Fix: Add roundScore field
        totalScore: player.score || 0,  // Fix: Use totalScore and provide fallback
        difficulty: player.difficulty || 'medium'  // Fix: Provide fallback for difficulty
      })),
      totalRounds: room.gameState.totalRounds
    };

    // Broadcast match complete
    io.to(roomCode).emit('match:finished', matchSummary);

    // Reset room to lobby state after delay
    setTimeout(() => {
      returnToLobby(roomCode, io);
    }, 10000); // Show match results for 10 seconds
  }

  /**
   * Return room to lobby state for new match
   * @param roomCode - Room code
   * @param io - Socket.io server instance  
   */
  function returnToLobby(roomCode: string, io: any): void {
    const room = rooms.get(roomCode.toUpperCase());
    if (!room) return;

    console.log(`Returning room ${roomCode} to lobby`);

    // Clear any round timer and board resync interval
    if (roundTimers.has(roomCode)) {
      clearInterval(roundTimers.get(roomCode)!);
      roundTimers.delete(roomCode);
    }
    if (boardResyncIntervals.has(roomCode)) {
      clearInterval(boardResyncIntervals.get(roomCode)!);
      boardResyncIntervals.delete(roomCode);
    }

    // Reset game state
    room.gameState = {
      players: room.players,
      currentRound: 1,
      totalRounds: room.gameState?.totalRounds || 3,
      timeRemaining: 90000,
      isGameActive: false,
      matchStatus: 'lobby',
      settings: room.gameState?.settings || {
        shuffleCost: 5,
        speedBonusMultiplier: 1.5,
        speedBonusWindow: 3,
        deadBoardThreshold: 5
      }
    };

    // Reset all player states
    room.players.forEach(player => {
      player.score = 0;
      player.roundScore = 0;
      player.isReady = false;
      // Remove references to properties that don't exist in Player interface
      if ('lastWordTimestamp' in player) {
        player.lastWordTimestamp = undefined;
      }
    });

    // Broadcast return to lobby
    io.to(roomCode).emit('room:returnToLobby', {
      room: {
        id: room.id,
        hostId: room.hostId,
        players: room.players,
        gameState: room.gameState,
        createdAt: room.createdAt
      }
    });
  }

  /**
   * Force end a round (called by admin or on error)
   * @param roomCode - Room code
   * @param io - Socket.io server instance
   */
  function forceEndRound(roomCode: string, io: any, dictionaryService: DictionaryModule): void {
    // Clear any existing timer
    if (roundTimers.has(roomCode)) {
      clearInterval(roundTimers.get(roomCode)!);
      roundTimers.delete(roomCode);
    }
    
    endRound(roomCode, io, dictionaryService);
  }

  /**
   * Cleanup method to be called when server shuts down
   */
  function cleanup(): void {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
    // Clear all round timers
    roundTimers.forEach((timer, roomCode) => {
      clearInterval(timer);
    });
    roundTimers.clear();
    cleanupInactiveRooms();
  }

  // Return the public API
  return {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoom,
    getRoomByPlayerId,
    updatePlayerReady,
    updateRoomSettings,
    setPlayerDifficulty,
    startMatch,
    startRound,
    endRound,
    endMatch,
    returnToLobby,
    forceEndRound,
    handlePlayerRejoin,
    getAllRooms,
    cleanup,
    deleteRoom,
  };
}

// Create and export the room service instance
export const roomService = createRoomService(); 