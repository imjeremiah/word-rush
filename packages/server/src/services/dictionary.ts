/**
 * Dictionary Service for Word Validation
 * Loads the official tournament word list into memory for fast O(1) lookups
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export class DictionaryService {
  private wordSet: Set<string> = new Set();
  private isLoaded = false;

  constructor() {
    this.loadWordList();
  }

  /**
   * Load the tournament word list into memory
   */
  private loadWordList(): void {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const filePath = join(__dirname, '..', 'assets', 'TWL06.txt');
      const fileContent = readFileSync(filePath, 'utf-8');
      
      // Split into lines and filter out empty lines
      const words = fileContent
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(word => word.length > 0);

      // Add all words to the set for O(1) lookup
      words.forEach(word => this.wordSet.add(word));
      
      this.isLoaded = true;
      console.log(`[${new Date().toISOString()}] Dictionary loaded: ${words.length} words`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Failed to load dictionary:`, error);
      throw new Error('Failed to load tournament word list');
    }
  }

  /**
   * Check if a word is valid according to the tournament word list
   * @param word - The word to validate (case insensitive)
   * @returns True if the word exists in the tournament dictionary
   */
  isValidWord(word: string): boolean {
    if (!this.isLoaded) {
      throw new Error('Dictionary not loaded');
    }
    
    // Convert to uppercase for consistent lookup
    const normalizedWord = word.trim().toUpperCase();
    
    // Basic validation - must be at least 2 characters
    if (normalizedWord.length < 2) {
      return false;
    }
    
    // Check if word exists in the tournament word list
    return this.wordSet.has(normalizedWord);
  }

  /**
   * Get the total number of words in the dictionary
   */
  getWordCount(): number {
    return this.wordSet.size;
  }

  /**
   * Check if the dictionary is loaded and ready
   */
  isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Get words that start with a specific prefix (for debugging/testing)
   * @param prefix - The prefix to search for (case insensitive)
   * @param limit - Maximum number of words to return (default: 10)
   * @returns Array of words that start with the given prefix, sorted alphabetically
   */
  getWordsStartingWith(prefix: string, limit: number = 10): string[] {
    if (!this.isLoaded) {
      return [];
    }
    
    const normalizedPrefix = prefix.trim().toUpperCase();
    const results: string[] = [];
    
    for (const word of this.wordSet) {
      if (word.startsWith(normalizedPrefix)) {
        results.push(word);
        if (results.length >= limit) {
          break;
        }
      }
    }
    
    return results.sort();
  }
} 