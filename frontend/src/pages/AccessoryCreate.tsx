// frontend/src/pages/AccessoryCreate.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Accessory } from '../types';

const MAX_IMAGES = 5;

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

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      alert('Debes seleccionar al menos una imagen.');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', accessory.name ?? '');
      formData.append('description', accessory.description ?? '');
      formData.append('price', String(accessory.price ?? 0));
      formData.append('stock', String(accessory.stock ?? 0));
      formData.append('category', accessory.category ?? '');
      formData.append('is_published', String(accessory.is_published ?? true));
      formData.append('created_by', String(user.id));

      // Agregar todas las imágenes como images[]
      selectedImages.slice(0, MAX_IMAGES).forEach((file) => {
        formData.append('images', file);
      });

      await api.post('/accessories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('¡Accesorio creado con éxito!');
      navigate('/accessories');
    } catch (error) {
      console.error('Error al crear accesorio:', error);
      alert('Error al crear el accesorio. Revisa la consola.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = files.length + selectedImages.length;
    if (total > MAX_IMAGES) {
      alert(`Máximo ${MAX_IMAGES} imágenes por accesorio.`);
      return;
    }
    setSelectedImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
  };

  const removeImageAt = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Crear Nuevo Accesorio</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-text-secondary mb-1">Nombre *</label>
            <input
              type="text"
              value={accessory.name || ''}
              onChange={(e) => setAccessory({ ...accessory, name: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-text-secondary mb-1">Precio ($)</label>
            <input
              type="number"
              value={accessory.price ?? ''}
              onChange={(e) => setAccessory({ ...accessory, price: parseFloat(e.target.value) })}
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
              onChange={(e) => setAccessory({ ...accessory, category: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-text-secondary mb-1">Stock</label>
            <input
              type="number"
              value={accessory.stock ?? ''}
              onChange={(e) => setAccessory({ ...accessory, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              value={accessory.description || ''}
              onChange={(e) => setAccessory({ ...accessory, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text"
            />
          </div>

          {/* Imágenes */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-2">Imágenes (1–{MAX_IMAGES})</label>
            <div onClick={triggerFileInput} className="border-2 border-dashed border-border p-6 rounded-lg cursor-pointer hover:bg-dark/50 text-center">
              <p className="text-text-secondary mb-2">Haz click para agregar imágenes</p>
              <p className="text-text-secondary text-sm">Puedes subir hasta {MAX_IMAGES} imágenes.</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </div>

            {/* Previews */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {selectedImages.map((file, idx) => (
                  <div key={idx} className="relative w-full h-28 rounded overflow-hidden border border-border">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImageAt(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publicado */}
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input type="checkbox" checked={accessory.is_published || false} onChange={(e) => setAccessory({ ...accessory, is_published: e.target.checked })} className="mr-2" />
              Publicado
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex gap-4">
          <button type="submit" className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90">Crear Accesorio</button>
          <button type="button" onClick={() => navigate('/accessories')} className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg hover:bg-primary/10">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AccessoryCreate;
