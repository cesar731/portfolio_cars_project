// frontend/src/pages/Profile.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { UserCarGalleryItem as UserCarGallery } from '../types';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar_url: '',
  });

  const [galleryPosts, setGalleryPosts] = useState<UserCarGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userRes = await api.get(`/users/${user.id}`);
        const userData = userRes.data;
        setFormData({
          username: userData.username,
          email: userData.email,
          password: '',
          avatar_url: userData.avatar_url || '',
        });

        // ✅ Usar el nuevo endpoint seguro
        const galleryRes = await api.get('/user-car-gallery/me');
        setGalleryPosts(galleryRes.data);
      } catch (err) {
        toast.error('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        avatar_url: formData.avatar_url || null, // ✅ null si vacío
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.patch('/users/me', updateData);
      toast.success('Perfil actualizado con éxito');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar tu cuenta?')) {
      return;
    }
    try {
      await api.patch('/users/me/deactivate');
      toast.success('Cuenta desactivada');
      logout();
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al desactivar la cuenta');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-3xl font-light text-white mb-8">Mi Perfil</h1>

      {/* Formulario */}
      <div className="max-w-2xl bg-dark-light p-6 rounded-xl border border-border mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-1">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Contraseña (opcional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">URL de avatar (opcional)</label>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/avatar.jpg"
              className="w-full px-3 py-2 bg-dark border border-border rounded text-text"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-text rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      {/* Publicaciones */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-text mb-4">Mis Publicaciones</h2>
        {galleryPosts.length === 0 ? (
          <p className="text-text-secondary">No has publicado nada en la galería aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryPosts.map((post) => (
              <div key={post.id} className="bg-dark-light p-4 rounded border border-border">
                <img
                  src={post.image_url}
                  alt={post.car_name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-medium text-text">{post.car_name}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{post.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desactivar cuenta */}
      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg max-w-md">
        <h3 className="font-bold text-red-400 mb-2">Desactivar cuenta</h3>
        <p className="text-sm text-text-secondary mb-3">
          Tu cuenta quedará inactiva y no podrás iniciar sesión.
        </p>
        <button
          onClick={handleDeactivate}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Desactivar Cuenta
        </button>
      </div>
    </div>
  );
};

export default Profile;