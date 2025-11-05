// frontend/src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserProfile, deactivateAccount } from '../services/userApi';
import { toast } from 'react-hot-toast';
import { User } from '../types';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setAvatarUrl(userData.avatar_url || '');
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Solo cerrar sesión si el token es inválido
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
          logout();
          navigate('/login');
        } else {
          toast.error('Error al cargar tu perfil.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, navigate]);

  const handleSave = async () => {
    try {
      await updateUserProfile({ ...user, avatar_url: avatarUrl });
      toast.success('Perfil actualizado con éxito.');
      setEditing(false);
    } catch (err) {
      toast.error('No se pudo actualizar el perfil.');
      console.error(err);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('¿Estás seguro de desactivar tu cuenta? Esta acción no se puede deshacer.')) return;
    try {
      await deactivateAccount();
      toast.success('Cuenta desactivada correctamente.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error('No se pudo desactivar la cuenta.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Mi Perfil</h1>
      <div className="max-w-2xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarUrl || 'https://via.placeholder.com/100?text=Avatar'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary"
          />
          {editing && (
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="URL del avatar"
              className="w-full px-3 py-2 bg-dark border border-border rounded text-text text-sm"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-1">Usuario</label>
            {editing ? (
              <input
                type="text"
                value={user.username || ''}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
              />
            ) : (
              <p className="text-white">{user.username}</p>
            )}
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Email</label>
            {editing ? (
              <input
                type="email"
                value={user.email || ''}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
              />
            ) : (
              <p className="text-white">{user.email}</p>
            )}
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Rol</label>
            <p className="text-white">
              {user.role_id === 1 ? 'Administrador' : user.role_id === 2 ? 'Asesor' : 'Usuario'}
            </p>
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Estado</label>
            <p className={`font-medium ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
              {user.is_active ? 'Activo' : 'Inactivo'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-text rounded font-medium hover:bg-primary/90"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-700 text-text rounded font-medium"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-primary text-text rounded font-medium hover:bg-primary/90"
            >
              Editar Perfil
            </button>
          )}
          <button
            onClick={handleDeactivate}
            className="px-6 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600"
          >
            Desactivar Cuenta
          </button>
        </div>

        {/* Sección de publicaciones del usuario */}
        <div className="mt-12 pt-6 border-t border-border">
          <h2 className="text-2xl font-bold text-text mb-4">Mis Publicaciones</h2>
          <Link
            to="/gallery"
            className="inline-block text-primary hover:text-primary/80"
          >
            Ver mis publicaciones en la galería →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;