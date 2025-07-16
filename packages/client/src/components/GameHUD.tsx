/**
 * Game HUD Component
 * Real-time heads-up display for active gameplay
 * Shows timer, leaderboard, round info, and game controls during matches
 */

import React from 'react';
import { Player } from '@word-rush/common';

/**
 * Timer data structure for round timing
 */
interface TimerData {
  timeRemaining: number; // milliseconds
  currentRound: number;
  totalRounds: number;
}

/**
 * Component props for GameHUD
 */
interface GameHUDProps {
  /** Current timer state */
  timer: TimerData;
  /** Array of players for leaderboard */
  players: Player[];
  /** Current player ID for highlighting */
  currentPlayerId: string;
  /** Whether shuffle button should be enabled */
  canShuffle: boolean;
  /** Current player's points available for shuffle cost */
  playerPoints: number;
  /** Cost in points to shuffle the board */
  shuffleCost: number;
  /** Callback when shuffle button is clicked */
  onShuffle?: () => void;
  /** Whether the game is currently active */
  isGameActive: boolean;
}

/**
 * Game HUD display component
 * Provides real-time game information and controls during active gameplay
 * @param props - GameHUD component props
 * @returns In-game HUD with timer, leaderboard, and controls
 */
export function GameHUD({
  timer,
  players,
  currentPlayerId,
  canShuffle,
  playerPoints,
  shuffleCost,
  onShuffle,
  isGameActive
}: GameHUDProps): JSX.Element {

  /**
   * Format time remaining for display
   */
  function formatTime(milliseconds: number): string {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get time display color based on remaining time
   */
  function getTimeColor(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    if (seconds <= 10) return '#ff4444'; // Red for last 10 seconds
    if (seconds <= 30) return '#ff8800'; // Orange for last 30 seconds
    return '#4CAF50'; // Green for normal time
  }

  /**
   * Get progress percentage for timer bar
   */
  function getTimeProgress(milliseconds: number): number {
    const totalTime = 90000; // 90 seconds total
    return Math.max(0, Math.min(100, (milliseconds / totalTime) * 100));
  }

  /**
   * Get difficulty color for player display
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

  /**
   * Sort players by current score for leaderboard
   */
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="game-hud">
      
      {/* Top Bar with Timer and Round Info */}
      <div className="hud-top-bar">
        
        {/* Round Information */}
        <div className="round-info">
          <div className="round-display">
            <span className="round-label">Round</span>
            <span className="round-numbers">
              {timer.currentRound} / {timer.totalRounds}
            </span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="timer-section">
          <div className="timer-container">
            
            {/* Timer Bar */}
            <div className="timer-bar-container">
              <div 
                className="timer-bar"
                style={{
                  width: `${getTimeProgress(timer.timeRemaining)}%`,
                  backgroundColor: getTimeColor(timer.timeRemaining)
                }}
              />
            </div>
            
            {/* Timer Text */}
            <div 
              className="timer-text"
              style={{ color: getTimeColor(timer.timeRemaining) }}
            >
              {formatTime(timer.timeRemaining)}
            </div>
            
            {/* Timer Label */}
            <div className="timer-label">Time Remaining</div>
          </div>
        </div>

        {/* Shuffle Control */}
        <div className="shuffle-control">
          <button
            className={`shuffle-button ${canShuffle && isGameActive ? 'enabled' : 'disabled'}`}
            onClick={onShuffle}
            disabled={!canShuffle || !isGameActive}
            title={
              !isGameActive 
                ? 'Game not active'
                : !canShuffle 
                  ? `Need ${shuffleCost} points to shuffle`
                  : `Shuffle board (${shuffleCost} points)`
            }
          >
            <div className="shuffle-icon">🔀</div>
            <div className="shuffle-text">
              <span className="shuffle-label">Shuffle</span>
              <span className="shuffle-cost">-{shuffleCost} pts</span>
            </div>
          </button>
        </div>

      </div>

      {/* Leaderboard Sidebar */}
      <div className="hud-leaderboard">
        <div className="leaderboard-container">
          
          {/* Leaderboard Header */}
          <div className="leaderboard-header">
            <h3>Live Scores</h3>
          </div>
          
          {/* Player Rankings */}
          <div className="leaderboard-list">
            {sortedPlayers.map((player, index) => {
              const rank = index + 1;
              const isCurrentPlayer = player.id === currentPlayerId;
              
              return (
                <div 
                  key={player.id}
                  className={`leaderboard-item ${isCurrentPlayer ? 'current-player' : ''} rank-${rank}`}
                >
                  
                  {/* Rank Badge */}
                  <div className="rank-badge">
                    {rank === 1 && '👑'}
                    {rank === 2 && '🥈'}
                    {rank === 3 && '🥉'}
                    {rank > 3 && rank}
                  </div>
                  
                  {/* Player Info */}
                  <div className="player-info">
                    <div className="player-name">
                      {player.username || 'Unknown'}
                      {isCurrentPlayer && <span className="you-tag">You</span>}
                    </div>
                    <div 
                      className="player-difficulty"
                      style={{ color: getDifficultyColor(player.difficulty || 'medium') }}
                    >
                      {(player.difficulty || 'medium').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Player Score */}
                  <div className="player-score">
                    <span className="score-value">{player.score}</span>
                    <span className="score-label">pts</span>
                  </div>
                  
                </div>
              );
            })}
          </div>
          
          {/* Current Player Highlight */}
          <div className="current-player-stats">
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Your Score:</span>
                <span className="stat-value">
                  {players.find(p => p.id === currentPlayerId)?.score || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Available Points:</span>
                <span className="stat-value">{playerPoints}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Status Messages - Removed "Round Paused" as auto-unpause is now implemented */}

      {/* Low Time Warning */}
      {timer.timeRemaining <= 10000 && isGameActive && (
        <div className="low-time-warning">
          <div className="warning-text">⚠️ 10 Seconds Remaining! ⚠️</div>
        </div>
      )}

      {/* Speed Bonus Indicator */}
      <div className="speed-bonus-indicator">
        <div className="bonus-text">Speed Bonus Active! 1.5x</div>
      </div>

    </div>
  );
} 