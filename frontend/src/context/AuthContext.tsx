// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { LoginResponse, register as registerApi, login as loginApi } from '../services/authApi';
import { getCurrentUser, User } from '../services/userApi';
import { useNavigate } from 'react-router-dom';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  comparedCars: number[];
  addToComparison: (carId: number) => void;
  removeFromComparison: (carId: number) => void;
  clearComparison: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  comparedCars: [],
  addToComparison: () => {},
  removeFromComparison: () => {},
  clearComparison: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparedCars, setComparedCars] = useState<number[]>([]);
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

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`comparedCars_${user.id}`);
      setComparedCars(saved ? JSON.parse(saved) : []);
    } else {
      setComparedCars([]);
    }
  }, [user]);

  const saveComparison = (cars: number[]) => {
    if (user) {
      localStorage.setItem(`comparedCars_${user.id}`, JSON.stringify(cars));
    }
  };

  const addToComparison = (carId: number) => {
    setComparedCars(prev => {
      const newCars = prev.includes(carId) ? prev : [...prev, carId].slice(0, 3);
      saveComparison(newCars);
      return newCars;
    });
  };

  const removeFromComparison = (carId: number) => {
    setComparedCars(prev => {
      const newCars = prev.filter(id => id !== carId);
      saveComparison(newCars);
      return newCars;
    });
  };

  const clearComparison = () => {
    setComparedCars([]);
    if (user) {
      localStorage.removeItem(`comparedCars_${user.id}`);
    }
  };

  const handleLogin = async (email: string, password: string, redirectTo?: string) => {
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

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (response.user.role_id === 1) {
        navigate('/admin', { replace: true });
      } else if (response.user.role_id === 2) {
        navigate('/advisor', { replace: true });
      } else {
        navigate('/', { replace: true });
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
    clearComparison();
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
    comparedCars,
    addToComparison,
    removeFromComparison,
    clearComparison,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};