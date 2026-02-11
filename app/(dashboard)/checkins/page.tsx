import CheckInTable from '@/components/check-in-table';
import { getQueryClient } from '@/components/providers/query-provider/get-query-client';
import { checkinsQueryOptions } from '@/lib/queries/checkins.query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const HomePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(checkinsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
            Check-in Trail
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Real-time monitoring of student arrivals and learning statuses.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          }
        >
          <CheckInTable />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default HomePage;
