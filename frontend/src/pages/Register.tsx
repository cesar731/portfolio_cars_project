// frontend/src/pages/Register.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authApi';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Debes aceptar los Términos y Condiciones y la Política de Privacidad.');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.detail;

      if (status === 202 && message === "Reenviado código de verificación") {
        toast.success('Se envió nuevamente el código a tu correo.');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (status === 400 && message === "El email ya está registrado") {
        toast.error('Este correo ya tiene una cuenta activa.');
      } else {
        toast.error('Error al registrarse.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center px-4">
      <div className="bg-dark-light rounded-xl shadow-card border border-border p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4 text-center">Crear Cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* USERNAME */}
          <div>
            <label className="block text-text-secondary mb-1 text-sm">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Elige un nombre único"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-text-secondary mb-1 text-sm">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="tu@email.com"
            />
          </div>

          {/* PASSWORDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-text-secondary mb-1 text-sm">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-10"
                placeholder="Mínimo 8 caracteres"
              />

              {/* ICONO CENTRADO */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 inset-y-10 flex items-center"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a3 3 0 004.24 4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.68 16.68C15.27 17.53 13.68 18 12 18c-5 0-9-4-10-6 1-2 3-4 5.6-5.4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7" />
                  </svg>
                )}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <label className="block text-text-secondary mb-1 text-sm">Confirmar</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-10"
                placeholder="Repite la contraseña"
              />

              {/* ICONO CENTRADO */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 inset-y-10 flex items-center"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M10.58 10.58a3 3 0 004.24 4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.68 16.68C15.27 17.53 13.68 18 12 18c-5 0-9-4-10-6 1-2 3-4 5.6-5.4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start mt-2">
            <input
              type="checkbox"
              id="privacy"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              className="mt-0.5 mr-2 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="privacy" className="text-xs text-text-secondary leading-snug">
              Acepto los{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline">
                Términos y Condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline">
                Política de Privacidad
              </a>.
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-text-secondary mt-4 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
