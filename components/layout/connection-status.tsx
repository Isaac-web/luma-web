'use client';

import { useEffect, useState } from 'react';
import { useRealtime } from '@/components/providers/realtime-provider';
import { WifiOff, Loader2, CheckCircle2 } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, isRetrying, isDisconnected } = useRealtime();
  const [showOnline, setShowOnline] = useState(false);
  const [prevConnected, setPrevConnected] = useState(isConnected);

  useEffect(() => {
    if (!prevConnected && isConnected) {
      setShowOnline(true);
      const timer = setTimeout(() => setShowOnline(false), 3000);
      return () => clearTimeout(timer);
    }
    setPrevConnected(isConnected);
  }, [isConnected, prevConnected, isRetrying]);

  // Keep-alive: Silently ping the backend every 45 seconds
  useEffect(() => {
    const pingInterval = setInterval(async () => {
      try {
        await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
          {
            mode: 'no-cors', // Minimize impact
          },
        );
      } catch (error) {
        // Silent fail
      }
    }, 45000);

    return () => clearInterval(pingInterval);
  }, []);

  // Case 1: Offline/Retrying Banner
  if (!isConnected && (isDisconnected || isRetrying)) {
    return (
      <div className="w-full bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          {isRetrying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <WifiOff className="size-4" />
          )}
          <span className="text-xs font-semibold tracking-wide">
            {isRetrying
              ? 'Connection was lost. Retrying...'
              : 'The application is offline'}
          </span>
        </div>
      </div>
    );
  }

  // Case 2: Back Online Banner (Temporary)
  if (showOnline) {
    return (
      <div className="w-full bg-emerald-600/50 text-white px-4 py-2 flex items-center justify-center gap-3 animate-out fade-out slide-out-to-top fill-mode-forwards duration-500 delay-2500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span className="text-xs font-semibold tracking-wide">
            Network connected successfully.
          </span>
        </div>
      </div>
    );
  }

  return null;
}
