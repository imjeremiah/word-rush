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
    // Bonus information for best word
    bestWordHadDifficultyBonus?: boolean;
    bestWordHadSpeedBonus?: boolean;
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
  /** Callback when returning to main menu */
  onReturnToMainMenu?: () => void;
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
  onReturnToMainMenu
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
   * Get the point value for a letter (Scrabble scoring)
   */
  function getLetterPoints(letter: string): number {
    const LETTER_POINTS: { [key: string]: number } = {
      A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
      K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
      U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
    };
    return LETTER_POINTS[letter.toUpperCase()] || 1;
  }

  /**
   * Get tile color by point value (matching game tiles)
   */
  function getTileColorByPoints(points: number): string {
    switch(points) {
      case 1: return '#045476';    // Dark Blue 
      case 2: return '#0A7497';    // Blue 
      case 3: return '#149ABC';    // Light Blue 
      case 4: return '#0F9995';    // Teal 
      case 5: return '#FBA731';    // Orange 
      case 8: return '#F88C2B';    // Dark Orange 
      case 10: return '#F1742A';   // Red Orange 
      default: return '#045476';
    }
  }

  /**
   * Render a word as game-like letter tiles with point values
   */
  function renderWordAsTiles(word: string) {
    if (!word || word === 'None') return <span className="stat-value enhanced-stat">None</span>;
    
    return (
      <div className="word-tiles">
        {word.split('').map((letter, index) => {
          const points = getLetterPoints(letter);
          const tileColor = getTileColorByPoints(points);
          return (
            <div 
              key={index} 
              className="game-letter-tile"
              style={{ backgroundColor: tileColor }}
            >
              <span className="tile-letter">{letter.toUpperCase()}</span>
              <span className="tile-points">{points}</span>
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * Get trophy/medal icon and styling based on rank
   */
  function getRankInfo(rank: number) {
    if (rank === 1) return { icon: '🏆', class: 'rank-winner', badge: 'WINNER!' };
    if (rank === 2) return { icon: '🥈', class: 'rank-runner-up', badge: 'RUNNER-UP' };
    if (rank === 3) return { icon: '🥉', class: 'rank-third', badge: '3RD PLACE' };
    return { icon: '🏅', class: 'rank-other', badge: `${rank}${getRankSuffix(rank)} PLACE` };
  }

  return (
    <div className="match-complete-overlay">
      <div className="match-complete-container">
        
        {/* Centered Match Complete Title */}
        <div className="match-complete-header">
          <h1 className="match-complete-title">Match Complete!</h1>
        </div>

        {/* Final Rankings with Centered Round Info */}
        <div className="final-rankings">
          <h3 className="final-rankings-title">Final Rankings</h3>
          <div className="match-info">
            {matchComplete.totalRounds} Round{matchComplete.totalRounds !== 1 ? 's' : ''} Played
          </div>
          
          <div className="ranking-list">
            {matchComplete.finalScores.map((player) => {
              const isCurrentPlayer = player.playerId === currentPlayerId;
              const rankInfo = getRankInfo(player.rank);
              
              return (
                <div 
                  key={player.playerId}
                  className={`final-ranking-item ${rankInfo.class} ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  {/* Trophy Icon with Badge */}
                  <div className="trophy-section">
                    <div className="rank-icon">
                      {rankInfo.icon}
                    </div>
                    <div className="rank-badge">
                      {rankInfo.badge}
                    </div>
                  </div>
                  
                  {/* Player Info - Centered */}
                  <div className="player-info-centered">
                    <div className="player-name">
                      {player.playerName || 'Unknown Player'}
                      {isCurrentPlayer && <span className="you-indicator"> (You)</span>}
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

        {/* Stacked Match Statistics */}
        <div className="enhanced-stats">
          <h3 className="match-statistics-title">Match Statistics</h3>
          <div className="stats-container">
            {matchComplete.finalScores.map((player) => {
              const isCurrentPlayer = player.playerId === currentPlayerId;
              const rankInfo = getRankInfo(player.rank);
              
              return (
                <div 
                  key={player.playerId}
                  className={`player-stats-card-stacked ${rankInfo.class} ${isCurrentPlayer ? 'current-player' : ''}`}
                >
                  <div className="stats-header">
                    <span className="stats-rank-icon">{rankInfo.icon}</span>
                    <span className="stats-player-name">
                      {player.playerName}
                      {isCurrentPlayer && ' (You)'}
                    </span>
                  </div>
                  

                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Words Found:</span>
                      <span className="stat-value words-found-value">{player.wordsFound || 0}</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-label">Longest Word:</span>
                      <div className="stat-value">
                        {renderWordAsTiles(player.longestWord || '')}
                      </div>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-label">Best Word:</span>
                      <div className="stat-value">
                        {player.highestScoringWord && player.highestScoringWord !== 'None' ? (
                          <div className="best-word-container">
                            {renderWordAsTiles(player.highestScoringWord)}
                            {player.highestWordScore && (
                              <div className="word-score-section">
                                <span className="word-score"><strong>({player.highestWordScore}pts)</strong></span>
                                <div className="bonus-badges">
                                  {player.bestWordHadDifficultyBonus && (
                                    <span className="bonus-badge difficulty-bonus">DIFF</span>
                                  )}
                                  {player.bestWordHadSpeedBonus && (
                                    <span className="bonus-badge speed-bonus">SPEED</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="stat-value">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Return to Main Menu Button */}
        <div className="match-complete-actions">
          {onReturnToMainMenu && (
            <button 
              className="return-main-menu-button"
              onClick={onReturnToMainMenu}
            >
              🏠 Return to Main Menu
            </button>
          )}
        </div>

      </div>
    </div>
  );
} 