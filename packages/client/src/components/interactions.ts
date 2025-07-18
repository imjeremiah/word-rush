/**
 * Interactions Module
 * Handles pointer events, tile selection logic, and word submission
 */

import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  LetterTile, 
  COLORS,
  UI_ELEMENTS,
  getTileColorByPoints,
  DIFFICULTY_CONFIGS,
  DifficultyLevel
} from '@word-rush/common';
import { BoardRenderingState } from './board-rendering.js';

// Types for interaction state
export interface InteractionState {
  isSelecting: boolean;
  selectedTiles: { row: number; col: number; tile: LetterTile }[];
  currentWordText: Phaser.GameObjects.Text | null;
  gameSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

/**
 * Global map to track word submission timestamps for latency measurement
 * Key: word string, Value: submission timestamp in milliseconds
 * Used to calculate round-trip time when server responds
 */
export const wordSubmissionTimestamps = new Map<string, number>();

/**
 * Debounce mechanism to prevent rapid word submissions
 * Helps handle slow word validations and prevents server overload
 */
let lastSubmissionTime = 0;
const WORD_SUBMISSION_DEBOUNCE_MS = 200;

/**
 * Check if two tiles are adjacent (including diagonally)
 * Validates tile adjacency for word path formation using 8-directional connectivity:
 * - Horizontal and vertical neighbors (4-connected)
 * - Diagonal neighbors (8-connected total)
 * - Excludes same-position (distance 0) as invalid
 * Used for validating legal tile selection paths during word formation
 * @param row1 - First tile row coordinate (0-indexed from top)
 * @param col1 - First tile column coordinate (0-indexed from left)
 * @param row2 - Second tile row coordinate (0-indexed from top)
 * @param col2 - Second tile column coordinate (0-indexed from left)
 * @returns True if tiles are adjacent in any of 8 directions, false otherwise
 */
export function areAdjacent(row1: number, col1: number, row2: number, col2: number): boolean {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff) > 0;
}

/**
 * Check if a tile is already selected in the current word path
 * Prevents tile reuse within a single word selection by checking position coordinates
 * Essential for maintaining valid word paths according to game rules
 * @param row - Tile row coordinate to check (0-indexed from top)
 * @param col - Tile column coordinate to check (0-indexed from left)
 * @param state - Current interaction state containing selected tiles array
 * @param state.selectedTiles - Array of currently selected tiles with position data
 * @returns True if tile position is already in the current selection path
 */
export function isTileSelected(row: number, col: number, state: InteractionState): boolean {
  return state.selectedTiles.some(selected => selected.row === row && selected.col === col);
}

/**
 * Comprehensive client-side word validation before server submission
 * Prevents invalid submissions by checking length, uniqueness, and adjacency
 * @param word - The word string to validate
 * @param selectedTiles - Array of selected tiles with position data
 * @param difficulty - Player's current difficulty level for dynamic validation
 * @returns Validation result with success status and error reason
 */
function validateWordSubmission(
  word: string, 
  selectedTiles: Array<{ row: number; col: number; tile: any }>,
  difficulty: DifficultyLevel = 'medium'
): { isValid: boolean; reason: string } {
  
  // 🕰️ PHASE 28: Dynamic minimum length based on difficulty
  const minWordLength = DIFFICULTY_CONFIGS[difficulty].minWordLength;
  if (word.length < minWordLength) {
    return { isValid: false, reason: `Word too short (minimum ${minWordLength} letters for ${difficulty} mode)` };
  }
  
  // Check for tile uniqueness (no reused tiles)
  const uniquePositions = new Set(selectedTiles.map(t => `${t.row}-${t.col}`));
  if (uniquePositions.size !== selectedTiles.length) {
    return { isValid: false, reason: 'Cannot reuse tiles in same word' };
  }
  
  // Check adjacency - each tile must be adjacent to the previous one
  for (let i = 1; i < selectedTiles.length; i++) {
    const prevTile = selectedTiles[i - 1];
    const currentTile = selectedTiles[i];
    
    if (!areAdjacent(prevTile.row, prevTile.col, currentTile.row, currentTile.col)) {
      return { isValid: false, reason: 'All tiles must be connected' };
    }
  }
  
  // Check for empty word (safety check)
  if (word.trim().length === 0) {
    return { isValid: false, reason: 'Empty word not allowed' };
  }
  
  return { isValid: true, reason: '' };
}

/**
 * Provide visual feedback for invalid tile selection attempts
 * Shows users why their selection is invalid with temporary visual indicators
 * @param row - Row of attempted tile selection
 * @param col - Column of attempted tile selection  
 * @param lastSelected - Last successfully selected tile
 * @param boardState - Board rendering state for visual updates
 * @param interactionState - Current interaction state
 */
function provideInvalidSelectionFeedback(
  row: number,
  col: number,
  lastSelected: { row: number; col: number },
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  
  // Determine the reason for invalid selection
  let reason = '';
  if (isTileSelected(row, col, interactionState)) {
    reason = 'Tile already used';
  } else if (!areAdjacent(lastSelected.row, lastSelected.col, row, col)) {
    reason = 'Tiles must be adjacent';
  }
  
  // Flash the tile red briefly to indicate invalid selection
  if (boardState.tileSprites[row] && boardState.tileSprites[row][col]) {
    const tile = boardState.tileSprites[row][col];
    const originalColor = tile.fillColor;
    
    // Flash red for invalid selection
    tile.setFillStyle(0xFF6B6B); // Red color for invalid
    tile.setStrokeStyle(3, 0xFF6B6B);
    
    // Restore original color after brief flash
    setTimeout(() => {
      if (tile && !tile.scene?.game?.isDestroyed) {
        tile.setFillStyle(originalColor);
        tile.setStrokeStyle(2, parseInt(COLORS.tileBackground.replace('#', ''), 16));
      }
    }, 200); // 200ms flash duration
  }
  
  // Show tooltip/feedback message (import notifications for feedback)
  if (reason) {
    import('../services/notifications.js').then(({ notifications }) => {
      notifications.warning(reason, 1000); // Brief warning message
    }).catch(() => {
      // Fallback to console if notifications not available
      console.log(`[Interactions] Invalid selection: ${reason}`);
    });
  }
}

/**
 * Handle tile pointer down event to initiate word selection
 * Starts new word selection sequence when player clicks/touches a tile:
 * 1. Prevents starting new selection if one is already in progress
 * 2. Initializes selection state with clicked tile as first letter
 * 3. Applies visual feedback by highlighting selected tile
 * 4. Updates word display with first letter of new word
 * @param row - Row coordinate of clicked tile (0-indexed from top)
 * @param col - Column coordinate of clicked tile (0-indexed from left)
 * @param tileData - Complete LetterTile data including letter, points, and position
 * @param boardState - Board rendering state for visual updates and tile access
 * @param interactionState - Interaction state to track selection progress and UI updates
 * @returns void - Updates interaction state and visual elements directly
 */
export function onTilePointerDown(
  row: number,
  col: number,
  tileData: LetterTile,
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  if (!boardState.currentBoard || interactionState.isSelecting) return;

  interactionState.isSelecting = true;
  interactionState.selectedTiles = [{ row, col, tile: tileData }];
  
  // Highlight the selected tile with premium glow effect
  if (boardState.tileSprites[row] && boardState.tileSprites[row][col]) {
    const tile = boardState.tileSprites[row][col];
    // Apply orange glow selection color
    tile.setFillStyle(parseInt(UI_ELEMENTS.tileSelected.replace('#', ''), 16));
    // Add glowing effect using Phaser's post effects (if available) or stroke
    tile.setStrokeStyle(4, parseInt(UI_ELEMENTS.tileSelected.replace('#', ''), 16));
  }

  // Update word display
  updateWordDisplay(interactionState);
}

/**
 * Handle tile pointer over event (for dragging)
 * @param row - Tile row
 * @param col - Tile column
 * @param tileData - Tile data
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 */
export function onTilePointerOver(
  row: number,
  col: number,
  tileData: LetterTile,
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  if (!interactionState.isSelecting || !boardState.currentBoard) return;

  // Check if this tile is adjacent to the last selected tile
  if (interactionState.selectedTiles.length > 0) {
    const lastSelected = interactionState.selectedTiles[interactionState.selectedTiles.length - 1];
    
    // If it's the same tile, ignore
    if (lastSelected.row === row && lastSelected.col === col) {
      return;
    }

    // Check if we're going backwards (allow removing last tile)
    if (interactionState.selectedTiles.length > 1) {
      const secondLast = interactionState.selectedTiles[interactionState.selectedTiles.length - 2];
      if (secondLast.row === row && secondLast.col === col) {
        // Remove the last tile (going backwards)
        const removedTile = interactionState.selectedTiles.pop();
        if (removedTile && boardState.tileSprites[removedTile.row] && boardState.tileSprites[removedTile.row][removedTile.col]) {
          boardState.tileSprites[removedTile.row][removedTile.col].setFillStyle(parseInt(COLORS.tileBackground.replace('#', ''), 16));
        }
        updateWordDisplay(interactionState);
        return;
      }
    }

    // Check if adjacent and not already selected
    if (areAdjacent(lastSelected.row, lastSelected.col, row, col) && !isTileSelected(row, col, interactionState)) {
      // Add this tile to selection
      interactionState.selectedTiles.push({ row, col, tile: tileData });
      
      // Highlight the tile with premium glow effect
      if (boardState.tileSprites[row] && boardState.tileSprites[row][col]) {
        const tile = boardState.tileSprites[row][col];
        // Apply orange glow selection color
        tile.setFillStyle(parseInt(UI_ELEMENTS.tileSelected.replace('#', ''), 16));
        // Add glowing effect stroke
        tile.setStrokeStyle(4, parseInt(UI_ELEMENTS.tileSelected.replace('#', ''), 16));
      }

      // Update word display
      updateWordDisplay(interactionState);
    } else {
      // Provide visual feedback for invalid selection attempts
      provideInvalidSelectionFeedback(row, col, lastSelected, boardState, interactionState);
    }
  }
}

/**
 * Handle pointer up event (end selection) with latency tracking
 * Completes word selection and submits to server with timestamp tracking:
 * 1. Validates selection has content and socket connection exists
 * 2. Records submission timestamp for latency measurement
 * 3. Emits word:submit event to server with word data
 * 4. Clears current selection state for next word
 * @param boardState - Board rendering state for visual updates
 * @param interactionState - Interaction state containing selection and socket
 * @param gameState - Current game state for validation
 * @param getCurrentDifficulty - Function to get current player's difficulty level
 * @returns void - Sends word submission to server and resets UI state
 */
export function onPointerUp(
  boardState: BoardRenderingState,
  interactionState: InteractionState,
  gameState?: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end',
  getCurrentDifficulty?: () => DifficultyLevel
): void {
  if (!interactionState.isSelecting || interactionState.selectedTiles.length === 0) return;

  const word = interactionState.selectedTiles.map(selected => selected.tile.letter).join('');
  
  // Pre-submit client-side validation to prevent obvious invalid submissions
  const currentDifficulty = getCurrentDifficulty ? getCurrentDifficulty() : 'medium';
  const validationResult = validateWordSubmission(word, interactionState.selectedTiles, currentDifficulty);
  if (!validationResult.isValid) {
    console.warn(`[Interactions] Word submission blocked - ${validationResult.reason}`);
    // Import notifications for user feedback
    import('../services/notifications.js').then(({ notifications }) => {
      notifications.warning(validationResult.reason, 2000);
    });
    clearSelection(boardState, interactionState);
    return;
  }
  
  // Check invalid word cache to prevent repeat server requests
  // Note: getCachedInvalidWord will be available through global export in GameConnection
  if ((window as any).getCachedInvalidWord) {
    const cachedInvalid = (window as any).getCachedInvalidWord(word);
    if (cachedInvalid) {
      console.log(`[Interactions] Word found in invalid cache: "${word}" - ${cachedInvalid.reason}`);
      import('../services/notifications.js').then(({ notifications }) => {
        notifications.error(`"${word}" is not valid: ${cachedInvalid.reason}`, 2000);
      });
      clearSelection(boardState, interactionState);
      return;
    }
  }
  
  // Word passed validation and not in cache, proceed with server submission
  submitWordToServer();
  
     function submitWordToServer() {
    // Submit word to server (already validated by validateWordSubmission above)
    if (interactionState.gameSocket) {
      // Check if game state allows submissions (only during 'match')
      if (gameState !== 'match') {
        console.warn(`[Interactions] Word submission blocked - game not active (state: ${gameState})`);
        // Still clear selection to provide user feedback
        clearSelection(boardState, interactionState);
        return;
      }
      
      // Apply debounce to prevent rapid submissions
      const currentTime = Date.now();
      if (currentTime - lastSubmissionTime < WORD_SUBMISSION_DEBOUNCE_MS) {
        console.warn(`[Interactions] Word submission debounced - too rapid (${currentTime - lastSubmissionTime}ms)`);
        // Still clear selection to provide user feedback
        clearSelection(boardState, interactionState);
        return;
      }
      
      lastSubmissionTime = currentTime;
      
      // Record submission timestamp for latency measurement
      wordSubmissionTimestamps.set(word, Date.now());
      
      interactionState.gameSocket.emit('word:submit', {
        word,
        tiles: interactionState.selectedTiles.map(selected => selected.tile),
      });
    }

    // Reset selection
    clearSelection(boardState, interactionState);
  }
}

/**
 * Clear the current selection
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 */
export function clearSelection(
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  // Reset tile colors to their original point-based colors
  interactionState.selectedTiles.forEach(selected => {
    if (boardState.tileSprites[selected.row] && boardState.tileSprites[selected.row][selected.col]) {
      const tile = boardState.tileSprites[selected.row][selected.col];
      const tileData = selected.tile;
      
      // Restore original point-based color
      const originalColor = getTileColorByPoints(tileData.points);
      tile.setFillStyle(parseInt(originalColor.replace('#', ''), 16));
      
      // Remove glow effect by resetting stroke to original border
      tile.setStrokeStyle(2, parseInt(COLORS.border.replace('#', ''), 16));
    }
  });

  // Reset state
  interactionState.isSelecting = false;
  interactionState.selectedTiles = [];
  updateWordDisplay(interactionState);
}

/**
 * Update the word display
 * @param state - Interaction state
 */
export function updateWordDisplay(state: InteractionState): void {
  if (!state.currentWordText) return;

  if (state.selectedTiles.length > 0) {
    const word = state.selectedTiles.map(selected => selected.tile.letter).join('');
    const points = state.selectedTiles.reduce((sum, selected) => sum + selected.tile.points, 0);
    state.currentWordText.setText(`${word} (${points} points)`);
  } else {
    state.currentWordText.setText('');
  }
}

/**
 * Setup tile interaction events
 * @param tile - The tile game object
 * @param row - Tile row
 * @param col - Tile column
 * @param tileData - Tile data
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 */
export function setupTileInteraction(
  tile: Phaser.GameObjects.Rectangle,
  row: number,
  col: number,
  tileData: LetterTile,
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  // Clear any existing event listeners to prevent duplicates/conflicts
  tile.removeAllListeners();
  
  // Ensure tile is interactive (may have been cleared with listeners)
  tile.setInteractive();
  
  // Add hover effect (when not selecting)
  tile.on('pointerover', () => {
    if (!interactionState.isSelecting) {
      tile.setFillStyle(parseInt(UI_ELEMENTS.tileHover.replace('#', ''), 16));
    } else {
      onTilePointerOver(row, col, tileData, boardState, interactionState);
    }
  });

  tile.on('pointerout', () => {
    if (!interactionState.isSelecting && !isTileSelected(row, col, interactionState)) {
      // Reset to proper point-based color instead of generic background
      const originalColor = getTileColorByPoints(tileData.points);
      tile.setFillStyle(parseInt(originalColor.replace('#', ''), 16));
    }
  });

  // Add pointer down event
  tile.on('pointerdown', () => {
    onTilePointerDown(row, col, tileData, boardState, interactionState);
  });

  // Store tile data for word selection (update with current values)
  tile.setData('tileData', tileData);
  tile.setData('row', row);
  tile.setData('col', col);
}

/**
 * Initialize global pointer events for the scene
 * @param scene - The Phaser scene
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 * @param getGameState - Function to get current game state
 * @param getCurrentDifficulty - Function to get current player's difficulty level
 */
export function initializeGlobalPointerEvents(
  scene: Phaser.Scene,
  boardState: BoardRenderingState,
  interactionState: InteractionState,
  getGameState: () => 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end',
  getCurrentDifficulty: () => DifficultyLevel
): void {
  // Set up global pointer up event
  scene.input.on('pointerup', () => {
    onPointerUp(boardState, interactionState, getGameState(), getCurrentDifficulty);
  });
} 