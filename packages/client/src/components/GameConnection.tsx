/**
 * Game Connection Component
 * Handles Socket.io connection, event listeners, and session management
 * Uses game context to share state across the application
 */

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGameContext } from '../context/GameContext';
import { notifications } from '../services/notifications';
import { withServerEventValidation } from '../validation/schemas';
import { wordSubmissionTimestamps } from './interactions';

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
    setLastWordResult,
  } = useGameContext();

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    setSocket(newSocket);

    // Connection event handlers (no validation needed for built-in socket events)
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      
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
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
      notifications.warning('Disconnected from server', 3000);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      notifications.info(`Reconnected after ${attemptNumber} attempts`, 3000);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
      setConnectionStatus('connecting');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      notifications.error('Reconnection failed', 3000);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('All reconnection attempts failed');
      notifications.error('Failed to reconnect. Please refresh the page.', 5000);
    });

    // Server message handlers with validation
    newSocket.on('server:welcome', withServerEventValidation('server:welcome', (data) => {
      console.log('Welcome message received:', data);
    }));

    newSocket.on('server:error', withServerEventValidation('server:error', (data) => {
      console.error('Server error:', data);
      notifications.error(`Server Error: ${data.message}`, 5000);
    }));

    newSocket.on('server:rate-limit', withServerEventValidation('server:rate-limit', (data) => {
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
      console.log('Score update:', data);
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

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [setSocket, setConnectionStatus, setPlayerSession, setLastWordResult]);

  return null; // This component only manages logic, no UI
}

export default GameConnection; 