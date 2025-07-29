/**
 * Single Player Setup Component
 * Allows players to configure difficulty level and round duration before starting single player mode
 * Provides entry point for solo gameplay with customizable settings
 */

import { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { DifficultyLevel } from '@word-rush/common';

/**
 * Single Player Setup component for configuring game settings
 * Displays difficulty and duration selection before starting single player round
 * @returns JSX element containing the setup interface
 */
function SinglePlayerSetup(): JSX.Element {
  const { setSinglePlayerDifficulty, setSinglePlayerDuration, setGameState, socket, resetSinglePlayer } = useGameContext();
  
  // Local states for selections
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [duration, setDuration] = useState<number>(90); // Default 90s

  /**
   * Handle starting single player game
   */
  const handleStart = (): void => {
    // Save settings to context
    setSinglePlayerDifficulty(difficulty);
    setSinglePlayerDuration(duration);
    
    // Request initial board from server
    socket?.emit('game:request-board');
    
    // Transition to single player game state
    setGameState('single-player');
  };

  /**
   * Handle returning to main menu
   */
  const handleBack = (): void => {
    resetSinglePlayer(); // Clear any partial single player state
    setGameState('menu');
  };

  return (
    <div className="setup-screen">
      <div className="screen-container">
        <div className="screen-header">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h2>Single Player Setup</h2>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label>Difficulty Level:</label>
            <div className="difficulty-selector">
              <button 
                className={`difficulty-button ${difficulty === 'easy' ? 'selected' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                Easy (2+ letters)
              </button>
              <button 
                className={`difficulty-button ${difficulty === 'medium' ? 'selected' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                Medium (3+ letters)
              </button>
              <button 
                className={`difficulty-button ${difficulty === 'hard' ? 'selected' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                Hard (4+ letters)
              </button>
              <button 
                className={`difficulty-button ${difficulty === 'extreme' ? 'selected' : ''}`}
                onClick={() => setDifficulty('extreme')}
              >
                Extreme (5+ letters)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Round Duration:</label>
            <div className="duration-selector">
              <button 
                className={`duration-button ${duration === 30 ? 'selected' : ''}`}
                onClick={() => setDuration(30)}
              >
                30s
              </button>
              <button 
                className={`duration-button ${duration === 60 ? 'selected' : ''}`}
                onClick={() => setDuration(60)}
              >
                60s
              </button>
              <button 
                className={`duration-button ${duration === 90 ? 'selected' : ''}`}
                onClick={() => setDuration(90)}
              >
                90s
              </button>
              <button 
                className={`duration-button ${duration === 120 ? 'selected' : ''}`}
                onClick={() => setDuration(120)}
              >
                120s
              </button>
            </div>
          </div>

          <div className="difficulty-info">
            <h3>Difficulty Effects:</h3>
            <ul>
              <li><strong>Easy (1.0x):</strong> 2+ letter words, no score bonus</li>
              <li><strong>Medium (1.5x):</strong> 3+ letter words, 1.5x score multiplier</li>
              <li><strong>Hard (2.0x):</strong> 4+ letter words, 2x score multiplier</li>
              <li><strong>Extreme (3.0x):</strong> 5+ letter words, 3x score multiplier</li>
            </ul>
          </div>

          <div className="setup-actions">
            <button 
              className="start-button primary"
              onClick={handleStart}
              disabled={!socket?.connected}
            >
              {!socket?.connected ? 'Connecting...' : 'Start Single Player Round'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePlayerSetup; 