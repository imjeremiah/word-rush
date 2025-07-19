/**
 * Layout Module
 * Handles UI layout, responsive design, resize handling, and text elements
 */

import Phaser from 'phaser';
import { COLORS, BACKGROUNDS, TEXT_COLORS, FONTS } from "@word-rush/common";
import { BoardRenderingState } from './board-rendering.js';
import { InteractionState } from './interactions.js';

/**
 * 🔧 UPDATED FIX: More targeted scene readiness validation for layout operations
 * Focuses on the actual null scene.add issue rather than broader scene state
 */
function isSceneReadyForGameObjects(scene: Phaser.Scene): boolean {
  try {
    if (!scene || !scene.sys || !scene.add) {
      console.warn(`[LayoutGuard] Scene, scene.sys, or scene.add is null`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[LayoutGuard] Error checking scene readiness:`, error);
    return false;
  }
}

/**
 * Safe wrapper for scene.add operations in layout
 */
function safeSceneOperation<T>(
  scene: Phaser.Scene, 
  operation: () => T, 
  operationName: string
): T | null {
  if (!isSceneReadyForGameObjects(scene)) {
    console.warn(`[LayoutGuard] Skipping ${operationName} - scene not ready`);
    return null;
  }

  try {
    return operation();
  } catch (error) {
    console.error(`[LayoutGuard] Failed ${operationName}:`, error);
    return null;
  }
}

// Types for layout state
export interface LayoutState {
  titleText: Phaser.GameObjects.Text | null;
  instructionText: Phaser.GameObjects.Text | null;
}

// Removed calculateBoardLayout function - using simpler fixed positioning for word builder text

/**
 * Create responsive game layout with title and instructions
 * @param scene - The Phaser scene
 * @param layoutState - Layout state
 * @param interactionState - Interaction state for word display
 * @param boardState - Board state for positioning calculations
 */
export function createGameLayout(
  scene: Phaser.Scene,
  layoutState: LayoutState,
  interactionState: InteractionState,
  boardState: BoardRenderingState
): void {
  const { width, height } = scene.scale.gameSize;
  
  // Add title - using premium title font for brand consistency
  // 🎯 PHASE 2.1: Board title text removed for cleaner layout
  // layoutState.titleText = scene.add
  //   .text(width / 2, Math.min(50, height * 0.08), 'Word Rush - MVP Game Board', {
  //     fontSize: Math.min(32, width * 0.04) + 'px',
  //     color: '#FEDE5F', // Golden color to match title gradient top
  //     fontFamily: FONTS.title,
  //     fontStyle: 'normal', // Luckiest Guy doesn't need bold styling
  //   })
  //   .setOrigin(0.5);
  layoutState.titleText = null; // Set to null since we're not creating it

  // Add current word display - positioned above board with FORCED VISIBLE positioning
  // Use a reliable position that's always visible above the game board area
  const safeWordTextY = height * 0.25; // Always 25% down from top - GUARANTEED VISIBLE
  
  console.log(`[Layout] Creating word builder text at Y=${safeWordTextY} (guaranteed visible position)`);

  // 🔧 CRITICAL FIX: Use safe scene operation for word builder text
  interactionState.currentWordText = safeSceneOperation(scene, () => scene.add
    .text(width / 2, safeWordTextY, '', {
      fontSize: Math.min(22, width * 0.028) + 'px', // MATCH instruction text sizing exactly
      fontStyle: 'bold', // MATCH instruction text weight exactly
      color: TEXT_COLORS.universalText || '#FAF0C7', // MATCH instruction text color exactly
      fontFamily: FONTS.body, // MATCH instruction text font exactly
      align: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Temporary background for visibility testing
      padding: { x: 8, y: 4 } // Padding for better visibility
    })
    .setOrigin(0.5), 'create word builder text');

  if (!interactionState.currentWordText) {
    console.error(`[LayoutGuard] Failed to create word builder text - scene not ready`);
    // Continue with degraded functionality - the game can still work without the word display
  }

  // Add instructions
  layoutState.instructionText = scene.add
    .text(
      width / 2,
      height - Math.min(40, height * 0.04), // 🎯 PHASE B.4: AGGRESSIVE FIX - text positioned very close to bottom edge to clear 80% height board
      'Drag over adjacent tiles to form words. Release to submit!',
      {
        fontSize: Math.min(22, width * 0.028) + 'px', // 🎯 PHASE 2.2: Increased from 16px/0.02 for better readability
        fontStyle: 'bold', // 🎯 PHASE 2.2: Added bold weight for prominence
        color: TEXT_COLORS.universalText || '#FAF0C7', // Universal text color /* old: COLORS.textSubtle */
        fontFamily: FONTS.body,
        align: 'center',
        wordWrap: { width: width * 0.8 }
      }
    )
    .setOrigin(0.5);
}

/**
 * Handle game resize for responsive layout
 * @param scene - The Phaser scene
 * @param layoutState - Layout state
 * @param interactionState - Interaction state for word display
 * @param boardState - Board rendering state
 * @param updateBoardDisplay - Callback to update board display
 */
export function resizeGame(
  scene: Phaser.Scene,
  layoutState: LayoutState,
  interactionState: InteractionState,
  boardState: BoardRenderingState,
  updateBoardDisplay: () => void
): void {
  const { width, height } = scene.scale.gameSize;
  
  // Update title position and size
  // 🎯 PHASE 2.1: Title text resize handling removed (title text disabled)
  // if (layoutState.titleText) {
  //   layoutState.titleText.setPosition(width / 2, Math.min(50, height * 0.08));
  //   layoutState.titleText.setStyle({ 
  //     fontSize: Math.min(28, width * 0.035) + 'px',
  //     fontFamily: FONTS.heading
  //   });
  // }
  
  // Update current word display - FORCE VISIBLE positioning
  if (interactionState.currentWordText) {
    // Use reliable visible position - always 25% down from top
    const safeY = height * 0.25; // GUARANTEED VISIBLE
    
    interactionState.currentWordText.setPosition(width / 2, safeY);
    interactionState.currentWordText.setStyle({ 
      fontSize: Math.min(22, width * 0.028) + 'px', // MATCH instruction text sizing exactly
      fontFamily: FONTS.body, // MATCH instruction text font exactly
      fontStyle: 'bold' // MATCH instruction text weight exactly
    });
    
    console.log(`[Layout] Resize - Word text positioned at Y=${safeY} (GUARANTEED VISIBLE)`);
  }
  
  // Update instructions
  if (layoutState.instructionText) {
    layoutState.instructionText.setPosition(width / 2, height - Math.min(40, height * 0.04)); // 🎯 PHASE B.4: AGGRESSIVE FIX - text positioned very close to bottom edge to clear 80% height board
    layoutState.instructionText.setStyle({ 
      fontSize: Math.min(22, width * 0.028) + 'px', // 🎯 PHASE 2.2: Enhanced sizing for readability
      fontStyle: 'bold', // 🎯 PHASE 2.2: Enhanced weight for prominence
      fontFamily: FONTS.body,
      wordWrap: { width: width * 0.8 }
    });
  }
  
  // Update board display if it exists
  if (boardState.currentBoard) {
    updateBoardDisplay();
  }
}

/**
 * Reposition word builder text above the board when board is loaded
 * @param scene - Phaser scene
 * @param interactionState - Interaction state 
 * @param boardState - Board state
 */
export function repositionWordBuilderText(
  scene: Phaser.Scene,
  interactionState: InteractionState,
  boardState: BoardRenderingState
): void {
  if (!interactionState.currentWordText) return;

  // Use reliable visible position - always 25% down from top
  const safeY = scene.scale.gameSize.height * 0.25; // GUARANTEED VISIBLE
  
  console.log(`[Layout] Repositioning word builder to Y=${safeY} (GUARANTEED VISIBLE)`);
  interactionState.currentWordText.setPosition(scene.scale.gameSize.width / 2, safeY);
}

/**
 * Initialize resize event handler for the scene
 * @param scene - The Phaser scene
 * @param layoutState - Layout state
 * @param interactionState - Interaction state
 * @param boardState - Board rendering state
 * @param updateBoardDisplay - Callback to update board display
 */
export function initializeResizeHandler(
  scene: Phaser.Scene,
  layoutState: LayoutState,
  interactionState: InteractionState,
  boardState: BoardRenderingState,
  updateBoardDisplay: () => void
): void {
  // Handle resize events for responsive layout
  scene.scale.on('resize', () => {
    resizeGame(scene, layoutState, interactionState, boardState, updateBoardDisplay);
  });
} 