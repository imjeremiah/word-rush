/**
 * Match Complete Component
 * Displays final match results and victory screen
 * Shows final scores, winner, and options to play again or return to lobby
 */

/**
 * Match completion data structure with enhanced stats
 */
interface MatchCompleteData {
  winner: {
    id: string;
    username: string;
    score: number;
    difficulty?: string;
  } | null;
  finalScores: Array<{
    rank: number;
    playerId: string;
    playerName: string;
    score: number;
    difficulty?: string;
    // Enhanced stats
    wordsFound?: number;
    longestWord?: string;
    highestScoringWord?: string;
    highestWordScore?: number;
    averageWordLength?: number;
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
    id: '', 
    username: 'Unknown', 
    score: 0, 
    difficulty: 'medium' 
  };
  
  // Check if current player is the winner
  const isWinner = winner.id === currentPlayerId;
  
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
   * Get trophy/medal icon and styling based on rank
   */
  function getRankInfo(rank: number) {
    if (rank === 1) return { icon: '🏆', class: 'rank-winner', title: 'WINNER' };
    if (rank === 2) return { icon: '🥈', class: 'rank-runner-up', title: 'RUNNER-UP' };
    if (rank === 3) return { icon: '🥉', class: 'rank-third', title: '3RD PLACE' };
    return { icon: '🏅', class: 'rank-other', title: `${rank}${getRankSuffix(rank)} PLACE` };
  }

  return (
    <div className="match-complete-overlay">
      <div className="match-complete-container">
        
        {/* Winner Announcement */}
        <div className="winner-announcement">
          <h1 className="match-complete-title">Match Complete!</h1>
          
          <div className="winner-card">
            <div className="winner-trophy">🏆</div>
            <div className="winner-info">
              <h2 className="winner-name">{winner.username}</h2>
              <div className="winner-score">{winner.score} points</div>
              <div 
                className="winner-difficulty"
                style={{ color: getDifficultyColor(winner.difficulty) }}
              >
                {getDifficultyDisplay(winner.difficulty)} Difficulty
              </div>
            </div>
          </div>
        </div>

        {/* Final Rankings with Clear Winner/Loser Distinction */}
        <div className="final-rankings">
          <h3>Final Rankings</h3>
          <div className="match-stats">
            {matchComplete.totalRounds} Round{matchComplete.totalRounds !== 1 ? 's' : ''} Played
          </div>
          
          <div className="rankings-list">
            {matchComplete.finalScores.map((player) => {
              const isCurrentPlayer = player.playerId === currentPlayerId;
              const rankInfo = getRankInfo(player.rank);
              
              return (
                <div 
                  key={player.playerId}
                  className={`final-ranking-item ${rankInfo.class} ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  
                  {/* Rank with Trophy/Medal */}
                  <div className="rank-display">
                    <div className="rank-icon">{rankInfo.icon}</div>
                    <div className="rank-info">
                      <div className="rank-title">{rankInfo.title}</div>
                      <div className="rank-position">{player.rank}{getRankSuffix(player.rank)}</div>
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
                      {getDifficultyDisplay(player.difficulty)}
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

        {/* Enhanced Player Stats */}
        <div className="enhanced-stats">
          <h3>Match Statistics</h3>
          <div className="stats-grid">
            {matchComplete.finalScores.map((player) => {
              const isCurrentPlayer = player.playerId === currentPlayerId;
              const rankInfo = getRankInfo(player.rank);
              
              return (
                <div 
                  key={player.playerId}
                  className={`player-stats-card ${rankInfo.class} ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  <div className="stats-header">
                    <span className="stats-rank-icon">{rankInfo.icon}</span>
                    <span className="stats-player-name">
                      {player.playerName}
                      {isCurrentPlayer && ' (You)'}
                    </span>
                  </div>
                  
                  <div className="stats-grid-content">
                    <div className="stat-item">
                      <span className="stat-icon">📝</span>
                      <span className="stat-label">Words Found:</span>
                      <span className="stat-value">{player.wordsFound || 0}</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-icon">📏</span>
                      <span className="stat-label">Longest Word:</span>
                      <span className="stat-value">{player.longestWord || 'None'}</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-icon">💎</span>
                      <span className="stat-label">Best Word:</span>
                      <span className="stat-value">
                        {player.highestScoringWord || 'None'}
                        {player.highestWordScore ? ` (${player.highestWordScore}pts)` : ''}
                      </span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-icon">📊</span>
                      <span className="stat-label">Avg Length:</span>
                      <span className="stat-value">
                        {player.averageWordLength ? `${player.averageWordLength.toFixed(1)} letters` : 'N/A'}
                      </span>
                    </div>
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
                  <span className="stat-icon">{getRankInfo(currentPlayerRank).icon}</span>
                  <span className="stat-label">Final Rank:</span>
                  <span className="stat-value">
                    {currentPlayerRank}{getRankSuffix(currentPlayerRank)} Place
                    {isWinner && <span className="winner-badge">🎉 WINNER! 🎉</span>}
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

      </div>
    </div>
  );
} 