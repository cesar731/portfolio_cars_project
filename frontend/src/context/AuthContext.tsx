// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginResponse, register as registerApi, login as loginApi } from '../services/authApi';
import { getCurrentUser, User } from '../services/userApi';
import { useNavigate } from 'react-router-dom';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

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
            is_active: userData.is_active ?? true,
          });
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await loginApi(email, password);
      localStorage.setItem('token', response.access_token);

      setUser({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role_id: response.user.role_id,
        is_active: response.user.is_active ?? true,
      });

      console.log('Usuario logueado:', response.user); // ✅ CORREGIDO: response.user, no data.user

      if (response.user.role_id === 1) {
        navigate('/admin');
      } else if (response.user.role_id === 2) {
        navigate('/advisor');
      } else {
        navigate('/');
      }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};