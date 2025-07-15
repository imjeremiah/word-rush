/**
 * Board Rendering Module
 * Handles board display, tile creation, animations, and visual updates
 */

import Phaser from 'phaser';
import { GameBoard, LetterTile, COLORS, FONTS } from '@word-rush/common';

// Types for board rendering state
export interface BoardRenderingState {
  currentBoard: GameBoard | null;
  tileSprites: Phaser.GameObjects.Rectangle[][];
  tileTexts: Phaser.GameObjects.Text[][];
}

/**
 * Update the board display with current board data
 * @param scene - The Phaser scene
 * @param state - The board rendering state
 * @param setupTileInteraction - Callback to setup tile interactions
 */
export function updateBoardDisplay(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (!state.currentBoard) return;

  // Check if this is an initial board setup or an update
  const isInitialSetup = state.tileSprites.length === 0;

  // If not initial setup, animate out old tiles
  if (!isInitialSetup) {
    animateBoardUpdate(scene, state, setupTileInteraction);
    return;
  }

  // Clear existing tiles
  state.tileSprites.forEach(row => row.forEach(tile => tile?.destroy()));
  state.tileTexts.forEach(row => row.forEach(text => text?.destroy()));
  state.tileSprites = [];
  state.tileTexts = [];

  const { width, height } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;
  
  // Calculate responsive tile size
  const maxBoardWidth = width * 0.8;
  const maxBoardHeight = height * 0.6;
  const tileSize = Math.min(
    Math.floor(maxBoardWidth / boardWidth),
    Math.floor(maxBoardHeight / boardHeight),
    80 // Maximum tile size
  );
  
  const gridStartX = width / 2 - (boardWidth * tileSize) / 2;
  const gridStartY = height / 2 - (boardHeight * tileSize) / 2;

  createBoardTiles(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction);
}

/**
 * Animate board update with falling tiles
 * @param scene - The Phaser scene
 * @param state - The board rendering state
 * @param setupTileInteraction - Callback to setup tile interactions
 */
function animateBoardUpdate(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (!state.currentBoard) return;

  const { width, height } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;
  
  // Calculate responsive tile size
  const maxBoardWidth = width * 0.8;
  const maxBoardHeight = height * 0.6;
  const tileSize = Math.min(
    Math.floor(maxBoardWidth / boardWidth),
    Math.floor(maxBoardHeight / boardHeight),
    80
  );
  
  const gridStartX = width / 2 - (boardWidth * tileSize) / 2;
  const gridStartY = height / 2 - (boardHeight * tileSize) / 2;

  // Animate tiles falling off the screen
  const animationPromises: Promise<void>[] = [];
  
  for (let row = 0; row < state.tileSprites.length; row++) {
    for (let col = 0; col < state.tileSprites[row].length; col++) {
      const tile = state.tileSprites[row][col];
      const text = state.tileTexts[row][col];
      
      if (tile) {
        const promise = new Promise<void>((resolve) => {
          scene.tweens.add({
            targets: [tile, text],
            y: height + 100,
            alpha: 0,
            duration: 300,
            ease: 'Cubic.easeIn',
            delay: (row * 50) + (col * 25), // Stagger the animation
            onComplete: () => {
              tile.destroy();
              if (text) text.destroy();
              resolve();
            }
          });
        });
        animationPromises.push(promise);
      }
    }
  }

  // After all old tiles are gone, create new tiles with falling animation
  Promise.all(animationPromises).then(() => {
    createNewBoardWithAnimation(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction);
  });
}

/**
 * Create new board with tiles falling from the top
 * @param scene - The Phaser scene
 * @param state - The board rendering state
 * @param gridStartX - X position to start the grid
 * @param gridStartY - Y position to start the grid
 * @param tileSize - Size of each tile
 * @param setupTileInteraction - Callback to setup tile interactions
 */
function createNewBoardWithAnimation(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  gridStartX: number,
  gridStartY: number,
  tileSize: number,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (!state.currentBoard) return;

  const { width } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;

  // Clear arrays
  state.tileSprites = [];
  state.tileTexts = [];

  // Create grid background
  scene.add.rectangle(
    width / 2,
    gridStartY + (boardHeight * tileSize) / 2,
    boardWidth * tileSize + 20,
    boardHeight * tileSize + 20,
    0x34495e
  );

  // Create new tiles starting from above the screen
  for (let row = 0; row < boardHeight; row++) {
    state.tileSprites[row] = [];
    state.tileTexts[row] = [];
    
    for (let col = 0; col < boardWidth; col++) {
      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;
      const startY = -100 - (row * tileSize); // Start above screen
      const tileData = state.currentBoard.tiles[row][col];

      // Calculate responsive text sizes
      const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
      const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));

      // Create tile background using theme colors
      const tile = scene.add.rectangle(
        x,
        startY,
        tileSize - 4,
        tileSize - 4,
        parseInt(COLORS.tileBackground.replace('#', ''), 16)
      );
      tile.setStrokeStyle(2, parseInt(COLORS.border.replace('#', ''), 16));
      tile.setInteractive();
      state.tileSprites[row][col] = tile;

      // Add letter text
      const letterText = scene.add
        .text(x, startY - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: COLORS.tileText,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner
      const pointText = scene.add
        .text(x + tileSize * 0.3, startY + tileSize * 0.25, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: COLORS.textSubtle,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      state.tileTexts[row][col] = letterText;

      // Animate tiles falling into place
      scene.tweens.add({
        targets: [tile, letterText, pointText],
        y: [startY, y, y - 4, y + tileSize * 0.25], // Different final positions for different elements
        duration: 300 + (row * 50),
        ease: 'Bounce.easeOut',
        delay: col * 50, // Stagger columns
      });

      // Add hover effects and interactions
      setupTileInteraction(tile, row, col, tileData);
    }
  }

  console.log('Board display updated with animation', boardWidth, 'x', boardHeight, 'tiles');
}

/**
 * Create board tiles without animation for initial setup
 * @param scene - The Phaser scene
 * @param state - The board rendering state
 * @param gridStartX - X position to start the grid
 * @param gridStartY - Y position to start the grid
 * @param tileSize - Size of each tile
 * @param setupTileInteraction - Callback to setup tile interactions
 */
function createBoardTiles(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  gridStartX: number,
  gridStartY: number,
  tileSize: number,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (!state.currentBoard) return;

  const { width } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;

  // Create grid background
  scene.add.rectangle(
    width / 2,
    gridStartY + (boardHeight * tileSize) / 2,
    boardWidth * tileSize + 20,
    boardHeight * tileSize + 20,
    0x34495e
  );

  // Create letter tiles from server data
  for (let row = 0; row < boardHeight; row++) {
    state.tileSprites[row] = [];
    state.tileTexts[row] = [];
    
    for (let col = 0; col < boardWidth; col++) {
      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;
      const tileData = state.currentBoard.tiles[row][col];

      // Create tile background using theme colors
      const tile = scene.add.rectangle(
        x,
        y,
        tileSize - 4,
        tileSize - 4,
        parseInt(COLORS.tileBackground.replace('#', ''), 16)
      );
      tile.setStrokeStyle(2, parseInt(COLORS.border.replace('#', ''), 16));
      tile.setInteractive();
      state.tileSprites[row][col] = tile;

      // Add letter and point value
      const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
      const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));
      
      const letterText = scene.add
        .text(x, y - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: COLORS.tileText,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner
      scene.add
        .text(x + tileSize * 0.3, y + tileSize * 0.25, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: COLORS.textSubtle,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      state.tileTexts[row][col] = letterText;

      // Add hover effects and interactions
      setupTileInteraction(tile, row, col, tileData);
    }
  }

  console.log('Board display updated with', boardWidth, 'x', boardHeight, 'tiles');
} 