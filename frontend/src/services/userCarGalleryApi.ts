import api from './api';
import { UserCarGalleryItem } from '../types';

export const getUserGallery = async (): Promise<UserCarGalleryItem[]> => {
  const response = await api.get<UserCarGalleryItem[]>('/user-car-gallery');
  return response.data;
};

export const getUserGalleryItem = async (id: number): Promise<UserCarGalleryItem> => {
  const response = await api.get<UserCarGalleryItem>(`/user-car-gallery/${id}`);
  return response.data;
};

export const createUserGalleryItem = async (
  data: Omit<UserCarGalleryItem, 'id' | 'created_at' | 'updated_at' | 'likes' | 'deleted_at'>
): Promise<UserCarGalleryItem> => {
  const response = await api.post<UserCarGalleryItem>('/user-car-gallery', data);
  return response.data;
};

export const likeGalleryItem = async (id: number): Promise<{ likes: number }> => {
  const response = await api.post<{ likes: number }>(`/user-car-gallery/${id}/like`);
  return response.data;
};


export const likeGalleryEntry = async (entryId: number): Promise<{ likes: number }> => {
  const res = await api.post(`/user-car-gallery/${entryId}/like`);
  return res.data;
};
