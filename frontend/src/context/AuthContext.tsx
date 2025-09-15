// frontend/src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginResponse, register as registerApi, login as loginApi } from '../services/authApi';
import { getCurrentUser, User } from '../services/userApi';
import { useNavigate } from 'react-router-dom';

// 👇 1. Define el tipo del contexto (se usa aquí, así que NO aparece como unused)
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 👇 2. CREA Y EXPORTA EL CONTEXTO (¡ESTO ES LO MÁS IMPORTANTE!)
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
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(res => {
          setUser(res);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data: LoginResponse = await loginApi(email, password); // ✅ Tipo explícito
      localStorage.setItem('token', data.access_token);
      setUser(data.user); // ✅ Ahora TypeScript sabe que data.user es de tipo User
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await registerApi(username, email, password);
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

// 👇 4. EXPORTA EL HOOK QUE USA EL CONTEXTO (¡ESTE ES EL "useAuth"!)
export const useAuth = () => {
  const context = useContext(AuthContext); // ✅ ¡Ahora AuthContext está definido y exportado!
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};