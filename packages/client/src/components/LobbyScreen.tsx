/**
 * Lobby Screen Component
 * Displays the multiplayer lobby where players wait before match starts
 * Shows player list, ready states, room settings, and host controls
 */

import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { DifficultyLevel, DIFFICULTY_CONFIGS, MatchSettings } from '@word-rush/common';

/**
 * Lobby Screen component for multiplayer room management
 * Displays player list with ready states and allows match configuration
 * @returns JSX element containing the lobby interface
 */
function LobbyScreen(): JSX.Element {
  const { 
    socket, 
    currentRoom, 
    playerSession, 
    setCurrentRoom,
    setGameState 
  } = useGameContext();
  
  const [showSettings, setShowSettings] = useState(false);

  if (!currentRoom || !playerSession) {
    return <div>Loading lobby...</div>;
  }

  const isHost = currentRoom.hostId === playerSession.id;
  const currentPlayer = currentRoom.players.find(p => p.id === playerSession.id);
  const allPlayersReady = currentRoom.players.every(p => p.isReady);
  const canStartMatch = currentRoom.players.length >= 2 && allPlayersReady;

  /**
   * Toggle player ready status
   */
  const handleToggleReady = (): void => {
    if (!socket || !currentPlayer) return;
    
    socket.emit('room:set-ready', {
      isReady: !currentPlayer.isReady
    });
  };

  /**
   * Leave the current room
   */
  const handleLeaveRoom = (): void => {
    if (!socket) return;
    
    socket.emit('room:leave');
    setCurrentRoom(null);
    setGameState('menu');
  };

  /**
   * Start the match (host only)
   */
  const handleStartMatch = (): void => {
    if (!socket || !isHost) return;
    
    socket.emit('room:start-match');
  };

  /**
   * Update room settings (host only)
   */
  const handleUpdateSettings = (newSettings: MatchSettings): void => {
    if (!socket || !isHost) return;
    
    socket.emit('room:update-settings', {
      settings: newSettings
    });
  };

  /**
   * Set player difficulty level
   */
  const handleSetDifficulty = (difficulty: DifficultyLevel): void => {
    if (!socket) return;
    
    // setSelectedDifficulty(difficulty); // This line was removed from imports
    socket.emit('player:set-difficulty', {
      difficulty
    });
  };

  /**
   * Copy room code to clipboard
   */
  const handleCopyRoomCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(currentRoom.roomCode);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className="lobby-screen">
      <div className="lobby-container">
        {/* Header with room info */}
        <div className="lobby-header">
          <div className="room-info">
            <h2>Game Lobby</h2>
            <div className="room-code-section">
              <span className="room-code-label">Room Code:</span>
              <span className="room-code" onClick={handleCopyRoomCode}>
                {currentRoom.roomCode}
              </span>
              <button 
                className="copy-button"
                onClick={handleCopyRoomCode}
                title="Copy room code"
              >
                📋
              </button>
            </div>
          </div>
          
          <button 
            className="leave-button"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>

        <div className="lobby-content">
          {/* Players list */}
          <div className="players-section">
            <h3>Players ({currentRoom.players.length}/{currentRoom.maxPlayers})</h3>
            <div className="players-list">
              {currentRoom.players.map((player) => {
                const isHost = player.id === currentRoom.hostId;
                const isCurrentPlayer = player.id === playerSession.id;
                const hasCrowns = (player.crowns || 0) > 0;
                
                // Find King of the Hill (most crowns)
                const kingOfTheHill = currentRoom.players.reduce((prev, current) => 
                  ((current.crowns || 0) > (prev.crowns || 0)) ? current : prev
                );
                const isKingOfTheHill = kingOfTheHill && player.id === kingOfTheHill.id && (kingOfTheHill.crowns || 0) > 0;
                
                return (
                  <div 
                    key={player.id} 
                    className={`player-card ${player.isReady ? 'ready' : 'not-ready'} ${isKingOfTheHill ? 'king-of-the-hill' : ''}`}
                  >
                    <div className="player-info">
                      <span className="player-name">
                        {player.username}
                        {isHost && ' 👑'}
                        {isCurrentPlayer && ' (You)'}
                        {/* King of the Hill crown indicator */}
                        {isKingOfTheHill && <span className="king-crown"> 🏆</span>}
                        {/* Crown count display */}
                        {hasCrowns && !isKingOfTheHill && (
                          <span className="crown-count">
                            👑 {player.crowns}
                          </span>
                        )}
                      </span>
                      <span className="player-difficulty">
                        {player.difficulty ? (
                          <span className={`difficulty ${player.difficulty}`}>
                            {player.difficulty}
                          </span>
                        ) : (
                          <span className="difficulty-not-set">No difficulty set</span>
                        )}
                      </span>
                    </div>
                    <div className="player-status">
                      {player.isReady ? '✅ Ready' : '⏳ Not Ready'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty selection */}
          <div className="difficulty-section">
            <h3>Your Difficulty</h3>
            <p>Choose your challenge level:</p>
            <div className="difficulty-options">
              {(['easy', 'medium', 'hard', 'extreme'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  className={`difficulty-button ${difficulty} ${
                    currentPlayer?.difficulty === difficulty ? 'selected' : ''
                  }`}
                  onClick={() => handleSetDifficulty(difficulty)}
                >
                  <div className="difficulty-name">{difficulty.toUpperCase()}</div>
                  <div className="difficulty-details">
                    Min: {DIFFICULTY_CONFIGS[difficulty].minWordLength} letters
                    <br />
                    Multiplier: {DIFFICULTY_CONFIGS[difficulty].scoreMultiplier}x
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings section (host only) */}
          {isHost && (
            <div className="settings-section">
              <div className="settings-header">
                <h3>Match Settings</h3>
                <button 
                  className="toggle-settings"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? 'Hide' : 'Show'} Settings
                </button>
              </div>
              
              {showSettings && (
                <SettingsPanel 
                  settings={currentRoom.settings}
                  onUpdate={handleUpdateSettings}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </div>
          )}

          {/* Ready/Start section */}
          <div className="ready-section">
            {!currentPlayer?.isReady ? (
              <button 
                className="ready-button"
                onClick={handleToggleReady}
              >
                Mark as Ready
              </button>
            ) : (
              <button 
                className="not-ready-button"
                onClick={handleToggleReady}
              >
                Cancel Ready
              </button>
            )}

            {isHost && (
              <button 
                className="start-match-button"
                onClick={handleStartMatch}
                disabled={!canStartMatch}
                title={
                  !canStartMatch 
                    ? 'All players must be ready to start' 
                    : 'Start the match'
                }
              >
                {canStartMatch ? 'Start Match' : 'Waiting for Players...'}
              </button>
            )}

            {!isHost && allPlayersReady && (
              <div className="waiting-for-host">
                Waiting for host to start the match...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Panel component for configuring match parameters
 */
interface SettingsPanelProps {
  settings: MatchSettings;
  onUpdate: (settings: MatchSettings) => void;
  onClose: () => void;
}

function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps): JSX.Element {
  const [localSettings, setLocalSettings] = useState(settings);

  /**
   * Handle settings change
   */
  const handleChange = (key: string, value: number): void => {
    const newSettings = {
      ...localSettings,
      [key]: value
    };
    setLocalSettings(newSettings);
    onUpdate(newSettings);
  };

  return (
    <div className="settings-panel">
      <div className="setting-group">
        <label>Rounds: {localSettings.totalRounds}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={localSettings.totalRounds}
          onChange={(e) => handleChange('totalRounds', parseInt(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label>Round Duration: {localSettings.roundDuration}s</label>
        <div className="duration-selector">
          {[15, 30, 60, 90].map(duration => (
            <button 
              key={duration}
              className={`duration-button ${localSettings.roundDuration === duration ? 'selected' : ''}`}
              onClick={() => handleChange('roundDuration', duration)}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label>Shuffle Cost: {localSettings.shuffleCost} points</label>
        <input
          type="range"
          min="5"
          max="25"
          step="5"
          value={localSettings.shuffleCost}
          onChange={(e) => handleChange('shuffleCost', parseInt(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label>Speed Bonus: {localSettings.speedBonusMultiplier}x</label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={localSettings.speedBonusMultiplier}
          onChange={(e) => handleChange('speedBonusMultiplier', parseFloat(e.target.value))}
        />
      </div>

      <div className="setting-group">
        <label>Speed Window: {localSettings.speedBonusWindow}s</label>
        <input
          type="range"
          min="1"
          max="10"
          value={localSettings.speedBonusWindow}
          onChange={(e) => handleChange('speedBonusWindow', parseInt(e.target.value))}
        />
      </div>
      <button onClick={onClose}>Close Settings</button>
    </div>
  );
}

export default LobbyScreen; 