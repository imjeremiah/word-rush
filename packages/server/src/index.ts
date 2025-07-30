/**
 * Word Rush Server
 * Main server entry point that sets up Express with Socket.io for real-time multiplayer gameplay
 */

import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { socketRateLimiter } from './services/rate-limiter.js';
import { dictionaryService } from './services/dictionary.js';
import { generateBoard, getCacheStats, clearMemoCache } from './services/board.js';
import { sessionService } from './services/session.js';
import { roomService } from './services/room.js';
import { validateSocketEvent, ClientEventSchemas } from './validation/schemas.js';
import { handleWordSubmit } from './handlers/wordHandlers.js';
import { handlePlayerReconnect, handlePlayerJoin, handlePlayerConnect, handlePlayerDisconnect } from './handlers/playerHandlers.js';
import { handleBoardRequest, handleShuffleRequest } from './handlers/gameHandlers.js';
import { 
  handleRoomCreate, 
  handleRoomJoin, 
  handleRoomLeave, 
  handlePlayerSetReady, 
  handleRoomUpdateSettings, 
  handleMatchStart,
  handlePlayerSetDifficulty
} from './handlers/roomHandlers.js';
import { 
  handleMatchStartFirstRound,
  handleMatchForceEndRound,
  handleMatchStartNewMatch
} from './handlers/matchHandlers.js';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  LetterTile,
  DIFFICULTY_CONFIGS
} from '@word-rush/common';

const app = express();
const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;
// Add HOST configuration for Render deployment
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Services are now functional modules - no initialization needed


// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : ['http://localhost:5173', 'http://localhost:5174'],
  })
);

// Rate limiting for HTTP requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Basic health check endpoint
app.get('/health', (_, res) => {
  const cacheStats = getCacheStats();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dictionary: {
      loaded: dictionaryService.isReady(),
      wordCount: dictionaryService.getWordCount()
    },
    activePlayers: sessionService.getActivePlayerCount(),
    boardCache: {
      size: cacheStats.cacheSize,
      isGenerating: cacheStats.isGenerating,
      tileBagSize: cacheStats.tileBagSize,
      totalGenerated: cacheStats.totalGenerated,
      cacheHits: cacheStats.cacheHits,
      cacheMisses: cacheStats.cacheMisses
    }
  });
});

// Initialize board pre-generation cache after dictionary is ready
// 🔧 CRITICAL FIX: Moved to AFTER server starts listening to prevent blocking
// This was causing 6+ minute delays before the server could accept connections
// console.log(`[${new Date().toISOString()}] 🎲 Starting board pre-generation cache...`);
// preGenerateBoards(dictionaryService, 5).catch(error => {
//   console.error(`[${new Date().toISOString()}] ❌ Board pre-generation failed:`, error);
// });

// Set up periodic cache maintenance
setInterval(() => {
  const cacheStats = getCacheStats();
  console.log(`[${new Date().toISOString()}] 📊 Cache maintenance - ${JSON.stringify(cacheStats)}`);
  clearMemoCache();
  console.log(`[${new Date().toISOString()}] 🧹 Cleared memoization cache`);
  
  // Background board generation will happen automatically as needed
}, 30 * 60 * 1000); // Every 30 minutes

/**
 * Wrapper function for socket event handlers to provide error handling, rate limiting, and validation
 */
function withErrorHandling<T extends keyof typeof ClientEventSchemas>(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  eventName: T,
  handler: (data: unknown) => void | Promise<void>
) {
  return async (data: unknown) => {
    try {
      // Check rate limit
      if (!socketRateLimiter.checkLimit(socket.id)) {
        socket.emit('server:rate-limit', {
          message: 'Rate limit exceeded. Please slow down.',
          retryAfter: 60
        });
        return;
      }

      // Validate event data
      const validation = validateSocketEvent(eventName, data);
      if (!validation.success) {
        socket.emit('server:error', {
          message: `Invalid event data: ${(validation as { success: false; error: string }).error}`,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      await handler(validation.data);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Socket error for ${socket.id}:`,
        error
      );
      socket.emit('server:error', { 
        message: 'An error occurred on the server',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}

/**
 * Wrapper for events that don't expect data
 */
function withErrorHandlingNoData(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  handler: () => void | Promise<void>
) {
  return async () => {
    try {
      // Check rate limit
      if (!socketRateLimiter.checkLimit(socket.id)) {
        socket.emit('server:rate-limit', {
          message: 'Rate limit exceeded. Please slow down.',
          retryAfter: 60
        });
        return;
      }

      await handler();
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Socket error for ${socket.id}:`,
        error
      );
      socket.emit('server:error', { 
        message: 'An error occurred on the server',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}

// Socket.io connection handling
io.on('connection', (socket) => {
  // Handle initial connection
  handlePlayerConnect(socket, sessionService);
  
  // Send initial board to the player (async to prevent blocking)
  setTimeout(() => {
    const initialBoard = generateBoard(dictionaryService);
    
    // 🔧 TASK 4: Add checksum for validation
    const boardString = JSON.stringify({
      width: initialBoard.width,
      height: initialBoard.height,
      tiles: initialBoard.tiles.map(row => 
        row.map(tile => ({ letter: tile.letter, points: tile.points, x: tile.x, y: tile.y }))
      )
    });
    const initialBoardChecksum = crypto.createHash('md5').update(boardString).digest('hex');
    
    socket.emit('game:initial-board', { board: initialBoard, boardChecksum: initialBoardChecksum });
  }, 0);

  // Create services object for handlers
  const services = {
    dictionaryService,
    generateBoard,
    sessionService,
    roomService
  };

  // Room management handlers
  socket.on('room:create', withErrorHandling(socket, 'room:create', (data) => {
    handleRoomCreate(socket, data as { playerName: string; settings: import('@word-rush/common').MatchSettings }, roomService);
  }));

  socket.on('room:join', withErrorHandling(socket, 'room:join', (data) => {
    handleRoomJoin(socket, data as { roomCode: string; playerName: string }, roomService);
  }));

  socket.on('room:leave', withErrorHandlingNoData(socket, () => {
    handleRoomLeave(socket, roomService);
  }));

  socket.on('room:set-ready', withErrorHandling(socket, 'room:set-ready', (data) => {
    handlePlayerSetReady(socket, data as { isReady: boolean }, roomService);
  }));

  socket.on('room:update-settings', withErrorHandling(socket, 'room:update-settings', (data) => {
    handleRoomUpdateSettings(socket, data as { settings: import('@word-rush/common').MatchSettings }, roomService);
  }));

  socket.on('room:start-match', withErrorHandlingNoData(socket, () => {
    handleMatchStart(socket, roomService, generateBoard, dictionaryService, io);
  }));

  socket.on('player:set-difficulty', withErrorHandling(socket, 'player:set-difficulty', (data) => {
    handlePlayerSetDifficulty(socket, data as { difficulty: import('@word-rush/common').DifficultyLevel }, roomService);
  }));

  // Match flow handlers
  socket.on('match:start-first-round', withErrorHandling(socket, 'match:start-first-round', (data) => {
    handleMatchStartFirstRound(socket, data as { roomCode: string }, io, dictionaryService);
  }));

  socket.on('match:force-end-round', withErrorHandling(socket, 'match:force-end-round', (data) => {
    handleMatchForceEndRound(socket, data as { roomCode: string }, io, dictionaryService);
  }));

  socket.on('match:start-new-match', withErrorHandling(socket, 'match:start-new-match', (data) => {
    handleMatchStartNewMatch(socket, data as { roomCode: string }, io, dictionaryService);
  }));

  // Board synchronization handlers
  socket.on('board:request-resync', withErrorHandlingNoData(socket, () => {
    roomService.handlePlayerRejoin(socket.id, socket);
  }));

  socket.on('player:rejoin', withErrorHandlingNoData(socket, () => {
    roomService.handlePlayerRejoin(socket.id, socket);
  }));

  // Handle player reconnection
  socket.on('player:reconnect', withErrorHandling(socket, 'player:reconnect', (data) => {
    handlePlayerReconnect(socket, data as { sessionId: string; username?: string }, sessionService);
  }));

  // Handle player joining with username (legacy single-player mode)
  socket.on('game:join', withErrorHandling(socket, 'game:join', (data) => {
    handlePlayerJoin(socket, data as { playerName: string }, sessionService);
  }));

  // Handle board requests
  socket.on('game:request-board', withErrorHandlingNoData(socket, () => {
    handleBoardRequest(socket, dictionaryService, generateBoard, sessionService);
  }));

  // Handle shuffle requests
  socket.on('game:shuffle-request', withErrorHandlingNoData(socket, () => {
    handleShuffleRequest(socket, roomService, dictionaryService, generateBoard);
  }));

  // Word submission handler
  socket.on('word:submit', withErrorHandling(socket, 'word:submit', (data) => {
    handleWordSubmit(socket, data as { word: string; tiles: LetterTile[] }, services);
  }));

  // Handle disconnection with room cleanup
  socket.on('disconnect', (reason) => {
    // Handle room cleanup
    const room = roomService.getRoomByPlayerId(socket.id);
    if (room) {
      socket.leave(room.roomCode);
      const updatedRoom = roomService.leaveRoom(room.roomCode, socket.id);
      
      // Notify other players in the room
      if (updatedRoom) {
        socket.to(room.roomCode).emit('room:player-left', {
          playerId: socket.id,
          room: updatedRoom
        });
      }
    }
    
    // Handle regular session cleanup
    handlePlayerDisconnect(socket, reason, sessionService);
  });
});

// Session cleanup is now handled by SessionService

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// Start the server
server.listen(Number(PORT), HOST, () => {
  console.log(`[${new Date().toISOString()}] Word Rush server running on ${HOST}:${PORT}`);
  console.log(`[${new Date().toISOString()}] Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // 🎯 Verify updated difficulty multipliers are loaded correctly
  console.log(`[${new Date().toISOString()}] 🎯 Difficulty Multipliers Active:`, {
    easy: '1x',
    medium: '1.5x', 
    hard: '2x',
    extreme: '3x'
  });
  console.log(`[${new Date().toISOString()}] 🚀 Speed Bonus Multiplier: 1.5x`);
  console.log(`[${new Date().toISOString()}] 📊 Example: 6-point word scores:`);
  console.log(`   Easy: 6 × 1.0 = 6 points`);
  console.log(`   Medium: 6 × 1.5 = 9 points`);
  console.log(`   Hard: 6 × 2.0 = 12 points`);
  console.log(`   Extreme: 6 × 3.0 = 18 points`);
  console.log(`   + Speed Bonus: × 1.5 (e.g., Hard + Speed = 12 × 1.5 = 18 points)`);
  
  // 🔧 CRITICAL FIX: Remove board pre-generation entirely - generate on demand
  // Pre-generation was causing 2+ minute startup delays
  console.log(`[${new Date().toISOString()}] ✅ Server ready - boards will be generated on-demand`);
});

