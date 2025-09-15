// frontend/src/pages/Login.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.detail === "Credenciales inválidas o cuenta no activada.") {
        setError('Credenciales inválidas o cuenta no activada.');
      } else {
        setError('Error al iniciar sesión. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-dark-light p-10 rounded-2xl shadow-2xl border border-border">
        <button className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors">×</button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Iniciar Sesión</h1>
        <p className="text-center text-text-secondary mb-8">Bienvenido de vuelta. Por favor ingresa tus credenciales.</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-secondary">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              Regístrate
            </Link>
          </p>
          <p className="mt-2">
            <a href="#" className="text-primary hover:text-primary/80 font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;