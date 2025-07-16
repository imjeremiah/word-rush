/**
 * Integration Test - Complete Multiplayer Flow
 * Tests the entire multiplayer experience from lobby creation through match completion
 * Verifies all Phase 3 features work together properly
 */

import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { expect } from 'chai';
import { roomService } from '../services/room.js';

interface TestPlayer {
  socket: ClientSocket;
  id: string;
  name: string;
  ready: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

interface TestResults {
  lobbyCreation: boolean;
  playerJoining: boolean;
  difficultySelection: boolean;
  matchStart: boolean;
  roundTimer: boolean;
  wordSubmission: boolean;
  boardUpdate: boolean;
  scoreSync: boolean;
  roundCompletion: boolean;
  matchCompletion: boolean;
  cleanup: boolean;
}

/**
 * Complete integration test for multiplayer flow
 * Tests the full journey from lobby creation to match completion
 */
export async function runIntegrationTest(): Promise<TestResults> {
  console.log('\n🚀 Starting Complete Multiplayer Integration Test\n');
  
  const results: TestResults = {
    lobbyCreation: false,
    playerJoining: false,
    difficultySelection: false,
    matchStart: false,
    roundTimer: false,
    wordSubmission: false,
    boardUpdate: false,
    scoreSync: false,
    roundCompletion: false,
    matchCompletion: false,
    cleanup: false
  };

  const players: TestPlayer[] = [];
  let roomCode = '';
  let currentRound = 0;
  let roundStarted = false;

  try {
    // Step 1: Create test players
    console.log('📝 Step 1: Creating test players...');
    const playerConfigs = [
      { name: 'Alice', difficulty: 'medium' as const },
      { name: 'Bob', difficulty: 'hard' as const },
      { name: 'Charlie', difficulty: 'easy' as const }
    ];

    for (const config of playerConfigs) {
      const socket = Client('http://localhost:3001');
      const player: TestPlayer = {
        socket,
        id: '',
        name: config.name,
        ready: false,
        difficulty: config.difficulty
      };

      // Wait for connection
      await new Promise<void>((resolve) => {
        socket.on('connect', () => {
          player.id = socket.id;
          resolve();
        });
      });

      players.push(player);
    }

    console.log(`✅ Created ${players.length} test players`);

    // Step 2: Test lobby creation
    console.log('\n📝 Step 2: Testing lobby creation...');
    const hostPlayer = players[0];
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Lobby creation timeout')), 5000);
      
      hostPlayer.socket.on('room:created', (data) => {
        clearTimeout(timeout);
        roomCode = data.room.roomCode;
        console.log(`✅ Lobby created with code: ${roomCode}`);
        results.lobbyCreation = true;
        resolve();
      });

      hostPlayer.socket.emit('room:create', {
        hostUsername: hostPlayer.name,
        settings: {
          totalRounds: 2, // Shorter for testing
          roundDuration: 10, // 10 seconds for quick testing
          shuffleCost: 5,
          speedBonusMultiplier: 1.5,
          speedBonusWindow: 3,
          deadBoardThreshold: 5
        }
      });
    });

    // Step 3: Test player joining
    console.log('\n📝 Step 3: Testing player joining...');
    for (let i = 1; i < players.length; i++) {
      const player = players[i];
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Join timeout')), 5000);
        
        player.socket.on('room:joined', (data) => {
          clearTimeout(timeout);
          console.log(`✅ ${player.name} joined room`);
          resolve();
        });

        player.socket.emit('room:join', {
          roomCode,
          username: player.name
        });
      });
    }
    results.playerJoining = true;

    // Step 4: Test difficulty selection
    console.log('\n📝 Step 4: Testing difficulty selection...');
    for (const player of players) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Difficulty timeout')), 3000);
        
        player.socket.on('room:player-difficulty-set', (data) => {
          if (data.playerId === player.id) {
            clearTimeout(timeout);
            console.log(`✅ ${player.name} set difficulty to ${player.difficulty}`);
            resolve();
          }
        });

        player.socket.emit('player:set-difficulty', {
          difficulty: player.difficulty
        });
      });
    }
    results.difficultySelection = true;

    // Step 5: Set all players ready
    console.log('\n📝 Step 5: Setting players ready...');
    for (const player of players) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Ready timeout')), 3000);
        
        player.socket.on('room:player-ready', (data) => {
          if (data.playerId === player.id) {
            clearTimeout(timeout);
            player.ready = true;
            console.log(`✅ ${player.name} is ready`);
            resolve();
          }
        });

        player.socket.emit('room:set-ready', { isReady: true });
      });
    }

    // Step 6: Test match start
    console.log('\n📝 Step 6: Testing match start...');
    const matchStartPromises = players.map(player => {
      return new Promise<void>((resolve) => {
        player.socket.on('round:started', (data) => {
          currentRound = data.currentRound;
          roundStarted = true;
          console.log(`✅ ${player.name} received round start (Round ${currentRound})`);
          resolve();
        });
      });
    });

    // Host starts the match
    hostPlayer.socket.emit('room:start-match');
    await Promise.all(matchStartPromises);
    results.matchStart = true;

    // Step 7: Test round timer
    console.log('\n📝 Step 7: Testing round timer...');
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timer timeout')), 15000);
      let timerUpdates = 0;
      
      hostPlayer.socket.on('round:timer', (data) => {
        timerUpdates++;
        if (timerUpdates === 1) {
          console.log(`✅ Round timer working (${Math.ceil(data.timeRemaining / 1000)}s remaining)`);
          clearTimeout(timeout);
          results.roundTimer = true;
          resolve();
        }
      });
    });

    // Step 8: Test word submission and synchronization
    console.log('\n📝 Step 8: Testing word submission and board sync...');
    
    // Wait for board updates and test word submission
    let boardUpdatesReceived = 0;
    let scoreUpdatesReceived = 0;
    
    const syncPromises = players.map(player => {
      return new Promise<void>((resolve) => {
        let resolved = false;
        
        player.socket.on('game:board-update', (data) => {
          if (!resolved) {
            boardUpdatesReceived++;
            console.log(`✅ ${player.name} received board update`);
            if (boardUpdatesReceived >= players.length) {
              results.boardUpdate = true;
            }
          }
        });

        player.socket.on('game:score-update', (data) => {
          if (!resolved) {
            scoreUpdatesReceived++;
            console.log(`✅ ${player.name} received score update (${data.score} pts)`);
            if (scoreUpdatesReceived >= players.length) {
              results.scoreSync = true;
            }
            resolved = true;
            resolve();
          }
        });
      });
    });

    // Submit a test word from first player
    setTimeout(() => {
      // Create a simple test word submission
      const testTiles = [
        { letter: 'T', points: 1, x: 0, y: 0, id: 'test-1' },
        { letter: 'E', points: 1, x: 1, y: 0, id: 'test-2' },
        { letter: 'S', points: 1, x: 2, y: 0, id: 'test-3' },
        { letter: 'T', points: 1, x: 3, y: 0, id: 'test-4' }
      ];

      hostPlayer.socket.emit('word:submit', {
        word: 'TEST',
        tiles: testTiles
      });
    }, 2000);

    await Promise.all(syncPromises);
    results.wordSubmission = true;

    // Step 9: Wait for round completion
    console.log('\n📝 Step 9: Waiting for round completion...');
    const roundEndPromises = players.map(player => {
      return new Promise<void>((resolve) => {
        player.socket.on('round:ended', (data) => {
          console.log(`✅ ${player.name} received round end (Round ${data.roundNumber})`);
          resolve();
        });
      });
    });

    await Promise.all(roundEndPromises);
    results.roundCompletion = true;

    // Step 10: Wait for match completion (after 2 rounds)
    console.log('\n📝 Step 10: Waiting for match completion...');
    const matchCompletePromises = players.map(player => {
      return new Promise<void>((resolve) => {
        player.socket.on('match:completed', (data) => {
          console.log(`✅ ${player.name} received match complete (Winner: ${data.winner.playerName})`);
          resolve();
        });
      });
    });

    await Promise.all(matchCompletePromises);
    results.matchCompletion = true;

    // Step 11: Test cleanup
    console.log('\n📝 Step 11: Testing cleanup...');
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const room = roomService.getRoom(roomCode);
        if (room && room.gameState?.matchStatus === 'lobby') {
          console.log('✅ Room returned to lobby state');
          results.cleanup = true;
        }
        resolve();
      }, 12000); // Wait for auto return to lobby
    });

  } catch (error) {
    console.error('❌ Integration test error:', error);
  } finally {
    // Cleanup connections
    console.log('\n🧹 Cleaning up test connections...');
    for (const player of players) {
      player.socket.disconnect();
    }
  }

  return results;
}

/**
 * Print integration test results
 */
export function printTestResults(results: TestResults): void {
  console.log('\n📊 Integration Test Results:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const tests = [
    { name: 'Lobby Creation', passed: results.lobbyCreation },
    { name: 'Player Joining', passed: results.playerJoining },
    { name: 'Difficulty Selection', passed: results.difficultySelection },
    { name: 'Match Start', passed: results.matchStart },
    { name: 'Round Timer', passed: results.roundTimer },
    { name: 'Word Submission', passed: results.wordSubmission },
    { name: 'Board Update Sync', passed: results.boardUpdate },
    { name: 'Score Sync', passed: results.scoreSync },
    { name: 'Round Completion', passed: results.roundCompletion },
    { name: 'Match Completion', passed: results.matchCompletion },
    { name: 'Cleanup', passed: results.cleanup }
  ];

  const passed = tests.filter(t => t.passed).length;
  const total = tests.length;

  for (const test of tests) {
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📈 Overall Score: ${passed}/${total} tests passed (${Math.round(passed/total * 100)}%)`);
  
  if (passed === total) {
    console.log('🎉 All integration tests passed! Phase 3 implementation is complete.');
  } else {
    console.log('⚠️  Some tests failed. Review the implementation for issues.');
  }
}

/**
 * Run the complete integration test if this file is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTest()
    .then(printTestResults)
    .catch(console.error)
    .finally(() => process.exit(0));
} 