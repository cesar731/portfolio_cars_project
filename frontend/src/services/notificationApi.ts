// frontend/src/services/notificationApi.ts
import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications/me');
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<Notification> => {
  const response = await api.put<Notification>(`/notifications/${id}`, { is_read: true });
  return response.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};