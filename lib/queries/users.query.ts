import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { fetchUsers, makeAdmin } from '../api/users.api';

export const usersQueryOptions = (
  filters: {
    name?: string;
  } = {},
) =>
  infiniteQueryOptions({
    queryKey: ['users', filters],
    queryFn: ({ pageParam = 1 }) => fetchUsers({ page: pageParam, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage >= lastPage.meta.numberOfPages) {
        return undefined;
      }
      return lastPage.meta.currentPage + 1;
    },
  });
