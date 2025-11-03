// frontend/src/pages/UserGalleryCreate.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const UserGalleryCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Para saber de dónde vino

  // ✅ Verificar autenticación al montar el componente
  useEffect(() => {
    if (!user) {
      // Guardar la ruta actual para redirigir después del login
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  // Si no hay usuario, no renderices nada (evita el "en blanco")
  if (!user) {
    return null;
  }

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        user_id: user.id,
        year: parseInt(String(formData.year)),
        mileage: parseInt(String(formData.mileage)),
        horsepower: parseInt(String(formData.horsepower)),
        top_speed_kmh: parseInt(String(formData.top_speed_kmh)),
      };
      await api.post('/user-car-gallery', payload);
      toast.success('¡Publicación creada con éxito!');
      setFormData({
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
    } catch (error) {
      console.error('Error creating gallery item:', error);
      toast.error('Error al crear la publicación. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8">Publicar en Mi Galería</h1>
        <form onSubmit={handleSubmit} className="bg-dark-light p-8 rounded-xl shadow-card border border-border space-y-6">
          {/* ... resto del formulario igual ... */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_vehicle"
                checked={formData.is_vehicle}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-text-secondary">Esta publicación es de un vehículo (no un accesorio)</span>
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
              placeholder="Ej: Mi Ferrari F40"
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
              placeholder="https://ejemplo.com/mi-auto.jpg"
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
              placeholder="Cuéntanos sobre tu auto..."
            ></textarea>
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
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Año</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Combustible</label>
                  <input
                    type="text"
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Kilometraje</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Motor</label>
                  <input
                    type="text"
                    name="engine_spec"
                    value={formData.engine_spec}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Potencia (HP)</label>
                  <input
                    type="number"
                    name="horsepower"
                    value={formData.horsepower}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Velocidad Máxima (km/h)</label>
                  <input
                    type="number"
                    name="top_speed_kmh"
                    value={formData.top_speed_kmh}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/gallery')}
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

export default UserGalleryCreate;