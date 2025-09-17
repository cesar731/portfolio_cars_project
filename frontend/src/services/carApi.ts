 
import api from './api';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  description?: string;
  image_url?: string[];
  specifications?: Record<string, any>;
  fuel_type?: string;
  mileage?: number;
  color?: string;
  created_by: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const getCars = async (): Promise<Car[]> => {
  const response = await api.get<Car[]>('/cars');
  return response.data;
};

export const getCarById = async (id: number): Promise<Car> => {
  const response = await api.get<Car>(`/cars${id}`);
  return response.data;
};