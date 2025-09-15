// frontend/src/types/index.ts

// ================================
// AUTENTICACIÓN
// ================================

export interface User {
  id: number;
  username: string;
  email: string;
  role_id: 1 | 2 | 3; // 1=admin, 2=advisor, 3=user
  is_active: boolean;
}

// ================================
// CARS (AUTOS)
// ================================

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
}

// ================================
// ACCESSORIES (ACCESORIOS)
// ================================

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

// ================================
// USER CAR GALLERY (GALERÍA SOCIAL)
// ================================

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

// ================================
// CONSULTATIONS (ASESORÍAS)
// ================================

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
}

// ================================
// CART ITEMS (CARRITO DE COMPRAS)
// ================================

export interface CartItem {
  id: number;
  user_id: number;
  accessory_id: number;
  quantity: number;
  added_at: string;
}

// ================================
// AUTH RESPONSES (RESPUESTAS DE API)
// ================================

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  msg: string;
}

// ================================
// UTILS
// ================================

export type Nullable<T> = T | null;