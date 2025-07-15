/**
 * Dictionary Service for Word Validation
 * Loads the official tournament word list into memory for fast O(1) lookups
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Dictionary service state and functions
 */
export interface DictionaryModule {
  isValidWord: (word: string) => boolean;
  getWordCount: () => number;
  isReady: () => boolean;
  getWordsStartingWith: (prefix: string, limit?: number) => string[];
}

/**
 * Load the tournament word list into memory
 * @returns Dictionary service module with all functions
 * @throws Error if the dictionary fails to load
 */
function createDictionaryService(): DictionaryModule {
  const wordSet: Set<string> = new Set();
  let isLoaded = false;

  /**
   * Load the tournament word list into memory
   * @throws Error if the dictionary file cannot be read or parsed
   */
  function loadWordList(): void {
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
      words.forEach(word => wordSet.add(word));
      
      isLoaded = true;
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
   * @throws Error if the dictionary is not loaded
   */
  function isValidWord(word: string): boolean {
    if (!isLoaded) {
      throw new Error('Dictionary not loaded');
    }
    
    // Convert to uppercase for consistent lookup
    const normalizedWord = word.trim().toUpperCase();
    
    // Basic validation - must be at least 2 characters
    if (normalizedWord.length < 2) {
      return false;
    }
    
    // Check if word exists in the tournament word list
    return wordSet.has(normalizedWord);
  }

  /**
   * Get the total number of words in the dictionary
   * @returns The number of words loaded in the dictionary
   */
  function getWordCount(): number {
    return wordSet.size;
  }

  /**
   * Check if the dictionary is loaded and ready
   * @returns True if the dictionary has been successfully loaded
   */
  function isReady(): boolean {
    return isLoaded;
  }

  /**
   * Get words that start with a specific prefix (for debugging/testing)
   * @param prefix - The prefix to search for (case insensitive)
   * @param limit - Maximum number of words to return (default: 10)
   * @returns Array of words that start with the given prefix, sorted alphabetically
   */
  function getWordsStartingWith(prefix: string, limit: number = 10): string[] {
    if (!isLoaded) {
      return [];
    }
    
    const normalizedPrefix = prefix.trim().toUpperCase();
    const results: string[] = [];
    
    for (const word of wordSet) {
      if (word.startsWith(normalizedPrefix)) {
        results.push(word);
        if (results.length >= limit) {
          break;
        }
      }
    }
    
    return results.sort();
  }

  // Initialize the dictionary on creation
  loadWordList();

  // Return the public API
  return {
    isValidWord,
    getWordCount,
    isReady,
    getWordsStartingWith,
  };
}

// Create and export the dictionary service instance
export const dictionaryService = createDictionaryService(); 