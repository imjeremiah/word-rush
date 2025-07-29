/**
 * 🚀 Production Deployment Test
 * Quick verification that single-player mode works on live Render deployment
 */

import { io as Client, Socket } from 'socket.io-client';

const PRODUCTION_SERVER = 'https://word-rush-server.onrender.com';

interface ProductionTestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class ProductionTester {
  private testResults: ProductionTestResult[] = [];

  async runProductionTests(): Promise<void> {
    console.log('\n🚀 Testing Single Player Mode on Production Deployment');
    console.log('=' .repeat(60));
    console.log(`🌐 Server: ${PRODUCTION_SERVER}`);
    console.log(`🌐 Client: https://word-rush-client.onrender.com`);
    console.log('=' .repeat(60));

    try {
      await this.testServerHealth();
      await this.testSinglePlayerConnection();
      await this.testSinglePlayerWordSubmission();
      await this.printResults();
    } catch (error) {
      console.error('❌ Production test suite failed:', error);
    }
  }

  /**
   * Test server health endpoint
   */
  private async testServerHealth(): Promise<void> {
    console.log('\n🏥 Testing Server Health');
    
    try {
      const response = await fetch(`${PRODUCTION_SERVER}/health`);
      const health = await response.json();
      
      const isHealthy = health.status === 'ok' && health.dictionary?.loaded === true;
      
      this.addTestResult(
        'Server Health Check',
        isHealthy,
        isHealthy ? undefined : 'Server health check failed',
        health
      );
      
      if (isHealthy) {
        console.log(`  ✅ Dictionary: ${health.dictionary.wordCount} words loaded`);
        console.log(`  ✅ Active players: ${health.activePlayers}`);
      }
    } catch (error) {
      this.addTestResult('Server Health Check', false, `Health check failed: ${error}`);
    }
  }

  /**
   * Test single player socket connection
   */
  private async testSinglePlayerConnection(): Promise<void> {
    console.log('\n🔌 Testing Single Player Connection');
    
    return new Promise((resolve) => {
      const socket = Client(PRODUCTION_SERVER, {
        transports: ['websocket'],
        timeout: 10000
      });

      const timeout = setTimeout(() => {
        socket.disconnect();
        this.addTestResult('Production Socket Connection', false, 'Connection timeout (10s)');
        resolve();
      }, 10000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        this.addTestResult('Production Socket Connection', true);
        
        // Test board request
        socket.emit('game:request-board');
        
        socket.once('game:initial-board', (boardData) => {
          const hasValidBoard = boardData && boardData.tiles && Array.isArray(boardData.tiles);
          this.addTestResult(
            'Board Generation', 
            hasValidBoard,
            hasValidBoard ? undefined : 'Invalid board data received',
            { boardSize: boardData?.tiles?.length }
          );
          socket.disconnect();
          resolve();
        });

        // Timeout for board request
        setTimeout(() => {
          socket.disconnect();
          this.addTestResult('Board Generation', false, 'Board request timeout (5s)');
          resolve();
        }, 5000);
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        this.addTestResult('Production Socket Connection', false, `Connection error: ${error.message}`);
        resolve();
      });
    });
  }

  /**
   * Test single player word submission
   */
  private async testSinglePlayerWordSubmission(): Promise<void> {
    console.log('\n📝 Testing Single Player Word Submission');
    
    return new Promise((resolve) => {
      const socket = Client(PRODUCTION_SERVER, {
        transports: ['websocket'],
        timeout: 10000
      });

      let connected = false;

      const timeout = setTimeout(() => {
        if (connected) {
          socket.disconnect();
          this.addTestResult('Single Player Word Submission', false, 'Word submission timeout');
        }
        resolve();
      }, 15000);

      socket.on('connect', () => {
        connected = true;
        
        // Submit a test word with medium difficulty
        socket.emit('word:submit', {
          word: 'TEST',
          tiles: [
            { letter: 'T', points: 1, x: 0, y: 0, id: 'tile-0' },
            { letter: 'E', points: 1, x: 1, y: 0, id: 'tile-1' },
            { letter: 'S', points: 1, x: 2, y: 0, id: 'tile-2' },
            { letter: 'T', points: 1, x: 3, y: 0, id: 'tile-3' }
          ],
          difficulty: 'medium'
        });
      });

      socket.on('word:valid', (data) => {
        clearTimeout(timeout);
        
        const validResponse = data && typeof data.points === 'number' && data.word === 'TEST';
        this.addTestResult(
          'Single Player Word Submission',
          validResponse,
          validResponse ? undefined : 'Invalid word response',
          { word: data?.word, points: data?.points }
        );
        
        socket.disconnect();
        resolve();
      });

      socket.on('word:invalid', (data) => {
        clearTimeout(timeout);
        this.addTestResult(
          'Single Player Word Submission', 
          false, 
          `Word rejected: ${data.reason}`,
          data
        );
        socket.disconnect();
        resolve();
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        this.addTestResult('Single Player Word Submission', false, `Connection failed: ${error.message}`);
        resolve();
      });
    });
  }

  /**
   * Add a test result
   */
  private addTestResult(testName: string, passed: boolean, error?: string, details?: any): void {
    this.testResults.push({ testName, passed, error, details });
    
    const icon = passed ? '✅' : '❌';
    const errorMsg = error ? ` (${error})` : '';
    console.log(`  ${icon} ${testName}${errorMsg}`);
    
    if (details && passed) {
      console.log(`    📊 ${JSON.stringify(details)}`);
    }
  }

  /**
   * Print final results
   */
  private async printResults(): Promise<void> {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n' + '=' .repeat(60));
    console.log('🚀 PRODUCTION DEPLOYMENT TEST RESULTS');
    console.log('=' .repeat(60));
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

    console.log('\n🎯 Production Deployment Status:');
    if (failedTests === 0) {
      console.log('🏆 DEPLOYMENT SUCCESSFUL! Single player mode is live and working.');
      console.log('🌐 Ready for public demo at: https://word-rush-client.onrender.com');
    } else {
      console.log('⚠️  Some tests failed. Check the deployment status.');
    }
  }
}

/**
 * Main test execution
 */
async function runProductionTests() {
  const tester = new ProductionTester();
  await tester.runProductionTests();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runProductionTests().catch(console.error);
}

export { ProductionTester, runProductionTests }; 