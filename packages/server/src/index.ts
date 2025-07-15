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
import { SocketRateLimiter } from './services/rate-limiter.js';
import { DictionaryService } from './services/dictionary.js';
import { BoardService } from './services/board.js';
import { SessionService } from './services/session.js';
import { validateSocketEvent, ClientEventSchemas } from './validation/schemas.js';
import { handleWordSubmit } from './handlers/wordHandlers.js';
import { handlePlayerReconnect, handlePlayerJoin, handlePlayerConnect, handlePlayerDisconnect } from './handlers/playerHandlers.js';
import { handleBoardRequest } from './handlers/gameHandlers.js';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData
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
        : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Initialize services
const socketRateLimiter = new SocketRateLimiter();
const dictionaryService = new DictionaryService();
const boardService = new BoardService(dictionaryService);
const sessionService = new SessionService();



// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:5173',
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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dictionary: {
      loaded: dictionaryService.isReady(),
      wordCount: dictionaryService.getWordCount()
    },
    activePlayers: sessionService.getActivePlayerCount()
  });
});



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
          message: `Invalid event data: ${validation.error}`,
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
  
  // Send initial board to the player
  const initialBoard = boardService.generateBoard();
  socket.emit('game:initial-board', { board: initialBoard });

  // Create services object for handlers
  const services = {
    dictionaryService,
    boardService,
    sessionService
  };

  // Handle player reconnection
  socket.on('player:reconnect', withErrorHandling(socket, 'player:reconnect', (data) => {
    handlePlayerReconnect(socket, data, sessionService);
  }));

  // Handle player joining with username
  socket.on('game:join', withErrorHandling(socket, 'game:join', (data) => {
    handlePlayerJoin(socket, data, sessionService);
  }));

  // Handle board requests
  socket.on('game:request-board', withErrorHandlingNoData(socket, () => {
    handleBoardRequest(socket, boardService);
  }));

  // Word submission handler
  socket.on('word:submit', withErrorHandling(socket, 'word:submit', (data) => {
    handleWordSubmit(socket, data, services);
  }));

  // Handle disconnection
  socket.on('disconnect', (reason) => {
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

// Start server
server.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] Word Rush server running on port ${PORT}`
  );
  console.log(
    `[${new Date().toISOString()}] Environment: ${process.env.NODE_ENV || 'development'}`
  );
});
