/**
 * Player Session Service
 * Manages player session creation, updates, and cleanup operations
 * Provides centralized session management for the game server
 */

import { PlayerSession } from '@word-rush/common';

/**
 * Session service module interface
 */
interface SessionModule {
  createOrUpdatePlayerSession: (socketId: string, username?: string) => PlayerSession;
  getPlayerSession: (socketId: string) => PlayerSession | undefined;
  updatePlayerSession: (socketId: string, updates: Partial<PlayerSession>) => PlayerSession | undefined;
  markPlayerDisconnected: (socketId: string) => void;
  findSessionForReconnection: (sessionId: string, username?: string) => { session: PlayerSession; oldSocketId: string } | undefined;
  migrateSession: (oldSocketId: string, newSocketId: string) => PlayerSession | undefined;
  awardCrown: (socketId: string) => PlayerSession | undefined;
  getActivePlayerCount: () => number;
  cleanup: () => void;
}

/**
 * Create a session service for managing player sessions
 * @param cleanupIntervalMs - Cleanup interval in milliseconds (default: 5 minutes)
 * @returns Session service module with all session management functions
 */
function createSessionService(cleanupIntervalMs: number = 5 * 60 * 1000): SessionModule {
  const playerSessions = new Map<string, PlayerSession>();
  
  /**
   * Clean up inactive sessions that haven't been active for 5+ minutes
   * This prevents memory leaks from abandoned sessions
   */
  function cleanupInactiveSessions(): void {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const [socketId, session] of playerSessions.entries()) {
      if (!session.isConnected && (now - session.lastActivity) > fiveMinutes) {
        playerSessions.delete(socketId);
        console.log(`[${new Date().toISOString()}] Cleaned up inactive session: ${socketId}`);
      }
    }
  }

  /**
   * Create or update a player session
   * @param socketId - Unique socket identifier
   * @param username - Optional username for the player
   * @returns Created or updated player session
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
        crowns: 0, // Initialize crowns
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
   * Get a player session by socket ID
   * @param socketId - Socket ID to look up
   * @returns Player session or undefined if not found
   */
  function getPlayerSession(socketId: string): PlayerSession | undefined {
    return playerSessions.get(socketId);
  }

  /**
   * Update player session with new data
   * @param socketId - Socket ID of the session to update
   * @param updates - Partial session data to update
   * @returns Updated session or undefined if session not found
   */
  function updatePlayerSession(socketId: string, updates: Partial<PlayerSession>): PlayerSession | undefined {
    const session = playerSessions.get(socketId);
    if (session) {
      Object.assign(session, updates);
      session.lastActivity = Date.now();
      return session;
    }
    return undefined;
  }

  /**
   * Mark player as disconnected but keep session for potential reconnection
   * @param socketId - Socket ID of the disconnected player
   */
  function markPlayerDisconnected(socketId: string): void {
    const session = playerSessions.get(socketId);
    if (session) {
      session.isConnected = false;
      session.lastActivity = Date.now();
    }
  }

  /**
   * Find session by session ID or username for reconnection
   * @param sessionId - Session ID to search for
   * @param username - Optional username to search for as fallback
   * @returns Found session and its current socket ID, or undefined
   */
  function findSessionForReconnection(sessionId: string, username?: string): { session: PlayerSession; oldSocketId: string } | undefined {
    // Try to find by session ID first
    let existingSession = playerSessions.get(sessionId);
    let oldSocketId = sessionId;
    
    if (!existingSession && username) {
      // Fallback: search by username if sessionId doesn't match
      for (const [id, session] of playerSessions.entries()) {
        if (session.username === username) {
          existingSession = session;
          oldSocketId = id;
          break;
        }
      }
    }
    
    if (existingSession) {
      return { session: existingSession, oldSocketId };
    }
    
    return undefined;
  }

  /**
   * Migrate session to new socket ID (for reconnection)
   * @param oldSocketId - Previous socket ID
   * @param newSocketId - New socket ID
   * @returns Updated session or undefined if old session not found
   */
  function migrateSession(oldSocketId: string, newSocketId: string): PlayerSession | undefined {
    const session = playerSessions.get(oldSocketId);
    if (session) {
      // Remove from old socket ID and add to new one
      playerSessions.delete(oldSocketId);
      session.socketId = newSocketId;
      session.id = newSocketId;
      session.isConnected = true;
      session.lastActivity = Date.now();
      playerSessions.set(newSocketId, session);
      return session;
    }
    return undefined;
  }

  /**
   * Award crown to a player session
   * @param socketId - Socket ID of the player to award the crown to
   * @returns The updated player session or undefined if not found
   */
  function awardCrown(socketId: string): PlayerSession | undefined {
    const session = playerSessions.get(socketId);
    if (session) {
      session.crowns += 1;
      session.lastActivity = Date.now();
      console.log(`[${new Date().toISOString()}] 👑 Crown awarded to ${session.username}, total crowns: ${session.crowns}`);
      return session;
    }
    return undefined;
  }

  /**
   * Get total number of active players
   * @returns Number of player sessions
   */
  function getActivePlayerCount(): number {
    return playerSessions.size;
  }

  // Set up periodic cleanup to prevent memory leaks
  const cleanupInterval = setInterval(cleanupInactiveSessions, cleanupIntervalMs);

  /**
   * Cleanup method to be called when server shuts down
   * Clears the cleanup interval and performs final cleanup
   */
  function cleanup(): void {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
    cleanupInactiveSessions();
  }

  // Return the public API
  return {
    createOrUpdatePlayerSession,
    getPlayerSession,
    updatePlayerSession,
    markPlayerDisconnected,
    findSessionForReconnection,
    migrateSession,
    awardCrown,
    getActivePlayerCount,
    cleanup,
  };
}

// Create and export the session service instance
export const sessionService = createSessionService(); 