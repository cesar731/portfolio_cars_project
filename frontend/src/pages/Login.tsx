// frontend/src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0); // ✅ ¡NUEVO! Contador de intentos fallidos
  const [isLocked, setIsLocked] = useState(false); // ✅ ¡NUEVO! Estado de bloqueo
  const [lockTimeLeft, setLockTimeLeft] = useState(0); // ✅ ¡NUEVO! Tiempo restante de bloqueo

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ ¡NUEVO! Efecto para manejar el temporizador de bloqueo
  // ✅ ¡CORREGIDO! Efecto para manejar el temporizador de bloqueo
useEffect(() => {
  let timer: number | null = null; // <-- ¡CAMBIO CLAVE! NodeJS.Timeout → number
  if (isLocked && lockTimeLeft > 0) {
    timer = setInterval(() => {
      setLockTimeLeft((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setFailedAttempts(0); // Reiniciar intentos al desbloquear
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

    // ✅ ¡NUEVO! Verificar si el formulario está bloqueado
    if (isLocked) {
      toast.error(`Intenta de nuevo en ${lockTimeLeft} segundos.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // ✅ ¡NUEVO! Reiniciar intentos si el login es exitoso
      setFailedAttempts(0);
      navigate('/');
    } catch (err: any) {
      // ✅ ¡NUEVO! Incrementar contador de intentos fallidos
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        // ✅ ¡NUEVO! Bloquear por 15 segundos
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
        <button className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors">×</button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Iniciar Sesión</h1>
        <p className="text-center text-text-secondary mb-8">Bienvenido de vuelta. Por favor ingresa tus credenciales.</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ✅ ¡NUEVO! Mostrar mensaje de bloqueo */}
          {isLocked && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm text-center">
              <p>🔒 Demasiados intentos fallidos.</p>
              <p>Intenta de nuevo en <span className="font-bold">{lockTimeLeft}</span> segundos.</p>
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
              disabled={isLocked} // ✅ ¡NUEVO! Deshabilitar campo si está bloqueado
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
              disabled={isLocked} // ✅ ¡NUEVO! Deshabilitar campo si está bloqueado
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLocked} // ✅ ¡NUEVO! Deshabilitar botón si está bloqueado
            className="w-full py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </span>
            ) : isLocked ? (
              `Espera ${lockTimeLeft}s`
            ) : (
              'Iniciar Sesión'
            )}
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