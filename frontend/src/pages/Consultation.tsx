// frontend/src/pages/Consultation.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Consultation = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Para recordar la ruta actual

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim()) {
      setError('El asunto es obligatorio.');
      return;
    }
    if (!message.trim()) {
      setError('El mensaje es obligatorio.');
      return;
    }

    // ✅ Si no está autenticado, redirigir al login y guardar la ruta actual
    if (!user) {
      // Guardar la ruta actual en el estado de navegación
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    try {
      await api.post('/consultations', {
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success('Consulta enviada con éxito. Nos pondremos en contacto contigo pronto.');
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Error al enviar la consulta. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl font-light text-white mb-8">Solicitar Asesoría</h1>
        <p className="text-text-secondary text-lg mb-12">
          ¿Tienes dudas sobre qué auto o accesorio elegir? Nuestro equipo de expertos está listo para ayudarte.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
              Asunto *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: ¿Cuál es el mejor auto para uso diario?"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
              Mensaje *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tus necesidades, preferencias y presupuesto..."
              rows={6}
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-text font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation;