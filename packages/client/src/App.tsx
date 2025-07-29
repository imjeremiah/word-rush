/**
 * Word Rush Client - Main App Component
 * Provides game context and manages the overall application layout
 */

import React, { useState, useEffect } from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import GameConnection from './components/GameConnection';
import { GameHUD } from './components/GameHUD';
import PhaserGame from './components/PhaserGame';
import MainMenu from './components/MainMenu';
import LobbyScreen from './components/LobbyScreen';
import CountdownScreen from './components/CountdownScreen';
import SinglePlayerSetup from './components/SinglePlayerSetup';
import SinglePlayerEndScreen from './components/SinglePlayerEndScreen';
import { RoundSummary } from './components/RoundSummary';
import { MatchComplete } from './components/MatchComplete';
import MonitoringDashboard from './components/MonitoringDashboard';
import { notifications } from './services/notifications';
import './App.css';
import './styles/lobby.css';
import './styles/match-flow.css';

/**
 * Main App component using GameProvider and extracted components
 * Provides clean component structure with shared state management
 * @returns JSX element containing the complete Word Rush application
 */
const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

/**
 * 🟡 PHASE 3A: Optimized App Content component with React.memo and performance optimizations
 * Routes between different screens based on game state with component key stability
 * @returns JSX element with the appropriate screen for current game state
 */
const AppContent = React.memo((): JSX.Element => {
  const { 
    socket, 
    gameState, 
    setGameState,
    currentRoom,
    setCurrentRoom,
    roundSummary, 
    matchComplete,
    setMatchComplete,
    setRoundSummary,
    roundTimer,
    setRoundTimer,
    playerSession,
    setMatchData,
    setLastWordResult,
    singlePlayerScore,
    resetSinglePlayer
  } = useGameContext();

  // Component key stability - ensure PhaserGame component doesn't remount during transitions
  const phaserGameKey = React.useMemo(() => {
    // Use room code for stability - only changes when switching rooms, not during round transitions
    // This prevents remounting during score updates, round transitions, and other session changes
    const roomIdentifier = currentRoom?.roomCode || 'default-room';
    return `phaser-stable-${roomIdentifier}`;
  }, [currentRoom?.roomCode]); // Only re-compute if room actually changes

  // 🟡 PHASE 3A: Memoize expensive computations to prevent unnecessary recalculations
  const isHost = React.useMemo(() => {
    return currentRoom?.hostId === socket?.id;
  }, [currentRoom?.hostId, socket?.id]);

  const isGameActive = React.useMemo(() => {
    return currentRoom?.isGameActive || false;
  }, [currentRoom?.isGameActive]);

  const currentPlayerId = React.useMemo(() => {
    return socket?.id || '';
  }, [socket?.id]);

  // 🎯 PHASE D.2.3: Removed playerPoints calculation - no longer needed after stats section removal

  // 🎯 PHASE C.3.3: Removed canShuffle calculation - shuffle functionality eliminated

  // 📊 DEPLOY 1: Monitoring dashboard state
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);

  // 📊 DEPLOY 1: Monitoring dashboard hotkey (Ctrl+Shift+M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        event.preventDefault();
        setShowMonitoringDashboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🟡 PHASE 3A: Memoized event handlers to prevent unnecessary re-renders
  // 🎯 PHASE C.3.3: Removed handleShuffle function - shuffle functionality eliminated

  const handleContinue = React.useCallback(() => {
    // Manual unpause fallback for host
    setGameState('match');
    notifications.info('Continuing to next round...', 2000);
  }, [setGameState]);

  const handleStartNewMatch = React.useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('match:start-new-match', { roomCode: currentRoom.roomCode });
    }
  }, [socket, currentRoom]);

  const handleReturnToMainMenu = React.useCallback(() => {
    // Clear all game state and return to main menu with fresh connection
    console.log('[App] Returning to main menu - resetting connection and state');
    
    // Clear all game states
    setGameState('menu');
    
    // Clear room and session data
    if (socket) {
      socket.emit('room:leave');
      socket.disconnect();
    }
    
    // Clear game context state
    setCurrentRoom(null);
    setMatchData(null);
    setRoundSummary(null);
    setMatchComplete(null);
    setRoundTimer(null);
    setLastWordResult(null);
    resetSinglePlayer(); // Clear single player state
    
    // Clear any cached board data
    (window as any).pendingGameBoard = null;
    (window as any).currentGameBoard = null;
    (window as any).pendingBoardChecksum = null;
    (window as any).currentBoardChecksum = null;
    
    // Clear localStorage game state
    localStorage.removeItem('wordRushGameState');
    localStorage.removeItem('wordRushRoomCode');
    
    // Show notification
    notifications.info('Returning to main menu...', 2000);
    
    // Let GameConnection handle the reconnection automatically
  }, [socket, setGameState, setCurrentRoom, setMatchData, setRoundSummary, setMatchComplete, setRoundTimer, setLastWordResult, resetSinglePlayer]);

  const handleReturnToLobby = React.useCallback(() => {
    setGameState('lobby');
    notifications.info('Returning to lobby...', 2000);
  }, [setGameState]);

  // 🟡 PHASE 3A: Render bailout conditions for unchanged states
  const shouldRenderPhaser = React.useMemo(() => {
    // Keep PhaserGame mounted during round transitions to prevent state loss
    // Only hide it when we're truly in menu, lobby, or countdown states
    return (gameState === 'match' || gameState === 'round-end') && currentRoom;
  }, [gameState, currentRoom]);

  const shouldRenderRoundEnd = React.useMemo(() => {
    return gameState === 'round-end' && roundSummary && currentRoom;
  }, [gameState, roundSummary, currentRoom]);

  const shouldRenderMatchEnd = React.useMemo(() => {
    return gameState === 'match-end' && matchComplete && currentRoom;
  }, [gameState, matchComplete, currentRoom]);

  // Debug logging for render optimization and key stability
  console.log(`[${new Date().toISOString()}] 🎯 AppContent render: gameState=${gameState}, phaserKey=${phaserGameKey}, sessionId=${playerSession?.id || 'none'}, roomCode=${currentRoom?.roomCode || 'none'}`);
  
  // Monitor key stability - warn if key changes during active gameplay
  React.useEffect(() => {
    if (gameState === 'match') {
      console.log(`[${new Date().toISOString()}] 🔑 Phaser key stable during match: ${phaserGameKey}`);
    }
  }, [phaserGameKey, gameState]);

  return (
    <div className="app">
      <GameConnection />
      
      {/* Route based on game state */}
      {gameState === 'menu' && <MainMenu />}
      
      {gameState === 'lobby' && <LobbyScreen />}
      
      {gameState === 'countdown' && <CountdownScreen />}
      
      {gameState === 'single-player-setup' && <SinglePlayerSetup />}
      
      {gameState === 'single-player' && (
        <>
          <header className="app-header">
            <h1>
              <span className="game-title">Word Rush</span>
              <span className="match-subtitle"> - Single Player</span>
            </h1>
            <div className="score-indicator">
              Score: {singlePlayerScore}
            </div>
          </header>

          <main className="app-main">
            <div className="game-container">
              <div className="ui-section">
                <GameHUD 
                  timer={{ timeRemaining: roundTimer?.timeRemaining || 0, currentRound: 1, totalRounds: 1 }} 
                  players={[{ id: currentPlayerId, username: 'You', score: singlePlayerScore, isConnected: true }]} 
                  currentPlayerId={currentPlayerId}
                  isGameActive={true}
                />
              </div>

              <div className="game-section">
                <PhaserGame 
                  key={`single-player-${Date.now()}`}
                  socket={socket || undefined}
                  gameState={gameState}
                />
              </div>
            </div>
          </main>
        </>
      )}
      
      {gameState === 'single-player-end' && <SinglePlayerEndScreen />}
      
      {shouldRenderPhaser && (
        <>
          <header className="app-header">
            <h1>
              <span className="game-title">Word Rush</span>
              <span className="match-subtitle"> - Multiplayer Match</span>
            </h1>
            <div className="room-indicator">
              Room: {currentRoom!.roomCode}
            </div>
          </header>

          <main className="app-main" style={{ display: gameState === 'round-end' ? 'none' : 'block' }}>
            <div className="game-container">
              <div className="ui-section">
                {/* 🎯 PHASE C.3.3: Removed shuffle props: canShuffle, shuffleCost, onShuffle */}
                {/* 🎯 PHASE D.2.3: Removed playerPoints prop - no longer needed after stats section removal */}
                <GameHUD 
                  timer={roundTimer || { timeRemaining: 0, currentRound: 1, totalRounds: currentRoom!.gameState?.totalRounds || 3 }}
                  players={currentRoom!.players}
                  currentPlayerId={currentPlayerId}
                  isGameActive={isGameActive}
                />
              </div>

              <div className="game-section">
                <PhaserGame 
                  key={phaserGameKey}
                  socket={socket || undefined}
                  gameState={gameState}
                />
              </div>
            </div>
          </main>
        </>
      )}

      {shouldRenderRoundEnd && (
        <RoundSummary
          roundSummary={roundSummary!}
          isHost={isHost}
          currentPlayerId={currentPlayerId}
          onContinue={handleContinue}
        />
      )}

      {shouldRenderMatchEnd && (
        <MatchComplete
          matchComplete={matchComplete!}
          isHost={isHost}
          currentPlayerId={currentPlayerId}
          onReturnToMainMenu={handleReturnToMainMenu}
        />
      )}

      {/* 📊 DEPLOY 1: Monitoring Dashboard (Ctrl+Shift+M to toggle) */}
      <MonitoringDashboard
        isVisible={showMonitoringDashboard}
        onClose={() => setShowMonitoringDashboard(false)}
      />
    </div>
  );
});

export default App;
