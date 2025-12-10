// frontend/src/pages/AccessoryEdit.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const MAX_IMAGES = 5;

interface AccessoryImage {
  id: number;
  image_url: string; // 🔥 CORREGIDO
}

interface Accessory {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  is_published: boolean;
  images: AccessoryImage[]; // 🔥 CORREGIDO
}

const AccessoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);

  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const res = await api.get(`/accessories/${id}`);
        setAccessory(res.data);
      } catch (err) {
        toast.error("Error al cargar el accesorio.");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessory();
  }, [id, navigate]);

  // Agregar imagen por URL
  const addImageByUrl = () => {
    if (!urlInput.trim()) return;

    if (newImageUrls.length >= MAX_IMAGES) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes.`);
      return;
    }

    setNewImageUrls((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const removeLocalUrl = (index: number) => {
    setNewImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Eliminar imagen existente
  const deleteExistingImage = async (imageId: number) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;

    try {
      await api.delete(`/accessories/images/${imageId}`);

      setAccessory((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.filter((img) => img.id !== imageId),
            }
          : prev
      );

      toast.success("Imagen eliminada.");
    } catch (err) {
      toast.error("Error al eliminar la imagen.");
    }
  };

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessory) return;

    try {
      const formData = new FormData();

      formData.append("name", accessory.name);
      formData.append("price", String(accessory.price));
      formData.append("description", accessory.description ?? "");
      formData.append("stock", String(accessory.stock));
      formData.append("category", accessory.category ?? "");
      formData.append("is_published", String(accessory.is_published));

      // Si agregaste nuevas URLs → reemplazan todas las imágenes
      if (newImageUrls.length > 0) {
        formData.append("image_urls_csv", newImageUrls.join(","));
      } else {
        // Si NO agregas nuevas → mantener las existentes
        const existing = accessory.images.map((i) => i.image_url);
        formData.append("image_urls_csv", existing.join(","));
      }

      await api.put(`/accessories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Accesorio actualizado con éxito");
      navigate("/admin");

    } catch (err) {
      toast.error("Error al actualizar el accesorio.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este accesorio?")) return;

    try {
      await api.delete(`/accessories/${id}`);
      toast.success("Accesorio eliminado.");
      navigate("/admin");
    } catch {
      toast.error("Error al eliminar.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p>Cargando accesorio...</p>
      </div>
    );
  }

  if (!accessory) return null;

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl mb-8">Editar Accesorio</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div>
            <label>Nombre *</label>
            <input
              type="text"
              value={accessory.name}
              onChange={(e) =>
                setAccessory({ ...accessory, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label>Precio</label>
            <input
              type="number"
              value={accessory.price}
              onChange={(e) =>
                setAccessory({ ...accessory, price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label>Categoría</label>
            <input
              type="text"
              value={accessory.category ?? ""}
              onChange={(e) =>
                setAccessory({ ...accessory, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg"
            />
          </div>

          {/* Stock */}
          <div>
            <label>Stock</label>
            <input
              type="number"
              value={accessory.stock}
              onChange={(e) =>
                setAccessory({ ...accessory, stock: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label>Descripción</label>
            <textarea
              value={accessory.description ?? ""}
              onChange={(e) =>
                setAccessory({ ...accessory, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg"
            />
          </div>

          {/* Agregar imagen por URL */}
          <div className="md:col-span-2 mt-4">
            <label className="text-text-secondary">Agregar imagen por URL</label>

            <div className="flex gap-3 mt-2">
              <input
                type="text"
                placeholder="https://example.com/img.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-dark border border-border rounded-lg"
              />
              <button
                type="button"
                onClick={addImageByUrl}
                className="px-6 bg-primary text-white rounded-lg"
              >
                Añadir
              </button>
            </div>

            {/* Previews nuevas */}
            {newImageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {newImageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-full h-28 border border-border rounded overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" />

                    <button
                      type="button"
                      onClick={() => removeLocalUrl(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Imágenes existentes */}
          <div className="md:col-span-2 mt-6">
            <label className="text-text-secondary">Imágenes existentes</label>

            <div className="grid grid-cols-3 gap-3 mt-2">
              {accessory.images?.map((img) => (
                <div key={img.id} className="relative w-full h-28 border border-border rounded overflow-hidden">
                  <img src={img.image_url} className="w-full h-full object-cover" />

                  <button
                    type="button"
                    onClick={() => deleteExistingImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}

              {accessory.images?.length === 0 && (
                <p className="text-sm text-gray-400">No hay imágenes.</p>
              )}
            </div>
          </div>

          {/* Publicado */}
          <div className="md:col-span-2">
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={accessory.is_published}
                onChange={(e) =>
                  setAccessory({ ...accessory, is_published: e.target.checked })
                }
                className="mr-2"
              />
              Publicado
            </label>
          </div>

        </div>

        {/* BOTONES */}
        <div className="mt-8 flex gap-4">
          <button type="submit" className="px-8 py-3 bg-primary text-white rounded-lg">
            Guardar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-3 bg-red-600 text-white rounded-lg"
          >
            Eliminar
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccessoryEdit;
