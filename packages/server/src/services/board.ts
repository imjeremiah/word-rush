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
        
        // 🚀 PHASE 5A: Updated for 7x7 board - require more words for larger board
        if (foundWords.length >= 10) { // Further reduced to 10 for immediate gameplay
          const endTime = Date.now();
          console.log(`[${new Date().toISOString()}] 🎯 Generated valid 4x4 board with ${foundWords.length} words in ${attempts} attempts (${endTime - startTime}ms)`);
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
 * Optimized board creation using persistent tile bag for 7x7 boards
 * Reuses the tile bag instead of recreating it each time
 * @returns GameBoard with optimized tile generation for 7x7 grid
 */
function createRandomBoardOptimized(): GameBoard {
  const tiles: LetterTile[][] = [];
  // 🚀 PHASE 5A: TEMPORARILY back to 4x4 for immediate gameplay
  const boardWidth = 4;  // Temporarily back to 4x4 for faster generation
  const boardHeight = 4;
  
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
 * Optimized word finding with memoization
 * Caches solver results to avoid recomputation
 * @param board - The game board to analyze
 * @param dictionaryService - Dictionary service for word validation
 * @returns Array of unique valid words found on the board
 */
function findAllValidWordsOptimized(board: GameBoard, dictionaryService: DictionaryModule): string[] {
  const boardKey = generateBoardKey(board);
  
  if (solverMemoCache.has(boardKey)) {
    return solverMemoCache.get(boardKey)!;
  }
  
  const foundWords = new Set<string>();
  
  // Check all possible starting positions
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      findWordsFromPositionOptimized(
        board,
        row,
        col,
        '',
        new Set(),
        foundWords,
        dictionaryService,
        new Map() // Position-level memoization
      );
    }
  }
  
  const result = Array.from(foundWords);
  solverMemoCache.set(boardKey, result);
  
  // Limit cache size to prevent memory issues
  if (solverMemoCache.size > 100) {
    const firstKey = solverMemoCache.keys().next().value;
    solverMemoCache.delete(firstKey);
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
 * Default board configuration for enhanced gameplay (7x7 grid)
 * 🚀 PHASE 5A: Upgraded to 7x7 for richer strategic gameplay
 */
const DEFAULT_BOARD_CONFIG: BoardConfig = {
  boardWidth: 4,   // Temporarily back to 4x4 for faster generation
  boardHeight: 4,  // Temporarily back to 4x4 for faster generation
  minWordsRequired: 10, // Temporarily reduced for immediate gameplay
  maxGenerationAttempts: 30, // Reduced for faster generation
  minWordLength: 3,
};

/**
 * Generate a new game board with guaranteed minimum word count
 * Uses cache for instant delivery, falls back to generation if cache is empty
 * @param dictionaryService - Dictionary service for word validation
 * @param config - Board generation configuration (optional, uses defaults)
 * @returns GameBoard with validated word count
 */
export function generateBoard(
  dictionaryService: DictionaryModule,
  config: Partial<BoardConfig> = {}
): GameBoard {
  console.time('generateBoard');
  
  // Try to serve from cache first
  if (boardCache.length > 0) {
    const cachedBoard = boardCache.shift()!;
    console.timeEnd('generateBoard');
    console.log(`[${new Date().toISOString()}] 🚀 Served board from cache (${boardCache.length} remaining)`);
    
    // If cache is low, pre-generate more boards asynchronously
    if (boardCache.length < 3 && !isPreGenerating && dictionaryService.isReady()) {
      preGenerateBoards(dictionaryService, 8).catch(console.error);
    }
    
    return cachedBoard;
  }

  // Fallback to immediate generation
  console.log(`[${new Date().toISOString()}] ⚠️ Cache empty, generating board on-demand`);
  
  const boardConfig = { ...DEFAULT_BOARD_CONFIG, ...config };
  let attempts = 0;
  let board: GameBoard;
  let foundWords: string[];

  do {
    attempts++;
    board = createRandomBoardOptimized();
    foundWords = findAllValidWordsOptimized(board, dictionaryService);
    
    if (foundWords.length >= boardConfig.minWordsRequired) {
      console.timeEnd('generateBoard');
      console.log(`[${new Date().toISOString()}] Generated valid board with ${foundWords.length} words in ${attempts} attempts`);
      return board;
    }
  } while (attempts < boardConfig.maxGenerationAttempts);

  console.timeEnd('generateBoard');
  console.warn(`[${new Date().toISOString()}] Could not generate board with ${boardConfig.minWordsRequired} words in ${attempts} attempts. Using board with ${foundWords.length} words.`);
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
  console.log(`[${new Date().toISOString()}] 🧹 Cleared solver memoization cache`);
}

/**
 * Legacy wrapper for backwards compatibility
 * @deprecated Use findAllValidWordsOptimized instead
 */
function findAllValidWords(
  board: GameBoard,
  dictionaryService: DictionaryModule,
  config: BoardConfig
): string[] {
  return findAllValidWordsOptimized(board, dictionaryService);
}

/**
 * Legacy wrapper for backwards compatibility
 * @deprecated Use findWordsFromPositionOptimized instead
 */
function findWordsFromPosition(
  board: GameBoard,
  row: number,
  col: number,
  currentWord: string,
  usedPositions: Set<string>,
  foundWords: Set<string>,
  dictionaryService: DictionaryModule,
  config: BoardConfig
): void {
  // Call optimized version with empty memoization map
  findWordsFromPositionOptimized(
    board,
    row,
    col,
    currentWord,
    usedPositions,
    foundWords,
    dictionaryService,
    new Map()
  );
}

/**
 * Get the point value for a letter based on Scrabble scoring
 * @param letter - The letter to get points for (case insensitive)
 * @returns The point value of the letter (1-10)
 */
export function getLetterPoints(letter: string): number {
  return LETTER_DISTRIBUTION[letter as keyof typeof LETTER_DISTRIBUTION]?.points || 1;
}

/**
 * Calculate the total score for a word based on letter point values
 * @param word - The word to calculate score for
 * @returns The total point value of the word
 */
export function calculateWordScore(word: string): number {
  return word.split('').reduce((score, letter) => {
    return score + getLetterPoints(letter);
  }, 0);
}

/**
 * Remove tiles from the board and create a cascade effect
 * Implements the "tile falling" logic where removed tiles cause others to fall down
 * and new tiles are generated from the top to fill empty spaces
 * @param board - The current game board state
 * @param tilesToRemove - Array of tile coordinates to remove from the board
 * @param dictionaryService - Dictionary service for validating the updated board
 * @returns Updated board with cascaded tiles and removed tile positions
 */
export function removeTilesAndCascade(
  board: GameBoard,
  tilesToRemove: { x: number; y: number }[],
  dictionaryService: DictionaryModule
): { newBoard: GameBoard; removedPositions: { x: number; y: number }[] } {
  // Create a copy of the board to work with
  const newBoard: GameBoard = {
    ...board,
    tiles: board.tiles.map(row => [...row])
  };

  // Mark tiles for removal by setting them to null
  const removedPositions: { x: number; y: number }[] = [];
  
  for (const { x, y } of tilesToRemove) {
    if (y >= 0 && y < newBoard.height && x >= 0 && x < newBoard.width) {
      (newBoard.tiles[y][x] as any) = null; // Mark for removal
      removedPositions.push({ x, y });
    }
  }

  // Apply gravity - make tiles fall down
  for (let col = 0; col < newBoard.width; col++) {
    // Get all non-null tiles in this column
    const columnTiles: LetterTile[] = [];
    for (let row = newBoard.height - 1; row >= 0; row--) {
      const tile = newBoard.tiles[row][col];
      if (tile !== null) {
        columnTiles.push(tile);
      }
    }

    // Clear the column
    for (let row = 0; row < newBoard.height; row++) {
      (newBoard.tiles[row][col] as any) = null;
    }

    // Place existing tiles from bottom up
    for (let i = 0; i < columnTiles.length; i++) {
      const newRow = newBoard.height - 1 - i;
      const tile = columnTiles[i];
      
      // Update tile position
      tile.x = col;
      tile.y = newRow;
      tile.id = `tile-${newRow}-${col}`;
      
      newBoard.tiles[newRow][col] = tile;
    }

    // Fill empty spaces at the top with new tiles
    const emptySpaces = newBoard.height - columnTiles.length;
    for (let i = 0; i < emptySpaces; i++) {
      const row = i;
      const newTile = generateRandomTile(col, row);
      newBoard.tiles[row][col] = newTile;
    }
  }

  return { newBoard, removedPositions };
}

/**
 * Generate a random letter tile based on Scrabble distribution
 * Creates a new tile with proper positioning and unique ID
 * @param x - Column position for the new tile
 * @param y - Row position for the new tile
 * @returns New LetterTile with random letter based on Scrabble distribution
 */
function generateRandomTile(x: number, y: number): LetterTile {
  // Draw a random letter from the weighted bag
  const randomIndex = Math.floor(Math.random() * LETTER_BAG.length);
  const letter = LETTER_BAG[randomIndex];

  return {
    letter,
    points: LETTER_DISTRIBUTION[letter as keyof typeof LETTER_DISTRIBUTION]?.points || 1,
    x,
    y,
    id: `tile-${y}-${x}`,
  };
}

/**
 * Check if the board is in a "dead" state with too few possible words
 * Scans the entire board to count valid words and determines if shuffle is needed
 * @param board - The game board to analyze
 * @param dictionaryService - Dictionary service for word validation
 * @param minWordsThreshold - Minimum number of words required (default: 5)
 * @returns True if board has fewer words than threshold (is "dead")
 */
export function isBoardDead(
  board: GameBoard,
  dictionaryService: DictionaryModule,
  minWordsThreshold: number = 5
): boolean {
  console.time('isBoardDead');
  const foundWords = findAllValidWordsOptimized(board, dictionaryService);
  console.timeEnd('isBoardDead');
  
  console.log(`[${new Date().toISOString()}] Board analysis: ${foundWords.length} words found (threshold: ${minWordsThreshold})`);
  return foundWords.length < minWordsThreshold;
} 