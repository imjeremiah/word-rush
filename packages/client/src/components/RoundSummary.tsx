/**
 * Round Summary Component
 * Displays end-of-round scores, player rankings, and match progression
 * Appears between rounds showing individual round performance and overall standings
 */

import React from 'react';

/**
 * Round summary data structure
 */
interface RoundSummaryData {
  roundNumber: number;
  scores: Array<{
    playerId: string;
    playerName: string;
    roundScore: number;
    totalScore: number;
    difficulty: string;
  }>;
  isMatchComplete: boolean;
}

/**
 * Component props for RoundSummary
 */
interface RoundSummaryProps {
  /** Round summary data received from server */
  roundSummary: RoundSummaryData;
  /** Whether the current player is the host */
  isHost: boolean;
  /** Current player ID for highlighting */
  currentPlayerId: string;
  /** Callback when continuing to next round or match end */
  onContinue?: () => void;
}

/**
 * Round Summary display component
 * Shows round results with player rankings and scores
 * @param props - RoundSummary component props
 * @returns Round summary display with scores and progression
 */
export function RoundSummary({
  roundSummary,
  isHost,
  currentPlayerId,
  onContinue
}: RoundSummaryProps): JSX.Element {
  
  // Sort players by total score for ranking display
  const sortedPlayers = [...roundSummary.scores].sort((a, b) => b.totalScore - a.totalScore);
  
  // Find current player's rank
  const currentPlayerRank = sortedPlayers.findIndex(p => p.playerId === currentPlayerId) + 1;
  
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
   * Get difficulty color for visual distinction
   */
  function getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'extreme': return '#9C27B0';
      default: return '#2196F3';
    }
  }

  return (
    <div className="round-summary-overlay">
      <div className="round-summary-container">
        
        {/* Round Header */}
        <div className="round-summary-header">
          <h2>Round {roundSummary.roundNumber} Complete!</h2>
          {!roundSummary.isMatchComplete && (
            <p className="next-round-text">Get ready for the next round...</p>
          )}
        </div>

        {/* Player Rankings */}
        <div className="round-summary-rankings">
          <h3>Current Standings</h3>
          
          <div className="rankings-list">
            {sortedPlayers.map((player, index) => {
              const rank = index + 1;
              const isCurrentPlayer = player.playerId === currentPlayerId;
              
              return (
                <div 
                  key={player.playerId}
                  className={`ranking-item ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  
                  {/* Rank Badge */}
                  <div className={`rank-badge rank-${rank}`}>
                    {rank}{getRankSuffix(rank)}
                  </div>
                  
                  {/* Player Info */}
                  <div className="player-info">
                    <div className="player-name">
                      {player.playerName}
                      {isCurrentPlayer && <span className="you-indicator">(You)</span>}
                    </div>
                    <div 
                      className="player-difficulty"
                      style={{ color: getDifficultyColor(player.difficulty) }}
                    >
                      {player.difficulty.charAt(0).toUpperCase() + player.difficulty.slice(1)}
                    </div>
                  </div>
                  
                  {/* Scores */}
                  <div className="player-scores">
                    <div className="round-score">
                      <span className="score-label">Round:</span>
                      <span className="score-value">+{player.roundScore}</span>
                    </div>
                    <div className="total-score">
                      <span className="score-label">Total:</span>
                      <span className="score-value">{player.totalScore}</span>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Player Highlight */}
        <div className="player-performance-highlight">
          <div className="performance-card">
            <h4>Your Performance</h4>
            <div className="performance-stats">
              <div className="stat">
                <span className="stat-label">Round Rank:</span>
                <span className="stat-value">{currentPlayerRank}{getRankSuffix(currentPlayerRank)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Round Score:</span>
                <span className="stat-value">
                  +{roundSummary.scores.find(p => p.playerId === currentPlayerId)?.roundScore || 0}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Score:</span>
                <span className="stat-value">
                  {roundSummary.scores.find(p => p.playerId === currentPlayerId)?.totalScore || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button (for host only, if provided) */}
        {isHost && onContinue && (
          <div className="round-summary-actions">
            <button 
              className="continue-button"
              onClick={onContinue}
            >
              {roundSummary.isMatchComplete ? 'View Match Results' : 'Start Next Round'}
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="round-progress">
          <div className="progress-text">
            {roundSummary.isMatchComplete 
              ? 'Match Complete - Final Results Coming Up!' 
              : 'Next round in 5 seconds...'
            }
          </div>
          {!roundSummary.isMatchComplete && (
            <div className="auto-continue-message">
              <p>The next round will start automatically, or the host can continue manually.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
} 