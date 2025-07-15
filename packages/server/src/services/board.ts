/**
 * Board Generation Service
 * Implements the "Generate, then Validate" algorithm for creating high-quality, solvable game boards
 * Uses official Scrabble letter distribution and point values
 */

import { LETTER_DISTRIBUTION, LETTER_BAG } from '@word-rush/common';
import { GameBoard, LetterTile } from '@word-rush/common';
import { DictionaryService } from './dictionary.js';

export class BoardService {
  private dictionaryService: DictionaryService;
  private readonly boardWidth = 4; // MVP uses 4x4 grid
  private readonly boardHeight = 4;
  private readonly minWordsRequired = 10; // Minimum words for a valid board
  private readonly maxGenerationAttempts = 100; // Prevent infinite loops
  private readonly minWordLength = 3; // Minimum word length for board validation

  constructor(dictionaryService: DictionaryService) {
    this.dictionaryService = dictionaryService;
  }

  /**
   * Generate a new game board with guaranteed minimum word count
   */
  generateBoard(): GameBoard {
    let attempts = 0;
    let board: GameBoard;
    let foundWords: string[];

    do {
      attempts++;
      board = this.createRandomBoard();
      foundWords = this.findAllValidWords(board);
      
      if (foundWords.length >= this.minWordsRequired) {
        console.log(`[${new Date().toISOString()}] Generated valid board with ${foundWords.length} words in ${attempts} attempts`);
        return board;
      }
    } while (attempts < this.maxGenerationAttempts);

    // If we couldn't generate a valid board, return the last attempt
    console.warn(`[${new Date().toISOString()}] Could not generate board with ${this.minWordsRequired} words in ${attempts} attempts. Using board with ${foundWords.length} words.`);
    return board;
  }

  /**
   * Create a random board by drawing tiles from the Scrabble letter bag
   */
  private createRandomBoard(): GameBoard {
    const tiles: LetterTile[][] = [];
    const availableLetters = [...LETTER_BAG]; // Copy the letter bag
    
    for (let row = 0; row < this.boardHeight; row++) {
      tiles[row] = [];
      for (let col = 0; col < this.boardWidth; col++) {
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
      width: this.boardWidth,
      height: this.boardHeight,
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
   * @returns Array of unique valid words found on the board
   */
  private findAllValidWords(board: GameBoard): string[] {
    const foundWords = new Set<string>();
    
    // Check all possible starting positions on the board
    for (let row = 0; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        // Start a new search from this position with empty word and no used positions
        this.findWordsFromPosition(board, row, col, '', new Set(), foundWords);
      }
    }
    
    // Convert Set to Array to remove duplicates and return
    return Array.from(foundWords);
  }

  /**
   * Recursively find words starting from a specific position
   * Implements path validation rules:
   * - No position can be reused in a single word path
   * - Each step must be adjacent (including diagonally)
   * - Words must meet minimum length requirement
   * @param board - The game board to search
   * @param row - Current row position (0-indexed)
   * @param col - Current column position (0-indexed)
   * @param currentWord - Word built so far in this path
   * @param usedPositions - Set of position keys already used in this path
   * @param foundWords - Set to collect all valid words found
   */
  private findWordsFromPosition(
    board: GameBoard,
    row: number,
    col: number,
    currentWord: string,
    usedPositions: Set<string>,
    foundWords: Set<string>
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
    if (newWord.length >= this.minWordLength && this.dictionaryService.isValidWord(newWord)) {
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
      this.findWordsFromPosition(
        board,
        row + deltaRow,
        col + deltaCol,
        newWord,
        newUsedPositions,
        foundWords
      );
    }
  }

  /**
   * Get the point value for a letter based on Scrabble scoring
   * @param letter - The letter to get points for (case insensitive)
   * @returns The point value of the letter (1-10)
   */
  getLetterPoints(letter: string): number {
    return LETTER_DISTRIBUTION[letter as keyof typeof LETTER_DISTRIBUTION]?.points || 1;
  }

  /**
   * Calculate the total score for a word based on letter point values
   * @param word - The word to calculate score for
   * @returns The total point value of the word
   */
  calculateWordScore(word: string): number {
    return word.split('').reduce((score, letter) => {
      return score + this.getLetterPoints(letter);
    }, 0);
  }
} 