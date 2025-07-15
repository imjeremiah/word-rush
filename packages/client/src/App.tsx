/**
 * Word Rush Client - Main App Component
 * Manages the overall application state and Socket.io connection
 */

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, PlayerSession } from '@word-rush/common';
import { notifications } from './services/notifications';
import PhaserGame from './components/PhaserGame';
import './App.css';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [testWord, setTestWord] = useState<string>('');
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(null);
  const [lastWordResult, setLastWordResult] = useState<{
    word: string;
    points: number;
    isValid: boolean;
  } | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      notifications.success('Connected to Word Rush server!', 3000);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
      notifications.warning('Disconnected from server', 3000);
    });

    // Server message handlers
    newSocket.on('server:welcome', (data) => {
      console.log('Welcome message received:', data);
    });

    newSocket.on('server:error', (data) => {
      console.error('Server error:', data);
      notifications.error(`Server Error: ${data.message}`, 5000);
    });

    newSocket.on('server:rate-limit', (data) => {
      console.warn('Rate limit exceeded:', data);
      notifications.warning(`Rate limit exceeded: ${data.message}`, 8000);
    });

    // Game event handlers
    newSocket.on('word:validation-result', (data) => {
      console.log('Word validation result:', data);
      setLastWordResult({
        word: data.word,
        points: data.points,
        isValid: data.isValid,
      });
      
      if (data.isValid) {
        notifications.success(`"${data.word}" is valid! +${data.points} points`, 2000);
      } else {
        notifications.error(`"${data.word}" is not valid: ${data.reason}`, 3000);
      }
    });

    newSocket.on('game:score-update', (data) => {
      console.log('Score update:', data);
      notifications.info(`+${data.score} points! Total: ${data.totalScore}`, 2000);
    });

    newSocket.on('player:session-update', (data) => {
      console.log('Session update:', data);
      setPlayerSession(data.session);
    });

    newSocket.on('game:initial-board', (data) => {
      console.log('Initial board received:', data);
      notifications.info('New game board loaded!', 2000);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  /**
   * Test word validation function
   */
  const testWordValidation = () => {
    if (!socket || !testWord.trim()) {
      return;
    }

    // Create mock tiles for testing
    const mockTiles = testWord.split('').map((letter, index) => ({
      letter: letter.toUpperCase(),
      points: 1,
      x: index,
      y: 0,
      id: `tile-${index}`,
    }));

    socket.emit('word:submit', {
      word: testWord.trim(),
      tiles: mockTiles,
    });

    setTestWord('');
  };

  /**
   * Request a new board from the server
   */
  const requestNewBoard = () => {
    if (socket) {
      socket.emit('game:request-board');
      setLastWordResult(null); // Clear previous result
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Word Rush - MVP</h1>
        <div className="connection-status">
          Status:{' '}
          <span className={`status-${connectionStatus}`}>
            {connectionStatus}
          </span>
        </div>
      </header>

      <main className="app-main">
        <div className="game-container">
          <div className="ui-section">
            <div className="player-info-card">
              <h2>🎮 Player Stats</h2>
              {playerSession ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <label>Player:</label>
                    <span>{playerSession.username}</span>
                  </div>
                  <div className="stat-item">
                    <label>Score:</label>
                    <span className="score-value">{playerSession.score}</span>
                  </div>
                  <div className="stat-item">
                    <label>Words Found:</label>
                    <span>{playerSession.wordsSubmitted}</span>
                  </div>
                  <div className="stat-item">
                    <label>Status:</label>
                    <span className={`status-${playerSession.isConnected ? 'connected' : 'disconnected'}`}>
                      {playerSession.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              ) : (
                <p>Loading player session...</p>
              )}
            </div>

            {lastWordResult && (
              <div className={`word-result-card ${lastWordResult.isValid ? 'valid' : 'invalid'}`}>
                <h3>{lastWordResult.isValid ? '✅ Valid Word!' : '❌ Invalid Word'}</h3>
                <div className="word-details">
                  <span className="word-text">"{lastWordResult.word}"</span>
                  {lastWordResult.isValid && (
                    <span className="points-text">+{lastWordResult.points} points</span>
                  )}
                </div>
              </div>
            )}

            <div className="game-controls-card">
              <h2>🎯 Game Controls</h2>
              <button
                onClick={requestNewBoard}
                disabled={connectionStatus !== 'connected'}
                className="control-button new-board"
              >
                🔄 New Board
              </button>
              
              <div className="test-section">
                <h3>Test Word Validation</h3>
                <div className="test-input-group">
                  <input
                    type="text"
                    placeholder="Enter a word to test..."
                    value={testWord}
                    onChange={(e) => setTestWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && testWordValidation()}
                    className="test-input"
                  />
                  <button
                    onClick={testWordValidation}
                    disabled={!testWord.trim() || connectionStatus !== 'connected'}
                    className="control-button test-word"
                  >
                    Test
                  </button>
                </div>
                <p className="test-hint">
                  Try: "HELLO", "WORLD", "SCRABBLE", "CAT", "DOG"
                </p>
              </div>
            </div>

            <div className="game-info-card">
              <h2>📋 How to Play</h2>
              <ul className="instructions">
                <li>Drag your mouse over adjacent tiles to form words</li>
                <li>Words must be at least 2 letters long</li>
                <li>Letter values follow official Scrabble scoring</li>
                <li>Release mouse to submit your word</li>
                <li>Find as many words as you can!</li>
              </ul>
            </div>
          </div>

          <div className="game-section">
            <PhaserGame socket={socket || undefined} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
