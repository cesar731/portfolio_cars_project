// frontend/src/pages/AccessoryCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Accessory } from '../types';
import { useAuth } from '../context/AuthContext'; // ✅ ¡IMPORTANTE! Importar el contexto de autenticación

const AccessoryCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ ¡IMPORTANTE! Obtener el usuario actual

  // Validación: Si no hay usuario, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  const [accessory, setAccessory] = useState<Partial<Accessory>>({
    name: '',
    description: '',
    price: 0,
    image_url: 'https://via.placeholder.com/300x200?text=Accesorio+Nuevo',
    category: '',
    stock: 0,
    is_published: true,
    // ❌ ¡ELIMINADO! created_by: 1, // Este campo lo maneja el backend, pero lo inicializamos
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ ¡CORREGIDO! Enviamos el ID del usuario logueado
      await api.post('/accessories', {
        ...accessory,
        created_by: user.id // ✅ ¡ESTO ES LO CLAVE!
      });
      alert('¡Accesorio creado con éxito!');
      navigate('/accessories');
    } catch (error) {
      console.error('Error al crear el accesorio:', error);
      alert('Error al crear el accesorio. Verifica los datos y la consola.');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Crear Nuevo Accesorio</h1>
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
            Crear Accesorio
          </button>
          <button
            type="button"
            onClick={() => navigate('/accessories')}
            className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccessoryCreate;