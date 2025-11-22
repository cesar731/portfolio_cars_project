// frontend/src/types.ts
export interface AccessoryImage {
  id: number;
  image_url: string; // path relativo que backend devuelve, p.ej. "/uploads/accessories/acc_xxx.jpg"
}

export interface Accessory {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  is_published: boolean;

  // Para compatibilidad con accesorios antiguos
  image_url?: string;

  // Para multi-imágenes nuevas
  images?: AccessoryImage[];
}
