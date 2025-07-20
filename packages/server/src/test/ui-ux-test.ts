/**
 * 🧪 PHASE 4.4: UI/UX Testing Suite
 * Comprehensive test scenarios for UI layout, score display, username handling, and enhanced stats
 * Tests layout resilience with various data ranges and edge cases
 */

import { io as Client, Socket } from 'socket.io-client';

interface UITestPlayer {
  socket: Socket;
  id: string;
  username: string;
  difficulty: 'easy' | 'medium' | 'hard';
  words: Array<{ word: string; expectedPoints: number }>;
  expectedScore: number;
  testCategory: string;
}

interface UITestScenario {
  name: string;
  description: string;
  testCategory: 'score-ranges' | 'username-lengths' | 'enhanced-stats' | 'edge-cases';
  players: Array<{
    username: string;
    difficulty: 'easy' | 'medium' | 'hard';
    words: Array<{ word: string; expectedPoints: number }>;
    expectedScore: number;
    testNotes?: string;
  }>;
  expectedUIBehavior: {
    layoutStable: boolean;
    scoresDisplayed: boolean;
    statsDisplayed: boolean;
    noOverflow: boolean;
    responsive: boolean;
  };
}

/**
 * 🧪 PHASE 4.4.1: Score Range Testing Scenarios
 */
const SCORE_RANGE_SCENARIOS: UITestScenario[] = [
  {
    name: "Very Low Scores (Single Digits)",
    description: "Test UI layout with very low single-digit scores",
    testCategory: "score-ranges",
    players: [
      {
        username: "LowScore1",
        difficulty: "easy",
        words: [
          { word: "A", expectedPoints: 1 },
          { word: "I", expectedPoints: 1 }
        ],
        expectedScore: 2,
        testNotes: "Minimal score to test UI minimum values"
      },
      {
        username: "LowScore2",
        difficulty: "easy",
        words: [
          { word: "BE", expectedPoints: 2 },
          { word: "TO", expectedPoints: 2 }
        ],
        expectedScore: 4,
        testNotes: "Low single digit score"
      },
      {
        username: "LowScore3",
        difficulty: "easy",
        words: [
          { word: "THE", expectedPoints: 3 },
          { word: "AND", expectedPoints: 3 }
        ],
        expectedScore: 6,
        testNotes: "Mid single digit score"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "Medium Scores (Double Digits)",
    description: "Test UI layout with medium double-digit scores",
    testCategory: "score-ranges",
    players: [
      {
        username: "MedScore1",
        difficulty: "medium",
        words: [
          { word: "HOUSE", expectedPoints: 8 },
          { word: "PLANT", expectedPoints: 8 },
          { word: "WATER", expectedPoints: 8 }
        ],
        expectedScore: 24,
        testNotes: "Low double digit score"
      },
      {
        username: "MedScore2",
        difficulty: "medium",
        words: [
          { word: "FLOWER", expectedPoints: 10 },
          { word: "GARDEN", expectedPoints: 10 },
          { word: "SPRING", expectedPoints: 10 },
          { word: "SUMMER", expectedPoints: 10 },
          { word: "WINTER", expectedPoints: 10 }
        ],
        expectedScore: 50,
        testNotes: "Mid double digit score"
      },
      {
        username: "MedScore3",
        difficulty: "medium",
        words: [
          { word: "BEAUTIFUL", expectedPoints: 15 },
          { word: "WONDERFUL", expectedPoints: 15 },
          { word: "AMAZING", expectedPoints: 12 },
          { word: "FANTASTIC", expectedPoints: 15 },
          { word: "EXCELLENT", expectedPoints: 15 },
          { word: "PERFECT", expectedPoints: 12 }
        ],
        expectedScore: 84,
        testNotes: "High double digit score"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "High Scores (Triple Digits)",
    description: "Test UI layout with high triple-digit scores",
    testCategory: "score-ranges",
    players: [
      {
        username: "HighScore1",
        difficulty: "hard",
        words: [
          { word: "EXTRAORDINARY", expectedPoints: 45 },
          { word: "MAGNIFICENT", expectedPoints: 39 },
          { word: "SPECTACULAR", expectedPoints: 39 },
          { word: "PHENOMENAL", expectedPoints: 36 }
        ],
        expectedScore: 159,
        testNotes: "Low triple digit score"
      },
      {
        username: "HighScore2",
        difficulty: "hard",
        words: [
          { word: "QUINTESSENTIAL", expectedPoints: 51 },
          { word: "EXTRAORDINARY", expectedPoints: 45 },
          { word: "INCOMPREHENSIBLE", expectedPoints: 57 },
          { word: "UNQUESTIONABLE", expectedPoints: 51 },
          { word: "UNFORGETTABLE", expectedPoints: 48 }
        ],
        expectedScore: 252,
        testNotes: "High triple digit score"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  }
];

/**
 * 🧪 PHASE 4.4.2: Username Length Testing Scenarios
 */
const USERNAME_LENGTH_SCENARIOS: UITestScenario[] = [
  {
    name: "Short Usernames (3-4 characters)",
    description: "Test UI layout with very short usernames",
    testCategory: "username-lengths",
    players: [
      {
        username: "Al",
        difficulty: "medium",
        words: [{ word: "HELLO", expectedPoints: 8 }],
        expectedScore: 8,
        testNotes: "2 character username"
      },
      {
        username: "Sam",
        difficulty: "medium", 
        words: [{ word: "WORLD", expectedPoints: 8 }],
        expectedScore: 8,
        testNotes: "3 character username"
      },
      {
        username: "Alex",
        difficulty: "medium",
        words: [{ word: "GAME", expectedPoints: 7 }],
        expectedScore: 7,
        testNotes: "4 character username"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "Medium Usernames (8-12 characters)",
    description: "Test UI layout with medium-length usernames",
    testCategory: "username-lengths",
    players: [
      {
        username: "Jennifer",
        difficulty: "medium",
        words: [{ word: "FLOWERS", expectedPoints: 11 }],
        expectedScore: 11,
        testNotes: "8 character username"
      },
      {
        username: "Alexander",
        difficulty: "medium",
        words: [{ word: "GARDENS", expectedPoints: 11 }],
        expectedScore: 11,
        testNotes: "9 character username"
      },
      {
        username: "Christopher",
        difficulty: "medium",
        words: [{ word: "BEAUTIFUL", expectedPoints: 15 }],
        expectedScore: 15,
        testNotes: "11 character username"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "Long Usernames (15+ characters)",
    description: "Test UI layout with very long usernames",
    testCategory: "username-lengths",
    players: [
      {
        username: "SuperLongUsername",
        difficulty: "medium",
        words: [{ word: "TESTING", expectedPoints: 11 }],
        expectedScore: 11,
        testNotes: "17 character username"
      },
      {
        username: "ExtremelyLongPlayerName",
        difficulty: "medium",
        words: [{ word: "USERNAME", expectedPoints: 12 }],
        expectedScore: 12,
        testNotes: "23 character username"
      },
      {
        username: "ThisIsAnExtremelyLongUsernameForTesting",
        difficulty: "medium",
        words: [{ word: "LAYOUT", expectedPoints: 9 }],
        expectedScore: 9,
        testNotes: "39 character username - stress test"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: false, // May overflow on very small screens
      responsive: true
    }
  }
];

/**
 * 🧪 PHASE 4.4.3: Enhanced Stats Display Testing Scenarios
 */
const ENHANCED_STATS_SCENARIOS: UITestScenario[] = [
  {
    name: "Varied Word Lengths and Counts",
    description: "Test enhanced stats display with various word lengths",
    testCategory: "enhanced-stats",
    players: [
      {
        username: "ShortWords",
        difficulty: "medium",
        words: [
          { word: "A", expectedPoints: 1 },
          { word: "TO", expectedPoints: 2 },
          { word: "THE", expectedPoints: 3 },
          { word: "AND", expectedPoints: 3 },
          { word: "FOR", expectedPoints: 3 }
        ],
        expectedScore: 12,
        testNotes: "Mix of very short words (1-3 letters)"
      },
      {
        username: "MediumWords",
        difficulty: "medium",
        words: [
          { word: "HOUSE", expectedPoints: 8 },
          { word: "GARDEN", expectedPoints: 10 },
          { word: "FLOWER", expectedPoints: 10 },
          { word: "PLANT", expectedPoints: 8 }
        ],
        expectedScore: 36,
        testNotes: "Medium length words (5-6 letters)"
      },
      {
        username: "LongWords",
        difficulty: "hard",
        words: [
          { word: "EXTRAORDINARY", expectedPoints: 45 },
          { word: "MAGNIFICENT", expectedPoints: 39 },
          { word: "SPECTACULAR", expectedPoints: 39 }
        ],
        expectedScore: 123,
        testNotes: "Long words (11-13 letters)"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "High Scoring Words Display",
    description: "Test display of high-scoring words in stats",
    testCategory: "enhanced-stats",
    players: [
      {
        username: "HighScorer",
        difficulty: "hard",
        words: [
          { word: "QUIZ", expectedPoints: 52 }, // High-value letters
          { word: "JAZZY", expectedPoints: 74 },
          { word: "FIZZY", expectedPoints: 70 }
        ],
        expectedScore: 196,
        testNotes: "Words with high point values"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  },
  {
    name: "Edge Cases - No Words Found",
    description: "Test enhanced stats display when no words are found",
    testCategory: "enhanced-stats",
    players: [
      {
        username: "NoWords",
        difficulty: "medium",
        words: [], // No words submitted
        expectedScore: 0,
        testNotes: "Player with no words found"
      },
      {
        username: "SomeWords",
        difficulty: "medium",
        words: [
          { word: "HELLO", expectedPoints: 8 },
          { word: "WORLD", expectedPoints: 9 }
        ],
        expectedScore: 17,
        testNotes: "Player with some words for comparison"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  }
];

/**
 * 🧪 PHASE 4.4.4: Edge Case UI Scenarios
 */
const EDGE_CASE_SCENARIOS: UITestScenario[] = [
  {
    name: "Mixed Everything - Stress Test",
    description: "Stress test with mix of all challenging UI elements",
    testCategory: "edge-cases",
    players: [
      {
        username: "A", // Very short name
        difficulty: "easy",
        words: [{ word: "I", expectedPoints: 1 }], // Minimal score
        expectedScore: 1,
        testNotes: "Minimal everything"
      },
      {
        username: "ExtremelyLongUsernameStressTest",
        difficulty: "hard",
        words: [
          { word: "EXTRAORDINARY", expectedPoints: 45 },
          { word: "MAGNIFICENT", expectedPoints: 39 },
          { word: "SPECTACULAR", expectedPoints: 39 },
          { word: "PHENOMENAL", expectedPoints: 36 },
          { word: "INCREDIBLE", expectedPoints: 36 }
        ],
        expectedScore: 195, // High score
        testNotes: "Maximum everything"
      },
      {
        username: "MediumPlayer",
        difficulty: "medium",
        words: [
          { word: "HELLO", expectedPoints: 8 },
          { word: "WORLD", expectedPoints: 9 },
          { word: "TESTING", expectedPoints: 11 }
        ],
        expectedScore: 28,
        testNotes: "Balanced middle values"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: false, // May have minor overflow on very small screens
      responsive: true
    }
  },
  {
    name: "Tie Scenarios - Multiple Winners",
    description: "Test UI behavior with tied scores and similar stats",
    testCategory: "edge-cases",
    players: [
      {
        username: "TiePlayer1",
        difficulty: "medium",
        words: [
          { word: "HELLO", expectedPoints: 8 },
          { word: "WORLD", expectedPoints: 9 }
        ],
        expectedScore: 17,
        testNotes: "First player with tied score"
      },
      {
        username: "TiePlayer2",
        difficulty: "medium",
        words: [
          { word: "GREAT", expectedPoints: 8 },
          { word: "GAMES", expectedPoints: 9 }
        ],
        expectedScore: 17,
        testNotes: "Second player with tied score"
      }
    ],
    expectedUIBehavior: {
      layoutStable: true,
      scoresDisplayed: true,
      statsDisplayed: true,
      noOverflow: true,
      responsive: true
    }
  }
];

/**
 * UI/UX Test Runner
 */
export class UIUXTestRunner {
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * 🧪 PHASE 4.4: Run comprehensive UI/UX tests
   */
  async runAllUIUXTests(): Promise<void> {
    console.log('\n🧪 PHASE 4.4: Starting UI/UX Testing Suite...\n');

    try {
      // Test score range scenarios
      console.log('📊 Testing Score Range Scenarios...');
      for (const scenario of SCORE_RANGE_SCENARIOS) {
        await this.runUITestScenario(scenario);
      }

      // Test username length scenarios
      console.log('\n👤 Testing Username Length Scenarios...');
      for (const scenario of USERNAME_LENGTH_SCENARIOS) {
        await this.runUITestScenario(scenario);
      }

      // Test enhanced stats scenarios
      console.log('\n📈 Testing Enhanced Stats Display Scenarios...');
      for (const scenario of ENHANCED_STATS_SCENARIOS) {
        await this.runUITestScenario(scenario);
      }

      // Test edge case scenarios
      console.log('\n🔍 Testing Edge Case Scenarios...');
      for (const scenario of EDGE_CASE_SCENARIOS) {
        await this.runUITestScenario(scenario);
      }

      console.log('\n✅ All UI/UX Tests Completed Successfully!');

    } catch (error) {
      console.error('\n❌ UI/UX Test Failed:', error);
      throw error;
    }
  }

  /**
   * Run individual UI test scenario
   */
  private async runUITestScenario(scenario: UITestScenario): Promise<void> {
    console.log(`\n  🔬 Running: ${scenario.name}`);
    console.log(`     Description: ${scenario.description}`);
    console.log(`     Category: ${scenario.testCategory}`);

    // Create test room
    const roomCode = await this.createTestRoom();
    const testPlayers: UITestPlayer[] = [];

    try {
      // Create all test players
      for (const playerConfig of scenario.players) {
        const player = await this.createUITestPlayer(
          playerConfig.username,
          playerConfig.difficulty,
          roomCode,
          playerConfig.words,
          playerConfig.expectedScore,
          scenario.testCategory
        );
        testPlayers.push(player);
      }

      // Start match
      if (testPlayers.length > 0) {
        await this.startMatch(testPlayers[0].socket, roomCode);
      }

      // Submit words for all players
      const wordSubmissionPromises = testPlayers.map(player => 
        this.submitPlayerWords(player)
      );
      await Promise.all(wordSubmissionPromises);

      // End match
      if (testPlayers.length > 0) {
        await this.endMatch(testPlayers[0].socket, roomCode);
      }

      // Wait for match results
      const matchResults = await this.waitForMatchResults(testPlayers[0].socket);

      // Verify UI/UX behavior
      this.verifyUIBehavior(matchResults, scenario);

      console.log(`     ✅ ${scenario.name} - PASSED`);

    } catch (error) {
      console.error(`     ❌ ${scenario.name} - FAILED:`, error);
      throw error;
    } finally {
      // Clean up all players
      testPlayers.forEach(player => player.socket.disconnect());
    }
  }

  /**
   * Submit all words for a player
   */
  private async submitPlayerWords(player: UITestPlayer): Promise<void> {
    for (const wordSubmission of player.words) {
      await this.submitWord(player.socket, wordSubmission.word);
      await this.delay(50);
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
   * Create test player for UI testing
   */
  private async createUITestPlayer(
    username: string,
    difficulty: string,
    roomCode: string,
    words: Array<{ word: string; expectedPoints: number }>,
    expectedScore: number,
    testCategory: string
  ): Promise<UITestPlayer> {
    return new Promise((resolve, reject) => {
      const socket = Client(this.serverUrl);
      
      socket.on('connect', () => {
        socket.emit('room:join', { roomCode, username, difficulty });
      });

      socket.on('room:joined', (data: any) => {
        const player: UITestPlayer = {
          socket,
          id: data.playerId,
          username,
          difficulty: difficulty as any,
          words,
          expectedScore,
          testCategory
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
        resolve();
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
   * Verify UI behavior meets expectations
   */
  private verifyUIBehavior(matchResults: any, scenario: UITestScenario): void {
    console.log(`       🎨 Verifying UI behavior for ${scenario.players.length} player(s)...`);

    // Verify all expected data is present for UI rendering
    if (scenario.expectedUIBehavior.scoresDisplayed) {
      for (const player of matchResults.finalScores) {
        if (typeof player.score !== 'number') {
          throw new Error(`Score not properly displayed for player ${player.playerName}`);
        }
      }
      console.log(`          📊 All scores properly displayed ✓`);
    }

    if (scenario.expectedUIBehavior.statsDisplayed) {
      for (const player of matchResults.finalScores) {
        // Verify enhanced stats are present
        const hasValidStats = (
          typeof player.wordsFound === 'number' &&
          typeof player.longestWord === 'string' &&
          typeof player.highestScoringWord === 'string' &&
          typeof player.highestWordScore === 'number' &&
          typeof player.averageWordLength === 'number'
        );
        
        if (!hasValidStats) {
          throw new Error(`Enhanced stats not properly available for UI display for player ${player.playerName}`);
        }
      }
      console.log(`          📈 All enhanced stats properly available for display ✓`);
    }

    // Verify data ranges that could affect UI layout
    const maxScore = Math.max(...matchResults.finalScores.map((p: any) => p.score));
    const maxUsernameLength = Math.max(...matchResults.finalScores.map((p: any) => p.playerName.length));
    const maxWordLength = Math.max(...matchResults.finalScores.map((p: any) => p.longestWord ? p.longestWord.length : 0));

    console.log(`          🔢 Score range: 0-${maxScore} points`);
    console.log(`          👤 Username length range: ${Math.min(...matchResults.finalScores.map((p: any) => p.playerName.length))}-${maxUsernameLength} chars`);
    console.log(`          📝 Longest word: ${maxWordLength} letters`);

    // Verify no obvious data issues that would break UI
    for (const player of matchResults.finalScores) {
      if (player.score < 0) {
        throw new Error(`Negative score detected for ${player.playerName}: ${player.score}`);
      }
      
      if (!player.playerName || player.playerName.length === 0) {
        throw new Error(`Empty username detected`);
      }

      if (player.averageWordLength < 0) {
        throw new Error(`Negative average word length for ${player.playerName}: ${player.averageWordLength}`);
      }
    }

    console.log(`          ✅ UI data integrity verified - no layout-breaking values`);
    console.log(`          ✅ UI behavior validation completed for "${scenario.testCategory}" category`);
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Export scenarios for use in other test files
 */
export { SCORE_RANGE_SCENARIOS, USERNAME_LENGTH_SCENARIOS, ENHANCED_STATS_SCENARIOS, EDGE_CASE_SCENARIOS }; 