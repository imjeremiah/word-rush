/**
 * Word Rush Client - Phaser Game Component
 * React component that integrates Phaser 3 game engine for the core gameplay
 */

import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import WebFont from 'webfontloader';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  GameBoard,
  LetterTile,
  FONTS,
  TileChanges,
  DifficultyLevel 
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
  initializeResizeHandler,
  repositionWordBuilderText
} from './layout.js';
import { notifications } from '../services/notifications.js';

interface PhaserGameProps {
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  gameState?: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end';
}

// Memoized component to prevent unnecessary re-renders
const PhaserGame: React.FC<PhaserGameProps> = React.memo(({ socket, gameState }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceIdRef = useRef<string>(`phaser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const isCleanupRef = useRef<boolean>(false); // Track cleanup state for Strict Mode
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]); // Track particle effect timeouts for cleanup

  // 🕰️ PHASE 28: Access game context for difficulty-based validation
  const { currentRoom, playerSession } = useGameContext();

  /**
   * Get current player's difficulty setting for word validation
   * @returns Current player's difficulty level or 'medium' as default
   */
  const getCurrentDifficulty = (): DifficultyLevel => {
    if (!currentRoom || !playerSession) {
      return 'medium'; // Default fallback
    }
    
    const currentPlayer = currentRoom.players.find(p => p.id === playerSession.id);
    return currentPlayer?.difficulty || 'medium';
  };

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
            create.call(this, socket, gameState, getCurrentDifficulty);
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
        // Note: game:tile-changes is now handled via custom event, not direct socket
      }
      
      // Clean up custom event listeners
      if ((gameRef.current as any)?.scene?.scenes?.[0]?.tileChangesHandler) {
        window.removeEventListener('phaser-tile-changes', (gameRef.current as any).scene.scenes[0].tileChangesHandler);
        console.log(`[${new Date().toISOString()}] 📡 Cleaned up custom tile changes event listener`);
      }
      
      // Clean up board update listener
      if ((gameRef.current as any)?.scene?.scenes?.[0]?.boardUpdateHandler) {
        window.removeEventListener('phaser-board-update', (gameRef.current as any).scene.scenes[0].boardUpdateHandler);
        console.log(`[${new Date().toISOString()}] 📡 Cleaned up board update event listener`);
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
      
      // Clear all pending particle effect timeouts
      console.log(`[${new Date().toISOString()}] 🧹 Clearing ${timeoutsRef.current.length} component-level timeouts`);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      
      // Clear global particle effect timeouts
      console.log(`[${new Date().toISOString()}] 🧹 Clearing ${globalTimeoutTracker.length} global particle effect timeouts`);
      clearAllTrackedTimeouts();
      
      // Clear module-level timeouts from board-rendering
      import('./board-rendering.js').then(({ clearModuleTimeouts }) => {
        clearModuleTimeouts();
      }).catch((error) => {
        console.warn('Failed to clear module timeouts:', error);
      });
      
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

// Export timeout tracking function for particle effects
export { trackTimeout };

// Game state variables
const boardState: BoardRenderingState = {
  currentBoard: null,
  pendingBoard: null,
  tileSprites: [],
  tileTexts: [],
  pointTexts: [],
  shadowSprites: []
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
// Global audio disable flag to prevent buzzing sounds until proper audio system is implemented
const AUDIO_ENABLED = false; // Disable audio globally to eliminate buzzing issues

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
  isInitialized: boolean;
}

interface ParticleSystem {
  emitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>;
  isInitialized: boolean;
}

let audioSystem: AudioSystem = {
  volume: 0.7,
  musicVolume: 0.3,
  isEnabled: true,
  isInitialized: false
};

let particleSystem: ParticleSystem = {
  emitters: new Map(),
  isInitialized: false
};

let loadingText: Phaser.GameObjects.Text | null = null;

// Enhanced sequence tracking with scene readiness queue
let lastProcessedSequence = 0;
const pendingTileChanges = new Map<number, TileChanges>();
let isProcessingTileChanges = false;
const queuedTileChanges: TileChanges[] = []; // Queue for when scene is not ready
let sceneReadinessCheckInterval: NodeJS.Timeout | null = null;
let visualValidationInterval: NodeJS.Timeout | null = null;

// Retry tracking for timeout handling
let retryingSequence: number | null = null;

// Global timeout tracking for particle effects
let globalTimeoutTracker: NodeJS.Timeout[] = [];

/**
 * Track a timeout for cleanup on unmount
 * @param timeoutId - The timeout ID to track
 */
function trackTimeout(timeoutId: NodeJS.Timeout): void {
  globalTimeoutTracker.push(timeoutId);
}

/**
 * Clear all tracked timeouts
 */
function clearAllTrackedTimeouts(): void {
  globalTimeoutTracker.forEach(clearTimeout);
  globalTimeoutTracker = [];
}

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

  // Enhanced font loading with preload hints and faster initialization
  const fontPromise = new Promise<void>((resolve) => {
    console.log(`[${new Date().toISOString()}] 🔤 Starting optimized font loading...`);
    
    // Add preload hint using document.fonts.load() for immediate loading
    if (document.fonts && document.fonts.load) {
      // Preload critical font weights used in the game
      Promise.all([
        document.fonts.load('400 16px Inter'),
        document.fonts.load('500 16px Inter'),
        document.fonts.load('600 16px Inter'),
        document.fonts.load('700 16px Inter')
      ]).then(() => {
        console.log(`[${new Date().toISOString()}] ✅ Font preload hints processed successfully`);
      }).catch((error) => {
        console.warn(`[${new Date().toISOString()}] ⚠️ Font preload hints failed:`, error);
      });
    }
    
    // Check if fonts are already loaded (from HTML preload)
    if (document.fonts) {
      document.fonts.ready.then(() => {
        console.log(`[${new Date().toISOString()}] ✅ System fonts ready from preload`);
        if (loadingText) {
          loadingText.setText('Fonts ready!');
        }
        resolve();
      }).catch(() => {
        console.warn(`[${new Date().toISOString()}] ⚠️ System fonts ready check failed, continuing...`);
        resolve();
      });
    } else {
      // Fallback for browsers without document.fonts support
      console.warn(`[${new Date().toISOString()}] ⚠️ document.fonts not supported, using WebFont fallback`);
      
      // Load Google Fonts with optimized configuration as fallback
      WebFont.load({
        google: {
          families: ['Inter:300,400,500,600,700']
        },
        timeout: 1500, // Reduced timeout since fonts should be preloaded
        active: () => {
          console.log(`[${new Date().toISOString()}] ✅ WebFont fallback loaded successfully`);
          if (loadingText) {
            loadingText.setText('Ready to play!');
          }
          resolve();
        },
        inactive: () => {
          console.warn(`[${new Date().toISOString()}] ⚠️ WebFont fallback failed, using system fonts`);
          if (loadingText) {
            loadingText.setText('Using system fonts - Ready to play!');
          }
          resolve();
        }
      });
    }
  });

  // Don't block scene creation on font loading - faster startup
  fontPromise.catch(() => {
    console.warn(`[${new Date().toISOString()}] ⚠️ Font loading promise rejected, continuing with system fonts`);
  });

  // Set up socket event listeners if socket is provided
  if (socket) {
    // 🔍 DEBUG: Enhanced logging for synchronization debugging
    const DEBUG_SYNC = true;
    
    socket.on('game:initial-board', (data: { board: GameBoard; boardChecksum?: string }) => {
      const receiveTime = Date.now();
      
      if (DEBUG_SYNC) {
        console.log(`[${new Date().toISOString()}] 📨 SYNC_DEBUG: Received initial board at ${receiveTime}`);
      }
      
      // 🔧 TASK 2: Validate board if checksum is provided
      if (data.boardChecksum) {
        // Import validation service dynamically
        import('../services/checksumValidation.js').then(({ validateAndResyncBoard }) => {
          const isValidBoard = validateAndResyncBoard(
            data.board,
            data.boardChecksum!,
            'game:initial-board',
            socket,
            true // Enable resync on mismatch
          );
          
          if (!isValidBoard) {
            console.warn(`[${new Date().toISOString()}] ⚠️ Initial board validation failed - skipping board update`);
            return;
          }
          
          // Process valid board
          boardState.currentBoard = data.board;
          console.log('Received and validated initial board:', data.board);
          
          // Update the board display if the scene is ready
          if (this.sys && this.sys.isActive()) {
            updateBoardDisplayWrapper.call(this);
            // Reposition word builder text above the board
            repositionWordBuilderText(this, interactionState, boardState);
          }
        }).catch(error => {
          console.error('Error loading validation service:', error);
          // Fallback: use board without validation
          boardState.currentBoard = data.board;
          console.log('Received initial board (validation failed):', data.board);
          
          if (this.sys && this.sys.isActive()) {
            updateBoardDisplayWrapper.call(this);
            // Reposition word builder text above the board
            repositionWordBuilderText(this, interactionState, boardState);
          }
        });
      } else {
        // No checksum provided - use board without validation
        boardState.currentBoard = data.board;
        console.log('Received initial board (no checksum):', data.board);
        
        if (this.sys && this.sys.isActive()) {
          updateBoardDisplayWrapper.call(this);
          // Reposition word builder text above the board
          repositionWordBuilderText(this, interactionState, boardState);
        }
      }
    });

    socket.on('game:board-update', (data: { board: GameBoard; boardChecksum?: string }) => {
      const receiveTime = Date.now();
      
      if (DEBUG_SYNC) {
        console.log(`[${new Date().toISOString()}] 📨 SYNC_DEBUG: Received board update at ${receiveTime}`);
      }
      
      // 🔧 TASK 2: Validate board if checksum is provided
      if (data.boardChecksum) {
        // Import validation service dynamically
        import('../services/checksumValidation.js').then(({ validateAndResyncBoard }) => {
          const isValidBoard = validateAndResyncBoard(
            data.board,
            data.boardChecksum!,
            'game:board-update',
            socket,
            true // Enable resync on mismatch
          );
          
          if (!isValidBoard) {
            console.warn(`[${new Date().toISOString()}] ⚠️ Board update validation failed - skipping board update`);
            return;
          }
          
          // Process valid board
          boardState.currentBoard = data.board;
          console.log('Received and validated board update:', data.board);
          
          // Update the board display if the scene is ready
          if (this.sys && this.sys.isActive()) {
            updateBoardDisplayWrapper.call(this);
            // Reposition word builder text above the board
            repositionWordBuilderText(this, interactionState, boardState);
          }
        }).catch(error => {
          console.error('Error loading validation service:', error);
          // Fallback: use board without validation
          boardState.currentBoard = data.board;
          console.log('Received board update (validation failed):', data.board);
          
          if (this.sys && this.sys.isActive()) {
            updateBoardDisplayWrapper.call(this);
            // Reposition word builder text above the board
            repositionWordBuilderText(this, interactionState, boardState);
          }
        });
      } else {
        // No checksum provided - use board without validation (legacy)
        boardState.currentBoard = data.board;
        console.log('Received board update (legacy - no checksum):', data.board);
        
        if (this.sys && this.sys.isActive()) {
          updateBoardDisplayWrapper.call(this);
          // Reposition word builder text above the board
          repositionWordBuilderText(this, interactionState, boardState);
        }
      }
    });

    // Enhanced tile changes handler with scene readiness queue
    // Listen for the custom event dispatched by GameConnection.tsx instead of direct socket
    const handleTileChanges = (event: CustomEvent) => {
      const data = event.detail as TileChanges;
      const receiveTime = Date.now();
      const networkLatency = receiveTime - data.timestamp;
      
      console.log(`[${new Date().toISOString()}] 📨 PhaserGame received tile changes from GameConnection (seq: ${data.sequenceNumber}, latency: ${networkLatency}ms):`, {
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
    };

    // Add custom event listener for tile changes
    window.addEventListener('phaser-tile-changes', handleTileChanges as EventListener);
    
    // Store reference for cleanup
    (this as any).tileChangesHandler = handleTileChanges;

    // 🔧 CRITICAL FIX: Add listener for board updates between rounds
    const handleBoardUpdate = (event: CustomEvent) => {
      const { board, boardChecksum, round } = event.detail;
      console.log(`[${new Date().toISOString()}] 🔄 Received board update for round ${round} (checksum: ${boardChecksum})`);
      
      // Update the board state
      boardState.currentBoard = board;
      
      // Check if scene is ready
      if (this.sys && this.sys.isActive()) {
        console.log(`[${new Date().toISOString()}] 🎮 Updating board display for round ${round}`);
        updateBoardDisplayWrapper.call(this);
        
        // Ensure word builder text is positioned correctly
        repositionWordBuilderText(this, interactionState, boardState);
      } else {
        console.warn(`[${new Date().toISOString()}] ⚠️ Scene not ready for board update - will retry`);
        // Store for later when scene is ready
        (window as any).pendingRoundBoard = board;
      }
    };
    
    window.addEventListener('phaser-board-update', handleBoardUpdate as EventListener);
    (this as any).boardUpdateHandler = handleBoardUpdate;

    // 🔧 TASK 1: Check for preloaded board from GameConnection
    const checkForPendingBoard = () => {
      const pendingBoard = (window as any).pendingGameBoard;
      const pendingChecksum = (window as any).pendingBoardChecksum;
      
      if (pendingBoard && pendingChecksum) {
        if (DEBUG_SYNC) {
          const boardString = JSON.stringify({
            width: pendingBoard.width,
            height: pendingBoard.height,
            tiles: pendingBoard.tiles.map((row: any) => 
              row.map((tile: any) => ({ letter: tile.letter, points: tile.points, x: tile.x, y: tile.y }))
            )
          });
          const clientChecksum = btoa(boardString).slice(0, 16);
          console.log(`[${new Date().toISOString()}] 📨 SYNC_DEBUG: Found preloaded board with checksum=${clientChecksum}, server_checksum=${pendingChecksum}`);
        }
        
        // Store pending board but don't render yet
        boardState.pendingBoard = pendingBoard;
        console.log(`[${new Date().toISOString()}] 🎲 Pending board loaded from global state with checksum validation.`);
      } else {
        console.log(`[${new Date().toISOString()}] ⚠️ No preloaded board found - will wait for match:started event`);
      }
    };
    
    // Check immediately and set up interval to check periodically during countdown
    checkForPendingBoard();
    const pendingBoardInterval = setInterval(checkForPendingBoard, 100);
    
    // Clean up interval when game state changes
    const stopPendingBoardCheck = () => {
      clearInterval(pendingBoardInterval);
    };
    setTimeout(stopPendingBoardCheck, 5000); // Stop checking after 5 seconds

    // 🔧 TASK 2: Reveal Board on Server 'match:go'
    socket.on('match:go', () => {
      const goReceiveTime = Date.now();
      
      if (DEBUG_SYNC) {
        console.log(`[${new Date().toISOString()}] 🚀 SYNC_DEBUG: Received 'match:go' at ${goReceiveTime} - revealing preloaded board`);
      }
      
      // Copy pending board to current board and render
      if (boardState.pendingBoard) {
        boardState.currentBoard = boardState.pendingBoard;
        
        console.log(`[${new Date().toISOString()}] 🎮 Rendering preloaded board on server GO signal`);
        
        // Update the board display if the scene is ready
        if (this.sys && this.sys.isActive()) {
          updateBoardDisplayWrapper.call(this);
        }
        
        // Clear pending board to prevent memory leaks
        boardState.pendingBoard = null;
        
        // Clear global state
        (window as any).pendingGameBoard = null;
        (window as any).pendingBoardChecksum = null;
      } else {
        console.warn(`[${new Date().toISOString()}] ⚠️ 'match:go' received but no pendingBoard available - checking for match:started board`);
        
        // 🔧 FALLBACK: Check for board from match:started event  
        const currentBoard = (window as any).currentGameBoard;
        const currentChecksum = (window as any).currentBoardChecksum;
        
        if (currentBoard && currentChecksum) {
          console.log(`[${new Date().toISOString()}] 🎮 Using board from match:started event (checksum: ${currentChecksum})`);
          boardState.currentBoard = currentBoard;
          
          // Update the board display if the scene is ready
          if (this.sys && this.sys.isActive()) {
            updateBoardDisplayWrapper.call(this);
          }
          
          // Clear global state
          (window as any).currentGameBoard = null;
          (window as any).currentBoardChecksum = null;
        } else {
          // 🚨 EDGE CASE 1: No Board Received by "GO" - Client timeout and resync request
          console.error(`[${new Date().toISOString()}] ❌ CRITICAL: No board data available from either pendingBoard or match:started!`);
          
          // Request emergency board resync with exponential backoff
          handleNoBoardEmergency.call(this, socket);
        }
      }
    });
  }
}

/**
 * 🚨 EDGE CASE 1: Emergency handler for when no board is available during match:go
 * Implements timeout detection, automatic resync requests, and user notifications
 * @param socket - Socket connection for requesting resync
 */
function handleNoBoardEmergency(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>) {
  let retryCount = 0;
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second base delay
  
  console.log(`[${new Date().toISOString()}] 🚨 Starting emergency board recovery protocol...`);
  
  // Notify user immediately
  import('../services/notifications.js').then(({ notifications }) => {
    notifications.warning('Board sync issue detected - attempting recovery...', 4000);
  });
  
  const attemptBoardRecovery = async (): Promise<void> => {
    if (retryCount >= maxRetries) {
      console.error(`[${new Date().toISOString()}] ❌ Board recovery failed after ${maxRetries} attempts`);
      
      // Final fallback - show error and return to lobby
      import('../services/notifications.js').then(({ notifications }) => {
        notifications.error('Unable to sync game board. Returning to lobby...', 5000);
      });
      
      // Request return to lobby via global state
      setTimeout(() => {
        (window as any).emergencyReturnToLobby?.();
      }, 2000);
      
      return;
    }
    
    retryCount++;
    const delay = baseDelay * Math.pow(2, retryCount - 1); // Exponential backoff
    
    console.log(`[${new Date().toISOString()}] 🔄 Board recovery attempt ${retryCount}/${maxRetries} (delay: ${delay}ms)`);
    
    // Request board resync from server using existing event
    if (socket) {
      socket.emit('game:request-board'); // Use existing event instead of new one
      
      // Set up timeout for this attempt
      const attemptTimeout = setTimeout(() => {
        console.warn(`[${new Date().toISOString()}] ⏰ Board recovery attempt ${retryCount} timed out`);
        attemptBoardRecovery(); // Try again
      }, delay + 3000); // Wait for response + retry delay
      
      // Listen for successful board reception (one-time listener)
      const onBoardReceived = () => {
        clearTimeout(attemptTimeout);
        console.log(`[${new Date().toISOString()}] ✅ Board recovery successful on attempt ${retryCount}`);
        
        import('../services/notifications.js').then(({ notifications }) => {
          notifications.success('Board sync recovered successfully!', 3000);
        });
        
        // Clean up
        socket.off('game:initial-board', onBoardReceived);
        socket.off('board:resync', onBoardReceived);
      };
      
      socket.once('game:initial-board', onBoardReceived);
      socket.once('board:resync', onBoardReceived);
      
    } else {
      console.error(`[${new Date().toISOString()}] ❌ No socket available for board recovery`);
      
      // Retry after delay without socket
      setTimeout(() => {
        attemptBoardRecovery();
      }, delay);
    }
  };
  
  // Start recovery with initial delay
  setTimeout(attemptBoardRecovery, 500);
}

/**
 * Check if the Phaser scene is ready and active
 * @param scene - Phaser scene to check
 * @returns Boolean indicating if scene is ready for operations
 */
function isSceneReady(scene: Phaser.Scene): boolean {
  try {
    // Enhanced readiness checks including pause state
    return scene.sys && 
           scene.sys.isActive() && 
           scene.sys.displayList && 
           scene.sys.updateList && 
           !scene.scene.isDestroying &&
           scene.scene.isVisible() &&
           !scene.scene.isPaused() &&
           scene.sys.game && // Ensure game object exists
           !scene.sys.game.isPaused; // Ensure game isn't globally paused
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
const RECOVERY_COOLDOWN_MS = 10000; // 10 second cooldown between recovery attempts (reduced frequency)

/**
 * Progressive recovery mechanism with state tracking and cooldown
 * @param scene - Phaser scene to recover
 * @returns Boolean indicating if recovery was successful
 */
async function recoverSceneState(scene: Phaser.Scene): Promise<boolean> {
  const now = Date.now();
  
  // Check recovery cooldown
  if ((now - lastRecoveryTime) < RECOVERY_COOLDOWN_MS) {
    console.log(`[${new Date().toISOString()}] ⏱️ Recovery on cooldown for ${Math.ceil((RECOVERY_COOLDOWN_MS - (now - lastRecoveryTime)) / 1000)}s`);
    return false;
  }
  
  lastRecoveryTime = now;
  console.log(`[${new Date().toISOString()}] 🔄 Starting progressive scene recovery with enhanced retries...`);
  
  // Enhanced escalation with MORE retries for lighter recovery steps before full restart
  // Prioritize less disruptive methods with increased persistence
  
  // Step 1: Try refreshing only affected tiles (increased retries)
  for (let retry = 0; retry < 3; retry++) {
    if (attemptTileRefresh(scene)) {
      console.log(`[${new Date().toISOString()}] ✅ Tile refresh succeeded on attempt ${retry + 1}`);
      return true;
    }
    if (retry < 2) {
      console.log(`[${new Date().toISOString()}] ⏱️ Tile refresh failed, retrying in 500ms... (${retry + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Step 2: Try refreshing entire board (increased retries)
  for (let retry = 0; retry < 3; retry++) {
    if (attemptBoardRefresh(scene)) {
      console.log(`[${new Date().toISOString()}] ✅ Board refresh succeeded on attempt ${retry + 1}`);
      return true;
    }
    if (retry < 2) {
      console.log(`[${new Date().toISOString()}] ⏱️ Board refresh failed, retrying in 1000ms... (${retry + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Step 3: Try scene restart (with retries before full restart)
  for (let retry = 0; retry < 2; retry++) {
    if (attemptSceneRestart(scene)) {
      console.log(`[${new Date().toISOString()}] ✅ Scene restart succeeded on attempt ${retry + 1}`);
      return true;
    }
    if (retry === 0) {
      console.log(`[${new Date().toISOString()}] ⏱️ Scene restart failed, retrying in 1500ms... (${retry + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  // Step 4: Complete Phaser instance restart (last resort - only after all lighter methods exhausted)
  console.warn(`[${new Date().toISOString()}] ⚠️ All lighter recovery methods exhausted - escalating to full restart as last resort`);
  console.warn(`[${new Date().toISOString()}] 🚨 Recovery attempts completed: Tile(3), Board(3), Scene(2) - Full restart required`);
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
        // 🔧 CRITICAL FIX: Check scene readiness before tile correction
        if (!isSceneReadyForOperations(scene)) {
          console.warn(`[PhaserGuard] Skipping tile correction - scene not ready`);
          attempt.success = false;
          return;
        }

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
        boardState.shadowSprites = [];
        
        // Recreate layout elements
        if (!isSceneReadyForOperations(scene)) {
          console.warn(`[PhaserGuard] Skipping layout creation - scene not ready`);
          return;
        }
        
        createGameLayout(scene, layoutState, interactionState, boardState);
        
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
function create(this: Phaser.Scene, socket?: Socket<ServerToClientEvents, ClientToServerEvents>, gameState?: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end', getCurrentDifficulty?: () => DifficultyLevel) {
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

  // 🚀 PHASE 5B: Initialize Audio System (independent of other systems)
  initializeAudioSystem(this);
  
  // 🚀 PHASE 5B: Initialize Particle System (independent fallback on failure)
  initializeParticleSystem(this);

  // Initialize tile arrays
  boardState.tileSprites = [];
  boardState.tileTexts = [];
  boardState.shadowSprites = [];

  // Create initial layout
  if (!isSceneReadyForOperations(this)) {
    console.warn(`[PhaserGuard] Skipping initial layout creation - scene not ready`);
    return;
  }
  
  createGameLayout(this, layoutState, interactionState, boardState);

  // Initialize resize handler
  initializeResizeHandler(this, layoutState, interactionState, boardState, updateBoardDisplayWrapper.bind(this));

  // Initialize global pointer events
  initializeGlobalPointerEvents(this, boardState, interactionState, () => gameState || 'menu', getCurrentDifficulty || (() => 'medium'));

  // Render the board if we already have data
  if (boardState.currentBoard) {
    updateBoardDisplayWrapper.call(this);
  } else {
    // 🔧 Check for any available board data in global state
    const pendingBoard = (window as any).pendingGameBoard;
    const currentBoard = (window as any).currentGameBoard;
    const pendingRoundBoard = (window as any).pendingRoundBoard;
    
    if (pendingRoundBoard) {
      console.log(`[${new Date().toISOString()}] 🔄 Found pending round board - rendering immediately`);
      boardState.currentBoard = pendingRoundBoard;
      updateBoardDisplayWrapper.call(this);
      
      // Clear the pending board
      (window as any).pendingRoundBoard = null;
    } else if (pendingBoard) {
      console.log(`[${new Date().toISOString()}] 🎲 Found pending board in global state - storing for match:go`);
      boardState.pendingBoard = pendingBoard;
    } else if (currentBoard && (gameState === 'match')) {
      console.log(`[${new Date().toISOString()}] 🎮 Found current board in global state - rendering immediately`);
      boardState.currentBoard = currentBoard;
      updateBoardDisplayWrapper.call(this);
      
      // Clear global state since we've used it
      (window as any).currentGameBoard = null;
      (window as any).currentBoardChecksum = null;
    } else {
      // 🔧 TASK 3: Disable Individual Board Requests in Multiplayer
      // In multiplayer modes (countdown/match), rely only on server broadcasts to prevent desync
      if (socket && gameState !== 'countdown' && gameState !== 'match') {
        console.log(`[${new Date().toISOString()}] 📨 Requesting board for single-player or lobby mode (gameState: ${gameState})`);
        socket.emit('game:request-board');
      } else if (gameState === 'countdown' || gameState === 'match') {
        console.log(`[${new Date().toISOString()}] 🔒 Skipping board request in multiplayer mode (gameState: ${gameState}) - awaiting server broadcast`);
      }
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
  
  // 📊 DEPLOY 1: Track board render performance
  const renderStartTime = performance.now();
  
  // Enhanced readiness check with polling before escalating to recovery
  if (!isSceneReady(this)) {
    console.log(`[${new Date().toISOString()}] ⏱️ Scene not ready - polling for readiness before recovery`);
    
    let pollAttempts = 0;
    const maxPollAttempts = 50; // Increased to 5 seconds of polling (50 * 100ms) - more patience before recovery
    const scene = this;
    
    const pollInterval = setInterval(() => {
      pollAttempts++;
      
      if (isSceneReady(scene)) {
        clearInterval(pollInterval);
        console.log(`[${new Date().toISOString()}] ✅ Scene became ready after ${pollAttempts * 100}ms - proceeding with update`);
        
        try {
          updateBoardDisplayModule(scene, boardState, setupTileInteractionWrapper.bind(scene));
          console.log(`[${new Date().toISOString()}] ✅ Board display updated successfully after polling`);
          
          // 📊 DEPLOY 1: Record board render time
          const renderTime = performance.now() - renderStartTime;
          import('../services/syncMonitoring.js').then(({ syncMonitoring }) => {
            syncMonitoring.recordBoardRenderTime(renderTime);
          }).catch(() => {});
        } catch (error) {
          console.error(`[${new Date().toISOString()}] ❌ Board update failed after polling:`, error);
        }
        return;
      }
      
             if (pollAttempts >= maxPollAttempts) {
         clearInterval(pollInterval);
         console.warn(`[${new Date().toISOString()}] ⏰ Scene readiness polling timed out after 5s - attempting recovery as last resort`);
         
         recoverSceneState(scene).then(success => {
           if (!success) {
             console.error(`[${new Date().toISOString()}] ❌ Scene recovery failed - board update cancelled`);
           } else {
             console.log(`[${new Date().toISOString()}] ✅ Scene recovery successful - retrying board update`);
             updateBoardDisplayWrapper.call(scene);
           }
         }).catch(error => {
           console.error(`[${new Date().toISOString()}] ❌ Scene recovery error:`, error);
         });
       }
    }, 100); // Poll every 100ms
    
    return; // Exit early, polling will handle the update
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
        
        // 🔧 CRITICAL FIX: Check scene readiness before tile correction
        if (!isSceneReadyForOperations(this)) {
          console.warn(`[PhaserGuard] Skipping auto-correction - scene not ready`);
          return;
        }

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
          }, 400); // Increased delay to ensure cascade animations are complete
        }
      } else {
        console.log(`[${new Date().toISOString()}] ✅ Visual state validation passed`);
      }
    }, 300); // Increased delay to allow cascade animations to complete (150ms + buffer)

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
    }, 500); // Increased delay to avoid interfering with cascade animations
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
    
    // Attempt scene recovery (async)
    const scene = this;
    recoverSceneState(scene).then(success => {
      if (success) {
        console.log(`[${new Date().toISOString()}] ✅ Scene recovered - retrying tile changes`);
        // Retry after brief delay
        setTimeout(() => processQueuedTileChanges.call(scene), 50);
      } else {
        console.error(`[${new Date().toISOString()}] ❌ Scene recovery failed - tile changes will be dropped`);
      }
    }).catch(error => {
      console.error(`[${new Date().toISOString()}] ❌ Scene recovery error:`, error);
    });
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
      // Dynamic timeout based on animation complexity
      const dynamicTimeoutMs = Math.max(5000, pending.removedPositions.length * 500 + 2000); // Base on removed tiles
      console.log(`[${new Date().toISOString()}] ⏱️ Using dynamic timeout: ${dynamicTimeoutMs}ms for ${pending.removedPositions.length} tiles`);
      
      const timeout = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Processing timeout')), dynamicTimeoutMs)
      );
      
      const processingPromise = processTileChanges(this, boardState, pending, setupTileInteractionWrapper.bind(this));
      
      Promise.race([timeout, processingPromise])
        .then(() => {
          console.log(`Tile changes (seq: ${currentSequence}) processed successfully.`);
          lastProcessedSequence = currentSequence;
          pendingTileChanges.delete(currentSequence);
        })
        .catch((error) => {
          if (error.message.includes('timeout')) {
            console.warn(`[${new Date().toISOString()}] ⏰ Tile processing timeout - retrying once`);
            
            // Only retry once per sequence
            if (retryingSequence !== currentSequence) {
              retryingSequence = currentSequence;
              setTimeout(() => {
                retryingSequence = null; // Reset retry state
                processQueuedTileChanges.call(this);
              }, 1000); // Retry after 1s
            } else {
              console.error(`[${new Date().toISOString()}] ❌ Tile processing failed after retry - clearing queue`);
              pendingTileChanges.clear();
              lastProcessedSequence = currentSequence;
              retryingSequence = null;
            }
          } else {
            console.error(`Error processing tile changes (seq: ${currentSequence}):`, error);
            // Clear queue on non-timeout error to prevent blocking
            pendingTileChanges.clear();
            lastProcessedSequence = currentSequence;
          }
        })
        .finally(() => {
          // Only reset processing flag if not retrying
          if (retryingSequence !== currentSequence) {
            isProcessingTileChanges = false;
            
            // If there are still pending changes, process the next one
            if (pendingTileChanges.has(lastProcessedSequence + 1)) {
              processQueuedTileChanges.call(this);
            }
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
 * Completely independent of particle system - handles its own success/failure
 * @param scene - Phaser scene for audio context
 */
function initializeAudioSystem(scene: Phaser.Scene): void {
  console.log(`[${new Date().toISOString()}] 🎵 Initializing audio system (independent)...`);
  
  // Check global audio disable flag first
  if (!AUDIO_ENABLED) {
    console.log(`[${new Date().toISOString()}] 🔇 Audio disabled globally - skipping initialization to prevent buzzing sounds`);
    audioSystem.isEnabled = false;
    audioSystem.isInitialized = false;
    return;
  }
  
  // Reset audio state for clean initialization
  audioSystem.isInitialized = false;
  audioSystem.isEnabled = true;
  
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

    // Mark as successfully initialized
    audioSystem.isInitialized = true;
    console.log(`[${new Date().toISOString()}] ✅ Audio system initialized successfully (independent of other systems)`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Audio system initialization failed:`, error);
    
    // Enhanced graceful audio-only fallback with complete cleanup
    audioSystem.isEnabled = false;
    audioSystem.isInitialized = false;
    
    // Stop any playing sounds to prevent buzzing
    try {
      if (scene.sound) {
        scene.sound.stopAll();
        scene.sound.pauseOnBlur = false;
      }
    } catch (stopError) {
      console.warn('Failed to stop existing sounds:', stopError);
    }
    
    // Clear any partially initialized audio objects safely
    Object.keys(audioSystem).forEach(key => {
      if (key !== 'volume' && key !== 'musicVolume' && key !== 'isEnabled' && key !== 'isInitialized') {
        try {
          const audioObject = audioSystem[key as keyof AudioSystem];
          if (audioObject && typeof (audioObject as any).destroy === 'function') {
            (audioObject as any).destroy();
          }
          // Use type assertion to safely set to undefined
          (audioSystem as any)[key] = undefined;
        } catch (cleanupError) {
          console.warn(`Failed to cleanup audio object ${key}:`, cleanupError);
        }
      }
    });
    
    console.warn(`[${new Date().toISOString()}] 🔇 Audio disabled due to initialization failure - game will continue silently without buzzing sounds`);
  }
}

/**
 * 🚀 PHASE 5B: Particle System Initialization
 * Initialize premium particle effects for game events
 * Completely independent of audio system - graceful fallback on failure
 * @param scene - Phaser scene for particle context
 */
function initializeParticleSystem(scene: Phaser.Scene): void {
  console.log(`[${new Date().toISOString()}] ✨ Initializing particle system (independent)...`);
  
  // Reset particle state for clean initialization
  particleSystem.isInitialized = false;
  particleSystem.emitters.clear();
  
  try {
    // Verify particle texture exists before creating emitters
    if (!scene.textures.exists('simple-particle')) {
      throw new Error('Required particle texture "simple-particle" not found');
    }

    // Word validation success particles (golden burst)
    const wordValidEmitter = scene.add.particles(0, 0, 'simple-particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 8,
      blendMode: 'ADD',
      emitting: false
    });
    particleSystem.emitters.set('wordValidEmitter', wordValidEmitter);

    // Tile cascade particles (electric blue) 
    const cascadeEmitter = scene.add.particles(0, 0, 'simple-particle', {
      speed: { min: 30, max: 100 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 600,
      quantity: 5,
      blendMode: 'ADD',
      tint: 0x74F5F6, // Blue tint
      emitting: false
    });
    particleSystem.emitters.set('cascadeEmitter', cascadeEmitter);

    // Speed bonus particles (rainbow burst)
    const speedBonusEmitter = scene.add.particles(0, 0, 'simple-particle', {
      speed: { min: 80, max: 200 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: 12,
      blendMode: 'ADD',
      tint: [0xFFE265, 0x74F5F6, 0xFF6B6B, 0x4ECDC4],
      emitting: false
    });
    particleSystem.emitters.set('speedBonusEmitter', speedBonusEmitter);

    // Mark as successfully initialized
    particleSystem.isInitialized = true;
    console.log(`[${new Date().toISOString()}] ✅ Particle system initialized successfully with ${particleSystem.emitters.size} emitters (independent of audio system)`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Particle system initialization failed:`, error);
    
    // Graceful particle-only fallback - don't affect other systems
    particleSystem.isInitialized = false;
    particleSystem.emitters.clear();
    
    console.warn(`[${new Date().toISOString()}] ✨ Particle effects disabled due to initialization failure - game will continue without visual effects`);
  }
}

/**
 * Play sound effect through the audio system with enhanced validation
 * @param soundName - Name of the sound to play from AudioSystem keys
 * @param options - Optional sound configuration (volume, etc.)
 */
function playSound(soundName: keyof AudioSystem, options?: { volume?: number }): void {
  // Check global audio disable flag first
  if (!AUDIO_ENABLED || !audioSystem.isEnabled || !audioSystem.isInitialized) {
    // Silent return when audio disabled - prevents buzzing sounds
    return;
  }
  
  const sound = audioSystem[soundName];
  if (sound && typeof (sound as any).play === 'function') {
    // Apply volume if specified
    if (options?.volume && typeof (sound as any).setVolume === 'function') {
      (sound as any).setVolume(options.volume);
    }
    (sound as any).play();
  } else {
    console.warn(`[Audio] Sound ${soundName} not found or not playable`);
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
  // Map effect names to emitter names
  const emitterNameMap = {
    'wordValid': 'wordValidEmitter',
    'cascade': 'cascadeEmitter', 
    'speedBonus': 'speedBonusEmitter'
  };
  
  const emitter = particleSystem.emitters.get(emitterNameMap[effectName]);
  if (!emitter || !particleSystem.isInitialized) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Particle emitter '${effectName}' not available or system not initialized`);
    return;
  }
  
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

/**
 * 🔧 UPDATED FIX: More targeted scene readiness validation for PhaserGame operations
 * Focuses on the actual null scene.add issue rather than broader scene state
 */
function isSceneReadyForOperations(scene: Phaser.Scene | null): boolean {
  try {
    if (!scene) {
      console.warn(`[PhaserGuard] Scene is null`);
      return false;
    }

    // 🔧 CRITICAL: Focus on the actual issue - scene.add being null
    if (!scene.add) {
      console.warn(`[PhaserGuard] scene.add is null - scene has been destroyed`);
      return false;
    }

    // Check if essential scene systems are available (more lenient than isActive)
    if (!scene.sys) {
      console.warn(`[PhaserGuard] scene.sys is null`);
      return false;
    }

    // Additional check for completely destroyed game instance
    if (scene.sys.game && scene.sys.game.isDestroyed) {
      console.warn(`[PhaserGuard] Game instance is destroyed`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[PhaserGuard] Error checking scene readiness:`, error);
    return false;
  }
}