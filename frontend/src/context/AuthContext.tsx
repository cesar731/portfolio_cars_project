// frontend/src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginResponse, register as registerApi, login as loginApi } from '../services/authApi';
import { getCurrentUser, User } from '../services/userApi';
import { useNavigate } from 'react-router-dom';

// 👇 1. Define el tipo del contexto
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 👇 2. CREA Y EXPORTA EL CONTEXTO
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// 👇 3. CREA EL PROVEEDOR
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role_id: userData.role_id,
            is_active: userData.is_active ?? true, // ✅ Asigna true si no viene
          });
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token'); // Si falla, borra el token
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data: LoginResponse = await loginApi(email, password);

      // ✅ GUARDA EL TOKEN EN localStorage
      localStorage.setItem('token', data.access_token);

      // ✅ GUARDA EL USUARIO EN EL ESTADO
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role_id: data.user.role_id,
        is_active: data.user.is_active ?? true, // ✅ Asigna true si no viene
      });
        console.log('Usuario logueado:', data.user); // 👈 ¡AÑADE ESTO!
      // ✅ REDIRIGE SEGÚN EL ROL
      if (data.user.role_id === 1) {
        navigate('/admin');   // Admin → Panel de Administración
      } else if (data.user.role_id === 2) {
        navigate('/advisor'); // Asesor → Panel de Asesor
      } else {
        navigate('/');        // Usuario normal → Home
      }
    } catch (error) {
      throw error;
    }
  };

  // ✅ ¡ESTA FUNCIÓN FALTABA! — Ahora está definida
  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await registerApi(username, email, password); // ✅ ¡AHORA SE USA!
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { user, loading, login: handleLogin, register: handleRegister, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 👇 4. EXPORTA EL HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};