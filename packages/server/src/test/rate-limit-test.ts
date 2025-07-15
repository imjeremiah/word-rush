/**
 * Rate Limit Test
 * Tests that rate limiting works by spamming word submissions from a single client
 */

import { io } from 'socket.io-client';

console.log('🚀 Starting rate limit test');
console.log('📡 Target server: http://localhost:3001');
console.log('🎯 Expecting rate limit after 30 requests within 60 seconds\n');

const socket = io('http://localhost:3001', {
  timeout: 5000,
});

let requestCount = 0;
let rateLimitHit = false;

socket.on('connect', () => {
  console.log('✅ Connected successfully:', socket.id);
  console.log('📤 Starting rapid word submissions...\n');
  
  // Spam word submissions rapidly (much faster than 30/minute limit)
  const interval = setInterval(() => {
    if (rateLimitHit) {
      clearInterval(interval);
      return;
    }
    
    requestCount++;
    console.log(`📤 Submitting request ${requestCount}: "SPAM${requestCount}"`);
    
    socket.emit('word:submit', {
      word: `SPAM${requestCount}`,
      tiles: [
        { letter: 'S', points: 1, x: 0, y: 0, id: `tile-${requestCount}-0` },
        { letter: 'P', points: 3, x: 1, y: 0, id: `tile-${requestCount}-1` },
        { letter: 'A', points: 1, x: 2, y: 0, id: `tile-${requestCount}-2` },
        { letter: 'M', points: 3, x: 3, y: 0, id: `tile-${requestCount}-3` },
      ],
    });
    
    if (requestCount >= 50) {
      console.log('\n⚠️ Sent 50 requests without hitting rate limit - stopping test');
      clearInterval(interval);
      socket.disconnect();
      process.exit(1);
    }
  }, 100); // Send every 100ms (600 requests per minute - way over the 30/minute limit)
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});

socket.on('server:rate-limit', (data) => {
  rateLimitHit = true;
  console.log(`\n✅ SUCCESS: Rate limit triggered after ${requestCount} requests!`);
  console.log(`📝 Rate limit message: ${data.message}`);
  console.log(`⏰ Retry after: ${data.retryAfter} seconds`);
  
  socket.disconnect();
  process.exit(0);
});

socket.on('word:valid', () => {
  // Ignore valid word responses for this test
});

socket.on('word:invalid', () => {
  // Ignore invalid word responses for this test  
});

socket.on('server:error', (data) => {
  console.log('⚠️ Server error:', data);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('\n⏰ Test timeout - rate limiting may not be working correctly');
  process.exit(1);
}, 30000); 