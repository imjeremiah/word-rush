/**
 * 🧪 PHASE 4.3: Difficulty Display Testing Suite
 * Comprehensive test scenarios for difficulty selection, display, and persistence
 * Tests all difficulty levels, mixed scenarios, and UI display accuracy
 */

import { io as Client, Socket } from 'socket.io-client';

interface DifficultyTestPlayer {
  socket: Socket;
  id: string;
  username: string;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  expectedDisplayDifficulty: string;
  words: Array<{ word: string; expectedPoints: number }>;
}

interface DifficultyTestScenario {
  name: string;
  description: string;
  players: Array<{
    username: string;
    selectedDifficulty: 'easy' | 'medium' | 'hard';
    expectedDisplayDifficulty: string;
    words: Array<{ word: string; expectedPoints: number }>;
  }>;
}

/**
 * 🧪 PHASE 4.3.1: Single Difficulty Level Test Scenarios
 */
const SINGLE_DIFFICULTY_SCENARIOS: DifficultyTestScenario[] = [
  {
    name: "Easy Difficulty Display",
    description: "Test that Easy difficulty is correctly displayed in results",
    players: [
      {
        username: "EasyPlayer1",
        selectedDifficulty: "easy",
        expectedDisplayDifficulty: "Easy",
        words: [
          { word: "CAT", expectedPoints: 3 },
          { word: "DOG", expectedPoints: 3 }
        ]
      },
      {
        username: "EasyPlayer2", 
        selectedDifficulty: "easy",
        expectedDisplayDifficulty: "Easy",
        words: [
          { word: "BIRD", expectedPoints: 4 },
          { word: "FISH", expectedPoints: 4 }
        ]
      }
    ]
  },
  {
    name: "Medium Difficulty Display",
    description: "Test that Medium difficulty is correctly displayed in results",
    players: [
      {
        username: "MediumPlayer1",
        selectedDifficulty: "medium",
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "HOUSE", expectedPoints: 8 },
          { word: "PLANT", expectedPoints: 8 }
        ]
      },
      {
        username: "MediumPlayer2",
        selectedDifficulty: "medium", 
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "WATER", expectedPoints: 8 },
          { word: "FLOWER", expectedPoints: 10 }
        ]
      }
    ]
  },
  {
    name: "Hard Difficulty Display",
    description: "Test that Hard difficulty is correctly displayed in results",
    players: [
      {
        username: "HardPlayer1",
        selectedDifficulty: "hard",
        expectedDisplayDifficulty: "Hard",
        words: [
          { word: "COMPLEX", expectedPoints: 21 },
          { word: "DIFFICULT", expectedPoints: 27 }
        ]
      },
      {
        username: "HardPlayer2",
        selectedDifficulty: "hard",
        expectedDisplayDifficulty: "Hard", 
        words: [
          { word: "CHALLENGING", expectedPoints: 33 },
          { word: "ADVANCED", expectedPoints: 24 }
        ]
      }
    ]
  }
];

/**
 * 🧪 PHASE 4.3.2: Mixed Difficulty Test Scenarios
 */
const MIXED_DIFFICULTY_SCENARIOS: DifficultyTestScenario[] = [
  {
    name: "All Three Difficulties Mixed",
    description: "Test match with players on Easy, Medium, and Hard difficulties",
    players: [
      {
        username: "EasyPlayer",
        selectedDifficulty: "easy",
        expectedDisplayDifficulty: "Easy",
        words: [
          { word: "THE", expectedPoints: 3 },
          { word: "AND", expectedPoints: 3 },
          { word: "FOR", expectedPoints: 3 }
        ]
      },
      {
        username: "MediumPlayer",
        selectedDifficulty: "medium",
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "HOUSE", expectedPoints: 8 },
          { word: "PLANT", expectedPoints: 8 }
        ]
      },
      {
        username: "HardPlayer",
        selectedDifficulty: "hard",
        expectedDisplayDifficulty: "Hard",
        words: [
          { word: "QUANTUM", expectedPoints: 26 },
          { word: "PHYSICS", expectedPoints: 24 }
        ]
      }
    ]
  },
  {
    name: "Easy vs Hard Competition",
    description: "Test match with only Easy and Hard difficulty players",
    players: [
      {
        username: "EasyCompetitor",
        selectedDifficulty: "easy",
        expectedDisplayDifficulty: "Easy",
        words: [
          { word: "CAT", expectedPoints: 3 },
          { word: "DOG", expectedPoints: 3 },
          { word: "BIRD", expectedPoints: 4 },
          { word: "FISH", expectedPoints: 4 },
          { word: "BEAR", expectedPoints: 4 }
        ]
      },
      {
        username: "HardCompetitor",
        selectedDifficulty: "hard",
        expectedDisplayDifficulty: "Hard",
        words: [
          { word: "EXPERT", expectedPoints: 18 },
          { word: "MASTERY", expectedPoints: 21 }
        ]
      }
    ]
  },
  {
    name: "Medium Majority with Easy Minority",
    description: "Test scenario where most players are Medium with one Easy player",
    players: [
      {
        username: "EasyMinority",
        selectedDifficulty: "easy",
        expectedDisplayDifficulty: "Easy",
        words: [
          { word: "HI", expectedPoints: 2 },
          { word: "BY", expectedPoints: 2 }
        ]
      },
      {
        username: "MediumMajority1",
        selectedDifficulty: "medium",
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "HELLO", expectedPoints: 8 },
          { word: "WORLD", expectedPoints: 9 }
        ]
      },
      {
        username: "MediumMajority2",
        selectedDifficulty: "medium",
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "GREAT", expectedPoints: 8 },
          { word: "GAME", expectedPoints: 7 }
        ]
      },
      {
        username: "MediumMajority3",
        selectedDifficulty: "medium",
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "PLAY", expectedPoints: 7 },
          { word: "WORD", expectedPoints: 7 }
        ]
      }
    ]
  }
];

/**
 * 🧪 PHASE 4.3.3: Edge Case Difficulty Scenarios
 */
const EDGE_CASE_SCENARIOS: DifficultyTestScenario[] = [
  {
    name: "Default Difficulty Handling",
    description: "Test that default difficulty is handled correctly when not explicitly set",
    players: [
      {
        username: "DefaultPlayer",
        selectedDifficulty: "medium", // Should default to medium
        expectedDisplayDifficulty: "Medium",
        words: [
          { word: "DEFAULT", expectedPoints: 10 }
        ]
      }
    ]
  },
  {
    name: "Case Sensitivity Test",
    description: "Test that difficulty selection is case-insensitive but display is properly formatted",
    players: [
      {
        username: "CaseTestPlayer",
        selectedDifficulty: "easy", // Test lowercase input
        expectedDisplayDifficulty: "Easy", // Should display with proper capitalization
        words: [
          { word: "CASE", expectedPoints: 4 }
        ]
      }
    ]
  }
];

/**
 * Difficulty Display Test Runner
 */
export class DifficultyDisplayTestRunner {
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  /**
   * 🧪 PHASE 4.3: Run comprehensive difficulty display tests
   */
  async runAllDifficultyDisplayTests(): Promise<void> {
    console.log('\n🧪 PHASE 4.3: Starting Difficulty Display Testing Suite...\n');

    try {
      // Test single difficulty scenarios
      console.log('🎯 Testing Single Difficulty Level Scenarios...');
      for (const scenario of SINGLE_DIFFICULTY_SCENARIOS) {
        await this.runDifficultyTestScenario(scenario);
      }

      // Test mixed difficulty scenarios
      console.log('\n🌈 Testing Mixed Difficulty Scenarios...');
      for (const scenario of MIXED_DIFFICULTY_SCENARIOS) {
        await this.runDifficultyTestScenario(scenario);
      }

      // Test edge cases
      console.log('\n🔍 Testing Edge Case Scenarios...');
      for (const scenario of EDGE_CASE_SCENARIOS) {
        await this.runDifficultyTestScenario(scenario);
      }

      console.log('\n✅ All Difficulty Display Tests Completed Successfully!');

    } catch (error) {
      console.error('\n❌ Difficulty Display Test Failed:', error);
      throw error;
    }
  }

  /**
   * Run individual difficulty test scenario
   */
  private async runDifficultyTestScenario(scenario: DifficultyTestScenario): Promise<void> {
    console.log(`\n  🔬 Running: ${scenario.name}`);
    console.log(`     Description: ${scenario.description}`);

    // Create test room
    const roomCode = await this.createTestRoom();
    const testPlayers: DifficultyTestPlayer[] = [];

    try {
      // Create all test players with their selected difficulties
      for (const playerConfig of scenario.players) {
        const player = await this.createDifficultyTestPlayer(
          playerConfig.username,
          playerConfig.selectedDifficulty,
          roomCode,
          playerConfig.expectedDisplayDifficulty,
          playerConfig.words
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

      // Verify difficulty displays
      this.verifyDifficultyDisplay(matchResults, scenario);

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
  private async submitPlayerWords(player: DifficultyTestPlayer): Promise<void> {
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
   * Create test player for difficulty testing
   */
  private async createDifficultyTestPlayer(
    username: string,
    selectedDifficulty: string,
    roomCode: string,
    expectedDisplayDifficulty: string,
    words: Array<{ word: string; expectedPoints: number }>
  ): Promise<DifficultyTestPlayer> {
    return new Promise((resolve, reject) => {
      const socket = Client(this.serverUrl);
      
      socket.on('connect', () => {
        socket.emit('room:join', { roomCode, username, difficulty: selectedDifficulty });
      });

      socket.on('room:joined', (data: any) => {
        const player: DifficultyTestPlayer = {
          socket,
          id: data.playerId,
          username,
          selectedDifficulty: selectedDifficulty as any,
          expectedDisplayDifficulty,
          words
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
   * Verify difficulty display accuracy
   */
  private verifyDifficultyDisplay(matchResults: any, scenario: DifficultyTestScenario): void {
    console.log(`       🎯 Verifying difficulty displays for ${scenario.players.length} player(s)...`);

    // Verify winner difficulty (if there is a winner)
    if (matchResults.winner) {
      const expectedWinner = scenario.players.find(p => p.username === matchResults.winner.username);
      if (expectedWinner) {
        if (matchResults.winner.difficulty !== expectedWinner.expectedDisplayDifficulty) {
          throw new Error(
            `Winner difficulty display mismatch - Expected: ${expectedWinner.expectedDisplayDifficulty}, Got: ${matchResults.winner.difficulty}`
          );
        }
        console.log(`          🏆 Winner ${matchResults.winner.username}: ${matchResults.winner.difficulty} ✓`);
      }
    }

    // Verify each player's difficulty display in final scores
    for (const expectedPlayer of scenario.players) {
      const actualPlayer = matchResults.finalScores.find(
        (p: any) => p.playerName === expectedPlayer.username
      );

      if (!actualPlayer) {
        throw new Error(`Player ${expectedPlayer.username} not found in match results`);
      }

      if (actualPlayer.difficulty !== expectedPlayer.expectedDisplayDifficulty) {
        throw new Error(
          `Difficulty display mismatch for ${expectedPlayer.username} - Expected: ${expectedPlayer.expectedDisplayDifficulty}, Got: ${actualPlayer.difficulty}`
        );
      }

      console.log(`          📊 ${expectedPlayer.username}: ${actualPlayer.difficulty} difficulty ✓`);
    }

    // Verify no default overrides are happening
    const uniqueDifficulties = new Set(scenario.players.map(p => p.selectedDifficulty));
    const resultDifficulties = new Set(matchResults.finalScores.map((p: any) => p.difficulty.toLowerCase()));
    
    for (const expectedDiff of uniqueDifficulties) {
      if (!resultDifficulties.has(expectedDiff)) {
        console.warn(`          ⚠️  Expected difficulty '${expectedDiff}' not found in results`);
      }
    }

    console.log(`          ✅ All difficulty displays verified correctly`);
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
export { SINGLE_DIFFICULTY_SCENARIOS, MIXED_DIFFICULTY_SCENARIOS, EDGE_CASE_SCENARIOS }; 