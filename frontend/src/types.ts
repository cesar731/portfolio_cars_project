// ======================
// USERS
// ======================
export interface User {
  id: number;
  username?: string;
  name?: string;
  email: string;
  role_id?: number;
  is_active?: boolean;
  avatar_url?: string;
}

// ======================
// CARS
// ======================
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;

  price?: number;
  fuel_type?: string;
  mileage?: number;
  color?: string;
  engine?: string;
  horsepower?: number;
  top_speed?: number;
  transmission?: string;
  drive_train?: string;
  weight?: string;
  production_years?: string;

  image_url?: string[];   // 👈 frontend usa array
  is_published?: boolean;
  description?: string;
}

// ======================
// CONSULTATIONS
// ======================
export interface Consultation {
  id: number;
  user_id: number;
  advisor_id?: number;

  subject?: string;
  message: string;

  status?: 'pending' | 'responded';
  answered_at?: string;

  created_at: string;

  user?: User; // 👈 frontend lo usa
}

// ======================
// CART
// ======================
export interface CartItem {
  id: number;
  accessory_id: number;
  quantity: number;

  accessory?: Accessory; // 👈 FIX CRÍTICO
}

// ======================
// ACCESSORIES
// ======================
export interface AccessoryImage {
  id: number;
  image_url: string;
}

export interface Accessory {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  is_published: boolean;

  image_url?: string;
  images?: AccessoryImage[];
}

// ======================
// USER GALLERY
// ======================
export interface UserCarGalleryItem {
  id: number;
  user_id?: number;

  car_name?: string;
  image_url: string;

  created_at?: string;

  is_vehicle?: boolean;
  brand?: string;
  model?: string;
  year?: number;

  user?: User;
}
