/**
 * Word Rush Client - Main App Component
 * Provides game context and manages the overall application layout
 */

import React from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import GameConnection from './components/GameConnection';
import { GameHUD } from './components/GameHUD';
import GameControls from './components/GameControls';
import PhaserGame from './components/PhaserGame';
import MainMenu from './components/MainMenu';
import LobbyScreen from './components/LobbyScreen';
import { RoundSummary } from './components/RoundSummary';
import { MatchComplete } from './components/MatchComplete';
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
    roundSummary, 
    matchComplete, 
    roundTimer,
    playerSession 
  } = useGameContext();

  // Component key stability - ensure PhaserGame component doesn't remount during round transitions
  const phaserGameKey = React.useMemo(() => {
    // Use room code + session start time for stability across rounds
    const roomIdentifier = currentRoom?.roomCode || 'no-room';
    const sessionIdentifier = playerSession?.id || 'no-session';
    return `phaser-${roomIdentifier}-${sessionIdentifier}`;
  }, [currentRoom?.roomCode, playerSession?.id]);

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

  const playerPoints = React.useMemo(() => {
    return playerSession?.score || 0;
  }, [playerSession?.score]);

  const canShuffle = React.useMemo(() => {
    return playerPoints >= 5;
  }, [playerPoints]);

  // 🟡 PHASE 3A: Memoized event handlers to prevent unnecessary re-renders
  const handleShuffle = React.useCallback(() => {
    if (socket) {
      socket.emit('game:shuffle-request');
    }
  }, [socket]);

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

  const handleReturnToLobby = React.useCallback(() => {
    setGameState('lobby');
    notifications.info('Returning to lobby...', 2000);
  }, [setGameState]);

  // 🟡 PHASE 3A: Render bailout conditions for unchanged states
  const shouldRenderPhaser = React.useMemo(() => {
    return gameState === 'match' && roundTimer && currentRoom;
  }, [gameState, roundTimer, currentRoom]);

  const shouldRenderRoundEnd = React.useMemo(() => {
    return gameState === 'round-end' && roundSummary && currentRoom;
  }, [gameState, roundSummary, currentRoom]);

  const shouldRenderMatchEnd = React.useMemo(() => {
    return gameState === 'match-end' && matchComplete && currentRoom;
  }, [gameState, matchComplete, currentRoom]);

  // Debug logging for render optimization
  console.log(`[${new Date().toISOString()}] 🎯 AppContent render: gameState=${gameState}, phaserKey=${phaserGameKey}, optimized=true`);

  return (
    <div className="app">
      <GameConnection />
      
      {/* Route based on game state */}
      {gameState === 'menu' && <MainMenu />}
      
      {gameState === 'lobby' && <LobbyScreen />}
      
      {shouldRenderPhaser && (
        <>
          <header className="app-header">
            <h1>Word Rush - Multiplayer Match</h1>
            <div className="room-indicator">
              Room: {currentRoom!.roomCode}
            </div>
          </header>

          <main className="app-main">
            <div className="game-container">
              <div className="ui-section">
                <GameHUD 
                  timer={roundTimer!}
                  players={currentRoom!.players}
                  currentPlayerId={currentPlayerId}
                  canShuffle={canShuffle}
                  playerPoints={playerPoints}
                  shuffleCost={5}
                  onShuffle={handleShuffle}
                  isGameActive={isGameActive}
                />
                <GameControls />
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
          onStartNewMatch={handleStartNewMatch}
          onReturnToLobby={handleReturnToLobby}
        />
      )}
    </div>
  );
});

export default App;
