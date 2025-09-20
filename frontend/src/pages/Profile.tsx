// frontend/src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import  api  from '../services/api';
import { UserCarGalleryItem } from '../types';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    avatar_url: '',
  });
  const [galleryItems, setGalleryItems] = useState<UserCarGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Cargar datos del usuario
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/me`);
        setUserDetails({
          username: res.data.username,
          email: res.data.email,
          avatar_url: res.data.avatar_url || '',
        });
      } catch (error) {
        toast.error('Error al cargar tu perfil');
      }
    };

    // Cargar galería del usuario
    const fetchGallery = async () => {
      try {
        const res = await api.get(`/api/user-car-gallery`);
        // Filtrar solo los items del usuario actual
        const myItems = res.data.filter(
          (item: UserCarGalleryItem) => item.user_id === user.id
        );
        setGalleryItems(myItems);
      } catch (error) {
        toast.error('Error al cargar tu galería');
      }
    };

    fetchUser();
    fetchGallery();
    setLoading(false);
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/api/users/me', {
        username: userDetails.username,
        email: userDetails.email,
        avatar_url: userDetails.avatar_url || null,
      });
      toast.success('Perfil actualizado con éxito');
      setEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro? Esto eliminará tu cuenta permanentemente.')) {
      return;
    }

    try {
      await api.delete('/api/users/me');
      toast.success('Cuenta eliminada correctamente');
      logout();
      window.location.href = '/login';
    } catch (error) {
      toast.error('Error al eliminar la cuenta');
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
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* PERFIL DEL USUARIO */}
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

          {/* GALERÍA DE AUTOS DEL USUARIO */}
          <div className="bg-dark-light rounded-xl shadow-card border border-border p-8">
            <h2 className="text-2xl font-bold text-text mb-6">Mi Galería de Autos</h2>

            {galleryItems.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <p>Aún no has publicado ningún auto en tu galería.</p>
                <Link
                  to="/gallery/new"
                  className="mt-4 px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Publicar un Auto →
                </Link>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;