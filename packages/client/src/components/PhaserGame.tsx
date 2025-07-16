/**
 * Word Rush Client - Phaser Game Component
 * React component that integrates Phaser 3 game engine for the core gameplay
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import WebFont from 'webfontloader';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  GameBoard,
  LetterTile,
  FONTS,
  TileChanges 
} from '@word-rush/common';
import { 
  BoardRenderingState, 
  updateBoardDisplay as updateBoardDisplayModule,
  processTileChanges,
  validateVisualState,
  correctVisualStateTileByTile,
  refreshVisualStateFromLogical,
  startPeriodicVisualValidation
} from './board-rendering.js';
import { 
  InteractionState, 
  setupTileInteraction,
  initializeGlobalPointerEvents
} from './interactions.js';
import { 
  LayoutState, 
  createGameLayout,
  initializeResizeHandler
} from './layout.js';

interface PhaserGameProps {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  gameState?: 'menu' | 'lobby' | 'match' | 'round-end' | 'match-end';
}

// Memoized component to prevent unnecessary re-renders
const PhaserGame: React.FC<PhaserGameProps> = React.memo(({ socket, gameState }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceIdRef = useRef<string>(`phaser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const isCleanupRef = useRef<boolean>(false); // Track cleanup state for Strict Mode

  // Add component lifecycle logging
  useEffect(() => {
    console.log(`[${new Date().toISOString()}] 🎮 PhaserGame MOUNTED - Instance ID: ${instanceIdRef.current}`);
    
    // Check if this is a remount during gameplay (React Strict Mode)
    const currentGameState = localStorage.getItem('wordRushGameState');
    if (currentGameState) {
      console.warn(`[${new Date().toISOString()}] ⚠️ PhaserGame mounting during active game state: ${currentGameState}`);
    }

    // Reset cleanup flag on mount
    isCleanupRef.current = false;

    return () => {
      console.log(`[${new Date().toISOString()}] 🎮 PhaserGame UNMOUNTING - Instance ID: ${instanceIdRef.current}`);
      isCleanupRef.current = true; // Mark as cleaning up
    };
  }, []);

  useEffect(() => {
    // Skip creation if we're in cleanup mode (React Strict Mode double-effect)
    if (isCleanupRef.current) {
      console.log(`[${new Date().toISOString()}] ⏳ Skipping Phaser creation - cleanup in progress`);
      return;
    }

    console.log(`[${new Date().toISOString()}] 🕹️ Creating Phaser game instance - ID: ${instanceIdRef.current}`);
    
    // Check if we already have a game instance
    if (gameRef.current) {
      console.warn(`[${new Date().toISOString()}] ⚠️ DUPLICATE: Phaser instance already exists! Destroying old instance first.`);
      try {
        gameRef.current.destroy(true);
      } catch (error) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Error destroying previous instance:`, error);
      } finally {
        gameRef.current = null;
      }
    }

    // Add small delay to prevent React Strict Mode double-mounting issues
    const createTimeout = setTimeout(() => {
      // Double-check we're not in cleanup mode after timeout
      if (isCleanupRef.current || !containerRef.current) {
        console.log(`[${new Date().toISOString()}] ⏳ Skipping delayed Phaser creation - component unmounted`);
        return;
      }

      // Phaser game configuration
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current || undefined,
        backgroundColor: '#2c3e50',
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 320,
            height: 240
          },
          max: {
            width: 1920,
            height: 1080
          }
        },
        scene: {
          preload: function(this: Phaser.Scene) {
            console.log(`[${new Date().toISOString()}] 🎬 Phaser scene PRELOAD - Instance: ${instanceIdRef.current}`);
            preload.call(this, socket);
          },
          create: function(this: Phaser.Scene) {
            console.log(`[${new Date().toISOString()}] 🎬 Phaser scene CREATE - Instance: ${instanceIdRef.current}`);
            create.call(this, socket, gameState);
          },
          update: function(this: Phaser.Scene) {
            update.call(this);
          },
        },
      };

      // Create the Phaser game instance with validation
      try {
        // Final check before creation
        if (isCleanupRef.current) {
          console.log(`[${new Date().toISOString()}] ⏳ Aborting Phaser creation - cleanup started during timeout`);
          return;
        }

        gameRef.current = new Phaser.Game(config);
        console.log(`[${new Date().toISOString()}] ✅ Phaser game instance created successfully - ID: ${instanceIdRef.current}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Failed to create Phaser game instance:`, error);
      }
    }, 10); // Small delay to handle React Strict Mode

    // Cleanup function with comprehensive logging
    return () => {
      console.log(`[${new Date().toISOString()}] 🧹 Starting Phaser cleanup - Instance: ${instanceIdRef.current}`);
      
      // Clear the creation timeout if cleanup happens before creation
      clearTimeout(createTimeout);
      
      // Clean up socket event listeners
      if (socket) {
        console.log(`[${new Date().toISOString()}] 📡 Cleaning up socket listeners - Instance: ${instanceIdRef.current}`);
        socket.off('game:initial-board');
        socket.off('game:board-update');
        socket.off('game:tile-changes');
      }

      // Clean up intervals
      if (sceneReadinessCheckInterval) {
        clearInterval(sceneReadinessCheckInterval);
        sceneReadinessCheckInterval = null;
      }
      if (visualValidationInterval) {
        clearInterval(visualValidationInterval);
        visualValidationInterval = null;
      }
      
      // Clean up Phaser game instance
      if (gameRef.current) {
        try {
          console.log(`[${new Date().toISOString()}] 🎮 Destroying Phaser game instance - Instance: ${instanceIdRef.current}`);
          
          // Check scene state before destruction
          const scenes = gameRef.current.scene.scenes;
          console.log(`[${new Date().toISOString()}] 🎬 Active scenes before destruction: ${scenes.length}`);
          
          gameRef.current.destroy(true);
          gameRef.current = null;
          console.log(`[${new Date().toISOString()}] ✅ Phaser game instance destroyed successfully - Instance: ${instanceIdRef.current}`);
        } catch (error) {
          console.error(`[${new Date().toISOString()}] ❌ Error during Phaser cleanup:`, error);
        }
      } else {
        console.log(`[${new Date().toISOString()}] ⚠️ No Phaser instance to clean up - Instance: ${instanceIdRef.current}`);
      }
    };
  }, [socket]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if socket connection actually changes (not just reference)
  const prevSocketId = prevProps.socket?.id;
  const nextSocketId = nextProps.socket?.id;
  
  return prevSocketId === nextSocketId;
});

// Set display name for debugging
PhaserGame.displayName = 'PhaserGame';

// Game state variables
const boardState: BoardRenderingState = {
  currentBoard: null,
  tileSprites: [],
  tileTexts: []
};

const interactionState: InteractionState = {
  isSelecting: false,
  selectedTiles: [],
  currentWordText: null,
  gameSocket: null
};

const layoutState: LayoutState = {
  titleText: null,
  instructionText: null
};

// 🚀 PHASE 5B: Audio and Particle System State
interface AudioSystem {
  tileSelect?: Phaser.Sound.BaseSound;
  wordValid?: Phaser.Sound.BaseSound;
  wordInvalid?: Phaser.Sound.BaseSound;
  tileCascade?: Phaser.Sound.BaseSound;
  roundComplete?: Phaser.Sound.BaseSound;
  matchVictory?: Phaser.Sound.BaseSound;
  speedBonus?: Phaser.Sound.BaseSound;
  backgroundMusic?: Phaser.Sound.BaseSound;
  volume: number;
  musicVolume: number;
  isEnabled: boolean;
}

interface ParticleSystem {
  wordValidEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  cascadeEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  speedBonusEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  manager?: Phaser.GameObjects.Particles.ParticleEmitterManager;
}

let audioSystem: AudioSystem = {
  volume: 0.7,
  musicVolume: 0.3,
  isEnabled: true
};

let particleSystem: ParticleSystem = {};

let loadingText: Phaser.GameObjects.Text | null = null;

// Enhanced sequence tracking with scene readiness queue
let lastProcessedSequence = 0;
const pendingTileChanges = new Map<number, TileChanges>();
let isProcessingTileChanges = false;
const queuedTileChanges: TileChanges[] = []; // Queue for when scene is not ready
let sceneReadinessCheckInterval: NodeJS.Timeout | null = null;
let visualValidationInterval: NodeJS.Timeout | null = null;

/**
 * Phaser preload function - loads game assets and initializes font loading
 * Core Phaser lifecycle method that handles initial resource preparation:
 * 1. Establishes socket connection reference for game communication
 * 2. Displays loading indicator to provide user feedback during startup
 * 3. Initiates Google Fonts loading for consistent typography across platforms
 * 4. Sets up socket event listeners for board data reception from server
 * 5. Handles font loading success/failure with appropriate fallback strategies
 * Called automatically by Phaser before scene creation begins
 * @param socket - Optional Socket.io connection for server communication and real-time updates
 * @returns void - Configures scene resources and event handlers for subsequent lifecycle phases
 */
function preload(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  interactionState.gameSocket = socket || null;

  // 🚀 PHASE 5B: Load audio assets for premium experience
  console.log(`[${new Date().toISOString()}] 🎵 Loading audio assets...`);
  
  // Sound effects for game events (using placeholder paths - would need actual sound files)
  this.load.audio('tile-select', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('word-valid', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('word-invalid', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('tile-cascade', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('round-complete', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('match-victory', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  this.load.audio('speed-bonus', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  
  // Background music for ambient experience (fix: add missing background-music key)
  this.load.audio('background-music', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhWQA5AAAA');
  
  // Create particle textures for premium effects
  this.load.once('complete', () => {
    // Create golden particle texture
    const goldParticle = this.add.graphics();
    goldParticle.fillStyle(0xFFE265); // Naples Yellow
    goldParticle.fillCircle(8, 8, 8);
    goldParticle.generateTexture('gold-particle', 16, 16);
    goldParticle.destroy();
    
    // Create electric blue particle texture
    const blueParticle = this.add.graphics();
    blueParticle.fillStyle(0x74F5F6); // Electric Blue
    blueParticle.fillCircle(6, 6, 6);
    blueParticle.generateTexture('blue-particle', 12, 12);
    blueParticle.destroy();
    
    // Create simple white particle texture (fallback)
    const whiteParticle = this.add.graphics();
    whiteParticle.fillStyle(0xFFFFFF);
    whiteParticle.fillCircle(4, 4, 4);
    whiteParticle.generateTexture('simple-particle', 8, 8);
    whiteParticle.destroy();
    
    console.log(`[${new Date().toISOString()}] ✨ Premium particle textures created`);
  });
  
  // Start asset loading
  this.load.start();
  
  // Show loading message
  loadingText = this.add.text(400, 300, 'Loading fonts and board...', {
    fontSize: '24px',
    color: '#ffffff',
  }).setOrigin(0.5);

  // Optimized font loading with preload hint and fallback
  const fontPromise = new Promise<void>((resolve) => {
    // Check if fonts are already loaded
    if (document.fonts) {
      document.fonts.ready.then(() => {
        console.log('System fonts ready');
        resolve();
      });
    }
    
    // Load Google Fonts with optimized configuration
    WebFont.load({
      google: {
        families: [`${FONTS.heading}:400,600,700`, `${FONTS.body}:400,600,700`],
        display: 'swap' // Optimize for performance
      },
      timeout: 2000, // Prevent hanging on slow connections
      active: () => {
        console.log('Fonts loaded successfully');
        if (loadingText) {
          loadingText.setText('Ready to play!');
        }
        resolve();
      },
      inactive: () => {
        console.warn('Font loading failed, using fallback fonts');
        if (loadingText) {
          loadingText.setText('Using fallback fonts - Ready to play!');
        }
        resolve();
      }
    });
  });

  // Don't block scene creation on font loading
  fontPromise.catch(() => {
    console.warn('Font loading promise rejected, continuing with fallbacks');
  });

  // Set up socket event listeners if socket is provided
  if (socket) {
    socket.on('game:initial-board', (data: { board: GameBoard }) => {
      boardState.currentBoard = data.board;
      console.log('Received initial board:', data.board);
      
      // Update the board display if the scene is ready (check if scene is running)
      if (this.sys && this.sys.isActive()) {
        updateBoardDisplayWrapper.call(this);
      }
    });

    socket.on('game:board-update', (data: { board: GameBoard }) => {
      boardState.currentBoard = data.board;
      console.log('Received board update (legacy):', data.board);
      
      // Update the board display if the scene is ready (check if scene is running)
      if (this.sys && this.sys.isActive()) {
        updateBoardDisplayWrapper.call(this);
      }
    });

    // Enhanced tile changes handler with scene readiness queue
    socket.on('game:tile-changes', (data: TileChanges) => {
      const receiveTime = Date.now();
      const networkLatency = receiveTime - data.timestamp;
      
      console.log(`[${new Date().toISOString()}] 📨 Received tile changes (seq: ${data.sequenceNumber}, latency: ${networkLatency}ms):`, {
        removed: data.removedPositions.length,
        falling: data.fallingTiles.length,
        new: data.newTiles.length
      });

      // Deduplication check
      if (data.sequenceNumber <= lastProcessedSequence) {
        console.log(`[${new Date().toISOString()}] 🔄 Ignoring duplicate/old tile changes (seq: ${data.sequenceNumber}, last: ${lastProcessedSequence})`);
        return;
      }

      // Check if scene is ready for processing
      if (!isSceneReady(this)) {
        console.warn(`[${new Date().toISOString()}] ⏳ Scene not ready - queuing tile changes (seq: ${data.sequenceNumber})`);
        queuedTileChanges.push(data);
        
        // Start monitoring for scene readiness
        startSceneReadinessMonitoring(this);
        return;
      }

      // Store pending changes for immediate processing
      pendingTileChanges.set(data.sequenceNumber, data);
      
      // Process changes in sequence order
      processQueuedTileChanges.call(this);
    });
  }
}

/**
 * Check if the Phaser scene is ready and active
 * @param scene - Phaser scene to check
 * @returns Boolean indicating if scene is ready for operations
 */
function isSceneReady(scene: Phaser.Scene): boolean {
  try {
    return scene.sys && 
           scene.sys.isActive() && 
           scene.sys.displayList && 
           scene.sys.updateList && 
           !scene.scene.isDestroying &&
           scene.scene.isVisible();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error checking scene readiness:`, error);
    return false;
  }
}

/**
 * 🚨 PHASE 1B: Progressive Recovery State Tracking
 */
enum RecoveryState {
  NONE = 'none',
  TILE_REFRESH = 'tile_refresh',
  BOARD_REFRESH = 'board_refresh',
  SCENE_RESTART = 'scene_restart',
  FULL_RESTART = 'full_restart'
}

interface RecoveryAttempt {
  state: RecoveryState;
  timestamp: number;
  success: boolean;
  error?: string;
}

// Recovery state tracking
let currentRecoveryState = RecoveryState.NONE;
let recoveryHistory: RecoveryAttempt[] = [];
let lastRecoveryTime = 0;
const RECOVERY_COOLDOWN_MS = 5000; // 5 second cooldown between recovery attempts

/**
 * Progressive recovery mechanism with state tracking and cooldown
 * @param scene - Phaser scene to recover
 * @returns Boolean indicating if recovery was successful
 */
function recoverSceneState(scene: Phaser.Scene): boolean {
  const now = Date.now();
  
  // Check recovery cooldown
  if ((now - lastRecoveryTime) < RECOVERY_COOLDOWN_MS) {
    console.log(`[${new Date().toISOString()}] ⏱️ Recovery on cooldown for ${Math.ceil((RECOVERY_COOLDOWN_MS - (now - lastRecoveryTime)) / 1000)}s`);
    return false;
  }
  
  lastRecoveryTime = now;
  console.log(`[${new Date().toISOString()}] 🔄 Starting progressive scene recovery...`);
  
  // Step 1: Try refreshing only affected tiles
  if (attemptTileRefresh(scene)) {
    return true;
  }
  
  // Step 2: Try refreshing entire board if tile refresh failed
  if (attemptBoardRefresh(scene)) {
    return true;
  }
  
  // Step 3: Try full scene restart if board refresh failed
  if (attemptSceneRestart(scene)) {
    return true;
  }
  
  // Step 4: Complete Phaser instance restart (last resort)
  return attemptFullRestart();
}

/**
 * Step 1: Attempt to refresh only affected tiles
 * @param scene - Phaser scene
 * @returns Boolean indicating success
 */
function attemptTileRefresh(scene: Phaser.Scene): boolean {
  const attempt: RecoveryAttempt = {
    state: RecoveryState.TILE_REFRESH,
    timestamp: Date.now(),
    success: false
  };
  
  try {
    currentRecoveryState = RecoveryState.TILE_REFRESH;
    console.log(`[${new Date().toISOString()}] 🔧 Step 1: Attempting tile refresh...`);
    
    // Import the tile correction function dynamically
    import('./board-rendering.js').then(({ correctVisualStateTileByTile, setSceneTransitionBypass }) => {
      setSceneTransitionBypass(true);
      
      try {
        const correctedCount = correctVisualStateTileByTile(
          scene,
          boardState,
          setupTileInteractionWrapper.bind(scene)
        );
        
        if (correctedCount > 0) {
          attempt.success = true;
          recoveryHistory.push(attempt);
          currentRecoveryState = RecoveryState.NONE;
          console.log(`[${new Date().toISOString()}] ✅ Step 1 successful: corrected ${correctedCount} tiles`);
          return true;
        }
      } finally {
        setSceneTransitionBypass(false);
      }
      
      return false;
    });
    
    return false;
  } catch (error) {
    attempt.error = String(error);
    attempt.success = false;
    recoveryHistory.push(attempt);
    console.error(`[${new Date().toISOString()}] ❌ Step 1 failed:`, error);
    return false;
  }
}

/**
 * Step 2: Attempt to refresh entire board
 * @param scene - Phaser scene
 * @returns Boolean indicating success
 */
function attemptBoardRefresh(scene: Phaser.Scene): boolean {
  const attempt: RecoveryAttempt = {
    state: RecoveryState.BOARD_REFRESH,
    timestamp: Date.now(),
    success: false
  };
  
  try {
    currentRecoveryState = RecoveryState.BOARD_REFRESH;
    console.log(`[${new Date().toISOString()}] 🔧 Step 2: Attempting board refresh...`);
    
    // Import the refresh function dynamically
    import('./board-rendering.js').then(({ refreshVisualStateFromLogical, setSceneTransitionBypass }) => {
      setSceneTransitionBypass(true);
      
      try {
        const refreshSuccess = refreshVisualStateFromLogical(
          scene,
          boardState,
          setupTileInteractionWrapper.bind(scene)
        );
        
        if (refreshSuccess) {
          attempt.success = true;
          recoveryHistory.push(attempt);
          currentRecoveryState = RecoveryState.NONE;
          console.log(`[${new Date().toISOString()}] ✅ Step 2 successful: board refresh completed`);
          return true;
        }
      } finally {
        setSceneTransitionBypass(false);
      }
      
      return false;
    });
    
    return false;
  } catch (error) {
    attempt.error = String(error);
    attempt.success = false;
    recoveryHistory.push(attempt);
    console.error(`[${new Date().toISOString()}] ❌ Step 2 failed:`, error);
    return false;
  }
}

/**
 * Step 3: Attempt full scene restart
 * @param scene - Phaser scene
 * @returns Boolean indicating success
 */
function attemptSceneRestart(scene: Phaser.Scene): boolean {
  const attempt: RecoveryAttempt = {
    state: RecoveryState.SCENE_RESTART,
    timestamp: Date.now(),
    success: false
  };
  
  try {
    currentRecoveryState = RecoveryState.SCENE_RESTART;
    console.log(`[${new Date().toISOString()}] 🔧 Step 3: Attempting scene restart...`);
    
    // Import bypass function
    import('./board-rendering.js').then(({ setSceneTransitionBypass }) => {
      setSceneTransitionBypass(true);
      
      try {
        // Clear existing state
        boardState.tileSprites = [];
        boardState.tileTexts = [];
        
        // Recreate layout elements
        createGameLayout(scene, layoutState, interactionState);
        
        // If we have board data, recreate the visual state
        if (boardState.currentBoard) {
          updateBoardDisplayWrapper.call(scene);
        }
        
        attempt.success = true;
        recoveryHistory.push(attempt);
        currentRecoveryState = RecoveryState.NONE;
        console.log(`[${new Date().toISOString()}] ✅ Step 3 successful: scene restart completed`);
        return true;
      } finally {
        setSceneTransitionBypass(false);
      }
    });
    
    return false;
  } catch (error) {
    attempt.error = String(error);
    attempt.success = false;
    recoveryHistory.push(attempt);
    console.error(`[${new Date().toISOString()}] ❌ Step 3 failed:`, error);
    return false;
  }
}

/**
 * Step 4: Complete Phaser instance restart (last resort)
 * @returns Boolean indicating success
 */
function attemptFullRestart(): boolean {
  const attempt: RecoveryAttempt = {
    state: RecoveryState.FULL_RESTART,
    timestamp: Date.now(),
    success: false
  };
  
  try {
    currentRecoveryState = RecoveryState.FULL_RESTART;
    console.log(`[${new Date().toISOString()}] 🚨 Step 4: Attempting full Phaser restart (last resort)...`);
    
    // This is handled by the parent component's useEffect cleanup
    // We'll trigger a forced remount by updating a key
    localStorage.setItem('wordRushPhaserRecovery', Date.now().toString());
    
    attempt.success = true;
    recoveryHistory.push(attempt);
    currentRecoveryState = RecoveryState.NONE;
    console.log(`[${new Date().toISOString()}] ⚠️ Step 4 initiated: full restart triggered`);
    
    return true;
  } catch (error) {
    attempt.error = String(error);
    attempt.success = false;
    recoveryHistory.push(attempt);
    console.error(`[${new Date().toISOString()}] ❌ Step 4 failed:`, error);
    return false;
  }
}

/**
 * Start recovery monitoring system
 * Logs recovery metrics every 30 seconds and alerts if failures > 3
 */
function startRecoveryMonitoring(): void {
  setInterval(() => {
    const metrics = getRecoveryMetrics();
    
    // Log metrics every 30 seconds
    console.log(`[${new Date().toISOString()}] 📊 Recovery Metrics:`, {
      state: metrics.currentState,
      totalAttempts: metrics.totalAttempts,
      successRate: `${metrics.successRate.toFixed(1)}%`,
      recentFailures: metrics.recentFailures,
      historyLength: metrics.history.length
    });
    
    // Alert if recent failures > 3
    if (metrics.recentFailures > 3) {
      console.error(`[${new Date().toISOString()}] 🚨 RECOVERY ALERT: High failure rate detected!`, {
        recentFailures: metrics.recentFailures,
        successRate: `${metrics.successRate.toFixed(1)}%`,
        recommendation: 'Consider page refresh or restart'
      });
      
      // Could add user notification here if needed
      // notifications.error(`Recovery issues detected (${metrics.recentFailures} recent failures)`, 5000);
    }
  }, 30000); // Every 30 seconds
}

/**
 * Get recovery state metrics for monitoring
 * @returns Recovery statistics
 */
function getRecoveryMetrics(): {
  currentState: RecoveryState;
  totalAttempts: number;
  successRate: number;
  recentFailures: number;
  history: RecoveryAttempt[];
} {
  const totalAttempts = recoveryHistory.length;
  const successfulAttempts = recoveryHistory.filter(a => a.success).length;
  const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;
  
  // Count failures in last 5 minutes
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const recentFailures = recoveryHistory.filter(a => 
    !a.success && a.timestamp > fiveMinutesAgo
  ).length;
  
  return {
    currentState: currentRecoveryState,
    totalAttempts,
    successRate,
    recentFailures,
    history: recoveryHistory.slice(-10) // Last 10 attempts
  };
}

/**
 * Phaser create function - initializes the game scene and UI elements with enhanced validation
 * Main scene initialization method called after preload completion:
 * 1. Validates scene readiness and establishes clean scene state
 * 2. Initializes tile sprite and text arrays for board rendering
 * 3. Creates initial game layout with title and instruction text
 * 4. Sets up responsive design handler for window resize events
 * 5. Configures global pointer event system for tile interactions
 * 6. Renders initial board if data available, otherwise requests from server
 * Called automatically by Phaser after preload phase completes successfully
 * @param socket - Optional Socket.io connection for server communication and board requests
 * @returns void - Establishes complete interactive game scene ready for player input
 */
function create(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>, gameState?: 'menu' | 'lobby' | 'match' | 'round-end' | 'match-end') {
  console.log(`[${new Date().toISOString()}] 🎬 Scene CREATE started - optimized initialization...`);
  
  // Force scene readiness for faster startup
  if (!this.sys || !this.sys.isActive()) {
    console.warn(`[${new Date().toISOString()}] ⚡ Scene not fully active, continuing with initialization...`);
  }
  
  interactionState.gameSocket = socket || null;
  
  // Clear the loading message
  if (loadingText) {
    loadingText.destroy();
    loadingText = null;
  }

  // 🚀 PHASE 5B: Initialize Audio and Particle Systems
  initializeAudioSystem(this);
  initializeParticleSystem(this);

  // Initialize tile arrays
  boardState.tileSprites = [];
  boardState.tileTexts = [];

  // Create initial layout
  createGameLayout(this, layoutState, interactionState);

  // Initialize resize handler
  initializeResizeHandler(this, layoutState, interactionState, boardState, updateBoardDisplayWrapper.bind(this));

  // Initialize global pointer events
  initializeGlobalPointerEvents(this, boardState, interactionState, () => gameState || 'menu');

  // Render the board if we already have data
  if (boardState.currentBoard) {
    updateBoardDisplayWrapper.call(this);
  } else {
    // Request a board from the server if we don't have one
    if (socket) {
      socket.emit('game:request-board');
    }
  }
  
  // Start optimized visual validation monitoring
  startPeriodicVisualValidation(this, boardState, setupTileInteractionWrapper.bind(this));
  
  // Start recovery monitoring as per checklist
  startRecoveryMonitoring();
  
  // Process any queued tile changes immediately
  if (queuedTileChanges.length > 0) {
    console.log(`[${new Date().toISOString()}] 🔄 Processing ${queuedTileChanges.length} queued tile changes`);
    const changes = queuedTileChanges.shift();
    if (changes) {
      processQueuedTileChanges.call(this);
    }
  }
  
  console.log(`[${new Date().toISOString()}] ✅ Scene CREATE completed successfully`);
}

/**
 * Enhanced wrapper function for updateBoardDisplay with visual state validation
 */
function updateBoardDisplayWrapper(this: Phaser.Scene) {
  console.log(`[${new Date().toISOString()}] 🎯 Updating board display with validation...`);
  
  // Validate scene readiness before update
  if (!isSceneReady(this)) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Scene not ready for board update - attempting recovery`);
    if (!recoverSceneState(this)) {
      console.error(`[${new Date().toISOString()}] ❌ Scene recovery failed - board update cancelled`);
      return;
    }
  }

  try {
    // Update board display
    updateBoardDisplayModule(this, boardState, setupTileInteractionWrapper.bind(this));

    // Validate visual state after update with delay to allow render completion
    setTimeout(() => {
      const validation = validateVisualState(boardState);
      if (!validation.isValid) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Visual state validation failed after board update: ${validation.summary}`);
        console.log(`[${new Date().toISOString()}] 🔍 Attempting automatic correction...`);
        
        const correctedCount = correctVisualStateTileByTile(
          this,
          boardState,
          setupTileInteractionWrapper.bind(this)
        );
        
        if (correctedCount === 0) {
          console.warn(`[${new Date().toISOString()}] ⚠️ Auto-correction failed, scheduling full refresh...`);
          setTimeout(() => {
            refreshVisualStateFromLogical(
              this,
              boardState,
              setupTileInteractionWrapper.bind(this)
            );
          }, 100);
        }
      } else {
        console.log(`[${new Date().toISOString()}] ✅ Visual state validation passed`);
      }
    }, 50); // Small delay to allow render completion

    // Start periodic validation if not already started
    if (!visualValidationInterval) {
      console.log(`[${new Date().toISOString()}] 🔄 Starting periodic visual validation...`);
      visualValidationInterval = startPeriodicVisualValidation(
        this,
        boardState,
        setupTileInteractionWrapper.bind(this)
      );
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Board display update failed:`, error);
    
    // Emergency visual state recovery
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] 🚨 Emergency visual state recovery...`);
      refreshVisualStateFromLogical(
        this,
        boardState,
        setupTileInteractionWrapper.bind(this)
      );
    }, 100);
  }
}

/**
 * Wrapper function for setupTileInteraction to bind context
 */
function setupTileInteractionWrapper(
  this: Phaser.Scene,
  tile: Phaser.GameObjects.Rectangle,
  row: number,
  col: number,
  tileData: LetterTile
) {
  setupTileInteraction(tile, row, col, tileData, boardState, interactionState);
}

/**
 * Phaser update function - called every frame
 * Main game loop function called at 60fps for continuous gameplay updates:
 * 1. Processes any frame-by-frame logic updates
 * 2. Handles real-time visual effects and animations
 * 3. Updates interactive elements and input state
 * Currently minimal since most game logic is event-driven
 * @returns void - Performs per-frame updates to maintain smooth gameplay
 */
function update(this: Phaser.Scene) {
  // Currently no per-frame updates needed
  // Most game logic is event-driven through socket communications
}

/**
 * Process queued tile changes when scene becomes ready
 */
function processQueuedTileChangesWhenReady(scene: Phaser.Scene) {
  if (queuedTileChanges.length === 0 || !isSceneReady(scene)) {
    return;
  }
  
  console.log(`[${new Date().toISOString()}] 🔄 Processing ${queuedTileChanges.length} queued tile changes...`);
  
  // Process all queued changes
  while (queuedTileChanges.length > 0) {
    const tileChanges = queuedTileChanges.shift()!;
    pendingTileChanges.set(tileChanges.sequenceNumber, tileChanges);
  }
  
  // Now process normally
  processQueuedTileChanges.call(scene);
}

/**
 * Start scene readiness monitoring
 */
function startSceneReadinessMonitoring(scene: Phaser.Scene) {
  if (sceneReadinessCheckInterval) {
    clearInterval(sceneReadinessCheckInterval);
  }
  
  sceneReadinessCheckInterval = setInterval(() => {
    if (isSceneReady(scene) && queuedTileChanges.length > 0) {
      console.log(`[${new Date().toISOString()}] ✅ Scene ready - processing queued tile changes`);
      processQueuedTileChangesWhenReady(scene);
      
      // Clear interval if queue is empty and scene is ready
      if (queuedTileChanges.length === 0) {
        clearInterval(sceneReadinessCheckInterval!);
        sceneReadinessCheckInterval = null;
      }
    }
  }, 100); // Check every 100ms
}

/**
 * Processes all pending tile changes in sequence order with scene readiness validation.
 * This function is called when new tile changes are received.
 * It ensures that changes are applied in the correct order and handles scene state validation.
 */
function processQueuedTileChanges(this: Phaser.Scene) {
  // Check scene readiness first
  if (!isSceneReady(this)) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Scene not ready for tile changes - checking for recovery`);
    
    // Attempt scene recovery
    if (recoverSceneState(this)) {
      console.log(`[${new Date().toISOString()}] ✅ Scene recovered - retrying tile changes`);
      // Retry after brief delay
      setTimeout(() => processQueuedTileChanges.call(this), 50);
    } else {
      console.error(`[${new Date().toISOString()}] ❌ Scene recovery failed - tile changes will be dropped`);
    }
    return;
  }

  if (isProcessingTileChanges) {
    console.log(`[${new Date().toISOString()}] ⏳ Skipping tile changes processing due to ongoing process.`);
    return;
  }

  isProcessingTileChanges = true;
  const currentSequence = lastProcessedSequence + 1;
  const pending = pendingTileChanges.get(currentSequence);

  if (!pending) {
    console.warn(`[${new Date().toISOString()}] ⚠️ No pending tile changes for sequence number: ${currentSequence}`);
    isProcessingTileChanges = false;
    return;
  }

  console.log(`[${new Date().toISOString()}] 🎯 Processing tile changes (seq: ${currentSequence})...`);

  // Apply changes to local board state to keep it in sync BEFORE animations
  if (boardState.currentBoard) {
    // Apply removals
    for (const { x, y } of pending.removedPositions) {
      if (y >= 0 && y < boardState.currentBoard.height && x >= 0 && x < boardState.currentBoard.width) {
        (boardState.currentBoard.tiles[y][x] as any) = null;
      }
    }

    // Apply falling tile movements
    for (const movement of pending.fallingTiles) {
      const { from, to } = movement;
      const tile = boardState.currentBoard.tiles[from.y][from.x];
      
      if (tile) {
        // Update tile position
        tile.x = to.x;
        tile.y = to.y;
        tile.id = `tile-${to.y}-${to.x}`;
        
        // Move tile to new position
        boardState.currentBoard.tiles[to.y][to.x] = tile;
        (boardState.currentBoard.tiles[from.y][from.x] as any) = null;
      }
    }

    // Add new tiles
    for (const newTileData of pending.newTiles) {
      const { position, letter, points, id } = newTileData;
      boardState.currentBoard.tiles[position.y][position.x] = {
        letter,
        points,
        x: position.x,
        y: position.y,
        id
      };
    }
  }

  // Process animations if the scene is ready
  if (this.sys && this.sys.isActive()) {
    try {
      // Add 5s timeout to prevent stuck processing as per checklist
      const timeout = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Processing timeout after 5 seconds')), 5000)
      );
      
      const processingPromise = processTileChanges(this, boardState, pending, setupTileInteractionWrapper.bind(this));
      
      Promise.race([timeout, processingPromise])
        .then(() => {
          console.log(`Tile changes (seq: ${currentSequence}) processed successfully.`);
          lastProcessedSequence = currentSequence;
          pendingTileChanges.delete(currentSequence);
        })
        .catch((error) => {
          console.error(`Error processing tile changes (seq: ${currentSequence}):`, error);
          // Clear queue on error to prevent blocking as per checklist
          pendingTileChanges.clear();
          lastProcessedSequence = currentSequence;
        })
        .finally(() => {
          isProcessingTileChanges = false;
          // If there are still pending changes, process the next one
          if (pendingTileChanges.has(lastProcessedSequence + 1)) {
            processQueuedTileChanges.call(this);
          }
        });
    } catch (error) {
      console.error(`Failed to start processing tile changes (seq: ${currentSequence}):`, error);
      // Clear queue and reset state on critical failure
      pendingTileChanges.clear();
      isProcessingTileChanges = false;
      lastProcessedSequence = currentSequence;
    }
  } else {
    // If scene not ready, just mark as processed
    console.warn('Scene not ready, skipping animations but updating state');
    lastProcessedSequence = currentSequence;
    pendingTileChanges.delete(currentSequence);
    isProcessingTileChanges = false;
  }
}

/**
 * 🚀 PHASE 5B: Audio System Initialization and Management
 * Initialize premium audio system with volume controls and background music
 * @param scene - Phaser scene for audio context
 */
function initializeAudioSystem(scene: Phaser.Scene): void {
  console.log(`[${new Date().toISOString()}] 🎵 Initializing audio system...`);
  
  try {
    // Initialize sound effects with volume control
    audioSystem.tileSelect = scene.sound.add('tile-select', { volume: audioSystem.volume * 0.6 });
    audioSystem.wordValid = scene.sound.add('word-valid', { volume: audioSystem.volume * 0.8 });
    audioSystem.wordInvalid = scene.sound.add('word-invalid', { volume: audioSystem.volume * 0.7 });
    audioSystem.tileCascade = scene.sound.add('tile-cascade', { volume: audioSystem.volume * 0.5 });
    audioSystem.roundComplete = scene.sound.add('round-complete', { volume: audioSystem.volume });
    audioSystem.matchVictory = scene.sound.add('match-victory', { volume: audioSystem.volume });
    audioSystem.speedBonus = scene.sound.add('speed-bonus', { volume: audioSystem.volume * 0.9 });

    // Initialize background music with lower volume and looping
    audioSystem.backgroundMusic = scene.sound.add('background-music', {
      volume: audioSystem.musicVolume,
      loop: true
    });

    // Start background music if audio is enabled
    if (audioSystem.isEnabled && audioSystem.backgroundMusic) {
      audioSystem.backgroundMusic.play();
    }

    console.log(`[${new Date().toISOString()}] ✅ Audio system initialized successfully`);
  } catch (error) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Audio system initialization failed:`, error);
    audioSystem.isEnabled = false;
  }
}

/**
 * 🚀 PHASE 5B: Particle System Initialization
 * Initialize premium particle effects for game events
 * @param scene - Phaser scene for particle context
 */
function initializeParticleSystem(scene: Phaser.Scene): void {
  console.log(`[${new Date().toISOString()}] ✨ Initializing particle system...`);
  
  try {
    // Create particle emitter manager (updated to new API)
    particleSystem.manager = scene.add.particles(0, 0, 'simple-particle');

    // Word validation success particles (golden burst)
    particleSystem.wordValidEmitter = particleSystem.manager.addEmitter({
      texture: 'gold-particle',
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 8,
      blendMode: 'ADD',
      on: false
    });

    // Tile cascade particles (electric blue)
    particleSystem.cascadeEmitter = particleSystem.manager.addEmitter({
      texture: 'blue-particle',
      speed: { min: 30, max: 100 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 600,
      quantity: 5,
      blendMode: 'ADD',
      on: false
    });

    // Speed bonus particles (rainbow burst)
    particleSystem.speedBonusEmitter = particleSystem.manager.createEmitter({
      texture: 'simple-particle',
      speed: { min: 80, max: 200 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: 12,
      blendMode: 'ADD',
      tint: [0xFFE265, 0x74F5F6, 0xFF6B6B, 0x4ECDC4],
      on: false
    });

    console.log(`[${new Date().toISOString()}] ✅ Particle system initialized successfully`);
  } catch (error) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Particle system initialization failed:`, error);
  }
}

/**
 * 🚀 PHASE 5B: Play sound effect with performance optimization
 * @param soundName - Name of the sound to play
 * @param scene - Optional scene for context
 */
function playSound(soundName: keyof AudioSystem, scene?: Phaser.Scene): void {
  if (!audioSystem.isEnabled) return;
  
  try {
    const sound = audioSystem[soundName];
    if (sound && typeof sound.play === 'function') {
      sound.play();
    }
  } catch (error) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Failed to play sound '${soundName}':`, error);
  }
}

/**
 * 🚀 PHASE 5B: Trigger particle effect at position
 * @param effectName - Name of the particle effect
 * @param x - X position for effect
 * @param y - Y position for effect
 * @param intensity - Effect intensity (1-3)
 */
function triggerParticleEffect(
  effectName: 'wordValid' | 'cascade' | 'speedBonus',
  x: number,
  y: number,
  intensity: number = 1
): void {
  const emitter = particleSystem[`${effectName}Emitter`];
  if (!emitter) return;
  
  try {
    // Adjust particle count based on intensity
    const baseQuantity = effectName === 'wordValid' ? 8 : effectName === 'cascade' ? 5 : 12;
    emitter.setQuantity(baseQuantity * intensity);
    
    // Position and burst
    emitter.setPosition(x, y);
    emitter.explode();
    
    console.log(`[${new Date().toISOString()}] ✨ Triggered ${effectName} particles at (${x}, ${y})`);
  } catch (error) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Failed to trigger particle effect '${effectName}':`, error);
  }
}

/**
 * 🚀 PHASE 5B: Volume control functions
 */
export const AudioControls = {
  setVolume: (volume: number) => {
    audioSystem.volume = Math.max(0, Math.min(1, volume));
    // Update all sound volumes
    Object.keys(audioSystem).forEach(key => {
      const sound = audioSystem[key as keyof AudioSystem];
      if (sound && typeof sound.setVolume === 'function' && key !== 'backgroundMusic') {
        sound.setVolume(audioSystem.volume);
      }
    });
  },
  
  setMusicVolume: (volume: number) => {
    audioSystem.musicVolume = Math.max(0, Math.min(1, volume));
    if (audioSystem.backgroundMusic && typeof audioSystem.backgroundMusic.setVolume === 'function') {
      audioSystem.backgroundMusic.setVolume(audioSystem.musicVolume);
    }
  },
  
  toggleAudio: () => {
    audioSystem.isEnabled = !audioSystem.isEnabled;
    if (audioSystem.backgroundMusic) {
      if (audioSystem.isEnabled) {
        audioSystem.backgroundMusic.resume();
      } else {
        audioSystem.backgroundMusic.pause();
      }
    }
  },
  
  playSound,
  triggerParticleEffect
};

export default PhaserGame; 

