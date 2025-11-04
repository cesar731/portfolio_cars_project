// frontend/src/pages/UserGalleryEdit.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const UserGalleryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    car_name: '',
    description: '',
    image_url: '',
    is_vehicle: true,
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuel_type: '',
    mileage: 0,
    engine_spec: '',
    horsepower: 0,
    top_speed_kmh: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/user-car-gallery/${id}`);
        const post = res.data;

        // Verificar que el post pertenece al usuario
        if (post.user_id !== user.id) {
          toast.error('No tienes permiso para editar esta publicación.');
          navigate('/profile');
          return;
        }

        setFormData({
          car_name: post.car_name || '',
          description: post.description || '',
          image_url: post.image_url || '',
          is_vehicle: post.is_vehicle || false,
          brand: post.brand || '',
          model: post.model || '',
          year: post.year || new Date().getFullYear(),
          fuel_type: post.fuel_type || '',
          mileage: post.mileage || 0,
          engine_spec: post.engine_spec || '',
          horsepower: post.horsepower || 0,
          top_speed_kmh: post.top_speed_kmh || 0,
        });
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar la publicación.');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        horsepower: Number(formData.horsepower),
        top_speed_kmh: Number(formData.top_speed_kmh),
      };
      await api.put(`/user-car-gallery/${id}`, payload);
      toast.success('Publicación actualizada con éxito');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al actualizar la publicación');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p>Cargando publicación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8">Editar Publicación</h1>
        <form onSubmit={handleSubmit} className="bg-dark-light p-8 rounded-xl shadow-card border border-border space-y-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_vehicle"
                checked={formData.is_vehicle}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-text-secondary">Esta publicación es de un vehículo</span>
            </label>
          </div>

          <div>
            <label className="block text-text-secondary mb-1">Nombre *</label>
            <input
              type="text"
              name="car_name"
              value={formData.car_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-1">URL de la Imagen *</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {formData.is_vehicle && (
            <div className="border-t border-border pt-6">
              <h2 className="text-2xl font-bold text-text mb-4">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-secondary mb-1">Marca</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Año</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Combustible</label>
                  <input
                    type="text"
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Kilometraje</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Motor</label>
                  <input
                    type="text"
                    name="engine_spec"
                    value={formData.engine_spec}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Potencia (HP)</label>
                  <input
                    type="number"
                    name="horsepower"
                    value={formData.horsepower}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Velocidad Máxima (km/h)</label>
                  <input
                    type="number"
                    name="top_speed_kmh"
                    value={formData.top_speed_kmh}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserGalleryEdit;