/**
 * Game Context
 * Centralized state management for game data using React Context API
 */

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  PlayerSession, 
  GameRoom, 
  MatchSettings,
  DifficultyLevel 
} from '@word-rush/common';

interface RoundTimer {
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
  displayTime?: string; // For preventing unnecessary re-renders
}

interface GameContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  playerSession: PlayerSession | null;
  currentRoom: GameRoom | null;
  gameState: 'menu' | 'lobby' | 'match' | 'round-end' | 'match-end';
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
  setSocket: (socket: Socket<ServerToClientEvents, ClientToServerEvents> | null) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setPlayerSession: (session: PlayerSession | null) => void;
  setCurrentRoom: (room: GameRoom | null) => void;
  setGameState: (state: 'menu' | 'lobby' | 'match' | 'round-end' | 'match-end') => void;
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

/**
 * Game Context Provider component
 * Manages global game state including socket connection and player session
 * @param children - Child components that will have access to game context
 */
export function GameProvider({ children }: GameProviderProps): JSX.Element {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(null);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'lobby' | 'match' | 'round-end' | 'match-end'>('menu');
  const [matchData, setMatchData] = useState<{
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
  const [roundTimer, setRoundTimer] = useState<RoundTimer | null>(null);

  // Timer optimization: Track last rendered display time to prevent unnecessary re-renders
  const lastDisplayTimeRef = useRef<string>('');
  const currentTimerRef = useRef<RoundTimer | null>(null);

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
      setRoundTimer(updatedTimer);
    } else {
      // Just update the ref without triggering re-render
      currentTimerRef.current = {
        ...currentTimerRef.current,
        timeRemaining
      };
    }
  }, [formatTime]);

  /**
   * Enhanced setRoundTimer that tracks the timer reference
   */
  const setRoundTimerEnhanced = useCallback((timer: RoundTimer | null) => {
    currentTimerRef.current = timer;
    if (timer) {
      lastDisplayTimeRef.current = formatTime(timer.timeRemaining);
      timer.displayTime = lastDisplayTimeRef.current;
    } else {
      lastDisplayTimeRef.current = '';
    }
    setRoundTimer(timer);
  }, [formatTime]);

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