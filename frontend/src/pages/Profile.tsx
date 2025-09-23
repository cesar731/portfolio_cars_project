// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserCarGalleryItem, Consultation } from '../types'; // ✅ ¡IMPORTANTE! Importar Consultation
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
  const [notifications, setNotifications] = useState<Consultation[]>([]); // ✅ ¡NUEVO ESTADO!
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Cargar datos del usuario
        const userRes = await api.get(`/users/me`);
        setUserDetails({
          username: userRes.data.username,
          email: userRes.data.email,
          avatar_url: userRes.data.avatar_url || '',
        });

        // Cargar galería del usuario
        const galleryRes = await api.get(`/user-car-gallery`);
        // ✅ ¡CORREGIDO! Filtramos por user_id, pero aseguramos que sea un número
        const myItems = galleryRes.data.filter(
          (item: UserCarGalleryItem) => Number(item.user_id) === Number(user.id)
        );
        setGalleryItems(myItems);

        // ✅ ¡NUEVO! Cargar notificaciones (consultas respondidas)
        const notificationsRes = await api.get(`/consultations/user/${user.id}/notifications`);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Error al cargar tu perfil, galería o notificaciones');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/me', {
        username: userDetails.username,
        email: userDetails.email,
        avatar_url: userDetails.avatar_url || null,
      });
      toast.success('Perfil actualizado con éxito');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro? Esto eliminará tu cuenta permanentemente.')) {
      return;
    }
    try {
      await api.delete('/users/me'); // ✅ ¡CORREGIDO! Ruta sin /api/
      toast.success('Cuenta eliminada correctamente');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    }
  };

  // ✅ ¡NUEVA FUNCIÓN! Para eliminar una publicación
  const handleDeleteGalleryItem = async (itemId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      return;
    }
    try {
      await api.delete(`/user-car-gallery/${itemId}`);
      toast.success('Publicación eliminada con éxito');
      // Actualizar la lista de publicaciones
      setGalleryItems(galleryItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Error al eliminar la publicación');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400">Acceso denegado</h2>
          <p className="text-text-secondary">Inicia sesión para ver tu perfil.</p>
          <Link to="/login" className="mt-4 px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4">
        <h1 className="text-2xl font-light text-text">Mi Perfil</h1>
        {/* ✅ ¡AÑADIDO! Badge de notificaciones */}
        {notifications.filter(n => !n.is_read).length > 0 && (
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs rounded-full">
              {notifications.filter(n => !n.is_read).length}
            </span>
          </div>
        )}
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* PERFIL DEL USUARIO */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-xl shadow-card border border-border p-8">
              <h2 className="text-2xl font-bold text-text mb-6">Datos Personales</h2>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-text-secondary mb-1">Nombre de usuario</label>
                    <input
                      type="text"
                      value={userDetails.username}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, username: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary mb-1">URL del avatar (opcional)</label>
                    <input
                      type="url"
                      value={userDetails.avatar_url || ''}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, avatar_url: e.target.value })
                      }
                      placeholder="https://ejemplo.com/avatar.jpg"
                      className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-text-secondary">Nombre:</p>
                    <p className="font-medium">{userDetails.username}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Email:</p>
                    <p className="font-medium">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Rol:</p>
                    <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                      user.role_id === 1 ? 'bg-red-500/20 text-red-400' :
                      user.role_id === 2 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Asesor' : 'Usuario'}
                    </span>
                  </div>

                  {userDetails.avatar_url && (
                    <div>
                      <p className="text-text-secondary">Avatar:</p>
                      <img
                        src={userDetails.avatar_url}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover mt-2 border border-border"
                      />
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setEditing(true)}
                      className="px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Editar Perfil
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GALERÍA DE AUTOS DEL USUARIO */}
          <div className="lg:col-span-2">
            <div className="bg-dark-light rounded-xl shadow-card border border-border p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Mi Galería de Autos</h2>
                <Link
                  to="/gallery/new"
                  className="px-4 py-2 bg-green-600 text-text rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Publicar
                </Link>
              </div>

              {galleryItems.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <p>Aún no has publicado ningún auto en tu galería.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="border border-border/30 rounded-lg p-4 bg-dark/50">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image_url}
                          alt={item.car_name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-text">{item.car_name}</h3>
                          <p className="text-text-secondary text-sm">
                            {item.brand} {item.model} ({item.year})
                          </p>
                          <p className="text-text-secondary text-sm mt-1">
                            {item.description || 'Sin descripción'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                              {item.is_vehicle ? 'Auto' : 'Accesorio'}
                            </span>
                            <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">
                              {item.likes} likes
                            </span>
                          </div>
                        </div>
                        {/* ✅ ¡AÑADIDO! Botones de Editar y Eliminar */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Link
                            to={`/gallery/edit/${item.id}`}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
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
          </div>

          {/* ✅ ¡NUEVA SECCIÓN! Notificaciones */}
          <div className="lg:col-span-3">
            <div className="bg-dark-light rounded-xl shadow-card border border-border p-8">
              <h2 className="text-2xl font-bold text-text mb-6">Notificaciones</h2>
              
              {notifications.length === 0 ? (
                <p className="text-text-secondary">No tienes notificaciones nuevas.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`border border-border/30 rounded-lg p-4 bg-dark/50 ${
                        !notif.is_read ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-text">{notif.subject || '¡Tu consulta ha sido respondida!'}</h3>
                          <p className="text-text-secondary text-sm mt-1">{notif.message}</p>
                        </div>
                        <div className="flex gap-2">
                          {!notif.is_read && (
                            <button
                              // ✅ ¡OPCIONAL! Puedes implementar una función para marcar como leído
                              className="text-primary hover:text-primary/80 text-xs font-medium"
                            >
                              Marcar como leído
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-text-secondary text-xs mt-2">
                        Respondido por: {notif.advisor?.username || 'Asesor'}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {new Date(notif.answered_at!).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;