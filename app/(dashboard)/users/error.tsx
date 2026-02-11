'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-3 rounded-full bg-orange-50 border border-orange-100 mb-6">
        <AlertCircle className="h-10 w-10 text-orange-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong!
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        We encountered an error while loading the dashboard data. This might be
        a temporary connection issue.
      </p>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="flex items-center gap-2 h-11 px-6 font-semibold"
      >
        <RefreshCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
