'use client';

import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function CheckInError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/20">
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="size-8 text-black/70" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
        Oops, something went wrong.
      </h2>

      <p className="text-gray-500 text-sm mb-8 font-medium">
        Kindly refresh your browser to try again.
      </p>

      <Button
        onClick={() =>
          typeof window !== 'undefined' && window.location.reload()
        }
        className="h-11 px-8 rounded-full bg-black hover:bg-black/90 text-white font-semibold transition-all"
      >
        Refresh Browser
      </Button>
    </div>
  );
}
