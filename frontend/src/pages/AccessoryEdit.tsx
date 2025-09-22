// frontend/src/pages/AccessoryEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Accessory } from '../types';
import { toast } from 'react-hot-toast';

const AccessoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState<Partial<Accessory> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessory = async () => {
      if (!id) {
        navigate('/admin');
        return;
      }
      try {
        const response = await api.get<Accessory>(`/accessories/${id}`);
        setAccessory(response.data);
      } catch (error) {
        console.error('Error fetching accessory:', error);
        toast.error('Error al cargar el accesorio.');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchAccessory();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessory || !id) return;

    try {
      await api.put(`/accessories/${id}`, accessory);
      toast.success('¡Accesorio actualizado con éxito!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating accessory:', error);
      toast.error('Error al actualizar el accesorio. Verifica los datos.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este accesorio? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/accessories/${id}`);
      toast.success('¡Accesorio eliminado con éxito!');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting accessory:', error);
      toast.error('Error al eliminar el accesorio.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando datos del accesorio...</p>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Editar Accesorio</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-secondary mb-1">Nombre *</label>
            <input
              type="text"
              value={accessory.name || ''}
              onChange={(e) => setAccessory({...accessory, name: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Precio ($)</label>
            <input
              type="number"
              value={accessory.price || ''}
              onChange={(e) => setAccessory({...accessory, price: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Categoría</label>
            <input
              type="text"
              value={accessory.category || ''}
              onChange={(e) => setAccessory({...accessory, category: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Stock</label>
            <input
              type="number"
              value={accessory.stock || ''}
              onChange={(e) => setAccessory({...accessory, stock: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              value={accessory.description || ''}
              onChange={(e) => setAccessory({...accessory, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">URL de Imagen</label>
            <input
              type="url"
              value={accessory.image_url || ''}
              onChange={(e) => setAccessory({...accessory, image_url: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/accessory.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessory.is_published || false}
                onChange={(e) => setAccessory({...accessory, is_published: e.target.checked})}
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
            Eliminar Accesorio
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

export default AccessoryEdit;
