/**
 * Simple connection test to verify server is working
 */

import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  timeout: 5000,
});

socket.on('connect', () => {
  console.log('✅ Connected successfully:', socket.id);
  
  // Test word submission
  socket.emit('word:submit', {
    word: 'TEST',
    tiles: [
      { letter: 'T', points: 1, x: 0, y: 0, id: 'tile-0' },
      { letter: 'E', points: 1, x: 1, y: 0, id: 'tile-1' },
      { letter: 'S', points: 1, x: 2, y: 0, id: 'tile-2' },
      { letter: 'T', points: 1, x: 3, y: 0, id: 'tile-3' },
    ],
  });
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});

socket.on('word:valid', (data) => {
  console.log('✅ Word valid:', data);
  socket.disconnect();
  process.exit(0);
});

socket.on('word:invalid', (data) => {
  console.log('❌ Word invalid:', data);
  socket.disconnect();
  process.exit(0);
});

socket.on('server:error', (data) => {
  console.log('⚠️ Server error:', data);
  socket.disconnect();
  process.exit(0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout');
  process.exit(1);
}, 10000); 