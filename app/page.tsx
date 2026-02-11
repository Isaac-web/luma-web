'use client';
import { useRealtime } from '@/components/providers/realtime-provider';

export default function Home() {
  const { isConnected, isConnecting, isDisconnected, isRetrying } =
    useRealtime();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Real-time Connection Status</h1>
        <div className="flex flex-col gap-2">
          <p>
            Connected:{' '}
            <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
              {isConnected ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Connecting:{' '}
            <span
              className={isConnecting ? 'text-yellow-500' : 'text-gray-500'}
            >
              {isConnecting ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Disconnected:{' '}
            <span className={isDisconnected ? 'text-red-500' : 'text-gray-500'}>
              {isDisconnected ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Retrying:{' '}
            <span className={isRetrying ? 'text-orange-500' : 'text-gray-500'}>
              {isRetrying ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
        <div className="mt-4 p-4 border rounded bg-zinc-50 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Check the console for <code>CHECKIN_SIGNED</code> events!
          </p>
        </div>
      </main>
    </div>
  );
}
