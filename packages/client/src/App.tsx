/**
 * Word Rush Client - Main App Component
 * Manages the overall application state and Socket.io connection
 */

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@word-rush/common';
import { notifications } from './services/notifications';
import PhaserGame from './components/PhaserGame';
import './App.css';

const App: React.FC = () => {
  const [, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [testWord, setTestWord] = useState<string>('');
  const [currentSocket, setCurrentSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    setCurrentSocket(newSocket);

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
      setServerMessage(data.message);
    });

    newSocket.on('server:error', (data) => {
      console.error('Server error:', data);
      setServerMessage(`Error: ${data.message}`);
      notifications.error(`Server Error: ${data.message}`, 5000);
    });

    newSocket.on('server:rate-limit', (data) => {
      console.warn('Rate limit exceeded:', data);
      notifications.warning(`Rate limit exceeded: ${data.message}`, 8000);
    });

    newSocket.on('word:validation-result', (data) => {
      console.log('Word validation result:', data);
      if (data.isValid) {
        notifications.success(`"${data.word}" is valid! +${data.points} points`, 2000);
      } else {
        notifications.error(`"${data.word}" is not valid: ${data.reason}`, 3000);
      }
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
    if (!currentSocket || !testWord.trim()) {
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

    currentSocket.emit('word:submit', {
      word: testWord.trim(),
      tiles: mockTiles,
    });

    setTestWord('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Word Rush</h1>
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
            <div className="message-display">
              {serverMessage && <p>{serverMessage}</p>}
            </div>
            <div className="game-info">
              <h2>Game Ready</h2>
              <p>
                Server connection established. Game components will be
                integrated here.
              </p>
              
              <div className="test-controls" style={{ marginTop: '20px' }}>
                <h3>Test Word Validation</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Enter a word to test..."
                    value={testWord}
                    onChange={(e) => setTestWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && testWordValidation()}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={testWordValidation}
                    disabled={!testWord.trim() || connectionStatus !== 'connected'}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4A6BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Test Word
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Try words like &quot;HELLO&quot;, &quot;WORLD&quot;, &quot;INVALID&quot;, &quot;SCRABBLE&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="game-section">
            <PhaserGame />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
