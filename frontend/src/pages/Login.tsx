// frontend/src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ useLocation
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Capturar la ubicación actual

  // Obtener la ruta de redirección (por defecto '/')
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    let timer: number | null = null;
    if (isLocked && lockTimeLeft > 0) {
      timer = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, lockTimeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error(`Intenta de nuevo en ${lockTimeLeft} segundos.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      // ✅ ¡PASAR `from` al método login!
      await login(email, password, from);
      setFailedAttempts(0);
      // No necesitas navegar aquí, ya lo hace `login()`
    } catch (err: any) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        setIsLocked(true);
        setLockTimeLeft(15);
        setError('Demasiados intentos fallidos. Inténtalo de nuevo en 15 segundos.');
        toast.error('Cuenta bloqueada temporalmente por 15 segundos.');
      } else {
        if (err.response?.data?.detail === "Credenciales inválidas.") {
          setError('Credenciales inválidas.');
        } else {
          setError('Error al iniciar sesión. Inténtalo nuevamente.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-dark-light p-10 rounded-2xl shadow-2xl border border-border">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors"
        >
          ×
        </button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Iniciar Sesión</h1>
        <p className="text-center text-text-secondary mb-8">
          Bienvenido de vuelta. Por favor ingresa tus credenciales.
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isLocked && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm text-center">
              <p>🔒 Demasiados intentos fallidos.</p>
              <p>
                Intenta de nuevo en <span className="font-bold">{lockTimeLeft}</span> segundos.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLocked}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isLocked}
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : isLocked ? `Espera ${lockTimeLeft}s` : 'Iniciar Sesión'}
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