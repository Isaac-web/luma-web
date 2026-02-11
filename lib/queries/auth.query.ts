import { queryOptions } from '@tanstack/react-query';
import { fetchMe } from '../api/auth.api';

export const meQueryOptions = queryOptions({
  queryKey: ['me'],
  queryFn: fetchMe,
});
