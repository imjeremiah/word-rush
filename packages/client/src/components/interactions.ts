/**
 * Interactions Module
 * Handles pointer events, tile selection logic, and word submission
 */

import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, LetterTile, COLORS } from '@word-rush/common';
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
  
  // Highlight the selected tile
  if (boardState.tileSprites[row] && boardState.tileSprites[row][col]) {
    boardState.tileSprites[row][col].setFillStyle(parseInt(COLORS.tileSelected.replace('#', ''), 16));
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
      
      // Highlight the tile
      if (boardState.tileSprites[row] && boardState.tileSprites[row][col]) {
        boardState.tileSprites[row][col].setFillStyle(parseInt(COLORS.tileSelected.replace('#', ''), 16));
      }

      // Update word display
      updateWordDisplay(interactionState);
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
 * @returns void - Sends word submission to server and resets UI state
 */
export function onPointerUp(
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  if (!interactionState.isSelecting || interactionState.selectedTiles.length === 0) return;

  const word = interactionState.selectedTiles.map(selected => selected.tile.letter).join('');
  
  // Submit word if it's at least 2 letters
  if (word.length >= 2 && interactionState.gameSocket) {
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

/**
 * Clear the current selection
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 */
export function clearSelection(
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  // Reset tile colors
  interactionState.selectedTiles.forEach(selected => {
    if (boardState.tileSprites[selected.row] && boardState.tileSprites[selected.row][selected.col]) {
      boardState.tileSprites[selected.row][selected.col].setFillStyle(parseInt(COLORS.tileBackground.replace('#', ''), 16));
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
  // Add hover effect (when not selecting)
  tile.on('pointerover', () => {
    if (!interactionState.isSelecting) {
      tile.setFillStyle(parseInt(COLORS.tileHover.replace('#', ''), 16));
    } else {
      onTilePointerOver(row, col, tileData, boardState, interactionState);
    }
  });

  tile.on('pointerout', () => {
    if (!interactionState.isSelecting && !isTileSelected(row, col, interactionState)) {
      tile.setFillStyle(parseInt(COLORS.tileBackground.replace('#', ''), 16));
    }
  });

  // Add pointer down event
  tile.on('pointerdown', () => {
    onTilePointerDown(row, col, tileData, boardState, interactionState);
  });

  // Store tile data for word selection
  tile.setData('tileData', tileData);
  tile.setData('row', row);
  tile.setData('col', col);
}

/**
 * Initialize global pointer events for the scene
 * @param scene - The Phaser scene
 * @param boardState - Board rendering state
 * @param interactionState - Interaction state
 */
export function initializeGlobalPointerEvents(
  scene: Phaser.Scene,
  boardState: BoardRenderingState,
  interactionState: InteractionState
): void {
  // Set up global pointer up event
  scene.input.on('pointerup', () => {
    onPointerUp(boardState, interactionState);
  });
} 