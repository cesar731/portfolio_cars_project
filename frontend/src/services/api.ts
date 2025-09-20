// frontend/src/services/api.ts

import axios from 'axios';

// ✅ Configura la instancia de Axios con la URL del backend
const api = axios.create({
  baseURL: '/', // ✅ ¡Correcto! Apunta al backend
  withCredentials: true,           // ✅ Permite enviar cookies (esencial para JWT)
});

// ✅ Añade un interceptor para incluir el token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ ¡EXPORTA COMO DEFAULT — NUNCA uses "export const api"!
export default api;