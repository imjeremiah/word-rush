/**
 * Game Controls Component
 * Provides game control interface including word testing and board management
 * Uses game context to access socket connection
 */

import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';

/**
 * Game Controls component that provides testing and control interface
 * Allows players to test words and request new boards
 * @returns JSX element containing game control interface
 */
function GameControls(): JSX.Element {
  const { socket, connectionStatus, setLastWordResult } = useGameContext();
  const [testWord, setTestWord] = useState<string>('');

  /**
   * Test word validation function
   * Submits a test word with mock tiles to the server for validation
   */
  const testWordValidation = (): void => {
    if (!socket || !testWord.trim()) {
      return;
    }

    // Create mock tiles for testing
    const mockTiles = testWord.split('').map((letter, index) => ({
      letter: letter.toUpperCase(),
      points: 1,
      x: index,
      y: 0,
      id: `tile-${index}`,
    }));

    socket.emit('word:submit', {
      word: testWord.trim(),
      tiles: mockTiles,
    });

    setTestWord('');
  };

  /**
   * Request a new board from the server
   * Clears previous word result and requests fresh board
   */
  const requestNewBoard = (): void => {
    if (socket) {
      socket.emit('game:request-board');
      setLastWordResult(null); // Clear previous result
    }
  };

  /**
   * Handle Enter key press in test input
   * @param event - Keyboard event
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      testWordValidation();
    }
  };

  return (
    <div className="game-controls">
      {/* Game Controls Card */}
      <div className="game-controls-card">
        <h2>🎯 Game Controls</h2>
        <button
          onClick={requestNewBoard}
          disabled={connectionStatus !== 'connected'}
          className="control-button new-board"
        >
          🔄 New Board
        </button>
        
        <div className="test-section">
          <h3>Test Word Validation</h3>
          <div className="test-input-group">
            <input
              type="text"
              placeholder="Enter a word to test..."
              value={testWord}
              onChange={(e) => setTestWord(e.target.value)}
              onKeyPress={handleKeyPress}
              className="test-input"
            />
            <button
              onClick={testWordValidation}
              disabled={!testWord.trim() || connectionStatus !== 'connected'}
              className="control-button test-word"
            >
              Test
            </button>
          </div>
          <p className="test-hint">
            Try: &quot;HELLO&quot;, &quot;WORLD&quot;, &quot;SCRABBLE&quot;, &quot;CAT&quot;, &quot;DOG&quot;
          </p>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="game-info-card">
        <h2>📋 How to Play</h2>
        <ul className="instructions">
          <li>Drag your mouse over adjacent tiles to form words</li>
          <li>Words must be at least 2 letters long</li>
          <li>Letter values follow official Scrabble scoring</li>
          <li>Release mouse to submit your word</li>
          <li>Find as many words as you can!</li>
        </ul>
      </div>
    </div>
  );
}

export default GameControls; 