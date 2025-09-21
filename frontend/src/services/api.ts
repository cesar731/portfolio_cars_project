// frontend/src/services/api.ts

import axios from 'axios';

// ✅ Detecta si estamos en producción o desarrollo
const baseURL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL || 'https://tu-backend-en-produccion.com/api'
    : 'http://localhost:8000/api';

// ✅ Configura la instancia de Axios
const api = axios.create({
  baseURL,
  withCredentials: true, // ✅ Permite enviar cookies (ej: JWT)
});

// ✅ Interceptor para incluir token JWT en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Exporta como default
export default api;
