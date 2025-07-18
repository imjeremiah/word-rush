/**
 * Board Rendering Module
 * Handles board display, tile creation, animations, and visual updates
 */

import Phaser from 'phaser';
import { 
  GameBoard, 
  LetterTile, 
  TileChanges,
  BACKGROUNDS,
  TEXT_COLORS,
  FONTS,
  getTileColorByPoints
} from '@word-rush/common';

// Debug flag to control bypass transition logging verbosity
// Set to false in production to reduce console noise during scene transitions
const DEBUG_SCENE_TRANSITIONS = false; // Toggle for production deployment

// Global flag to track if cascade animations are running
let cascadeAnimationsRunning = false;

/**
 * Set cascade animation state for debugging validation interference
 */
export function setCascadeAnimationState(isRunning: boolean): void {
  cascadeAnimationsRunning = isRunning;
  console.log(`[${new Date().toISOString()}] 🎬 Cascade animations: ${isRunning ? 'STARTED' : 'COMPLETED'}`);
}

/**
 * Check if cascade animations are currently running
 */
export function areCascadeAnimationsRunning(): boolean {
  return cascadeAnimationsRunning;
}

/**
 * 🔧 FIX 2: Force reposition points after animations to prevent snapping
 * Ensures all point texts are correctly positioned in bottom-right corner of tiles
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param tileSize - Current tile size for positioning calculations
 */
export function repositionPoints(scene: Phaser.Scene, state: BoardRenderingState, tileSize: number): void {
  if (!state.currentBoard) return;
  
  let repositionedCount = 0;
  const boardHeight = state.currentBoard.height;
  const boardWidth = state.currentBoard.width;
  
  console.log(`[${new Date().toISOString()}] 🔧 Force repositioning points for ${boardWidth}x${boardHeight} board...`);
  
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      const tileSprite = state.tileSprites[row]?.[col];
      const pointText = state.pointTexts[row]?.[col];
      
      if (tileSprite && pointText) {
        // Calculate correct bottom-right position relative to tile center
        const correctX = tileSprite.x + (tileSize * 0.4);
        const correctY = tileSprite.y + (tileSize * 0.4);
        
        // Check if repositioning is needed
        const currentX = pointText.x;
        const currentY = pointText.y;
        const tolerance = 2; // Allow 2px tolerance for floating point differences
        
        if (Math.abs(currentX - correctX) > tolerance || Math.abs(currentY - correctY) > tolerance) {
          console.log(`[Fix2] Repositioning point text at [${row}][${col}] from (${currentX.toFixed(1)}, ${currentY.toFixed(1)}) to (${correctX}, ${correctY})`);
          
          pointText.setPosition(correctX, correctY);
          pointText.setOrigin(1, 1); // Ensure bottom-right anchor
          pointText.setVisible(true); // Ensure visibility
          repositionedCount++;
        }
      }
    }
  }
  
  if (repositionedCount > 0) {
    console.log(`[${new Date().toISOString()}] ✅ Repositioned ${repositionedCount} point texts to correct positions`);
  } else {
    console.log(`[${new Date().toISOString()}] ✅ All point texts already correctly positioned`);
  }
}

// Debounced repositioning to prevent excessive calls
let repositionDebounceTimer: NodeJS.Timeout | null = null;

/**
 * 🔧 FIX 2: Debounced version of repositionPoints to prevent excessive calls
 * @param scene - Phaser scene
 * @param state - Board rendering state  
 * @param tileSize - Current tile size for positioning calculations
 * @param delayMs - Debounce delay in milliseconds (default: 100ms)
 */
export function debouncedRepositionPoints(
  scene: Phaser.Scene, 
  state: BoardRenderingState, 
  tileSize: number, 
  delayMs: number = 100
): void {
  // Clear existing timer
  if (repositionDebounceTimer) {
    clearTimeout(repositionDebounceTimer);
  }
  
  // Set new timer
  repositionDebounceTimer = setTimeout(() => {
    repositionPoints(scene, state, tileSize);
    repositionDebounceTimer = null;
  }, delayMs);
}

// Types for board rendering state
export interface BoardRenderingState {
  currentBoard: GameBoard | null;
  pendingBoard: GameBoard | null; // 🔧 TASK 1: Board preloaded during countdown but not yet rendered
  tileSprites: Phaser.GameObjects.Rectangle[][];
  tileTexts: Phaser.GameObjects.Text[][];
  pointTexts: Phaser.GameObjects.Text[][]; // Track point value texts for cascade persistence
  shadowSprites: Phaser.GameObjects.Rectangle[][]; // Track shadow tiles for proper cleanup
}

/**
 * 🚨 PHASE 1A: CRITICAL - Visual State Recovery Circuit Breaker System
 * Prevents infinite recovery loops and provides exponential backoff for failed validations
 */

// Circuit breaker state for visual validation
interface CircuitBreakerState {
  isOpen: boolean;
  recoveryAttempts: number;
  lastRecoveryTime: number;
  failureCount: number;
  lastValidationTime: number;
  isValidationInProgress: boolean;
  validationQueue: number;
  bypassConditions: {
    duringSceneTransition: boolean;
    duringTileAnimation: boolean;
    gameInactive: boolean;
  };
}

// Circuit breaker configuration - reduced frequency to prevent excessive interventions
const CIRCUIT_BREAKER_CONFIG = {
  MAX_RECOVERY_ATTEMPTS: 2, // Reduced from 5 to 2 attempts
  RECOVERY_WINDOW_MS: 30000, // Increased from 10s to 30s
  MAX_FAILURES_BEFORE_OPEN: 3,
  OPEN_CIRCUIT_DURATION_MS: 60000, // Increased from 30s to 60s for longer cooldown
  VALIDATION_DEBOUNCE_MS: 1000, // Increased from 500ms to 1s
  MIN_VALIDATION_INTERVAL_MS: 2000, // Increased from 1s to 2s
  MAX_CONCURRENT_VALIDATIONS: 1,
  EXPONENTIAL_BACKOFF_BASE: 2000, // Increased from 1s to 2s base delay
  EXPONENTIAL_BACKOFF_MAX: 15000, // Increased from 10s to 15s max delay
};

// Global circuit breaker state
let circuitBreakerState: CircuitBreakerState = {
  isOpen: false,
  recoveryAttempts: 0,
  lastRecoveryTime: 0,
  failureCount: 0,
  lastValidationTime: 0,
  isValidationInProgress: false,
  validationQueue: 0,
  bypassConditions: {
    duringSceneTransition: false,
    duringTileAnimation: false,
    gameInactive: false,
  }
};

// Debounced validation timer
let validationDebounceTimer: NodeJS.Timeout | null = null;

/**
 * Check if circuit breaker should block validation
 * @returns true if validation should be blocked
 */
function isCircuitBreakerOpen(): boolean {
  const now = Date.now();
  
  // Check if circuit breaker should be reset
  if (circuitBreakerState.isOpen && 
      (now - circuitBreakerState.lastRecoveryTime) > CIRCUIT_BREAKER_CONFIG.OPEN_CIRCUIT_DURATION_MS) {
    console.log(`[${new Date().toISOString()}] 🔧 Circuit breaker reset after ${CIRCUIT_BREAKER_CONFIG.OPEN_CIRCUIT_DURATION_MS}ms`);
    resetCircuitBreaker();
  }
  
  return circuitBreakerState.isOpen;
}

/**
 * Reset circuit breaker state
 */
function resetCircuitBreaker(): void {
  circuitBreakerState.isOpen = false;
  circuitBreakerState.recoveryAttempts = 0;
  circuitBreakerState.failureCount = 0;
  circuitBreakerState.validationQueue = 0;
}

/**
 * Trigger circuit breaker due to recovery failure
 */
function triggerCircuitBreaker(reason: string): void {
  const now = Date.now();
  circuitBreakerState.isOpen = true;
  circuitBreakerState.lastRecoveryTime = now;
  circuitBreakerState.failureCount++;
  
  console.error(`[${new Date().toISOString()}] 🚨 Circuit breaker OPEN: ${reason}`);
  console.error(`[${new Date().toISOString()}] 📊 Circuit breaker stats:`, {
    attempts: circuitBreakerState.recoveryAttempts,
    failures: circuitBreakerState.failureCount,
    queueSize: circuitBreakerState.validationQueue
  });
}

/**
 * Check if validation should be bypassed due to current game state
 * @param scene - Phaser scene to check
 * @returns true if validation should be bypassed
 */
function shouldBypassValidation(scene?: Phaser.Scene): boolean {
  // Tightened: Only bypass if destroying or inactive > 2s
  if (scene && scene.scene.isDestroying) {
    return true;
  }
  
  if (scene && !scene.sys.isActive() && (Date.now() - circuitBreakerState.lastValidationTime > 2000)) {
    return true;
  }
  
  return false; // Remove other conditions
}

/**
 * Calculate exponential backoff delay for recovery attempts
 * @returns delay in milliseconds
 */
function calculateBackoffDelay(): number {
  const attempts = circuitBreakerState.recoveryAttempts;
  const delay = Math.min(
    CIRCUIT_BREAKER_CONFIG.EXPONENTIAL_BACKOFF_BASE * Math.pow(2, attempts),
    CIRCUIT_BREAKER_CONFIG.EXPONENTIAL_BACKOFF_MAX
  );
  return delay;
}

/**
 * Set bypass condition for scene transitions
 * @param bypassing - true to bypass validation
 */
export function setSceneTransitionBypass(bypassing: boolean): void {
  circuitBreakerState.bypassConditions.duringSceneTransition = bypassing;
  
  // Only log bypass transitions when debug flag is enabled
  if (DEBUG_SCENE_TRANSITIONS) {
    if (bypassing) {
      console.log(`[${new Date().toISOString()}] 🔄 Scene transition bypass ENABLED`);
    } else {
      console.log(`[${new Date().toISOString()}] 🔄 Scene transition bypass DISABLED`);
    }
  }
}

/**
 * Set bypass condition for tile animations
 * @param bypassing - true to bypass validation
 */
export function setTileAnimationBypass(bypassing: boolean): void {
  circuitBreakerState.bypassConditions.duringTileAnimation = bypassing;
  
  // Only log bypass transitions when debug flag is enabled
  if (DEBUG_SCENE_TRANSITIONS) {
    if (bypassing) {
      console.log(`[${new Date().toISOString()}] 🎬 Tile animation bypass ENABLED`);
    } else {
      console.log(`[${new Date().toISOString()}] 🎬 Tile animation bypass DISABLED`);
    }
  }
}

/**
 * Set bypass condition for game inactive state
 * @param bypassing - true to bypass validation
 */
export function setGameInactiveBypass(bypassing: boolean): void {
  circuitBreakerState.bypassConditions.gameInactive = bypassing;
  
  // Only log bypass transitions when debug flag is enabled
  if (DEBUG_SCENE_TRANSITIONS) {
    if (bypassing) {
      console.log(`[${new Date().toISOString()}] ⏸️ Game inactive bypass ENABLED`);
    } else {
      console.log(`[${new Date().toISOString()}] ⏸️ Game inactive bypass DISABLED`);
    }
  }
}

/**
 * Update existing tiles efficiently without recreation
 * Reuses existing tile sprites and text objects, only updating their properties
 * @param scene - The Phaser scene
 * @param state - Board rendering state
 * @param gridStartX - X position to start the grid
 * @param gridStartY - Y position to start the grid
 * @param tileSize - Size of each tile
 * @param setupTileInteraction - Callback to setup tile interactions
 */
function updateExistingTiles(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  gridStartX: number,
  gridStartY: number,
  tileSize: number,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (!state.currentBoard) return;

  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;
  let tilesReused = 0;
  let tilesCreated = 0;

  console.log(`[${new Date().toISOString()}] 🔄 Optimizing tile update: reusing existing tiles where possible`);

  // Ensure arrays are properly sized
  while (state.tileSprites.length < boardHeight) {
    state.tileSprites.push([]);
    state.tileTexts.push([]);
    state.pointTexts.push([]);
    state.shadowSprites.push([]);
  }

  for (let row = 0; row < boardHeight; row++) {
    // Ensure row arrays exist
    if (!state.tileSprites[row]) state.tileSprites[row] = [];
    if (!state.tileTexts[row]) state.tileTexts[row] = [];
    if (!state.pointTexts[row]) state.pointTexts[row] = [];
    if (!state.shadowSprites[row]) state.shadowSprites[row] = [];

    for (let col = 0; col < boardWidth; col++) {
      const tileData = state.currentBoard.tiles[row][col];
      const existingSprite = state.tileSprites[row]?.[col];
      const existingText = state.tileTexts[row]?.[col];
      const existingPointText = state.pointTexts[row]?.[col];

      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;

      if (existingSprite && existingText) {
        // Reuse existing tile - update properties instead of recreating
        const tileColor = getTileColorByPoints(tileData.points);
        const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
        const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));

        // Update sprite properties
        existingSprite.setPosition(x, y);
        existingSprite.setSize(tileSize - 6, tileSize - 6);
        existingSprite.setFillStyle(parseInt(tileColor.replace('#', ''), 16));
        existingSprite.setStrokeStyle(2, parseInt(BACKGROUNDS.boardOutline.replace('#', ''), 16));

        // Update text properties
        existingText.setPosition(x, y - 4);
        existingText.setText(tileData.letter);
        existingText.setFontSize(letterSize);
        existingText.setColor(TEXT_COLORS.tileLetters);

        // Update or create point text
        if (existingPointText) {
          existingPointText.setPosition(x + tileSize * 0.4, y + tileSize * 0.4);
          existingPointText.setOrigin(1, 1);
          existingPointText.setText(tileData.points.toString());
          existingPointText.setFontSize(pointSize);
        } else {
          // Create missing point text
          const pointText = scene.add.text(x + tileSize * 0.4, y + tileSize * 0.4, tileData.points.toString(), {
            fontSize: pointSize + 'px',
            color: TEXT_COLORS.playerScores,
            fontFamily: FONTS.body,
            fontStyle: 'bold',
          }).setOrigin(1, 1);
          state.pointTexts[row][col] = pointText;
        }

        // Re-setup interactions for updated tile
        setupTileInteraction(existingSprite, row, col, tileData);
        tilesReused++;
      } else {
        // Create new tile only if needed
        const tileColor = getTileColorByPoints(tileData.points);
        const letterSize = Math.max(12, Math.min(32, tileSize * 0.4));
        const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));

        // Create new tile background
        const tile = scene.add.rectangle(
          x, y,
          tileSize - 6, tileSize - 6,
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

        // Create new text
        const letterText = scene.add.text(x, y - 4, tileData.letter, {
          fontSize: letterSize + 'px',
          color: TEXT_COLORS.tileLetters,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        }).setOrigin(0.5);

        // Create and store point value text
        const pointText = scene.add.text(x + tileSize * 0.4, y + tileSize * 0.4, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        }).setOrigin(1, 1);

        // Store sprites and track shadow tiles (prevents artifacts)
        state.tileSprites[row][col] = tile;
        state.tileTexts[row][col] = letterText;
        state.pointTexts[row][col] = pointText;
        
        // Ensure shadow array exists and store shadow tile
        if (!state.shadowSprites[row]) state.shadowSprites[row] = [];
        state.shadowSprites[row][col] = shadowTile;

        setupTileInteraction(tile, row, col, tileData);
        tilesCreated++;
      }
    }
  }

  console.log(`[${new Date().toISOString()}] ✅ Tile update optimized: ${tilesReused} reused, ${tilesCreated} created (${Math.round((tilesReused / (tilesReused + tilesCreated)) * 100)}% reuse rate)`);
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

  // 🐛 PREP LOGGING: Track board display updates
  console.log(`[BoardUpdate] Starting board display update. Board size: ${state.currentBoard.width}x${state.currentBoard.height}. Removed tiles: ${removedTiles?.length || 0}`);

  // 🧹 PHASE 26: Comprehensive cleanup to prevent shadow artifacts
  cleanupAllVisualElements(scene, state);

  // Check if this is an initial board setup or an update
  const isInitialSetup = state.tileSprites.length === 0;

  // If not initial setup, handle dynamic update with animations (legacy board updates)
  if (!isInitialSetup && removedTiles) {
    // Legacy board update with full regeneration (for shuffles, etc.)
    animateBoardUpdate(scene, state, setupTileInteraction);
    return;
  }

  // Optimize tile creation/update based on existing state
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

  if (isInitialSetup) {
    // True initial setup - create everything from scratch
    state.tileSprites.forEach(row => row.forEach(tile => tile?.destroy()));
    state.tileTexts.forEach(row => row.forEach(text => text?.destroy()));
    state.pointTexts.forEach(row => row.forEach(pointText => pointText?.destroy()));
    state.tileSprites = [];
    state.tileTexts = [];
    state.pointTexts = [];

    createBoardTiles(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction);
  } else {
    // Update existing tiles efficiently - reuse instead of recreate
    updateExistingTiles(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction);
  }
  
  // 🔧 FIX 2: Ensure points are correctly positioned after any board display update
  debouncedRepositionPoints(scene, state, tileSize, 200);
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

    // 🎬 PHASE 1A: Enable tile animation bypass during cascade
    setTileAnimationBypass(true);

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
        
        // 🔧 PHASE 25: Force position synchronization after cascade completes
        forceSyncVisualToLogicalPositions(scene, state);
        
        // 🔧 FIX 2: Force reposition points after all cascade animations complete
        debouncedRepositionPoints(scene, state, tileSize, 50);
        
        // 🎬 PHASE 1A: Disable tile animation bypass after cascade completes
        setTileAnimationBypass(false);
        
        resolve();
              });
          });
      })
      .catch((error) => {
        console.error('Error processing tile changes:', error);
        // 🎬 PHASE 1A: Ensure bypass is disabled even on error
        setTileAnimationBypass(false);
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
      const pointText = state.pointTexts[y]?.[x];
      
      if (tileSprite && tileText) {
        const removalPromise = new Promise<void>((animResolve) => {
          try {
            // Create premium particle effect for tile removal
            const tilePoints = state.currentBoard?.tiles[y]?.[x]?.points || 1; // Fix: Use state.currentBoard instead of undefined 'selected'
            const particles = createTileRemovalEffect(scene, tileSprite.x, tileSprite.y, tilePoints);

            // Animate tile disappearing
            scene.tweens.add({
              targets: [tileSprite, tileText, pointText],
              alpha: 0,
              scaleX: 1.2,
              scaleY: 1.2,
              duration: 120, // Further optimized for 60fps target
              ease: 'Cubic.easeIn', // Smoother than Back.easeIn for performance
              onComplete: () => {
                try {
                  // Cleanup immediately
                  tileSprite.destroy();
                  tileText.destroy();
                  pointText.destroy();
                  
                  // particles will auto-destroy via setTimeout in createTileRemovalEffect
                  
                  // Clear from state arrays
                  state.tileSprites[y][x] = null as any;
                  state.tileTexts[y][x] = null as any;
                  state.pointTexts[y][x] = null as any;
                  
                  animResolve();
                } catch (error) {
                  console.error('[BoardRendering] Tile cleanup failed:', error);
                  animResolve(); // Continue even if cleanup fails
                }
              }
            });
          } catch (error) {
            console.error('[BoardRendering] Tile removal animation failed:', error);
            // Fallback: immediately clean up without animation
            try {
              tileSprite.destroy();
              tileText.destroy();
              pointText.destroy();
              state.tileSprites[y][x] = null as any;
              state.tileTexts[y][x] = null as any;
              state.pointTexts[y][x] = null as any;
            } catch (cleanupError) {
              console.error('[BoardRendering] Fallback cleanup failed:', cleanupError);
            }
            animResolve();
          }
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
      const pointText = state.pointTexts[from.y]?.[from.x];
      
      if (tileSprite && tileText) {
        const fallingPromise = new Promise<void>((animResolve) => {
          const newX = gridStartX + to.x * tileSize + tileSize / 2;
          const newY = gridStartY + to.y * tileSize + tileSize / 2;
          
          // 🐛 PREP LOGGING: Track tile falling animation
          console.log(`[Cascade] Starting falling animation for tile ${movement.id} from (${tileSprite.x}, ${tileSprite.y}) to (${newX}, ${newY})`);
          if (pointText) {
            console.log(`[Cascade] Pre-fall point position for ${movement.id}: x=${pointText.x}, y=${pointText.y}`);
          }
          
          // Create cascade trail effect for falling tiles
          createCascadeTrailEffect(scene, tileSprite.x, tileSprite.y, newX, newY);
          
          // Animate tile falling to new position - optimized for <400ms target
          scene.tweens.add({
            targets: [tileSprite, tileText, pointText],
            x: newX,
            y: newY,
            duration: 150, // Reduced from 180ms to 150ms for faster cascade
            ease: 'Cubic.easeOut', // Optimized for smooth 60fps performance
            delay: from.x * 10, // Reduced stagger from 20ms to 10ms for faster completion
            onComplete: () => {
              // 🐛 PREP LOGGING: Track completion and point position
              console.log(`[Cascade] Falling animation completed for tile ${movement.id}. Final position: (${newX}, ${newY})`);
              if (pointText) {
                console.log(`[Cascade] Post-fall point position for ${movement.id}: x=${pointText.x}, y=${pointText.y}`);
              }
              
              // Update state arrays efficiently
              state.tileSprites[to.y][to.x] = tileSprite;
              state.tileTexts[to.y][to.x] = tileText;
              state.pointTexts[to.y][to.x] = pointText;
              
              // Clear old position only if different
              if (from.y !== to.y || from.x !== to.x) {
                state.tileSprites[from.y][from.x] = null as any;
                state.tileTexts[from.y][from.x] = null as any;
                state.pointTexts[from.y][from.x] = null as any;
              }
              
              animResolve();
            }
          });
        });
        
        fallingPromises.push(fallingPromise);
      }
    }

    Promise.all(fallingPromises).then(() => {
      // 🔧 FIX 2: Reposition points after falling animations complete
      console.log(`[${new Date().toISOString()}] 🔧 Falling animations complete - checking point positions...`);
      // Use immediate repositioning (no debounce) since this is after a specific animation sequence
      repositionPoints(scene, state, tileSize);
      resolve();
    });
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
          .text(x + tileSize * 0.4, startY + tileSize * 0.4, points.toString(), {
            fontSize: pointSize + 'px',
            color: TEXT_COLORS.playerScores,
            fontFamily: FONTS.body,
            fontStyle: 'bold',
          })
          .setOrigin(1, 1);

        // 🐛 PREP LOGGING: Track new tile creation
        console.log(`[Cascade] Creating new tile ${id} at position (${position.x}, ${position.y}). Initial point position: x=${pointText.x}, y=${pointText.y}`);

        // Animate tile falling into place - optimized for <400ms performance
        scene.tweens.add({
          targets: [tile, letterText, pointText, shadowTile], // Include shadow in animation
          y: [startY, finalY, finalY - 4, finalY + tileSize * 0.4, finalY + 2], // Different targets for different elements
          duration: 120, // Reduced from 150ms to 120ms for faster completion
          ease: 'Cubic.easeOut', // Optimized for smooth 60fps performance
          delay: position.x * 10, // Reduced stagger from 20ms to 10ms for faster completion
          onComplete: () => {
            // 🐛 PREP LOGGING: Track final positioning
            console.log(`[Cascade] New tile ${id} animation completed. Final point position: x=${pointText.x}, y=${pointText.y}`);
            
            // Store in state arrays efficiently (includes shadow tracking)
            state.tileSprites[position.y][position.x] = tile;
            state.tileTexts[position.y][position.x] = letterText;
            state.pointTexts[position.y][position.x] = pointText;
            
            // Ensure shadow array exists and store shadow tile
            if (!state.shadowSprites[position.y]) state.shadowSprites[position.y] = [];
            state.shadowSprites[position.y][position.x] = shadowTile;
            
            // Setup interactions
            const tileData: LetterTile = { letter, points, x: position.x, y: position.y, id };
            setupTileInteraction(tile, position.y, position.x, tileData);
            
            animResolve();
          }
        });
      });
      
      appearancePromises.push(appearancePromise);
    }

    Promise.all(appearancePromises).then(() => {
      // 🔧 FIX 2: Reposition points after new tile appearance animations complete
      console.log(`[${new Date().toISOString()}] 🔧 New tile appearance complete - checking point positions...`);
      // Use immediate repositioning (no debounce) since this is after a specific animation sequence
      repositionPoints(scene, state, tileSize);
      resolve();
    });
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
      const pointText = state.pointTexts[row][col];
      
      if (tile) {
        const promise = new Promise<void>((resolve) => {
          scene.tweens.add({
            targets: [tile, text, pointText],
            y: height + 100,
            alpha: 0,
            duration: 150, // Optimized from 300ms
            ease: 'Cubic.easeIn',
            delay: (row * 30) + (col * 15), // Reduced stagger delays
            onComplete: () => {
              tile.destroy();
              if (text) text.destroy();
              if (pointText) pointText.destroy();
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
  state.pointTexts = [];

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
    state.pointTexts[row] = [];
    
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
        .text(x + tileSize * 0.4, startY + tileSize * 0.4, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(1, 1);

      state.tileSprites[row][col] = tile;
      
      // Ensure shadow array exists and store shadow tile
      if (!state.shadowSprites[row]) state.shadowSprites[row] = [];
      state.shadowSprites[row][col] = shadowTile;

      // Animate tiles falling into place (optimized)
      scene.tweens.add({
        targets: [tile, letterText, pointText, shadowTile], // Include shadow in animation
        y: [startY, y, y - 4, y + tileSize * 0.4, y + 2], // Different final positions for different elements
        duration: 150 + (row * 25), // Reduced from 300+50ms to 150+25ms
        ease: 'Cubic.easeOut', // Faster than Bounce.easeOut
        delay: col * 30, // Reduced stagger for faster completion
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
    const pointText = state.pointTexts[y]?.[x];
    
    if (tileSprite && tileText) {
      removedPositions.add(`${x}-${y}`);
      
      const removalPromise = new Promise<void>((resolve) => {
        // Create particle effect for tile removal
        const particles = createTileRemovalEffect(scene, tileSprite.x, tileSprite.y, selected.tile.points);

        // Animate tile disappearing
        scene.tweens.add({
          targets: [tileSprite, tileText, pointText],
          alpha: 0,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 120, // Further optimized for 60fps target
          ease: 'Cubic.easeIn', // Smoother than Back.easeIn for performance
          onComplete: () => {
            tileSprite.destroy();
            tileText.destroy();
            pointText.destroy();
            particles.destroy();
            
            // Clear from state arrays
            state.tileSprites[y][x] = null as any;
            state.tileTexts[y][x] = null as any;
            state.pointTexts[y][x] = null as any;
            
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

  // Start timing for performance tracking
  const animationStartTime = performance.now();
  console.log(`[${new Date().toISOString()}] 🎬 Starting cascade animation with ${removedPositions.size} removed tiles`);
  
  // Set cascade animation flag to prevent validation interference
  setCascadeAnimationState(true);

  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;

  // Process each column separately for per-column cascading
  const dropAnimations: Promise<void>[] = [];
  
  for (let col = 0; col < boardWidth; col++) {
    let dropCount = 0; // Count removed tiles from bottom up
    const existingTiles: { sprite: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; pointText: Phaser.GameObjects.Text; originalRow: number }[] = [];
    
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
        const currentPointText = state.pointTexts[row]?.[col];
        
        if (currentTileSprite && currentTileText && currentPointText) {
          existingTiles.unshift({ // Add to front so we process top-to-bottom
            sprite: currentTileSprite,
            text: currentTileText,
            pointText: currentPointText,
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
        
        // Animate existing tile falling to new position (optimized for <400ms total)
        const dropPromise = new Promise<void>((resolve) => {
          // Animate sprite and text to center position
          scene.tweens.add({
            targets: [tileInfo.sprite, tileInfo.text],
            y: newY,
            duration: 150, // Reduced from 300ms for speed
            ease: 'Cubic.easeOut', // Faster than Bounce.easeOut
            delay: col * 15, // Reduced stagger for faster completion
          });
          
          // Animate point text to correct corner position
          scene.tweens.add({
            targets: tileInfo.pointText,
            y: newY + tileSize * 0.4,
            duration: 150,
            ease: 'Cubic.easeOut',
            delay: col * 15,
            onComplete: () => {
              // Update positions in state arrays
              state.tileSprites[newRow][col] = tileInfo.sprite;
              state.tileTexts[newRow][col] = tileInfo.text;
              state.pointTexts[newRow][col] = tileInfo.pointText;
              if (newRow !== tileInfo.originalRow) {
                state.tileSprites[tileInfo.originalRow][col] = null as any;
                state.tileTexts[tileInfo.originalRow][col] = null as any;
                state.pointTexts[tileInfo.originalRow][col] = null as any;
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
      
      // Create and store point value text
      const pointText = scene.add
        .text(x + tileSize * 0.4, startY + tileSize * 0.4, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores,
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(1, 1);

      // Update state arrays (includes shadow tracking)
      state.tileSprites[newRow][col] = tile;
      state.tileTexts[newRow][col] = letterText;
      state.pointTexts[newRow][col] = pointText;
      
      // Ensure shadow array exists and store shadow tile
      if (!state.shadowSprites[newRow]) state.shadowSprites[newRow] = [];
      state.shadowSprites[newRow][col] = shadowTile;

      // Animate new tile falling into place (optimized)
      const newTilePromise = new Promise<void>((resolve) => {
        scene.tweens.add({
          targets: [tile, letterText, pointText, shadowTile], // Include shadow in animation
          y: [startY, finalY, finalY - 4, finalY + tileSize * 0.4, finalY + 2], // Different final positions
          duration: 120 + (i * 20), // Reduced from 400+50ms to 120+20ms
          ease: 'Cubic.easeOut', // Faster than Bounce.easeOut
          delay: col * 25 + 100, // Reduced delays for faster completion
          onComplete: () => {
            setupTileInteraction(tile, newRow, col, tileData);
            resolve();
          }
        });
      });
      dropAnimations.push(newTilePromise);
    }
  }

  // Wait for all animations to complete with performance tracking
  Promise.all(dropAnimations).then(() => {
    const animationEndTime = performance.now();
    const totalDuration = animationEndTime - animationStartTime;
    const isOptimal = totalDuration < 400;
    
    console.log(`[${new Date().toISOString()}] ✅ Cascade animation complete: ${Math.round(totalDuration)}ms ${isOptimal ? '🟢' : '🔴'} (target: <400ms)`);
    
    if (!isOptimal) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Slow animation detected: ${Math.round(totalDuration)}ms exceeds 400ms target`);
    }
    
    // Clear cascade animation flag now that animations are complete
    setCascadeAnimationState(false);
  });
}

/**
 * Create batched animation timeline for better performance
 * @param scene - Phaser scene
 * @param animationGroups - Array of animation groups to batch
 * @returns Promise that resolves when all animations complete
 */
function createBatchedAnimationTimeline(
  scene: Phaser.Scene,
  animationGroups: Array<{
    targets: any[];
    props: any;
    duration: number;
    delay?: number;
  }>
): Promise<void> {
  return new Promise((resolve) => {
    if (animationGroups.length === 0) {
      resolve();
      return;
    }

    // Create timeline for better performance than individual tweens
    const timeline = scene.tweens.createTimeline();
    
    let maxDuration = 0;
    
    animationGroups.forEach(group => {
      const totalTime = (group.delay || 0) + group.duration;
      maxDuration = Math.max(maxDuration, totalTime);
      
      timeline.add({
        targets: group.targets,
        ...group.props,
        duration: group.duration,
        delay: group.delay || 0,
      });
    });

    // Set a single completion callback for the entire timeline
    timeline.setCallback('onComplete', () => {
      resolve();
    });

    timeline.play();
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
    state.pointTexts[row] = [];
    
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
      
      // Ensure shadow array exists and store shadow tile
      if (!state.shadowSprites[row]) state.shadowSprites[row] = [];
      state.shadowSprites[row][col] = shadowTile;

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
      const pointText = scene.add
        .text(x + tileSize * 0.4, y + tileSize * 0.4, tileData.points.toString(), {
          fontSize: pointSize + 'px',
          color: TEXT_COLORS.playerScores, // Use electric blue for point values
          fontFamily: FONTS.body,
          fontStyle: 'bold',
        })
        .setOrigin(1, 1);

      state.tileTexts[row][col] = letterText;
      state.pointTexts[row][col] = pointText;

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
  // Skip validation if cascade animations are running
  if (areCascadeAnimationsRunning()) {
    console.log(`[${new Date().toISOString()}] ⏭️ Skipping validation - cascade animations in progress`);
    return { isValid: true, mismatches: [], summary: 'Validation skipped - animations running' };
  }

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

  const { currentBoard, tileSprites, tileTexts, pointTexts } = state;

  // Check each position in the logical board
  for (let row = 0; row < currentBoard.height; row++) {
    for (let col = 0; col < currentBoard.width; col++) {
      const logicalTile = currentBoard.tiles[row][col];
      const visualSprite = tileSprites[row]?.[col];
      const visualText = tileTexts[row]?.[col];
      const pointText = pointTexts[row]?.[col];

      if (logicalTile) {
        // Logical tile exists - check visual representation
        if (!visualSprite || !visualText || !pointText) {
          mismatches.push({
            type: 'missing_visual',
            position: { x: col, y: row },
            details: `Logical tile '${logicalTile.letter}' missing visual: sprite=${!!visualSprite}, text=${!!visualText}, points=${!!pointText}`
          });
        } else {
          // Check content match
          if (visualText.text !== logicalTile.letter) {
            mismatches.push({
              type: 'content_mismatch',
              position: { x: col, y: row },
              details: `Letter mismatch: logical='${logicalTile.letter}', visual='${visualText.text}'`
            });
          }
          
          // Check point text content match
          if (pointText.text !== logicalTile.points.toString()) {
            mismatches.push({
              type: 'content_mismatch',
              position: { x: col, y: row },
              details: `Points mismatch: logical='${logicalTile.points}', visual='${pointText.text}'`
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
    console.log(`[${new Date().toISOString()}] 🔄 Starting optimized visual state refresh...`);

    if (!state.currentBoard) {
      console.error(`[${new Date().toISOString()}] ❌ Cannot refresh visual state - no logical board`);
      return false;
    }

    // Use efficient tile update instead of destroying everything
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

    // Use efficient update function that reuses existing tiles
    updateExistingTiles(scene, state, gridStartX, gridStartY, tileSize, setupTileInteraction);

    console.log(`[${new Date().toISOString()}] ✅ Optimized visual state refresh completed`);
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

  // Skip correction if cascade animations are running
  if (areCascadeAnimationsRunning()) {
    console.log(`[${new Date().toISOString()}] ⏭️ Skipping tile correction - cascade animations in progress`);
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
            const pointSize = Math.max(8, Math.min(12, tileSize * 0.15));
            
            const letterText = scene.add.text(x, y - 4, logicalTile.letter, {
              fontSize: letterSize + 'px',
              color: TEXT_COLORS.tileLetters,
              fontFamily: FONTS.body,
              fontStyle: 'bold',
            }).setOrigin(0.5);

            // Create point text
            const pointText = scene.add.text(x + tileSize * 0.4, y + tileSize * 0.4, logicalTile.points.toString(), {
              fontSize: pointSize + 'px',
              color: TEXT_COLORS.playerScores,
              fontFamily: FONTS.body,
              fontStyle: 'bold',
            }).setOrigin(1, 1);

            // Ensure arrays exist
            if (!state.tileSprites[row]) state.tileSprites[row] = [];
            if (!state.tileTexts[row]) state.tileTexts[row] = [];
            if (!state.pointTexts[row]) state.pointTexts[row] = [];
            if (!state.shadowSprites[row]) state.shadowSprites[row] = [];

            state.tileSprites[row][col] = tile;
            state.tileTexts[row][col] = letterText;
            state.pointTexts[row][col] = pointText;
            state.shadowSprites[row][col] = shadowTile;

            setupTileInteraction(tile, row, col, logicalTile);
            correctedCount++;
          }
          break;
        }

        case 'missing_logical': {
          // Remove extra visual tile
          const sprite = state.tileSprites[row]?.[col];
          const text = state.tileTexts[row]?.[col];
          const pointText = state.pointTexts[row]?.[col];
          
          if (sprite) {
            sprite.destroy();
            state.tileSprites[row][col] = null as any;
          }
          if (text) {
            text.destroy();
            state.tileTexts[row][col] = null as any;
          }
          if (pointText) {
            pointText.destroy();
            state.pointTexts[row][col] = null as any;
          }
          correctedCount++;
          break;
        }

        case 'content_mismatch': {
          // Update visual content to match logical
          const logicalTile = state.currentBoard.tiles[row][col];
          const visualText = state.tileTexts[row]?.[col];
          const pointText = state.pointTexts[row]?.[col];
          
          if (logicalTile && visualText) {
            visualText.setText(logicalTile.letter);
            correctedCount++;
          }
          if (logicalTile && pointText) {
            pointText.setText(logicalTile.points.toString());
            correctedCount++;
          }
          break;
        }

        case 'position_mismatch': {
          // Correct visual position
          const logicalTile = state.currentBoard.tiles[row][col];
          const visualSprite = state.tileSprites[row]?.[col];
          const visualText = state.tileTexts[row]?.[col];
          const pointText = state.pointTexts[row]?.[col];
          
          const correctX = gridStartX + col * tileSize + tileSize / 2;
          const correctY = gridStartY + row * tileSize + tileSize / 2;
          
          if (logicalTile && visualSprite && visualText) {
            visualSprite.setPosition(correctX, correctY);
            visualText.setPosition(correctX, correctY - 4);
            correctedCount++;
          }
                      if (logicalTile && pointText) {
              pointText.setPosition(correctX + tileSize * 0.4, correctY + tileSize * 0.4);
              pointText.setOrigin(1, 1);
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
 * Periodic visual state validation with circuit breaker protection
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
    // Check circuit breaker and bypass conditions
    if (isCircuitBreakerOpen()) {
      console.log(`[${new Date().toISOString()}] 🚨 Visual validation skipped - circuit breaker open`);
      return;
    }
    
    if (shouldBypassValidation(scene)) {
      console.log(`[${new Date().toISOString()}] ⏭️ Visual validation skipped - bypass conditions met`);
      return;
    }
    
    // Debounced validation execution
    if (validationDebounceTimer) {
      clearTimeout(validationDebounceTimer);
    }
    
    validationDebounceTimer = setTimeout(() => {
      performThrottledValidation(scene, state, setupTileInteraction);
    }, CIRCUIT_BREAKER_CONFIG.VALIDATION_DEBOUNCE_MS);
    
  }, 5000); // Check every 5 seconds
}

/**
 * Perform throttled visual state validation with circuit breaker protection
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback for tile interactions
 */
function performThrottledValidation(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  const now = Date.now();
  
  // Final check before validation
  if (circuitBreakerState.isValidationInProgress) {
    console.log(`[${new Date().toISOString()}] ⏳ Visual validation already in progress, skipping`);
    return;
  }
  
  if (isCircuitBreakerOpen() || shouldBypassValidation(scene)) {
    return;
  }
  
  try {
    circuitBreakerState.isValidationInProgress = true;
    circuitBreakerState.lastValidationTime = now;
    
    console.log(`[${new Date().toISOString()}] 🔍 Starting throttled visual state validation...`);
    
    const validation = validateVisualState(state);
    
    if (!validation.isValid) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Visual state validation failed: ${validation.summary}`);
      console.log(`[${new Date().toISOString()}] 🔍 Mismatches:`, validation.mismatches);
      
      // Track recovery attempt
      circuitBreakerState.recoveryAttempts++;
      
      // Check if we've exceeded recovery attempts in window
      if (circuitBreakerState.recoveryAttempts >= CIRCUIT_BREAKER_CONFIG.MAX_RECOVERY_ATTEMPTS) {
        if ((now - circuitBreakerState.lastRecoveryTime) < CIRCUIT_BREAKER_CONFIG.RECOVERY_WINDOW_MS) {
          triggerCircuitBreaker(`Too many recovery attempts: ${circuitBreakerState.recoveryAttempts} in ${CIRCUIT_BREAKER_CONFIG.RECOVERY_WINDOW_MS}ms`);
          return;
        } else {
          // Reset counter if outside window
          circuitBreakerState.recoveryAttempts = 1;
          circuitBreakerState.lastRecoveryTime = now;
        }
      }
      
      // Calculate backoff delay
      const backoffDelay = calculateBackoffDelay();
      console.log(`[${new Date().toISOString()}] ⏱️ Recovery attempt ${circuitBreakerState.recoveryAttempts} scheduled with ${backoffDelay}ms backoff`);
      
      // Attempt recovery with exponential backoff
      setTimeout(() => {
        attemptVisualStateRecovery(scene, state, setupTileInteraction);
      }, backoffDelay);
      
    } else {
      console.log(`[${new Date().toISOString()}] ✅ Visual state validation passed`);
      // Reset recovery attempts on successful validation
      circuitBreakerState.recoveryAttempts = 0;
      circuitBreakerState.failureCount = 0;
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Visual state validation error:`, error);
    triggerCircuitBreaker(`Validation exception: ${error}`);
  } finally {
    circuitBreakerState.isValidationInProgress = false;
    circuitBreakerState.validationQueue = Math.max(0, circuitBreakerState.validationQueue - 1);
  }
}

/**
 * Attempt visual state recovery with progressive steps
 * @param scene - Phaser scene
 * @param state - Board rendering state
 * @param setupTileInteraction - Callback for tile interactions
 */
function attemptVisualStateRecovery(
  scene: Phaser.Scene,
  state: BoardRenderingState,
  setupTileInteraction: (tile: Phaser.GameObjects.Rectangle, row: number, col: number, tileData: LetterTile) => void
): void {
  if (isCircuitBreakerOpen()) {
    console.log(`[${new Date().toISOString()}] 🚨 Recovery cancelled - circuit breaker open`);
    return;
  }
  
  console.log(`[${new Date().toISOString()}] 🔧 Attempting visual state recovery...`);
  
  try {
    // Step 1: Try tile-by-tile correction
    const correctedCount = correctVisualStateTileByTile(scene, state, setupTileInteraction);
    
    if (correctedCount > 0) {
      console.log(`[${new Date().toISOString()}] ✅ Recovery successful - corrected ${correctedCount} tiles`);
      circuitBreakerState.recoveryAttempts = 0; // Reset on success
      return;
    }
    
    // Step 2: Try full refresh if tile correction failed
    console.warn(`[${new Date().toISOString()}] ⚠️ Tile-by-tile correction failed, attempting full refresh...`);
    const refreshSuccess = refreshVisualStateFromLogical(scene, state, setupTileInteraction);
    
    if (refreshSuccess) {
      console.log(`[${new Date().toISOString()}] ✅ Recovery successful - full refresh completed`);
      circuitBreakerState.recoveryAttempts = 0; // Reset on success
      return;
    }
    
    // Recovery failed
    console.error(`[${new Date().toISOString()}] ❌ All recovery attempts failed`);
    
    // Check if we should trigger circuit breaker
    if (circuitBreakerState.failureCount >= CIRCUIT_BREAKER_CONFIG.MAX_FAILURES_BEFORE_OPEN) {
      triggerCircuitBreaker(`Recovery failure limit reached: ${circuitBreakerState.failureCount} consecutive failures`);
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Recovery attempt failed with exception:`, error);
    triggerCircuitBreaker(`Recovery exception: ${error}`);
  }
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

/**
 * Force synchronization of visual sprite positions to match logical board positions
 * Ensures visual sprites are positioned exactly where they should be after cascade animations
 * @param scene - Phaser scene
 * @param state - Board rendering state
 */
function forceSyncVisualToLogicalPositions(scene: Phaser.Scene, state: BoardRenderingState): void {
  if (!state.currentBoard) return;
  
  const { width, height } = scene.scale.gameSize;
  const boardWidth = state.currentBoard.width;
  const boardHeight = state.currentBoard.height;
  const tileSize = Math.min(Math.floor(width * 0.8 / boardWidth), Math.floor(height * 0.6 / boardHeight), 80);
  const gridStartX = width / 2 - (boardWidth * tileSize) / 2;
  const gridStartY = height / 2 - (boardHeight * tileSize) / 2;
  
  let syncedCount = 0;
  
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      const logicalTile = state.currentBoard.tiles[row][col];
      const visualSprite = state.tileSprites[row]?.[col];
      const visualText = state.tileTexts[row]?.[col];
      const pointText = state.pointTexts[row]?.[col];
      
      if (logicalTile && visualSprite && visualText) {
        const correctX = gridStartX + col * tileSize + tileSize / 2;
        const correctY = gridStartY + row * tileSize + tileSize / 2;
        
        // Check if position correction is needed (tolerance for floating point precision)
        const deltaX = Math.abs(visualSprite.x - correctX);
        const deltaY = Math.abs(visualSprite.y - correctY);
        
        if (deltaX > 1 || deltaY > 1) {
          visualSprite.setPosition(correctX, correctY);
          visualText.setPosition(correctX, correctY - 4);
          pointText.setPosition(correctX + tileSize * 0.4, correctY + tileSize * 0.4);
          pointText.setOrigin(1, 1);
          syncedCount++;
          console.log(`[${new Date().toISOString()}] 🔧 Synced tile [${row}][${col}] from (${visualSprite.x.toFixed(1)}, ${visualSprite.y.toFixed(1)}) to (${correctX}, ${correctY})`);
        }
      }
    }
  }
  
  if (syncedCount > 0) {
    console.log(`[${new Date().toISOString()}] ✅ Position sync complete: corrected ${syncedCount} tile positions`);
  } else {
    console.log(`[${new Date().toISOString()}] ✅ Position sync complete: all tiles already correctly positioned`);
  }
} 

/**
 * Comprehensive cleanup of all visual elements to prevent shadow artifacts
 * Removes all existing sprites, shadows, particles, and visual remnants
 * @param scene - Phaser scene to clean
 * @param state - Board rendering state to reset
 */
function cleanupAllVisualElements(scene: Phaser.Scene, state: BoardRenderingState): void {
  console.log(`[${new Date().toISOString()}] 🧹 Starting comprehensive visual cleanup...`);
  
  let cleanedTiles = 0;
  let cleanedShadows = 0;
  let cleanedTexts = 0;
  let cleanedPointTexts = 0;
  let cleanedParticles = 0;
  
  try {
    // Destroy all existing tile sprites
    state.tileSprites.forEach(row => {
      if (row) {
        row.forEach(tile => {
          if (tile && tile.scene && !tile.scene.game.isDestroyed) {
            tile.destroy();
            cleanedTiles++;
          }
        });
      }
    });
    
    // Destroy all existing text objects
    state.tileTexts.forEach(row => {
      if (row) {
        row.forEach(text => {
          if (text && text.scene && !text.scene.game.isDestroyed) {
            text.destroy();
            cleanedTexts++;
          }
        });
      }
    });
    
    // Destroy all existing point text objects
    if (state.pointTexts) {
      state.pointTexts.forEach(row => {
        if (row) {
          row.forEach(pointText => {
            if (pointText && pointText.scene && !pointText.scene.game.isDestroyed) {
              pointText.destroy();
              cleanedPointTexts++;
            }
          });
        }
      });
    }
    
    // Destroy all existing shadow sprites (NEW - fixes shadow artifacts)
    if (state.shadowSprites) {
      state.shadowSprites.forEach(row => {
        if (row) {
          row.forEach(shadow => {
            if (shadow && shadow.scene && !shadow.scene.game.isDestroyed) {
              shadow.destroy();
              cleanedShadows++;
            }
          });
        }
      });
    }
    
    // Clean up particle effects and any stray visual elements
    scene.children.list.forEach(child => {
      try {
        // Remove particle emitters
        if (child.type === 'ParticleEmitter') {
          child.destroy();
          cleanedParticles++;
        }
        // Remove any orphaned rectangles or texts with depth -1 (shadows)
        else if ((child.type === 'Rectangle' || child.type === 'Text') && child.depth === -1) {
          child.destroy();
          cleanedShadows++;
        }
      } catch (error) {
        console.warn('Failed to clean child element:', error);
      }
    });
    
    // Reset all state arrays
    state.tileSprites = [];
    state.tileTexts = [];
    state.pointTexts = [];
    state.shadowSprites = [];
    
    console.log(`[${new Date().toISOString()}] ✅ Cleanup completed: ${cleanedTiles} tiles, ${cleanedShadows} shadows, ${cleanedTexts} texts, ${cleanedPointTexts} point texts, ${cleanedParticles} particles`);
    
  } catch (error) {
    console.error('Error during visual cleanup:', error);
    // Force reset arrays even if cleanup failed
    state.tileSprites = [];
    state.tileTexts = [];
    state.pointTexts = [];
    state.shadowSprites = [];
  }
}

/**
 * Debug function to verify tile colors are correctly mapped
 * Can be called from browser console: window.debugTileColors()
 */
function debugTileColors(): void {
  console.log('🎨 Tile Color Mappings:');
  console.log('1 point (E,A,I,O,U,L,N,S,T,R):', getTileColorByPoints(1)); // Should be #045476
  console.log('2 points (D,G):', getTileColorByPoints(2)); // Should be #0A7497
  console.log('3 points (B,C,M,P):', getTileColorByPoints(3)); // Should be #149ABC
  console.log('4 points (F,H,V,W,Y):', getTileColorByPoints(4)); // Should be #0F9995
  console.log('5 points (K):', getTileColorByPoints(5)); // Should be #FBA731
  console.log('8 points (J,X):', getTileColorByPoints(8)); // Should be #F88C2B
  console.log('10 points (Q,Z):', getTileColorByPoints(10)); // Should be #F1742A
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugTileColors = debugTileColors;
}

/**
 * Debug function to verify point text persistence
 * Can be called from browser console: window.debugPointTexts()
 */
function debugPointTexts(): void {
  console.log('🔢 Point Text Debug Information:');
  
  // Try to access the board state through the global Phaser game instance
  const scenes = (window as any).game?.scene?.scenes || [];
  const gameScene = scenes.find((scene: any) => scene.scene?.key !== 'default');
  
  if (!gameScene) {
    console.error('No active game scene found');
    return;
  }
  
  // Access board state (this is a hack for debugging)
  const boardState = (gameScene as any).boardState;
  if (!boardState) {
    console.error('No board state found in scene');
    return;
  }
  
  if (!boardState.currentBoard) {
    console.log('No current board loaded');
    return;
  }
  
  console.log(`Board size: ${boardState.currentBoard.width}x${boardState.currentBoard.height}`);
  
  // Check each position for point text presence
  let totalTiles = 0;
  let tilesWithPointTexts = 0;
  let missingPointTexts = [];
  
  for (let row = 0; row < boardState.currentBoard.height; row++) {
    for (let col = 0; col < boardState.currentBoard.width; col++) {
      const logicalTile = boardState.currentBoard.tiles[row][col];
      const pointText = boardState.pointTexts[row]?.[col];
      
      if (logicalTile) {
        totalTiles++;
        if (pointText && pointText.scene && !pointText.scene.game.isDestroyed) {
          tilesWithPointTexts++;
          console.log(`✅ [${row}][${col}] ${logicalTile.letter}(${logicalTile.points}) -> "${pointText.text}"`);
        } else {
          missingPointTexts.push({ row, col, letter: logicalTile.letter, points: logicalTile.points });
          console.log(`❌ [${row}][${col}] ${logicalTile.letter}(${logicalTile.points}) -> MISSING POINT TEXT`);
        }
      }
    }
  }
  
  console.log(`Summary: ${tilesWithPointTexts}/${totalTiles} tiles have point texts`);
  if (missingPointTexts.length > 0) {
    console.log('Missing point texts:', missingPointTexts);
  }
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugPointTexts = debugPointTexts;
}

/**
 * Debug function to verify point text positioning and origin
 * Can be called from browser console: window.debugPointTextPositioning()
 */
function debugPointTextPositioning(): void {
  console.log('🎯 Point Text Positioning Debug:');
  console.log('✅ Origin: (1, 1) - Bottom-right anchor');
  console.log('✅ Position: x + tileSize * 0.4, y + tileSize * 0.4');
  console.log('✅ This places the bottom-right corner of the text in the bottom-right area of the tile');
  
  // Try to access the board state through the global Phaser game instance
  const scenes = (window as any).game?.scene?.scenes || [];
  const gameScene = scenes.find((scene: any) => scene.scene?.key !== 'default');
  
  if (!gameScene) {
    console.error('No active game scene found');
    return;
  }
  
  // Access board state (this is a hack for debugging)
  const boardState = (gameScene as any).boardState;
  if (!boardState || !boardState.pointTexts) {
    console.error('No point texts found in board state');
    return;
  }
  
  let totalPointTexts = 0;
  let correctlyPositioned = 0;
  
  boardState.pointTexts.forEach((row: any[], rowIndex: number) => {
    row.forEach((pointText: any, colIndex: number) => {
      if (pointText && pointText.originX !== undefined) {
        totalPointTexts++;
        if (pointText.originX === 1 && pointText.originY === 1) {
          correctlyPositioned++;
        }
        console.log(`[${rowIndex}][${colIndex}] origin: (${pointText.originX}, ${pointText.originY}), pos: (${pointText.x}, ${pointText.y})`);
      }
    });
  });
  
  console.log(`📊 Summary: ${correctlyPositioned}/${totalPointTexts} point texts correctly positioned`);
}

// Make debug function globally available
(window as any).debugPointTextPositioning = debugPointTextPositioning;