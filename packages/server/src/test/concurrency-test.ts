/**
 * Concurrency Test
 * Tests that the server can handle multiple concurrent connections and word submissions
 */

import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@word-rush/common';

const connectionCount = 5;
const sockets: Socket<ServerToClientEvents, ClientToServerEvents>[] = [];
let completedTests = 0;
let successfulSubmissions = 0;

console.log(`🚀 Starting concurrency test with ${connectionCount} connections`);
console.log('📡 Target server: http://localhost:3001');
console.log('🎯 Each connection will submit one word simultaneously\n');

// Create connections
for (let i = 0; i < connectionCount; i++) {
  const socket = io('http://localhost:3001', {
    timeout: 5000,
  });

  socket.on('connect', () => {
    console.log(`✅ Connection ${i + 1} established: ${socket.id}`);
    
    // Submit a word immediately upon connection
    socket.emit('word:submit', {
      word: 'TEST',
      tiles: [
        { letter: 'T', points: 1, x: 0, y: 0, id: `tile-${i}-0` },
        { letter: 'E', points: 1, x: 1, y: 0, id: `tile-${i}-1` },
        { letter: 'S', points: 1, x: 2, y: 0, id: `tile-${i}-2` },
        { letter: 'T', points: 1, x: 3, y: 0, id: `tile-${i}-3` },
      ],
    });
  });

  socket.on('connect_error', (error: Error) => {
    console.error(`❌ Connection ${i + 1} failed:`, error.message);
    checkTestCompletion();
  });

  socket.on('word:valid', (data: { word: string; points: number; score: number }) => {
    console.log(`✅ Connection ${i + 1} - Word valid:`, data);
    successfulSubmissions++;
    checkTestCompletion();
  });

  socket.on('word:invalid', (data: { word: string; reason: string }) => {
    console.log(`❌ Connection ${i + 1} - Word invalid:`, data);
    checkTestCompletion();
  });

  socket.on('server:error', (data: { message: string; code: string }) => {
    console.log(`⚠️ Connection ${i + 1} - Server error:`, data);
    checkTestCompletion();
  });

  sockets.push(socket);
}

function checkTestCompletion() {
  completedTests++;
  
  if (completedTests >= connectionCount) {
    console.log(`\n📊 CONCURRENCY TEST RESULTS:`);
    console.log(`✅ Total connections: ${connectionCount}`);
    console.log(`✅ Successful submissions: ${successfulSubmissions}`);
    console.log(`📊 Success rate: ${((successfulSubmissions / connectionCount) * 100).toFixed(1)}%`);
    
    if (successfulSubmissions === connectionCount) {
      console.log(`🎉 SUCCESS: All ${connectionCount} concurrent connections handled correctly!`);
    } else {
      console.log(`⚠️ PARTIAL SUCCESS: ${successfulSubmissions}/${connectionCount} connections successful`);
    }
    
    // Clean up
    sockets.forEach(socket => socket.disconnect());
    process.exit(successfulSubmissions === connectionCount ? 0 : 1);
  }
}

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n⏰ Test timeout');
  sockets.forEach(socket => socket.disconnect());
  process.exit(1);
}, 10000); 