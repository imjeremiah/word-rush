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
 * App Content component that uses game context with enhanced stability
 * Routes between different screens based on game state with component key stability
 * @returns JSX element with the appropriate screen for current game state
 */
function AppContent(): JSX.Element {
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

  console.log(`[${new Date().toISOString()}] 🎯 AppContent render: gameState=${gameState}, phaserKey=${phaserGameKey}`);

  return (
    <div className="app">
      <GameConnection />
      
      {/* Route based on game state */}
      {gameState === 'menu' && <MainMenu />}
      
      {gameState === 'lobby' && <LobbyScreen />}
      
      {gameState === 'match' && roundTimer && currentRoom && (
        <>
          <header className="app-header">
            <h1>Word Rush - Multiplayer Match</h1>
            <div className="room-indicator">
              Room: {currentRoom.roomCode}
            </div>
          </header>

          <main className="app-main">
            <div className="game-container">
              <div className="ui-section">
                <GameHUD 
                  timer={roundTimer}
                  players={currentRoom.players}
                  currentPlayerId={socket?.id || ''}
                  canShuffle={(playerSession?.score || 0) >= 5}
                  playerPoints={playerSession?.score || 0}
                  shuffleCost={5}
                  onShuffle={() => {
                    if (socket) {
                      socket.emit('game:shuffle-request');
                    }
                  }}
                  isGameActive={currentRoom.isGameActive || false}
                />
                <GameControls />
              </div>

              <div className="game-section">
                <PhaserGame 
                  key={phaserGameKey}
                  socket={socket || undefined} 
                />
              </div>
            </div>
          </main>
        </>
      )}

      {gameState === 'round-end' && roundSummary && currentRoom && (
        <RoundSummary
          roundSummary={roundSummary}
          isHost={currentRoom.hostId === socket?.id}
          currentPlayerId={socket?.id || ''}
          onContinue={() => {
            // Manual unpause fallback for host
            setGameState('match');
            notifications.info('Continuing to next round...', 2000);
          }}
        />
      )}

      {gameState === 'match-end' && matchComplete && currentRoom && (
        <MatchComplete
          matchComplete={matchComplete}
          isHost={currentRoom.hostId === socket?.id}
          currentPlayerId={socket?.id || ''}
          onStartNewMatch={() => {
            if (socket) {
              socket.emit('match:start-new-match', { roomCode: currentRoom.roomCode });
            }
          }}
          onReturnToLobby={() => {
            setGameState('lobby');
            notifications.info('Returning to lobby...', 2000);
          }}
        />
      )}
    </div>
  );
}

export default App;
