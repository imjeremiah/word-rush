/**
 * Board Rendering Module
 * Handles board display, tile creation, animations, and visual updates
 */

import Phaser from 'phaser';
import { 
  GameBoard, 
  LetterTile, 
  COLORS, 
  FONTS, 
  TileChanges,
  TILE_COLORS,
  BACKGROUNDS,
  TEXT_COLORS,
  PARTICLE_COLORS,
  getTileColorByPoints
} from '@word-rush/common';

// Types for board rendering state
export interface BoardRenderingState {
  currentBoard: GameBoard | null;
  tileSprites: Phaser.GameObjects.Rectangle[][];
  tileTexts: Phaser.GameObjects.Text[][];
}

/**
 * Update the board display with current board data
 * Main board rendering function that manages the complete visual update pipeline:
 * 1. Determines if this is initial setup or board update based on existing sprites
 * 2. For updates: triggers animated transition with tiles falling off screen
 * 3. For initial setup: creates static board with immediate positioning
 * 4. Calculates responsive tile sizing based on screen dimensions
 * 5. Applies theme colors and typography from common design system
 * 6. Sets up tile interaction handlers for mouse/touch events
 * @param scene - The active Phaser scene where board rendering occurs
 * @param state - Board rendering state containing current board data and sprite references
 * @param state.currentBoard - Game board data received from server with tile positions and letters
 * @param state.tileSprites - 2D array of Phaser Rectangle objects representing tile backgrounds
 * @param state.tileTexts - 2D array of Phaser Text objects for letter display
 * @param setupTileInteraction - Callback function to configure interaction events for each tile
 * @param removedTiles - Optional array of tile positions that were removed (for cascade animations)
 * @returns void - Updates visual elements directly in the Phaser scene
 */
export function updateBoardDisplay(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void,
  removedTiles?: { x: number; y: number }[]
): void {
  if (!state.currentBoard) return;

  // Check if this is an initial board setup or an update
  const isInitialSetup = state.tileSprites.length === 0;

  // If not initial setup, handle dynamic update with animations (legacy board updates)
  if (!isInitialSetup && removedTiles) {
    // Legacy board update with full regeneration (for shuffles, etc.)
    animateBoardUpdate(scene, state, setupTileInteraction);
    return;
  }

  // Clear existing tiles for initial setup
  if (isInitialSetup) {
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
}

/**
 * Process incremental tile changes with individual animations
 * Handles the new tile changes event from the server with proper cascading animations
 * @param scene - The Phaser scene for animation
 * @param state - Board rendering state 
 * @param tileChanges - Incremental changes to apply
 * @param setupTileInteraction - Callback to setup tile interactions
 * @returns Promise that resolves when all animations complete
 */
export function processTileChanges(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  tileChanges: TileChanges,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): Promise<void> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Starting tile change animation (seq: ${tileChanges.sequenceNumber}):`, {
      removed: tileChanges.removedPositions.length,
      falling: tileChanges.fallingTiles.length,
      new: tileChanges.newTiles.length,
      latency: startTime - tileChanges.timestamp
    });

    // Calculate layout parameters
    const { width, height } = scene.scale.gameSize;
    const boardWidth = state.currentBoard?.width || 4;
    const boardHeight = state.currentBoard?.height || 4;
    
    const maxBoardWidth = width * 0.8;
    const maxBoardHeight = height * 0.6;
    const tileSize = Math.min(
      Math.floor(maxBoardWidth / boardWidth),
      Math.floor(maxBoardHeight / boardHeight),
      80
    );
    
    const gridStartX = width / 2 - (boardWidth * tileSize) / 2;
    const gridStartY = height / 2 - (boardHeight * tileSize) / 2;

    // Chain animations: removal → falling → new tiles
    const removalStartTime = Date.now();
    animateTileRemoval(scene, state, tileChanges.removedPositions)
      .then(() => {
        const removalEndTime = Date.now();
        console.log(`[${new Date().toISOString()}] Tile removal completed in ${removalEndTime - removalStartTime}ms`);
        
        const fallingStartTime = Date.now();
        return animateTileFalling(scene, state, tileChanges.fallingTiles, gridStartX, gridStartY, tileSize)
          .then(() => {
            const fallingEndTime = Date.now();
            console.log(`[${new Date().toISOString()}] Tile falling completed in ${fallingEndTime - fallingStartTime}ms`);
            
            const newTileStartTime = Date.now();
            return animateNewTileAppearance(scene, state, tileChanges.newTiles, gridStartX, gridStartY, tileSize, setupTileInteraction)
              .then(() => {
                const newTileEndTime = Date.now();
                const totalTime = newTileEndTime - startTime;
                console.log(`[${new Date().toISOString()}] New tile appearance completed in ${newTileEndTime - newTileStartTime}ms`);
                console.log(`[${new Date().toISOString()}] Total tile change animation completed in ${totalTime}ms (seq: ${tileChanges.sequenceNumber})`);
                
                // Check if we're maintaining 60fps target with optimized animations
                if (totalTime > 400) {
                  console.warn(`[${new Date().toISOString()}] Slow tile animation detected: ${totalTime}ms (target: <400ms)`);
                } else {
                  console.log(`[${new Date().toISOString()}] ✅ Animation performance target met: ${totalTime}ms`);
                }
                
                // Rebind all tile events after cascade completes
                rebindTileEventsAfterCascade(scene, state, setupTileInteraction);
                
                resolve();
              });
          });
      })
      .catch((error) => {
        console.error('Error processing tile changes:', error);
        resolve(); // Continue even if animations fail
      });
  });
}

/**
 * Rebind tile events after cascade animations complete
 * Ensures all tiles have proper interactions and adjacency is validated
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback to setup tile interactions
 */
function rebindTileEventsAfterCascade(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  console.log(`[${new Date().toISOString()}] 🔄 Rebinding tile events after cascade...`);
  
  if (!state.currentBoard) {
    console.warn('No current board to rebind events for');
    return;
  }

  let reboundCount = 0;
  
  // Iterate through all tiles and ensure they have proper interactions
  for (let row = 0; row < state.currentBoard.height; row++) {
    for (let col = 0; col < state.currentBoard.width; col++) {
      const tileSprite = state.tileSprites[row]?.[col];
      const logicalTile = state.currentBoard.tiles[row]?.[col];
      
      if (tileSprite && logicalTile) {
        // Ensure tile is interactive
        if (!tileSprite.input) {
          tileSprite.setInteractive();
        }
        
        // Rebind interactions
        setupTileInteraction(tileSprite, row, col, logicalTile);
        reboundCount++;
      }
    }
  }
  
  console.log(`[${new Date().toISOString()}] ✅ Rebound ${reboundCount} tile interactions`);
  
  // Validate adjacency mapping after cascade
  validateAdjacencyPostCascade(state);
}

/**
 * Validate and rebuild adjacency relationships after cascade
 * Ensures tile selection and path validation work correctly with new positions
 * @param state - Board rendering state
 */
function validateAdjacencyPostCascade(state: BoardRenderingState): void {
  if (!state.currentBoard) return;
  
  console.log(`[${new Date().toISOString()}] 🔍 Validating adjacency after cascade...`);
  
  const { width, height } = state.currentBoard;
  const adjacencyMap = new Map<string, Array<{ x: number; y: number }>>();
  
  // Rebuild adjacency map for all tiles
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const tile = state.currentBoard.tiles[row][col];
      if (tile) {
        const neighbors: Array<{ x: number; y: number }> = [];
        
        // Check all 8 directions for adjacent tiles
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (const [deltaRow, deltaCol] of directions) {
          const newRow = row + deltaRow;
          const newCol = col + deltaCol;
          
          if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
            const neighborTile = state.currentBoard.tiles[newRow][newCol];
            if (neighborTile) {
              neighbors.push({ x: newCol, y: newRow });
            }
          }
        }
        
        adjacencyMap.set(`${col}-${row}`, neighbors);
      }
    }
  }
  
  console.log(`[${new Date().toISOString()}] ✅ Adjacency validated for ${adjacencyMap.size} tiles`);
  
  // Store adjacency map for later use in selection validation
  (state as any).adjacencyMap = adjacencyMap;
}

/**
 * Animate removal of specific tiles
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param positions - Positions of tiles to remove
 * @returns Promise that resolves when removal animations complete
 */
function animateTileRemoval(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  positions: { x: number; y: number }[]
): Promise<void> {
  return new Promise((resolve) => {
    if (positions.length === 0) {
      resolve();
      return;
    }

    const removalPromises: Promise<void>[] = [];

    for (const { x, y } of positions) {
      const tileSprite = state.tileSprites[y]?.[x];
      const tileText = state.tileTexts[y]?.[x];
      
      if (tileSprite && tileText) {
        const removalPromise = new Promise<void>((animResolve) => {
          // Create premium particle effect for tile removal
          const particles = createTileRemovalEffect(scene, tileSprite.x, tileSprite.y, selected.tile.points);

          // Animate tile disappearing
          scene.tweens.add({
            targets: [tileSprite, tileText],
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 120, // Further optimized for 60fps target
            ease: 'Cubic.easeIn', // Smoother than Back.easeIn for performance
            onComplete: () => {
              // Cleanup immediately
              tileSprite.destroy();
              tileText.destroy();
              
              // particles will auto-destroy via setTimeout in createTileRemovalEffect
              
              // Clear from state arrays
              state.tileSprites[y][x] = null as any;
              state.tileTexts[y][x] = null as any;
              
              animResolve();
            }
          });
        });
        
        removalPromises.push(removalPromise);
      }
    }

    Promise.all(removalPromises).then(() => resolve());
  });
}

/**
 * Animate tiles falling to new positions
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param movements - Array of tile movements from->to
 * @param gridStartX - Grid starting X position
 * @param gridStartY - Grid starting Y position
 * @param tileSize - Size of each tile
 * @returns Promise that resolves when falling animations complete
 */
function animateTileFalling(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  movements: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; letter: string; points: number; id: string }>,
  gridStartX: number,
  gridStartY: number,
  tileSize: number
): Promise<void> {
  return new Promise((resolve) => {
    if (movements.length === 0) {
      resolve();
      return;
    }

    const fallingPromises: Promise<void>[] = [];

    for (const movement of movements) {
      const { from, to } = movement;
      const tileSprite = state.tileSprites[from.y]?.[from.x];
      const tileText = state.tileTexts[from.y]?.[from.x];
      
      if (tileSprite && tileText) {
        const fallingPromise = new Promise<void>((animResolve) => {
          const newX = gridStartX + to.x * tileSize + tileSize / 2;
          const newY = gridStartY + to.y * tileSize + tileSize / 2;
          
          // Create cascade trail effect for falling tiles
          createCascadeTrailEffect(scene, tileSprite.x, tileSprite.y, newX, newY);
          
          // Animate tile falling to new position - optimized duration and easing
          scene.tweens.add({
            targets: [tileSprite, tileText],
            x: newX,
            y: newY,
            duration: 180, // Further optimized for faster cascade
            ease: 'Cubic.easeOut', // Optimized for smooth 60fps performance
            delay: from.x * 20, // Further reduced stagger for faster completion
            onComplete: () => {
              // Update state arrays efficiently
              state.tileSprites[to.y][to.x] = tileSprite;
              state.tileTexts[to.y][to.x] = tileText;
              
              // Clear old position only if different
              if (from.y !== to.y || from.x !== to.x) {
                state.tileSprites[from.y][from.x] = null as any;
                state.tileTexts[from.y][from.x] = null as any;
              }
              
              animResolve();
            }
          });
        });
        
        fallingPromises.push(fallingPromise);
      }
    }

    Promise.all(fallingPromises).then(() => resolve());
  });
}

/**
 * Animate new tiles appearing from the top
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param newTiles - Array of new tiles to create
 * @param gridStartX - Grid starting X position
 * @param gridStartY - Grid starting Y position
 * @param tileSize - Size of each tile
 * @param setupTileInteraction - Callback to setup interactions
 * @returns Promise that resolves when new tile animations complete
 */
function animateNewTileAppearance(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  newTiles: Array<{ position: { x: number; y: number }; letter: string; points: number; id: string }>,
  gridStartX: number,
  gridStartY: number,
  tileSize: number,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (newTiles.length === 0) {
      resolve();
      return;
    }

    const appearancePromises: Promise<void>[] = [];

    for (const newTileData of newTiles) {
      const { position, letter, points, id } = newTileData;
      const appearancePromise = new Promise<void>((animResolve) => {
        const x = gridStartX + position.x * tileSize + tileSize / 2;
        const finalY = gridStartY + position.y * tileSize + tileSize / 2;
        const startY = finalY - tileSize * 1.5; // Reduced fall distance for speed

        // Calculate responsive text sizes
        const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
        const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));

        // Get premium color based on Scrabble point value
        const tileColor = getTileColorByPoints(points);

        // Create tile background with premium point-based coloring
        const tile = scene.add.rectangle(
          x,
          startY,
          tileSize - 6, // Consistent with createBoardTiles spacing
          tileSize - 6,
          parseInt(tileColor.replace('#', ''), 16)
        );
        tile.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));
        tile.setInteractive();

        // Add subtle depth shadow effect
        const shadowTile = scene.add.rectangle(
          x + 2, startY + 2,
          tileSize - 6, tileSize - 6,
          0x000000
        );
        shadowTile.setAlpha(0.2);
        shadowTile.setDepth(-1);

        // Create letter text with premium colors
        const letterText = scene.add
          .text(x, startY - 4, letter, {
            fontSize: letterSize + 'px',
            color: TEXT_COLORS.tileLetters,
            fontFamily: FONTS.body,
            fontStyle: 'bold',
          })
          .setOrigin(0.5);
        
        // Create point value text with premium electric blue
        const pointText = scene.add
          .text(x + tileSize * 0.3, startY + tileSize * 0.25, points.toString(), {
            fontSize: pointSize + 'px',
            color: TEXT_COLORS.playerScores,
            fontFamily: FONTS.body,
            fontStyle: 'bold',
          })
          .setOrigin(0.5);

        // Animate tile falling into place - optimized for performance
        scene.tweens.add({
          targets: [tile, letterText, pointText],
          y: [startY, finalY, finalY - 4, finalY + tileSize * 0.25], // Different targets for different elements
          duration: 250, // Further optimized for faster completion
          ease: 'Cubic.easeOut', // Optimized for smooth 60fps performance
          delay: position.x * 30, // Further reduced stagger for faster completion
          onComplete: () => {
            // Store in state arrays efficiently
            state.tileSprites[position.y][position.x] = tile;
            state.tileTexts[position.y][position.x] = letterText;
            
            // Setup interactions
            const tileData: LetterTile = { letter, points, x: position.x, y: position.y, id };
            setupTileInteraction(tile, position.y, position.x, tileData);
            
            animResolve();
          }
        });
      });
      
      appearancePromises.push(appearancePromise);
    }

    Promise.all(appearancePromises).then(() => resolve());
  });
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

      // Get premium color based on Scrabble point value
      const tileColor = getTileColorByPoints(tileData.points);

      // Create new tile background with premium coloring
      const tile = scene.add.rectangle(
        x,
        startY,
        tileSize - 6, // Consistent spacing
        tileSize - 6,
        parseInt(tileColor.replace('#', ''), 16)
      );
      tile.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));
      tile.setInteractive();

      // Add subtle depth shadow effect
      const shadowTile = scene.add.rectangle(
        x + 2, startY + 2,
        tileSize - 6, tileSize - 6,
        0x000000
      );
      shadowTile.setAlpha(0.2);
      shadowTile.setDepth(-1);

      // Create new tile text with premium colors
      const letterText = scene.add
        .text(x, startY - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: TEXT_COLORS.tileLetters,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner with premium electric blue
      const pointText = scene.add
        .text(x + tileSize * 0.3, startY + tileSize * 0.25, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      state.tileSprites[row][col] = tile;

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
 * Animate tile removal and cascading effect for dynamic gameplay
 * Handles the complete tile removal and falling animation sequence:
 * 1. Animate removed tiles disappearing with particle effects
 * 2. Animate remaining tiles falling down to fill gaps
 * 3. Animate new tiles falling from top to fill empty spaces
 * 4. Set up interactions for all final tile positions
 * @param scene - The Phaser scene for animation
 * @param state - Board rendering state with current sprites and board data
 * @param setupTileInteraction - Callback to setup tile interactions
 * @param removedTiles - Array of tile positions that were removed from the board
 * @returns void - Updates board visuals with smooth cascading animations
 */
function animateTileRemovalAndCascade(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void,
  removedTiles: { x: number; y: number }[]
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

  // Phase 1: Animate removal of tiles that formed the word
  const removalAnimations: Promise<void>[] = [];
  const removedPositions = new Set<string>();

  for (const { x, y } of removedTiles) {
    const tileSprite = state.tileSprites[y]?.[x];
    const tileText = state.tileTexts[y]?.[x];
    
    if (tileSprite && tileText) {
      removedPositions.add(`${x}-${y}`);
      
      const removalPromise = new Promise<void>((resolve) => {
        // Create particle effect for tile removal
        const particles = createTileRemovalEffect(scene, tileSprite.x, tileSprite.y, selected.tile.points);

        // Animate tile disappearing
        scene.tweens.add({
          targets: [tileSprite, tileText],
          alpha: 0,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 120, // Further optimized for 60fps target
          ease: 'Cubic.easeIn', // Smoother than Back.easeIn for performance
          onComplete: () => {
            tileSprite.destroy();
            tileText.destroy();
            particles.destroy();
            
            // Clear from state arrays
            state.tileSprites[y][x] = null as any;
            state.tileTexts[y][x] = null as any;
            
            resolve();
          }
        });
      });
      
      removalAnimations.push(removalPromise);
    }
  }

  // Phase 2: After removal animations complete, animate cascading
  Promise.all(removalAnimations).then(() => {
    animateCascadingTilesWithRemovedPositions(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction, removedPositions);
  });
}

/**
 * Animate per-column cascading effect where existing tiles fall down and new tiles appear from top
 * Implements proper column-by-column tile dropping instead of full board regeneration
 * @param scene - The Phaser scene
 * @param state - Board rendering state
 * @param gridStartX - X position to start the grid
 * @param gridStartY - Y position to start the grid
 * @param tileSize - Size of each tile
 * @param setupTileInteraction - Callback to setup tile interactions
 * @param removedPositions - Set of position keys that were removed
 */
function animateCascadingTilesWithRemovedPositions(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  gridStartX: number,
  gridStartY: number,
  tileSize: number,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void,
  removedPositions: Set<string>
): void {
  if (!state.currentBoard) return;

  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;

  // Process each column separately for per-column cascading
  const dropAnimations: Promise<void>[] = [];
  
  for (let col = 0; col < boardWidth; col++) {
    let dropCount = 0; // Count removed tiles from bottom up
    const existingTiles: { sprite: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; originalRow: number }[] = [];
    
    // First pass: Collect existing tiles and count gaps
    for (let row = boardHeight - 1; row >= 0; row--) {
      const positionKey = `${col}-${row}`;
      
      if (removedPositions.has(positionKey)) {
        // This position was removed, count it as a gap
        dropCount++;
      } else {
        // This tile still exists, collect it for repositioning
        const currentTileSprite = state.tileSprites[row]?.[col];
        const currentTileText = state.tileTexts[row]?.[col];
        
        if (currentTileSprite && currentTileText) {
          existingTiles.unshift({ // Add to front so we process top-to-bottom
            sprite: currentTileSprite,
            text: currentTileText,
            originalRow: row
          });
        }
      }
    }
    
    // Second pass: Move existing tiles to their new positions (from bottom up)
    existingTiles.forEach((tileInfo, index) => {
      const newRow = boardHeight - 1 - index; // Place from bottom
      
      if (newRow !== tileInfo.originalRow) {
        const newY = gridStartY + newRow * tileSize + tileSize / 2;
        
        // Animate existing tile falling to new position
        const dropPromise = new Promise<void>((resolve) => {
          scene.tweens.add({
            targets: [tileInfo.sprite, tileInfo.text],
            y: newY,
            duration: 300,
            ease: 'Bounce.easeOut',
            delay: col * 25, // Stagger columns
            onComplete: () => {
              // Update positions in state arrays
              state.tileSprites[newRow][col] = tileInfo.sprite;
              state.tileTexts[newRow][col] = tileInfo.text;
              if (newRow !== tileInfo.originalRow) {
                state.tileSprites[tileInfo.originalRow][col] = null as any;
                state.tileTexts[tileInfo.originalRow][col] = null as any;
              }
              
              // Re-setup interactions for new position
              const tileData = state.currentBoard.tiles[newRow][col];
              setupTileInteraction(tileInfo.sprite, newRow, col, tileData);
              resolve();
            }
          });
        });
        dropAnimations.push(dropPromise);
      }
    });
         
     // Third pass: Create new tiles for empty spaces at the top
     const newTilesNeeded = dropCount;
     for (let i = 0; i < newTilesNeeded; i++) {
      const newRow = i;
      const tileData = state.currentBoard.tiles[newRow][col];
      const x = gridStartX + col * tileSize + tileSize / 2;
      const finalY = gridStartY + newRow * tileSize + tileSize / 2;
      const startY = gridStartY - tileSize; // Start just above the board
      
      // Calculate responsive text sizes
      const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
      const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));

      // Get premium color based on Scrabble point value
      const tileColor = getTileColorByPoints(tileData.points);

      // Create new tile background with premium coloring
      const tile = scene.add.rectangle(
        x,
        startY,
        tileSize - 6, // Consistent spacing
        tileSize - 6,
        parseInt(tileColor.replace('#', ''), 16)
      );
      tile.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));
      tile.setInteractive();

      // Add subtle depth shadow effect
      const shadowTile = scene.add.rectangle(
        x + 2, startY + 2,
        tileSize - 6, tileSize - 6,
        0x000000
      );
      shadowTile.setAlpha(0.2);
      shadowTile.setDepth(-1);

      // Create new tile text with premium colors
      const letterText = scene.add
        .text(x, startY - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: TEXT_COLORS.tileLetters,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner with premium electric blue
      const pointText = scene.add
        .text(x + tileSize * 0.3, startY + tileSize * 0.25, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Update state arrays
      state.tileSprites[newRow][col] = tile;
      state.tileTexts[newRow][col] = letterText;

      // Animate new tile falling into place
      const newTilePromise = new Promise<void>((resolve) => {
        scene.tweens.add({
          targets: [tile, letterText, pointText],
          y: [startY, finalY, finalY - 4, finalY + tileSize * 0.25], // Different final positions
          duration: 400 + (i * 50), // Stagger new tiles
          ease: 'Bounce.easeOut',
          delay: col * 50 + 200, // Delay after existing tiles start moving
          onComplete: () => {
            setupTileInteraction(tile, newRow, col, tileData);
            resolve();
          }
        });
      });
      dropAnimations.push(newTilePromise);
    }
  }

  // Wait for all animations to complete
  Promise.all(dropAnimations).then(() => {
    console.log('Per-column cascade animation complete');
  });
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

  // Create premium grid background with atmospheric styling
  const gridBackground = scene.add.rectangle(
    width / 2,
    gridStartY + (boardHeight * tileSize) / 2,
    boardWidth * tileSize + 20,
    boardHeight * tileSize + 20,
    parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16)
  );
  gridBackground.setStrokeStyle(3, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));

  // Create letter tiles from server data with premium colors
  for (let row = 0; row < boardHeight; row++) {
    state.tileSprites[row] = [];
    state.tileTexts[row] = [];
    
    for (let col = 0; col < boardWidth; col++) {
      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;
      const tileData = state.currentBoard.tiles[row][col];

      // Get premium color based on Scrabble point value
      const tileColor = getTileColorByPoints(tileData.points);

      // Create tile background with premium point-based coloring and depth
      const tile = scene.add.rectangle(
        x,
        y,
        tileSize - 6, // Slightly smaller for better spacing
        tileSize - 6,
        parseInt(tileColor.replace('#', ''), 16)
      );
      
      // Add premium border and depth styling
      tile.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));
      tile.setInteractive();
      
      // Add subtle depth shadow effect (simulated with darker stroke)
      const shadowTile = scene.add.rectangle(
        x + 2, y + 2,
        tileSize - 6, tileSize - 6,
        0x000000
      );
      shadowTile.setAlpha(0.2);
      shadowTile.setDepth(-1); // Place shadow behind main tile
      
      state.tileSprites[row][col] = tile;

      // Add letter and point value with premium typography
      const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
      const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));
      
      const letterText = scene.add
        .text(x, y - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: TEXT_COLORS.tileLetters,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      
      // Add point value in corner with premium text color
      scene.add
        .text(x + tileSize * 0.3, y + tileSize * 0.25, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores, // Use electric blue for point values
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      state.tileTexts[row][col] = letterText;

      // Add hover effects and interactions
      setupTileInteraction(tile, row, col, tileData);
    }
  }

  console.log('Premium board display created with', boardWidth, 'x', boardHeight, 'point-colored tiles');
} 

/**
 * Visual State Validation and Recovery Functions
 * Phase 3.1: Implement visual state validation and recovery mechanisms
 */

/**
 * Compare visual tile state with logical board state
 * @param state - Board rendering state
 * @returns Validation result with detailed mismatch information
 */
export function validateVisualState(state: BoardRenderingState): {
  isValid: boolean;
  mismatches: Array<{
    type: 'missing_visual' | 'missing_logical' | 'position_mismatch' | 'content_mismatch';
    position: { x: number; y: number };
    details: string;
  }>;
  summary: string;
} {
  const mismatches: Array<{
    type: 'missing_visual' | 'missing_logical' | 'position_mismatch' | 'content_mismatch';
    position: { x: number; y: number };
    details: string;
  }> = [];

  if (!state.currentBoard) {
    return {
      isValid: false,
      mismatches: [],
      summary: 'No logical board state available'
    };
  }

  const { currentBoard, tileSprites, tileTexts } = state;

  // Check each position in the logical board
  for (let row = 0; row < currentBoard.height; row++) {
    for (let col = 0; col < currentBoard.width; col++) {
      const logicalTile = currentBoard.tiles[row][col];
      const visualSprite = tileSprites[row]?.[col];
      const visualText = tileTexts[row]?.[col];

      if (logicalTile) {
        // Logical tile exists - check visual representation
        if (!visualSprite || !visualText) {
          mismatches.push({
            type: 'missing_visual',
            position: { x: col, y: row },
            details: `Logical tile '${logicalTile.letter}' has no visual representation`
          });
        } else {
          // Check content match
          if (visualText.text !== logicalTile.letter) {
            mismatches.push({
              type: 'content_mismatch',
              position: { x: col, y: row },
              details: `Visual '${visualText.text}' != Logical '${logicalTile.letter}'`
            });
          }
          
          // Check position match (approximate for floating point)
          const expectedX = logicalTile.x;
          const expectedY = logicalTile.y;
          if (Math.abs(expectedX - col) > 0.1 || Math.abs(expectedY - row) > 0.1) {
            mismatches.push({
              type: 'position_mismatch',
              position: { x: col, y: row },
              details: `Position mismatch: visual(${col},${row}) != logical(${expectedX},${expectedY})`
            });
          }
        }
      } else {
        // No logical tile - check if visual exists
        if (visualSprite || visualText) {
          mismatches.push({
            type: 'missing_logical',
            position: { x: col, y: row },
            details: `Visual tile exists but no logical tile at position`
          });
        }
      }
    }
  }

  const isValid = mismatches.length === 0;
  const summary = isValid 
    ? 'Visual state matches logical state perfectly'
    : `${mismatches.length} mismatches found between visual and logical state`;

  return { isValid, mismatches, summary };
}

/**
 * Full board visual refresh from logical state
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback for tile interactions
 * @returns Success boolean
 */
export function refreshVisualStateFromLogical(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): boolean {
  try {
    console.log(`[${new Date().toISOString()}] 🔄 Starting full visual state refresh...`);

    if (!state.currentBoard) {
      console.error(`[${new Date().toISOString()}] ❌ Cannot refresh visual state - no logical board`);
      return false;
    }

    // Clear existing visual elements
    state.tileSprites.forEach(row => row.forEach(tile => tile?.destroy()));
    state.tileTexts.forEach(row => row.forEach(text => text?.destroy()));
    state.tileSprites = [];
    state.tileTexts = [];

    // Recreate board display from logical state
    updateBoardDisplay(scene, state, setupTileInteraction);

    console.log(`[${new Date().toISOString()}] ✅ Visual state refresh completed`);
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Visual state refresh failed:`, error);
    return false;
  }
}

/**
 * Tile-by-tile visual state correction
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback for tile interactions
 * @returns Number of tiles corrected
 */
export function correctVisualStateTileByTile(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): number {
  if (!state.currentBoard) {
    return 0;
  }

  const validation = validateVisualState(state);
  if (validation.isValid) {
    return 0;
  }

  console.log(`[${new Date().toISOString()}] 🔧 Correcting ${validation.mismatches.length} visual state mismatches...`);

  let correctedCount = 0;
  const { width, height } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;
  
  // Calculate tile positioning
  const maxBoardWidth = width * 0.8;
  const maxBoardHeight = height * 0.6;
  const tileSize = Math.min(
    Math.floor(maxBoardWidth / boardWidth),
    Math.floor(maxBoardHeight / boardHeight),
    80
  );
  
  const gridStartX = width / 2 - (boardWidth * tileSize) / 2;
  const gridStartY = height / 2 - (boardHeight * tileSize) / 2;

  for (const mismatch of validation.mismatches) {
    const { position, type } = mismatch;
    const { x: col, y: row } = position;

    try {
      switch (type) {
        case 'missing_visual': {
          // Create missing visual tile
          const logicalTile = state.currentBoard.tiles[row][col];
          if (logicalTile) {
            const x = gridStartX + col * tileSize + tileSize / 2;
            const y = gridStartY + row * tileSize + tileSize / 2;

            // Get premium color based on Scrabble point value
            const tileColor = getTileColorByPoints(logicalTile.points);

            // Create tile sprite with premium coloring
            const tile = scene.add.rectangle(
              x, y,
              tileSize - 6, tileSize - 6, // Consistent spacing
              parseInt(tileColor.replace('#', ''), 16)
            );
            tile.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));
            tile.setInteractive();

            // Add subtle depth shadow effect
            const shadowTile = scene.add.rectangle(
              x + 2, y + 2,
              tileSize - 6, tileSize - 6,
              0x000000
            );
            shadowTile.setAlpha(0.2);
            shadowTile.setDepth(-1);

            // Create text with premium colors
            const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
            const letterText = scene.add.text(x, y - 4, logicalTile.letter, {
              fontSize: letterSize + 'px',
              color: TEXT_COLORS.tileLetters,
              fontFamily: FONTS.body,
              fontStyle: 'bold',
            }).setOrigin(0.5);

            // Ensure arrays exist
            if (!state.tileSprites[row]) state.tileSprites[row] = [];
            if (!state.tileTexts[row]) state.tileTexts[row] = [];

            state.tileSprites[row][col] = tile;
            state.tileTexts[row][col] = letterText;

            setupTileInteraction(tile, row, col, logicalTile);
            correctedCount++;
          }
          break;
        }

        case 'missing_logical': {
          // Remove extra visual tile
          const sprite = state.tileSprites[row]?.[col];
          const text = state.tileTexts[row]?.[col];
          
          if (sprite) {
            sprite.destroy();
            state.tileSprites[row][col] = null as any;
          }
          if (text) {
            text.destroy();
            state.tileTexts[row][col] = null as any;
          }
          correctedCount++;
          break;
        }

        case 'content_mismatch': {
          // Update visual content to match logical
          const logicalTile = state.currentBoard.tiles[row][col];
          const visualText = state.tileTexts[row]?.[col];
          
          if (logicalTile && visualText) {
            visualText.setText(logicalTile.letter);
            correctedCount++;
          }
          break;
        }

        case 'position_mismatch': {
          // Correct visual position
          const logicalTile = state.currentBoard.tiles[row][col];
          const visualSprite = state.tileSprites[row]?.[col];
          const visualText = state.tileTexts[row]?.[col];
          
          if (logicalTile && visualSprite && visualText) {
            const correctX = gridStartX + col * tileSize + tileSize / 2;
            const correctY = gridStartY + row * tileSize + tileSize / 2;
            
            visualSprite.setPosition(correctX, correctY);
            visualText.setPosition(correctX, correctY - 4);
            correctedCount++;
          }
          break;
        }
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Failed to correct tile at (${col},${row}):`, error);
    }
  }

  console.log(`[${new Date().toISOString()}] ✅ Corrected ${correctedCount} visual state mismatches`);
  return correctedCount;
}

/**
 * Periodic visual state validation
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback for tile interactions
 * @returns Validation interval ID (for cleanup)
 */
export function startPeriodicVisualValidation(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): NodeJS.Timeout {
  return setInterval(() => {
    const validation = validateVisualState(state);
    
    if (!validation.isValid) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Visual state validation failed: ${validation.summary}`);
      console.log(`[${new Date().toISOString()}] 🔍 Mismatches:`, validation.mismatches);
      
      // Attempt correction
      const correctedCount = correctVisualStateTileByTile(scene, state, setupTileInteraction);
      
      if (correctedCount === 0) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Tile-by-tile correction failed, attempting full refresh...`);
        refreshVisualStateFromLogical(scene, state, setupTileInteraction);
      }
    }
  }, 5000); // Check every 5 seconds
} 

/**
 * Generate CSS background for main app
 * @returns CSS radial-gradient string
 */
export function getMainBackground(): string {
  return `radial-gradient(ellipse at center, ${BACKGROUNDS.main.light} 0%, ${BACKGROUNDS.main.deep} 100%)`;
}

/**
 * Premium Particle Effects System
 * Enhanced visual feedback for game events using the premium color system
 */

/**
 * Create golden burst particle effect for valid words
 * @param scene - Phaser scene
 * @param x - X position for the effect
 * @param y - Y position for the effect  
 * @param intensity - Effect intensity (1-3, higher = more particles)
 * @returns Particle emitter for chaining or manual destruction
 */
export function createGoldenBurstEffect(
  scene: Phaser.Scene, 
  x: number, 
  y: number, 
  intensity: number = 2
): Phaser.GameObjects.Particles.ParticleEmitter | null {
  try {
    const particles = scene.add.particles(x, y, 'gold-particle', {
      speed: { min: 80, max: 200 },
      scale: { start: 0.8, end: 0.1 },
      lifespan: { min: 400, max: 800 },
      quantity: 8 * intensity,
      blendMode: 'ADD',
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, 20),
        quantity: 12
      }
    });
    
    // Auto-destroy after emission
    setTimeout(() => {
      if (particles && !particles.scene.game.destroyed) {
        particles.destroy();
      }
    }, 1000);
    
    return particles;
  } catch (error) {
    console.warn('Failed to create golden burst effect:', error);
    return null;
  }
}

/**
 * Create electric blue shimmer effect for cascade events
 * @param scene - Phaser scene
 * @param x - X position for the effect
 * @param y - Y position for the effect
 * @returns Particle emitter for chaining or manual destruction
 */
export function createElectricShimmerEffect(
  scene: Phaser.Scene,
  x: number,
  y: number
): Phaser.GameObjects.Particles.ParticleEmitter | null {
  try {
    const particles = scene.add.particles(x, y, 'blue-particle', {
      speed: { min: 30, max: 80 },
      scale: { start: 0.5, end: 0 },
      lifespan: 600,
      quantity: 5,
      alpha: { start: 0.8, end: 0 },
      blendMode: 'ADD'
    });
    
    // Auto-destroy after emission
    setTimeout(() => {
      if (particles && !particles.scene.game.destroyed) {
        particles.destroy();
      }
    }, 800);
    
    return particles;
  } catch (error) {
    console.warn('Failed to create electric shimmer effect:', error);
    return null;
  }
}

/**
 * Create speed bonus mixed particle effect
 * @param scene - Phaser scene
 * @param x - X position for the effect
 * @param y - Y position for the effect
 * @returns Array of particle emitters
 */
export function createSpeedBonusEffect(
  scene: Phaser.Scene,
  x: number,
  y: number
): (Phaser.GameObjects.Particles.ParticleEmitter | null)[] {
  const effects = [];
  
  // Golden particles
  const goldEffect = createGoldenBurstEffect(scene, x, y, 3);
  effects.push(goldEffect);
  
  // Electric blue accent particles
  const blueEffect = createElectricShimmerEffect(scene, x, y);
  effects.push(blueEffect);
  
  return effects;
}

/**
 * Create tile removal particle effect with point-based colors
 * @param scene - Phaser scene
 * @param x - X position for the effect
 * @param y - Y position for the effect
 * @param points - Tile point value for color selection
 * @returns Particle emitter for chaining or manual destruction
 */
export function createTileRemovalEffect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  points: number
): Phaser.GameObjects.Particles.ParticleEmitter | null {
  try {
    // Use different particle types based on tile value
    const particleTexture = points >= 5 ? 'gold-particle' : 'blue-particle';
    
    const particles = scene.add.particles(x, y, particleTexture, {
      speed: { min: 50, max: 120 },
      scale: { start: 0.6, end: 0 },
      lifespan: 400,
      quantity: 6,
      blendMode: 'NORMAL',
      alpha: { start: 0.9, end: 0 }
    });
    
    // Auto-destroy after emission
    setTimeout(() => {
      if (particles && !particles.scene.game.destroyed) {
        particles.destroy();
      }
    }, 500);
    
    return particles;
  } catch (error) {
    console.warn('Failed to create tile removal effect:', error);
    return null;
  }
}

/**
 * Create cascade trail effect for falling tiles
 * @param scene - Phaser scene
 * @param startX - Starting X position
 * @param startY - Starting Y position
 * @param endX - Ending X position 
 * @param endY - Ending Y position
 * @returns Particle emitter for the trail effect
 */
export function createCascadeTrailEffect(
  scene: Phaser.Scene,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Phaser.GameObjects.Particles.ParticleEmitter | null {
  try {
    const particles = scene.add.particles(startX, startY, 'blue-particle', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.3, end: 0 },
      lifespan: 300,
      quantity: 3,
      alpha: { start: 0.6, end: 0 },
      blendMode: 'ADD'
    });
    
    // Move the emitter along the path
    scene.tweens.add({
      targets: particles,
      x: endX,
      y: endY,
      duration: 200,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (particles && !particles.scene.game.destroyed) {
          particles.destroy();
        }
      }
    });
    
    return particles;
  } catch (error) {
    console.warn('Failed to create cascade trail effect:', error);
    return null;
  }
} 