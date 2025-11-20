// frontend/src/services/authApi.ts
import api from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    role_id: number;
    is_active: boolean;
  };
}

export interface RegisterResponse {
  msg?: string;
}

// Enviar login como form-urlencoded con username=email
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post<LoginResponse>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

// Registrar un nuevo usuario
export const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', { username, email, password });
  return response.data;
};

// ✅ Verificar el código de verificación de CORREO (usado tras el registro)
export const verifyEmail = async (email: string, code: number) => {
  const response = await api.post('/auth/verify-email', { email, code });
  return response.data;
};

// ❗️ Solo para restablecer contraseña (NO usar en verificación de correo)
export const verifyPasswordResetCode = async (email: string, code: number) => {
  const response = await api.post('/auth/verify-reset-code', { email, code });
  return response.data;
};

// Restablecer contraseña (después de verificar el código)
export const resetPassword = async (email: string, code: number, new_password: string) => {
  const response = await api.post('/auth/reset-password', { email, code, new_password });
  return response.data;
};

// Solicitar código de restablecimiento de contraseña
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};