/**
 * Word Rush Client - Main App Component
 * Provides game context and manages the overall application layout
 */

import React from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import GameConnection from './components/GameConnection';
import GameHUD from './components/GameHUD';
import GameControls from './components/GameControls';
import PhaserGame from './components/PhaserGame';
import './App.css';

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
 * App Content component that uses game context
 * Contains the main application layout and components
 * @returns JSX element with the main app structure
 */
function AppContent(): JSX.Element {
  const { socket } = useGameContext();

  return (
    <div className="app">
      <GameConnection />
      
      <header className="app-header">
        <h1>Word Rush - MVP</h1>
      </header>

      <main className="app-main">
        <div className="game-container">
          <div className="ui-section">
            <GameHUD />
            <GameControls />
          </div>

          <div className="game-section">
            <PhaserGame socket={socket || undefined} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
