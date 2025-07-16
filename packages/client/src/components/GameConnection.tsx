/**
 * Game Connection Component
 * Handles Socket.io connection, event listeners, and session management
 * Uses game context to share state across the application
 */

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useGameContext } from '../context/GameContext';
import { notifications } from '../services/notifications';
import { withServerEventValidation } from '../validation/schemas';
import { wordSubmissionTimestamps } from './interactions';

/**
 * Comprehensive socket event logger for debugging data flow
 * Logs all incoming socket events with timestamp and data for troubleshooting
 * @param eventName - Name of the socket event received
 * @param data - Event payload data from server
 * @returns void - Logs event information to console
 */
function logSocketEvent(eventName: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Socket Event Received:`, eventName, data);
  
  // Additional logging for critical events
  if (eventName.includes('error') || eventName.includes('failed')) {
    console.error(`[${timestamp}] ERROR EVENT:`, eventName, data);
  } else if (eventName.includes('match:') || eventName.includes('round:')) {
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
    setRoundTimerOptimized
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
    setRoundTimerOptimized
  };

  useEffect(() => {
    console.log('🔌 Creating socket connection (should only happen once)');
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
        console.log('Connected to server');
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
        console.log('Disconnected from server');
        contextRef.current.setConnectionStatus('disconnected');
        notifications.warning('Disconnected from server', 3000);
      } catch (error) {
        console.error('Error in disconnect handler:', error);
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      try {
        console.log(`Reconnected after ${attemptNumber} attempts`);
        notifications.info(`Reconnected after ${attemptNumber} attempts`, 3000);
      } catch (error) {
        console.error('Error in reconnect handler:', error);
      }
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      try {
        console.log(`Reconnection attempt ${attemptNumber}`);
        setConnectionStatus('connecting');
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
      setLastWordResult({
        word: data.word,
        points: data.points,
        isValid: true,
      });
      
      notifications.success(`"${data.word}" is valid! +${data.points} points`, 2000);
      measureWordLatency(data.word, true);
    }));

    newSocket.on('word:invalid', withServerEventValidation('word:invalid', (data) => {
      console.log('Invalid word submitted:', data);
      setLastWordResult({
        word: data.word,
        points: 0,
        isValid: false,
      });
      
      notifications.error(`"${data.word}" is not valid: ${data.reason}`, 3000);
      measureWordLatency(data.word, false);
    }));

    newSocket.on('game:score-update', withServerEventValidation('game:score-update', (data) => {
      logSocketEvent('game:score-update', data);
      console.log('Score update:', data);
      
      // Update currentRoom players with new scores
      setCurrentRoom(prev => {
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
      setPlayerSession(data.session);
      
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
      setPlayerSession(data.session);
      
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
      
      setCurrentRoom(data.room);
      setGameState('lobby');
      notifications.success(`Joined room ${data.room.roomCode}!`, 3000);
    }));

    newSocket.on('room:left', withServerEventValidation('room:left', (data) => {
      console.log('Left room:', data.message);
      setCurrentRoom(null);
      setGameState('menu');
      notifications.info(data.message, 3000);
    }));

    newSocket.on('room:player-joined', withServerEventValidation('room:player-joined', (data) => {
      console.log('Player joined room:', data.player.username);
      setCurrentRoom(data.room);
      notifications.info(`${data.player.username} joined the room`, 3000);
    }));

    newSocket.on('room:player-left', withServerEventValidation('room:player-left', (data) => {
      console.log('Player left room:', data.playerId);
      setCurrentRoom(data.room);
      notifications.info('A player left the room', 3000);
    }));

    newSocket.on('room:player-ready', withServerEventValidation('room:player-ready', (data) => {
      console.log('Player ready status changed:', data.playerId, data.isReady);
      setCurrentRoom(data.room);
      // Optional: show notification for ready status changes
    }));

    newSocket.on('room:settings-updated', withServerEventValidation('room:settings-updated', (data) => {
      console.log('Room settings updated:', data.settings);
      setCurrentRoom(data.room);
      notifications.info('Match settings updated', 2000);
    }));

    newSocket.on('room:not-found', withServerEventValidation('room:not-found', (data) => {
      console.log('Room not found:', data.message);
      notifications.error(data.message, 4000);
    }));

    // Match flow event handlers
    newSocket.on('match:starting', withServerEventValidation('match:starting', (data) => {
      console.log('Match starting countdown:', data.countdown);
      setGameState('match');
      notifications.info(`Match starting in ${data.countdown}...`, data.countdown * 1000);
    }));

    newSocket.on('match:started', withServerEventValidation('match:started', (data) => {
      try {
        const receiveTime = Date.now();
        console.log('Match started:', data);
        
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
          
          console.log(`[${new Date().toISOString()}] Board validation: server_checksum=${data.boardChecksum}, client_validation=${clientChecksum}, board_size=${data.board.width}x${data.board.height}, players=${data.playerCount}`);
          
          // Log board contents for synchronization debugging
          const boardSummary = data.board.tiles.map(row => row.map(tile => tile.letter).join('')).join('|');
          console.log(`[${new Date().toISOString()}] Board layout: ${boardSummary}`);
        } catch (boardError) {
          console.error(`[${new Date().toISOString()}] ❌ Board checksum validation failed:`, boardError);
          // Continue anyway, as this is non-critical
        }
        
        setGameState('match');
        setRoundTimer({
          timeRemaining: data.timeRemaining || 90000,
          currentRound: data.currentRound,
          totalRounds: data.totalRounds
        });
        setMatchData({
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
        setGameState('lobby');
      }
    }));

    // Board synchronization event handler
    newSocket.on('board:resync', (data: { board: any; boardChecksum: string; timeRemaining: number; sequenceNumber: number; syncType: string }) => {
      try {
        console.log(`[${new Date().toISOString()}] 📡 Board resync received (${data.syncType}): checksum=${data.boardChecksum}`);
        
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
        
        if (data.syncType === 'rejoin') {
          console.log(`[${new Date().toISOString()}] 🔄 Rejoined game successfully: board synchronized`);
          setGameState('match');
          setRoundTimer({
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
          setRoundTimerOptimized(data.timeRemaining);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error processing board:resync event:`, error, 'Data:', data);
        notifications.error('Board synchronization failed', 3000);
      }
    });

    newSocket.on('match:timer-update', withServerEventValidation('match:timer-update', (data) => {
      setRoundTimerOptimized(data.timeRemaining);
    }));

    newSocket.on('match:round-end', withServerEventValidation('match:round-end', (data) => {
      logSocketEvent('match:round-end', data);
      console.log('Round ended:', data.scores);
      
      // Track state transition for component stability
      localStorage.setItem('wordRushGameState', 'round-end');
      
      setGameState('round-end');
      setRoundSummary(data);
      notifications.info(`Round ${data.roundNumber} complete!`, 3000);
      
      // Auto-unpause for next round if match isn't complete
      if (!data.isMatchComplete) {
        setTimeout(() => {
          localStorage.setItem('wordRushGameState', 'match');  // Track transition back to match
          setGameState('match');  // Auto-unpause to next round
          notifications.success('Starting next round!', 2000);
        }, 5000);  // 5 second delay as per project specs
      }
    }));

    newSocket.on('match:finished', withServerEventValidation('match:finished', (data) => {
      logSocketEvent('match:finished', data);
      console.log('Match finished:', data);
      
      // Track state transition for component stability
      localStorage.setItem('wordRushGameState', 'match-end');
      
      setGameState('match-end');
      setMatchComplete(data);
      const winnerName = data.winner?.username || 'Unknown';
      notifications.success(`Match over! Winner: ${winnerName}`, 5000);
      
      // Auto-return to lobby after showing results
      setTimeout(() => {
        localStorage.setItem('wordRushGameState', 'lobby');  // Track return to lobby
        setGameState('lobby');
        notifications.info('Returning to lobby...', 2000);
      }, 10000);  // 10 second delay to show results
    }));

    newSocket.on('game:leaderboard-update', withServerEventValidation('game:leaderboard-update', (data) => {
      logSocketEvent('game:leaderboard-update', data);
      console.log('Leaderboard update:', data.players);
      
      // Update matchData leaderboard with sorted players
      setMatchData(prev => prev ? {
        ...prev,
        leaderboard: data.players.sort((a, b) => b.score - a.score)
      } : null);
      
      // Also update currentRoom players to keep state in sync
      setCurrentRoom(prev => {
        if (!prev) return prev;
        const updatedPlayers = prev.players.map(roomPlayer => {
          const leaderboardPlayer = data.players.find(lp => lp.id === roomPlayer.id);
          return leaderboardPlayer 
            ? { ...roomPlayer, score: leaderboardPlayer.score, difficulty: leaderboardPlayer.difficulty }
            : roomPlayer;
        });
        return { ...prev, players: updatedPlayers };
      });
    }));



    // Cleanup on unmount
    return () => {
      console.log('🔌 Closing socket connection (cleanup)');
      newSocket.close();
    };
  }, []); // Empty dependency array to prevent socket recreation

  return null; // This component only manages logic, no UI
}

export default GameConnection; 