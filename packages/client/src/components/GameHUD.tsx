/**
 * Game HUD Component
 * Displays player session information and game state
 */

import { useGameContext } from '../context/GameContext';

/**
 * Game HUD component that shows player stats and game status
 * Displays connection status, player information, and last word result
 * @returns JSX element containing the game HUD interface
 */
function GameHUD(): JSX.Element {
  const { connectionStatus, playerSession, lastWordResult } = useGameContext();

  return (
    <div className="game-hud">
      {/* Connection Status */}
      <div className="connection-status">
        Status:{' '}
        <span className={`status-${connectionStatus}`}>
          {connectionStatus}
        </span>
      </div>

      {/* Player Stats Card */}
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

      {/* Word Validation Result */}
      {lastWordResult && (
        <div className={`word-result-card ${lastWordResult.isValid ? 'valid' : 'invalid'}`}>
          <h3>{lastWordResult.isValid ? '✅ Valid Word!' : '❌ Invalid Word'}</h3>
          <div className="word-details">
            <span className="word-text">&quot;{lastWordResult.word}&quot;</span>
            {lastWordResult.isValid && (
              <span className="points-text">+{lastWordResult.points} points</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameHUD; 