/**
 * Room Management Service
 * Handles game room creation, player management, and room cleanup for multiplayer lobbies
 * Provides centralized room state management with automatic cleanup and validation
 */

import { GameRoom, Player, MatchSettings, DEFAULT_MATCH_SETTINGS, MatchStatus } from '@word-rush/common';
import { generateBoard } from './board.js';
import type { DictionaryModule } from './dictionary.js';
import { sessionService } from './session.js';
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
  startMatch: (roomCode: string, hostId: string, dictionaryService: DictionaryModule) => GameRoom | undefined;
  startRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  endRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  endMatch: (roomCode: string, io: any) => void;
  returnToLobby: (roomCode: string, io: any) => void;
  forceEndRound: (roomCode: string, io: any, dictionaryService: DictionaryModule) => void;
  handlePlayerRejoin: (playerId: string, socket: any) => void;
  getAllRooms: () => Map<string, GameRoom>;
  cleanup: () => void;
  deleteRoom: (roomCode: string) => boolean;
  recordGameActivity: (roomCode: string) => void; // 🔴 PHASE 2B: Export activity recording function
  // 🔧 SECTION 5 FIX: Add timeout management methods
  storeMatchStartTimeout: (roomCode: string, timeout: NodeJS.Timeout) => void;
  clearMatchStartTimeout: (roomCode: string) => void;
}

// Track transition timeouts to prevent race conditions
const transitionTimeouts = new Map<string, NodeJS.Timeout>();

// 🔧 SECTION 5 FIX: Track match start timeouts to prevent GO signal hangs
const matchStartTimeouts = new Map<string, NodeJS.Timeout>();

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
   * 🔴 PHASE 2B: Enhanced Board Synchronization Configuration
   */
  interface BoardSyncConfig {
    baseSyncIntervalMs: number;
    adaptiveSyncIntervals: {
      inactive: number;    // No recent activity
      low: number;         // Low activity (1-2 actions/min)
      medium: number;      // Medium activity (3-5 actions/min)
      high: number;        // High activity (6+ actions/min)
    };
    syncTimeoutMs: number;
    maxRetryAttempts: number;
    retryBackoffBase: number;
    retryBackoffMax: number;
    healthCheckInterval: number;
  }

  const BOARD_SYNC_CONFIG: BoardSyncConfig = {
    baseSyncIntervalMs: 8000, // Increased from 5000ms to reduce baseline frequency
    adaptiveSyncIntervals: {
      inactive: 20000,   // 20 seconds when inactive (doubled)
      low: 15000,        // 15 seconds for low activity (increased from 8s)
      medium: 10000,     // 10 seconds for medium activity (increased from 5s)
      high: 6000         // 6 seconds for high activity (increased from 3s)
    },
    syncTimeoutMs: 2000,
    maxRetryAttempts: 3,
    retryBackoffBase: 1000,
    retryBackoffMax: 5000,
    healthCheckInterval: 45000 // 45 seconds (increased from 30s)
  };

  // Sync health tracking
  interface SyncHealth {
    lastSyncTime: number;
    successfulSyncs: number;
    failedSyncs: number;
    retryAttempts: number;
    averageLatency: number;
    activityLevel: 'inactive' | 'low' | 'medium' | 'high';
    lastActivityTime: number;
    activityCount: number;
  }

  const syncHealthMap = new Map<string, SyncHealth>();

  /**
   * Calculate adaptive sync frequency based on game activity
   * @param roomCode - Room code
   * @returns Sync interval in milliseconds
   */
  function calculateAdaptiveSyncInterval(roomCode: string): number {
    const health = syncHealthMap.get(roomCode);
    if (!health) {
      return BOARD_SYNC_CONFIG.baseSyncIntervalMs;
    }

    // Enhanced activity level calculation with multiple factors
    const now = Date.now();
    const timeSinceLastActivity = now - health.lastActivityTime;
    const minutesSinceLastActivity = timeSinceLastActivity / (60 * 1000);

    // Calculate activity rate with decay factor for older activities
    const activityWindow = Math.min(minutesSinceLastActivity, 5); // 5-minute sliding window
    const decayedActivityCount = health.activityCount * Math.exp(-minutesSinceLastActivity * 0.2); // Exponential decay
    const activityRate = decayedActivityCount / Math.max(activityWindow, 0.5);

    // Consider sync health for additional optimization
    const syncSuccessRate = health.successfulSyncs / Math.max(health.successfulSyncs + health.failedSyncs, 1);
    const avgLatencyMs = health.averageLatency;

    let activityLevel: 'inactive' | 'low' | 'medium' | 'high';
    
    // More sophisticated activity classification
    if (timeSinceLastActivity > 120000) { // More than 2 minutes
      activityLevel = 'inactive';
    } else if (activityRate < 2 || syncSuccessRate < 0.8) {
      activityLevel = 'low';
    } else if (activityRate < 5 && avgLatencyMs < 100) {
      activityLevel = 'medium';
    } else if (activityRate >= 5 || avgLatencyMs > 150) {
      activityLevel = 'high'; // High activity or poor performance needs frequent sync
    } else {
      activityLevel = 'medium';
    }

    health.activityLevel = activityLevel;
    
    // Log adaptive decisions for monitoring
    if (health.activityCount > 0) {
      console.log(`[${new Date().toISOString()}] 📊 Adaptive sync for ${roomCode}: activity=${activityLevel}, rate=${activityRate.toFixed(1)}/min, success=${(syncSuccessRate * 100).toFixed(1)}%, latency=${avgLatencyMs.toFixed(0)}ms`);
    }
    
    return BOARD_SYNC_CONFIG.adaptiveSyncIntervals[activityLevel];
  }

  /**
   * Record game activity for adaptive sync calculation
   * @param roomCode - Room code
   */
  function recordGameActivity(roomCode: string): void {
    const health = syncHealthMap.get(roomCode) || {
      lastSyncTime: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      retryAttempts: 0,
      averageLatency: 0,
      activityLevel: 'medium' as const,
      lastActivityTime: Date.now(),
      activityCount: 0
    };

    health.lastActivityTime = Date.now();
    health.activityCount++;
    syncHealthMap.set(roomCode, health);
  }

  /**
   * Start enhanced periodic board resync with adaptive frequency and health monitoring
   * @param roomCode - Room code to sync
   * @param io - Socket.io server instance
   */
  function startPeriodicBoardResync(roomCode: string, io: any): void {
    // Clear any existing resync interval
    if (boardResyncIntervals.has(roomCode)) {
      clearInterval(boardResyncIntervals.get(roomCode)!);
    }

    // Initialize sync health tracking
    if (!syncHealthMap.has(roomCode)) {
      syncHealthMap.set(roomCode, {
        lastSyncTime: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        retryAttempts: 0,
        averageLatency: 0,
        activityLevel: 'medium',
        lastActivityTime: Date.now(),
        activityCount: 0
      });
    }

    function performSync(): void {
      const room = rooms.get(roomCode.toUpperCase());
      if (!room || !room.gameState || !room.gameState.isGameActive || !room.gameState.board) {
        // Game not active, clear interval
        clearInterval(resyncInterval);
        boardResyncIntervals.delete(roomCode);
        syncHealthMap.delete(roomCode);
        return;
      }

      const syncStartTime = Date.now();
      const health = syncHealthMap.get(roomCode)!;

      // Generate current board checksum
      const currentChecksum = generateBoardChecksum(room.gameState.board);
      
      // Broadcast board resync to all players with timeout and retry
      const resyncPayload = {
        board: room.gameState.board,
        boardChecksum: currentChecksum,
        timeRemaining: room.gameState.timeRemaining,
        sequenceNumber: Date.now(),
        syncType: 'periodic',
        syncId: crypto.randomUUID() // For tracking responses
      };

      try {
        console.log(`[${new Date().toISOString()}] Enhanced board resync for room ${roomCode}: checksum=${currentChecksum}, activity=${health.activityLevel}`);
        
        // Emit with timeout handling
        const syncPromise = new Promise<void>((resolve, reject) => {
          io.to(roomCode).emit('board:resync', resyncPayload);
          
          // Simulate sync completion (in real implementation, you'd track client acknowledgments)
          setTimeout(() => {
            const syncEndTime = Date.now();
            const syncLatency = syncEndTime - syncStartTime;
            
            // Update sync health metrics
            health.lastSyncTime = syncEndTime;
            health.successfulSyncs++;
            health.averageLatency = (health.averageLatency + syncLatency) / 2;
            
            console.log(`[${new Date().toISOString()}] ✅ Board sync completed for room ${roomCode}: latency=${syncLatency}ms`);
            resolve();
          }, 100); // Simulated sync completion time
        });

        // Add timeout to sync operation
        Promise.race([
          syncPromise,
          new Promise<void>((_, reject) => 
            setTimeout(() => reject(new Error('Sync timeout')), BOARD_SYNC_CONFIG.syncTimeoutMs)
          )
        ]).catch(error => {
          console.warn(`[${new Date().toISOString()}] ⚠️ Board sync failed for room ${roomCode}:`, error);
          health.failedSyncs++;
          
          // Implement retry logic with exponential backoff
          if (health.retryAttempts < BOARD_SYNC_CONFIG.maxRetryAttempts) {
            health.retryAttempts++;
            const backoffDelay = Math.min(
              BOARD_SYNC_CONFIG.retryBackoffBase * Math.pow(2, health.retryAttempts - 1),
              BOARD_SYNC_CONFIG.retryBackoffMax
            );
            
            console.log(`[${new Date().toISOString()}] 🔄 Retrying board sync for room ${roomCode} in ${backoffDelay}ms (attempt ${health.retryAttempts})`);
            setTimeout(() => performSync(), backoffDelay);
          } else {
            console.error(`[${new Date().toISOString()}] ❌ Board sync failed permanently for room ${roomCode} after ${BOARD_SYNC_CONFIG.maxRetryAttempts} attempts`);
            health.retryAttempts = 0; // Reset for next sync cycle
          }
        });

      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Board sync error for room ${roomCode}:`, error);
        health.failedSyncs++;
      }

      // Schedule next sync with adaptive interval
      const nextSyncInterval = calculateAdaptiveSyncInterval(roomCode);
      if (nextSyncInterval !== BOARD_SYNC_CONFIG.baseSyncIntervalMs) {
        console.log(`[${new Date().toISOString()}] 📊 Adaptive sync for room ${roomCode}: interval=${nextSyncInterval}ms, activity=${health.activityLevel}`);
      }
      
      // Clear current interval and set new one with adaptive timing
      clearInterval(resyncInterval);
      resyncInterval = setInterval(performSync, nextSyncInterval);
      boardResyncIntervals.set(roomCode, resyncInterval);
    }

    // Initial sync
    let resyncInterval = setInterval(performSync, BOARD_SYNC_CONFIG.baseSyncIntervalMs);
    boardResyncIntervals.set(roomCode, resyncInterval);

    // Start health monitoring
    startSyncHealthMonitoring(roomCode);
  }

  /**
   * Start sync health monitoring for a room
   * @param roomCode - Room code to monitor
   */
  function startSyncHealthMonitoring(roomCode: string): void {
    const healthInterval = setInterval(() => {
      const room = rooms.get(roomCode.toUpperCase());
      const health = syncHealthMap.get(roomCode);
      
      if (!room || !room.gameState || !room.gameState.isGameActive || !health) {
        clearInterval(healthInterval);
        return;
      }

      // Calculate success rate
      const totalSyncs = health.successfulSyncs + health.failedSyncs;
      const successRate = totalSyncs > 0 ? (health.successfulSyncs / totalSyncs) * 100 : 100;
      
      console.log(`[${new Date().toISOString()}] 📊 Sync health for room ${roomCode}:`, {
        successRate: `${successRate.toFixed(1)}%`,
        averageLatency: `${health.averageLatency.toFixed(1)}ms`,
        activityLevel: health.activityLevel,
        totalSyncs,
        failedSyncs: health.failedSyncs
      });

      // Reset activity count for next period
      health.activityCount = Math.floor(health.activityCount * 0.8); // Decay factor
      
    }, BOARD_SYNC_CONFIG.healthCheckInterval);
  }

  /**
   * Handle player rejoin and resync their board state
   * Handles both active games and countdown state with preloaded boards
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

    // 🔧 TASK 3: Handle reconnections during countdown phase
    if (room.gameState.matchStatus === 'starting') {
      const now = Date.now();
      const countdownStartTime = room.gameState.roundStartTime || now;
      const elapsedCountdown = now - countdownStartTime;
      const remainingCountdown = Math.max(0, 3000 - elapsedCountdown); // 3000ms = 3 seconds

      console.log(`[${new Date().toISOString()}] 🔄 SYNC_DEBUG: Player ${playerId} rejoining during countdown: elapsed=${elapsedCountdown}ms, remaining=${remainingCountdown}ms`);

      // If countdown has already finished, send immediate match:go
      if (remainingCountdown <= 0) {
        console.log(`[${new Date().toISOString()}] ⚡ Player ${playerId} rejoined after countdown ended - sending immediate 'match:go'`);
        socket.emit('match:go');
        // Continue with normal rejoin logic below
      } else {
        // Send preloaded board with countdown information
        const currentChecksum = generateBoardChecksum(room.gameState.board);
        const countdownRejoinPayload = {
          board: room.gameState.board,
          boardChecksum: currentChecksum,
          timeRemaining: room.gameState.timeRemaining,
          currentRound: room.gameState.currentRound,
          totalRounds: room.gameState.totalRounds,
          playerScore: player?.score || 0,
          syncType: 'rejoin-countdown',
          isInCountdown: true,
          remainingCountdown: remainingCountdown
        };

        console.log(`[${new Date().toISOString()}] Player ${playerId} rejoined during countdown in room ${room.roomCode}: sending preloaded board (checksum=${currentChecksum}, countdown=${remainingCountdown}ms)`);
        socket.emit('board:resync', countdownRejoinPayload);
        socket.emit('player:rejoin-success', { message: 'Rejoined during countdown - waiting for match start', room });
        return; // Exit early for countdown state
      }
    }

    // Send current board state to rejoining player (normal rejoin)
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

    // Get crown count from session service (same as regular players)
    const session = sessionService.getPlayerSession(hostId);
    const crownCount = session?.crowns || 0;

    const hostPlayer: Player = {
      id: hostId,
      username: hostUsername,
      score: 0,
      isConnected: true,
      isReady: false,
      roundScore: 0,
      crowns: crownCount,
      // 🎯 SECTION 3.1: Set default difficulty to 'easy' for host (same as regular players)
      difficulty: process.env.USE_EASY_DEFAULT !== 'false' ? 'easy' : 'medium', // Feature flag with 'easy' as new default
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
      
      // Sync crown count from session service
      const session = sessionService.getPlayerSession(playerId);
      existingPlayer.crowns = session?.crowns || 0;
      
      room.lastActivity = Date.now();
      return { success: true, room };
    }

    // Remove player from any other room first
    const currentRoom = playerToRoom.get(playerId);
    if (currentRoom && currentRoom !== roomCode) {
      leaveRoom(currentRoom, playerId);
    }

    // Get crown count from session service
    const session = sessionService.getPlayerSession(playerId);
    const crownCount = session?.crowns || 0;

    const newPlayer: Player = {
      id: playerId,
      username,
      score: 0,
      isConnected: true,
      isReady: false,
      roundScore: 0,
      crowns: crownCount,
      // 🎯 SECTION 3.1: Set default difficulty to 'easy' with safety fallback
      difficulty: process.env.USE_EASY_DEFAULT !== 'false' ? 'easy' : 'medium', // Feature flag with 'easy' as new default
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
      rooms.delete(roomCode.toUpperCase());
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
   * Validates all players are ready, generates board immediately for preloading
   * @param roomCode - Room code to start match in
   * @param hostId - Socket ID of the host (must match room host)
   * @param dictionaryService - Dictionary service for board generation and validation
   * @returns Updated room with active game and preloaded board, or undefined if not authorized/ready
   */
  function startMatch(roomCode: string, hostId: string, dictionaryService: DictionaryModule): GameRoom | undefined {
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

    // 🔧 SECTION 5 FIX: Use cached board generation for instant match start
    const boardGenerationStart = Date.now();
    let preloadedBoard;
    
    try {
      // Try to get a cached board first for instant delivery
      preloadedBoard = generateBoard(dictionaryService); // This now uses cache when available
      const boardGenerationTime = Date.now() - boardGenerationStart;
      
      if (boardGenerationTime > 100) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Board generation took ${boardGenerationTime}ms for room ${roomCode} - consider pre-generating more boards`);
      } else {
        console.log(`[${new Date().toISOString()}] ✅ Fast board generation (${boardGenerationTime}ms) for room ${roomCode}`);
      }
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Board generation failed for room ${roomCode}:`, error);
      return undefined; // Fail the match start if board generation fails
    }

    // Generate board checksum for validation
    const boardChecksum = generateBoardChecksum(preloadedBoard);
    
    // Log board generation for verification
    const boardGenerationTime = Date.now() - boardGenerationStart;
    console.log(`[${new Date().toISOString()}] 🎲 SYNC_DEBUG: Board pre-generated for room ${roomCode}: checksum=${boardChecksum}, generation_time=${boardGenerationTime}ms, tiles_count=${preloadedBoard.width * preloadedBoard.height}`);

    // Initialize game state with preloaded board
    room.gameState = {
      players: room.players.map(p => ({ ...p, roundScore: 0 })),
      currentRound: 1,
      totalRounds: room.settings.totalRounds,
      timeRemaining: room.settings.roundDuration * 1000,
      isGameActive: true,
      matchStatus: 'starting' as MatchStatus,
      settings: room.settings,
      roundStartTime: Date.now(),
      board: preloadedBoard, // 🔧 Add preloaded board to game state
    };

    console.log(`[${new Date().toISOString()}] Match started in room: ${roomCode} with preloaded board (checksum: ${boardChecksum})`);
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
    if (!room || !room.gameState) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Cannot start round - room or gameState not found: ${roomCode}`);
      return;
    }

    // 🔧 SAFETY CHECK: Prevent starting rounds when not in active match
    if (!room.isGameActive || room.gameState.matchStatus !== 'starting') {
      console.warn(`[${new Date().toISOString()}] ⚠️ Cannot start round - room not in active match state. Room active: ${room.isGameActive}, match status: ${room.gameState.matchStatus}, room: ${roomCode}`);
      return;
    }

    // 🔧 SAFETY CHECK: Ensure minimum players 
    if (room.players.length < 2) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Cannot start round - insufficient players (${room.players.length}) in room: ${roomCode}`);
      return;
    }

    console.log(`[${new Date().toISOString()}] Starting round ${room.gameState.currentRound} for room ${roomCode} with ${room.players.length} players`);

    // Set round active state
    room.gameState.matchStatus = 'active';
    room.gameState.isGameActive = true;
    room.isGameActive = true;
    room.gameState.roundStartTime = Date.now();
    
    // 🎯 SECTION 4.2: Use settings instead of hardcoded duration with validation
    let roundDurationMs = (room.settings.roundDuration || 90) * 1000; // Convert seconds to milliseconds
    
    // Safety validation: ensure duration is within valid bounds
    if (roundDurationMs < 15000 || roundDurationMs > 120000) {
      console.warn(`[${new Date().toISOString()}] Invalid round duration: ${roundDurationMs}ms for room ${roomCode}, falling back to 90s`);
      roundDurationMs = 90000; // Safety fallback to 90 seconds
    }
    
    room.gameState.timeRemaining = roundDurationMs;

    // 🔧 CRITICAL FIX: Use preloaded board for first round, generate new board for subsequent rounds
    let boardChecksum: string;
    let boardGenerationTime = 0;
    
    if (room.gameState.currentRound === 1 && room.gameState.board) {
      // First round: Use the preloaded board from startMatch() if available
      boardChecksum = generateBoardChecksum(room.gameState.board);
      console.log(`[${new Date().toISOString()}] 🎲 Using preloaded board for round 1 in room ${roomCode}: checksum=${boardChecksum}, tiles_count=${room.gameState.board.width * room.gameState.board.height}`);
    } else {
      // Subsequent rounds OR no preloaded board (e.g., after restart): Generate new board
      const boardGenerationStart = Date.now();
      room.gameState.board = generateBoard(dictionaryService);
      boardGenerationTime = Date.now() - boardGenerationStart;
      
      boardChecksum = generateBoardChecksum(room.gameState.board);
      const reason = room.gameState.currentRound === 1 ? 'no preloaded board (fresh start)' : `round ${room.gameState.currentRound}`;
      console.log(`[${new Date().toISOString()}] 🎲 Generated fresh board for ${reason} in room ${roomCode}: checksum=${boardChecksum}, generation_time=${boardGenerationTime}ms, tiles_count=${room.gameState.board.width * room.gameState.board.height}`);
    }

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
      const newTimeRemaining = Math.max(0, roundDurationMs - elapsed);
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
      const endMatchTimeout = setTimeout(() => {
        // 🔧 SAFETY CHECK: Verify room still exists and is in correct state
        const currentRoom = rooms.get(roomCode.toUpperCase());
        if (!currentRoom || !currentRoom.gameState || currentRoom.gameState.matchStatus !== 'round-end') {
          console.warn(`[${new Date().toISOString()}] ⚠️ Skipping endMatch - room state changed: ${roomCode}`);
          transitionTimeouts.delete(roomCode);
          return;
        }
        
        transitionTimeouts.delete(roomCode);
        endMatch(roomCode, io);
      }, 5000); // Show round summary for 5 seconds
      
      // Store timeout for cleanup
      transitionTimeouts.set(roomCode, endMatchTimeout);
    } else {
      // Start next round after delay
      const nextRoundTimeout = setTimeout(() => {
        // 🔧 SAFETY CHECK: Verify room still exists and is in correct state for next round
        const currentRoom = rooms.get(roomCode.toUpperCase());
        if (!currentRoom || !currentRoom.gameState || 
            currentRoom.gameState.matchStatus !== 'round-end') {
          console.warn(`[${new Date().toISOString()}] ⚠️ Skipping next round start - room state changed: ${roomCode}`);
          transitionTimeouts.delete(roomCode);
          return;
        }
        
        transitionTimeouts.delete(roomCode);
        // Set room back to active state for the next round
        currentRoom.isGameActive = true;
        currentRoom.gameState.isGameActive = true;
        currentRoom.gameState.matchStatus = 'starting';
        currentRoom.gameState.currentRound++;
        startRound(roomCode, io, dictionaryService);
      }, 5000); // Show round summary for 5 seconds
      
      // Store timeout for cleanup
      transitionTimeouts.set(roomCode, nextRoundTimeout);
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

    // Calculate final match summary with proper winner selection and enhanced stats
    const sortedPlayers = room.players
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const matchWinner = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
    
    const matchSummary = {
      winner: matchWinner ? {
        id: matchWinner.id,
        username: matchWinner.username || 'Unknown',
        score: matchWinner.score || 0,
        difficulty: matchWinner.difficulty || 'medium'
      } : null,
      finalScores: sortedPlayers.map((player, index) => ({
        rank: index + 1,
        playerId: player.id,
        playerName: player.username || 'Unknown',
        score: player.score || 0,
        difficulty: player.difficulty || 'medium',
        // Enhanced stats
        wordsFound: (player as any).wordsFound || 0,
        longestWord: (player as any).longestWord || '',
        highestScoringWord: (player as any).highestScoringWord || '',
        highestWordScore: (player as any).highestWordScore || 0,
        averageWordLength: (player as any).averageWordLength || 0,
        // Bonus information for best word
        bestWordHadDifficultyBonus: (player as any).bestWordHadDifficultyBonus || false,
        bestWordHadSpeedBonus: (player as any).bestWordHadSpeedBonus || false
      })),
      totalRounds: room.gameState.totalRounds
    };

    // Award crown to the winner using session service
    if (matchWinner) {
      const updatedSession = sessionService.awardCrown(matchWinner.id);
      if (updatedSession) {
        console.log(`[${new Date().toISOString()}] 👑 Crown awarded to match winner: ${matchWinner.username} (Total crowns: ${updatedSession.crowns})`);
      }
    }

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

    // 🔧 SAFETY: Clear any pending transition timeouts to prevent race conditions
    if (transitionTimeouts.has(roomCode)) {
      clearTimeout(transitionTimeouts.get(roomCode)!);
      transitionTimeouts.delete(roomCode);
      console.log(`[${new Date().toISOString()}] ✅ Cleared pending transition timeout for room ${roomCode}`);
    }

    // 🔧 SECTION 5 FIX: Clear any pending match start timeouts to prevent hanging GO signals
    if (matchStartTimeouts.has(roomCode)) {
      clearTimeout(matchStartTimeouts.get(roomCode)!);
      matchStartTimeouts.delete(roomCode);
      console.log(`[${new Date().toISOString()}] ✅ Cleared pending match start timeout for room ${roomCode}`);
    }

    // Reset game state
    room.gameState = {
      players: room.players,
      currentRound: 1,
      totalRounds: room.gameState?.totalRounds || 3,
      // 🎯 SECTION 4.2: Use settings for initial time remaining with fallback
      timeRemaining: (room.settings.roundDuration || 90) * 1000,
      isGameActive: false,
      matchStatus: 'lobby',
      settings: room.gameState?.settings || {
        totalRounds: 3,
        roundDuration: 90,
        shuffleCost: 5,
        speedBonusMultiplier: 1.5,
        speedBonusWindow: 3,
        deadBoardThreshold: 5,
        gameMode: 'standard' as const
      },
      // 🔧 BOARD SYNC FIX: Clear board to prevent stale board reuse on restart
      board: undefined
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
      // 🎯 ENHANCED STATS: Reset detailed statistics for new match
      (player as any).wordsFound = 0;
      (player as any).totalWordLength = 0;
      (player as any).longestWord = '';
      (player as any).highestScoringWord = '';
      (player as any).highestWordScore = 0;
      (player as any).longestWordScore = 0;
      (player as any).averageWordLength = 0;
      (player as any).bestWordHadDifficultyBonus = false;
      (player as any).bestWordHadSpeedBonus = false;
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
    
    // 🔧 SAFETY: Clear all transition timeouts
    transitionTimeouts.forEach((timeout, roomCode) => {
      clearTimeout(timeout);
    });
    transitionTimeouts.clear();
    
    // 🔧 SECTION 5 FIX: Clear all match start timeouts
    matchStartTimeouts.forEach((timeout, roomCode) => {
      clearTimeout(timeout);
    });
    matchStartTimeouts.clear();
    
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
    recordGameActivity, // 🔴 PHASE 2B: Export activity recording function
    // 🔧 SECTION 5 FIX: Add timeout management methods
    storeMatchStartTimeout: (roomCode: string, timeout: NodeJS.Timeout) => {
      matchStartTimeouts.set(roomCode, timeout);
    },
    clearMatchStartTimeout: (roomCode: string) => {
      matchStartTimeouts.delete(roomCode);
    }
  };
}

// Create and export the room service instance
export const roomService = createRoomService(); 