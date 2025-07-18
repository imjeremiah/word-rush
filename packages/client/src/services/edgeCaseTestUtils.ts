/**
 * Edge Case Testing Utilities
 * Development-only utilities for testing board synchronization edge cases
 * Used to simulate network issues, server crashes, and mobile conditions
 */

interface EdgeCaseTestUtils {
  simulateNoBoardOnGo: () => void;
  simulateHighLatency: (latency: number) => void;
  simulateServerCrash: () => void;
  simulateMobileNetwork: () => void;
  simulateConnectionDrop: (duration: number) => void;
  testBoardCorruption: () => void;
  resetNetworkConditions: () => void;
}

/**
 * Simulate the "No Board Received by GO" edge case
 * Clears pending board data to trigger emergency recovery
 */
function simulateNoBoardOnGo(): void {
  console.log('🧪 [TEST] Simulating no board on GO edge case');
  
  // Clear all board data to trigger emergency
  (window as any).pendingGameBoard = null;
  (window as any).currentGameBoard = null;
  (window as any).pendingBoardChecksum = null;
  (window as any).currentBoardChecksum = null;
  
  console.log('🧪 [TEST] Board data cleared - next match:go will trigger emergency recovery');
}

/**
 * Simulate high latency conditions
 * Modifies network timing to test latency handling
 */
function simulateHighLatency(latency: number = 500): void {
  console.log(`🧪 [TEST] Simulating high latency: ${latency}ms`);
  
  // Override latency values globally
  (window as any).simulatedLatency = latency;
  (window as any).enableTimestampSync = true;
  (window as any).networkLatency = latency;
  
  // Trigger high latency handler if available
  if ((window as any).deviceInfo) {
    (window as any).deviceInfo.adaptiveTimeouts.latencyThreshold = Math.min(latency / 2, 100);
  }
  
  console.log(`🧪 [TEST] High latency simulation active - threshold lowered to trigger handling`);
}

/**
 * Simulate server crash during countdown/match
 * Stops heartbeat responses to trigger crash detection
 */
function simulateServerCrash(): void {
  console.log('🧪 [TEST] Simulating server crash - stopping heartbeat responses');
  
  // Block heartbeat responses
  (window as any).blockHeartbeat = true;
  
  // Simulate immediate disconnect after delay
  setTimeout(() => {
    const socket = (window as any).gameSocket;
    if (socket && socket.disconnect) {
      socket.disconnect();
      console.log('🧪 [TEST] Socket disconnected to simulate server crash');
    }
  }, 2000);
}

/**
 * Simulate mobile network conditions
 * Enables mobile-specific timeouts and behaviors
 */
function simulateMobileNetwork(): void {
  console.log('🧪 [TEST] Simulating mobile network conditions');
  
  // Override device detection
  (window as any).deviceInfo = {
    isMobile: true,
    isSlowConnection: true,
    connectionQuality: () => 'poor',
    adaptiveTimeouts: {
      ping: 8000,
      heartbeat: 15000,
      latencyThreshold: 400
    }
  };
  
  // Simulate variable latency
  simulateHighLatency(350);
  
  console.log('🧪 [TEST] Mobile network simulation active - using mobile timeouts');
}

/**
 * Simulate connection drop for specified duration
 * Temporarily disconnects and reconnects
 */
function simulateConnectionDrop(duration: number = 5000): void {
  console.log(`🧪 [TEST] Simulating connection drop for ${duration}ms`);
  
  const socket = (window as any).gameSocket;
  if (socket && socket.disconnect) {
    socket.disconnect();
    
    setTimeout(() => {
      if (socket.connect) {
        socket.connect();
        console.log('🧪 [TEST] Connection restored after simulated drop');
      }
    }, duration);
  }
}

/**
 * Test board corruption and checksum validation
 * Corrupts board data to test validation systems
 */
function testBoardCorruption(): void {
  console.log('🧪 [TEST] Testing board corruption detection');
  
  const currentBoard = (window as any).currentGameBoard || (window as any).pendingGameBoard;
  
  if (currentBoard && currentBoard.tiles) {
    // Corrupt a random tile
    const row = Math.floor(Math.random() * currentBoard.height);
    const col = Math.floor(Math.random() * currentBoard.width);
    
    if (currentBoard.tiles[row] && currentBoard.tiles[row][col]) {
      const originalLetter = currentBoard.tiles[row][col].letter;
      currentBoard.tiles[row][col].letter = 'X'; // Corrupt the letter
      
      console.log(`🧪 [TEST] Corrupted tile at (${row}, ${col}): ${originalLetter} -> X`);
      console.log('🧪 [TEST] Next checksum validation should detect corruption');
    }
  } else {
    console.warn('🧪 [TEST] No board data available to corrupt');
  }
}

/**
 * Reset all network condition simulations
 * Restores normal network behavior
 */
function resetNetworkConditions(): void {
  console.log('🧪 [TEST] Resetting all network condition simulations');
  
  // Clear simulation flags
  (window as any).simulatedLatency = null;
  (window as any).blockHeartbeat = false;
  (window as any).enableTimestampSync = false;
  (window as any).networkLatency = null;
  
  // Restore normal device info if available
  if ((window as any).deviceInfo) {
    (window as any).deviceInfo.adaptiveTimeouts.latencyThreshold = 200;
  }
  
  console.log('🧪 [TEST] Network conditions reset to normal');
}

// Create test utilities object
const edgeCaseTestUtils: EdgeCaseTestUtils = {
  simulateNoBoardOnGo,
  simulateHighLatency,
  simulateServerCrash,
  simulateMobileNetwork,
  simulateConnectionDrop,
  testBoardCorruption,
  resetNetworkConditions
};

// Export for development use
export { edgeCaseTestUtils };

// Make available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).testEdgeCases = edgeCaseTestUtils;
  
  console.log('🧪 Edge case testing utilities loaded. Available as window.testEdgeCases');
  console.log('🧪 Available methods:', Object.keys(edgeCaseTestUtils));
} 