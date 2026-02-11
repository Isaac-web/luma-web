'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface RealtimeContextType {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isRetrying: boolean;
  socket: Socket | null;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined,
);

export const RealtimeProvider: React.FC<{
  children: React.ReactNode;
  url?: string;
}> = ({
  children,
  url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const socket = io(url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setIsDisconnected(false);
      setIsRetrying(false);
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsDisconnected(true);
      setIsRetrying(false);
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsDisconnected(true);
      setIsRetrying(socket.active);
      console.log('Socket connection error:', error);
    });

    socket.on('reconnecting', (attempt) => {
      setIsRetrying(true);
      setIsConnecting(true);
      console.log('Socket reconnecting, attempt:', attempt);
    });

    socket.onAny((event, ...args) => {
      console.log(`Socket event received: ${event}`, args);
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        isConnecting,
        isDisconnected,
        isRetrying,
        socket,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);

  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }

  return context;
};
