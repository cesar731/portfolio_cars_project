// frontend/src/pages/VerifyCode.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verifyEmail } from '../services/authApi'; // ✅ función correcta

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("El código debe tener 6 dígitos.");
      return;
    }
    setLoading(true);
    try {
      // ✅ AHORA SÍ usamos la función correcta
      await verifyEmail(email, parseInt(code, 10));
      toast.success("¡Correo verificado! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Código inválido o expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 bg-dark-light rounded-xl border border-border">
        <h2 className="text-2xl font-bold text-text text-center mb-6">Verificar correo</h2>
        <p className="text-text-secondary text-center mb-6">
          Revisa tu correo y escribe el código de 6 dígitos que te enviamos.
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
          <div className="mb-6">
            <label className="block text-text mb-2">Código de 6 dígitos</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar código"}
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