/**
 * Player Event Handlers
 * Handles player connection, disconnection, and session management events
 * Includes reconnection logic and session persistence
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@word-rush/common';
import { SessionService } from '../services/session.js';

/**
 * Handle player reconnection attempts
 * Tries to restore previous session based on session ID or username
 * @param socket - Socket connection to the client
 * @param data - Reconnection data containing session ID and optional username
 * @param sessionService - Session service for managing player sessions
 */
export function handlePlayerReconnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { sessionId: string; username?: string },
  sessionService: SessionService
): void {
  const { sessionId, username } = data;
  console.log(`[${new Date().toISOString()}] Player attempting to reconnect with sessionId: ${sessionId}`);
  
  // Try to find existing session by sessionId or username
  const reconnectionResult = sessionService.findSessionForReconnection(sessionId, username);
  
  if (reconnectionResult) {
    const { oldSocketId } = reconnectionResult;
    
    // Migrate session to new socket ID
    const restoredSession = sessionService.migrateSession(oldSocketId, socket.id);
    
    if (restoredSession) {
      console.log(`[${new Date().toISOString()}] Player ${restoredSession.username} successfully reconnected. Score: ${restoredSession.score}`);
      
      // Send restored session info
      socket.emit('player:session-update', { session: restoredSession });
      socket.emit('player:reconnect-success', { 
        message: 'Successfully reconnected!', 
        session: restoredSession 
      });
    } else {
      // Failed to migrate session
      handleReconnectionFailure(socket, sessionService, username);
    }
  } else {
    // No existing session found
    handleReconnectionFailure(socket, sessionService, username);
  }
}

/**
 * Handle player joining with username
 * Creates or updates session with provided username
 * @param socket - Socket connection to the client
 * @param data - Join data containing player name
 * @param sessionService - Session service for managing player sessions
 */
export function handlePlayerJoin(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { playerName: string },
  sessionService: SessionService
): void {
  const { playerName } = data;
  const updatedSession = sessionService.createOrUpdatePlayerSession(socket.id, playerName);
  socket.emit('player:session-update', { session: updatedSession });
  console.log(`[${new Date().toISOString()}] Player ${playerName} joined with ID: ${socket.id}`);
}

/**
 * Handle player connection
 * Creates initial session and sends welcome message
 * @param socket - Socket connection to the client
 * @param sessionService - Session service for managing player sessions
 */
export function handlePlayerConnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  sessionService: SessionService
): void {
  console.log(`[${new Date().toISOString()}] Player connected: ${socket.id}`);

  // Create initial player session
  const session = sessionService.createOrUpdatePlayerSession(socket.id);
  
  // Send player session info
  socket.emit('player:session-update', { session });

  // Send welcome message to newly connected client
  socket.emit('server:welcome', {
    message: 'Connected to Word Rush server',
    socketId: socket.id,
  });
}

/**
 * Handle player disconnection
 * Marks player as disconnected but keeps session for potential reconnection
 * @param socket - Socket connection to the client
 * @param reason - Disconnect reason
 * @param sessionService - Session service for managing player sessions
 */
export function handlePlayerDisconnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  reason: string,
  sessionService: SessionService
): void {
  console.log(
    `[${new Date().toISOString()}] Player disconnected: ${socket.id}, reason: ${reason}`
  );
  
  // Mark player as disconnected but keep session for potential reconnection
  sessionService.markPlayerDisconnected(socket.id);
}

/**
 * Handle reconnection failure by creating new session
 * @param socket - Socket connection to the client
 * @param sessionService - Session service for managing player sessions
 * @param username - Optional username from failed reconnection attempt
 */
function handleReconnectionFailure(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  sessionService: SessionService,
  username?: string
): void {
  console.log(`[${new Date().toISOString()}] No existing session found for reconnection, creating new session`);
  const newSession = sessionService.createOrUpdatePlayerSession(socket.id, username);
  socket.emit('player:session-update', { session: newSession });
  socket.emit('player:reconnect-failed', { 
    message: 'Previous session not found, started new session' 
  });
} 