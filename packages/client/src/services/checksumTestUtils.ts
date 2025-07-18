/**
 * Checksum Validation Test Utilities
 * Development tools for testing board synchronization and corruption detection
 * Only available in development mode for testing validation systems
 */

import { GameBoard } from '@word-rush/common';

/**
 * Development flag to enable corruption testing
 * Should be false in production
 */
const ENABLE_CORRUPTION_TESTING = process.env.NODE_ENV === 'development';

/**
 * Corrupt a board for testing checksum validation
 * Intentionally modifies board data to trigger validation failures
 * @param board - Original board to corrupt
 * @param corruptionType - Type of corruption to apply
 * @returns Corrupted board for testing
 */
export function corruptBoardForTesting(
  board: GameBoard, 
  corruptionType: 'single-tile' | 'dimensions' | 'points' = 'single-tile'
): GameBoard {
  if (!ENABLE_CORRUPTION_TESTING) {
    console.warn('Board corruption testing disabled in production');
    return board;
  }

  const corruptedBoard = JSON.parse(JSON.stringify(board)); // Deep clone

  switch (corruptionType) {
    case 'single-tile':
      // Change a single tile letter
      if (corruptedBoard.tiles[0] && corruptedBoard.tiles[0][0]) {
        const originalLetter = corruptedBoard.tiles[0][0].letter;
        corruptedBoard.tiles[0][0].letter = originalLetter === 'A' ? 'Z' : 'A';
        console.log(`🧪 TEST: Corrupted tile [0,0] from "${originalLetter}" to "${corruptedBoard.tiles[0][0].letter}"`);
      }
      break;
      
    case 'dimensions':
      // Change board dimensions
      corruptedBoard.width = board.width + 1;
      console.log(`🧪 TEST: Corrupted board width from ${board.width} to ${corruptedBoard.width}`);
      break;
      
    case 'points':
      // Change point values
      if (corruptedBoard.tiles[0] && corruptedBoard.tiles[0][0]) {
        const originalPoints = corruptedBoard.tiles[0][0].points;
        corruptedBoard.tiles[0][0].points = originalPoints + 10;
        console.log(`🧪 TEST: Corrupted tile [0,0] points from ${originalPoints} to ${corruptedBoard.tiles[0][0].points}`);
      }
      break;
  }

  return corruptedBoard;
}

/**
 * Simulate board corruption in global state
 * Useful for testing client-side validation
 */
export function simulateBoardCorruption(): void {
  if (!ENABLE_CORRUPTION_TESTING) {
    console.warn('Board corruption simulation disabled in production');
    return;
  }

  const currentBoard = (window as any).currentGameBoard;
  if (currentBoard) {
    const corruptedBoard = corruptBoardForTesting(currentBoard, 'single-tile');
    (window as any).currentGameBoard = corruptedBoard;
    console.log('🧪 TEST: Simulated board corruption in global state');
  } else {
    console.warn('🧪 TEST: No current board found in global state to corrupt');
  }
}

/**
 * Add corruption testing to window for manual testing
 * Available in development console as window.testBoardCorruption()
 */
if (ENABLE_CORRUPTION_TESTING && typeof window !== 'undefined') {
  (window as any).testBoardCorruption = simulateBoardCorruption;
  (window as any).corruptBoard = corruptBoardForTesting;
  console.log('🧪 TEST UTILITIES: Board corruption testing available:');
  console.log('  - window.testBoardCorruption() - Corrupt current board');
  console.log('  - window.corruptBoard(board, type) - Corrupt specific board');
} 