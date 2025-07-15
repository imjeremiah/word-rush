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
    }
  });
});

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

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(
      `[${new Date().toISOString()}] Player disconnected: ${socket.id}, reason: ${reason}`
    );
  });

  // Word submission handler
  socket.on('word:submit', withErrorHandling(socket, (data) => {
    const { word } = data;
    
    // Validate word using dictionary service
    const isValid = dictionaryService.isValidWord(word);
    
    // Calculate points based on Scrabble scoring (simplified for now)
    const points = isValid ? word.length * 10 : 0;
    
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
