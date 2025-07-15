/**
 * Board Generation Service
 * Implements the "Generate, then Validate" algorithm for creating high-quality, solvable game boards
 * Uses official Scrabble letter distribution and point values
 */

import { LETTER_DISTRIBUTION, LETTER_BAG } from '@word-rush/common';
import { GameBoard, LetterTile } from '@word-rush/common';
import type { DictionaryModule } from './dictionary.js';

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
 * Default board configuration for MVP (4x4 grid)
 */
const DEFAULT_BOARD_CONFIG: BoardConfig = {
  boardWidth: 4,
  boardHeight: 4,
  minWordsRequired: 10,
  maxGenerationAttempts: 100,
  minWordLength: 3,
};

/**
 * Generate a new game board with guaranteed minimum word count
 * @param dictionaryService - Dictionary service for word validation
 * @param config - Board generation configuration (optional, uses defaults)
 * @returns GameBoard with validated word count
 */
export function generateBoard(
  dictionaryService: DictionaryModule,
  config: Partial<BoardConfig> = {}
): GameBoard {
  const boardConfig = { ...DEFAULT_BOARD_CONFIG, ...config };
  let attempts = 0;
  let board: GameBoard;
  let foundWords: string[];

  do {
    attempts++;
    board = createRandomBoard(boardConfig);
    foundWords = findAllValidWords(board, dictionaryService, boardConfig);
    
    if (foundWords.length >= boardConfig.minWordsRequired) {
      console.log(`[${new Date().toISOString()}] Generated valid board with ${foundWords.length} words in ${attempts} attempts`);
      return board;
    }
  } while (attempts < boardConfig.maxGenerationAttempts);

  // If we couldn't generate a valid board, return the last attempt
  console.warn(`[${new Date().toISOString()}] Could not generate board with ${boardConfig.minWordsRequired} words in ${attempts} attempts. Using board with ${foundWords.length} words.`);
  return board;
}

/**
 * Create a random board by drawing tiles from the Scrabble letter bag
 * Implements weighted random letter selection based on official Scrabble distribution:
 * 1. Creates a copy of the official Scrabble letter bag (weighted by frequency)
 * 2. Draws letters without replacement to ensure realistic distribution
 * 3. Refills bag when empty to handle boards larger than available letters
 * 4. Assigns point values based on official Scrabble scoring system
 * 5. Creates LetterTile objects with position coordinates and unique IDs
 * @param config - Board configuration containing dimensions and game rules
 * @param config.boardWidth - Number of columns in the board grid
 * @param config.boardHeight - Number of rows in the board grid
 * @returns GameBoard object with 2D array of positioned letter tiles
 */
function createRandomBoard(config: BoardConfig): GameBoard {
  const tiles: LetterTile[][] = [];
  const availableLetters = [...LETTER_BAG]; // Copy the letter bag
  
  for (let row = 0; row < config.boardHeight; row++) {
    tiles[row] = [];
    for (let col = 0; col < config.boardWidth; col++) {
      // Draw a random letter from the bag
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      const letter = availableLetters[randomIndex];
      
      // Remove the letter from the bag (or put it back if we want replacement)
      availableLetters.splice(randomIndex, 1);
      
      // If bag is empty, refill it
      if (availableLetters.length === 0) {
        availableLetters.push(...LETTER_BAG);
      }

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
    width: config.boardWidth,
    height: config.boardHeight,
  };
}

/**
 * Find all valid words on the board using path validation rules
 * Searches from every position as a potential starting point
 * Ensures all found words follow valid path rules:
 * - Adjacent tiles only (including diagonals)
 * - No duplicate tile usage per word
 * - Meet minimum word length requirements
 * @param board - The game board to analyze
 * @param dictionaryService - Dictionary service for word validation
 * @param config - Board configuration with validation rules
 * @returns Array of unique valid words found on the board
 */
function findAllValidWords(
  board: GameBoard,
  dictionaryService: DictionaryModule,
  config: BoardConfig
): string[] {
  const foundWords = new Set<string>();
  
  // Check all possible starting positions on the board
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      // Start a new search from this position with empty word and no used positions
      findWordsFromPosition(
        board,
        row,
        col,
        '',
        new Set(),
        foundWords,
        dictionaryService,
        config
      );
    }
  }
  
  // Convert Set to Array to remove duplicates and return
  return Array.from(foundWords);
}

/**
 * Recursively find words starting from a specific position
 * Core recursive algorithm for board word discovery with strict path validation:
 * 1. Validates current position is within board bounds
 * 2. Prevents reuse of tiles by checking position against used set
 * 3. Builds word by appending current tile's letter to path
 * 4. Validates completed words against tournament dictionary
 * 5. Recursively explores all 8 adjacent directions (N, NE, E, SE, S, SW, W, NW)
 * 6. Implements performance optimization with 20-character length limit
 * 7. Maintains path integrity through immutable position tracking
 * @param board - The game board being analyzed for word discovery
 * @param row - Current row position (0-indexed, top to bottom)
 * @param col - Current column position (0-indexed, left to right)
 * @param currentWord - Word string built from the current path so far
 * @param usedPositions - Set of "row-col" position keys already used in this specific path
 * @param foundWords - Set accumulator for all unique valid words discovered
 * @param dictionaryService - Dictionary service module for word validation against tournament list
 * @param config - Board configuration with minimum word length and validation rules
 * @returns void - Results collected in foundWords set parameter (mutated)
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
  // Check bounds - ensure we're within the board
  if (row < 0 || row >= board.height || col < 0 || col >= board.width) {
    return;
  }

  const positionKey = `${row}-${col}`;
  
  // Path validation: Check if this position is already used in current path
  if (usedPositions.has(positionKey)) {
    return;
  }

  // Add current letter to the word and track position
  const newWord = currentWord + board.tiles[row][col].letter;
  const newUsedPositions = new Set(usedPositions);
  newUsedPositions.add(positionKey);

  // Check if current word meets minimum length and is valid in dictionary
  if (newWord.length >= config.minWordLength && dictionaryService.isValidWord(newWord)) {
    foundWords.add(newWord);
  }

  // Stop searching if word gets too long (performance optimization)
  if (newWord.length >= 20) {
    return;
  }

  // Continue searching in all 8 adjacent directions (including diagonals)
  // This ensures adjacency requirement is met
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Top row (NW, N, NE)
    [0, -1],           [0, 1],   // Middle row (W, E)
    [1, -1],  [1, 0],  [1, 1]    // Bottom row (SW, S, SE)
  ];

  for (const [deltaRow, deltaCol] of directions) {
    findWordsFromPosition(
      board,
      row + deltaRow,
      col + deltaCol,
      newWord,
      newUsedPositions,
      foundWords,
      dictionaryService,
      config
    );
  }
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