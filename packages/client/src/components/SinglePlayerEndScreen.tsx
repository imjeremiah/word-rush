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
  const { singlePlayerScore, singlePlayerDifficulty, resetSinglePlayer, setGameState } = useGameContext();

  /**
   * Handle returning to main menu
   */
  const handleBackToMenu = (): void => {
    resetSinglePlayer();
    setGameState('menu');
  };

  /**
   * Handle playing again
   */
  const handlePlayAgain = (): void => {
    resetSinglePlayer();
    setGameState('single-player-setup');
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

  const scoreRating = getScoreRating(singlePlayerScore);
  const difficultyInfo = getDifficultyInfo();

  return (
    <div className="end-screen">
      <div className="screen-container">
        <div className="end-screen-content">
          <div className="completion-header">
            <h1 className="completion-title">Round Complete!</h1>
            <div className="completion-emoji">{scoreRating.emoji}</div>
          </div>

          <div className="score-section">
            <div className="final-score">
              <span className="score-label">Final Score</span>
              <span className="score-value">{singlePlayerScore}</span>
            </div>
            
            <div className="score-rating">
              <h2>{scoreRating.rating}</h2>
              <p>{scoreRating.message}</p>
            </div>
          </div>

          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Difficulty:</span>
              <span 
                className="stat-value" 
                style={{ color: difficultyInfo.color }}
              >
                {difficultyInfo.name} ({difficultyInfo.multiplier})
              </span>
            </div>
          </div>

          <div className="end-screen-actions">
            <button 
              className="action-button primary"
              onClick={handlePlayAgain}
            >
              🔄 Play Again
            </button>
            
            <button 
              className="action-button secondary"
              onClick={handleBackToMenu}
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="encouragement">
            <p>
              {singlePlayerScore > 0 
                ? "Great job finding words! Try a higher difficulty for more points." 
                : "Don't give up! Every expert was once a beginner."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePlayerEndScreen; 