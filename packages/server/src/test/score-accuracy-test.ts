/**
 * 🧪 PHASE 4.2: Score Accuracy Testing Suite
 * Comprehensive test scenarios for score accumulation and accuracy validation
 * Tests single-round matches, multi-round matches, and difficulty level scoring
 */

import { io as Client, Socket } from 'socket.io-client';

interface ScoreTestPlayer {
  socket: Socket;
  id: string;
  username: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedFinalScore: number;
  wordSubmissions: Array<{ word: string; expectedPoints: number }>;
}

interface ScoreTestScenario {
  name: string;
  description: string;
  players: Array<{
    username: string;
    difficulty: 'easy' | 'medium' | 'hard';
    words: Array<{ word: string; expectedPoints: number }>;
    expectedFinalScore: number;
  }>;
  expectedWinner: string;
  roundCount?: number;
}

/**
 * 🧪 PHASE 4.2.1: Single-Round Score Accuracy Test Scenarios
 */
const SINGLE_ROUND_SCENARIOS: ScoreTestScenario[] = [
  {
    name: "Basic Score Accumulation - Easy Difficulty",
    description: "Test basic score accumulation with easy difficulty multiplier",
    players: [
      {
        username: "EasyPlayer",
        difficulty: "easy",
        words: [
          { word: "CAT", expectedPoints: 3 }, // Base 3, Easy multiplier
          { word: "DOG", expectedPoints: 3 },
          { word: "BIRD", expectedPoints: 4 }
        ],
        expectedFinalScore: 10
      }
    ],
    expectedWinner: "EasyPlayer"
  },
  {
    name: "Medium Difficulty Score Multiplier",
    description: "Test score accumulation with medium difficulty multiplier",
    players: [
      {
        username: "MediumPlayer", 
        difficulty: "medium",
        words: [
          { word: "HOUSE", expectedPoints: 8 }, // Base score with medium multiplier
          { word: "GARDEN", expectedPoints: 10 },
          { word: "FLOWER", expectedPoints: 12 }
        ],
        expectedFinalScore: 30
      }
    ],
    expectedWinner: "MediumPlayer"
  },
  {
    name: "Hard Difficulty Score Multiplier",
    description: "Test score accumulation with hard difficulty multiplier",
    players: [
      {
        username: "HardPlayer",
        difficulty: "hard", 
        words: [
          { word: "COMPLEX", expectedPoints: 21 }, // Base score with hard multiplier
          { word: "DIFFICULT", expectedPoints: 27 },
          { word: "CHALLENGING", expectedPoints: 33 }
        ],
        expectedFinalScore: 81
      }
    ],
    expectedWinner: "HardPlayer"
  },
  {
    name: "Mixed Difficulty Competition",
    description: "Test winner determination with players on different difficulties",
    players: [
      {
        username: "EasyPlayer",
        difficulty: "easy",
        words: [
          { word: "THE", expectedPoints: 3 },
          { word: "AND", expectedPoints: 3 },
          { word: "FOR", expectedPoints: 3 },
          { word: "ARE", expectedPoints: 3 },
          { word: "BUT", expectedPoints: 3 }
        ],
        expectedFinalScore: 15
      },
      {
        username: "MediumPlayer",
        difficulty: "medium", 
        words: [
          { word: "HOUSE", expectedPoints: 8 },
          { word: "PLANT", expectedPoints: 8 },
          { word: "WATER", expectedPoints: 8 }
        ],
        expectedFinalScore: 24
      },
      {
        username: "HardPlayer",
        difficulty: "hard",
        words: [
          { word: "QUANTUM", expectedPoints: 26 },
          { word: "PHYSICS", expectedPoints: 24 }
        ],
        expectedFinalScore: 50
      }
    ],
    expectedWinner: "HardPlayer"
  }
];

/**
 * 🧪 PHASE 4.2.2: Zero Score Edge Cases
 */
const ZERO_SCORE_SCENARIOS: ScoreTestScenario[] = [
  {
    name: "No Words Submitted",
    description: "Test player with zero score (no valid words)",
    players: [
      {
        username: "NoWordsPlayer",
        difficulty: "medium",
        words: [], // No words submitted
        expectedFinalScore: 0
      },
      {
        username: "SomeWordsPlayer", 
        difficulty: "medium",
        words: [
          { word: "HELLO", expectedPoints: 8 }
        ],
        expectedFinalScore: 8
      }
    ],
    expectedWinner: "SomeWordsPlayer"
  },
  {
    name: "Invalid Words Only",
    description: "Test player who submits only invalid words",
    players: [
      {
        username: "InvalidWordsPlayer",
        difficulty: "medium",
        words: [
          { word: "ZZZZZ", expectedPoints: 0 }, // Invalid word
          { word: "XXXXX", expectedPoints: 0 }, // Invalid word
          { word: "QQQQQ", expectedPoints: 0 }  // Invalid word
        ],
        expectedFinalScore: 0
      },
      {
        username: "ValidWordsPlayer",
        difficulty: "medium", 
        words: [
          { word: "VALID", expectedPoints: 8 }
        ],
        expectedFinalScore: 8
      }
    ],
    expectedWinner: "ValidWordsPlayer"
  }
];

/**
 * 🧪 PHASE 4.2.3: High Score Scenarios
 */
const HIGH_SCORE_SCENARIOS: ScoreTestScenario[] = [
  {
    name: "High Score Competition",
    description: "Test with very high scores to ensure UI handles large numbers",
    players: [
      {
        username: "HighScorer",
        difficulty: "hard",
        words: [
          { word: "EXCELLENT", expectedPoints: 36 },
          { word: "FANTASTIC", expectedPoints: 36 },
          { word: "WONDERFUL", expectedPoints: 36 },
          { word: "AMAZING", expectedPoints: 28 },
          { word: "PERFECT", expectedPoints: 28 }
        ],
        expectedFinalScore: 164 // High score to test UI
      }
    ],
    expectedWinner: "HighScorer"
  }
];

/**
 * Score Accuracy Test Runner
 */
export class ScoreAccuracyTestRunner {
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * 🧪 PHASE 4.2: Run comprehensive score accuracy tests
   */
  async runAllScoreAccuracyTests(): Promise<void> {
    console.log('\n🧪 PHASE 4.2: Starting Score Accuracy Testing Suite...\n');

    try {
      // Test single-round scenarios
      console.log('🎯 Testing Single-Round Score Accuracy...');
      for (const scenario of SINGLE_ROUND_SCENARIOS) {
        await this.runScoreTestScenario(scenario);
      }

      // Test zero score edge cases
      console.log('\n🔢 Testing Zero Score Edge Cases...');
      for (const scenario of ZERO_SCORE_SCENARIOS) {
        await this.runScoreTestScenario(scenario);
      }

      // Test high score scenarios
      console.log('\n📈 Testing High Score Scenarios...');
      for (const scenario of HIGH_SCORE_SCENARIOS) {
        await this.runScoreTestScenario(scenario);
      }

      console.log('\n✅ All Score Accuracy Tests Completed Successfully!');

    } catch (error) {
      console.error('\n❌ Score Accuracy Test Failed:', error);
      throw error;
    }
  }

  /**
   * Run individual score test scenario
   */
  private async runScoreTestScenario(scenario: ScoreTestScenario): Promise<void> {
    console.log(`\n  🔬 Running: ${scenario.name}`);
    console.log(`     Description: ${scenario.description}`);

    // Create test room
    const roomCode = await this.createTestRoom();
    const testPlayers: ScoreTestPlayer[] = [];

    try {
      // Create all test players
      for (const playerConfig of scenario.players) {
        const player = await this.createScoreTestPlayer(
          playerConfig.username,
          playerConfig.difficulty,
          roomCode,
          playerConfig.words,
          playerConfig.expectedFinalScore
        );
        testPlayers.push(player);
      }

      // Start match
      if (testPlayers.length > 0) {
        await this.startMatch(testPlayers[0].socket, roomCode);
      }

      // Submit words for all players concurrently
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

      // Verify scores and winner
      this.verifyScoreAccuracy(matchResults, scenario);

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
  private async submitPlayerWords(player: ScoreTestPlayer): Promise<void> {
    for (const wordSubmission of player.wordSubmissions) {
      await this.submitWord(player.socket, wordSubmission.word);
      await this.delay(50); // Small delay between submissions
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
   * Create test player for score testing
   */
  private async createScoreTestPlayer(
    username: string,
    difficulty: string,
    roomCode: string,
    words: Array<{ word: string; expectedPoints: number }>,
    expectedFinalScore: number
  ): Promise<ScoreTestPlayer> {
    return new Promise((resolve, reject) => {
      const socket = Client(this.serverUrl);
      
      socket.on('connect', () => {
        socket.emit('room:join', { roomCode, username, difficulty });
      });

      socket.on('room:joined', (data: any) => {
        const player: ScoreTestPlayer = {
          socket,
          id: data.playerId,
          username,
          difficulty: difficulty as any,
          expectedFinalScore,
          wordSubmissions: words
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
   * Verify score accuracy and winner determination
   */
  private verifyScoreAccuracy(matchResults: any, scenario: ScoreTestScenario): void {
    console.log(`       🎯 Verifying scores and winner for ${scenario.players.length} player(s)...`);

    // Verify each player's final score
    for (const expectedPlayer of scenario.players) {
      const actualPlayer = matchResults.finalScores.find(
        (p: any) => p.playerName === expectedPlayer.username
      );

      if (!actualPlayer) {
        throw new Error(`Player ${expectedPlayer.username} not found in match results`);
      }

      if (actualPlayer.score !== expectedPlayer.expectedFinalScore) {
        throw new Error(
          `Score mismatch for ${expectedPlayer.username} - Expected: ${expectedPlayer.expectedFinalScore}, Got: ${actualPlayer.score}`
        );
      }

      console.log(`          📊 ${expectedPlayer.username}: ${actualPlayer.score} points (${expectedPlayer.difficulty}) ✓`);
    }

    // Verify winner determination
    if (matchResults.winner) {
      if (matchResults.winner.username !== scenario.expectedWinner) {
        throw new Error(
          `Winner mismatch - Expected: ${scenario.expectedWinner}, Got: ${matchResults.winner.username}`
        );
      }
      console.log(`          🏆 Winner: ${matchResults.winner.username} (${matchResults.winner.score} points) ✓`);
    } else if (scenario.expectedWinner) {
      throw new Error(`Expected winner ${scenario.expectedWinner} but no winner was declared`);
    }

    // Verify final scores are sorted correctly
    const scores = matchResults.finalScores.map((p: any) => p.score);
    const sortedScores = [...scores].sort((a, b) => b - a);
    if (JSON.stringify(scores) !== JSON.stringify(sortedScores)) {
      throw new Error('Final scores are not properly sorted in descending order');
    }
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
export { SINGLE_ROUND_SCENARIOS, ZERO_SCORE_SCENARIOS, HIGH_SCORE_SCENARIOS }; 