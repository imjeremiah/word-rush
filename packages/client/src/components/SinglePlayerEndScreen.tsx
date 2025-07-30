/**
 * Single Player End Screen Component
 * Displays final score and provides options to play again or return to menu
 * Shows completion summary for single player rounds
 */

// React import not needed for this component
import { useGameContext } from '../context/GameContext';

/**
 * Single Player End Screen component for displaying results
 * Shows final score and navigation options after single player round completion
 * @returns JSX element containing the end screen interface
 */
function SinglePlayerEndScreen(): JSX.Element {
  const { singlePlayerScore, singlePlayerDifficulty, singlePlayerStats, resetSinglePlayer, setGameState } = useGameContext();

  /**
   * Handle returning to main menu with browser refresh
   */
  const handleBackToMenu = (): void => {
    resetSinglePlayer();
    // Full browser refresh to return to start
    window.location.href = window.location.origin;
  };

  /**
   * Get score rating based on points achieved
   */
  const getScoreRating = (score: number): { rating: string; message: string; emoji: string } => {
    if (score >= 100) {
      return { rating: 'Excellent!', message: 'Outstanding word mastery!', emoji: '🏆' };
    } else if (score >= 75) {
      return { rating: 'Great!', message: 'Impressive vocabulary skills!', emoji: '🌟' };
    } else if (score >= 50) {
      return { rating: 'Good Job!', message: 'Nice word finding!', emoji: '👍' };
    } else if (score >= 25) {
      return { rating: 'Not Bad!', message: 'Keep practicing!', emoji: '👌' };
    } else {
      return { rating: 'Try Again!', message: 'More words await discovery!', emoji: '🎯' };
    }
  };

  /**
   * Get difficulty display info
   */
  const getDifficultyInfo = () => {
    const difficultyMap = {
      'easy': { name: 'Easy', multiplier: '1.0x', color: '#4CAF50' },
      'medium': { name: 'Medium', multiplier: '1.5x', color: '#FF9800' },
      'hard': { name: 'Hard', multiplier: '2.0x', color: '#F44336' },
      'extreme': { name: 'Extreme', multiplier: '3.0x', color: '#9C27B0' }
    };
    return difficultyMap[singlePlayerDifficulty || 'medium'];
  };

  /**
   * Get the point value for a letter (Scrabble scoring)
   */
  const getLetterPoints = (letter: string): number => {
    const LETTER_POINTS: { [key: string]: number } = {
      A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
      K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
      U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
    };
    return LETTER_POINTS[letter.toUpperCase()] || 1;
  };

  /**
   * Get tile color by point value (matching game tiles)
   */
  const getTileColorByPoints = (points: number): string => {
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
  };

  /**
   * Render a word as game-like letter tiles with point values
   */
  const renderWordAsTiles = (word: string) => {
    if (!word || word === 'None') return <span className="stat-value">None</span>;
    
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
  };

  const scoreRating = getScoreRating(singlePlayerScore);
  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="end-screen">
      <div className="screen-container">
        <div className="end-screen-content">
          <div className="score-rating">
            <div className="completion-emoji">{scoreRating.emoji}</div>
            <h2>{scoreRating.rating}</h2>
            <p>{scoreRating.message}</p>
          </div>

          {/* Enhanced Statistics - Words Found, Longest Word, Best Word */}
          <div className="enhanced-stats">
            <h3 className="match-statistics-title">Game Stats</h3>
            <div className="stats-container">
              <div className="player-stats-card-stacked current-player">
                <div className="stats-header">
                  <span className="stats-rank-icon">🏆</span>
                  <span className="stats-player-name">You</span>
                </div>
                
                <div className="stats-grid">
                  <div className="stat-item final-score-item">
                    <span className="stat-label">Final Score:</span>
                    <span className="stat-value final-score-value">{singlePlayerScore}</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Words Found:</span>
                    <span className="stat-value words-found-value">{singlePlayerStats.wordsFound}</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Longest Word:</span>
                    <div className="stat-value">
                      {renderWordAsTiles(singlePlayerStats.longestWord)}
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-label">Best Word:</span>
                    <div className="stat-value">
                      {singlePlayerStats.highestScoringWord ? (
                        <div className="best-word-container">
                          {renderWordAsTiles(singlePlayerStats.highestScoringWord)}
                          {singlePlayerStats.highestWordScore > 0 && (
                            <div className="word-score-section">
                              <span className="word-score"><strong>({(() => {
                                // Calculate the actual letter values for display
                                const word = singlePlayerStats.highestScoringWord;
                                if (!word) return singlePlayerStats.highestWordScore;
                                
                                const totalLetterPoints = word.split('').reduce((sum, letter) => {
                                  return sum + getLetterPoints(letter);
                                }, 0);
                                
                                return totalLetterPoints;
                              })()}pts)</strong></span>
                              <div className="bonus-badges">
                                {singlePlayerDifficulty && singlePlayerDifficulty !== 'easy' && (
                                  <span className="bonus-badge difficulty-bonus">DIFF</span>
                                )}
                                {singlePlayerStats.bestWordHadSpeedBonus && (
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
            </div>
          </div>

          <div className="end-screen-actions">
            <button 
              className="menu-button primary back-to-menu-button"
              onClick={handleBackToMenu}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePlayerEndScreen; 