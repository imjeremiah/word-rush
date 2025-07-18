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
  /** Whether the game is currently active */
  isGameActive: boolean;
  // 🎯 PHASE C.3.2: Removed shuffle-related props: canShuffle, shuffleCost, onShuffle
  // 🎯 PHASE D.2.2: Removed playerPoints prop - no longer needed after stats section removal
}

/**
 * 🟡 PHASE 3A: Optimized Game HUD display component with React.memo
 * Provides real-time game information and controls during active gameplay
 * @param props - GameHUD component props
 * @returns In-game HUD with timer, leaderboard, and controls
 */
export const GameHUD = React.memo<GameHUDProps>(({
  timer,
  players,
  currentPlayerId,
  isGameActive
  // 🎯 PHASE C.3.2: Removed shuffle parameters: canShuffle, shuffleCost, onShuffle
  // 🎯 PHASE D.2.2: Removed playerPoints parameter - no longer needed after stats section removal
}: GameHUDProps): JSX.Element => {

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
   * Get progress percentage for circular timer ring
   */
  function getTimeProgress(milliseconds: number): number {
    const totalTime = 120000; // 120 seconds total for 7x7 board
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

  /**
   * Find the King of the Hill (player with most crowns)
   */
  const kingOfTheHill = players.length > 0 
    ? players.reduce((prev, current) => ((current.crowns || 0) > (prev.crowns || 0)) ? current : prev)
    : null;
  const isKingOfTheHill = (player: Player) => kingOfTheHill && player.id === kingOfTheHill.id && (kingOfTheHill.crowns || 0) > 0;

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

        {/* Timer Display with Circular SVG Progress */}
        <div className="timer-section">
          <div className="timer-container">
            
            {/* 🎯 PHASE C.4.1: Timer Label moved above for uniform structure with Round */}
            <div className="timer-label">Time Remaining</div>
            
            {/* Circular Timer Ring */}
            <div className="circular-timer">
              <svg className="timer-ring" width="120" height="120" viewBox="0 0 120 120">
                {/* Background ring */}
                <circle
                  cx="60" cy="60" r="50"
                  stroke="#038BB0" strokeWidth="8" fill="none"
                  className="timer-ring-background"
                />
                {/* Progress ring */}
                <circle
                  cx="60" cy="60" r="50"
                  stroke="#2CFFFF" strokeWidth="8" fill="none"
                  strokeDasharray={`${(getTimeProgress(timer.timeRemaining) / 100) * 314} 314`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                  className="timer-ring-progress"
                  style={{ 
                    filter: 'drop-shadow(0 0 4px #2CFFFF)',
                    stroke: getTimeColor(timer.timeRemaining),
                    transition: 'stroke-dasharray 1s ease-out, stroke 0.3s ease'
                  }}
                />
                {/* Timer text in center */}
                <text
                  x="60" y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="timer-text-svg"
                  style={{ 
                    fill: '#E2EEDD',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: 'Inter, monospace'
                  }}
                >
                  {formatTime(timer.timeRemaining)}
                </text>
              </svg>
            </div>
            
          </div>
        </div>

        {/* 🎯 PHASE C.3.1: Shuffle Control removed - functionality eliminated */}

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
              const isKing = isKingOfTheHill(player);
              const hasCrowns = (player.crowns || 0) > 0;
              
              return (
                <div 
                  key={player.id}
                  className={`leaderboard-item ${isCurrentPlayer ? 'current-player' : ''} ${isKing ? 'king-of-the-hill' : ''} rank-${rank}`}
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
                      {/* Crown indicator for King of the Hill */}
                      {isKing && <span className="king-crown">👑</span>}
                      {/* Crown count display */}
                      {hasCrowns && !isKing && (
                        <span className="crown-count">
                          👑 {player.crowns}
                        </span>
                      )}
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
          
          {/* 🎯 PHASE D.2.1: Current Player Stats section removed - live scores now shows only player rankings */}

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
}); 