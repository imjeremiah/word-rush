/**
 * Game Connection Component
 * Handles Socket.io connection, event listeners, and session management
 * Uses game context to share state across the application
 */

import { useEffect, useRef, useCallback, startTransition } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameContext } from '../context/GameContext';
import { notifications } from '../services/notifications';
import { withServerEventValidation } from '../validation/schemas';
import { wordSubmissionTimestamps } from './interactions';

// 🧪 Load test utilities in development
if (process.env.NODE_ENV === 'development') {
  import('../services/checksumTestUtils.js').catch(() => {
    // Silently ignore if test utils fail to load
  });
}

// 🚀 DEPLOYMENT: Use Vite environment variables for the server URL
// This allows Render to inject the live server URL during the build process.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

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
    gameState, // Add missing state for timer dependencies
    singlePlayerDuration, // Add missing state for timer dependencies
    setSinglePlayerScore, // Add missing setter for single player scoring
    setSinglePlayerStats, // Add missing setter for single player stats
    singlePlayerDifficulty, // Add missing state for difficulty
    socket, // Add actual socket for event listeners
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
    batchUpdateGameState,
    gameState,
    singlePlayerDuration,
    setSinglePlayerScore,
    singlePlayerDifficulty,
    socket,
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
    batchUpdateGameState,
    gameState,
    singlePlayerDuration,
    setSinglePlayerScore,
    singlePlayerDifficulty,
    socket,
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

  // 🚨 REACT STRICT MODE FIX: Use refs to persist socket across re-renders
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 🚨 REACT STRICT MODE FIX: Prevent duplicate socket creation during double effect execution
    if (isInitializedRef.current || socketRef.current?.connected) {
      if (DEBUG_SOCKET_EVENTS) {
        console.log('🔌 Socket already initialized, skipping creation');
      }
      return;
    }
    
    isInitializedRef.current = true;
    let isCleanedUp = false;
    
    if (DEBUG_SOCKET_EVENTS) {
      console.log('🔌 Creating socket connection (should only happen once)');
    }
    
    // 🚨 EDGE CASE 4: Mobile/Variable Networks - Device and connection detection (MOVED UP)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    // 🚨 EDGE CASE 4: Adaptive socket configuration for mobile/variable networks
    // 🚀 OPTIMIZATION: Increased timeouts to accommodate slower board generation
    const socketConfig = {
      reconnectionAttempts: isMobileDevice || isSlowConnection ? 8 : 5, // More attempts for mobile
      reconnectionDelay: isMobileDevice || isSlowConnection ? 2000 : 1000, // Longer delays for mobile
      reconnectionDelayMax: isMobileDevice || isSlowConnection ? 10000 : 5000, // Higher max for mobile
      timeout: isMobileDevice || isSlowConnection ? 60000 : 45000, // Increased timeout for board generation patience
    };
    
    console.log(`[${new Date().toISOString()}] 📱 Using adaptive socket config:`, socketConfig);
    
    const newSocket = io(SERVER_URL, socketConfig);
    socketRef.current = newSocket;
    
    // 🚨 REACT STRICT MODE FIX: Only set socket if not cleaned up
    if (!isCleanedUp) {
      contextRef.current.setSocket(newSocket);
    }
    
    console.log(`[${new Date().toISOString()}] 📱 Device detection: mobile=${isMobileDevice}, slow_connection=${isSlowConnection}`);
    
    // 🚨 REACT STRICT MODE FIX: Add connection success/failure logging
    newSocket.on('connect', () => {
      console.log(`[${new Date().toISOString()}] ✅ Socket connected successfully to ${SERVER_URL}`);
      contextRef.current.setConnectionStatus('connected');
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log(`[${new Date().toISOString()}] ❌ Socket disconnected: ${reason}`);
      contextRef.current.setConnectionStatus('disconnected');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error(`[${new Date().toISOString()}] ❌ Socket connection error:`, error);
      contextRef.current.setConnectionStatus('disconnected');
    });
    
    // 🚨 EDGE CASE 2: High latency detection and handling with mobile adaptations
    let latencyMeasurements: number[] = [];
    
    // Adaptive thresholds based on device and connection
    const HIGH_LATENCY_THRESHOLD = isMobileDevice || isSlowConnection ? 400 : 200; // ms
    const PING_INTERVAL = isMobileDevice || isSlowConnection ? 8000 : 5000; // Longer intervals for mobile
    
    const measureLatency = () => {
      const pingStart = Date.now();
      
      newSocket.emit('ping', { timestamp: pingStart });
    };
    
    // Start periodic latency measurement
    const latencyInterval = setInterval(measureLatency, PING_INTERVAL);
    
    // 🚨 EDGE CASE 4: Variable network monitoring and adaptive behavior
    let connectionQuality = 'good'; // good, fair, poor
    let consecutiveSlowResponses = 0;
    
    const assessConnectionQuality = (latency: number) => {
      const threshold1 = isMobileDevice ? 300 : 150; // Fair threshold
      const threshold2 = isMobileDevice ? 600 : 400; // Poor threshold
      
      if (latency > threshold2) {
        consecutiveSlowResponses++;
        if (consecutiveSlowResponses >= 3) {
          connectionQuality = 'poor';
        }
      } else if (latency > threshold1) {
        consecutiveSlowResponses = Math.max(0, consecutiveSlowResponses - 1);
        connectionQuality = 'fair';
      } else {
        consecutiveSlowResponses = 0;
        connectionQuality = 'good';
      }
      
      // Notify user if connection degrades significantly
      if (connectionQuality === 'poor' && consecutiveSlowResponses === 3) {
        import('../services/notifications.js').then(({ notifications }) => {
          notifications.warning('Poor network connection detected. Game sync may be affected.', 5000);
        });
      }
    };
    
    // Monitor network connection changes (if supported)
    if (connection) {
      connection.addEventListener('change', () => {
        const newType = connection.effectiveType;
        console.log(`[${new Date().toISOString()}] 📶 Network type changed to: ${newType}`);
        
        if (newType === 'slow-2g' || newType === '2g') {
          import('../services/notifications.js').then(({ notifications }) => {
            notifications.info('Slow network detected. Optimizing for better performance...', 4000);
          });
        }
      });
    }

    // 🚨 EDGE CASE 3: Server crash detection during countdown with mobile adaptations
    let lastHeartbeat = Date.now();
    let heartbeatInterval: NodeJS.Timeout;
    let countdownCrashDetected = false;
    const HEARTBEAT_TIMEOUT = isMobileDevice || isSlowConnection ? 15000 : 10000; // Longer timeout for mobile
    
    const checkServerHeartbeat = () => {
      const now = Date.now();
      const timeSinceHeartbeat = now - lastHeartbeat;
      
             if (timeSinceHeartbeat > HEARTBEAT_TIMEOUT) {
         const currentState = localStorage.getItem('wordRushGameState') || 'menu';
         
         // 🚨 TEMPORARY: Disable crash detection during match - too many false positives
         // Server is responding with timer updates every 3s so it's clearly alive
         if (currentState === 'countdown' && !countdownCrashDetected) {
          handleServerCrashDuringCountdown();
        } else if (currentState === 'match') {
          console.warn(`[${new Date().toISOString()}] ⚠️ Long heartbeat gap detected (${timeSinceHeartbeat}ms) but server appears active - skipping crash handling`);
          // handleServerCrashDuringMatch(); // Disabled temporarily
        }
      }
    };
    
    // Start heartbeat monitoring
    heartbeatInterval = setInterval(checkServerHeartbeat, 2000); // Check every 2 seconds
    
    // Handle pong responses for latency calculation and heartbeat
    newSocket.on('pong', (data: { timestamp: number }) => {
      const latency = Date.now() - data.timestamp;
      latencyMeasurements.push(latency);
      
      // Update heartbeat
      lastHeartbeat = Date.now();
      
      // Keep only last 10 measurements
      if (latencyMeasurements.length > 10) {
        latencyMeasurements.shift();
      }
      
      const avgLatency = latencyMeasurements.reduce((a, b) => a + b, 0) / latencyMeasurements.length;
      
      // 🚨 EDGE CASE 4: Assess connection quality for mobile/variable networks
      assessConnectionQuality(latency);
      
      // 📊 DEPLOY 1: Record network metrics in monitoring service
      import('../services/syncMonitoring.js').then(({ syncMonitoring }) => {
        syncMonitoring.recordNetworkMetrics(latency, false);
      }).catch(() => {}); // Silent fail if monitoring not available
      
      if (DEBUG_SOCKET_EVENTS) {
        console.log(`[${new Date().toISOString()}] 📊 Network latency: ${latency}ms (avg: ${avgLatency.toFixed(1)}ms) quality: ${connectionQuality}`);
      }
      
      // Check for high latency condition
      if (avgLatency > HIGH_LATENCY_THRESHOLD) {
        handleHighLatency(avgLatency);
      }
    });

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
      
      // Badge removed: keeping only validation confirmation badge
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

    newSocket.on('game:leaderboard-update', withServerEventValidation('game:leaderboard-update', (data) => {
      logSocketEvent('game:leaderboard-update', data);
      console.log('Leaderboard update:', data.players);
      
      // Update leaderboard in current room if applicable
      contextRef.current.setCurrentRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: data.players.map(leaderboardPlayer => {
            const existingPlayer = prev.players.find(p => p.id === leaderboardPlayer.id);
            return existingPlayer ? {
              ...existingPlayer,
              score: leaderboardPlayer.score
            } : {
              id: leaderboardPlayer.id,
              username: leaderboardPlayer.username,
              score: leaderboardPlayer.score,
              difficulty: leaderboardPlayer.difficulty || 'medium' as import('@word-rush/common').DifficultyLevel,
              isReady: false
            };
          })
        };
      });
      
      // Also update match data leaderboard
      contextRef.current.setMatchData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          leaderboard: data.players
        };
      });
    }));

    // Tile changes event handler for cascade animations
    newSocket.on('game:tile-changes', withServerEventValidation('game:tile-changes', (data) => {
      logSocketEvent('game:tile-changes', data);
      console.log(`[${new Date().toISOString()}] 📨 GameConnection received tile changes (seq: ${data.sequenceNumber}):`, {
        removed: data.removedPositions.length,
        falling: data.fallingTiles.length,
        new: data.newTiles.length
      });
      
      // Forward to PhaserGame through global state for proper processing
      // Note: PhaserGame has its own socket listeners that will handle the actual tile processing
      (window as any).latestTileChanges = data;
      
      // Trigger a custom event that PhaserGame can listen for
      const tileChangeEvent = new CustomEvent('phaser-tile-changes', { detail: data });
      window.dispatchEvent(tileChangeEvent);
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
      
      // 🔧 TASK 1: Handle both old and new match:starting formats
      if ((data as any).pendingBoard && (data as any).boardChecksum) {
        const extendedData = data as any;
        console.log(`[${new Date().toISOString()}] 🎲 Received pendingBoard with checksum ${extendedData.boardChecksum}`);
        
        // Store pendingBoard in global state for PhaserGame to access
        (window as any).pendingGameBoard = extendedData.pendingBoard;
        (window as any).pendingBoardChecksum = extendedData.boardChecksum;
      } else {
        console.log(`[${new Date().toISOString()}] ⚠️ Received old format match:starting (no pendingBoard) - game will work in legacy mode`);
        
        // Clear any stale pending board data for old format
        (window as any).pendingGameBoard = null;
        (window as any).pendingBoardChecksum = null;
      }
      
      contextRef.current.setGameState('countdown');
      notifications.info(`Match starting in ${data.countdown}...`, data.countdown * 1000);
      
      // 🔧 SECTION 5 FIX: Set failsafe timeout for match:go signal to prevent hanging
      const goSignalTimeout = setTimeout(() => {
        console.warn(`[${new Date().toISOString()}] ⚠️ SECTION 5 FIX: match:go signal timeout after 5 seconds - forcing transition to prevent hang`);
        
        // Force transition to match state if GO signal never arrives
        contextRef.current.setGameState('match');
        notifications.warning('Connection delayed - starting match anyway', 3000);
        
        // Clear the timeout reference
        (window as any).goSignalTimeout = null;
      }, 5000); // 5-second failsafe timeout (2 seconds after expected 3-second countdown)
      
      // Store timeout reference for cleanup
      (window as any).goSignalTimeout = goSignalTimeout;
    }));

    // 🔧 TASK 2: Handle Server 'match:go' Signal to Transition to Match
    newSocket.on('match:go', () => {
      const goReceiveTime = Date.now();
      console.log(`[${new Date().toISOString()}] 🚀 Server GO signal received at ${goReceiveTime}`);
      
      // 🔧 SECTION 5 FIX: Clear the failsafe timeout since we received the proper signal
      if ((window as any).goSignalTimeout) {
        clearTimeout((window as any).goSignalTimeout);
        (window as any).goSignalTimeout = null;
        console.log(`[${new Date().toISOString()}] ✅ SECTION 5 FIX: Cleared GO signal failsafe timeout`);
      }
      
      // Transition from countdown to match state on server signal
      contextRef.current.setGameState('match');
      notifications.success('GO! Match started!', 2000);
    });

    newSocket.on('match:started', withServerEventValidation('match:started', (data) => {
      try {
        const receiveTime = Date.now();
        
        // 🚨 EDGE CASE 3: Update heartbeat on any server event
        lastHeartbeat = Date.now();
        
        // 📊 DEPLOY 1: Record board receive timing
        import('../services/syncMonitoring.js').then(({ syncMonitoring }) => {
          const boardLatency = receiveTime - (data.timestamp || receiveTime - 50); // Estimate if no timestamp
          syncMonitoring.recordBoardLatency(boardLatency);
        }).catch(() => {});
        
        // 🔍 DEBUG: Enhanced sync debugging for match:started
        const DEBUG_SYNC = true;
        
        if (DEBUG_SYNC) {
          console.log(`[${new Date().toISOString()}] 📨 SYNC_DEBUG: 'match:started' received at ${receiveTime} with board checksum=${data.boardChecksum}`);
        }
        
        // 🔴 PHASE 2A: Add comprehensive error handling and validation
        if (!data || !data.board || !data.currentRound || !data.totalRounds) {
          console.error(`[${new Date().toISOString()}] ❌ Invalid match:started data:`, data);
          notifications.error('Invalid match data received', 3000);
          return;
        }
        
        // Log matchData for debugging
        console.log(`[${new Date().toISOString()}] MATCH EVENT: match:started`, {
          round: data.currentRound,
          totalRounds: data.totalRounds,
          boardChecksum: data.boardChecksum,
          playerCount: data.playerCount
        });
        
        // Track game state change for component stability
        localStorage.setItem('wordRushGameState', 'match');
        localStorage.setItem('wordRushRoundData', JSON.stringify({
          currentRound: data.currentRound,
          totalRounds: data.totalRounds,
          startTime: Date.now()
        }));
        
        try {
          // 🔧 CRITICAL FIX: Forward board data to PhaserGame first
          console.log(`[${new Date().toISOString()}] 🎮 Forwarding match:started board to PhaserGame (checksum: ${data.boardChecksum})`);
          (window as any).currentGameBoard = data.board;
          (window as any).currentBoardChecksum = data.boardChecksum;
          
          // 🔧 CRITICAL FIX: For round 2+, also trigger a board update event
          // This ensures PhaserGame updates its board even if it wasn't recreated
          if (data.currentRound > 1) {
            console.log(`[${new Date().toISOString()}] 🔄 Round ${data.currentRound} - triggering board update for existing PhaserGame`);
            const boardUpdateEvent = new CustomEvent('phaser-board-update', { 
              detail: { 
                board: data.board, 
                boardChecksum: data.boardChecksum,
                round: data.currentRound 
              } 
            });
            window.dispatchEvent(boardUpdateEvent);
          }
          
          // Function to continue match processing
          const processMatchStart = () => {
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
          };
          
          // Import validation service dynamically (using .then() instead of await)
          import('../services/checksumValidation.js').then(({ validateAndResyncBoard }) => {
            // Validate board checksum with automatic resync
            const isValidBoard = validateAndResyncBoard(
              data.board,
              data.boardChecksum,
              'match:started',
              newSocket,
              true // Enable resync on mismatch
            );
            
            // Generate board summary for logging
            const boardSummary = data.board.tiles.map(row => row.map(tile => tile.letter).join('')).join('|');
            
            // Log match start result with full context
            if (isValidBoard) {
              console.log(`[${new Date().toISOString()}] ✅ Match started (Round ${data.currentRound}/${data.totalRounds}) - Board validated | Server: ${data.boardChecksum} | Board: ${data.board.width}x${data.board.height}, Players: ${data.playerCount} | Layout: ${boardSummary.slice(0, 20)}...`);
            } else {
              console.warn(`[${new Date().toISOString()}] ⚠️ Match started (Round ${data.currentRound}/${data.totalRounds}) - Board validation failed, resync requested | Server: ${data.boardChecksum} | Board: ${data.board.width}x${data.board.height}, Players: ${data.playerCount} | Layout: ${boardSummary.slice(0, 20)}...`);
              notifications.warning('Board sync error detected - requesting resync', 3000);
              // Note: Continue processing even if validation fails for better UX
            }
            
            // Continue with match setup regardless of validation result
            processMatchStart();
          }).catch(error => {
            console.error('Error loading validation service:', error);
            // Continue without validation
            processMatchStart();
          });
        } catch (boardError) {
          console.error(`[${new Date().toISOString()}] ❌ Board checksum validation failed:`, boardError);
          // Continue anyway, as this is non-critical - call processMatchStart
          processMatchStart();
        }
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
        
        // 🚨 EDGE CASE 3: Update heartbeat on any server event
        lastHeartbeat = Date.now();
          
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
        
        // 🔧 TASK 2: Enhanced board validation for resync events
        import('../services/checksumValidation.js').then(({ validateAndResyncBoard }) => {
          // Validate board with limited resync to prevent infinite loops
          const isValidBoard = validateAndResyncBoard(
            data.board,
            data.boardChecksum,
            `board:resync-${data.syncType}`,
            null, // Don't auto-resync for resync events to prevent loops
            false // Disable resync for resync events
          );
          
          // Continue with resync processing
          processResync(isValidBoard);
        }).catch(error => {
          console.error('Error loading validation service for resync:', error);
          // Continue without validation
          processResync(true);
        });
        
        function processResync(isValidBoard: boolean) {
          if (!isValidBoard) {
            console.warn(`[${new Date().toISOString()}] ⚠️ Board resync validation failed - skipping board update`);
            notifications.warning('Board resync validation failed', 3000);
            return; // Don't process invalid board data
          }
          
          if (data.syncType === 'rejoin') {
            // 🔧 TASK 4: Handle Rejoins During Countdown
            const extendedData = data as any;
            
            if (extendedData.isInCountdown) {
              console.log(`[${new Date().toISOString()}] 🔄 Rejoined during countdown - remaining time: ${extendedData.remainingCountdown}ms`);
              contextRef.current.setGameState('countdown');
              
              // Notify user they're joining countdown in progress
              const remainingSeconds = Math.ceil(extendedData.remainingCountdown / 1000);
              notifications.info(`Rejoined! Match starting in ${remainingSeconds}s...`, extendedData.remainingCountdown);
            } else {
              console.log(`[${new Date().toISOString()}] 🔄 Rejoined game successfully: board synchronized`);
              contextRef.current.setGameState('match');
              contextRef.current.setRoundTimer({
                timeRemaining: data.timeRemaining,
                currentRound: extendedData.currentRound || 1,
                totalRounds: extendedData.totalRounds || 3
              });
              notifications.success('Rejoined game successfully!', 3000);
            }
          } else if (data.syncType === 'periodic') {
            // Silent periodic sync - just validate
            console.log(`[${new Date().toISOString()}] 🔄 Periodic board sync: checksum validated`);
          }
          
          // Update round timer if available
          if (data.timeRemaining && contextRef.current.roundTimer) {
            contextRef.current.setRoundTimerOptimized(data.timeRemaining);
          }
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error processing board:resync event:`, error, 'Data:', data);
        notifications.error('Board synchronization failed', 3000);
      }
    });

    newSocket.on('match:timer-update', withServerEventValidation('match:timer-update', (data) => {
      // 🕰️ PHASE 27: Enhanced timer updates with client-side interpolation
      console.log(`[${new Date().toISOString()}] ⏰ Server timer update: ${Math.ceil(data.timeRemaining / 1000)}s`);
      
      // 🚨 EDGE CASE 3: Update heartbeat on any server event
      lastHeartbeat = Date.now();
      
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
      
      // 🔧 CRITICAL FIX: Don't clear board data during round transitions
      // This preserves the PhaserGame state between rounds
      console.log(`[${new Date().toISOString()}] 🎮 Preserving board state during round transition`);
      
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
      
      // 🎯 USER REQUEST: Removed auto-return - let players stay on results page to study stats
      // Players can use the "Return to Lobby" or "Start New Match" buttons when ready
    }));



    // 🚨 EDGE CASE 2: High latency handling function
    let highLatencyDetected = false;
    let countdownExtensionRequested = false;
    
    const handleHighLatency = (avgLatency: number) => {
      if (highLatencyDetected) return; // Prevent spam
      
      highLatencyDetected = true;
      console.warn(`[${new Date().toISOString()}] 🌐 High latency detected: ${avgLatency.toFixed(1)}ms (threshold: ${HIGH_LATENCY_THRESHOLD}ms)`);
      
      // Notify user about network issues
      import('../services/notifications.js').then(({ notifications }) => {
        notifications.warning(`High network latency detected (${avgLatency.toFixed(0)}ms). Game sync may be affected.`, 4000);
      });
      
             // If we're in countdown state, request extension  
       // Note: Access gameState through localStorage as contextRef doesn't expose it
       const currentState = localStorage.getItem('wordRushGameState') || 'menu';
       if (currentState === 'countdown' && !countdownExtensionRequested) {
        console.log(`[${new Date().toISOString()}] 🕰️ Requesting countdown extension due to high latency`);
        
        countdownExtensionRequested = true;
        newSocket.emit('request-countdown-extension', {
          reason: 'high_latency',
          averageLatency: avgLatency,
          timestamp: Date.now()
        });
        
        // Implement client-side fallback timestamp synchronization
        enableTimestampFallback(avgLatency);
      }
      
      // Reset flag after some time
      setTimeout(() => {
        highLatencyDetected = false;
      }, 30000); // 30 seconds
    };
    
    // 🚨 EDGE CASE 2: Timestamp-based fallback synchronization for high latency
    const enableTimestampFallback = (latency: number) => {
      console.log(`[${new Date().toISOString()}] 🕰️ Enabling timestamp-based fallback sync (latency: ${latency}ms)`);
      
      // Store server-provided timestamps for fallback calculations
      (window as any).enableTimestampSync = true;
      (window as any).networkLatency = latency;
      
             import('../services/notifications.js').then(({ notifications }) => {
         notifications.info('Enabled high-latency sync mode for better timing accuracy', 3000);
       });
     };
     
     // 🚨 EDGE CASE 3: Server crash handling functions
     const handleServerCrashDuringCountdown = () => {
       countdownCrashDetected = true;
       console.error(`[${new Date().toISOString()}] 💥 Server crash detected during countdown!`);
       
       import('../services/notifications.js').then(({ notifications }) => {
         notifications.error('Server connection lost during countdown. Attempting to reconnect...', 6000);
       });
       
       // Attempt reconnection
       setTimeout(() => {
         if (newSocket.disconnected) {
           console.log(`[${new Date().toISOString()}] 🔄 Attempting server reconnection...`);
           newSocket.connect();
           
           // If reconnection fails after 5 seconds, return to menu
           setTimeout(() => {
             if (newSocket.disconnected) {
               console.error(`[${new Date().toISOString()}] ❌ Server reconnection failed - returning to menu`);
               
               import('../services/notifications.js').then(({ notifications }) => {
                 notifications.error('Could not reconnect to server. Returning to main menu.', 5000);
               });
               
               contextRef.current.setGameState('menu');
               contextRef.current.setCurrentRoom(null);
             }
           }, 5000);
         }
       }, 2000);
     };
     
           // 🚨 TEMPORARILY UNUSED: Server crash handler disabled due to false positives
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleServerCrashDuringMatch = () => {
        console.error(`[${new Date().toISOString()}] 💥 Server crash detected during match!`);
        
        import('../services/notifications.js').then(({ notifications }) => {
          notifications.error('Server connection lost! Game will be paused while reconnecting...', 6000);
        });
        
        // Pause the game by transitioning to a safe state
        contextRef.current.setGameState('round-end');
        
        // Attempt to save current progress
        const roomCode = localStorage.getItem('wordRushRoomCode');
        if (roomCode) {
          localStorage.setItem('wordRushEmergencyState', JSON.stringify({
            roomCode: roomCode,
            timestamp: Date.now(),
            reason: 'server_crash'
          }));
        }
      };

    // 🚨 EDGE CASE 1: Emergency return to lobby mechanism
    (window as any).emergencyReturnToLobby = () => {
      console.log(`[${new Date().toISOString()}] 🚨 Emergency return to lobby triggered`);
      
      // Reset game state and return to lobby
      contextRef.current.setGameState('lobby');
      
      // Clear any problematic board data
      (window as any).pendingGameBoard = null;
      (window as any).currentGameBoard = null;
      (window as any).pendingBoardChecksum = null;
      (window as any).currentBoardChecksum = null;
      
      // Request fresh room state
      const roomCode = localStorage.getItem('wordRushRoomCode');
      if (newSocket && roomCode) {
        newSocket.emit('room:request-state');
      }
    };
    
    // 🚨 EDGE CASE 4: Store device and network info globally for other components
    (window as any).deviceInfo = {
      isMobile: isMobileDevice,
      isSlowConnection: isSlowConnection,
      connectionQuality: () => connectionQuality,
      adaptiveTimeouts: {
        ping: PING_INTERVAL,
        heartbeat: HEARTBEAT_TIMEOUT,
        latencyThreshold: HIGH_LATENCY_THRESHOLD
      }
    };

    // Cleanup on unmount
    return () => {
      // 🚨 REACT STRICT MODE FIX: Mark as cleaned up
      isCleanedUp = true;
      isInitializedRef.current = false;
      socketRef.current = null;
      
      if (DEBUG_SOCKET_EVENTS) {
        console.log('🔌 Closing socket connection (cleanup)');
      }
      
      // 🕰️ PHASE 27: Clean up client-side timer interpolation
      stopClientSideTimerInterpolation();
      
      // 🚨 EDGE CASE 2: Clean up latency measurement
      clearInterval(latencyInterval);
      
      // 🚨 EDGE CASE 3: Clean up heartbeat monitoring
      clearInterval(heartbeatInterval);
      
      // Clean up emergency handler
      (window as any).emergencyReturnToLobby = null;
      (window as any).enableTimestampSync = false;
      (window as any).networkLatency = null;
      
      // 🔧 SECTION 5 FIX: Clean up GO signal timeout
      if ((window as any).goSignalTimeout) {
        clearTimeout((window as any).goSignalTimeout);
        (window as any).goSignalTimeout = null;
      }
      
      // 🚨 EDGE CASE 4: Clean up device info
      (window as any).deviceInfo = null;
      
      // 🚨 REACT STRICT MODE FIX: Clean up event listeners and close socket properly
      if (newSocket) {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.close();
      }
    };
  }, []); // Empty dependency array to prevent socket recreation

  // 🎯 SINGLE PLAYER: Client-side timer and scoring management
  useEffect(() => {
    // More robust validation - ensure we have valid duration before starting timer
    if (gameState !== 'single-player' || !singlePlayerDuration || singlePlayerDuration <= 0) {
      console.log(`[GameConnection] Timer prerequisites not met: gameState=${gameState}, duration=${singlePlayerDuration}`);
      return;
    }
    
    let timeLeft = singlePlayerDuration;
    console.log(`[GameConnection] Starting single player timer: ${timeLeft}s`);
    
    // Set initial timer
    setRoundTimer({ 
      timeRemaining: timeLeft * 1000, 
      currentRound: 1, 
      totalRounds: 1 
    });
    
    const interval = setInterval(() => {
      timeLeft--;
      setRoundTimer({ 
        timeRemaining: timeLeft * 1000, 
        currentRound: 1, 
        totalRounds: 1 
      });
      
      if (timeLeft <= 0) {
        console.log(`[GameConnection] Single player round complete`);
        clearInterval(interval);
        setGameState('single-player-end');
      }
    }, 1000);

    return () => {
      console.log(`[GameConnection] Cleaning up single player timer`);
      clearInterval(interval);
    };
  }, [gameState, singlePlayerDuration, setRoundTimer, setGameState]);

  // 🎯 SINGLE PLAYER: Enhanced word validation with difficulty multipliers
  useEffect(() => {
    if (!socket) return;

    let lastWordTime = Date.now(); // Track timing for speed bonuses

    const handleWordValid = (data: any) => {
      if (gameState === 'single-player') {
        // Server already applies multipliers, so use points directly
        const points = data.points;
        const word = data.word;
        const currentTime = Date.now();
        const timeSinceLastWord = currentTime - lastWordTime;
        const hasSpeedBonus = timeSinceLastWord <= 4000; // Speed bonus if submitted within 4 seconds
        
        console.log(`[GameConnection] Single player word scored: "${word}" = ${points} points (server already applied multiplier)`);
        
        setSinglePlayerScore((prev: number) => prev + points);
        
        // Update detailed stats for end screen
        setSinglePlayerStats((prev) => ({
          wordsFound: prev.wordsFound + 1,
          longestWord: word.length > prev.longestWord.length ? word : prev.longestWord,
          highestScoringWord: points > prev.highestWordScore ? word : prev.highestScoringWord,
          highestWordScore: points > prev.highestWordScore ? points : prev.highestWordScore,
          bestWordHadSpeedBonus: points > prev.highestWordScore ? hasSpeedBonus : prev.bestWordHadSpeedBonus,
        }));
        
        lastWordTime = currentTime;
        
        // Note: Tile cascading for single-player mode is now handled by server
        // The server calculates tile changes and sends game:tile-changes events
        // which are processed the same way as multiplayer mode
        
        // Badge removed: keeping only validation confirmation badge from 'word:valid' event
      }
    };

    // Add listener to the current socket from context
    const currentSocket = socket;
    if (currentSocket) {
      currentSocket.on('word:valid', handleWordValid);
      
      return () => {
        currentSocket.off('word:valid', handleWordValid);
      };
    }
  }, [gameState, singlePlayerDifficulty, setSinglePlayerScore, setSinglePlayerStats, socket]);

  return null; // This component only manages logic, no UI
}

export default GameConnection; 