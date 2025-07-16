chunk-WAYAUXAG.js?v=fcda56c5:21580 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
App.tsx:118 [2025-07-16T19:02:57.247Z] 🎯 AppContent render: gameState=menu, phaserKey=phaser-no-room-no-session, optimized=true
GameConnection.tsx:114 🔌 Creating socket connection (should only happen once)
App.tsx:118 [2025-07-16T19:02:57.251Z] 🎯 AppContent render: gameState=menu, phaserKey=phaser-no-room-no-session, optimized=true
GameConnection.tsx:126 Connected to server
GameConnection.tsx:134 Attempting to reconnect with stored session: {id: 'a7AVVgrU-9xKH-ZGAAAD', username: 'Player-a7AVVgrU', score: 0, wordsSubmitted: 0}
GameConnection.tsx:265 Session update: {session: {…}}
GameConnection.tsx:23 [2025-07-16T19:02:59.124Z] Socket Event Received: server:welcome {message: 'Connected to Word Rush server', socketId: 'eJ0RHyhZmO4WWOqkAAAB'}
GameConnection.tsx:202 Welcome message received: {message: 'Connected to Word Rush server', socketId: 'eJ0RHyhZmO4WWOqkAAAB'}
GameConnection.tsx:300 Initial board received: {board: {…}}
App.tsx:118 [2025-07-16T19:02:59.131Z] 🎯 AppContent render: gameState=menu, phaserKey=phaser-no-room-no-session, optimized=true
GameConnection.tsx:265 Session update: {session: {…}}
GameConnection.tsx:292 Reconnection failed: {message: 'Previous session not found, started new session'}
GameContext.tsx:173 [GameContext] State change: playerSession {from: null, to: {…}, triggeredBy: 'setPlayerSession', timestamp: '2025-07-16T19:02:59.334Z'}
App.tsx:118 [2025-07-16T19:02:59.334Z] 🎯 AppContent render: gameState=menu, phaserKey=phaser-no-room-eJ0RHyhZmO4WWOqkAAAB, optimized=true
MainMenu.tsx:156 [CreateGameScreen] Starting room creation... {playerName: 'j', socketConnected: true, connectionStatus: 'connected', gameState: 'menu', currentRoom: null}
GameConnection.tsx:306 Room created: {roomId: '2EUS', roomCode: '2EUS'}
GameConnection.tsx:311 Room creation confirmed, waiting for room:joined event...
GameConnection.tsx:315 Joined room: {id: '2EUS', roomCode: '2EUS', hostId: 'eJ0RHyhZmO4WWOqkAAAB', players: Array(1), maxPlayers: 8, …}
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'lobby', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:03:08.076Z'}
App.tsx:118 [2025-07-16T19:03:08.078Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-no-room-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, to: {…}, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:08.128Z'}
App.tsx:118 [2025-07-16T19:03:08.129Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:333 Player joined room: abc
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, to: {…}, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:15.860Z'}
App.tsx:118 [2025-07-16T19:03:15.861Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:315 Joined room: {id: '2EUS', roomCode: '2EUS', hostId: 'eJ0RHyhZmO4WWOqkAAAB', players: Array(2), maxPlayers: 8, …}
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'lobby', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:03:17.084Z'}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, to: {…}, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:17.134Z'}
App.tsx:118 [2025-07-16T19:03:17.135Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
MainMenu.tsx:173 [CreateGameScreen] Room creation timeout - resetting state
(anonymous) @ MainMenu.tsx:173
setTimeout
handleCreateRoom @ MainMenu.tsx:171
callCallback2 @ chunk-WAYAUXAG.js?v=fcda56c5:3674
invokeGuardedCallbackDev @ chunk-WAYAUXAG.js?v=fcda56c5:3699
invokeGuardedCallback @ chunk-WAYAUXAG.js?v=fcda56c5:3733
invokeGuardedCallbackAndCatchFirstError @ chunk-WAYAUXAG.js?v=fcda56c5:3736
executeDispatch @ chunk-WAYAUXAG.js?v=fcda56c5:7016
processDispatchQueueItemsInOrder @ chunk-WAYAUXAG.js?v=fcda56c5:7036
processDispatchQueue @ chunk-WAYAUXAG.js?v=fcda56c5:7045
dispatchEventsForPlugins @ chunk-WAYAUXAG.js?v=fcda56c5:7053
(anonymous) @ chunk-WAYAUXAG.js?v=fcda56c5:7177
batchedUpdates$1 @ chunk-WAYAUXAG.js?v=fcda56c5:18941
batchedUpdates @ chunk-WAYAUXAG.js?v=fcda56c5:3579
dispatchEventForPluginEventSystem @ chunk-WAYAUXAG.js?v=fcda56c5:7176
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-WAYAUXAG.js?v=fcda56c5:5478
dispatchEvent @ chunk-WAYAUXAG.js?v=fcda56c5:5472
dispatchDiscreteEvent @ chunk-WAYAUXAG.js?v=fcda56c5:5449
GameConnection.tsx:345 Player ready status changed: cg64Q17o7-SamFegAAAD true
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, to: {…}, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:20.331Z'}
App.tsx:118 [2025-07-16T19:03:20.332Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:345 Player ready status changed: eJ0RHyhZmO4WWOqkAAAB true
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, to: {…}, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:22.836Z'}
App.tsx:118 [2025-07-16T19:03:22.837Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:363 Match starting countdown: 3
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'match', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:03:24.660Z'}
App.tsx:118 [2025-07-16T19:03:24.661Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:371 Match started: {board: {…}, boardChecksum: '0fd433e2367ae1a781ba0a38775a7424', timeRemaining: 90000, currentRound: 1, totalRounds: 2, …}
GameConnection.tsx:401 [2025-07-16T19:03:29.312Z] Board validation: server_checksum=0fd433e2367ae1a781ba0a38775a7424, client_validation=eyJ3aWR0aCI6NCwi, board_size=4x4, players=2
GameConnection.tsx:405 [2025-07-16T19:03:29.312Z] Board layout: ERTI|LNAK|ASAI|WTAG
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'match', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:03:29.312Z'}
GameContext.tsx:173 [GameContext] State change: roundTimer {from: null, to: {…}, triggeredBy: 'setRoundTimerEnhanced', timestamp: '2025-07-16T19:03:29.312Z'}
App.tsx:118 [2025-07-16T19:03:29.315Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:52 [2025-07-16T19:03:29.321Z] 🎮 PhaserGame MOUNTED - Instance ID: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:57 [2025-07-16T19:03:29.321Z] ⚠️ PhaserGame mounting during active game state: match
(anonymous) @ PhaserGame.tsx:57
commitHookEffectListMount @ chunk-WAYAUXAG.js?v=fcda56c5:16936
commitPassiveMountOnFiber @ chunk-WAYAUXAG.js?v=fcda56c5:18184
commitPassiveMountEffects_complete @ chunk-WAYAUXAG.js?v=fcda56c5:18157
commitPassiveMountEffects_begin @ chunk-WAYAUXAG.js?v=fcda56c5:18147
commitPassiveMountEffects @ chunk-WAYAUXAG.js?v=fcda56c5:18137
flushPassiveEffectsImpl @ chunk-WAYAUXAG.js?v=fcda56c5:19518
flushPassiveEffects @ chunk-WAYAUXAG.js?v=fcda56c5:19475
(anonymous) @ chunk-WAYAUXAG.js?v=fcda56c5:19356
workLoop @ chunk-WAYAUXAG.js?v=fcda56c5:197
flushWork @ chunk-WAYAUXAG.js?v=fcda56c5:176
performWorkUntilDeadline @ chunk-WAYAUXAG.js?v=fcda56c5:384
PhaserGame.tsx:76 [2025-07-16T19:03:29.321Z] 🕹️ Creating Phaser game instance - ID: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:140      Phaser v3.90.0 (WebGL | Web Audio)  https://phaser.io/v390
PhaserGame.tsx:141 [2025-07-16T19:03:29.395Z] ✅ Phaser game instance created successfully - ID: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:119 [2025-07-16T19:03:29.492Z] 🎬 Phaser scene PRELOAD - Instance: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:291 [2025-07-16T19:03:29.492Z] 🎵 Loading audio assets...
GameContext.tsx:173 [GameContext] State change: matchData {from: null, to: {…}, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:03:29.505Z'}
PhaserGame.tsx:345 System fonts ready
PhaserGame.tsx:328 [2025-07-16T19:03:29.507Z] ✨ Premium particle textures created
PhaserGame.tsx:123 [2025-07-16T19:03:29.507Z] 🎬 Phaser scene CREATE - Instance: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:780 [2025-07-16T19:03:29.507Z] 🎬 Scene CREATE started - optimized initialization...
PhaserGame.tsx:784 [2025-07-16T19:03:29.507Z] ⚡ Scene not fully active, continuing with initialization...
create @ PhaserGame.tsx:784
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:1109 [2025-07-16T19:03:29.507Z] 🎵 Initializing audio system...
PhaserGame.tsx:1132 [2025-07-16T19:03:29.508Z] ✅ Audio system initialized successfully
PhaserGame.tsx:1145 [2025-07-16T19:03:29.508Z] ✨ Initializing particle system...
PhaserGame.tsx:1190 [2025-07-16T19:03:29.508Z] ⚠️ Particle system initialization failed: TypeError: particleSystem.manager.addEmitter is not a function
    at initializeParticleSystem (PhaserGame.tsx:1152:62)
    at Scene2.create (PhaserGame.tsx:797:3)
    at Scene2.create (PhaserGame.tsx:124:20)
    at SceneManager2.create (phaser.js?v=fcda56c5:110868:36)
    at SceneManager2.loadComplete (phaser.js?v=fcda56c5:110799:26)
    at LoaderPlugin2.emit (phaser.js?v=fcda56c5:137:43)
    at LoaderPlugin2.loadComplete (phaser.js?v=fcda56c5:67118:26)
    at LoaderPlugin2.fileProcessComplete (phaser.js?v=fcda56c5:67094:28)
    at AudioFile2.onProcessComplete (phaser.js?v=fcda56c5:66323:33)
    at config.context (phaser.js?v=fcda56c5:68044:31)
initializeParticleSystem @ PhaserGame.tsx:1190
create @ PhaserGame.tsx:797
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:837 [2025-07-16T19:03:29.512Z] ✅ Scene CREATE completed successfully
App.tsx:118 [2025-07-16T19:03:29.519Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:358 Fonts loaded successfully
vite.svg:1  GET http://localhost:5173/vite.svg 404 (Not Found)
GameConnection.tsx:300 Initial board received: {board: {…}}
PhaserGame.tsx:383 Received initial board: {tiles: Array(4), width: 4, height: 4}
PhaserGame.tsx:844 [2025-07-16T19:03:33.249Z] 🎯 Updating board display with validation...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
PhaserGame.tsx:889 [2025-07-16T19:03:33.273Z] 🔄 Starting periodic visual validation...
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
PhaserGame.tsx:883 [2025-07-16T19:03:33.324Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:03:34.315Z] 📡 Board resync received (periodic): checksum=0fd433e2367ae1a781ba0a38775a7424
GameConnection.tsx:465 [2025-07-16T19:03:34.315Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:03:35.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:35.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:231 Invalid word submitted: {word: 'OX', reason: 'Word must be at least 3 letters for medium difficulty'}
GameConnection.tsx:53 [Client] Word validation latency: 6ms (INVALID) - "OX"
App.tsx:118 [2025-07-16T19:03:37.573Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:1616 [2025-07-16T19:03:38.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:38.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:03:40.012Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:40.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:03:42.317Z] 📡 Board resync received (periodic): checksum=0fd433e2367ae1a781ba0a38775a7424
GameConnection.tsx:465 [2025-07-16T19:03:42.317Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:03:43.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:43.774Z] ✅ Visual state validation passed
board-rendering.ts:1616 [2025-07-16T19:03:45.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:45.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:03:48.773Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:48.774Z] ✅ Visual state validation passed
board-rendering.ts:1616 [2025-07-16T19:03:50.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:50.014Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:03:50.320Z] 📡 Board resync received (periodic): checksum=0fd433e2367ae1a781ba0a38775a7424
GameConnection.tsx:465 [2025-07-16T19:03:50.320Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
PhaserGame.tsx:406 [2025-07-16T19:03:51.945Z] 📨 Received tile changes (seq: 1, latency: 5ms): {removed: 3, falling: 4, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:03:51.946Z] 🎯 Processing tile changes (seq: 1)...
board-rendering.ts:305 [2025-07-16T19:03:51.946Z] Starting tile change animation (seq: 1): {removed: 3, falling: 4, new: 3, latency: 6}
board-rendering.ts:206 [2025-07-16T19:03:51.946Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:219 Valid word submitted: {word: 'HOE', points: 7, score: 7, speedBonus: false}
GameConnection.tsx:53 [Client] Word validation latency: 12ms (VALID) - "HOE"
GameConnection.tsx:23 [2025-07-16T19:03:51.951Z] Socket Event Received: game:score-update {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 7, totalScore: 7, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 7, totalScore: 7, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:03:51.952Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
App.tsx:118 [2025-07-16T19:03:51.952Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:03:52.003Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:03:52.004Z', to: ƒ}
App.tsx:118 [2025-07-16T19:03:52.005Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:03:52.086Z] Tile removal completed in 140ms
board-rendering.ts:342 [2025-07-16T19:03:52.296Z] Tile falling completed in 210ms
board-rendering.ts:349 [2025-07-16T19:03:52.594Z] New tile appearance completed in 298ms
board-rendering.ts:350 [2025-07-16T19:03:52.594Z] Total tile change animation completed in 648ms (seq: 1)
board-rendering.ts:354 [2025-07-16T19:03:52.594Z] Slow tile animation detected: 648ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:03:52.595Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:03:52.595Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:03:52.595Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:03:52.595Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:03:52.595Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 1) processed successfully.
board-rendering.ts:1616 [2025-07-16T19:03:53.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:53.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:03:55.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:55.015Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:03:58.321Z] 📡 Board resync received (periodic): checksum=32ece08f8c512c179cfea6328e08a4ae
GameConnection.tsx:465 [2025-07-16T19:03:58.321Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:03:58.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:03:58.775Z] ✅ Visual state validation passed
PhaserGame.tsx:714 [2025-07-16T19:03:59.513Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 0, successRate: '0.0%', recentFailures: 0, historyLength: 0}
board-rendering.ts:1616 [2025-07-16T19:04:00.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:00.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:04:03.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:03.775Z] ✅ Visual state validation passed
board-rendering.ts:1616 [2025-07-16T19:04:05.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:05.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:06.322Z] 📡 Board resync received (periodic): checksum=32ece08f8c512c179cfea6328e08a4ae
GameConnection.tsx:465 [2025-07-16T19:04:06.322Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:08.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:08.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:04:10.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:10.014Z] ✅ Visual state validation passed
PhaserGame.tsx:406 [2025-07-16T19:04:10.333Z] 📨 Received tile changes (seq: 2, latency: 1ms): {removed: 3, falling: 6, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:04:10.334Z] 🎯 Processing tile changes (seq: 2)...
board-rendering.ts:305 [2025-07-16T19:04:10.334Z] Starting tile change animation (seq: 2): {removed: 3, falling: 6, new: 3, latency: 2}
board-rendering.ts:206 [2025-07-16T19:04:10.334Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:04:10.334Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 4, totalScore: 4, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 4, totalScore: 4, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:04:10.335Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:10.386Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:10.386Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:10.386Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:10.471Z] Tile removal completed in 137ms
board-rendering.ts:342 [2025-07-16T19:04:10.731Z] Tile falling completed in 260ms
board-rendering.ts:349 [2025-07-16T19:04:11.081Z] New tile appearance completed in 350ms
board-rendering.ts:350 [2025-07-16T19:04:11.081Z] Total tile change animation completed in 747ms (seq: 2)
board-rendering.ts:354 [2025-07-16T19:04:11.081Z] Slow tile animation detected: 747ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:11.081Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:11.081Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:11.081Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:11.081Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:11.081Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 2) processed successfully.
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:04:13.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:13.775Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:04:14.324Z] 📡 Board resync received (periodic): checksum=f20a881120881cf35b0eab1e90407484
GameConnection.tsx:465 [2025-07-16T19:04:14.324Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:15.012Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:15.012Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:04:18.773Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:18.774Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:04:19.327Z] 📡 Board resync received (periodic): checksum=f20a881120881cf35b0eab1e90407484
GameConnection.tsx:465 [2025-07-16T19:04:19.327Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:20.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:20.014Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:04:23.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:23.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:24.328Z] 📡 Board resync received (periodic): checksum=f20a881120881cf35b0eab1e90407484
GameConnection.tsx:465 [2025-07-16T19:04:24.328Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:25.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:25.014Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:27.330Z] 📡 Board resync received (periodic): checksum=f20a881120881cf35b0eab1e90407484
GameConnection.tsx:465 [2025-07-16T19:04:27.330Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:28.776Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:28.776Z] ✅ Visual state validation passed
PhaserGame.tsx:714 [2025-07-16T19:04:29.512Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 0, successRate: '0.0%', recentFailures: 0, historyLength: 0}
board-rendering.ts:1616 [2025-07-16T19:04:30.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:30.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:30.332Z] 📡 Board resync received (periodic): checksum=f20a881120881cf35b0eab1e90407484
GameConnection.tsx:465 [2025-07-16T19:04:30.332Z] 🔄 Periodic board sync: checksum validated
PhaserGame.tsx:406 [2025-07-16T19:04:31.845Z] 📨 Received tile changes (seq: 3, latency: 1ms): {removed: 2, falling: 0, new: 2}
PhaserGame.tsx:1017 [2025-07-16T19:04:31.845Z] 🎯 Processing tile changes (seq: 3)...
board-rendering.ts:305 [2025-07-16T19:04:31.845Z] Starting tile change animation (seq: 3): {removed: 2, falling: 0, new: 2, latency: 1}
board-rendering.ts:206 [2025-07-16T19:04:31.845Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:04:31.846Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 5, totalScore: 9, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 5, totalScore: 9, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:04:31.847Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:31.898Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:31.899Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:31.899Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:31.978Z] Tile removal completed in 133ms
board-rendering.ts:342 [2025-07-16T19:04:31.978Z] Tile falling completed in 0ms
board-rendering.ts:349 [2025-07-16T19:04:32.338Z] New tile appearance completed in 360ms
board-rendering.ts:350 [2025-07-16T19:04:32.338Z] Total tile change animation completed in 493ms (seq: 3)
board-rendering.ts:354 [2025-07-16T19:04:32.338Z] Slow tile animation detected: 493ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:32.338Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:32.339Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:32.339Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:32.339Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:32.339Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 3) processed successfully.
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:33.334Z] 📡 Board resync received (periodic): checksum=32e5c2d2b2a67019b76d3465ca270729
GameConnection.tsx:465 [2025-07-16T19:04:33.334Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:33.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:33.775Z] ✅ Visual state validation passed
PhaserGame.tsx:406 [2025-07-16T19:04:34.603Z] 📨 Received tile changes (seq: 4, latency: 2ms): {removed: 2, falling: 0, new: 2}
PhaserGame.tsx:1017 [2025-07-16T19:04:34.603Z] 🎯 Processing tile changes (seq: 4)...
board-rendering.ts:305 [2025-07-16T19:04:34.603Z] Starting tile change animation (seq: 4): {removed: 2, falling: 0, new: 2, latency: 2}
board-rendering.ts:206 [2025-07-16T19:04:34.603Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:04:34.604Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 3, totalScore: 12, speedBonus: true}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 3, totalScore: 12, speedBonus: true}
GameConnection.tsx:23 [2025-07-16T19:04:34.604Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:34.655Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:34.655Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:34.656Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:34.739Z] Tile removal completed in 136ms
board-rendering.ts:342 [2025-07-16T19:04:34.739Z] Tile falling completed in 0ms
board-rendering.ts:1616 [2025-07-16T19:04:35.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1621 [2025-07-16T19:04:35.014Z] ⚠️ Visual state validation failed: 2 mismatches found between visual and logical state
performThrottledValidation @ board-rendering.ts:1621
(anonymous) @ board-rendering.ts:1583
setTimeout
(anonymous) @ board-rendering.ts:1582
setInterval
startPeriodicVisualValidation @ board-rendering.ts:1565
create @ PhaserGame.tsx:823
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
board-rendering.ts:1622 [2025-07-16T19:04:35.014Z] 🔍 Mismatches: (2) [{…}, {…}]
board-rendering.ts:1641 [2025-07-16T19:04:35.014Z] ⏱️ Recovery attempt 1 scheduled with 2000ms backoff
board-rendering.ts:349 [2025-07-16T19:04:35.108Z] New tile appearance completed in 369ms
board-rendering.ts:350 [2025-07-16T19:04:35.108Z] Total tile change animation completed in 505ms (seq: 4)
board-rendering.ts:354 [2025-07-16T19:04:35.108Z] Slow tile animation detected: 505ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:35.108Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:35.109Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:35.109Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:35.109Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:35.109Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 4) processed successfully.
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:36.336Z] 📡 Board resync received (periodic): checksum=2a17a843b80a83693f302da419404ecd
GameConnection.tsx:465 [2025-07-16T19:04:36.336Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1680 [2025-07-16T19:04:37.015Z] 🔧 Attempting visual state recovery...
board-rendering.ts:1693 [2025-07-16T19:04:37.015Z] ⚠️ Tile-by-tile correction failed, attempting full refresh...
attemptVisualStateRecovery @ board-rendering.ts:1693
(anonymous) @ board-rendering.ts:1645
setTimeout
performThrottledValidation @ board-rendering.ts:1644
(anonymous) @ board-rendering.ts:1583
setTimeout
(anonymous) @ board-rendering.ts:1582
setInterval
startPeriodicVisualValidation @ board-rendering.ts:1565
create @ PhaserGame.tsx:823
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
board-rendering.ts:1378 [2025-07-16T19:04:37.015Z] 🔄 Starting full visual state refresh...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
board-rendering.ts:1394 [2025-07-16T19:04:37.028Z] ✅ Visual state refresh completed
board-rendering.ts:1697 [2025-07-16T19:04:37.028Z] ✅ Recovery successful - full refresh completed
board-rendering.ts:1616 [2025-07-16T19:04:38.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:38.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:39.338Z] 📡 Board resync received (periodic): checksum=2a17a843b80a83693f302da419404ecd
GameConnection.tsx:465 [2025-07-16T19:04:39.338Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:40.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:40.013Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:42.339Z] 📡 Board resync received (periodic): checksum=2a17a843b80a83693f302da419404ecd
GameConnection.tsx:465 [2025-07-16T19:04:42.339Z] 🔄 Periodic board sync: checksum validated
PhaserGame.tsx:406 [2025-07-16T19:04:42.542Z] 📨 Received tile changes (seq: 5, latency: 6ms): {removed: 3, falling: 0, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:04:42.542Z] 🎯 Processing tile changes (seq: 5)...
board-rendering.ts:305 [2025-07-16T19:04:42.542Z] Starting tile change animation (seq: 5): {removed: 3, falling: 0, new: 3, latency: 6}
board-rendering.ts:206 [2025-07-16T19:04:42.542Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:219 Valid word submitted: {word: 'ION', points: 3, score: 10, speedBonus: false}
GameConnection.tsx:53 [Client] Word validation latency: 7ms (VALID) - "ION"
GameConnection.tsx:23 [2025-07-16T19:04:42.543Z] Socket Event Received: game:score-update {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 3, totalScore: 10, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 3, totalScore: 10, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:04:42.543Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
App.tsx:118 [2025-07-16T19:04:42.544Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:42.594Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:42.594Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:42.594Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:42.672Z] Tile removal completed in 130ms
board-rendering.ts:342 [2025-07-16T19:04:42.672Z] Tile falling completed in 0ms
board-rendering.ts:349 [2025-07-16T19:04:43.031Z] New tile appearance completed in 359ms
board-rendering.ts:350 [2025-07-16T19:04:43.031Z] Total tile change animation completed in 489ms (seq: 5)
board-rendering.ts:354 [2025-07-16T19:04:43.031Z] Slow tile animation detected: 489ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:43.031Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:43.031Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:43.031Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:43.032Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:43.032Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 5) processed successfully.
board-rendering.ts:1616 [2025-07-16T19:04:43.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:43.774Z] ✅ Visual state validation passed
board-rendering.ts:1616 [2025-07-16T19:04:45.012Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:45.012Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:45.341Z] 📡 Board resync received (periodic): checksum=038cc8ae9cea7cb89ee81403338f49df
GameConnection.tsx:465 [2025-07-16T19:04:45.341Z] 🔄 Periodic board sync: checksum validated
PhaserGame.tsx:406 [2025-07-16T19:04:45.946Z] 📨 Received tile changes (seq: 6, latency: 2ms): {removed: 4, falling: 0, new: 4}
PhaserGame.tsx:1017 [2025-07-16T19:04:45.946Z] 🎯 Processing tile changes (seq: 6)...
board-rendering.ts:305 [2025-07-16T19:04:45.946Z] Starting tile change animation (seq: 6): {removed: 4, falling: 0, new: 4, latency: 2}
board-rendering.ts:206 [2025-07-16T19:04:45.946Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:219 Valid word submitted: {word: 'THAN', points: 8, score: 18, speedBonus: false}
GameConnection.tsx:53 [Client] Word validation latency: 5ms (VALID) - "THAN"
GameConnection.tsx:23 [2025-07-16T19:04:45.947Z] Socket Event Received: game:score-update {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 8, totalScore: 18, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 8, totalScore: 18, speedBonus: false}
App.tsx:118 [2025-07-16T19:04:45.948Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:23 [2025-07-16T19:04:45.948Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:45.999Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:45.999Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:45.999Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:46.073Z] Tile removal completed in 126ms
board-rendering.ts:342 [2025-07-16T19:04:46.073Z] Tile falling completed in 0ms
board-rendering.ts:349 [2025-07-16T19:04:46.424Z] New tile appearance completed in 351ms
board-rendering.ts:350 [2025-07-16T19:04:46.424Z] Total tile change animation completed in 478ms (seq: 6)
board-rendering.ts:354 [2025-07-16T19:04:46.424Z] Slow tile animation detected: 478ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:46.424Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:46.424Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:46.424Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:46.424Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:46.425Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 6) processed successfully.
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:48.343Z] 📡 Board resync received (periodic): checksum=a3d5d0ec055e0c4c999c9d998fe4feb0
GameConnection.tsx:465 [2025-07-16T19:04:48.343Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:48.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:48.774Z] ✅ Visual state validation passed
board-rendering.ts:1616 [2025-07-16T19:04:50.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:50.014Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
PhaserGame.tsx:406 [2025-07-16T19:04:51.344Z] 📨 Received tile changes (seq: 7, latency: 1ms): {removed: 3, falling: 1, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:04:51.344Z] 🎯 Processing tile changes (seq: 7)...
board-rendering.ts:305 [2025-07-16T19:04:51.344Z] Starting tile change animation (seq: 7): {removed: 3, falling: 1, new: 3, latency: 1}
board-rendering.ts:206 [2025-07-16T19:04:51.345Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:04:51.345Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 6, totalScore: 18, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 6, totalScore: 18, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:04:51.346Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameConnection.tsx:435 [2025-07-16T19:04:51.347Z] 📡 Board resync received (periodic): checksum=46c918b4e7e428c357c55d35b0e057bb
GameConnection.tsx:465 [2025-07-16T19:04:51.347Z] 🔄 Periodic board sync: checksum validated
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:04:51.396Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:04:51.396Z', to: ƒ}
App.tsx:118 [2025-07-16T19:04:51.397Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:04:51.465Z] Tile removal completed in 120ms
board-rendering.ts:342 [2025-07-16T19:04:51.705Z] Tile falling completed in 240ms
board-rendering.ts:349 [2025-07-16T19:04:52.025Z] New tile appearance completed in 320ms
board-rendering.ts:350 [2025-07-16T19:04:52.025Z] Total tile change animation completed in 681ms (seq: 7)
board-rendering.ts:354 [2025-07-16T19:04:52.025Z] Slow tile animation detected: 681ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:04:52.025Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:04:52.025Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:04:52.025Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:04:52.025Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:04:52.025Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 7) processed successfully.
board-rendering.ts:1616 [2025-07-16T19:04:53.774Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:53.775Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:54.349Z] 📡 Board resync received (periodic): checksum=46c918b4e7e428c357c55d35b0e057bb
GameConnection.tsx:465 [2025-07-16T19:04:54.349Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:55.014Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:55.014Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:04:57.351Z] 📡 Board resync received (periodic): checksum=46c918b4e7e428c357c55d35b0e057bb
GameConnection.tsx:465 [2025-07-16T19:04:57.352Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:04:58.775Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:04:58.775Z] ✅ Visual state validation passed
PhaserGame.tsx:714 [2025-07-16T19:04:59.513Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 0, successRate: '0.0%', recentFailures: 0, historyLength: 0}
board-rendering.ts:1616 [2025-07-16T19:05:00.013Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:00.014Z] ✅ Visual state validation passed
PhaserGame.tsx:406 [2025-07-16T19:05:00.237Z] 📨 Received tile changes (seq: 8, latency: 0ms): {removed: 3, falling: 0, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:05:00.237Z] 🎯 Processing tile changes (seq: 8)...
board-rendering.ts:305 [2025-07-16T19:05:00.237Z] Starting tile change animation (seq: 8): {removed: 3, falling: 0, new: 3, latency: 0}
board-rendering.ts:206 [2025-07-16T19:05:00.237Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:05:00.238Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 8, totalScore: 26, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 8, totalScore: 26, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:05:00.238Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:23 [2025-07-16T19:05:00.275Z] Socket Event Received: match:round-end {roundNumber: 1, scores: Array(2), isMatchComplete: false}
GameConnection.tsx:29 [2025-07-16T19:05:00.275Z] MATCH EVENT: match:round-end {roundNumber: 1, scores: Array(2), isMatchComplete: false}
logSocketEvent @ GameConnection.tsx:29
(anonymous) @ GameConnection.tsx:483
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:484 Round ended: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'round-end', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:05:00.276Z'}
App.tsx:118 [2025-07-16T19:05:00.276Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
App.tsx:118 [2025-07-16T19:05:00.276Z] 🎯 AppContent render: gameState=round-end, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:64 [2025-07-16T19:05:00.278Z] 🎮 PhaserGame UNMOUNTING - Instance ID: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:149 [2025-07-16T19:05:00.278Z] 🧹 Starting Phaser cleanup - Instance: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:156 [2025-07-16T19:05:00.278Z] 📡 Cleaning up socket listeners - Instance: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:175 [2025-07-16T19:05:00.278Z] 🎮 Destroying Phaser game instance - Instance: phaser-1752692609320-wj9pbwck1
PhaserGame.tsx:179 [2025-07-16T19:05:00.278Z] 🎬 Active scenes before destruction: 1
PhaserGame.tsx:183 [2025-07-16T19:05:00.278Z] ✅ Phaser game instance destroyed successfully - Instance: phaser-1752692609320-wj9pbwck1
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:05:00.290Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:05:00.291Z', to: ƒ}
App.tsx:118 [2025-07-16T19:05:00.291Z] 🎯 AppContent render: gameState=round-end, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:04.512Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:1075 Error processing tile changes (seq: 8): Error: Processing timeout after 5 seconds
    at PhaserGame.tsx:1063:33
(anonymous) @ PhaserGame.tsx:1075
Promise.catch
processQueuedTileChanges @ PhaserGame.tsx:1074
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'match', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:05:05.278Z'}
App.tsx:118 [2025-07-16T19:05:05.278Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:52 [2025-07-16T19:05:05.281Z] 🎮 PhaserGame MOUNTED - Instance ID: phaser-1752692705280-09por1dx9
PhaserGame.tsx:57 [2025-07-16T19:05:05.281Z] ⚠️ PhaserGame mounting during active game state: match
(anonymous) @ PhaserGame.tsx:57
commitHookEffectListMount @ chunk-WAYAUXAG.js?v=fcda56c5:16936
commitPassiveMountOnFiber @ chunk-WAYAUXAG.js?v=fcda56c5:18184
commitPassiveMountEffects_complete @ chunk-WAYAUXAG.js?v=fcda56c5:18157
commitPassiveMountEffects_begin @ chunk-WAYAUXAG.js?v=fcda56c5:18147
commitPassiveMountEffects @ chunk-WAYAUXAG.js?v=fcda56c5:18137
flushPassiveEffectsImpl @ chunk-WAYAUXAG.js?v=fcda56c5:19518
flushPassiveEffects @ chunk-WAYAUXAG.js?v=fcda56c5:19475
(anonymous) @ chunk-WAYAUXAG.js?v=fcda56c5:19356
workLoop @ chunk-WAYAUXAG.js?v=fcda56c5:197
flushWork @ chunk-WAYAUXAG.js?v=fcda56c5:176
performWorkUntilDeadline @ chunk-WAYAUXAG.js?v=fcda56c5:384
PhaserGame.tsx:76 [2025-07-16T19:05:05.281Z] 🕹️ Creating Phaser game instance - ID: phaser-1752692705280-09por1dx9
PhaserGame.tsx:140      Phaser v3.90.0 (WebGL | Web Audio)  https://phaser.io/v390
PhaserGame.tsx:141 [2025-07-16T19:05:05.335Z] ✅ Phaser game instance created successfully - ID: phaser-1752692705280-09por1dx9
PhaserGame.tsx:119 [2025-07-16T19:05:05.430Z] 🎬 Phaser scene PRELOAD - Instance: phaser-1752692705280-09por1dx9
PhaserGame.tsx:291 [2025-07-16T19:05:05.430Z] 🎵 Loading audio assets...
PhaserGame.tsx:345 System fonts ready
PhaserGame.tsx:328 [2025-07-16T19:05:05.442Z] ✨ Premium particle textures created
PhaserGame.tsx:123 [2025-07-16T19:05:05.442Z] 🎬 Phaser scene CREATE - Instance: phaser-1752692705280-09por1dx9
PhaserGame.tsx:780 [2025-07-16T19:05:05.442Z] 🎬 Scene CREATE started - optimized initialization...
PhaserGame.tsx:784 [2025-07-16T19:05:05.442Z] ⚡ Scene not fully active, continuing with initialization...
create @ PhaserGame.tsx:784
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:1109 [2025-07-16T19:05:05.443Z] 🎵 Initializing audio system...
PhaserGame.tsx:1132 [2025-07-16T19:05:05.443Z] ✅ Audio system initialized successfully
PhaserGame.tsx:1145 [2025-07-16T19:05:05.443Z] ✨ Initializing particle system...
PhaserGame.tsx:1190 [2025-07-16T19:05:05.443Z] ⚠️ Particle system initialization failed: TypeError: particleSystem.manager.addEmitter is not a function
    at initializeParticleSystem (PhaserGame.tsx:1152:62)
    at Scene2.create (PhaserGame.tsx:797:3)
    at Scene2.create (PhaserGame.tsx:124:20)
    at SceneManager2.create (phaser.js?v=fcda56c5:110868:36)
    at SceneManager2.loadComplete (phaser.js?v=fcda56c5:110799:26)
    at LoaderPlugin2.emit (phaser.js?v=fcda56c5:137:43)
    at LoaderPlugin2.loadComplete (phaser.js?v=fcda56c5:67118:26)
    at LoaderPlugin2.fileProcessComplete (phaser.js?v=fcda56c5:67094:28)
    at AudioFile2.onProcessComplete (phaser.js?v=fcda56c5:66323:33)
    at config.context (phaser.js?v=fcda56c5:68044:31)
initializeParticleSystem @ PhaserGame.tsx:1190
create @ PhaserGame.tsx:797
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:844 [2025-07-16T19:05:05.446Z] 🎯 Updating board display with validation...
PhaserGame.tsx:848 [2025-07-16T19:05:05.446Z] ⚠️ Scene not ready for board update - attempting recovery
updateBoardDisplayWrapper @ PhaserGame.tsx:848
create @ PhaserGame.tsx:814
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:495 [2025-07-16T19:05:05.446Z] 🔄 Starting progressive scene recovery...
PhaserGame.tsx:530 [2025-07-16T19:05:05.446Z] 🔧 Step 1: Attempting tile refresh...
PhaserGame.tsx:581 [2025-07-16T19:05:05.446Z] 🔧 Step 2: Attempting board refresh...
PhaserGame.tsx:632 [2025-07-16T19:05:05.446Z] 🔧 Step 3: Attempting scene restart...
PhaserGame.tsx:684 [2025-07-16T19:05:05.446Z] 🚨 Step 4: Attempting full Phaser restart (last resort)...
PhaserGame.tsx:693 [2025-07-16T19:05:05.446Z] ⚠️ Step 4 initiated: full restart triggered
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
PhaserGame.tsx:889 [2025-07-16T19:05:05.463Z] 🔄 Starting periodic visual validation...
PhaserGame.tsx:837 [2025-07-16T19:05:05.463Z] ✅ Scene CREATE completed successfully
PhaserGame.tsx:358 Fonts loaded successfully
board-rendering.ts:193 [2025-07-16T19:05:05.465Z] 🔄 Scene transition bypass ENABLED
board-rendering.ts:195 [2025-07-16T19:05:05.465Z] 🔄 Scene transition bypass DISABLED
board-rendering.ts:193 [2025-07-16T19:05:05.465Z] 🔄 Scene transition bypass ENABLED
board-rendering.ts:1378 [2025-07-16T19:05:05.465Z] 🔄 Starting full visual state refresh...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
board-rendering.ts:1394 [2025-07-16T19:05:05.480Z] ✅ Visual state refresh completed
PhaserGame.tsx:598 [2025-07-16T19:05:05.480Z] ✅ Step 2 successful: board refresh completed
board-rendering.ts:195 [2025-07-16T19:05:05.480Z] 🔄 Scene transition bypass DISABLED
board-rendering.ts:193 [2025-07-16T19:05:05.480Z] 🔄 Scene transition bypass ENABLED
PhaserGame.tsx:844 [2025-07-16T19:05:05.482Z] 🎯 Updating board display with validation...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
PhaserGame.tsx:654 [2025-07-16T19:05:05.491Z] ✅ Step 3 successful: scene restart completed
board-rendering.ts:195 [2025-07-16T19:05:05.492Z] 🔄 Scene transition bypass DISABLED
PhaserGame.tsx:883 [2025-07-16T19:05:05.514Z] ✅ Visual state validation passed
PhaserGame.tsx:883 [2025-07-16T19:05:05.542Z] ✅ Visual state validation passed
GameConnection.tsx:371 Match started: {board: {…}, boardChecksum: '98f1175d5229d7d337b8fdc0e745e6ea', timeRemaining: 90000, currentRound: 2, totalRounds: 2, …}
GameConnection.tsx:401 [2025-07-16T19:05:07.327Z] Board validation: server_checksum=98f1175d5229d7d337b8fdc0e745e6ea, client_validation=eyJ3aWR0aCI6NCwi, board_size=4x4, players=2
GameConnection.tsx:405 [2025-07-16T19:05:07.327Z] Board layout: ERTD|ILTN|ECOU|AEAR
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'match', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:05:07.327Z'}
GameContext.tsx:173 [GameContext] State change: roundTimer {from: null, to: {…}, triggeredBy: 'setRoundTimerEnhanced', timestamp: '2025-07-16T19:05:07.327Z'}
App.tsx:118 [2025-07-16T19:05:07.328Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: matchData {from: null, to: {…}, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:05:07.379Z'}
App.tsx:118 [2025-07-16T19:05:07.379Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:1573 [2025-07-16T19:05:09.512Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:05:10.963Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:10.964Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:12.327Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:12.327Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:14.513Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:05:15.329Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:15.329Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:05:15.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:15.964Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:18.331Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:18.331Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:19.512Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1616 [2025-07-16T19:05:20.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:20.965Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:21.333Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:21.334Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:24.335Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:24.336Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1573 [2025-07-16T19:05:24.512Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:05:25.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:25.965Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:27.340Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:27.340Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:29.512Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:714 [2025-07-16T19:05:29.512Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
GameConnection.tsx:435 [2025-07-16T19:05:30.343Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:30.343Z] 🔄 Periodic board sync: checksum validated
GameConnection.tsx:231 Invalid word submitted: {word: 'BE', reason: 'Word must be at least 3 letters for medium difficulty'}
GameConnection.tsx:53 [Client] Word validation latency: 3ms (INVALID) - "BE"
App.tsx:118 [2025-07-16T19:05:30.628Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:1616 [2025-07-16T19:05:30.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:30.964Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:33.344Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:33.344Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:34.511Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:714 [2025-07-16T19:05:35.464Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
board-rendering.ts:1616 [2025-07-16T19:05:35.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:35.965Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:36.346Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:36.347Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:39.348Z] 📡 Board resync received (periodic): checksum=98f1175d5229d7d337b8fdc0e745e6ea
GameConnection.tsx:465 [2025-07-16T19:05:39.349Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1573 [2025-07-16T19:05:39.511Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:05:40.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:40.964Z] ✅ Visual state validation passed
PhaserGame.tsx:406 [2025-07-16T19:05:41.474Z] 📨 Received tile changes (seq: 9, latency: 1ms): {removed: 4, falling: 6, new: 4}
PhaserGame.tsx:1017 [2025-07-16T19:05:41.474Z] 🎯 Processing tile changes (seq: 9)...
board-rendering.ts:305 [2025-07-16T19:05:41.475Z] Starting tile change animation (seq: 9): {removed: 4, falling: 6, new: 4, latency: 2}
board-rendering.ts:206 [2025-07-16T19:05:41.475Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:23 [2025-07-16T19:05:41.475Z] Socket Event Received: game:score-update {playerId: 'cg64Q17o7-SamFegAAAD', score: 18, totalScore: 44, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'cg64Q17o7-SamFegAAAD', score: 18, totalScore: 44, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:05:41.476Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:05:41.526Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:05:41.527Z', to: ƒ}
App.tsx:118 [2025-07-16T19:05:41.527Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:05:41.603Z] Tile removal completed in 128ms
board-rendering.ts:342 [2025-07-16T19:05:41.862Z] Tile falling completed in 259ms
board-rendering.ts:349 [2025-07-16T19:05:42.222Z] New tile appearance completed in 360ms
board-rendering.ts:350 [2025-07-16T19:05:42.223Z] Total tile change animation completed in 747ms (seq: 9)
board-rendering.ts:354 [2025-07-16T19:05:42.223Z] Slow tile animation detected: 747ms (target: <400ms)
(anonymous) @ board-rendering.ts:354
Promise.then
(anonymous) @ board-rendering.ts:346
Promise.then
(anonymous) @ board-rendering.ts:340
Promise.then
(anonymous) @ board-rendering.ts:334
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:390 [2025-07-16T19:05:42.223Z] 🔄 Rebinding tile events after cascade...
board-rendering.ts:418 [2025-07-16T19:05:42.223Z] ✅ Rebound 16 tile interactions
board-rendering.ts:432 [2025-07-16T19:05:42.223Z] 🔍 Validating adjacency after cascade...
board-rendering.ts:468 [2025-07-16T19:05:42.223Z] ✅ Adjacency validated for 16 tiles
board-rendering.ts:208 [2025-07-16T19:05:42.223Z] 🎬 Tile animation bypass DISABLED
PhaserGame.tsx:1070 Tile changes (seq: 9) processed successfully.
GameConnection.tsx:435 [2025-07-16T19:05:42.350Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:42.350Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:44.512Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:05:45.351Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:45.352Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:05:45.963Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:45.963Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:48.353Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:48.354Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:49.512Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1616 [2025-07-16T19:05:50.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:50.965Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:51.355Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:51.356Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:05:54.357Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:54.357Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1573 [2025-07-16T19:05:54.512Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:05:55.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:05:55.965Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:05:57.359Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:05:57.359Z] 🔄 Periodic board sync: checksum validated
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:05:59.512Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:714 [2025-07-16T19:05:59.512Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
GameConnection.tsx:435 [2025-07-16T19:06:00.360Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:00.360Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:06:00.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:00.965Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:06:04.511Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:06:05.362Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:05.362Z] 🔄 Periodic board sync: checksum validated
PhaserGame.tsx:714 [2025-07-16T19:06:05.464Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
board-rendering.ts:1616 [2025-07-16T19:06:05.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:05.965Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:06:09.512Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:06:10.364Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:10.364Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:06:10.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:10.965Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:06:14.511Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:06:15.366Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:15.366Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:06:15.963Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:15.963Z] ✅ Visual state validation passed
GameConnection.tsx:231 Invalid word submitted: {word: 'TBEES', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 111ms (INVALID) - "TBEES"
App.tsx:118 [2025-07-16T19:06:16.238Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:231 Invalid word submitted: {word: 'TEE', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 7ms (INVALID) - "TEE"
App.tsx:118 [2025-07-16T19:06:18.748Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:06:19.512Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:06:20.368Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:20.368Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1616 [2025-07-16T19:06:20.965Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:20.965Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:231 Invalid word submitted: {word: 'FEE', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 2ms (INVALID) - "FEE"
App.tsx:118 [2025-07-16T19:06:22.418Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:231 Invalid word submitted: {word: 'FEE', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 6ms (INVALID) - "FEE"
App.tsx:118 [2025-07-16T19:06:23.258Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:435 [2025-07-16T19:06:23.370Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:23.370Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1573 [2025-07-16T19:06:24.511Z] ⏭️ Visual validation skipped - bypass conditions met
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1616 [2025-07-16T19:06:25.964Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:25.964Z] ✅ Visual state validation passed
GameConnection.tsx:435 [2025-07-16T19:06:26.372Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:26.372Z] 🔄 Periodic board sync: checksum validated
GameConnection.tsx:231 Invalid word submitted: {word: 'FEO', reason: 'Word not found in dictionary'}
GameConnection.tsx:53 [Client] Word validation latency: 5ms (INVALID) - "FEO"
App.tsx:118 [2025-07-16T19:06:27.049Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:231 Invalid word submitted: {word: 'ROEE', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 5ms (INVALID) - "ROEE"
App.tsx:118 [2025-07-16T19:06:29.231Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameConnection.tsx:435 [2025-07-16T19:06:29.374Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:29.374Z] 🔄 Periodic board sync: checksum validated
board-rendering.ts:1573 [2025-07-16T19:06:29.511Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:714 [2025-07-16T19:06:29.511Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
board-rendering.ts:1616 [2025-07-16T19:06:30.963Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:30.963Z] ✅ Visual state validation passed
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:435 [2025-07-16T19:06:32.376Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:32.376Z] 🔄 Periodic board sync: checksum validated
GameConnection.tsx:231 Invalid word submitted: {word: 'VROEE', reason: 'Path cannot reuse the same tile'}
GameConnection.tsx:53 [Client] Word validation latency: 3ms (INVALID) - "VROEE"
App.tsx:118 [2025-07-16T19:06:32.791Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:231 Invalid word submitted: {word: 'AX', reason: 'Word must be at least 3 letters for medium difficulty'}
GameConnection.tsx:53 [Client] Word validation latency: 6ms (INVALID) - "AX"
App.tsx:118 [2025-07-16T19:06:34.411Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:1573 [2025-07-16T19:06:34.512Z] ⏭️ Visual validation skipped - bypass conditions met
GameConnection.tsx:435 [2025-07-16T19:06:35.379Z] 📡 Board resync received (periodic): checksum=33df070f8d863f0b24f3c232f1f2a148
GameConnection.tsx:465 [2025-07-16T19:06:35.379Z] 🔄 Periodic board sync: checksum validated
PhaserGame.tsx:714 [2025-07-16T19:06:35.463Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 3, successRate: '100.0%', recentFailures: 0, historyLength: 3}
board-rendering.ts:1616 [2025-07-16T19:06:35.963Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:35.963Z] ✅ Visual state validation passed
PhaserGame.tsx:406 [2025-07-16T19:06:37.012Z] 📨 Received tile changes (seq: 10, latency: 4ms): {removed: 3, falling: 5, new: 3}
PhaserGame.tsx:1017 [2025-07-16T19:06:37.013Z] 🎯 Processing tile changes (seq: 10)...
board-rendering.ts:305 [2025-07-16T19:06:37.013Z] Starting tile change animation (seq: 10): {removed: 3, falling: 5, new: 3, latency: 5}
board-rendering.ts:206 [2025-07-16T19:06:37.013Z] 🎬 Tile animation bypass ENABLED
GameConnection.tsx:219 Valid word submitted: {word: 'JAB', points: 14, score: 32, speedBonus: false}
GameConnection.tsx:53 [Client] Word validation latency: 7ms (VALID) - "JAB"
GameConnection.tsx:23 [2025-07-16T19:06:37.014Z] Socket Event Received: game:score-update {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 14, totalScore: 32, speedBonus: false}
GameConnection.tsx:244 Score update: {playerId: 'eJ0RHyhZmO4WWOqkAAAB', score: 14, totalScore: 32, speedBonus: false}
GameConnection.tsx:23 [2025-07-16T19:06:37.015Z] Socket Event Received: game:leaderboard-update {players: Array(2)}
GameConnection.tsx:525 Leaderboard update: (2) [{…}, {…}]
App.tsx:118 [2025-07-16T19:06:37.015Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: matchData {from: null, triggeredBy: 'setMatchData', timestamp: '2025-07-16T19:06:37.066Z', to: ƒ}
GameContext.tsx:173 [GameContext] State change: currentRoom {from: null, triggeredBy: 'setCurrentRoom', timestamp: '2025-07-16T19:06:37.066Z', to: ƒ}
App.tsx:118 [2025-07-16T19:06:37.066Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
board-rendering.ts:336 [2025-07-16T19:06:37.152Z] Tile removal completed in 139ms
schemas.ts:314 Error in socket handler for match:timer-update: ReferenceError: setRoundTimer is not defined
    at GameContext.tsx:341:7
    at GameConnection.tsx:479:7
    at Socket2.<anonymous> (schemas.ts:308:9)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at Socket2.emitEvent (socket__io-client.js?v=fcda56c5:2657:16)
    at Socket2.onevent (socket__io-client.js?v=fcda56c5:2645:12)
    at Socket2.onpacket (socket__io-client.js?v=fcda56c5:2616:14)
    at Emitter.emit (socket__io-client.js?v=fcda56c5:356:20)
    at socket__io-client.js?v=fcda56c5:3220:12
(anonymous) @ schemas.ts:314
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:23 [2025-07-16T19:06:37.369Z] Socket Event Received: match:round-end {roundNumber: 2, scores: Array(2), isMatchComplete: true}
GameConnection.tsx:29 [2025-07-16T19:06:37.369Z] MATCH EVENT: match:round-end {roundNumber: 2, scores: Array(2), isMatchComplete: true}
logSocketEvent @ GameConnection.tsx:29
(anonymous) @ GameConnection.tsx:483
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:484 Round ended: (2) [{…}, {…}]
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'round-end', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:06:37.369Z'}
App.tsx:118 [2025-07-16T19:06:37.370Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
App.tsx:118 [2025-07-16T19:06:37.370Z] 🎯 AppContent render: gameState=round-end, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:64 [2025-07-16T19:06:37.371Z] 🎮 PhaserGame UNMOUNTING - Instance ID: phaser-1752692705280-09por1dx9
PhaserGame.tsx:149 [2025-07-16T19:06:37.371Z] 🧹 Starting Phaser cleanup - Instance: phaser-1752692705280-09por1dx9
PhaserGame.tsx:156 [2025-07-16T19:06:37.371Z] 📡 Cleaning up socket listeners - Instance: phaser-1752692705280-09por1dx9
PhaserGame.tsx:175 [2025-07-16T19:06:37.371Z] 🎮 Destroying Phaser game instance - Instance: phaser-1752692705280-09por1dx9
PhaserGame.tsx:179 [2025-07-16T19:06:37.371Z] 🎬 Active scenes before destruction: 1
PhaserGame.tsx:183 [2025-07-16T19:06:37.371Z] ✅ Phaser game instance destroyed successfully - Instance: phaser-1752692705280-09por1dx9
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1861 Uncaught TypeError: Cannot read properties of undefined (reading 'game')
    at board-rendering.ts:1861:41
(anonymous) @ board-rendering.ts:1861
setTimeout
createTileRemovalEffect @ board-rendering.ts:1860
(anonymous) @ board-rendering.ts:503
(anonymous) @ board-rendering.ts:499
animateTileRemoval @ board-rendering.ts:486
(anonymous) @ board-rendering.ts:333
processTileChanges @ board-rendering.ts:303
processQueuedTileChanges @ PhaserGame.tsx:1066
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
board-rendering.ts:1573 [2025-07-16T19:06:39.512Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:40.463Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:1075 Error processing tile changes (seq: 10): Error: Processing timeout after 5 seconds
    at PhaserGame.tsx:1063:33
(anonymous) @ PhaserGame.tsx:1075
Promise.catch
processQueuedTileChanges @ PhaserGame.tsx:1074
(anonymous) @ PhaserGame.tsx:432
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:23 [2025-07-16T19:06:42.372Z] Socket Event Received: match:finished {winner: {…}, finalScores: Array(2), totalRounds: 2}
GameConnection.tsx:29 [2025-07-16T19:06:42.372Z] MATCH EVENT: match:finished {winner: {…}, finalScores: Array(2), totalRounds: 2}
logSocketEvent @ GameConnection.tsx:29
(anonymous) @ GameConnection.tsx:504
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameConnection.tsx:505 Match finished: {winner: {…}, finalScores: Array(2), totalRounds: 2}
GameContext.tsx:143 [GameContext] Invalid state transition: menu -> match-end
validateStateTransition @ GameContext.tsx:143
(anonymous) @ GameContext.tsx:257
(anonymous) @ GameConnection.tsx:510
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameContext.tsx:144 [GameContext] Valid transitions from menu: (3) ['lobby', 'match', 'round-end']
validateStateTransition @ GameContext.tsx:144
(anonymous) @ GameContext.tsx:257
(anonymous) @ GameConnection.tsx:510
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
GameContext.tsx:258 [GameContext] Blocked invalid state transition: menu -> match-end
(anonymous) @ GameContext.tsx:258
(anonymous) @ GameConnection.tsx:510
(anonymous) @ schemas.ts:308
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
emitEvent @ socket__io-client.js?v=fcda56c5:2657
onevent @ socket__io-client.js?v=fcda56c5:2645
onpacket @ socket__io-client.js?v=fcda56c5:2616
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
(anonymous) @ socket__io-client.js?v=fcda56c5:3220
Promise.then
(anonymous) @ socket__io-client.js?v=fcda56c5:374
ondecoded @ socket__io-client.js?v=fcda56c5:3219
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
add @ socket__io-client.js?v=fcda56c5:2071
ondata @ socket__io-client.js?v=fcda56c5:3208
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
_onPacket @ socket__io-client.js?v=fcda56c5:1381
Emitter.emit @ socket__io-client.js?v=fcda56c5:356
onPacket @ socket__io-client.js?v=fcda56c5:555
onData @ socket__io-client.js?v=fcda56c5:547
ws.onmessage @ socket__io-client.js?v=fcda56c5:1011
App.tsx:118 [2025-07-16T19:06:42.374Z] 🎯 AppContent render: gameState=round-end, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
GameContext.tsx:173 [GameContext] State change: gameState {from: 'round-end', to: 'match', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:06:43.754Z'}
App.tsx:118 [2025-07-16T19:06:43.757Z] 🎯 AppContent render: gameState=match, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:52 [2025-07-16T19:06:43.759Z] 🎮 PhaserGame MOUNTED - Instance ID: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:57 [2025-07-16T19:06:43.759Z] ⚠️ PhaserGame mounting during active game state: match-end
(anonymous) @ PhaserGame.tsx:57
commitHookEffectListMount @ chunk-WAYAUXAG.js?v=fcda56c5:16936
commitPassiveMountOnFiber @ chunk-WAYAUXAG.js?v=fcda56c5:18184
commitPassiveMountEffects_complete @ chunk-WAYAUXAG.js?v=fcda56c5:18157
commitPassiveMountEffects_begin @ chunk-WAYAUXAG.js?v=fcda56c5:18147
commitPassiveMountEffects @ chunk-WAYAUXAG.js?v=fcda56c5:18137
flushPassiveEffectsImpl @ chunk-WAYAUXAG.js?v=fcda56c5:19518
flushPassiveEffects @ chunk-WAYAUXAG.js?v=fcda56c5:19475
(anonymous) @ chunk-WAYAUXAG.js?v=fcda56c5:19356
workLoop @ chunk-WAYAUXAG.js?v=fcda56c5:197
flushWork @ chunk-WAYAUXAG.js?v=fcda56c5:176
performWorkUntilDeadline @ chunk-WAYAUXAG.js?v=fcda56c5:384
PhaserGame.tsx:76 [2025-07-16T19:06:43.759Z] 🕹️ Creating Phaser game instance - ID: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:140      Phaser v3.90.0 (WebGL | Web Audio)  https://phaser.io/v390
PhaserGame.tsx:141 [2025-07-16T19:06:43.794Z] ✅ Phaser game instance created successfully - ID: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:119 [2025-07-16T19:06:43.838Z] 🎬 Phaser scene PRELOAD - Instance: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:291 [2025-07-16T19:06:43.838Z] 🎵 Loading audio assets...
PhaserGame.tsx:345 System fonts ready
PhaserGame.tsx:328 [2025-07-16T19:06:43.850Z] ✨ Premium particle textures created
PhaserGame.tsx:123 [2025-07-16T19:06:43.850Z] 🎬 Phaser scene CREATE - Instance: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:780 [2025-07-16T19:06:43.850Z] 🎬 Scene CREATE started - optimized initialization...
PhaserGame.tsx:784 [2025-07-16T19:06:43.850Z] ⚡ Scene not fully active, continuing with initialization...
create @ PhaserGame.tsx:784
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:1109 [2025-07-16T19:06:43.850Z] 🎵 Initializing audio system...
PhaserGame.tsx:1132 [2025-07-16T19:06:43.850Z] ✅ Audio system initialized successfully
PhaserGame.tsx:1145 [2025-07-16T19:06:43.850Z] ✨ Initializing particle system...
PhaserGame.tsx:1190 [2025-07-16T19:06:43.850Z] ⚠️ Particle system initialization failed: TypeError: particleSystem.manager.addEmitter is not a function
    at initializeParticleSystem (PhaserGame.tsx:1152:62)
    at Scene2.create (PhaserGame.tsx:797:3)
    at Scene2.create (PhaserGame.tsx:124:20)
    at SceneManager2.create (phaser.js?v=fcda56c5:110868:36)
    at SceneManager2.loadComplete (phaser.js?v=fcda56c5:110799:26)
    at LoaderPlugin2.emit (phaser.js?v=fcda56c5:137:43)
    at LoaderPlugin2.loadComplete (phaser.js?v=fcda56c5:67118:26)
    at LoaderPlugin2.fileProcessComplete (phaser.js?v=fcda56c5:67094:28)
    at AudioFile2.onProcessComplete (phaser.js?v=fcda56c5:66323:33)
    at config.context (phaser.js?v=fcda56c5:68044:31)
initializeParticleSystem @ PhaserGame.tsx:1190
create @ PhaserGame.tsx:797
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:844 [2025-07-16T19:06:43.853Z] 🎯 Updating board display with validation...
PhaserGame.tsx:848 [2025-07-16T19:06:43.853Z] ⚠️ Scene not ready for board update - attempting recovery
updateBoardDisplayWrapper @ PhaserGame.tsx:848
create @ PhaserGame.tsx:814
create @ PhaserGame.tsx:124
create @ phaser.js?v=fcda56c5:110868
loadComplete @ phaser.js?v=fcda56c5:110799
emit @ phaser.js?v=fcda56c5:137
loadComplete @ phaser.js?v=fcda56c5:67118
fileProcessComplete @ phaser.js?v=fcda56c5:67094
onProcessComplete @ phaser.js?v=fcda56c5:66323
config.context @ phaser.js?v=fcda56c5:68044
PhaserGame.tsx:495 [2025-07-16T19:06:43.853Z] 🔄 Starting progressive scene recovery...
PhaserGame.tsx:530 [2025-07-16T19:06:43.853Z] 🔧 Step 1: Attempting tile refresh...
PhaserGame.tsx:581 [2025-07-16T19:06:43.853Z] 🔧 Step 2: Attempting board refresh...
PhaserGame.tsx:632 [2025-07-16T19:06:43.853Z] 🔧 Step 3: Attempting scene restart...
PhaserGame.tsx:684 [2025-07-16T19:06:43.853Z] 🚨 Step 4: Attempting full Phaser restart (last resort)...
PhaserGame.tsx:693 [2025-07-16T19:06:43.853Z] ⚠️ Step 4 initiated: full restart triggered
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
PhaserGame.tsx:889 [2025-07-16T19:06:43.862Z] 🔄 Starting periodic visual validation...
PhaserGame.tsx:837 [2025-07-16T19:06:43.862Z] ✅ Scene CREATE completed successfully
PhaserGame.tsx:358 Fonts loaded successfully
board-rendering.ts:193 [2025-07-16T19:06:43.865Z] 🔄 Scene transition bypass ENABLED
board-rendering.ts:195 [2025-07-16T19:06:43.865Z] 🔄 Scene transition bypass DISABLED
board-rendering.ts:193 [2025-07-16T19:06:43.865Z] 🔄 Scene transition bypass ENABLED
board-rendering.ts:1378 [2025-07-16T19:06:43.865Z] 🔄 Starting full visual state refresh...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
board-rendering.ts:1394 [2025-07-16T19:06:43.870Z] ✅ Visual state refresh completed
PhaserGame.tsx:598 [2025-07-16T19:06:43.870Z] ✅ Step 2 successful: board refresh completed
board-rendering.ts:195 [2025-07-16T19:06:43.870Z] 🔄 Scene transition bypass DISABLED
board-rendering.ts:193 [2025-07-16T19:06:43.870Z] 🔄 Scene transition bypass ENABLED
PhaserGame.tsx:844 [2025-07-16T19:06:43.871Z] 🎯 Updating board display with validation...
board-rendering.ts:1270 Premium board display created with 4 x 4 point-colored tiles
PhaserGame.tsx:654 [2025-07-16T19:06:43.876Z] ✅ Step 3 successful: scene restart completed
board-rendering.ts:195 [2025-07-16T19:06:43.876Z] 🔄 Scene transition bypass DISABLED
PhaserGame.tsx:883 [2025-07-16T19:06:43.912Z] ✅ Visual state validation passed
PhaserGame.tsx:883 [2025-07-16T19:06:43.926Z] ✅ Visual state validation passed
board-rendering.ts:1573 [2025-07-16T19:06:44.511Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:45.463Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1616 [2025-07-16T19:06:49.364Z] 🔍 Starting throttled visual state validation...
board-rendering.ts:1649 [2025-07-16T19:06:49.364Z] ✅ Visual state validation passed
board-rendering.ts:1573 [2025-07-16T19:06:49.512Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:50.464Z] ⏭️ Visual validation skipped - bypass conditions met
GameContext.tsx:173 [GameContext] State change: gameState {from: 'menu', to: 'lobby', triggeredBy: 'setGameState', timestamp: '2025-07-16T19:06:52.374Z'}
App.tsx:118 [2025-07-16T19:06:52.376Z] 🎯 AppContent render: gameState=lobby, phaserKey=phaser-2EUS-eJ0RHyhZmO4WWOqkAAAB, optimized=true
PhaserGame.tsx:64 [2025-07-16T19:06:52.379Z] 🎮 PhaserGame UNMOUNTING - Instance ID: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:149 [2025-07-16T19:06:52.380Z] 🧹 Starting Phaser cleanup - Instance: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:156 [2025-07-16T19:06:52.380Z] 📡 Cleaning up socket listeners - Instance: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:175 [2025-07-16T19:06:52.380Z] 🎮 Destroying Phaser game instance - Instance: phaser-1752692803758-3js6oh93e
PhaserGame.tsx:179 [2025-07-16T19:06:52.380Z] 🎬 Active scenes before destruction: 1
PhaserGame.tsx:183 [2025-07-16T19:06:52.380Z] ✅ Phaser game instance destroyed successfully - Instance: phaser-1752692803758-3js6oh93e
board-rendering.ts:1573 [2025-07-16T19:06:53.864Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:54.512Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:55.464Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:58.864Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:06:59.511Z] ⏭️ Visual validation skipped - bypass conditions met
PhaserGame.tsx:714 [2025-07-16T19:06:59.512Z] 📊 Recovery Metrics: {state: 'none', totalAttempts: 6, successRate: '100.0%', recentFailures: 0, historyLength: 6}
board-rendering.ts:1573 [2025-07-16T19:07:00.464Z] ⏭️ Visual validation skipped - bypass conditions met
board-rendering.ts:1573 [2025-07-16T19:07:03.864Z] ⏭️ Visual validation skipped - bypass conditions met
