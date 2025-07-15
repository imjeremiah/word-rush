/**
 * Game Context
 * Centralized state management for game data using React Context API
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, PlayerSession } from '@word-rush/common';

interface GameContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  playerSession: PlayerSession | null;
  lastWordResult: {
    word: string;
    points: number;
    isValid: boolean;
  } | null;
  setSocket: (socket: Socket<ServerToClientEvents, ClientToServerEvents> | null) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setPlayerSession: (session: PlayerSession | null) => void;
  setLastWordResult: (result: { word: string; points: number; isValid: boolean; } | null) => void;
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
  const [lastWordResult, setLastWordResult] = useState<{
    word: string;
    points: number;
    isValid: boolean;
  } | null>(null);

  const contextValue: GameContextType = {
    socket,
    connectionStatus,
    playerSession,
    lastWordResult,
    setSocket,
    setConnectionStatus,
    setPlayerSession,
    setLastWordResult,
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