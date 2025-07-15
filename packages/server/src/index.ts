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
import { SocketRateLimiter } from './services/rate-limiter';
import { DictionaryService } from './services/dictionary';
import { BoardService } from './services/board';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  PlayerSession 
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

// Player session management
const playerSessions = new Map<string, PlayerSession>();

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
    activePlayers: playerSessions.size
  });
});

/**
 * Create or update a player session
 */
function createOrUpdatePlayerSession(socketId: string, username?: string): PlayerSession {
  let session = playerSessions.get(socketId);
  
  if (!session) {
    session = {
      id: socketId,
      username: username || `Player-${socketId.substring(0, 8)}`,
      socketId,
      isConnected: true,
      lastActivity: Date.now(),
      score: 0,
      wordsSubmitted: 0,
    };
    playerSessions.set(socketId, session);
  } else {
    session.isConnected = true;
    session.lastActivity = Date.now();
    if (username) {
      session.username = username;
    }
  }
  
  return session;
}

/**
 * Wrapper function for socket event handlers to provide error handling and rate limiting
 */
function withErrorHandling<T extends unknown[]>(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  handler: (...args: T) => void | Promise<void>
) {
  return async (...args: T) => {
    try {
      // Check rate limit
      if (!socketRateLimiter.checkLimit(socket.id)) {
        socket.emit('server:rate-limit', {
          message: 'Rate limit exceeded. Please slow down.',
          retryAfter: 60
        });
        return;
      }

      await handler(...args);
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
  console.log(`[${new Date().toISOString()}] Player connected: ${socket.id}`);

  // Create initial player session
  const session = createOrUpdatePlayerSession(socket.id);
  
  // Send initial board to the player
  const initialBoard = boardService.generateBoard();
  socket.emit('game:initial-board', { board: initialBoard });
  
  // Send player session info
  socket.emit('player:session-update', { session });

  // Handle player joining with username
  socket.on('game:join', withErrorHandling(socket, (data) => {
    const { playerName } = data;
    const updatedSession = createOrUpdatePlayerSession(socket.id, playerName);
    socket.emit('player:session-update', { session: updatedSession });
    console.log(`[${new Date().toISOString()}] Player ${playerName} joined with ID: ${socket.id}`);
  }));

  // Handle board requests
  socket.on('game:request-board', withErrorHandling(socket, () => {
    const newBoard = boardService.generateBoard();
    socket.emit('game:initial-board', { board: newBoard });
  }));

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(
      `[${new Date().toISOString()}] Player disconnected: ${socket.id}, reason: ${reason}`
    );
    
    // Mark player as disconnected but keep session for potential reconnection
    const session = playerSessions.get(socket.id);
    if (session) {
      session.isConnected = false;
      session.lastActivity = Date.now();
    }
  });

  // Word submission handler
  socket.on('word:submit', withErrorHandling(socket, (data) => {
    const { word } = data;
    
    // Get player session
    const session = playerSessions.get(socket.id);
    if (!session) {
      socket.emit('server:error', { 
        message: 'Player session not found',
        code: 'NO_SESSION'
      });
      return;
    }

    // Validate word using dictionary service
    const isValid = dictionaryService.isValidWord(word);
    
    // Calculate points using BoardService
    const points = isValid ? boardService.calculateWordScore(word) : 0;
    
    // Update player score if valid
    if (isValid) {
      session.score += points;
      session.wordsSubmitted += 1;
      session.lastActivity = Date.now();
      
      // Send score update
      socket.emit('game:score-update', {
        playerId: socket.id,
        score: points,
        totalScore: session.score
      });
    }
    
    // Send validation result back to client
    socket.emit('word:validation-result', {
      isValid,
      word,
      points,
      reason: isValid ? undefined : 'Word not found in dictionary',
      playerId: socket.id,
      timestamp: Date.now()
    });
  }));

  // Send welcome message to newly connected client
  socket.emit('server:welcome', {
    message: 'Connected to Word Rush server',
    socketId: socket.id,
  });
});

// Clean up inactive sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [socketId, session] of playerSessions.entries()) {
    if (!session.isConnected && (now - session.lastActivity) > fiveMinutes) {
      playerSessions.delete(socketId);
      console.log(`[${new Date().toISOString()}] Cleaned up inactive session: ${socketId}`);
    }
  }
}, 5 * 60 * 1000);

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
