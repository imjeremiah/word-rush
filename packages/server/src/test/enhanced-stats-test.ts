/**
 * 🧪 PHASE 4.1: Enhanced Stats Testing Suite
 * Comprehensive test scenarios for enhanced player statistics tracking
 * Tests word counting, longest word tracking, highest scoring word, and average word length
 */

import { io as Client, Socket } from 'socket.io-client';

interface TestPlayer {
  socket: Socket;
  id: string;
  username: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedStats: {
    wordsFound: number;
    longestWord: string;
    highestScoringWord: string;
    highestWordScore: number;
    averageWordLength: number;
  };
}

interface TestScenario {
  name: string;
  description: string;
  words: Array<{ word: string; expectedPoints: number }>;
  expectedFinalStats: {
    wordsFound: number;
    longestWord: string;
    highestScoringWord: string;
    highestWordScore: number;
    averageWordLength: number;
  };
}

/**
 * 🧪 PHASE 4.1.1: Word Counting Test Scenarios
 */
const WORD_COUNTING_SCENARIOS: TestScenario[] = [
  {
    name: "Basic Word Counting",
    description: "Submit multiple words and verify count increments correctly",
    words: [
      { word: "CAT", expectedPoints: 5 },
      { word: "DOG", expectedPoints: 5 },
      { word: "BIRD", expectedPoints: 7 },
      { word: "FISH", expectedPoints: 10 }
    ],
    expectedFinalStats: {
      wordsFound: 4,
      longestWord: "BIRD", // or "FISH" - both 4 letters, should be first found
      highestScoringWord: "FISH",
      highestWordScore: 10,
      averageWordLength: 3.5 // (3+3+4+4)/4 = 3.5
    }
  },
  {
    name: "Single Word Submission",
    description: "Test with only one word submitted",
    words: [
      { word: "HELLO", expectedPoints: 8 }
    ],
    expectedFinalStats: {
      wordsFound: 1,
      longestWord: "HELLO",
      highestScoringWord: "HELLO",
      highestWordScore: 8,
      averageWordLength: 5.0
    }
  },
  {
    name: "No Words Submitted",
    description: "Test edge case where no words are submitted",
    words: [],
    expectedFinalStats: {
      wordsFound: 0,
      longestWord: '',
      highestScoringWord: '',
      highestWordScore: 0,
      averageWordLength: 0
    }
  }
];

/**
 * 🧪 PHASE 4.1.2: Longest Word Tracking Test Scenarios
 */
const LONGEST_WORD_SCENARIOS: TestScenario[] = [
  {
    name: "Progressive Longest Words",
    description: "Submit words of increasing length to test tracking",
    words: [
      { word: "A", expectedPoints: 1 },
      { word: "TO", expectedPoints: 2 },
      { word: "THE", expectedPoints: 3 },
      { word: "WORD", expectedPoints: 7 },
      { word: "LONGER", expectedPoints: 7 },
      { word: "LONGEST", expectedPoints: 8 }
    ],
    expectedFinalStats: {
      wordsFound: 6,
      longestWord: "LONGEST", // 7 letters
      highestScoringWord: "LONGEST",
      highestWordScore: 8,
      averageWordLength: 3.83 // (1+2+3+4+6+7)/6 ≈ 3.83
    }
  },
  {
    name: "Tie Scenario - Multiple Same Length",
    description: "Test with multiple words of same maximum length",
    words: [
      { word: "FIRST", expectedPoints: 8 },
      { word: "SECOND", expectedPoints: 9 }, // Should not replace FIRST as longest
      { word: "THIRD", expectedPoints: 7 }
    ],
    expectedFinalStats: {
      wordsFound: 3,
      longestWord: "SECOND", // 6 letters, highest scoring of same length
      highestScoringWord: "SECOND",
      highestWordScore: 9,
      averageWordLength: 5.33 // (5+6+5)/3 ≈ 5.33
    }
  }
];

/**
 * 🧪 PHASE 4.1.3: Highest Scoring Word Test Scenarios
 */
const HIGHEST_SCORING_SCENARIOS: TestScenario[] = [
  {
    name: "Progressive Scoring Words",
    description: "Submit words with increasing point values",
    words: [
      { word: "LOW", expectedPoints: 3 },
      { word: "MID", expectedPoints: 5 },
      { word: "HIGH", expectedPoints: 12 },
      { word: "PEAK", expectedPoints: 15 }
    ],
    expectedFinalStats: {
      wordsFound: 4,
      longestWord: "HIGH", // 4 letters (tied with PEAK, but PEAK is longer submission)
      highestScoringWord: "PEAK",
      highestWordScore: 15,
      averageWordLength: 3.5 // (3+3+4+4)/4 = 3.5
    }
  },
  {
    name: "Score Tie Scenario",
    description: "Test with multiple words having same highest score",
    words: [
      { word: "FIRST", expectedPoints: 10 },
      { word: "SECOND", expectedPoints: 10 }, // Same score, should not replace
      { word: "LOWER", expectedPoints: 8 }
    ],
    expectedFinalStats: {
      wordsFound: 3,
      longestWord: "SECOND", // 6 letters
      highestScoringWord: "FIRST", // First word with highest score should be kept
      highestWordScore: 10,
      averageWordLength: 5.33 // (5+6+5)/3 ≈ 5.33
    }
  }
];

/**
 * 🧪 PHASE 4.1.4: Average Word Length Calculation Test Scenarios
 */
const AVERAGE_LENGTH_SCENARIOS: TestScenario[] = [
  {
    name: "Decimal Precision Test",
    description: "Test calculation with decimal precision",
    words: [
      { word: "A", expectedPoints: 1 },     // 1 letter
      { word: "BB", expectedPoints: 2 },    // 2 letters
      { word: "CCC", expectedPoints: 3 },   // 3 letters
      { word: "DDDD", expectedPoints: 4 },  // 4 letters
      { word: "EEEEE", expectedPoints: 5 }  // 5 letters
    ],
    expectedFinalStats: {
      wordsFound: 5,
      longestWord: "EEEEE",
      highestScoringWord: "EEEEE",
      highestWordScore: 5,
      averageWordLength: 3.0 // (1+2+3+4+5)/5 = 3.0
    }
  },
  {
    name: "Complex Average Calculation",
    description: "Test with various word lengths for complex average",
    words: [
      { word: "HI", expectedPoints: 2 },        // 2 letters
      { word: "HELLO", expectedPoints: 5 },     // 5 letters  
      { word: "GOODBYE", expectedPoints: 8 },   // 7 letters
      { word: "Y", expectedPoints: 1 }          // 1 letter
    ],
    expectedFinalStats: {
      wordsFound: 4,
      longestWord: "GOODBYE", // 7 letters
      highestScoringWord: "GOODBYE",
      highestWordScore: 8,
      averageWordLength: 3.75 // (2+5+7+1)/4 = 3.75
    }
  }
];

/**
 * Enhanced Stats Test Runner
 */
export class EnhancedStatsTestRunner {
  private serverUrl: string;
  private testPlayers: TestPlayer[] = [];

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * 🧪 PHASE 4.1: Run comprehensive enhanced stats tests
   */
  async runAllEnhancedStatsTests(): Promise<void> {
    console.log('\n🧪 PHASE 4.1: Starting Enhanced Stats Testing Suite...\n');

    try {
      // Test word counting scenarios
      console.log('📝 Testing Word Counting Scenarios...');
      for (const scenario of WORD_COUNTING_SCENARIOS) {
        await this.runTestScenario(scenario, 'easy');
      }

      // Test longest word tracking scenarios  
      console.log('\n📏 Testing Longest Word Tracking Scenarios...');
      for (const scenario of LONGEST_WORD_SCENARIOS) {
        await this.runTestScenario(scenario, 'medium');
      }

      // Test highest scoring word scenarios
      console.log('\n💎 Testing Highest Scoring Word Scenarios...');
      for (const scenario of HIGHEST_SCORING_SCENARIOS) {
        await this.runTestScenario(scenario, 'hard');
      }

      // Test average word length calculations
      console.log('\n📊 Testing Average Word Length Calculations...');
      for (const scenario of AVERAGE_LENGTH_SCENARIOS) {
        await this.runTestScenario(scenario, 'easy');
      }

      console.log('\n✅ All Enhanced Stats Tests Completed Successfully!');

    } catch (error) {
      console.error('\n❌ Enhanced Stats Test Failed:', error);
      throw error;
    }
  }

  /**
   * Run individual test scenario
   */
  private async runTestScenario(scenario: TestScenario, difficulty: string): Promise<void> {
    console.log(`\n  🔬 Running: ${scenario.name}`);
    console.log(`     Description: ${scenario.description}`);

    // Create test room and player
    const roomCode = await this.createTestRoom();
    const player = await this.createTestPlayer(`TestPlayer_${Date.now()}`, difficulty, roomCode);

    try {
      // Start match
      await this.startMatch(player.socket, roomCode);

      // Submit words according to scenario
      for (const wordSubmission of scenario.words) {
        await this.submitWord(player.socket, wordSubmission.word);
        await this.delay(100); // Small delay between submissions
      }

      // End match and verify results
      await this.endMatch(player.socket, roomCode);
      
      // Wait for match results
      const matchResults = await this.waitForMatchResults(player.socket);
      
      // Verify enhanced stats
      this.verifyEnhancedStats(matchResults, scenario.expectedFinalStats, scenario.name);

      console.log(`     ✅ ${scenario.name} - PASSED`);

    } catch (error) {
      console.error(`     ❌ ${scenario.name} - FAILED:`, error);
      throw error;
    } finally {
      // Clean up
      player.socket.disconnect();
    }
  }

  /**
   * Create test room
   */
  private async createTestRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = Client(this.serverUrl);
      
      socket.on('connect', () => {
        socket.emit('player:join', { username: 'TestHost', difficulty: 'medium' });
      });

      socket.on('room:created', (data: { roomCode: string }) => {
        socket.disconnect();
        resolve(data.roomCode);
      });

      socket.on('connect_error', reject);
      
      setTimeout(() => reject(new Error('Timeout creating test room')), 5000);
    });
  }

  /**
   * Create test player
   */
  private async createTestPlayer(username: string, difficulty: string, roomCode: string): Promise<TestPlayer> {
    return new Promise((resolve, reject) => {
      const socket = Client(this.serverUrl);
      
      socket.on('connect', () => {
        socket.emit('room:join', { roomCode, username, difficulty });
      });

      socket.on('room:joined', (data: any) => {
        const player: TestPlayer = {
          socket,
          id: data.playerId,
          username,
          difficulty: difficulty as any,
          expectedStats: {
            wordsFound: 0,
            longestWord: '',
            highestScoringWord: '',
            highestWordScore: 0,
            averageWordLength: 0
          }
        };
        resolve(player);
      });

      socket.on('connect_error', reject);
      
      setTimeout(() => reject(new Error('Timeout creating test player')), 5000);
    });
  }

  /**
   * Start match
   */
  private async startMatch(socket: Socket, roomCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      socket.emit('match:start', { roomCode });
      
      socket.on('match:started', () => {
        resolve();
      });
      
      setTimeout(() => reject(new Error('Timeout starting match')), 5000);
    });
  }

  /**
   * Submit word
   */
  private async submitWord(socket: Socket, word: string): Promise<void> {
    return new Promise((resolve, reject) => {
      socket.emit('word:submit', { word });
      
      // Listen for either success or failure
      const cleanup = () => {
        socket.off('word:accepted');
        socket.off('word:rejected');
      };

      socket.on('word:accepted', () => {
        cleanup();
        resolve();
      });

      socket.on('word:rejected', (data: any) => {
        cleanup();
        console.warn(`Word '${word}' rejected:`, data.reason);
        resolve(); // Continue test even if word is rejected
      });
      
      setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout submitting word: ${word}`));
      }, 3000);
    });
  }

  /**
   * End match
   */
  private async endMatch(socket: Socket, roomCode: string): Promise<void> {
    return new Promise((resolve) => {
      socket.emit('match:end', { roomCode });
      resolve();
    });
  }

  /**
   * Wait for match results
   */
  private async waitForMatchResults(socket: Socket): Promise<any> {
    return new Promise((resolve, reject) => {
      socket.on('match:finished', (data: any) => {
        resolve(data);
      });
      
      setTimeout(() => reject(new Error('Timeout waiting for match results')), 10000);
    });
  }

  /**
   * Verify enhanced stats match expectations
   */
  private verifyEnhancedStats(matchResults: any, expected: any, testName: string): void {
    const playerStats = matchResults.finalScores[0]; // Assuming single player test
    
    if (!playerStats) {
      throw new Error(`No player stats found in match results for test: ${testName}`);
    }

    // Verify words found count
    if (playerStats.wordsFound !== expected.wordsFound) {
      throw new Error(`Words found mismatch - Expected: ${expected.wordsFound}, Got: ${playerStats.wordsFound}`);
    }

    // Verify longest word
    if (playerStats.longestWord !== expected.longestWord) {
      throw new Error(`Longest word mismatch - Expected: "${expected.longestWord}", Got: "${playerStats.longestWord}"`);
    }

    // Verify highest scoring word
    if (playerStats.highestScoringWord !== expected.highestScoringWord) {
      throw new Error(`Highest scoring word mismatch - Expected: "${expected.highestScoringWord}", Got: "${playerStats.highestScoringWord}"`);
    }

    // Verify highest word score
    if (playerStats.highestWordScore !== expected.highestWordScore) {
      throw new Error(`Highest word score mismatch - Expected: ${expected.highestWordScore}, Got: ${playerStats.highestWordScore}`);
    }

    // Verify average word length (with tolerance for floating point precision)
    const averageDiff = Math.abs(playerStats.averageWordLength - expected.averageWordLength);
    if (averageDiff > 0.01) {
      throw new Error(`Average word length mismatch - Expected: ${expected.averageWordLength}, Got: ${playerStats.averageWordLength}`);
    }

    console.log(`       📊 Enhanced stats verified successfully`);
    console.log(`          Words Found: ${playerStats.wordsFound}`);
    console.log(`          Longest Word: "${playerStats.longestWord}"`);
    console.log(`          Best Word: "${playerStats.highestScoringWord}" (${playerStats.highestWordScore}pts)`);
    console.log(`          Avg Length: ${playerStats.averageWordLength.toFixed(2)} letters`);
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Export test runner for use in other test files
 */
export { WORD_COUNTING_SCENARIOS, LONGEST_WORD_SCENARIOS, HIGHEST_SCORING_SCENARIOS, AVERAGE_LENGTH_SCENARIOS }; 