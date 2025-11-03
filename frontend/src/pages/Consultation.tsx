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
  const location = useLocation();

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

    if (!user) {
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
    <div className="min-h-screen bg-dark text-text flex flex-col justify-center">
      {/* Hero Section más compacta */}
      <section className="relative h-[30vh] flex flex-col items-center justify-center text-center overflow-hidden mb-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('../public/images/consult_banner.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
            Solicitar Asesoría
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-xl mx-auto leading-snug">
            ¿Tienes dudas sobre qué auto o accesorio elegir? Nuestro equipo de expertos está listo para ayudarte.
          </p>
        </div>
      </section>

      {/* Formulario con menos espacio */}
      <div className="container mx-auto px-4 pb-8 max-w-md">
        {error && (
          <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm text-center shadow-md">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-dark-lighter p-5 rounded-xl shadow-md border border-border backdrop-blur-md space-y-4"
        >
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-text mb-1.5"
            >
              Asunto *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: ¿Cuál es el mejor auto para uso diario?"
              className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-text mb-1.5"
            >
              Mensaje *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tus necesidades, preferencias y presupuesto..."
              rows={4}
              className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
