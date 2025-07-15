/**
 * Stress Test Script for Word Rush Server
 * Tests server performance with 50 concurrent connections submitting words
 * Validates that average latency is under 150ms
 */

import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@word-rush/common';

interface TestResult {
  latency: number;
  success: boolean;
  timestamp: number;
  wordTested: string;
}

class StressTest {
  private sockets: Socket<ServerToClientEvents, ClientToServerEvents>[] = [];
  private results: TestResult[] = [];
  private testWords = [
    'HELLO', 'WORLD', 'COMPUTER', 'SCIENCE', 'TESTING', 'PERFORMANCE',
    'SOCKET', 'LATENCY', 'BENCHMARK', 'STRESS', 'VALIDATION', 'TYPESCRIPT',
    'PHASER', 'REACT', 'EXPRESS', 'SERVER', 'CLIENT', 'NETWORK', 'SPEED', 'QUICK'
  ];

  constructor(private connectionCount: number = 50, private serverUrl: string = 'http://localhost:3001') {}

  /**
   * Run the complete stress test
   */
  async runStressTest(): Promise<void> {
    console.log(`\n🚀 Starting stress test with ${this.connectionCount} connections`);
    console.log(`📡 Target server: ${this.serverUrl}`);
    console.log(`🎯 Target latency: < 150ms average\n`);

    try {
      // Step 1: Create connections
      await this.createConnections();
      
      // Step 2: Wait for all connections to stabilize
      await this.wait(2000);
      
      // Step 3: Run concurrent word submissions
      await this.runWordSubmissionTest();
      
      // Step 4: Analyze results
      this.analyzeResults();
      
      // Step 5: Cleanup
      await this.cleanup();
      
    } catch (error) {
      console.error('❌ Stress test failed:', error);
      await this.cleanup();
      process.exit(1);
    }
  }

  /**
   * Create multiple socket connections
   */
  private async createConnections(): Promise<void> {
    console.log(`📶 Creating ${this.connectionCount} connections...`);
    
    const connectionPromises = Array.from({ length: this.connectionCount }, (_, index) => {
      return new Promise<void>((resolve, reject) => {
        const socket = io(this.serverUrl, {
          forceNew: true,
          timeout: 5000,
        });

        socket.on('connect', () => {
          console.log(`✅ Connection ${index + 1}/${this.connectionCount} established`);
          
          // Join the game with a unique username
          socket.emit('game:join', { playerName: `TestUser${index + 1}` });
          resolve();
        });

        socket.on('connect_error', (error) => {
          console.error(`❌ Connection ${index + 1} failed:`, error.message);
          reject(error);
        });

        socket.on('server:error', (data) => {
          console.warn(`⚠️  Server error on connection ${index + 1}:`, data.message);
        });

        socket.on('server:rate-limit', (data) => {
          console.warn(`⚠️  Rate limit on connection ${index + 1}:`, data.message);
        });

        this.sockets.push(socket);
      });
    });

    await Promise.all(connectionPromises);
    console.log(`✅ All ${this.connectionCount} connections established\n`);
  }

  /**
   * Run word submission test on all connections
   */
  private async runWordSubmissionTest(): Promise<void> {
    console.log('🔥 Starting concurrent word submission test...');
    
    const submissionPromises = this.sockets.map(async (socket, index) => {
      const wordIndex = index % this.testWords.length;
      const word = this.testWords[wordIndex];
      
      return this.testWordSubmission(socket, word, index);
    });

    await Promise.all(submissionPromises);
    console.log(`✅ Completed ${this.results.length} word submissions\n`);
  }

  /**
   * Test word submission latency for a single socket
   */
  private testWordSubmission(socket: Socket, word: string, connectionId: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      // Create mock tiles for the word
      const tiles = word.split('').map((letter, index) => ({
        letter,
        points: 1,
        x: index,
        y: 0,
        id: `tile-${connectionId}-${index}`,
      }));

      // Set up response listener
      const responseHandler = (data: unknown) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        this.results.push({
          latency,
          success: data.isValid !== undefined,
          timestamp: endTime,
          wordTested: word,
        });

        socket.off('word:validation-result', responseHandler);
        socket.off('server:error', errorHandler);
        resolve();
      };

      const errorHandler = () => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        this.results.push({
          latency,
          success: false,
          timestamp: endTime,
          wordTested: word,
        });

        socket.off('word:validation-result', responseHandler);
        socket.off('server:error', errorHandler);
        resolve();
      };

      socket.on('word:validation-result', responseHandler);
      socket.on('server:error', errorHandler);

      // Submit the word
      socket.emit('word:submit', { word, tiles });

      // Timeout after 5 seconds
      setTimeout(() => {
        socket.off('word:validation-result', responseHandler);
        socket.off('server:error', errorHandler);
        
        this.results.push({
          latency: 5000,
          success: false,
          timestamp: Date.now(),
          wordTested: word,
        });
        
        resolve();
      }, 5000);
    });
  }

  /**
   * Analyze and report test results
   */
  private analyzeResults(): void {
    console.log('📊 STRESS TEST RESULTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    
    console.log(`📈 Total submissions: ${this.results.length}`);
    console.log(`✅ Successful: ${successfulTests.length}`);
    console.log(`❌ Failed: ${failedTests.length}`);
    console.log(`📊 Success rate: ${((successfulTests.length / this.results.length) * 100).toFixed(1)}%`);
    
    if (successfulTests.length > 0) {
      const latencies = successfulTests.map(r => r.latency);
      const avgLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
      const minLatency = Math.min(...latencies);
      const maxLatency = Math.max(...latencies);
      const p95Latency = this.percentile(latencies, 95);
      
      console.log(`\n⏱️  LATENCY STATISTICS:`);
      console.log(`   Average: ${avgLatency.toFixed(1)}ms`);
      console.log(`   Minimum: ${minLatency}ms`);
      console.log(`   Maximum: ${maxLatency}ms`);
      console.log(`   95th percentile: ${p95Latency.toFixed(1)}ms`);
      
      // Performance assessment
      console.log(`\n🎯 PERFORMANCE ASSESSMENT:`);
      if (avgLatency < 150) {
        console.log(`✅ PASS: Average latency (${avgLatency.toFixed(1)}ms) is under 150ms target`);
      } else {
        console.log(`❌ FAIL: Average latency (${avgLatency.toFixed(1)}ms) exceeds 150ms target`);
      }
      
      if (p95Latency < 300) {
        console.log(`✅ PASS: 95th percentile (${p95Latency.toFixed(1)}ms) is reasonable`);
      } else {
        console.log(`⚠️  WARNING: 95th percentile (${p95Latency.toFixed(1)}ms) is high`);
      }
    }
    
    if (failedTests.length > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      failedTests.forEach((test, index) => {
        console.log(`   ${index + 1}. "${test.wordTested}" - ${test.latency}ms`);
      });
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Calculate percentile
   */
  private percentile(arr: number[], p: number): number {
    const sorted = arr.sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  /**
   * Wait for specified milliseconds
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up all connections
   */
  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up connections...');
    
    this.sockets.forEach(socket => {
      if (socket.connected) {
        socket.disconnect();
      }
    });
    
    await this.wait(1000);
    console.log('✅ Cleanup complete\n');
  }
}

// Run the stress test if this file is executed directly
if (require.main === module) {
  const test = new StressTest(50);
  test.runStressTest().then(() => {
    console.log('🏁 Stress test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Stress test crashed:', error);
    process.exit(1);
  });
}

export default StressTest; 