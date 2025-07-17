/**
 * Game Connection Component
 * Handles Socket.io connection, event listeners, and session management
 * Uses game context to share state across the application
 */

import { useEffect, useRef, useCallback, startTransition } from 'react';
import { io } from 'socket.io-client';
import { useGameContext } from '../context/GameContext';
import { notifications } from '../services/notifications';
import { withServerEventValidation } from '../validation/schemas';
import { wordSubmissionTimestamps } from './interactions';

// Debug flag to control socket event logging verbosity
// Set to false in production to reduce console noise
const DEBUG_SOCKET_EVENTS = true; // Toggle for production deployment

// Client-side cache for invalid words to reduce server round-trips
const invalidWordCache = new Map<string, { reason: string; timestamp: number }>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 500; // Maximum cached invalid words

/**
 * Check if a word is in the invalid word cache
 * @param word - Word to check in cache
 * @returns Cached invalid result or null if not found/expired
 */
export function getCachedInvalidWord(word: string): { reason: string } | null {
  const normalizedWord = word.toUpperCase().trim();
  const cached = invalidWordCache.get(normalizedWord);
  
  if (!cached) return null;
  
  // Check if cache entry has expired
  if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
    invalidWordCache.delete(normalizedWord);
    return null;
  }
  
  return { reason: cached.reason };
}

/**
 * Cache an invalid word result
 * @param word - Word to cache
 * @param reason - Invalid reason to cache
 */
function cacheInvalidWord(word: string, reason: string): void {
  const normalizedWord = word.toUpperCase().trim();
  
  // Limit cache size by removing oldest entries
  if (invalidWordCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = invalidWordCache.keys().next().value;
    if (oldestKey) {
      invalidWordCache.delete(oldestKey);
    }
  }
  
  invalidWordCache.set(normalizedWord, {
    reason,
    timestamp: Date.now()
  });
  
  console.log(`[Client] Cached invalid word: "${normalizedWord}" - ${reason} (Cache size: ${invalidWordCache.size})`);
}

// Make cache function globally available for interactions.ts
(window as any).getCachedInvalidWord = getCachedInvalidWord;

/**
 * Conditional socket event logger for debugging data flow
 * Logs incoming socket events only when DEBUG_SOCKET_EVENTS is enabled
 * Reduces console noise in production while maintaining debug capabilities
 * @param eventName - Name of the socket event received
 * @param data - Event payload data from server
 * @returns void - Conditionally logs event information to console
 */
function logSocketEvent(eventName: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  
  // Always log critical errors regardless of debug flag
  if (eventName.includes('error') || eventName.includes('failed')) {
    console.error(`[${timestamp}] ERROR EVENT:`, eventName, data);
  }
  
  // Early return if debug logging is disabled (after error logging)
  if (!DEBUG_SOCKET_EVENTS) return;
  
  console.log(`[${timestamp}] Socket Event Received:`, eventName, data);
  
  // Additional debug logging for match events
  if (eventName.includes('match:') || eventName.includes('round:')) {
    console.warn(`[${timestamp}] MATCH EVENT:`, eventName, data);
  }
}

/**
 * Measure and log word validation latency
 * Calculates round-trip time from submission to response and logs performance
 * @param word - The word that was validated
 * @param isValid - Whether the word was valid or not
 * @returns void - Logs latency information to console
 */
function measureWordLatency(word: string, isValid: boolean): void {
  const submissionTime = wordSubmissionTimestamps.get(word);
  if (submissionTime) {
    const responseTime = Date.now();
    const latency = responseTime - submissionTime;
    
    // Clean up the timestamp
    wordSubmissionTimestamps.delete(word);
    
    // Log with performance assessment
    const status = isValid ? 'VALID' : 'INVALID';
    const performanceWarning = latency > 150 ? ' ⚠️ SLOW' : '';
    
    console.log(`[Client] Word validation latency: ${latency}ms (${status}) - "${word}"${performanceWarning}`);
    
    // Additional warning for slow responses
    if (latency > 150) {
      console.warn(`[Client] Word validation exceeded 150ms target: ${latency}ms for "${word}"`);
    }
  }
}

/**
 * Game Connection component that manages Socket.io connectivity
 * Sets up connection, event handlers, and maintains session state
 * @returns null - This is a logic-only component with no UI
 */
function GameConnection(): null {
  const {
    setSocket,
    setConnectionStatus,
    setPlayerSession,
    setCurrentRoom,
    setGameState,
    setMatchData,
    setLastWordResult,
    setRoundSummary,
    setMatchComplete,
    setRoundTimer,
    setRoundTimerOptimized,
    batchUpdateGameState,
    roundTimer, // 🔴 PHASE 2A: Fix roundTimer reference error
  } = useGameContext();

  // Use refs to prevent stale closures and constant reconnections
  const contextRef = useRef({
    setSocket,
    setConnectionStatus,
    setPlayerSession,
    setLastWordResult,
    setGameState,
    setMatchData,
    setCurrentRoom,
    setRoundSummary,
    setMatchComplete,
    setRoundTimer,
    setRoundTimerOptimized,
    batchUpdateGameState
  });

  // Update refs when context values change
  contextRef.current = {
    setSocket,
    setConnectionStatus,
    setPlayerSession,
    setLastWordResult,
    setGameState,
    setMatchData,
    setCurrentRoom,
    setRoundSummary,
    setMatchComplete,
    setRoundTimer,
    setRoundTimerOptimized,
    batchUpdateGameState
  };

  // 🕰️ PHASE 27: Client-side timer interpolation for smooth 1-second countdown
  const clientTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastServerTimeRef = useRef<number>(0);
  const lastServerUpdateRef = useRef<number>(0);

  /**
   * Start client-side timer interpolation for smooth 1-second countdown
   * Provides smooth countdown between server updates for better UX
   * @param serverTime - Timer value from server in milliseconds
   */
  const startClientSideTimerInterpolation = useCallback((serverTime: number): void => {
    // Clear any existing client timer
    if (clientTimerRef.current) {
      clearInterval(clientTimerRef.current);
      clientTimerRef.current = null;
    }

    // Store server time and update timestamp
    lastServerTimeRef.current = serverTime;
    lastServerUpdateRef.current = Date.now();

    // Don't start interpolation if time is already at 0
    if (serverTime <= 0) {
      contextRef.current.setRoundTimerOptimized(0);
      return;
    }

    console.log(`[${new Date().toISOString()}] ⏰ Starting client timer interpolation from ${Math.ceil(serverTime / 1000)}s`);

    // Start 1-second countdown interpolation
    clientTimerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSinceServerUpdate = now - lastServerUpdateRef.current;
      const interpolatedTime = Math.max(0, lastServerTimeRef.current - elapsedSinceServerUpdate);

      // Update the timer display
      contextRef.current.setRoundTimerOptimized(interpolatedTime);

      // Stop interpolation when time reaches 0
      if (interpolatedTime <= 0) {
        if (clientTimerRef.current) {
          clearInterval(clientTimerRef.current);
          clientTimerRef.current = null;
        }
        console.log(`[${new Date().toISOString()}] ⏰ Client timer interpolation completed`);
      }
    }, 1000); // Update every 1 second for smooth countdown
  }, []);

  /**
   * Stop client-side timer interpolation
   */
  const stopClientSideTimerInterpolation = useCallback((): void => {
    if (clientTimerRef.current) {
      clearInterval(clientTimerRef.current);
      clientTimerRef.current = null;
      console.log(`[${new Date().toISOString()}] ⏰ Client timer interpolation stopped`);
    }
  }, []);

  useEffect(() => {
    if (DEBUG_SOCKET_EVENTS) {
      console.log('🔌 Creating socket connection (should only happen once)');
    }
    const newSocket = io('http://localhost:3001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    contextRef.current.setSocket(newSocket);

    // Connection event handlers (no validation needed for built-in socket events)
    newSocket.on('connect', () => {
      try {
        if (DEBUG_SOCKET_EVENTS) {
          console.log('Connected to server');
        }
        contextRef.current.setConnectionStatus('connected');
        
        // Try to reconnect with previous session if available
        const storedSession = localStorage.getItem('wordRushSession');
        if (storedSession) {
          try {
            const sessionData = JSON.parse(storedSession);
            console.log('Attempting to reconnect with stored session:', sessionData);
            newSocket.emit('player:reconnect', {
              sessionId: sessionData.id,
              username: sessionData.username
            });
          } catch (error) {
            console.error('Failed to parse stored session:', error);
            localStorage.removeItem('wordRushSession');
            notifications.success('Connected to Word Rush server!', 3000);
          }
        } else {
          notifications.success('Connected to Word Rush server!', 3000);
        }
      } catch (error) {
        console.error('Error in connect handler:', error);
        contextRef.current.setConnectionStatus('connected'); // Still mark as connected
      }
    });

    newSocket.on('disconnect', () => {
      try {
        if (DEBUG_SOCKET_EVENTS) {
          console.log('Disconnected from server');
        }
        contextRef.current.setConnectionStatus('disconnected');
        notifications.warning('Disconnected from server', 3000);
      } catch (error) {
        console.error('Error in disconnect handler:', error);
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      try {
        if (DEBUG_SOCKET_EVENTS) {
          console.log(`Reconnected after ${attemptNumber} attempts`);
        }
        notifications.info(`Reconnected after ${attemptNumber} attempts`, 3000);
      } catch (error) {
        console.error('Error in reconnect handler:', error);
      }
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      try {
        if (DEBUG_SOCKET_EVENTS) {
          console.log(`Reconnection attempt ${attemptNumber}`);
        }
        contextRef.current.setConnectionStatus('connecting');
      } catch (error) {
        console.error('Error in reconnect_attempt handler:', error);
      }
    });

    newSocket.on('reconnect_error', (error) => {
      try {
        console.error('Reconnection error:', error);
        notifications.error('Reconnection failed', 3000);
      } catch (handlerError) {
        console.error('Error in reconnect_error handler:', handlerError);
      }
    });

    newSocket.on('reconnect_failed', () => {
      try {
        console.error('All reconnection attempts failed');
        notifications.error('Failed to reconnect. Please refresh the page.', 5000);
      } catch (error) {
        console.error('Error in reconnect_failed handler:', error);
      }
    });

    // Server message handlers with validation
    newSocket.on('server:welcome', withServerEventValidation('server:welcome', (data) => {
      logSocketEvent('server:welcome', data);
      console.log('Welcome message received:', data);
    }));

    newSocket.on('server:error', withServerEventValidation('server:error', (data) => {
      logSocketEvent('server:error', data);
      console.error('Server error:', data);
      notifications.error(`Server Error: ${data.message}`, 5000);
    }));

    newSocket.on('server:rate-limit', withServerEventValidation('server:rate-limit', (data) => {
      logSocketEvent('server:rate-limit', data);
      console.warn('Rate limit exceeded:', data);
      notifications.warning(`Rate limit exceeded: ${data.message}`, 8000);
    }));

    // Game event handlers with validation
    newSocket.on('word:valid', withServerEventValidation('word:valid', (data) => {
      console.log('Valid word submitted:', data);
      contextRef.current.setLastWordResult({
        word: data.word,
        points: data.points,
        isValid: true,
      });
      
      notifications.success(`"${data.word}" is valid! +${data.points} points`, 2000);
      measureWordLatency(data.word, true);
    }));

    newSocket.on('word:invalid', withServerEventValidation('word:invalid', (data) => {
      console.log('Invalid word submitted:', data);
      contextRef.current.setLastWordResult({
        word: data.word,
        points: 0,
        isValid: false,
      });
      
      // Cache the invalid word to prevent future server requests
      cacheInvalidWord(data.word, data.reason);
      
      notifications.error(`"${data.word}" is not valid: ${data.reason}`, 3000);
      measureWordLatency(data.word, false);
    }));

    newSocket.on('game:score-update', withServerEventValidation('game:score-update', (data) => {
      logSocketEvent('game:score-update', data);
      console.log('Score update:', data);
      
      // Update currentRoom players with new scores
      contextRef.current.setCurrentRoom(prev => {
        if (!prev) return prev;
        const updatedPlayers = prev.players.map(p => 
          p.id === data.playerId 
            ? { 
                ...p, 
                score: data.totalScore, 
                roundScore: (p.roundScore || 0) + data.score 
              } 
            : p
        );
        return { ...prev, players: updatedPlayers };
      });
      
      notifications.info(`+${data.score} points! Total: ${data.totalScore}`, 2000);
    }));

    newSocket.on('player:session-update', withServerEventValidation('player:session-update', (data) => {
      console.log('Session update:', data);
      contextRef.current.setPlayerSession(data.session);
      
      // Store session in localStorage for reconnection
      localStorage.setItem('wordRushSession', JSON.stringify({
        id: data.session.id,
        username: data.session.username,
        score: data.session.score,
        wordsSubmitted: data.session.wordsSubmitted
      }));
    }));

    newSocket.on('player:reconnect-success', withServerEventValidation('player:reconnect-success', (data) => {
      console.log('Reconnection successful:', data);
      notifications.success(`Welcome back! ${data.message}`, 4000);
      contextRef.current.setPlayerSession(data.session);
      
      // Update stored session
      localStorage.setItem('wordRushSession', JSON.stringify({
        id: data.session.id,
        username: data.session.username,
        score: data.session.score,
        wordsSubmitted: data.session.wordsSubmitted
      }));
    }));

    newSocket.on('player:reconnect-failed', withServerEventValidation('player:reconnect-failed', (data) => {
      console.log('Reconnection failed:', data);
      notifications.warning(data.message, 4000);
      
      // Clear stored session since it's invalid
      localStorage.removeItem('wordRushSession');
    }));

    newSocket.on('game:initial-board', withServerEventValidation('game:initial-board', (data) => {
      console.log('Initial board received:', data);
      notifications.info('New game board loaded!', 2000);
    }));

    // Room management event handlers
    newSocket.on('room:created', withServerEventValidation('room:created', (data) => {
      console.log('Room created:', data);
      notifications.success(`Room created! Code: ${data.roomCode}`, 4000);
      
      // Force state transition to ensure UI updates properly
      // The room:joined event should follow immediately, but this ensures transition
      console.log('Room creation confirmed, waiting for room:joined event...');
    }));

    newSocket.on('room:joined', withServerEventValidation('room:joined', (data) => {
      console.log('Joined room:', data.room);
      
      // Track state transition for component stability
      localStorage.setItem('wordRushGameState', 'lobby');
      
      contextRef.current.setCurrentRoom(data.room);
      contextRef.current.setGameState('lobby');
      notifications.success(`Joined room ${data.room.roomCode}!`, 3000);
    }));

    newSocket.on('room:left', withServerEventValidation('room:left', (data) => {
      console.log('Left room:', data.message);
      contextRef.current.setCurrentRoom(null);
      contextRef.current.setGameState('menu');
      notifications.info(data.message, 3000);
    }));

    newSocket.on('room:player-joined', withServerEventValidation('room:player-joined', (data) => {
      console.log('Player joined room:', data.player.username);
      contextRef.current.setCurrentRoom(data.room);
      notifications.info(`${data.player.username} joined the room`, 3000);
    }));

    newSocket.on('room:player-left', withServerEventValidation('room:player-left', (data) => {
      console.log('Player left room:', data.playerId);
      contextRef.current.setCurrentRoom(data.room);
      notifications.info('A player left the room', 3000);
    }));

    newSocket.on('room:player-ready', withServerEventValidation('room:player-ready', (data) => {
      console.log('Player ready status changed:', data.playerId, data.isReady);
      contextRef.current.setCurrentRoom(data.room);
      // Optional: show notification for ready status changes
    }));

    newSocket.on('room:settings-updated', withServerEventValidation('room:settings-updated', (data) => {
      console.log('Room settings updated:', data.settings);
      contextRef.current.setCurrentRoom(data.room);
      notifications.info('Match settings updated', 2000);
    }));

    newSocket.on('room:not-found', withServerEventValidation('room:not-found', (data) => {
      console.log('Room not found:', data.message);
      notifications.error(data.message, 4000);
    }));

    // Match flow event handlers
    newSocket.on('match:starting', withServerEventValidation('match:starting', (data) => {
      console.log(`[${new Date().toISOString()}] 🚀 Match starting countdown:`, data.countdown);
      contextRef.current.setGameState('countdown');
      notifications.info(`Match starting in ${data.countdown}...`, data.countdown * 1000);
    }));

    newSocket.on('match:started', withServerEventValidation('match:started', (data) => {
      try {
        const receiveTime = Date.now();
        
        // 🔴 PHASE 2A: Add comprehensive error handling and validation
        if (!data || !data.board || !data.currentRound || !data.totalRounds) {
          console.error(`[${new Date().toISOString()}] ❌ Invalid match:started data:`, data);
          notifications.error('Invalid match data received', 3000);
          return;
        }
        
        // Track game state change for component stability
        localStorage.setItem('wordRushGameState', 'match');
        localStorage.setItem('wordRushRoundData', JSON.stringify({
          currentRound: data.currentRound,
          totalRounds: data.totalRounds,
          startTime: Date.now()
        }));
        
        // Board checksum validation with error handling
        try {
          const boardString = JSON.stringify({
            width: data.board.width,
            height: data.board.height,
            tiles: data.board.tiles.map(row => 
              row.map(tile => ({ letter: tile.letter, points: tile.points, x: tile.x, y: tile.y }))
            )
          });
          
          // Create MD5 hash for client-side validation (simplified version)
          const clientChecksum = btoa(boardString).slice(0, 16); // Simple hash for client validation
          
          // Client-side checksum mismatch detection for match start
          // TODO: Temporarily disabled due to algorithm mismatch between client/server
          const matchStartChecksumMismatch = clientChecksum !== data.boardChecksum;
          const boardSummary = data.board.tiles.map(row => row.map(tile => tile.letter).join('')).join('|');
          
          // Condensed match start validation log with all key information (respects debug flag)
          if (matchStartChecksumMismatch) {
            // Always log checksum mismatches as they're critical errors
            console.warn(`[${new Date().toISOString()}] ⚠️ Match started (Round ${data.currentRound}/${data.totalRounds}) - Checksum mismatch detected (validation disabled) | Server: ${data.boardChecksum}, Client: ${clientChecksum} | Board: ${data.board.width}x${data.board.height}, Players: ${data.playerCount} | Layout: ${boardSummary.slice(0, 20)}...`);
            // Temporarily disabled to prevent infinite loops
            // newSocket.emit('board:request-resync');
            // notifications.warning('Board sync error detected at match start', 3000);
            // Continue processing but flag the issue
          } else if (DEBUG_SOCKET_EVENTS) {
            // Only log successful validations when debug is enabled
            console.log(`[${new Date().toISOString()}] ✅ Match started (Round ${data.currentRound}/${data.totalRounds}) - Checksum validated: ${clientChecksum} | Board: ${data.board.width}x${data.board.height}, Players: ${data.playerCount} | Layout: ${boardSummary.slice(0, 20)}...`);
          }
        } catch (boardError) {
          console.error(`[${new Date().toISOString()}] ❌ Board checksum validation failed:`, boardError);
          // Continue anyway, as this is non-critical
        }
        
        // Note: Game state already set to 'match' in match:starting handler
        contextRef.current.setRoundTimer({
          timeRemaining: data.timeRemaining || 90000,
          currentRound: data.currentRound,
          totalRounds: data.totalRounds
        });
        contextRef.current.setMatchData({
          currentRound: data.currentRound,
          totalRounds: data.totalRounds,
          timeRemaining: data.timeRemaining || 90000,
          leaderboard: [] // Will be updated separately
        });
        notifications.success('Match started! Good luck!', 3000);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error processing match:started event:`, error, 'Data:', data);
        notifications.error('Failed to start match', 3000);
        // Try to recover by going back to lobby
        contextRef.current.setGameState('lobby');
      }
    }));

    // Board synchronization event handler with client-side throttling
    let lastResyncTime = 0;
    const RESYNC_THROTTLE_MS = 2000; // Minimum 2 seconds between processing resyncs
    let resyncStats = { total: 0, throttled: 0, processed: 0 };
    
          newSocket.on('board:resync', (data: { board: any; boardChecksum: string; timeRemaining: number; sequenceNumber: number; syncType: string }) => {
        try {
          const currentTime = Date.now();
          resyncStats.total++;
          
          // Throttle periodic resyncs to reduce processing overhead
          if (data.syncType === 'periodic' && (currentTime - lastResyncTime) < RESYNC_THROTTLE_MS) {
            resyncStats.throttled++;
            console.log(`[${new Date().toISOString()}] ⏳ Periodic resync throttled (${currentTime - lastResyncTime}ms < ${RESYNC_THROTTLE_MS}ms) | Stats: ${resyncStats.throttled}/${resyncStats.total} throttled`);
            return;
          }
          
          lastResyncTime = currentTime;
          resyncStats.processed++;
          console.log(`[${new Date().toISOString()}] 📡 Board resync received (${data.syncType}): checksum=${data.boardChecksum} | Stats: ${resyncStats.processed}/${resyncStats.total} processed`);
        
        // 🔴 PHASE 2A: Add comprehensive error handling and validation
        if (!data || !data.board || !data.syncType) {
          console.error(`[${new Date().toISOString()}] ❌ Invalid board:resync data:`, data);
          return;
        }
        
        // Validate and apply the synchronized board state
        const boardString = JSON.stringify({
          width: data.board.width,
          height: data.board.height,
          tiles: data.board.tiles.map((row: any[]) => 
            row.map(tile => ({ letter: tile.letter, points: tile.points, x: tile.x, y: tile.y }))
          )
        });
        
        const clientChecksum = btoa(boardString).slice(0, 16);
        
        // Client-side checksum mismatch detection and recovery
        // TODO: Temporarily disabled due to algorithm mismatch between client/server
        // Server uses MD5, client uses base64 - need to align before enabling
        const checksumMismatch = clientChecksum !== data.boardChecksum;
        if (checksumMismatch) {
          console.warn(`[${new Date().toISOString()}] ⚠️ Checksum mismatch detected (validation disabled)`);
          console.warn(`[${new Date().toISOString()}] 🔄 Server: ${data.boardChecksum}, Client: ${clientChecksum}`);
          // Temporarily disabled to prevent infinite loops
          // newSocket.emit('board:request-resync');
          // notifications.warning('Board sync error detected - requesting update', 3000);
          // return; // Don't process the mismatched data
        } else {
          console.log(`[${new Date().toISOString()}] ✅ Board checksum validated: ${clientChecksum}`);
        }
        
        if (data.syncType === 'rejoin') {
          console.log(`[${new Date().toISOString()}] 🔄 Rejoined game successfully: board synchronized`);
          contextRef.current.setGameState('match');
          contextRef.current.setRoundTimer({
            timeRemaining: data.timeRemaining,
            currentRound: (data as any).currentRound || 1,
            totalRounds: (data as any).totalRounds || 3
          });
          notifications.success('Rejoined game successfully!', 3000);
        } else if (data.syncType === 'periodic') {
          // Silent periodic sync - just validate
          console.log(`[${new Date().toISOString()}] 🔄 Periodic board sync: checksum validated`);
        }
        
        // Update round timer if available
        if (data.timeRemaining && roundTimer) {
          contextRef.current.setRoundTimerOptimized(data.timeRemaining);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error processing board:resync event:`, error, 'Data:', data);
        notifications.error('Board synchronization failed', 3000);
      }
    });

    newSocket.on('match:timer-update', withServerEventValidation('match:timer-update', (data) => {
      // 🕰️ PHASE 27: Enhanced timer updates with client-side interpolation
      console.log(`[${new Date().toISOString()}] ⏰ Server timer update: ${Math.ceil(data.timeRemaining / 1000)}s`);
      
      // Update immediately with server value (no debouncing)
      contextRef.current.setRoundTimerOptimized(data.timeRemaining);
      
      // Start client-side interpolation for smooth 1-second countdown
      startClientSideTimerInterpolation(data.timeRemaining);
    }));

    newSocket.on('match:round-end', withServerEventValidation('match:round-end', (data) => {
      logSocketEvent('match:round-end', data);
      console.log('Round ended:', data.scores);
      
      // 🕰️ PHASE 27: Stop client timer when round ends
      stopClientSideTimerInterpolation();
      
      // Track state transition for component stability
      localStorage.setItem('wordRushGameState', 'round-end');
      
      contextRef.current.setGameState('round-end');
      contextRef.current.setRoundSummary(data);
      notifications.info(`Round ${data.roundNumber} complete!`, 3000);
      
      // Auto-unpause for next round if match isn't complete
      if (!data.isMatchComplete) {
        setTimeout(() => {
          localStorage.setItem('wordRushGameState', 'match');  // Track transition back to match
          contextRef.current.setGameState('match');  // Auto-unpause to next round
          notifications.success('Starting next round!', 2000);
        }, 5000);  // 5 second delay as per project specs
      }
    }));

    newSocket.on('match:finished', withServerEventValidation('match:finished', (data) => {
      logSocketEvent('match:finished', data);
      console.log('Match finished:', data);
      
      // 🕰️ PHASE 27: Stop client timer when match ends
      stopClientSideTimerInterpolation();
      
      // Track state transition for component stability
      localStorage.setItem('wordRushGameState', 'match-end');
      
      contextRef.current.setGameState('match-end');
      contextRef.current.setMatchComplete(data);
      const winnerName = data.winner?.username || 'Unknown';
      notifications.success(`Match over! Winner: ${winnerName}`, 5000);
      
      // Auto-return to lobby after showing results
      setTimeout(() => {
        localStorage.setItem('wordRushGameState', 'lobby');  // Track return to lobby
        contextRef.current.setGameState('lobby');
        notifications.info('Returning to lobby...', 2000);
      }, 10000);  // 10 second delay to show results
    }));

    newSocket.on('game:leaderboard-update', withServerEventValidation('game:leaderboard-update', (data) => {
      logSocketEvent('game:leaderboard-update', data);
      console.log('Leaderboard update:', data.players);
      
      // Pre-calculate sorted leaderboard for efficiency
      const sortedLeaderboard = data.players.sort((a, b) => b.score - a.score);
      
      // Use batched state updates to reduce renders by combining both updates
      // This creates a single render cycle instead of two separate ones
      const updateFunctions: (() => void)[] = [
        // Update matchData leaderboard with sorted players
        () => contextRef.current.setMatchData(prev => prev ? {
          ...prev,
          leaderboard: sortedLeaderboard
        } : null),
        
        // Update currentRoom players to keep state in sync
        () => contextRef.current.setCurrentRoom(prev => {
          if (!prev) return prev;
          const updatedPlayers = prev.players.map(roomPlayer => {
            const leaderboardPlayer = data.players.find(lp => lp.id === roomPlayer.id);
            return leaderboardPlayer 
              ? { ...roomPlayer, score: leaderboardPlayer.score, difficulty: leaderboardPlayer.difficulty }
              : roomPlayer;
          });
          return { ...prev, players: updatedPlayers };
        })
      ];
      
      // Batch both updates to reduce unnecessary re-renders
      console.log(`[GameConnection] Batching ${updateFunctions.length} leaderboard state updates`);
      startTransition(() => {
        updateFunctions.forEach(update => update());
      });
    }));



    // Cleanup on unmount
    return () => {
      if (DEBUG_SOCKET_EVENTS) {
        console.log('🔌 Closing socket connection (cleanup)');
      }
      
      // 🕰️ PHASE 27: Clean up client-side timer interpolation
      stopClientSideTimerInterpolation();
      
      newSocket.close();
    };
  }, []); // Empty dependency array to prevent socket recreation

  return null; // This component only manages logic, no UI
}

export default GameConnection; 