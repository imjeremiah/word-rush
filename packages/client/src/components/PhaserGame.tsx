/**
 * Word Rush Client - Phaser Game Component
 * React component that integrates Phaser 3 game engine for the core gameplay
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, GameBoard, LetterTile } from '@word-rush/common';

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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
let currentBoard: GameBoard | null = null;
let tileSprites: Phaser.GameObjects.Rectangle[][] = [];
let tileTexts: Phaser.GameObjects.Text[][] = [];
let loadingText: Phaser.GameObjects.Text | null = null;
let gameSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

// Word selection state
let isSelecting = false;
let selectedTiles: { row: number; col: number; tile: LetterTile }[] = [];
let currentWordText: Phaser.GameObjects.Text | null = null;

/**
 * Phaser preload function - loads game assets
 */
function preload(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  gameSocket = socket || null;
  
  // Show loading message
  loadingText = this.add.text(400, 300, 'Loading board...', {
    fontSize: '24px',
    color: '#ffffff',
  }).setOrigin(0.5);

  // Set up socket event listeners if socket is provided
  if (socket) {
    socket.on('game:initial-board', (data: { board: GameBoard }) => {
      currentBoard = data.board;
      console.log('Received initial board:', data.board);
      
      // Update the board display if the scene is ready
      if (this.scene.isActive()) {
        updateBoardDisplay.call(this);
      }
    });

    socket.on('game:board-update', (data: { board: GameBoard }) => {
      currentBoard = data.board;
      console.log('Received board update:', data.board);
      
      // Update the board display if the scene is ready
      if (this.scene.isActive()) {
        updateBoardDisplay.call(this);
      }
    });
  }
}

/**
 * Phaser create function - initializes the game scene
 */
function create(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  gameSocket = socket || null;
  
  // Clear the loading message
  if (loadingText) {
    loadingText.destroy();
    loadingText = null;
  }

  // Add title
  this.add
    .text(400, 50, 'Word Rush - MVP Game Board', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    })
    .setOrigin(0.5);

  // Add instructions
  this.add
    .text(
      400,
      520,
      'Drag over adjacent tiles to form words. Release to submit!',
      {
        fontSize: '16px',
        color: '#bdc3c7',
        align: 'center',
      }
    )
    .setOrigin(0.5);

  // Add current word display
  currentWordText = this.add
    .text(400, 450, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    })
    .setOrigin(0.5);

  // Initialize tile arrays
  tileSprites = [];
  tileTexts = [];

  // Render the board if we already have data
  if (currentBoard) {
    updateBoardDisplay.call(this);
  } else {
    // Request a board from the server if we don't have one
    if (socket) {
      socket.emit('game:request-board');
    }
  }
}

/**
 * Check if two tiles are adjacent (including diagonally)
 */
function areAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff) > 0;
}

/**
 * Check if a tile is already selected
 */
function isTileSelected(row: number, col: number): boolean {
  return selectedTiles.some(selected => selected.row === row && selected.col === col);
}

/**
 * Handle tile pointer down event
 */
function onTilePointerDown(row: number, col: number, tileData: LetterTile) {
  if (!currentBoard || isSelecting) return;

  isSelecting = true;
  selectedTiles = [{ row, col, tile: tileData }];
  
  // Highlight the selected tile
  if (tileSprites[row] && tileSprites[row][col]) {
    tileSprites[row][col].setFillStyle(0x3498db);
  }

  // Update word display
  updateWordDisplay();
}

/**
 * Handle tile pointer over event (for dragging)
 */
function onTilePointerOver(row: number, col: number, tileData: LetterTile) {
  if (!isSelecting || !currentBoard) return;

  // Check if this tile is adjacent to the last selected tile
  if (selectedTiles.length > 0) {
    const lastSelected = selectedTiles[selectedTiles.length - 1];
    
    // If it's the same tile, ignore
    if (lastSelected.row === row && lastSelected.col === col) {
      return;
    }

    // Check if we're going backwards (allow removing last tile)
    if (selectedTiles.length > 1) {
      const secondLast = selectedTiles[selectedTiles.length - 2];
      if (secondLast.row === row && secondLast.col === col) {
        // Remove the last tile (going backwards)
        const removedTile = selectedTiles.pop();
        if (removedTile && tileSprites[removedTile.row] && tileSprites[removedTile.row][removedTile.col]) {
          tileSprites[removedTile.row][removedTile.col].setFillStyle(0xecf0f1);
        }
        updateWordDisplay();
        return;
      }
    }

    // Check if adjacent and not already selected
    if (areAdjacent(lastSelected.row, lastSelected.col, row, col) && !isTileSelected(row, col)) {
      // Add this tile to selection
      selectedTiles.push({ row, col, tile: tileData });
      
      // Highlight the tile
      if (tileSprites[row] && tileSprites[row][col]) {
        tileSprites[row][col].setFillStyle(0x3498db);
      }

      // Update word display
      updateWordDisplay();
    }
  }
}

/**
 * Handle pointer up event (end selection)
 */
function onPointerUp() {
  if (!isSelecting || selectedTiles.length === 0) return;

  const word = selectedTiles.map(selected => selected.tile.letter).join('');
  
  // Submit word if it's at least 2 letters
  if (word.length >= 2 && gameSocket) {
    gameSocket.emit('word:submit', {
      word,
      tiles: selectedTiles.map(selected => selected.tile),
    });
  }

  // Reset selection
  clearSelection();
}

/**
 * Clear the current selection
 */
function clearSelection() {
  // Reset tile colors
  selectedTiles.forEach(selected => {
    if (tileSprites[selected.row] && tileSprites[selected.row][selected.col]) {
      tileSprites[selected.row][selected.col].setFillStyle(0xecf0f1);
    }
  });

  // Reset state
  isSelecting = false;
  selectedTiles = [];
  updateWordDisplay();
}

/**
 * Update the word display
 */
function updateWordDisplay() {
  if (!currentWordText) return;

  if (selectedTiles.length > 0) {
    const word = selectedTiles.map(selected => selected.tile.letter).join('');
    const points = selectedTiles.reduce((sum, selected) => sum + selected.tile.points, 0);
    currentWordText.setText(`${word} (${points} points)`);
  } else {
    currentWordText.setText('');
  }
}

/**
 * Update the board display with current board data
 */
function updateBoardDisplay(this: Phaser.Scene) {
  if (!currentBoard) return;

  // Clear existing tiles
  tileSprites.forEach(row => row.forEach(tile => tile.destroy()));
  tileTexts.forEach(row => row.forEach(text => text.destroy()));
  tileSprites = [];
  tileTexts = [];

  const tileSize = 80;
  const boardWidth = currentBoard.width;
  const boardHeight = currentBoard.height;
  const gridStartX = 400 - (boardWidth * tileSize) / 2;
  const gridStartY = 150;

  // Create grid background
  this.add.rectangle(
    400,
    gridStartY + (boardHeight * tileSize) / 2,
    boardWidth * tileSize + 20,
    boardHeight * tileSize + 20,
    0x34495e
  );

  // Create letter tiles from server data
  for (let row = 0; row < boardHeight; row++) {
    tileSprites[row] = [];
    tileTexts[row] = [];
    
    for (let col = 0; col < boardWidth; col++) {
      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;
      const tileData = currentBoard.tiles[row][col];

      // Create tile background
      const tile = this.add.rectangle(
        x,
        y,
        tileSize - 4,
        tileSize - 4,
        0xecf0f1
      );
      tile.setInteractive();
      tileSprites[row][col] = tile;

      // Add letter and point value
      const letterText = this.add
        .text(x, y - 8, tileData.letter, {
          fontSize: '32px',
          color: '#2c3e50',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner
      this.add
        .text(x + 25, y + 20, tileData.points.toString(), {
          fontSize: '12px',
          color: '#7f8c8d',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      tileTexts[row][col] = letterText;

      // Add hover effect (when not selecting)
      tile.on('pointerover', () => {
        if (!isSelecting) {
          tile.setFillStyle(0xbdc3c7);
        } else {
          onTilePointerOver(row, col, tileData);
        }
      });

      tile.on('pointerout', () => {
        if (!isSelecting && !isTileSelected(row, col)) {
          tile.setFillStyle(0xecf0f1);
        }
      });

      // Add pointer down event
      tile.on('pointerdown', () => {
        onTilePointerDown(row, col, tileData);
      });

      // Store tile data for word selection
      tile.setData('tileData', tileData);
      tile.setData('row', row);
      tile.setData('col', col);
    }
  }

  // Set up global pointer up event
  this.input.on('pointerup', onPointerUp);

  console.log('Board display updated with', boardWidth, 'x', boardHeight, 'tiles');
}

/**
 * Phaser update function - called every frame
 */
function update(this: Phaser.Scene) {
  // Game loop logic will be added here in future phases
}

export default PhaserGame;

