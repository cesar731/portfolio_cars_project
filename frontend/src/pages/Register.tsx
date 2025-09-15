import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones locales
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio.');
      return;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!formData.password) {
      setError('La contraseña es obligatoria.');
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      );
      // Registro exitoso → redirigir a login
      navigate('/login', { replace: true });
    } catch (err: any) {
      // Manejar errores del backend
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.status === 409) {
        setError('El email o nombre de usuario ya están registrados.');
      } else {
        setError('Error al registrar. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-dark-light p-10 rounded-2xl shadow-2xl border border-border">
        <button className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors">×</button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Crear Cuenta</h1>
        <p className="text-center text-text-secondary mb-8">Regístrate para acceder al catálogo y servicios exclusivos.</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Nombre de Usuario *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="juanperez"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
            <p className="mt-1 text-xs text-text-secondary">
              Mínimo 8 caracteres
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;