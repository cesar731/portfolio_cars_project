 
import api from './api';

export interface Accessory {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock: number;
  created_by: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const getAccessories = async (): Promise<Accessory[]> => {
  const response = await api.get<Accessory[]>('/accessories');
  return response.data;
};

export const getAccessoryById = async (id: number): Promise<Accessory> => {
  const response = await api.get<Accessory>(`/accessories/${id}`);
  return response.data;
};