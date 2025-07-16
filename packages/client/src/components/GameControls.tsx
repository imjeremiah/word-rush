/**
 * Game Controls Component - Enhanced with Testing & Validation
 * Provides game control interface including word testing, board management, and debug tools
 * Uses game context to access socket connection and provides comprehensive testing utilities
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
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

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
   * Phase 5 Testing Functions - Board Synchronization Validation
   */

  /**
   * Test board synchronization by requesting multiple boards rapidly
   */
  const testBoardSynchronization = (): void => {
    if (!socket) return;
    
    console.log(`[${new Date().toISOString()}] 🧪 Testing board synchronization...`);
    
    // Request 3 boards rapidly to test synchronization
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        socket.emit('game:request-board');
        console.log(`[${new Date().toISOString()}] 📨 Board request ${i + 1} sent`);
      }, i * 100);
    }
  };

  /**
   * Test visual state validation by triggering manual validation
   */
  const testVisualStateValidation = (): void => {
    console.log(`[${new Date().toISOString()}] 🧪 Testing visual state validation...`);
    
    // Trigger visual state validation through global function access
    if ((window as any).triggerVisualValidation) {
      (window as any).triggerVisualValidation();
    } else {
      console.warn(`[${new Date().toISOString()}] ⚠️ Visual validation function not available`);
    }
  };

  /**
   * Test component lifecycle stability by logging current state
   */
  const testComponentLifecycle = (): void => {
    console.log(`[${new Date().toISOString()}] 🧪 Testing component lifecycle stability...`);
    
    const gameState = localStorage.getItem('wordRushGameState');
    const roundData = localStorage.getItem('wordRushRoundData');
    
    console.log(`[${new Date().toISOString()}] 📊 Current game state:`, gameState);
    console.log(`[${new Date().toISOString()}] 📊 Round data:`, roundData);
    
    // Check for multiple Phaser instances
    const canvases = document.querySelectorAll('canvas');
    console.log(`[${new Date().toISOString()}] 🎮 Canvas elements found: ${canvases.length}`);
    
    if (canvases.length > 1) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Multiple canvas elements detected - possible instance duplication!`);
    }
  };

  /**
   * Test scene readiness and recovery
   */
  const testSceneRecovery = (): void => {
    console.log(`[${new Date().toISOString()}] 🧪 Testing scene recovery mechanisms...`);
    
    // This would trigger scene recovery test if we had global access
    if ((window as any).triggerSceneRecovery) {
      (window as any).triggerSceneRecovery();
    } else {
      console.warn(`[${new Date().toISOString()}] ⚠️ Scene recovery test function not available`);
    }
  };

  /**
   * Comprehensive system validation test
   */
  const runFullSystemTest = (): void => {
    console.log(`[${new Date().toISOString()}] 🧪 Running comprehensive system validation...`);
    
    testComponentLifecycle();
    setTimeout(() => testBoardSynchronization(), 1000);
    setTimeout(() => testVisualStateValidation(), 2000);
    setTimeout(() => testSceneRecovery(), 3000);
    
    console.log(`[${new Date().toISOString()}] ✅ System test sequence initiated`);
  };

  /**
   * Clear all localStorage debugging data
   */
  const clearDebugData = (): void => {
    localStorage.removeItem('wordRushGameState');
    localStorage.removeItem('wordRushRoundData');
    console.log(`[${new Date().toISOString()}] 🧹 Debug data cleared`);
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

      {/* Phase 5: Debug & Testing Panel */}
      <div className="game-controls-card">
        <h2>
          🧪 Debug & Testing
          <button 
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="control-button"
            style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
          >
            {showDebugPanel ? 'Hide' : 'Show'}
          </button>
        </h2>
        
        {showDebugPanel && (
          <div className="debug-panel">
            <div className="test-section">
              <h3>🔍 System Validation</h3>
              <div className="debug-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={runFullSystemTest} className="control-button">
                  Full System Test
                </button>
                <button onClick={testComponentLifecycle} className="control-button">
                  Component Lifecycle
                </button>
              </div>
            </div>

            <div className="test-section">
              <h3>📊 Board Synchronization</h3>
              <div className="debug-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={testBoardSynchronization} className="control-button">
                  Board Sync Test
                </button>
                <button onClick={testVisualStateValidation} className="control-button">
                  Visual Validation
                </button>
              </div>
            </div>

            <div className="test-section">
              <h3>🛠️ Scene & Recovery</h3>
              <div className="debug-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={testSceneRecovery} className="control-button">
                  Scene Recovery
                </button>
                <button onClick={clearDebugData} className="control-button">
                  Clear Debug Data
                </button>
              </div>
            </div>

            <div className="test-section">
              <h3>📋 Current Status</h3>
              <div className="debug-info" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                <div><strong>Game State:</strong> {localStorage.getItem('wordRushGameState') || 'unknown'}</div>
                <div><strong>Canvas Count:</strong> {document.querySelectorAll('canvas').length}</div>
                <div><strong>Connection:</strong> {connectionStatus}</div>
                <div><strong>Round Data:</strong> {localStorage.getItem('wordRushRoundData') ? 'Available' : 'None'}</div>
              </div>
            </div>
          </div>
        )}
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