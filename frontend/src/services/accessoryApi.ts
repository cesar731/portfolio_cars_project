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

// Obtener todos los accesorios
export const getAccessories = async (): Promise<Accessory[]> => {
  const response = await api.get<Accessory[]>('/accessories');
  return response.data;
};

// Obtener accesorio por ID
export const getAccessoryById = async (id: number): Promise<Accessory> => {
  const response = await api.get<Accessory>(`/accessories/${id}`);
  return response.data;
};

// ✅ Actualizar accesorio por ID
export const updateAccessoryById = async (
  id: number,
  data: Partial<Accessory>
): Promise<Accessory> => {
  const response = await api.put<Accessory>(`/accessories/${id}`, data);
  return response.data;
};

// ✅ Eliminar accesorio por ID
export const deleteAccessoryById = async (id: number): Promise<void> => {
  await api.delete(`/accessories/${id}`);
};
