// frontend/src/pages/AdvisorPanel.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AdvisorPanel = () => {
  const { user, logout } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 2) {
      navigate('/login');
      return;
    }

    const fetchConsultations = async () => {
      try {
        const response = await api.get('/api/consultations');
        setConsultations(response.data.filter(c => c.advisor_id === user.id));
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-text">Panel de Asesor</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-light text-white mb-8">Consultas Asignadas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.length > 0 ? (
            consultations.map(consult => (
              <div key={consult.id} className="bg-dark-light rounded-xl shadow-card border border-border p-6">
                <h3 className="text-xl font-bold text-text mb-2">{consult.subject}</h3>
                <p className="text-text-secondary mb-4">{consult.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">
                    De: {consult.user_id}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    Pendiente
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">Aún no tienes consultas asignadas.</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/consultation" className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Nueva Consulta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPanel;