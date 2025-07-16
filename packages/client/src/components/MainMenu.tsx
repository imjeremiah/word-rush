/**
 * Main Menu Component
 * Entry point for the game with options to create or join multiplayer lobbies
 * Provides the primary navigation for multiplayer game flow
 */

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

/**
 * Main Menu component with create/join game options
 * Displays the primary game entry point with multiplayer lobby options
 * @returns JSX element containing the main menu interface
 */
function MainMenu(): JSX.Element {
  const { setGameState } = useGameContext();
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);

  /**
   * Navigate to create game screen
   */
  const handleCreateGame = (): void => {
    setShowCreateGame(true);
  };

  /**
   * Navigate to join game screen
   */
  const handleJoinGame = (): void => {
    setShowJoinGame(true);
  };

  /**
   * Return to main menu from sub-screens
   */
  const handleBackToMenu = (): void => {
    setShowCreateGame(false);
    setShowJoinGame(false);
  };

  // Show create game screen
  if (showCreateGame) {
    return <CreateGameScreen onBack={handleBackToMenu} />;
  }

  // Show join game screen
  if (showJoinGame) {
    return <JoinGameScreen onBack={handleBackToMenu} />;
  }

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">Word Rush</h1>
        <p className="game-subtitle">Competitive Multiplayer Word Game</p>
        
        <div className="menu-options">
          <button 
            className="menu-button primary"
            onClick={handleCreateGame}
          >
            🎮 Create Game
          </button>
          
          <button 
            className="menu-button secondary"
            onClick={handleJoinGame}
          >
            🚪 Join Game
          </button>
        </div>

        <div className="game-info">
          <h3>How to Play</h3>
          <ul>
            <li>Drag over adjacent letters to form words</li>
            <li>Longer words score more points</li>
            <li>Find words quickly for speed bonuses</li>
            <li>Compete in real-time with other players</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Create Game Screen component
 * Allows players to create a new multiplayer lobby with custom settings
 */
function CreateGameScreen({ onBack }: { onBack: () => void }): JSX.Element {
  const { socket, setCurrentRoom, setGameState, gameState, currentRoom, connectionStatus } = useGameContext();
  const [playerName, setPlayerName] = useState('');
  const [settings, setSettings] = useState({
    totalRounds: 3,
    roundDuration: 90,
    shuffleCost: 10,
    speedBonusMultiplier: 1.5,
    speedBonusWindow: 3,
    deadBoardThreshold: 5,
  });
  const [isCreating, setIsCreating] = useState(false);

  // Reset creating state when game state changes to lobby (room successfully created)
  useEffect(() => {
    if (gameState === 'lobby' || currentRoom) {
      console.log('[CreateGameScreen] Room creation successful, resetting creating state', {
        gameState,
        currentRoom: currentRoom?.roomCode,
        wasCreating: isCreating
      });
      setIsCreating(false);
    }
  }, [gameState, currentRoom, isCreating]);

  // Add socket error handling to reset creating state on failures
  useEffect(() => {
    if (!socket) return;

    const handleRoomError = (data: any) => {
      console.error('Room creation error:', data);
      setIsCreating(false);
    };

    const handleServerError = (data: any) => {
      console.error('Server error during room creation:', data);
      setIsCreating(false);
    };

    // Listen for errors that might occur during room creation
    socket.on('room:not-found', handleRoomError);
    socket.on('server:error', handleServerError);

    return () => {
      socket.off('room:not-found', handleRoomError);
      socket.off('server:error', handleServerError);
    };
  }, [socket]);

  /**
   * Handle room creation
   */
  const handleCreateRoom = (): void => {
    if (!socket || !playerName.trim()) {
      console.warn('[CreateGameScreen] Cannot create room - missing socket or player name');
      return;
    }
    
    if (connectionStatus !== 'connected') {
      console.warn('[CreateGameScreen] Cannot create room - not connected to server', { connectionStatus });
      alert('Please wait for connection to server before creating a room.');
      return;
    }
    
    console.log('[CreateGameScreen] Starting room creation...', {
      playerName: playerName.trim(),
      socketConnected: socket.connected,
      connectionStatus,
      gameState,
      currentRoom
    });
    
    setIsCreating(true);
    socket.emit('room:create', {
      playerName: playerName.trim(),
      settings
    });

    // Add timeout to prevent getting stuck in "Creating..." state
    setTimeout(() => {
      if (gameState !== 'lobby' && !currentRoom) {
        console.warn('[CreateGameScreen] Room creation timeout - resetting state');
        setIsCreating(false);
      }
    }, 10000); // 10 second timeout
  };

  /**
   * Handle settings change
   */
  const handleSettingChange = (key: string, value: number): void => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="create-game-screen">
      <div className="screen-container">
        <div className="screen-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2>Create New Game</h2>
        </div>

        <div className="create-form">
          <div className="form-group">
            <label htmlFor="player-name">Your Name:</label>
            <input
              id="player-name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={50}
            />
          </div>

          <div className="settings-section">
            <h3>Match Settings</h3>
            
            <div className="form-group">
              <label>Rounds: {settings.totalRounds}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.totalRounds}
                onChange={(e) => handleSettingChange('totalRounds', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Round Duration: {settings.roundDuration}s</label>
              <input
                type="range"
                min="60"
                max="180"
                step="30"
                value={settings.roundDuration}
                onChange={(e) => handleSettingChange('roundDuration', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Shuffle Cost: {settings.shuffleCost} points</label>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={settings.shuffleCost}
                onChange={(e) => handleSettingChange('shuffleCost', parseInt(e.target.value))}
              />
            </div>
          </div>

          {connectionStatus !== 'connected' && (
            <div className="connection-status">
              <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>
                {connectionStatus === 'connecting' ? '🔌 Connecting to server...' : '❌ Disconnected from server'}
              </p>
            </div>
          )}

          <button 
            className="create-button"
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || isCreating || connectionStatus !== 'connected'}
          >
            {isCreating ? 'Creating...' : 
             connectionStatus !== 'connected' ? 'Connecting...' : 
             'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Join Game Screen component
 * Allows players to join an existing multiplayer lobby using a room code
 */
function JoinGameScreen({ onBack }: { onBack: () => void }): JSX.Element {
  const { socket, connectionStatus, gameState, currentRoom } = useGameContext();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Reset joining state when game state changes to lobby (room successfully joined)
  useEffect(() => {
    if (gameState === 'lobby' || currentRoom) {
      console.log('[JoinGameScreen] Room join successful, resetting joining state', {
        gameState,
        currentRoom: currentRoom?.roomCode,
        wasJoining: isJoining
      });
      setIsJoining(false);
    }
  }, [gameState, currentRoom, isJoining]);

  // Add socket error handling to reset joining state on failures
  useEffect(() => {
    if (!socket) return;

    const handleRoomError = (data: any) => {
      console.error('Room join error:', data);
      setIsJoining(false);
    };

    const handleServerError = (data: any) => {
      console.error('Server error during room join:', data);
      setIsJoining(false);
    };

    // Listen for errors that might occur during room joining
    socket.on('room:not-found', handleRoomError);
    socket.on('server:error', handleServerError);

    return () => {
      socket.off('room:not-found', handleRoomError);
      socket.off('server:error', handleServerError);
    };
  }, [socket]);

  /**
   * Handle room joining
   */
  const handleJoinRoom = (): void => {
    if (!socket || !playerName.trim() || !roomCode.trim()) {
      console.warn('[JoinGameScreen] Cannot join room - missing required fields');
      return;
    }
    
    if (connectionStatus !== 'connected') {
      console.warn('[JoinGameScreen] Cannot join room - not connected to server', { connectionStatus });
      alert('Please wait for connection to server before joining a room.');
      return;
    }
    
    console.log('[JoinGameScreen] Starting room join...', {
      playerName: playerName.trim(),
      roomCode: roomCode.trim().toUpperCase(),
      socketConnected: socket.connected,
      connectionStatus,
      gameState,
      currentRoom
    });

    setIsJoining(true);
    socket.emit('room:join', {
      roomCode: roomCode.trim().toUpperCase(),
      playerName: playerName.trim()
    });

    // Add timeout to prevent getting stuck in "Joining..." state
    setTimeout(() => {
      if (gameState !== 'lobby' && !currentRoom) {
        console.warn('[JoinGameScreen] Room join timeout - resetting state');
        setIsJoining(false);
      }
    }, 10000); // 10 second timeout
  };

  /**
   * Handle room code input (auto-uppercase)
   */
  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 4) {
      setRoomCode(value);
    }
  };

  return (
    <div className="join-game-screen">
      <div className="screen-container">
        <div className="screen-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2>Join Game</h2>
        </div>

        <div className="join-form">
          <div className="form-group">
            <label htmlFor="join-player-name">Your Name:</label>
            <input
              id="join-player-name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-code">Room Code:</label>
            <input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={handleRoomCodeChange}
              placeholder="ABCD"
              maxLength={4}
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '1.2em', 
                textAlign: 'center',
                letterSpacing: '0.1em'
              }}
            />
            <small>Enter the 4-character room code from your host</small>
          </div>

          {connectionStatus !== 'connected' && (
            <div className="connection-status">
              <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>
                {connectionStatus === 'connecting' ? '🔌 Connecting to server...' : '❌ Disconnected from server'}
              </p>
            </div>
          )}

          <button 
            className="join-button"
            onClick={handleJoinRoom}
            disabled={!playerName.trim() || roomCode.length !== 4 || isJoining || connectionStatus !== 'connected'}
          >
            {isJoining ? 'Joining...' : 
             connectionStatus !== 'connected' ? 'Connecting...' : 
             'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu; 