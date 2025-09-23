// frontend/src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  is_active: boolean; // ✅ ¡AÑADIDO! El backend lo envía siempre
  created_at: string;
  updated_at?: string;           // ✅ Opcional, si lo usas
  avatar_url?: string | null; 
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  description?: string;
  image_url: string[];
  specifications?: Record<string, any>;
  fuel_type?: string;
  mileage?: number;
  color?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  deleted_at: string | null;
  engine?: string;
  horsepower?: number;
  top_speed?: number;
  transmission?: string;
  drive_train?: string;
  weight?: string;
  production_years?: string;
}

export interface Accessory {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  deleted_at: string | null;
}

export interface Consultation {
  id: number;
  user_id: number;
  advisor_id: number | null;
  subject: string;
  message: string;
  status: 'pending' | 'responded';
  answered_at: string | null;
  created_at: string;
  updated_at: string;
  is_read?: boolean; // ✅ ¡AÑADIDO! Para las notificaciones
  advisor?: User;    // ✅ ¡AÑADIDO! Para mostrar quién respondió
  user?: User;  
}

export interface UserCarGalleryItem {
  id: number;
  user_id: number;
  car_name: string;
  description?: string;
  image_url: string;
  likes: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_vehicle: boolean;
  brand?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  mileage?: number;
  engine_spec?: string;
  horsepower?: number;
  top_speed_kmh?: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  accessory_id: number;
  quantity: number;
  added_at: string;
  accessory: Accessory;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  msg: string;
}

export type Nullable<T> = T | null;


export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}