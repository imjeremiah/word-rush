/**
 * Countdown Screen Component
 * Displays 3-2-1-GO countdown sequence before match starts
 * Provides visual preparation period for players
 * 🔧 TASK 1: Updated to receive server countdown and wait for 'match:go' signal
 */

import { useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';

/**
 * Countdown Screen component for pre-match preparation
 * Shows large countdown numbers for visual feedback only - waits for server signals
 * @returns JSX element containing the countdown interface
 */
function CountdownScreen(): JSX.Element {
  const [count, setCount] = useState(3);
  const [showGO, setShowGO] = useState(false);
  const { gameState } = useGameContext(); // Remove setGameState - handled by GameConnection

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] 🚀 Starting visual countdown sequence (server-authoritative)...`);
    
    // 🔧 TASK 1: Visual-only countdown - actual match start controlled by server 'match:go'
    const countdownInterval = setInterval(() => {
      setCount(prev => {
        console.log(`[${new Date().toISOString()}] ⏰ Visual countdown: ${prev}`);
        
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowGO(true);
          
          // Show "GO!" and wait for server signal (no automatic transition)
          console.log(`[${new Date().toISOString()}] 🕰️ Visual countdown complete - waiting for server 'match:go' signal`);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []); // Remove setGameState dependency

  // 🔧 TASK 1: Monitor game state changes from server (GameConnection handles transitions)
  useEffect(() => {
    if (gameState === 'match') {
      console.log(`[${new Date().toISOString()}] 🎮 Server triggered transition to match state received!`);
    }
  }, [gameState]);

  /**
   * Get display text for current countdown state
   */
  const getDisplayText = (): string => {
    if (showGO) return 'GO!';
    if (count > 0) return count.toString();
    return 'GO!';
  };

  /**
   * Get CSS class for current countdown state
   */
  const getDisplayClass = (): string => {
    if (showGO) return 'countdown-go';
    return `countdown-number countdown-${count}`;
  };

  return (
    <div className="countdown-screen">
      <div className="countdown-container">
        <div className={`countdown-display ${getDisplayClass()}`}>
          {getDisplayText()}
        </div>
        <div className="countdown-subtitle">
          {showGO ? 'Match Starting!' : 'Get ready...'}
        </div>
        <div className="countdown-background">
          <div className="countdown-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default CountdownScreen; 