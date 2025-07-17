/**
 * Countdown Screen Component
 * Displays 3-2-1-GO countdown sequence before match starts
 * Provides visual preparation period for players
 */

import { useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';

/**
 * Countdown Screen component for pre-match preparation
 * Shows large countdown numbers and automatically transitions to match
 * @returns JSX element containing the countdown interface
 */
function CountdownScreen(): JSX.Element {
  const [count, setCount] = useState(3);
  const [showGO, setShowGO] = useState(false);
  const { setGameState } = useGameContext();

  useEffect(() => {
    console.log(`[${new Date().toISOString()}] 🚀 Starting match countdown sequence...`);
    
    // Start countdown sequence
    const countdownInterval = setInterval(() => {
      setCount(prev => {
        console.log(`[${new Date().toISOString()}] ⏰ Countdown: ${prev}`);
        
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowGO(true);
          
          // Show "GO!" for 1 second then transition to match
          setTimeout(() => {
            console.log(`[${new Date().toISOString()}] 🎮 Transitioning to match state...`);
            setGameState('match');
          }, 1000);
          
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
  }, [setGameState]);

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