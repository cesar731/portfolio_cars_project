// frontend/src/pages/AdvisorPanel.tsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Consultation } from '../types';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdvisorPanel = () => {
  const { user, logout } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // ✅ nuevo estado para búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 2) {
      navigate('/login');
      return;
    }

    const fetchConsultations = async () => {
      try {
        const response = await api.get<Consultation[]>('/consultations');
        const assigned = response.data.filter((c) => c.advisor_id === user.id);
        setConsultations(assigned);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        toast.error('Error al cargar tus consultas.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user, navigate]);

  // ✅ Filtro reactivo con useMemo
  const filteredConsultations = useMemo(() => {
    if (!searchTerm.trim()) return consultations;
    const term = searchTerm.toLowerCase();
    return consultations.filter((consult) => {
      const matchesSubject = consult.subject?.toLowerCase().includes(term);
      const matchesMessage = consult.message.toLowerCase().includes(term);
      const matchesUsername = consult.user?.username?.toLowerCase().includes(term);
      return matchesSubject || matchesMessage || matchesUsername;
    });
  }, [consultations, searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRespond = async (consultationId: number, message: string) => {
    if (!message.trim()) {
      toast.error('El mensaje de respuesta no puede estar vacío.');
      return;
    }
    try {
      await api.put(`/consultations/${consultationId}/respond`, {
        message,
        status: 'responded',
      });
      toast.success('¡Consulta respondida con éxito!');
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === consultationId
            ? { ...c, status: 'responded', answered_at: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      console.error('Error responding to consultation:', error);
      toast.error('Error al responder la consulta.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando panel de asesor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-text">Panel de Asesor</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>
      <div className="container mx-auto px-6 py-8">
        {/* ✅ Campo de búsqueda */}
        <div className="mb-6">
          <label className="block text-text-secondary mb-2">Buscar en consultas</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Asunto, mensaje o nombre del usuario..."
            className="w-full md:w-96 px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <h2 className="text-3xl font-light text-white mb-6">
          Consultas Asignadas ({filteredConsultations.length})
        </h2>

        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              {searchTerm
                ? 'No se encontraron consultas con ese criterio.'
                : 'No tienes consultas asignadas en este momento.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultations.map((consult) => (
              <div key={consult.id} className="bg-dark-light rounded-xl shadow-card border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text">{consult.subject || 'Sin asunto'}</h3>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      consult.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {consult.status === 'pending' ? 'Pendiente' : 'Respondida'}
                  </span>
                </div>
                <p className="text-text-secondary mb-4">{consult.message}</p>
                <div className="text-sm text-text-secondary mb-4">
                  <p>De: {consult.user?.username || `Usuario ID: ${consult.user_id}`}</p>
                  <p>Enviado: {new Date(consult.created_at).toLocaleString()}</p>
                  {consult.answered_at && (
                    <p>Respondido: {new Date(consult.answered_at).toLocaleString()}</p>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {consult.status === 'pending' && (
                    <>
                      <textarea
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                        rows={3}
                        id={`response-${consult.id}`}
                      />
                      <button
                        onClick={() => {
                          const textarea = document.getElementById(
                            `response-${consult.id}`
                          ) as HTMLTextAreaElement;
                          if (textarea?.value.trim()) {
                            handleRespond(consult.id, textarea.value);
                            textarea.value = '';
                          }
                        }}
                        className="w-full py-2 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Responder
                      </button>
                    </>
                  )}
                  {consult.status === 'responded' && consult.user_id && (
                    <Link
                      to={`/chat/${consult.id}`}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      💬 Abrir Chat con {consult.user?.username || 'Usuario'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorPanel;