/**
 * Game Context
 * Centralized state management for game data using React Context API
 * 🟡 PHASE 3B: Enhanced with state batching, validation, and debouncing
 */

import { createContext, useContext, useState, useRef, useCallback, ReactNode, startTransition } from 'react';
import { Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  PlayerSession, 
  GameRoom,
  DifficultyLevel 
} from '@word-rush/common';
import { notifications } from '../services/notifications';

interface RoundTimer {
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
  displayTime?: string; // For preventing unnecessary re-renders
}

/**
 * 🟡 PHASE 3B: Enhanced State Management Types
 */

// Valid game state transitions - expanded to allow more flexible flow including same-state transitions
const VALID_STATE_TRANSITIONS: Record<string, string[]> = {
  'menu': ['menu', 'lobby', 'countdown', 'match', 'round-end', 'match-end', 'single-player-setup'], // Add single-player-setup transition
  'lobby': ['lobby', 'menu', 'countdown', 'match', 'round-end', 'match-end'], // Add countdown transition from lobby
  'countdown': ['countdown', 'match', 'lobby', 'menu'], // New countdown state transitions
  'match': ['match', 'round-end', 'match-end', 'lobby', 'menu'], // Add self-transition for match data updates
  'round-end': ['round-end', 'match', 'match-end', 'lobby', 'menu'], // Add self-transition for summary updates
  'match-end': ['match-end', 'lobby', 'menu', 'match'], // Add self-transition for final data updates
  'single-player-setup': ['single-player-setup', 'single-player', 'menu'], // Single-player setup transitions
  'single-player': ['single-player', 'single-player-end', 'menu'], // Single-player game transitions
  'single-player-end': ['single-player-end', 'menu', 'single-player-setup'] // Single-player end transitions
};

// Debouncing configuration
const DEBOUNCE_CONFIG = {
  timerUpdates: 100, // 100ms debounce for timer updates
  roomUpdates: 50,   // 50ms debounce for room updates
  sessionUpdates: 200, // 200ms debounce for session updates
  stateChanges: 0,   // No debounce for critical state changes
};

// State change logging for debugging
interface StateChangeLog {
  timestamp: number;
  fromState: any;
  toState: any;
  triggeredBy: string;
}

const stateChangeHistory: StateChangeLog[] = [];
const MAX_HISTORY_SIZE = 50;

interface GameContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  playerSession: PlayerSession | null;
  currentRoom: GameRoom | null;
  gameState: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end';
  matchData: {
    currentRound: number;
    totalRounds: number;
    timeRemaining: number;
    leaderboard: Array<{ id: string; username: string; score: number; difficulty?: DifficultyLevel }>;
  } | null;
  lastWordResult: {
    word: string;
    points: number;
    isValid: boolean;
    speedBonus?: boolean;
  } | null;
  roundSummary: any;
  matchComplete: any;
  roundTimer: RoundTimer | null;
  singlePlayerDifficulty: DifficultyLevel | null;
  singlePlayerDuration: number | null; // in seconds
  singlePlayerScore: number; // Track running score
  setSocket: (socket: Socket<ServerToClientEvents, ClientToServerEvents> | null) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setPlayerSession: (session: PlayerSession | null) => void;
  setCurrentRoom: (room: GameRoom | null) => void;
  setGameState: (state: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end') => void;
  setMatchData: (data: {
    currentRound: number;
    totalRounds: number;
    timeRemaining: number;
    leaderboard: Array<{ id: string; username: string; score: number; difficulty?: DifficultyLevel }>;
  } | null) => void;
  setLastWordResult: (result: { word: string; points: number; isValid: boolean; speedBonus?: boolean; } | null) => void;
  setRoundSummary: (summary: any) => void;
  setMatchComplete: (complete: any) => void;
  setRoundTimer: (timer: RoundTimer | null) => void;
  setRoundTimerOptimized: (timeRemaining: number) => void; // New optimized setter
  safeSetRoundTimer: (timer: RoundTimer | null) => void; // Safe wrapper to prevent crashes
  setSinglePlayerDifficulty: (diff: DifficultyLevel | null) => void;
  setSinglePlayerDuration: (dur: number | null) => void;
  setSinglePlayerScore: (score: number) => void;
  resetSinglePlayer: () => void; // For cleanup
  // 🟡 PHASE 3B: Batch update function for complex state operations
  batchUpdateGameState: (updates: {
    gameState?: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end';
    currentRoom?: GameRoom | null;
    matchData?: {
      currentRound: number;
      totalRounds: number;
      timeRemaining: number;
      leaderboard: Array<{ id: string; username: string; score: number; difficulty?: DifficultyLevel }>;
    } | null;
    roundTimer?: RoundTimer | null;
  }) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

/**
 * 🟡 PHASE 3B: State Management Helper Functions
 */

/**
 * Validate state transition
 * @param fromState - Current state
 * @param toState - Target state
 * @returns true if transition is valid
 */
function validateStateTransition(fromState: string, toState: string): boolean {
  const validTransitions = VALID_STATE_TRANSITIONS[fromState];
  if (!validTransitions) {
    console.warn(`[GameContext] Unknown state: ${fromState}`);
    return true; // Allow unknown states for flexibility
  }
  
  const isValid = validTransitions.includes(toState);
  if (!isValid) {
    console.error(`[GameContext] Invalid state transition: ${fromState} -> ${toState}`);
    console.error(`[GameContext] Valid transitions from ${fromState}:`, validTransitions);
  }
  
  return isValid;
}

/**
 * Log state change for debugging
 * @param type - Type of state change
 * @param fromState - Previous state
 * @param toState - New state
 * @param triggeredBy - What triggered the change
 */
function logStateChange(type: string, fromState: any, toState: any, triggeredBy: string): void {
  const logEntry: StateChangeLog = {
    timestamp: Date.now(),
    fromState,
    toState,
    triggeredBy
  };
  
  stateChangeHistory.push(logEntry);
  
  // Keep history size manageable
  if (stateChangeHistory.length > MAX_HISTORY_SIZE) {
    stateChangeHistory.shift();
  }
  
  console.log(`[GameContext] State change: ${type}`, {
    from: fromState,
    to: toState,
    triggeredBy,
    timestamp: new Date(logEntry.timestamp).toISOString()
  });
}

/**
 * Create debounced state setter
 * @param setter - Original state setter
 * @param debounceMs - Debounce delay in milliseconds
 * @param type - Type of state for logging
 * @returns Debounced setter function
 */
function createDebouncedSetter<T>(
  setter: (value: T) => void,
  debounceMs: number,
  type: string
): (value: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (value: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (debounceMs === 0) {
      // No debouncing for critical updates
      setter(value);
      return;
    }
    
    timeoutId = setTimeout(() => {
      startTransition(() => {
        setter(value);
      });
    }, debounceMs);
  };
}

/**
 * Batch multiple state updates
 * @param updates - Array of state updates to batch
 */
function batchStateUpdates(updates: (() => void)[]): void {
  startTransition(() => {
    updates.forEach(update => update());
  });
}

/**
 * Game Context Provider component
 * Manages global game state including socket connection and player session
 * @param children - Child components that will have access to game context
 */
export function GameProvider({ children }: GameProviderProps): JSX.Element {
  // 🟡 PHASE 3B: Enhanced state management with validation and debouncing
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [playerSession, setPlayerSessionInternal] = useState<PlayerSession | null>(null);
  const [currentRoom, setCurrentRoomInternal] = useState<GameRoom | null>(null);
  const [gameState, setGameStateInternal] = useState<'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end'>('menu');
  const [matchData, setMatchDataInternal] = useState<{
    currentRound: number;
    totalRounds: number;
    timeRemaining: number;
    leaderboard: Array<{ id: string; username: string; score: number; difficulty?: DifficultyLevel }>;
  } | null>(null);
  const [lastWordResult, setLastWordResult] = useState<{
    word: string;
    points: number;
    isValid: boolean;
    speedBonus?: boolean;
  } | null>(null);
  const [roundSummary, setRoundSummary] = useState<any>(null);
  const [matchComplete, setMatchComplete] = useState<any>(null);
  const [roundTimer, setRoundTimerInternal] = useState<RoundTimer | null>(null);
  const [singlePlayerDifficulty, setSinglePlayerDifficulty] = useState<DifficultyLevel | null>(null);
  const [singlePlayerDuration, setSinglePlayerDuration] = useState<number | null>(null);
  const [singlePlayerScore, setSinglePlayerScore] = useState<number>(0);

  // 🟡 PHASE 3B: Enhanced setters with validation and debouncing
  const setGameState = useCallback((newState: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end') => {
    const currentState = gameState;
    
    // Validate state transition
    if (!validateStateTransition(currentState, newState)) {
      console.error(`[GameContext] Invalid state transition: ${currentState} -> ${newState}`);
      
      // Smart recovery: Choose contextually appropriate fallback
      let fallbackState: 'menu' | 'lobby' | 'match' | 'round-end' | 'match-end' = 'lobby';
      
      // More intelligent fallback logic
      if (newState === 'match' || newState === 'round-end') {
        fallbackState = 'lobby'; // Match-related states fallback to lobby
      } else if (newState === 'match-end') {
        fallbackState = currentState === 'match' ? 'match' : 'lobby'; // Stay in match if possible
      } else {
        fallbackState = 'menu'; // General fallback to menu for other cases
      }
      
      console.warn(`[GameContext] Recovering from invalid transition: ${currentState} -> ${newState}, using fallback: ${fallbackState}`);
      notifications.error(`Invalid game state transition - recovering to ${fallbackState}`, 3000);
      
      // Log the recovery action
      logStateChange('gameState', currentState, fallbackState, 'setGameState-smart-recovery');
      
      // Set to contextual fallback
      startTransition(() => {
        setGameStateInternal(fallbackState);
      });
      return;
    }
    
    // Log state change
    logStateChange('gameState', currentState, newState, 'setGameState');
    
    // Update state immediately (no debounce for critical state changes)
    startTransition(() => {
      setGameStateInternal(newState);
    });
  }, [gameState]);

  const resetSinglePlayer = useCallback(() => {
    setSinglePlayerDifficulty(null);
    setSinglePlayerDuration(null);
    setSinglePlayerScore(0);
  }, []);

  const setPlayerSession = useCallback(createDebouncedSetter(
    (session: PlayerSession | null) => {
      logStateChange('playerSession', playerSession, session, 'setPlayerSession');
      setPlayerSessionInternal(session);
    },
    DEBOUNCE_CONFIG.sessionUpdates,
    'playerSession'
  ), [playerSession]);

  const setCurrentRoom = useCallback(createDebouncedSetter(
    (room: GameRoom | null) => {
      logStateChange('currentRoom', currentRoom, room, 'setCurrentRoom');
      setCurrentRoomInternal(room);
    },
    DEBOUNCE_CONFIG.roomUpdates,
    'currentRoom'
  ), [currentRoom]);

  const setMatchData = useCallback(createDebouncedSetter(
    (data: typeof matchData) => {
      logStateChange('matchData', matchData, data, 'setMatchData');
      setMatchDataInternal(data);
    },
    DEBOUNCE_CONFIG.roomUpdates,
    'matchData'
  ), [matchData]);

  // Timer optimization: Track last rendered display time to prevent unnecessary re-renders
  const lastDisplayTimeRef = useRef<string>('');
  const currentTimerRef = useRef<RoundTimer | null>(null);
  
  // State persistence refs to prevent resets during re-renders
  const gameStateRef = useRef<'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end'>(gameState);
  const currentRoomRef = useRef<GameRoom | null>(currentRoom);
  const matchDataRef = useRef<typeof matchData>(matchData);
  
  // Update refs whenever state changes
  gameStateRef.current = gameState;
  currentRoomRef.current = currentRoom;
  matchDataRef.current = matchData;

  /**
   * Format time remaining for display (same logic as GameHUD)
   */
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Optimized timer setter that only triggers re-renders when display time changes
   */
  const setRoundTimerOptimized = useCallback((timeRemaining: number) => {
    if (!currentTimerRef.current) return;

    const newDisplayTime = formatTime(timeRemaining);
    
    // Only update state if the display time has actually changed
    if (newDisplayTime !== lastDisplayTimeRef.current) {
      lastDisplayTimeRef.current = newDisplayTime;
      
      const updatedTimer: RoundTimer = {
        ...currentTimerRef.current,
        timeRemaining,
        displayTime: newDisplayTime
      };
      
      currentTimerRef.current = updatedTimer;
      
      // Call internal setter directly to avoid circular dependency
      startTransition(() => {
        setRoundTimerInternal(updatedTimer);
      });
    } else {
      // Just update the ref without triggering re-render
      currentTimerRef.current = {
        ...currentTimerRef.current,
        timeRemaining
      };
    }
  }, [formatTime]);

  /**
   * Enhanced setRoundTimer that tracks the timer reference with Phase 3B optimizations
   */
  const setRoundTimerEnhanced = useCallback((timer: RoundTimer | null) => {
    try {
      // 🟡 PHASE 3B: Add logging and validation
      logStateChange('roundTimer', roundTimer, timer, 'setRoundTimerEnhanced');
      
      currentTimerRef.current = timer;
      if (timer) {
        lastDisplayTimeRef.current = formatTime(timer.timeRemaining);
        timer.displayTime = lastDisplayTimeRef.current;
      } else {
        lastDisplayTimeRef.current = '';
      }
      
      startTransition(() => {
        setRoundTimerInternal(timer);
      });
    } catch (error) {
      console.error('[GameContext] Timer update failed:', error);
      // Fallback to prevent crash - provide a safe default timer
      const fallbackTimer: RoundTimer = { 
        timeRemaining: 90000, 
        currentRound: 1, 
        totalRounds: 3,
        displayTime: '1:30'
      };
      currentTimerRef.current = fallbackTimer;
      lastDisplayTimeRef.current = fallbackTimer.displayTime!;
      startTransition(() => {
        setRoundTimerInternal(fallbackTimer);
      });
    }
  }, [formatTime, roundTimer]);

  /**
   * Safe wrapper for setRoundTimer to prevent crashes from undefined errors
   */
  const safeSetRoundTimer = useCallback((timer: RoundTimer | null) => {
    try {
      setRoundTimerEnhanced(timer);
    } catch (error) {
      console.error('[GameContext] Safe timer update failed:', error);
      // Fallback to prevent crash
      const fallbackTimer: RoundTimer = { 
        timeRemaining: 90000, 
        currentRound: 1, 
        totalRounds: 3,
        displayTime: '1:30'
      };
      setRoundTimerEnhanced(fallbackTimer);
    }
  }, [setRoundTimerEnhanced]);

  // 🟡 PHASE 3B: Batch state update helper for complex operations
  const batchUpdateGameState = useCallback((updates: {
    gameState?: 'menu' | 'lobby' | 'countdown' | 'match' | 'round-end' | 'match-end' | 'single-player-setup' | 'single-player' | 'single-player-end';
    currentRoom?: GameRoom | null;
    matchData?: typeof matchData;
    roundTimer?: RoundTimer | null;
  }) => {
    const updateFunctions: (() => void)[] = [];
    
    if (updates.gameState !== undefined) {
      updateFunctions.push(() => setGameState(updates.gameState!));
      
      // Reset single-player data when transitioning to menu
      if (updates.gameState === 'menu') {
        updateFunctions.push(() => resetSinglePlayer());
      }
    }
    if (updates.currentRoom !== undefined) {
      updateFunctions.push(() => setCurrentRoom(updates.currentRoom!));
    }
    if (updates.matchData !== undefined) {
      updateFunctions.push(() => setMatchData(updates.matchData!));
    }
    if (updates.roundTimer !== undefined) {
      updateFunctions.push(() => setRoundTimerEnhanced(updates.roundTimer!));
    }
    
    console.log(`[GameContext] Batching ${updateFunctions.length} state updates`);
    batchStateUpdates(updateFunctions);
  }, [setGameState, setCurrentRoom, setMatchData, setRoundTimerEnhanced, resetSinglePlayer]);

  const contextValue: GameContextType = {
    socket,
    connectionStatus,
    playerSession,
    currentRoom,
    gameState,
    matchData,
    lastWordResult,
    roundSummary,
    matchComplete,
    roundTimer,
    singlePlayerDifficulty,
    singlePlayerDuration,
    singlePlayerScore,
    setSocket,
    setConnectionStatus,
    setPlayerSession,
    setCurrentRoom,
    setGameState,
    setMatchData,
    setLastWordResult,
    setRoundSummary,
    setMatchComplete,
    setRoundTimer: setRoundTimerEnhanced,
    setRoundTimerOptimized,
    safeSetRoundTimer,
    setSinglePlayerDifficulty,
    setSinglePlayerDuration,
    setSinglePlayerScore,
    resetSinglePlayer,
    batchUpdateGameState, // 🟡 PHASE 3B: Enhanced batch update function
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Custom hook to access game context
 * Throws an error if used outside of GameProvider
 * @returns Game context value with socket, session, and state management functions
 */
export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
} 