// frontend/src/services/userApi.ts
import api from './api';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    role_id: number;
    is_active: boolean;
  };
}

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const res = await api.patch('/users/me', data);
  return res.data;
};

export const deactivateAccount = async (): Promise<void> => {
  await api.patch('/users/me/deactivate');
};