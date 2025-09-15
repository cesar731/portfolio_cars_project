// frontend/src/services/api.ts

import axios from 'axios';

// ✅ CREA Y EXPORTA LA INSTANCIA COMO "api"
export const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Asegúrate de que sea la URL correcta
  withCredentials: true, // Si usas cookies/sesiones
});

// Opcional: Agregar interceptor si necesitas manejar tokens
 api.interceptors.request.use((config) => {   const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
   return config;
});

export default api;