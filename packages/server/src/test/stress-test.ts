/**
 * Stress Test Script for Word Rush Server
 * Tests server performance with 50 concurrent connections submitting words
 * Validates that average latency is under 150ms
 */

import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@word-rush/common';

/**
 * Test result for a single word submission
 */
interface TestResult {
  latency: number;
  success: boolean;
  timestamp: number;
  wordTested: string;
}

/**
 * Configuration for stress test
 */
interface StressTestConfig {
  connectionCount: number;
  serverUrl: string;
  testWords: string[];
}

/**
 * Default configuration for stress test
 */
const DEFAULT_CONFIG: StressTestConfig = {
  connectionCount: 10,
  serverUrl: 'http://localhost:3001',
  testWords: [
    'HELLO', 'WORLD', 'COMPUTER', 'SCIENCE', 'TESTING', 'PERFORMANCE',
    'SOCKET', 'LATENCY', 'BENCHMARK', 'STRESS', 'VALIDATION', 'TYPESCRIPT',
    'PHASER', 'REACT', 'EXPRESS', 'SERVER', 'CLIENT', 'NETWORK', 'SPEED', 'QUICK'
  ],
};

/**
 * Wait for specified milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate percentile of an array of numbers
 * @param arr - Array of numbers
 * @param p - Percentile to calculate (0-100)
 * @returns The value at the specified percentile
 */
function percentile(arr: number[], p: number): number {
  const sorted = arr.sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}

/**
 * Create multiple socket connections to the server
 * @param config - Test configuration
 * @returns Array of connected sockets
 */
async function createConnections(config: StressTestConfig): Promise<Socket<ServerToClientEvents, ClientToServerEvents>[]> {
  console.log(`📶 Creating ${config.connectionCount} connections...`);
  
  const sockets: Socket<ServerToClientEvents, ClientToServerEvents>[] = [];
  
  const connectionPromises = Array.from({ length: config.connectionCount }, (_, index) => {
    return new Promise<Socket<ServerToClientEvents, ClientToServerEvents>>((resolve, reject) => {
      const socket = io(config.serverUrl, {
        forceNew: true,
        timeout: 5000,
      });

      socket.on('connect', () => {
        console.log(`✅ Connection ${index + 1}/${config.connectionCount} established`);
        
        // Join the game with a unique username
        socket.emit('game:join', { playerName: `TestUser${index + 1}` });
        resolve(socket);
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

      sockets.push(socket);
    });
  });

  const connectedSockets = await Promise.all(connectionPromises);
  console.log(`✅ All ${config.connectionCount} connections established\n`);
  
  return connectedSockets;
}

/**
 * Test word submission latency for a single socket
 * @param socket - Socket connection to test
 * @param word - Word to submit
 * @param connectionId - Connection identifier for creating unique tile IDs
 * @returns Promise that resolves with the test result
 */
function testWordSubmission(socket: Socket, word: string, connectionId: number): Promise<TestResult> {
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
      
      const result: TestResult = {
        latency,
        success: data !== undefined, // Updated to handle any response as success
        timestamp: endTime,
        wordTested: word,
      };

      socket.off('word:valid', responseHandler);
      socket.off('word:invalid', responseHandler);
      socket.off('server:error', errorHandler);
      resolve(result);
    };

    const errorHandler = () => {
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      const result: TestResult = {
        latency,
        success: false,
        timestamp: endTime,
        wordTested: word,
      };

      socket.off('word:valid', responseHandler);
      socket.off('word:invalid', responseHandler);
      socket.off('server:error', errorHandler);
      resolve(result);
    };

    // Listen for both valid and invalid responses
    socket.on('word:valid', responseHandler);
    socket.on('word:invalid', responseHandler);
    socket.on('server:error', errorHandler);

    // Submit the word
    socket.emit('word:submit', { word, tiles });

    // Timeout after 5 seconds
    setTimeout(() => {
      socket.off('word:valid', responseHandler);
      socket.off('word:invalid', responseHandler);
      socket.off('server:error', errorHandler);
      
      resolve({
        latency: 5000,
        success: false,
        timestamp: Date.now(),
        wordTested: word,
      });
    }, 5000);
  });
}

/**
 * Run word submission test on all connections
 * @param sockets - Array of socket connections
 * @param config - Test configuration
 * @returns Array of test results
 */
async function runWordSubmissionTest(
  sockets: Socket<ServerToClientEvents, ClientToServerEvents>[],
  config: StressTestConfig
): Promise<TestResult[]> {
  console.log('🔥 Starting concurrent word submission test...');
  
  const submissionPromises = sockets.map(async (socket, index) => {
    const wordIndex = index % config.testWords.length;
    const word = config.testWords[wordIndex];
    
    return testWordSubmission(socket, word, index);
  });

  const results = await Promise.all(submissionPromises);
  console.log(`✅ Completed ${results.length} word submissions\n`);
  
  return results;
}

/**
 * Analyze and report test results
 * @param results - Array of test results to analyze
 */
function analyzeResults(results: TestResult[]): void {
  console.log('📊 STRESS TEST RESULTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  console.log(`📈 Total submissions: ${results.length}`);
  console.log(`✅ Successful: ${successfulTests.length}`);
  console.log(`❌ Failed: ${failedTests.length}`);
  console.log(`📊 Success rate: ${((successfulTests.length / results.length) * 100).toFixed(1)}%`);
  
  if (successfulTests.length > 0) {
    const latencies = successfulTests.map(r => r.latency);
    const avgLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);
    const p95Latency = percentile(latencies, 95);
    
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
 * Clean up all socket connections
 * @param sockets - Array of sockets to clean up
 */
async function cleanupConnections(sockets: Socket<ServerToClientEvents, ClientToServerEvents>[]): Promise<void> {
  console.log('🧹 Cleaning up connections...');
  
  sockets.forEach(socket => {
    if (socket.connected) {
      socket.disconnect();
    }
  });
  
  await wait(1000);
  console.log('✅ Cleanup complete\n');
}

/**
 * Run the complete stress test
 * @param config - Test configuration (optional, uses defaults)
 */
export async function runStressTest(config: Partial<StressTestConfig> = {}): Promise<void> {
  const testConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.log(`\n🚀 Starting stress test with ${testConfig.connectionCount} connections`);
  console.log(`📡 Target server: ${testConfig.serverUrl}`);
  console.log(`🎯 Target latency: < 150ms average\n`);

  let sockets: Socket<ServerToClientEvents, ClientToServerEvents>[] = [];

  try {
    // Step 1: Create connections
    sockets = await createConnections(testConfig);
    
    // Step 2: Wait for all connections to stabilize
    await wait(2000);
    
    // Step 3: Run concurrent word submissions
    const results = await runWordSubmissionTest(sockets, testConfig);
    
    // Step 4: Analyze results
    analyzeResults(results);
    
    // Step 5: Cleanup
    await cleanupConnections(sockets);
    
  } catch (error) {
    console.error('❌ Stress test failed:', error);
    await cleanupConnections(sockets);
    throw error;
  }
}

// Run the stress test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runStressTest({ connectionCount: 50 }).then(() => {
    console.log('🏁 Stress test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Stress test crashed:', error);
    process.exit(1);
  });
} 