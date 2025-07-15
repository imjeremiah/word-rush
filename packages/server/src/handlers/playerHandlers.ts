/**
 * Player Event Handlers
 * Handles player connection, disconnection, and session management events
 * Includes reconnection logic and session persistence
 */

import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@word-rush/common';

// Type import only, not runtime import to avoid unused var error
type SessionServiceType = typeof import('../services/session.js').sessionService;

/**
 * Handle player reconnection attempts
 * Manages the complete player reconnection flow to restore previous game sessions:
 * 1. Searches for existing session by session ID or username fallback
 * 2. Migrates found session to new socket connection
 * 3. Preserves player score, username, and game progress
 * 4. Sends session restoration confirmation or creates new session if not found
 * @param socket - Socket.io connection from the reconnecting client
 * @param data - Reconnection request data from client
 * @param data.sessionId - Previous session identifier for exact match lookup
 * @param data.username - Optional username for fallback session search
 * @param sessionService - Functional session service module for managing player state
 * @returns void - Communicates results via socket events (player:reconnect-success, player:reconnect-failed)
 */
export function handlePlayerReconnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { sessionId: string; username?: string },
  sessionService: SessionServiceType
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
 * Processes new player registration or existing player re-identification:
 * 1. Creates new session if player is connecting for first time
 * 2. Updates existing session with new username if reconnecting
 * 3. Associates player identity with socket connection
 * 4. Sends updated session data to client for UI updates
 * @param socket - Socket.io connection from the joining client
 * @param data - Player join request data
 * @param data.playerName - Chosen username for the player (1-50 characters, trimmed)
 * @param sessionService - Functional session service module for managing player state
 * @returns void - Sends player:session-update event with new session data
 */
export function handlePlayerJoin(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  data: { playerName: string },
  sessionService: SessionServiceType
): void {
  const { playerName } = data;
  const updatedSession = sessionService.createOrUpdatePlayerSession(socket.id, playerName);
  socket.emit('player:session-update', { session: updatedSession });
  console.log(`[${new Date().toISOString()}] Player ${playerName} joined with ID: ${socket.id}`);
}

/**
 * Handle player connection
 * Manages initial player connection setup and session initialization:
 * 1. Creates new player session with auto-generated username
 * 2. Associates session with socket connection ID
 * 3. Sends welcome message and session data to client
 * 4. Logs connection event for monitoring and debugging
 * @param socket - Socket.io connection from the newly connected client
 * @param sessionService - Functional session service module for managing player state
 * @returns void - Sends server:welcome and player:session-update events
 */
export function handlePlayerConnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  sessionService: SessionServiceType
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
 * Manages graceful player disconnection while preserving session for reconnection:
 * 1. Marks player session as disconnected (but preserves data)
 * 2. Logs disconnection event with reason for monitoring
 * 3. Maintains session in memory for potential reconnection within timeout window
 * 4. Session will be cleaned up automatically after inactivity period
 * @param socket - Socket.io connection that is disconnecting
 * @param reason - Disconnection reason provided by Socket.io (network, client, server, etc.)
 * @param sessionService - Functional session service module for managing player state
 * @returns void - Updates session state internally, no client communication needed
 */
export function handlePlayerDisconnect(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  reason: string,
  sessionService: SessionServiceType
): void {
  console.log(
    `[${new Date().toISOString()}] Player disconnected: ${socket.id}, reason: ${reason}`
  );
  
  // Mark player as disconnected but keep session for potential reconnection
  sessionService.markPlayerDisconnected(socket.id);
}

/**
 * Handle reconnection failure by creating new session
 * Fallback handler when session restoration fails during reconnection attempt:
 * 1. Creates a fresh player session with new socket ID
 * 2. Uses provided username or generates default name if none available
 * 3. Notifies client that reconnection failed but new session was created
 * 4. Logs the reconnection failure for monitoring and debugging
 * @param socket - Socket.io connection from the failed reconnection attempt
 * @param sessionService - Functional session service module for managing player state
 * @param username - Optional username from reconnection attempt to preserve user identity
 * @returns void - Sends player:reconnect-failed and player:session-update events
 */
function handleReconnectionFailure(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  sessionService: SessionServiceType,
  username?: string
): void {
  console.log(`[${new Date().toISOString()}] No existing session found for reconnection, creating new session`);
  const newSession = sessionService.createOrUpdatePlayerSession(socket.id, username);
  socket.emit('player:session-update', { session: newSession });
  socket.emit('player:reconnect-failed', { 
    message: 'Previous session not found, started new session' 
  });
} 