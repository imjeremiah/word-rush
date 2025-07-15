/**
 * Board Generation Service
 * Implements the "Generate, then Validate" algorithm for creating high-quality, solvable game boards
 * Uses official Scrabble letter distribution and point values
 */

import { LETTER_DISTRIBUTION, LETTER_BAG } from '@word-rush/common';
import { GameBoard, LetterTile } from '@word-rush/common';
import { DictionaryService } from './dictionary';

export class BoardService {
  private dictionaryService: DictionaryService;
  private readonly boardWidth = 4; // MVP uses 4x4 grid
  private readonly boardHeight = 4;
  private readonly minWordsRequired = 10; // Minimum words for a valid board
  private readonly maxGenerationAttempts = 100; // Prevent infinite loops

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
   * Find all valid words on the board (used for validation)
   */
  private findAllValidWords(board: GameBoard): string[] {
    const foundWords = new Set<string>();
    
    // Check all possible starting positions
    for (let row = 0; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        this.findWordsFromPosition(board, row, col, '', new Set(), foundWords);
      }
    }
    
    return Array.from(foundWords);
  }

  /**
   * Recursively find words starting from a specific position
   */
  private findWordsFromPosition(
    board: GameBoard,
    row: number,
    col: number,
    currentWord: string,
    usedPositions: Set<string>,
    foundWords: Set<string>
  ): void {
    // Check bounds
    if (row < 0 || row >= board.height || col < 0 || col >= board.width) {
      return;
    }

    const positionKey = `${row}-${col}`;
    
    // Check if this position is already used
    if (usedPositions.has(positionKey)) {
      return;
    }

    // Add current letter to the word
    const newWord = currentWord + board.tiles[row][col].letter;
    const newUsedPositions = new Set(usedPositions);
    newUsedPositions.add(positionKey);

    // Check if current word is valid (minimum 3 letters for MVP)
    if (newWord.length >= 3 && this.dictionaryService.isValidWord(newWord)) {
      foundWords.add(newWord);
    }

    // Continue searching in all 8 directions (including diagonals)
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
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
   * Get the point value for a letter
   */
  getLetterPoints(letter: string): number {
    return LETTER_DISTRIBUTION[letter as keyof typeof LETTER_DISTRIBUTION]?.points || 1;
  }

  /**
   * Calculate the score for a word
   */
  calculateWordScore(word: string): number {
    return word.split('').reduce((score, letter) => {
      return score + this.getLetterPoints(letter);
    }, 0);
  }
} 