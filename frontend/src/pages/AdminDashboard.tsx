// frontend/src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 1) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar cada recurso individualmente para evitar que uno falle y bloquee todo
        const loadUsers = api.get('/users').then(res => setUsers(res.data)).catch(err => console.error('Users:', err));
        const loadCars = api.get('/cars').then(res => setCars(res.data)).catch(err => console.error('Cars:', err));
        const loadAccessories = api.get('/accessories').then(res => setAccessories(res.data)).catch(err => console.error('Accessories:', err));
        

        await Promise.allSettled([loadUsers, loadCars, loadAccessories]);
      } catch (error) {
        toast.error('Error al cargar los datos del panel.');
        console.error('Error general:', error);
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
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-text">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Acciones Rápidas</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/cars/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              ➕ Crear Auto
            </Link>
            <Link
              to="/accessories/new"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              ➕ Crear Accesorio
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-light p-4 rounded-lg border border-border">
            <p className="text-text-secondary">Usuarios</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-dark-light p-4 rounded-lg border border-border">
            <p className="text-text-secondary">Autos Publicados</p>
            <p className="text-2xl font-bold text-white">{cars.filter(c => c.is_published).length}</p>
          </div>
          <div className="bg-dark-light p-4 rounded-lg border border-border">
            <p className="text-text-secondary">Accesorios Disponibles</p>
            <p className="text-2xl font-bold text-white">{accessories.filter(a => a.is_published && a.stock > 0).length}</p>
          </div>
        </div>

        {/* Secciones detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Autos */}
          <div className="bg-dark-light p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Autos ({cars.length})</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cars.slice(0, 5).map(car => (
                <div key={car.id} className="flex justify-between items-center p-3 bg-dark/50 rounded">
                  <div>
                    <p className="font-medium">{car.brand} {car.model}</p>
                    <p className="text-sm text-text-secondary">${car.price.toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/cars/edit/${car.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
            {cars.length > 5 && (
              <Link to="/cars" className="mt-3 inline-block text-primary text-sm">Ver todos</Link>
            )}
          </div>

          {/* Accesorios */}
          <div className="bg-dark-light p-6 rounded-xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Accesorios ({accessories.length})</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {accessories.slice(0, 5).map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-3 bg-dark/50 rounded">
                  <div>
                    <p className="font-medium">{acc.name}</p>
                    <p className="text-sm text-text-secondary">${acc.price.toLocaleString()} • {acc.category}</p>
                  </div>
                  <Link
                    to={`/accessories/edit/${acc.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
            {accessories.length > 5 && (
              <Link to="/accessories" className="mt-3 inline-block text-primary text-sm">Ver todos</Link>
            )}
          </div>

          

          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;