// frontend/src/services/cartApi.ts
import api from './api';
import { CartItem } from '../types';

export const getCartItems = async (userId: number): Promise<CartItem[]> => {
  const response = await api.get<CartItem[]>(`/cart/${userId}`);
  return response.data;
};

export const addToCart = async (userId: number, accessoryId: number, quantity: number = 1): Promise<CartItem> => {
  const response = await api.post<CartItem>('/cart', { user_id: userId, accessory_id: accessoryId, quantity });
  return response.data;
};

export const removeFromCart = async (userId: number, cartItemId: number): Promise<void> => {
  await api.delete(`/cart/${userId}/${cartItemId}`);
};