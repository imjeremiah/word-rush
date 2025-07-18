/**
 * Layout Module
 * Handles UI layout, responsive design, resize handling, and text elements
 */

import Phaser from 'phaser';
import { FONTS, COLORS } from '@word-rush/common';
import { BoardRenderingState } from './board-rendering.js';
import { InteractionState } from './interactions.js';

// Types for layout state
export interface LayoutState {
  titleText: Phaser.GameObjects.Text | null;
  instructionText: Phaser.GameObjects.Text | null;
}

/**
 * Create responsive game layout with title and instructions
 * @param scene - The Phaser scene
 * @param layoutState - Layout state
 * @param interactionState - Interaction state for word display
 */
export function createGameLayout(
  scene: Phaser.Scene,
  layoutState: LayoutState,
  interactionState: InteractionState
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

  // Add current word display
  interactionState.currentWordText = scene.add
    .text(width / 2, height - Math.min(150, height * 0.15), '', {
      fontSize: Math.min(24, width * 0.03) + 'px',
      color: '#ffffff',
      fontFamily: FONTS.heading,
      fontStyle: 'bold',
    })
    .setOrigin(0.5);

  // Add instructions
  layoutState.instructionText = scene.add
    .text(
      width / 2,
      height - Math.min(120, height * 0.12), // 🎯 PHASE B.4: Increased from 80px/0.08 to 120px/0.12 for larger board
      'Drag over adjacent tiles to form words. Release to submit!',
      {
        fontSize: Math.min(22, width * 0.028) + 'px', // 🎯 PHASE 2.2: Increased from 16px/0.02 for better readability
        fontStyle: 'bold', // 🎯 PHASE 2.2: Added bold weight for prominence
        color: COLORS.textSubtle,
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
  
  // Update current word display
  if (interactionState.currentWordText) {
    interactionState.currentWordText.setPosition(width / 2, height - Math.min(150, height * 0.15));
    interactionState.currentWordText.setStyle({ 
      fontSize: Math.min(24, width * 0.03) + 'px',
      fontFamily: FONTS.heading
    });
  }
  
  // Update instructions
  if (layoutState.instructionText) {
    layoutState.instructionText.setPosition(width / 2, height - Math.min(120, height * 0.12)); // 🎯 PHASE B.4: Increased from 80px/0.08 to 120px/0.12 for larger board
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