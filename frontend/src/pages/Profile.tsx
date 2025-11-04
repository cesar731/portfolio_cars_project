// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserCarGalleryItem, Consultation } from '../types';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    avatar_url: '',
  });

  const [galleryItems, setGalleryItems] = useState<UserCarGalleryItem[]>([]);
  const [notifications, setNotifications] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const userRes = await api.get(`/users/me`);
        setUserDetails({
          username: userRes.data.username,
          email: userRes.data.email,
          avatar_url: userRes.data.avatar_url || '',
        });

        const galleryRes = await api.get(`/user-car-gallery`);
        const myItems = galleryRes.data.filter(
          (item: UserCarGalleryItem) => Number(item.user_id) === Number(user.id)
        );
        setGalleryItems(myItems);

        const notificationsRes = await api.get(`/consultations/user/${user.id}/notifications`);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Error al cargar tu perfil o notificaciones');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/me', userDetails);
      toast.success('Perfil actualizado');
      setEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar tu cuenta?')) return;
    try {
      await api.delete('/users/me');
      toast.success('Cuenta eliminada');
      logout();
      navigate('/login');
    } catch {
      toast.error('Error al eliminar la cuenta');
    }
  };

  const handleDeleteGalleryItem = async (itemId: number) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await api.delete(`/user-car-gallery/${itemId}`);
      setGalleryItems(galleryItems.filter(i => i.id !== itemId));
      toast.success('Publicación eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-text flex flex-col items-center justify-center">
        <h2 className="text-xl text-red-400 mb-2">Acceso denegado</h2>
        <p className="text-text-secondary mb-4">Inicia sesión para ver tu perfil.</p>
        <Link to="/login" className="px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-light to-dark text-text">
      {/* HEADER */}
      <header className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-dark-light/70 backdrop-blur-sm sticky top-0 z-20">
        <h1 className="text-3xl font-semibold tracking-tight">Mi Perfil</h1>
        {notifications.filter(n => !n.is_read).length > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 text-xs rounded-full animate-pulse">
            {notifications.filter(n => !n.is_read).length} nuevas
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* PERFIL */}
        <div className="bg-dark-light rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-primary/20 transition-shadow">
          <div className="flex flex-col items-center text-center">
            {userDetails.avatar_url ? (
              <img
                src={userDetails.avatar_url}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-primary shadow-md mb-4"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-border/30 flex items-center justify-center mb-4 text-text-secondary text-xl">
                {userDetails.username.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-xl font-semibold">{userDetails.username}</h2>
            <p className="text-sm text-text-secondary">{userDetails.email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-xs rounded-full ${
                user.role_id === 1
                  ? 'bg-red-500/20 text-red-400'
                  : user.role_id === 2
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Asesor' : 'Usuario'}
            </span>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="mt-8 space-y-4">
              {['username', 'email', 'avatar_url'].map((field, i) => (
                <div key={i}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={
                      field === 'avatar_url' ? 'URL del avatar (opcional)' : field === 'email' ? 'Correo electrónico' : 'Nombre de usuario'
                    }
                    value={userDetails[field as keyof typeof userDetails]}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-dark border border-border text-text focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={() => setEditing(true)}
                className="bg-primary/80 text-white py-2 rounded-lg hover:bg-primary transition-colors"
              >
                Editar perfil
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Eliminar cuenta
              </button>
            </div>
          )}
        </div>

        {/* GALERÍA */}
        <div className="lg:col-span-2 bg-dark-light rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-primary/20 transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Mis Publicaciones</h2>
            <Link
              to="/gallery/new"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + Nueva publicación
            </Link>
          </div>

          {galleryItems.length === 0 ? (
            <p className="text-text-secondary text-center py-6">
              No tienes publicaciones aún.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border/30 rounded-xl overflow-hidden bg-dark shadow-md hover:shadow-primary/10 transition-transform hover:-translate-y-1"
                >
                  <img
                    src={item.image_url}
                    alt={item.car_name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{item.car_name}</h3>
                    <p className="text-sm text-text-secondary">
                      {item.brand} {item.model} • {item.year}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {item.description || 'Sin descripción'}
                    </p>
                    <div className="flex justify-between mt-3 text-xs">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        {item.is_vehicle ? 'Auto' : 'Accesorio'}
                      </span>
                      <span className="text-gray-400">{item.likes} likes</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/gallery/edit/${item.id}`}
                        className="flex-1 bg-blue-600 text-white py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="flex-1 bg-red-600 text-white py-1 rounded text-xs hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NOTIFICACIONES */}
        <div className="lg:col-span-3 bg-dark-light rounded-2xl border border-border/50 p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Notificaciones</h2>
          {notifications.length === 0 ? (
            <p className="text-text-secondary">No tienes notificaciones nuevas.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-xl border border-border/30 p-4 ${
                    !notif.is_read ? 'bg-primary/5 border-primary/40' : 'bg-dark/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{notif.subject}</h3>
                      <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                    </div>
                    {!notif.is_read && (
                      <button className="text-primary text-xs hover:underline">
                        Marcar leído
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-2">
                    Respondido por {notif.advisor?.username || 'Asesor'} el{' '}
                    {new Date(notif.answered_at!).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
