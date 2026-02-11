import { FetchCheckinsResponse } from '@/types';
import { apiClient } from './index';

export const fetchCheckins = async ({
  page = 1,
  limit = 20,
  name,
  email,
  userId,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
} = {}) => {
  const params = {
    page,
    limit,
    name,
    email,
    userId,
    startDate,
    endDate,
  };

  const res = await apiClient.get<FetchCheckinsResponse>('/checkins/all', {
    params,
  });

  return res.data;
};
