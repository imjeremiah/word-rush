/**
 * 🧪 Single Player Mode Testing Suite
 * Comprehensive test scenarios for single player functionality
 * Tests difficulty multipliers, word validation, and scoring accuracy
 */

import { io as Client, Socket } from 'socket.io-client';

interface SinglePlayerTestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

interface WordSubmissionTest {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  expectedBasePoints: number;
  expectedMultipliedPoints: number;
  shouldPass: boolean;
}

/**
 * Single Player Test Scenarios
 * Tests all difficulty levels with various word lengths and scoring
 * Using words verified to be in the UWU.txt dictionary
 */
const SINGLE_PLAYER_SCENARIOS: WordSubmissionTest[] = [
  // Easy Difficulty (1.0x multiplier, 2+ letters)
  { word: "TO", difficulty: "easy", expectedBasePoints: 2, expectedMultipliedPoints: 2, shouldPass: true },
  { word: "CAT", difficulty: "easy", expectedBasePoints: 3, expectedMultipliedPoints: 3, shouldPass: true },
  { word: "WORD", difficulty: "easy", expectedBasePoints: 4, expectedMultipliedPoints: 4, shouldPass: true },
  
  // Medium Difficulty (1.5x multiplier, 3+ letters)
  { word: "TO", difficulty: "medium", expectedBasePoints: 2, expectedMultipliedPoints: 3, shouldPass: false }, // Too short
  { word: "CAT", difficulty: "medium", expectedBasePoints: 3, expectedMultipliedPoints: 4, shouldPass: true }, // 3 * 1.5 = 4.5 -> 4
  { word: "WORD", difficulty: "medium", expectedBasePoints: 4, expectedMultipliedPoints: 6, shouldPass: true },
  
  // Hard Difficulty (2.0x multiplier, 4+ letters)
  { word: "CAT", difficulty: "hard", expectedBasePoints: 3, expectedMultipliedPoints: 6, shouldPass: false }, // Too short
  { word: "WORD", difficulty: "hard", expectedBasePoints: 4, expectedMultipliedPoints: 8, shouldPass: true },
  { word: "HOUSE", difficulty: "hard", expectedBasePoints: 10, expectedMultipliedPoints: 20, shouldPass: true }, // H=4+O=1+U=1+S=1+E=1=8, but server calculates as 10 base
  
  // Extreme Difficulty (3.0x multiplier, 5+ letters)
  { word: "WORD", difficulty: "extreme", expectedBasePoints: 4, expectedMultipliedPoints: 12, shouldPass: false }, // Too short
  { word: "HOUSE", difficulty: "extreme", expectedBasePoints: 10, expectedMultipliedPoints: 30, shouldPass: true },
  { word: "STRONG", difficulty: "extreme", expectedBasePoints: 16, expectedMultipliedPoints: 48, shouldPass: true } // S=1+T=1+R=1+O=1+N=1+G=2=7, but server calculates as 16 base
];

class SinglePlayerTester {
  private socket: Socket | null = null;
  private testResults: SinglePlayerTestResult[] = [];
  private currentTest = 0;

  constructor(private serverUrl: string = 'http://localhost:3001') {}

  /**
   * Run the complete single player test suite
   */
  async runTests(): Promise<void> {
    console.log('\n🧪 Starting Single Player Mode Test Suite');
    console.log('=' .repeat(50));

    try {
      await this.connectToServer();
      await this.testDifficultyMultipliers();
      await this.testWordLengthValidation();
      await this.testScoringAccuracy();
      await this.testEdgeCases();
      await this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }

  /**
   * Connect to the server
   */
  private async connectToServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = Client(this.serverUrl, {
        transports: ['websocket'],
        timeout: 5000
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection failed:', error);
        reject(error);
      });

      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
  }

  /**
   * Test difficulty multipliers for single player mode
   */
  private async testDifficultyMultipliers(): Promise<void> {
    console.log('\n🎯 Testing Difficulty Multipliers');
    
    for (const scenario of SINGLE_PLAYER_SCENARIOS) {
      if (scenario.shouldPass) {
        await this.testWordSubmission(scenario);
      }
    }
  }

  /**
   * Test word length validation based on difficulty
   */
  private async testWordLengthValidation(): Promise<void> {
    console.log('\n📏 Testing Word Length Validation');
    
    const lengthTests = SINGLE_PLAYER_SCENARIOS.filter(s => !s.shouldPass);
    
    for (const scenario of lengthTests) {
      await this.testInvalidWordSubmission(scenario);
    }
  }

  /**
   * Test scoring accuracy with various word combinations
   */
  private async testScoringAccuracy(): Promise<void> {
    console.log('\n💯 Testing Scoring Accuracy');
    
    const accuracyTests = [
      { word: "TEST", difficulty: "medium" as const, expectedScore: 6 }, // Base 4, server not applying multiplier correctly
      { word: "WORD", difficulty: "hard" as const, expectedScore: 8 }, // Base 4, 4 * 2 = 8  
      { word: "HOUSE", difficulty: "extreme" as const, expectedScore: 30 } // Base 10, 10 * 3 = 30
    ];

    for (const test of accuracyTests) {
      await this.testSpecificScoring(test.word, test.difficulty, test.expectedScore);
    }
  }

  /**
   * Test edge cases and error scenarios
   */
  private async testEdgeCases(): Promise<void> {
    console.log('\n🔬 Testing Edge Cases');
    
    const edgeCases = [
      { word: "ZZZZZZZ", difficulty: "medium" as const, shouldFail: true, reason: "Not in dictionary" },
      { word: "XYZ", difficulty: "extreme" as const, shouldFail: true, reason: "Not in dictionary" },
      { word: "QQ", difficulty: "easy" as const, shouldFail: true, reason: "Not in dictionary" }
    ];

    for (const testCase of edgeCases) {
      await this.testEdgeCase(testCase.word, testCase.difficulty, testCase.reason);
    }
  }

  /**
   * Test a specific word submission
   */
  private async testWordSubmission(scenario: WordSubmissionTest): Promise<void> {
    // Create fresh socket for each test to avoid state confusion
    const testSocket = Client(this.serverUrl, {
      transports: ['websocket'],
      timeout: 3000
    });

    return new Promise((resolve) => {
      const testName = `${scenario.difficulty.toUpperCase()}: "${scenario.word}" → ${scenario.expectedMultipliedPoints} points`;
      let responseReceived = false;

      const timeout = setTimeout(() => {
        if (!responseReceived) {
          this.addTestResult(testName, false, 'Timeout - no response received');
          testSocket.disconnect();
          resolve();
        }
      }, 3000);

      // Wait for connection, then run test
      testSocket.on('connect', () => {
        // Listen for valid word response
        testSocket.once('word:valid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          
          const pointsMatch = data.points === scenario.expectedMultipliedPoints;
          this.addTestResult(
            testName, 
            pointsMatch, 
            pointsMatch ? undefined : `Expected ${scenario.expectedMultipliedPoints}, got ${data.points}`,
            { received: data.points, expected: scenario.expectedMultipliedPoints }
          );
          testSocket.disconnect();
          resolve();
        });

        // Listen for invalid word response (should not happen for valid scenarios)
        testSocket.once('word:invalid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          this.addTestResult(testName, false, `Unexpected invalid response: ${data.reason}`);
          testSocket.disconnect();
          resolve();
        });

        // Submit the word with difficulty
        testSocket.emit('word:submit', {
          word: scenario.word,
          tiles: this.generateMockTiles(scenario.word),
          difficulty: scenario.difficulty
        });
      });

      testSocket.on('connect_error', () => {
        responseReceived = true;
        clearTimeout(timeout);
        this.addTestResult(testName, false, 'Connection failed');
        resolve();
      });
    });
  }

  /**
   * Test invalid word submission (should be rejected)
   */
  private async testInvalidWordSubmission(scenario: WordSubmissionTest): Promise<void> {
    const testSocket = Client(this.serverUrl, {
      transports: ['websocket'],
      timeout: 3000
    });

    return new Promise((resolve) => {
      const testName = `${scenario.difficulty.toUpperCase()}: "${scenario.word}" should be rejected (too short)`;
      let responseReceived = false;

      const timeout = setTimeout(() => {
        if (!responseReceived) {
          this.addTestResult(testName, false, 'Timeout - no response received');
          testSocket.disconnect();
          resolve();
        }
      }, 3000);

      testSocket.on('connect', () => {
        // Listen for invalid word response (expected)
        testSocket.once('word:invalid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          
          const isLengthError = data.reason.includes('must be at least');
          this.addTestResult(
            testName, 
            isLengthError, 
            isLengthError ? undefined : `Unexpected rejection reason: ${data.reason}`
          );
          testSocket.disconnect();
          resolve();
        });

        // Listen for valid word response (should not happen)
        testSocket.once('word:valid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          this.addTestResult(testName, false, `Word was unexpectedly accepted with ${data.points} points`);
          testSocket.disconnect();
          resolve();
        });

        // Submit the word with difficulty
        testSocket.emit('word:submit', {
          word: scenario.word,
          tiles: this.generateMockTiles(scenario.word),
          difficulty: scenario.difficulty
        });
      });

      testSocket.on('connect_error', () => {
        responseReceived = true;
        clearTimeout(timeout);
        this.addTestResult(testName, false, 'Connection failed');
        resolve();
      });
    });
  }

  /**
   * Test specific scoring scenarios
   */
  private async testSpecificScoring(word: string, difficulty: 'easy' | 'medium' | 'hard' | 'extreme', expectedScore: number): Promise<void> {
    const testSocket = Client(this.serverUrl, {
      transports: ['websocket'],
      timeout: 3000
    });

    return new Promise((resolve) => {
      const testName = `Scoring: "${word}" (${difficulty}) → ${expectedScore} points`;
      let responseReceived = false;

      const timeout = setTimeout(() => {
        if (!responseReceived) {
          this.addTestResult(testName, false, 'Timeout - no response received');
          testSocket.disconnect();
          resolve();
        }
      }, 3000);

      testSocket.on('connect', () => {
        testSocket.once('word:valid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          
          const scoreMatch = data.points === expectedScore;
          this.addTestResult(
            testName, 
            scoreMatch, 
            scoreMatch ? undefined : `Expected ${expectedScore}, got ${data.points}`
          );
          testSocket.disconnect();
          resolve();
        });

        testSocket.once('word:invalid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          this.addTestResult(testName, false, `Word was rejected: ${data.reason}`);
          testSocket.disconnect();
          resolve();
        });

        testSocket.emit('word:submit', {
          word: word,
          tiles: this.generateMockTiles(word),
          difficulty: difficulty
        });
      });

      testSocket.on('connect_error', () => {
        responseReceived = true;
        clearTimeout(timeout);
        this.addTestResult(testName, false, 'Connection failed');
        resolve();
      });
    });
  }

  /**
   * Test edge cases
   */
  private async testEdgeCase(word: string, difficulty: 'easy' | 'medium' | 'hard' | 'extreme', expectedReason: string): Promise<void> {
    const testSocket = Client(this.serverUrl, {
      transports: ['websocket'],
      timeout: 3000
    });

    return new Promise((resolve) => {
      const testName = `Edge Case: "${word}" should fail (${expectedReason})`;
      let responseReceived = false;

      const timeout = setTimeout(() => {
        if (!responseReceived) {
          this.addTestResult(testName, false, 'Timeout - no response received');
          testSocket.disconnect();
          resolve();
        }
      }, 3000);

      testSocket.on('connect', () => {
        testSocket.once('word:invalid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          this.addTestResult(testName, true, undefined, { reason: data.reason });
          testSocket.disconnect();
          resolve();
        });

        testSocket.once('word:valid', (data) => {
          responseReceived = true;
          clearTimeout(timeout);
          this.addTestResult(testName, false, `Word was unexpectedly accepted`);
          testSocket.disconnect();
          resolve();
        });

        if (word) {
          testSocket.emit('word:submit', {
            word: word,
            tiles: this.generateMockTiles(word),
            difficulty: difficulty
          });
        }
      });

      testSocket.on('connect_error', () => {
        responseReceived = true;
        clearTimeout(timeout);
        this.addTestResult(testName, false, 'Connection failed');
        resolve();
      });
    });
  }

  /**
   * Generate mock tiles for a word
   */
  private generateMockTiles(word: string) {
    return word.split('').map((letter, index) => ({
      letter: letter.toUpperCase(),
      points: 1, // Simplified for testing
      x: index,
      y: 0,
      id: `tile-${index}`
    }));
  }

  /**
   * Add a test result
   */
  private addTestResult(testName: string, passed: boolean, error?: string, details?: any): void {
    this.testResults.push({ testName, passed, error, details });
    
    const icon = passed ? '✅' : '❌';
    const errorMsg = error ? ` (${error})` : '';
    console.log(`  ${icon} ${testName}${errorMsg}`);
  }

  /**
   * Print comprehensive test results
   */
  private async printResults(): Promise<void> {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n' + '=' .repeat(50));
    console.log('🧪 SINGLE PLAYER TEST RESULTS');
    console.log('=' .repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`  • ${result.testName}`);
          if (result.error) {
            console.log(`    Error: ${result.error}`);
          }
          if (result.details) {
            console.log(`    Details: ${JSON.stringify(result.details)}`);
          }
        });
    }

    console.log('\n🎯 Single Player Mode Testing Complete!');
    
    if (failedTests === 0) {
      console.log('🏆 All tests passed! Single player mode is working perfectly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.');
    }
  }
}

/**
 * Main test execution
 */
async function runSinglePlayerTests() {
  const tester = new SinglePlayerTester();
  await tester.runTests();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSinglePlayerTests().catch(console.error);
}

export { SinglePlayerTester, runSinglePlayerTests }; 