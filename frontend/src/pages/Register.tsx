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
      navigate('/login');
    } catch {
      toast.error('Error al registrar. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center px-4">
      <div className="bg-dark-light rounded-xl shadow-card border border-border p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4 text-center">Crear Cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-text-secondary mb-1 text-sm">Confirmar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

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
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Términos y Condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Política de Privacidad
              </a>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

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
