// frontend/src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function ResetPassword() {
  // ✅ El email se extrae de la URL y es de solo lectura
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 0 = botón habilitado

  const navigate = useNavigate();
  const location = useLocation();

  // Extraer el email de la URL al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      // Si no hay email en la URL, redirigir al login
      toast.error("No se encontró el correo en el enlace.");
      navigate("/login");
    }
  }, [location, navigate]);

  // Temporizador de 60 segundos
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

  const handleResendCode = async () => {
    if (!email) return; // Ya debería estar validado, pero por seguridad
    if (resendDisabled) return;

    setResendDisabled(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Código reenviado a tu correo.");
      setTimeLeft(60); // Iniciar temporizador
    } catch (err: any) {
      const message = err.response?.data?.detail || "Error al reenviar el código.";
      toast.error(message);
      setResendDisabled(false); // Re-habilitar si falla
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Correo no válido.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!code || code.length !== 6 || isNaN(Number(code))) {
      toast.error("Ingresa un código válido de 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        code: parseInt(code, 10),
        new_password: password,
      });

      toast.success("¡Contraseña actualizada! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error al restablecer la contraseña.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mientras se carga el email de la URL, no renderizar nada
  if (email === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <p className="text-gray-400">Verificando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 bg-dark-light rounded-xl border border-border">
        <h2 className="text-2xl font-bold text-text text-center mb-6">Restablecer contraseña</h2>
        <p className="text-text-secondary text-center mb-6">
          Para el correo: <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {/* ✅ El campo de email ya NO es un input editable */}
          {/* CODE */}
          <div className="mb-4">
            <label className="block text-text mb-2">Código de 6 dígitos</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123456"
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-4 relative">
            <label className="block text-text mb-2">Nueva contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M10.58 10.58a3 3 0 004.24 4.24" />
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
          <div className="mb-6 relative">
            <label className="block text-text mb-2">Confirmar contraseña</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 "
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

          {/* ✅ BOTÓN DE REENVIAR CÓDIGO */}
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
            disabled={loading}
            className="w-full py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </button>
        </form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 text-primary hover:text-primary/80 text-sm w-full text-center"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}