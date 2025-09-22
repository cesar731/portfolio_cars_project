// frontend/src/pages/CarEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Car } from '../types';
import { toast } from 'react-hot-toast';

const CarEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Partial<Car> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        navigate('/admin');
        return;
      }
      try {
        const response = await api.get<Car>(`/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car:', error);
        toast.error('Error al cargar el auto.');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !id) return;

    try {
      // Usamos PUT para actualizar completamente el recurso
      await api.put(`/cars/${id}`, car);
      toast.success('¡Auto actualizado con éxito!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Error al actualizar el auto. Verifica los datos.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este auto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/cars/${id}`);
      toast.success('¡Auto eliminado con éxito!');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Error al eliminar el auto.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando datos del auto...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Editar Auto</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-secondary mb-1">Marca</label>
            <input
              type="text"
              value={car.brand || ''}
              onChange={(e) => setCar({...car, brand: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Modelo</label>
            <input
              type="text"
              value={car.model || ''}
              onChange={(e) => setCar({...car, model: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Año</label>
            <input
              type="number"
              value={car.year || ''}
              onChange={(e) => setCar({...car, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Precio ($)</label>
            <input
              type="number"
              value={car.price || ''}
              onChange={(e) => setCar({...car, price: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Tipo de Combustible</label>
            <input
              type="text"
              value={car.fuel_type || ''}
              onChange={(e) => setCar({...car, fuel_type: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Kilometraje</label>
            <input
              type="number"
              value={car.mileage || ''}
              onChange={(e) => setCar({...car, mileage: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Color</label>
            <input
              type="text"
              value={car.color || ''}
              onChange={(e) => setCar({...car, color: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Potencia (HP)</label>
            <input
              type="number"
              value={car.horsepower || ''}
              onChange={(e) => setCar({...car, horsepower: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Velocidad Máxima (km/h)</label>
            <input
              type="number"
              value={car.top_speed || ''}
              onChange={(e) => setCar({...car, top_speed: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Transmisión</label>
            <input
              type="text"
              value={car.transmission || ''}
              onChange={(e) => setCar({...car, transmission: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Tracción</label>
            <input
              type="text"
              value={car.drive_train || ''}
              onChange={(e) => setCar({...car, drive_train: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Peso</label>
            <input
              type="text"
              value={car.weight || ''}
              onChange={(e) => setCar({...car, weight: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Años de Producción</label>
            <input
              type="text"
              value={car.production_years || ''}
              onChange={(e) => setCar({...car, production_years: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              value={car.description || ''}
              onChange={(e) => setCar({...car, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">URL de Imagen (URL única)</label>
            <input
              type="url"
              value={car.image_url?.[0] || ''}
              onChange={(e) => setCar({...car, image_url: [e.target.value]})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/car.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={car.is_published || false}
                onChange={(e) => setCar({...car, is_published: e.target.checked})}
                className="mr-2"
              />
              Publicado
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Eliminar Auto
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarEdit;