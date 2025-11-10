// frontend/src/pages/MyConsultations.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface Consultation {
  id: number;
  subject: string | null;
  message: string;
  status: string;
  answered_at: string | null;
  advisor_id: number | null;
  advisor: { id: number; username: string } | null;
  user_id: number;
  created_at: string;
}

const MyConsultations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchConsultations = async () => {
      try {
        const res = await api.get('/consultations');
        const userConsultations = res.data.filter((c: any) => c.user_id === user.id);
        setConsultations(userConsultations);
      } catch (err) {
        toast.error('Error al cargar tus consultas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
    const interval = setInterval(fetchConsultations, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando tus consultas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-3xl font-light mb-8">Mis Solicitudes de Asesoría</h1>
      {consultations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No has enviado ninguna solicitud aún.</p>
          <button
            onClick={() => navigate('/consultation')}
            className="mt-4 px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90"
          >
            📩 Enviar una nueva consulta
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {consultations.map((c) => (
            <div key={c.id} className="bg-dark-light p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{c.subject || 'Sin asunto'}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    c.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {c.status === 'pending' ? 'Pendiente' : 'Respondida'}
                </span>
              </div>
              <p className="text-text-secondary mb-3">{c.message}</p>
              <p className="text-sm text-text-secondary">
                Enviado: {new Date(c.created_at).toLocaleString()}
              </p>
              {c.status === 'responded' && c.advisor && (
                <>
                  <p className="text-sm text-green-400 mt-2">
                    Respondido por: {c.advisor.username}
                  </p>
                  {/* ✅ Ruta corregida: solo consultationId */}
                  <button
                    onClick={() => navigate(`/chat/${c.id}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    💬 Abrir Chat
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyConsultations;