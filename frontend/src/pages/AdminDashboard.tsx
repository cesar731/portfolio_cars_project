// frontend/src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import  api  from '../services/api';
import { Car, Accessory, User, Consultation } from '../types';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 1) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, carsRes, accessoriesRes, consultationsRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/cars'),
          api.get('/api/accessories'),
          api.get('/api/consultations')
        ]);
        setUsers(usersRes.data);
        setCars(carsRes.data);
        setAccessories(accessoriesRes.data);
        setConsultations(consultationsRes.data); 
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <p className="text-text-secondary">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-text">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6 text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">{users.length}</h2>
            <p className="text-text-secondary">Usuarios Registrados</p>
          </div>
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6 text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">{cars.filter(c => c.is_published).length}</h2>
            <p className="text-text-secondary">Autos Publicados</p>
          </div>
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6 text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">{accessories.filter(a => a.is_published).length}</h2>
            <p className="text-text-secondary">Accesorios Publicados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usuarios */}
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6">
            <h2 className="text-2xl font-bold text-text mb-6">Usuarios</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-dark/50 rounded-lg">
                  <div>
                    <p className="font-medium text-text">{user.username}</p>
                    <p className="text-text-secondary text-sm">{user.email}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      user.role_id === 1 ? 'bg-red-500/20 text-red-400' :
                      user.role_id === 2 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Asesor' : 'Usuario'}
                    </span>
                  </div>
                  <span className="text-text-secondary text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Autos */}
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6">
            <h2 className="text-2xl font-bold text-text mb-6">Autos</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cars.slice(0, 5).map(car => (
                <div key={car.id} className="flex items-center justify-between p-3 bg-dark/50 rounded-lg">
                  <div>
                    <p className="font-medium text-text">{car.brand} {car.model}</p>
                    <p className="text-text-secondary text-sm">{car.year} - ${car.price.toLocaleString()}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    car.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {car.is_published ? 'Publicado' : 'No publicado'}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/cars" className="block mt-4 text-primary hover:text-primary/80 text-sm font-medium">
              Ver todos los autos →
            </Link>
          </div>

          {/* Accesorios */}
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6">
            <h2 className="text-2xl font-bold text-text mb-6">Accesorios</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {accessories.slice(0, 5).map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-3 bg-dark/50 rounded-lg">
                  <div>
                    <p className="font-medium text-text">{acc.name}</p>
                    <p className="text-text-secondary text-sm">{acc.category} - ${acc.price.toLocaleString()}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    acc.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {acc.is_published ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/accessories" className="block mt-4 text-primary hover:text-primary/80 text-sm font-medium">
              Ver todos los accesorios →
            </Link>
          </div>

          {/* Consultas */}
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-6">
            <h2 className="text-2xl font-bold text-text mb-6">Consultas Pendientes</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {consultations.filter(c => c.status === 'pending').slice(0, 5).map(consult => (
                <div key={consult.id} className="flex items-center justify-between p-3 bg-dark/50 rounded-lg">
                  <div>
                    <p className="font-medium text-text">{consult.subject}</p>
                    <p className="text-text-secondary text-sm">De: {consult.user_id}</p>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                    Pendiente
                  </span>
                </div>
              ))}
            </div>
            <Link to="/consultations" className="block mt-4 text-primary hover:text-primary/80 text-sm font-medium">
              Ver todas las consultas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;