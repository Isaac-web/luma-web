import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchCheckins } from '../api/checkins.api';

export const checkinsQueryOptions = (
  filters: {
    name?: string;
    email?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) =>
  infiniteQueryOptions({
    queryKey: ['checkins', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchCheckins({ page: pageParam, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage >= lastPage.meta.numberOfPages) {
        return undefined;
      }
      return lastPage.meta.currentPage + 1;
    },
  });
