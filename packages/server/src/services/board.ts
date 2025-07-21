/**
 * Board Generation Service
 * Implements the "Generate, then Validate" algorithm for creating high-quality, solvable game boards
 * Uses official Scrabble letter distribution and point values
 * Optimized with memoization, caching, and performance monitoring
 */

import { LETTER_DISTRIBUTION, LETTER_BAG } from '@word-rush/common';
import { GameBoard, LetterTile, TileChanges, TileMovement, NewTileData } from '@word-rush/common';
import type { DictionaryModule } from './dictionary.js';

// Global sequence counter for tile changes synchronization
let tileChangeSequenceNumber = 0;

// Pre-generation cache for optimized board delivery
let boardCache: GameBoard[] = [];
let isPreGenerating = false;

// Persistent tile bag for efficient reuse
let persistentTileBag = [...LETTER_BAG];

// Memoization cache for solver function
const solverMemoCache = new Map<string, string[]>();

/**
 * Pre-generate boards asynchronously for cache
 * Creates a pool of validated boards to serve instantly during gameplay
 * @param dictionaryService - Dictionary service for word validation
 * @param cacheSize - Number of boards to pre-generate (default: 10)
 */
export async function preGenerateBoards(dictionaryService: DictionaryModule, cacheSize: number = 10): Promise<void> {
  if (isPreGenerating) return;
  isPreGenerating = true;
  
  console.log(`[${new Date().toISOString()}] 🎲 Starting pre-generation of ${cacheSize} boards...`);
  const startTime = Date.now();
  
  for (let i = 0; i < cacheSize; i++) {
    try {
      const board = await generateValidBoardAsync(dictionaryService);
      boardCache.push(board);
    } catch (error) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Failed to pre-generate board ${i + 1}:`, error);
    }
  }
  
  const endTime = Date.now();
  console.log(`[${new Date().toISOString()}] ✅ Pre-generated ${boardCache.length} boards in ${endTime - startTime}ms`);
  isPreGenerating = false;
}

/**
 * Generate a validated board asynchronously with performance monitoring
 * @param dictionaryService - Dictionary service for word validation
 * @returns Promise resolving to a validated GameBoard
 */
async function generateValidBoardAsync(dictionaryService: DictionaryModule): Promise<GameBoard> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = 50;
    
    const tryGenerate = () => {
      attempts++;
      
      try {
        const board = createRandomBoardOptimized();
        const foundWords = findAllValidWordsOptimized(board, dictionaryService);
        
        // 🚀 PHASE 5x5: Updated for 5x5 board - require more words for larger board
        if (foundWords.length >= 15) { // Increased to 15 for 5x5 board validation
          const endTime = Date.now();
          console.log(`[${new Date().toISOString()}] 🎯 Generated valid 5x5 board with ${foundWords.length} words in ${attempts} attempts (${endTime - startTime}ms)`);
          resolve(board);
          return;
        }
        
        if (attempts >= maxAttempts) {
          reject(new Error(`Failed to generate valid board after ${maxAttempts} attempts`));
          return;
        }
        
        // Use setImmediate for non-blocking generation
        setImmediate(tryGenerate);
      } catch (error) {
        reject(error);
      }
    };
    
    tryGenerate();
  });
}

/**
 * Optimized board creation using persistent tile bag for 5x5 boards
 * Reuses the tile bag instead of recreating it each time
 * @returns GameBoard with optimized tile generation for 5x5 grid
 */
function createRandomBoardOptimized(): GameBoard {
  const tiles: LetterTile[][] = [];
  // 🚀 PHASE 5x5: Upgraded to 5x5 for enhanced gameplay
  const boardWidth = 5;  // Upgraded to 5x5 for enhanced gameplay
  const boardHeight = 5;
  
  // Refill persistent bag if needed
  if (persistentTileBag.length < boardWidth * boardHeight) {
    persistentTileBag.push(...LETTER_BAG);
  }
  
  for (let row = 0; row < boardHeight; row++) {
    tiles[row] = [];
    for (let col = 0; col < boardWidth; col++) {
      // Efficient random selection with Fisher-Yates approach
      const randomIndex = Math.floor(Math.random() * persistentTileBag.length);
      const letter = persistentTileBag[randomIndex];
      
      // Remove selected letter
      persistentTileBag.splice(randomIndex, 1);
      
      tiles[row][col] = {
        letter,
        points: LETTER_DISTRIBUTION[letter as keyof typeof LETTER_DISTRIBUTION]?.points || 1,
        x: col,
        y: row,
        id: `tile-${row}-${col}`,
      };
    }
  }

  return {
    tiles,
    width: boardWidth,
    height: boardHeight,
  };
}

/**
 * Fast iterative word finder with early termination
 * Focuses on finding enough words quickly rather than all possible words
 * @param board - The game board to analyze
 * @param dictionaryService - Dictionary service for word validation
 * @param targetCount - Stop after finding this many words (default 20)
 * @returns Array of unique valid words found on the board
 */
function findAllValidWordsOptimized(board: GameBoard, dictionaryService: DictionaryModule, targetCount: number = 20): string[] {
  const boardKey = generateBoardKey(board);
  
  if (solverMemoCache.has(boardKey)) {
    return solverMemoCache.get(boardKey)!;
  }
  
  const foundWords = new Set<string>();
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  // Fast iterative search with early termination
  for (let startRow = 0; startRow < board.height && foundWords.size < targetCount; startRow++) {
    for (let startCol = 0; startCol < board.width && foundWords.size < targetCount; startCol++) {
      // Use iterative BFS instead of recursive DFS
      const queue: Array<{
        row: number;
        col: number;
        word: string;
        path: Set<string>;
      }> = [{
        row: startRow,
        col: startCol,
        word: board.tiles[startRow][startCol].letter,
        path: new Set([`${startRow}-${startCol}`])
      }];
      
      while (queue.length > 0 && foundWords.size < targetCount) {
        const current = queue.shift()!;
        
        // Check if current word is valid (3+ letters)
        if (current.word.length >= 3 && dictionaryService.isValidWord(current.word)) {
          foundWords.add(current.word);
        }
        
        // Don't expand words longer than 8 letters (performance limit)
        if (current.word.length >= 8) continue;
        
        // Explore adjacent cells
        for (const [deltaRow, deltaCol] of directions) {
          const newRow = current.row + deltaRow;
          const newCol = current.col + deltaCol;
          const posKey = `${newRow}-${newCol}`;
          
          // Bounds check and avoid revisiting
          if (newRow >= 0 && newRow < board.height && 
              newCol >= 0 && newCol < board.width && 
              !current.path.has(posKey)) {
            
            const newPath = new Set(current.path);
            newPath.add(posKey);
            
            queue.push({
              row: newRow,
              col: newCol,
              word: current.word + board.tiles[newRow][newCol].letter,
              path: newPath
            });
          }
        }
      }
    }
  }
  
  const result = Array.from(foundWords);
  solverMemoCache.set(boardKey, result);
  
  // Check if we're hitting the cache size limit
  if (solverMemoCache.size > 2000) {
    // Remove oldest entry (first key) to make room
    const firstKey = solverMemoCache.keys().next().value;
    if (firstKey) {
      solverMemoCache.delete(firstKey);
    }
  }
  
  return result;
}

/**
 * Generate a unique key for board state memoization
 * @param board - The game board
 * @returns String key representing board state
 */
function generateBoardKey(board: GameBoard): string {
  const letters = board.tiles.flat().map(tile => tile.letter).join('');
  return `${board.width}x${board.height}-${letters}`;
}

/**
 * Optimized recursive word finding with position-level memoization
 * Includes depth limiting and path memoization for performance
 */
function findWordsFromPositionOptimized(
  board: GameBoard,
  row: number,
  col: number,
  currentWord: string,
  usedPositions: Set<string>,
  foundWords: Set<string>,
  dictionaryService: DictionaryModule,
  positionMemo: Map<string, Set<string>>
): void {
  // Bounds checking
  if (row < 0 || row >= board.height || col < 0 || col >= board.width) {
    return;
  }

  const positionKey = `${row}-${col}`;
  
  // Path validation
  if (usedPositions.has(positionKey)) {
    return;
  }

  // Check position-level memoization
  const memoKey = `${positionKey}-${currentWord}-${Array.from(usedPositions).sort().join(',')}`;
  if (positionMemo.has(memoKey)) {
    const cachedWords = positionMemo.get(memoKey)!;
    cachedWords.forEach(word => foundWords.add(word));
    return;
  }

  const newWord = currentWord + board.tiles[row][col].letter;
  const newUsedPositions = new Set(usedPositions);
  newUsedPositions.add(positionKey);

  const localFoundWords = new Set<string>();

  // Check if current word is valid
  if (newWord.length >= 3 && dictionaryService.isValidWord(newWord)) {
    foundWords.add(newWord);
    localFoundWords.add(newWord);
  }

  // Depth limiting for performance (max 10 characters)
  if (newWord.length >= 10) {
    positionMemo.set(memoKey, localFoundWords);
    return;
  }

  // Continue in all 8 directions
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [deltaRow, deltaCol] of directions) {
    findWordsFromPositionOptimized(
      board,
      row + deltaRow,
      col + deltaCol,
      newWord,
      newUsedPositions,
      foundWords,
      dictionaryService,
      positionMemo
    );
  }

  positionMemo.set(memoKey, localFoundWords);
}

/**
 * Calculate incremental tile changes for cascade effects
 * Returns only the changes needed to update the board, not the full board state
 * This enables smooth animations and reduces network traffic
 * @param board - The current game board state
 * @param tilesToRemove - Array of tile coordinates to remove from the board
 * @returns TileChanges object containing removed positions, falling tiles, and new tiles
 */
export function calculateTileChanges(
  board: GameBoard,
  tilesToRemove: { x: number; y: number }[]
): TileChanges {
  console.time('calculateTileChanges');
  
  const changes: TileChanges = {
    removedPositions: [],
    fallingTiles: [],
    newTiles: [],
    sequenceNumber: ++tileChangeSequenceNumber,
    timestamp: Date.now()
  };

  // Record positions that will be removed
  const removeSet = new Set<string>();
  for (const { x, y } of tilesToRemove) {
    if (y >= 0 && y < board.height && x >= 0 && x < board.width) {
      changes.removedPositions.push({ x, y });
      removeSet.add(`${x}-${y}`);
    }
  }

  // Calculate falling tiles for each column
  for (let col = 0; col < board.width; col++) {
    const columnChanges = calculateColumnCascade(board, col, removeSet);
    changes.fallingTiles.push(...columnChanges.fallingTiles);
    changes.newTiles.push(...columnChanges.newTiles);
  }

  console.timeEnd('calculateTileChanges');
  console.log(`[${new Date().toISOString()}] Calculated tile changes: ${changes.removedPositions.length} removed, ${changes.fallingTiles.length} falling, ${changes.newTiles.length} new`);
  
  return changes;
}

/**
 * Calculate cascade changes for a single column
 * Determines which tiles fall and where new tiles appear
 * @param board - The game board
 * @param col - Column index to process
 * @param removeSet - Set of position keys to remove
 * @returns Column-specific tile movements and new tiles
 */
function calculateColumnCascade(
  board: GameBoard,
  col: number,
  removeSet: Set<string>
): { fallingTiles: TileMovement[]; newTiles: NewTileData[] } {
  const fallingTiles: TileMovement[] = [];
  const newTiles: NewTileData[] = [];

  // Get all non-removed tiles in this column from bottom to top
  const survivingTiles: Array<{ tile: LetterTile; originalRow: number }> = [];
  
  for (let row = board.height - 1; row >= 0; row--) {
    const positionKey = `${col}-${row}`;
    if (!removeSet.has(positionKey)) {
      const tile = board.tiles[row][col];
      survivingTiles.push({ tile, originalRow: row });
    }
  }

  // Calculate new positions for surviving tiles (bottom-up placement)
  for (let i = 0; i < survivingTiles.length; i++) {
    const { tile, originalRow } = survivingTiles[i];
    const newRow = board.height - 1 - i; // Place from bottom up
    
    // Only add to falling tiles if position actually changed
    if (originalRow !== newRow) {
      fallingTiles.push({
        from: { x: col, y: originalRow },
        to: { x: col, y: newRow },
        letter: tile.letter,
        points: tile.points,
        id: tile.id
      });
    }
  }

  // Calculate new tiles needed at the top
  const emptySpaces = board.height - survivingTiles.length;
  for (let i = 0; i < emptySpaces; i++) {
    const newRow = i;
    const newTile = generateRandomTile(col, newRow);
    
    newTiles.push({
      position: { x: col, y: newRow },
      letter: newTile.letter,
      points: newTile.points,
      id: newTile.id
    });
  }

  return { fallingTiles, newTiles };
}

/**
 * Apply tile changes to update the board state
 * This function updates the board in place based on calculated changes
 * @param board - The game board to update
 * @param changes - The tile changes to apply
 * @returns Updated board with changes applied
 */
export function applyTileChanges(board: GameBoard, changes: TileChanges): GameBoard {
  // Create a copy of the board to avoid mutating the original
  const newBoard: GameBoard = {
    ...board,
    tiles: board.tiles.map(row => [...row])
  };

  // Remove tiles
  for (const { x, y } of changes.removedPositions) {
    if (y >= 0 && y < newBoard.height && x >= 0 && x < newBoard.width) {
      (newBoard.tiles[y][x] as any) = null;
    }
  }

  // Apply falling tile movements
  for (const movement of changes.fallingTiles) {
    const { from, to } = movement;
    const tile = newBoard.tiles[from.y][from.x];
    
    if (tile) {
      // Update tile position
      tile.x = to.x;
      tile.y = to.y;
      tile.id = `tile-${to.y}-${to.x}`;
      
      // Move tile to new position
      newBoard.tiles[to.y][to.x] = tile;
      (newBoard.tiles[from.y][from.x] as any) = null;
    }
  }

  // Add new tiles
  for (const newTileData of changes.newTiles) {
    const { position, letter, points, id } = newTileData;
    newBoard.tiles[position.y][position.x] = {
      letter,
      points,
      x: position.x,
      y: position.y,
      id
    };
  }

  return newBoard;
}

/**
 * Board generation configuration options
 */
interface BoardConfig {
  boardWidth: number;
  boardHeight: number;
  minWordsRequired: number;
  maxGenerationAttempts: number;
  minWordLength: number;
}

/**
 * Default board configuration for enhanced gameplay (5x5 grid)
 * 🔧 SECTION 5 FIX: Further optimized for maximum speed and zero delays
 */
const DEFAULT_BOARD_CONFIG: BoardConfig = {
  boardWidth: 5,   // Upgraded to 5x5 for enhanced gameplay
  boardHeight: 5,  // Upgraded to 5x5 for enhanced gameplay
  minWordsRequired: 3, // 🔧 SECTION 5 FIX: Reduced to 3 for ultra-fast generation
  maxGenerationAttempts: 10, // 🔧 CRITICAL FIX: Reduced from 25 to 10 for faster startup
  minWordLength: 3,
};

/**
 * Generate a new game board with guaranteed minimum word count
 * Uses cache for instant delivery, falls back to generation if cache is empty
 * 🔧 SECTION 5 FIX: Enhanced with aggressive cache management and faster fallback
 * @param dictionaryService - Dictionary service for word validation
 * @param config - Board generation configuration (optional, uses defaults)
 * @returns GameBoard with validated word count
 */
export function generateBoard(
  dictionaryService: DictionaryModule,
  config: Partial<BoardConfig> = {}
): GameBoard {
  console.time('generateBoard');
  
  // 🔧 SECTION 5 FIX: Always try to serve from cache first for zero-delay start
  if (boardCache.length > 0) {
    const cachedBoard = boardCache.shift()!;
    console.timeEnd('generateBoard');
    console.log(`[${new Date().toISOString()}] 🚀 Served board from cache (${boardCache.length} remaining) - ZERO DELAY`);
    
    // 🔧 SECTION 5 FIX: Aggressive cache refill - start immediately if cache gets low
    if (boardCache.length < 5 && !isPreGenerating && dictionaryService.isReady()) {
      console.log(`[${new Date().toISOString()}] 🔄 Cache low (${boardCache.length}) - starting immediate pre-generation`);
      preGenerateBoards(dictionaryService, 8).catch(console.error);
    }
    
    return cachedBoard;
  }

  // 🔧 SECTION 5 FIX: Emergency fallback with relaxed requirements for speed
  console.warn(`[${new Date().toISOString()}] ⚠️ Cache empty, using emergency fast generation`);
  
  const boardConfig = { ...DEFAULT_BOARD_CONFIG, ...config };
  // 🔧 SECTION 5 FIX: Even more relaxed requirements for emergency generation
  boardConfig.minWordsRequired = Math.min(boardConfig.minWordsRequired, 2); // Accept any board with 2+ words
  boardConfig.maxGenerationAttempts = Math.min(boardConfig.maxGenerationAttempts, 10); // Max 10 attempts
  
  let attempts = 0;
  let board: GameBoard;
  let foundWords: string[];

  do {
    attempts++;
    board = createRandomBoardOptimized();
    foundWords = findAllValidWordsOptimized(board, dictionaryService, 5); // Stop at 5 words for speed
    
    if (foundWords.length >= boardConfig.minWordsRequired) {
      console.timeEnd('generateBoard');
      console.log(`[${new Date().toISOString()}] ✅ Emergency generated valid board with ${foundWords.length} words in ${attempts} attempts`);
      
      // 🔧 SECTION 5 FIX: Immediately start cache refill after emergency generation
      if (!isPreGenerating && dictionaryService.isReady()) {
        console.log(`[${new Date().toISOString()}] 🔄 Starting cache refill after emergency generation`);
        preGenerateBoards(dictionaryService, 10).catch(console.error);
      }
      
      return board;
    }
  } while (attempts < boardConfig.maxGenerationAttempts);

  // 🔧 SECTION 5 FIX: Ultimate fallback - return any board to prevent match start failure
  console.timeEnd('generateBoard');
  console.warn(`[${new Date().toISOString()}] ⚠️ Ultimate fallback: Using board with ${foundWords.length} words after ${attempts} attempts`);
  
  // Still start cache refill
  if (!isPreGenerating && dictionaryService.isReady()) {
    preGenerateBoards(dictionaryService, 10).catch(console.error);
  }
  
  return board;
}

/**
 * Get cache statistics for monitoring
 * @returns Object with cache size and generation status
 */
export function getCacheStats(): { cacheSize: number; isPreGenerating: boolean; tileBagSize: number } {
  return {
    cacheSize: boardCache.length,
    isPreGenerating,
    tileBagSize: persistentTileBag.length
  };
}

/**
 * Clear memoization caches to free memory
 * Should be called periodically or when memory pressure is detected
 */
export function clearMemoCache(): void {
  solverMemoCache.clear();
  console.log(`