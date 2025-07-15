/**
 * Word Rush Client - Main App Component
 * Manages the overall application state and Socket.io connection
 */

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@word-rush/common';
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

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    // Server message handlers
    newSocket.on('server:welcome', (data) => {
      console.log('Welcome message received:', data);
      setServerMessage(data.message);
    });

    newSocket.on('server:error', (data) => {
      console.error('Server error:', data);
      setServerMessage(`Error: ${data.message}`);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

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
