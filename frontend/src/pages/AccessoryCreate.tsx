// frontend/src/pages/AccessoryCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Accessory } from '../types';

const AccessoryCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const [accessory, setAccessory] = useState<Partial<Accessory>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    is_published: true,
  });

  const [imageUrlsText, setImageUrlsText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrlsText.trim()) {
      alert('Debes agregar al menos una URL de imagen.');
      return;
    }

    try {
      await api.post('/accessories', {
        ...accessory,
        created_by: user.id,
        image_urls: imageUrlsText, // <-- Comas directo
      });

      alert('¡Accesorio creado con éxito!');
      navigate('/accessories');
    } catch (error) {
      console.error('Error al crear accesorio:', error);
      alert('Error al crear el accesorio. Revisa la consola.');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Crear Nuevo Accesorio</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div>
            <label className="block text-text-secondary mb-1">Nombre *</label>
            <input
              type="text"
              value={accessory.name || ''}
              onChange={(e) =>
                setAccessory({ ...accessory, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-text-secondary mb-1">Precio ($)</label>
            <input
              type="number"
              value={accessory.price ?? ''}
              onChange={(e) =>
                setAccessory({
                  ...accessory,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-text-secondary mb-1">Categoría</label>
            <input
              type="text"
              value={accessory.category || ''}
              onChange={(e) =>
                setAccessory({ ...accessory, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-text-secondary mb-1">Stock</label>
            <input
              type="number"
              value={accessory.stock ?? ''}
              onChange={(e) =>
                setAccessory({
                  ...accessory,
                  stock: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              value={accessory.description || ''}
              onChange={(e) =>
                setAccessory({ ...accessory, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* URLs de imágenes */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">
              URLs de imágenes (separadas por coma)
            </label>

            <textarea
              placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.png"
              value={imageUrlsText}
              onChange={(e) => setImageUrlsText(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />

            <p className="text-xs text-text-secondary mt-1">
              Puedes agregar 1 o varias URLs separadas por coma.
            </p>
          </div>

          {/* Publicado */}
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessory.is_published || false}
                onChange={(e) =>
                  setAccessory({
                    ...accessory,
                    is_published: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Publicado
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90"
          >
            Crear Accesorio
          </button>

          <button
            type="button"
            onClick={() => navigate('/accessories')}
            className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg hover:bg-primary/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccessoryCreate;
