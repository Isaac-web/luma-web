import { User } from '@/types';
import { apiClient } from './index';

export const fetchMe = async () => {
  const res = await apiClient.get<User>('/auth/me');
  return res.data;
};
