/**
 * Match Complete Component
 * Displays final match results and victory screen
 * Shows final scores, winner, and options to play again or return to lobby
 */

import { MatchComplete as MatchCompleteType } from '@word-rush/common';

/**
 * Match completion data structure with optional properties to prevent crashes
 */
interface MatchCompleteData {
  winner: {
    playerId: string;
    playerName: string;
    score: number;
    difficulty?: string;
  } | null;
  finalScores: Array<{
    rank: number;
    playerId: string;
    playerName: string;
    score: number;
    difficulty?: string;
  }>;
  totalRounds: number;
}

/**
 * Component props for MatchComplete
 */
interface MatchCompleteProps {
  /** Match completion data received from server */
  matchComplete: MatchCompleteData;
  /** Whether the current player is the host */
  isHost: boolean;
  /** Current player ID for highlighting */
  currentPlayerId: string;
  /** Callback when returning to lobby */
  onReturnToLobby?: () => void;
  /** Callback when starting a new match */
  onStartNewMatch?: () => void;
}

/**
 * Match Complete display component
 * Shows final results with winner celebration and full rankings
 * @param props - MatchComplete component props
 * @returns Match completion display with results and actions
 */
export function MatchComplete({
  matchComplete,
  isHost,
  currentPlayerId,
  onReturnToLobby,
  onStartNewMatch
}: MatchCompleteProps): JSX.Element {
  
  // Add null checks for winner
  const winner = matchComplete.winner || { 
    playerId: '', 
    playerName: 'Unknown', 
    score: 0, 
    difficulty: 'medium' 
  };
  
  // Check if current player is the winner
  const isWinner = winner.playerId === currentPlayerId;
  
  // Find current player's final rank with fallback
  const currentPlayerResult = matchComplete.finalScores.find(p => p.playerId === currentPlayerId);
  const currentPlayerRank = currentPlayerResult?.rank || 0;

  /**
   * Get rank suffix for display (1st, 2nd, 3rd, 4th)
   */
  function getRankSuffix(rank: number): string {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  }

  /**
   * Get difficulty color for visual distinction with null safety
   */
  function getDifficultyColor(difficulty?: string | null): string {
    const safetyDifficulty = difficulty || 'medium';
    switch (safetyDifficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'extreme': return '#9C27B0';
      default: return '#2196F3';
    }
  }

  /**
   * Get difficulty display name with fallback
   */
  function getDifficultyDisplay(difficulty?: string | null): string {
    const safeDifficulty = difficulty || 'medium';
    return safeDifficulty.charAt(0).toUpperCase() + safeDifficulty.slice(1);
  }

  /**
   * Get trophy icon based on rank
   */
  function getTrophyIcon(rank: number): string {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  }

  /**
   * Get rank class for styling
   */
  function getRankClass(rank: number): string {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-other';
  }

  return (
    <div className="match-complete-overlay">
      <div className="match-complete-container">
        
        {/* Winner Announcement */}
        <div className="winner-announcement">
          <div className="winner-crown">👑</div>
          <h1 className="match-complete-title">Match Complete!</h1>
          
          <div className="winner-card">
            <div className="winner-trophy">🏆</div>
            <div className="winner-info">
              <h2 className="winner-name">{winner.playerName}</h2>
              <div className="winner-details">
                <span 
                  className="winner-difficulty"
                  style={{ color: getDifficultyColor(winner.difficulty) }}
                >
                  {getDifficultyDisplay(winner.difficulty)}
                </span>
                <span className="winner-score">{winner.score} points</span>
              </div>
            </div>
          </div>
          
          {isWinner && (
            <div className="victory-message">
              <h3>🎉 Congratulations! You won! 🎉</h3>
            </div>
          )}
        </div>

        {/* Final Rankings */}
        <div className="final-rankings">
          <h3>Final Rankings</h3>
          <div className="match-stats">
            {matchComplete.totalRounds} Round{matchComplete.totalRounds !== 1 ? 's' : ''} Played
          </div>
          
          <div className="rankings-list">
            {matchComplete.finalScores.map((player) => {
              const isCurrentPlayer = player.playerId === currentPlayerId;
              
              return (
                <div 
                  key={player.playerId}
                  className={`final-ranking-item ${getRankClass(player.rank)} ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  
                  {/* Rank with Trophy */}
                  <div className="rank-display">
                    <div className="trophy-icon">{getTrophyIcon(player.rank)}</div>
                    <div className="rank-text">
                      {player.rank}{getRankSuffix(player.rank)}
                    </div>
                  </div>
                  
                  {/* Player Info */}
                  <div className="player-info">
                    <div className="player-name">
                      {player.playerName || 'Unknown Player'}
                      {isCurrentPlayer && <span className="you-indicator">(You)</span>}
                    </div>
                    <div 
                      className="player-difficulty"
                      style={{ color: getDifficultyColor(player.difficulty) }}
                    >
                      {getDifficultyDisplay(player.difficulty)} Difficulty
                    </div>
                  </div>
                  
                  {/* Final Score */}
                  <div className="final-score">
                    <span className="score-value">{player.score || 0}</span>
                    <span className="score-label">points</span>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Performance Summary */}
        {currentPlayerResult && (
          <div className="personal-summary">
            <div className="summary-card">
              <h4>Your Match Performance</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-icon">{getTrophyIcon(currentPlayerRank)}</span>
                  <span className="stat-label">Final Rank:</span>
                  <span className="stat-value">
                    {currentPlayerRank}{getRankSuffix(currentPlayerRank)} Place
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-label">Total Score:</span>
                  <span className="stat-value">{currentPlayerResult.score || 0} points</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-label">Difficulty:</span>
                  <span 
                    className="stat-value"
                    style={{ color: getDifficultyColor(currentPlayerResult.difficulty) }}
                  >
                    {getDifficultyDisplay(currentPlayerResult.difficulty)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="match-complete-actions">
          {isHost && (
            <>
              {onStartNewMatch && (
                <button 
                  className="start-new-match-button"
                  onClick={onStartNewMatch}
                >
                  🔄 Start New Match
                </button>
              )}
              {onReturnToLobby && (
                <button 
                  className="return-lobby-button"
                  onClick={onReturnToLobby}
                >
                  🏠 Return to Lobby
                </button>
              )}
            </>
          )}
          
          {!isHost && (
            <div className="non-host-message">
              <p>Waiting for host to start a new match or return to lobby...</p>
            </div>
          )}
        </div>

        {/* Auto Return Notice */}
        <div className="auto-return-notice">
          <p>Returning to lobby automatically in a few seconds...</p>
        </div>

      </div>
    </div>
  );
} 