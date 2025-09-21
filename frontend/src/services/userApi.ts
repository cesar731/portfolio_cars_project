import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  avatar_url?: string | null;
  is_active: boolean;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  avatar_url?: string;
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/me');
  return response.data;
};

export const updateUser = async (userData: UserUpdateRequest): Promise<User> => {
  const response = await api.put<User>('/api/users/me', userData);
  return response.data;
};

export const deleteUser = async (): Promise<void> => {
  await api.delete('/api/users/me');
};
