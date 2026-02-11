import { FetchUsersResponse } from '@/types';
import { apiClient } from './index';

export const fetchUsers = async ({
  page = 1,
  limit = 20,
  name,
}: {
  page?: number;
  limit?: number;
  name?: string;
} = {}) => {
  const params = {
    page,
    limit,
    name,
  };

  const res = await apiClient.get<FetchUsersResponse>('/users', {
    params,
  });

  return res.data;
};

export const makeAdmin = async (userId: string) => {
  const res = await apiClient.patch(`/users/${userId}/role`, {
    userType: 'admin',
  });
  return res.data;
};
