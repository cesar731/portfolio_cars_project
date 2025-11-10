// frontend/src/pages/MyConsultations.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Consultation } from '../types';

const MyConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      try {
        const response = await api.get<Consultation[]>('/consultations');
        const userConsultations = response.data.filter(c => c.user_id === user.id);
        setConsultations(userConsultations);
      } catch (error) {
        console.error('Error al cargar consultas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando tus consultas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-3xl font-light text-white mb-8">Mis Consultas</h1>
      {consultations.length === 0 ? (
        <p className="text-text-secondary">No has enviado ninguna consulta aún.</p>
      ) : (
        <div className="space-y-6">
          {consultations.map((consult) => (
            <div
              key={consult.id}
              className="bg-dark-light p-6 rounded-xl border border-border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-text">
                    {consult.subject || 'Sin asunto'}
                  </h2>
                  <p className="text-text-secondary mt-2">{consult.message}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    consult.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {consult.status === 'pending' ? 'Pendiente' : 'Respondida'}
                </span>
              </div>

              <div className="text-sm text-text-secondary mb-4">
                <p>Enviado: {new Date(consult.created_at).toLocaleString()}</p>
                {consult.answered_at && (
                  <p>Respondido: {new Date(consult.answered_at).toLocaleString()}</p>
                )}
              </div>

              {/* ✅ Mostrar botón de chat SOLO si está respondida */}
              {consult.status === 'responded' && consult.advisor_id && (
                <Link
                  to={`/chat/${consult.id}`}
                  className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  💬 Abrir Chat
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyConsultations;