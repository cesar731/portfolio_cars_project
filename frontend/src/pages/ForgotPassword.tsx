// frontend/src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("¡Código enviado! Revisa tu correo.");
      // ✅ Redirige directamente a la página de restablecimiento con el email
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error("Error al solicitar restablecimiento.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 bg-dark-light rounded-xl border border-border">
        <h2 className="text-2xl font-bold text-text text-center mb-6">¿Olvidaste tu contraseña?</h2>
        <p className="text-text-secondary text-center mb-6">
          Ingresa tu email y te enviaremos un código de 6 dígitos.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-primary hover:text-primary/80 text-sm w-full text-center"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}