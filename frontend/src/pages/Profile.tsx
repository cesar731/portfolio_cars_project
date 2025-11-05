// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

// ✅ Definición local del tipo (evita errores de import)
interface UserCarGalleryItem {
  id: number;
  car_name: string;
  description?: string;
  image_url: string;
  likes: number;
  user_id: number;
  created_at: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [galleryPosts, setGalleryPosts] = useState<UserCarGalleryItem[]>([]);

  useEffect(() => {
    // Si no hay usuario, redirigir al login y guardar la ruta
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const fetchProfileData = async () => {
      try {
        const userRes = await api.get('/api/users/me');
        const userData = userRes.data;
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          avatar_url: userData.avatar_url || '',
        });

        const galleryRes = await api.get('/api/user-car-gallery/me');
        setGalleryPosts(galleryRes.data || []);
      } catch (err: any) {
        console.error('Error al cargar el perfil:', err.response?.data || err);
        toast.error('No se pudo cargar tu perfil. Por favor, inicia sesión.');
        logout();
        navigate('/login', { state: { from: location } });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, location, logout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch('/api/users/me', {
        username: formData.username,
        email: formData.email,
        avatar_url: formData.avatar_url,
      });
      toast.success('Perfil actualizado correctamente.');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Error al actualizar el perfil.';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm('¿Estás seguro? Esta acción desactivará tu cuenta permanentemente.')) {
      return;
    }
    setDeactivating(true);
    try {
      await api.patch('/api/users/me/deactivate');
      toast.success('Cuenta desactivada correctamente.');
      logout();
      navigate('/');
    } catch (err: any) {
      toast.error('No se pudo desactivar la cuenta.');
    } finally {
      setDeactivating(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await api.delete(`/api/user-car-gallery/${postId}`);
      setGalleryPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success('Publicación eliminada.');
    } catch (err) {
      toast.error('No se pudo eliminar la publicación.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-light text-white mb-8">Mi Perfil</h1>

        {/* Formulario de edición */}
        <div className="bg-dark-light p-6 rounded-xl border border-border mb-10">
          <h2 className="text-xl font-medium text-text mb-4">Editar Perfil</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-1">Avatar (URL)</label>
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-1">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 bg-primary text-text rounded hover:bg-primary/90 disabled:opacity-60"
            >
              {updating ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* Publicaciones en la galería */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-text">Mis Publicaciones</h2>
            <button
              onClick={() => navigate('/gallery/new')}
              className="text-sm text-primary hover:text-primary/80"
            >
              + Nueva publicación
            </button>
          </div>

          {galleryPosts.length === 0 ? (
            <p className="text-text-secondary">No has publicado nada en la galería aún.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryPosts.map((post) => (
                <div key={post.id} className="bg-dark p-4 rounded border border-border">
                  <img
                    src={post.image_url}
                    alt={post.car_name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-text">{post.car_name}</h3>
                  <p className="text-text-secondary text-sm mb-2">{post.description?.slice(0, 60)}...</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/gallery/edit/${post.id}`)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desactivar cuenta */}
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
          <h2 className="text-xl font-medium text-red-400 mb-2">Desactivar Cuenta</h2>
          <p className="text-text-secondary text-sm mb-4">
            Esta acción desactivará permanentemente tu cuenta.
          </p>
          <button
            onClick={handleDeactivateAccount}
            disabled={deactivating}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60 text-sm"
          >
            {deactivating ? 'Desactivando...' : 'Desactivar mi cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;