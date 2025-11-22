// frontend/src/pages/AccessoryEdit.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Accessory, AccessoryImage } from '../types';
import { toast } from 'react-hot-toast';

const MAX_IMAGES = 5;

const AccessoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const response = await api.get(`/accessories/${id}`);
        setAccessory(response.data);
      } catch (error) {
        toast.error('Error al cargar el accesorio.');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAccessory();
  }, [id, navigate]);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!accessory) return;
    const existingCount = (accessory.images?.length ?? 0) - removedImageIds.length;
    if (existingCount + newImages.length + files.length > MAX_IMAGES) {
      toast.error(`No puedes tener más de ${MAX_IMAGES} imágenes por accesorio.`);
      return;
    }
    setNewImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES - existingCount));
  };

  const removeExistingImage = (imgId: number) => {
    setRemovedImageIds((prev) => [...prev, imgId]);
  };

  const undoRemoveExistingImage = (imgId: number) => {
    setRemovedImageIds((prev) => prev.filter((i) => i !== imgId));
  };

  const removeNewImageAt = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessory) return;

    try {
      const formData = new FormData();
      formData.append('name', accessory.name);
      formData.append('price', String(accessory.price));
      formData.append('description', accessory.description ?? '');
      formData.append('stock', String(accessory.stock));
      formData.append('category', accessory.category ?? '');
      formData.append('is_published', String(accessory.is_published));

      if (removedImageIds.length > 0) {
        formData.append('remove_image_ids', removedImageIds.join(','));
      }

      newImages.forEach((file) => formData.append('new_images', file));

      await api.put(`/accessories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('¡Accesorio actualizado con éxito!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el accesorio.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este accesorio?')) return;
    try {
      await api.delete(`/accessories/${id}`);
      toast.success('Accesorio eliminado.');
      navigate('/admin');
    } catch (err) {
      toast.error('Error al eliminar.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando accesorio...</p>
        </div>
      </div>
    );
  }

  if (!accessory) return null;

  const FILES_URL = import.meta.env.VITE_FILES_URL;

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Editar Accesorio</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-text-secondary mb-1">Nombre *</label>
            <input type="text" value={accessory.name} onChange={(e) => setAccessory({ ...accessory, name: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text" required />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-text-secondary mb-1">Precio</label>
            <input type="number" value={accessory.price} onChange={(e) => setAccessory({ ...accessory, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text" required />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-text-secondary mb-1">Categoría</label>
            <input type="text" value={accessory.category ?? ''} onChange={(e) => setAccessory({ ...accessory, category: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text" />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-text-secondary mb-1">Stock</label>
            <input type="number" value={accessory.stock} onChange={(e) => setAccessory({ ...accessory, stock: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text" />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea value={accessory.description ?? ''} onChange={(e) => setAccessory({ ...accessory, description: e.target.value })} rows={4} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text" />
          </div>

          {/* Imágenes actuales */}
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-2">Imágenes actuales</label>
            <div className="flex gap-3 flex-wrap">
              {(accessory.images ?? []).map((img: AccessoryImage) => {
                const isRemoved = removedImageIds.includes(img.id);
                return (
                  <div key={img.id} className="relative w-32 h-24">
                    <img src={`${FILES_URL}${img.image_url}`} className={`w-full h-full object-cover rounded-lg border ${isRemoved ? 'opacity-30' : ''}`} />
                    {!isRemoved ? (
                      <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                    ) : (
                      <button type="button" onClick={() => undoRemoveExistingImage(img.id)} className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">↺</button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Agregar nuevas */}
            <div onClick={triggerFileInput} className="border-2 border-dashed border-border p-4 mt-4 rounded-lg cursor-pointer hover:bg-dark/40 text-center">
              <p className="text-text-secondary mb-1">Agregar nuevas imágenes</p>
              <p className="text-text-secondary text-sm">Máx total {MAX_IMAGES} imágenes por accesorio.</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleNewFiles} className="hidden" />
            </div>

            {/* Previews nuevas */}
            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {newImages.map((f, idx) => (
                  <div key={idx} className="relative w-full h-28 rounded overflow-hidden border border-border">
                    <img src={URL.createObjectURL(f)} alt={`n-${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImageAt(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publicado */}
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input type="checkbox" checked={accessory.is_published} onChange={(e) => setAccessory({ ...accessory, is_published: e.target.checked })} className="mr-2" />
              Publicado
            </label>
          </div>
        </div>

        {/* BOTONES */}
        <div className="mt-8 flex gap-4">
          <button type="submit" className="px-8 py-3 bg-primary text-text rounded-lg hover:bg-primary/90">Guardar Cambios</button>
          <button type="button" onClick={handleDelete} className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
          <button type="button" onClick={() => navigate('/admin')} className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg hover:bg-primary/20">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AccessoryEdit;
