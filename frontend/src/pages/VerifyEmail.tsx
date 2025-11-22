// frontend/src/pages/VerifyEmail.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState<string | null>(null); // ✅ Estado para el email
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Extraer y establecer el email desde la URL al cargar
  useEffect(() => {
    const emailFromUrl = new URLSearchParams(location.search).get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      toast.error("No se encontró el correo en el enlace.");
      navigate("/login");
    }
  }, [location, navigate]);

  // Temporizador
  useEffect(() => {
    let timer: number | null = null;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  // ✅ Validación correcta: solo necesita email (de la URL) y código de 6 dígitos
  const isFormValid = email !== null && code.length === 6;

  const handleResendCode = async () => {
    if (!email) return;
    if (resendDisabled) return;

    setResendDisabled(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Código reenviado a tu correo.");
      setTimeLeft(60);
    } catch (err: any) {
      const message = err.response?.data?.detail || "Error al reenviar el código.";
      toast.error(message);
      setResendDisabled(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Por favor, ingresa el código de 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-email", {
        email,
        code: parseInt(code, 10),
      });
      toast.success("¡Correo verificado con éxito!");
      navigate("/login");
    } catch (err: any) {
      const message = err.response?.data?.detail || "Error al verificar el correo.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Mientras se carga el email de la URL
  if (email === null) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-dark-light p-10 rounded-2xl shadow-2xl border border-border relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors"
        >
          ×
        </button>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Verificar Correo</h1>
        <p className="text-center text-text-secondary mb-6">
          Para el correo: <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-2">Código de 6 dígitos</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123456"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled}
              className={`text-primary hover:text-primary/80 font-medium ${
                resendDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {resendDisabled ? `Reenviar código (${timeLeft}s)` : 'Reenviar código'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid} // ✅ Se deshabilita correctamente
            className="w-full py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar Correo'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;