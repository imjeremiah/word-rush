/**
 * Word Rush Client - Phaser Game Component
 * React component that integrates Phaser 3 game engine for the core gameplay
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import WebFont from 'webfontloader';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  GameBoard,
  LetterTile,
  FONTS 
} from '@word-rush/common';
import { 
  BoardRenderingState, 
  updateBoardDisplay as updateBoardDisplayModule
} from './board-rendering.js';
import { 
  InteractionState, 
  setupTileInteraction,
  initializeGlobalPointerEvents
} from './interactions.js';
import { 
  LayoutState, 
  createGameLayout,
  initializeResizeHandler
} from './layout.js';

interface PhaserGameProps {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ socket }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Phaser game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current || undefined,
      backgroundColor: '#2c3e50',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 320,
          height: 240
        },
        max: {
          width: 1920,
          height: 1080
        }
      },
      scene: {
        preload: function(this: Phaser.Scene) {
          preload.call(this, socket);
        },
        create: function(this: Phaser.Scene) {
          create.call(this, socket);
        },
        update: function(this: Phaser.Scene) {
          update.call(this);
        },
      },
    };

    // Create the Phaser game instance
    gameRef.current = new Phaser.Game(config);

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [socket]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

// Game state variables
const boardState: BoardRenderingState = {
  currentBoard: null,
  tileSprites: [],
  tileTexts: []
};

const interactionState: InteractionState = {
  isSelecting: false,
  selectedTiles: [],
  currentWordText: null,
  gameSocket: null
};

const layoutState: LayoutState = {
  titleText: null,
  instructionText: null
};

let loadingText: Phaser.GameObjects.Text | null = null;

/**
 * Phaser preload function - loads game assets
 * @param socket - Optional Socket.io connection
 */
function preload(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  interactionState.gameSocket = socket || null;
  
  // Show loading message
  loadingText = this.add.text(400, 300, 'Loading fonts and board...', {
    fontSize: '24px',
    color: '#ffffff',
  }).setOrigin(0.5);

  // Load Google Fonts
  WebFont.load({
    google: {
      families: [`${FONTS.heading}:400,600,700`, `${FONTS.body}:400,600,700`]
    },
    active: () => {
      console.log('Fonts loaded successfully');
      // Update loading text to indicate fonts are ready
      if (loadingText) {
        loadingText.setText('Fonts loaded! Waiting for game data...');
      }
    },
    inactive: () => {
      console.warn('Font loading failed, using fallback fonts');
    }
  });

  // Set up socket event listeners if socket is provided
  if (socket) {
    socket.on('game:initial-board', (data: { board: GameBoard }) => {
      boardState.currentBoard = data.board;
      console.log('Received initial board:', data.board);
      
      // Update the board display if the scene is ready
      if (this.scene.isActive()) {
        updateBoardDisplayWrapper.call(this);
      }
    });

    socket.on('game:board-update', (data: { board: GameBoard }) => {
      boardState.currentBoard = data.board;
      console.log('Received board update:', data.board);
      
      // Update the board display if the scene is ready
      if (this.scene.isActive()) {
        updateBoardDisplayWrapper.call(this);
      }
    });
  }
}

/**
 * Phaser create function - initializes the game scene
 * @param socket - Optional Socket.io connection
 */
function create(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  interactionState.gameSocket = socket || null;
  
  // Clear the loading message
  if (loadingText) {
    loadingText.destroy();
    loadingText = null;
  }

  // Initialize tile arrays
  boardState.tileSprites = [];
  boardState.tileTexts = [];

  // Create initial layout
  createGameLayout(this, layoutState, interactionState);

  // Initialize resize handler
  initializeResizeHandler(this, layoutState, interactionState, boardState, updateBoardDisplayWrapper.bind(this));

  // Initialize global pointer events
  initializeGlobalPointerEvents(this, boardState, interactionState);

  // Render the board if we already have data
  if (boardState.currentBoard) {
    updateBoardDisplayWrapper.call(this);
  } else {
    // Request a board from the server if we don't have one
    if (socket) {
      socket.emit('game:request-board');
    }
  }
}

/**
 * Wrapper function for updateBoardDisplay to provide tile interaction setup
 */
function updateBoardDisplayWrapper(this: Phaser.Scene) {
  const setupTileInteractionWrapper = (
    tile: Phaser.GameObjects.Rectangle,
    row: number,
    col: number,
    tileData: LetterTile
  ) => {
    setupTileInteraction(tile, row, col, tileData, boardState, interactionState);
  };

  updateBoardDisplayModule(this, boardState, setupTileInteractionWrapper);
}

/**
 * Phaser update function - called every frame
 */
function update(this: Phaser.Scene) {
  // Game loop logic will be added here in future phases
}

export default PhaserGame;

