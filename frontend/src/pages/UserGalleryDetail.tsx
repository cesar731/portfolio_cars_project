import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserGallery } from '../services/userCarGalleryApi';
import { UserCarGalleryItem } from '../types';
import { motion } from 'framer-motion';

const UserGalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<UserCarGalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const data = await getUserGallery();
        const foundItem = data.find((i: UserCarGalleryItem) => i.id.toString() === id);
        setItem(foundItem || null);
      } catch (error) {
        console.error('Error fetching gallery item:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-dark text-text flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl text-white mb-4">Publicación no encontrada</h2>
        <p className="text-text-secondary mb-6">La publicación que buscas no existe o fue eliminada.</p>
        <Link
          to="/gallery"
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Volver a la galería
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-6 py-10"
      >
        {/* Botón de regreso */}
        <button
          onClick={() => navigate(-1)}
          className="text-text-secondary hover:text-primary transition mb-6 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        {/* Imagen principal */}
        <div className="rounded-2xl overflow-hidden mb-8 border border-border shadow-md shadow-primary/20">
          <img
            src={item.image_url || 'https://via.placeholder.com/800x500?text=Publicación'}
            alt={item.car_name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Encabezado */}
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
          {item.car_name}
        </h1>

        <p className="text-text-secondary mb-6">
          Publicado por <span className="text-white font-medium">{item.user?.username || 'Anónimo'}</span> ·{' '}
          {new Date(item.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>

        {/* Descripción */}
        <div className="bg-dark-light p-6 rounded-xl border border-border mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Descripción</h2>
          <p className="text-text leading-relaxed whitespace-pre-line">
            {item.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Detalles técnicos (solo si es vehículo) */}
        {item.is_vehicle && (
          <div className="bg-dark-light p-6 rounded-xl border border-border mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Detalles del Vehículo</h2>
            <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
              {item.brand && (
                <span className="px-3 py-1 bg-dark rounded-lg border border-border">
                  Marca: <span className="text-white">{item.brand}</span>
                </span>
              )}
              {item.model && (
                <span className="px-3 py-1 bg-dark rounded-lg border border-border">
                  Modelo: <span className="text-white">{item.model}</span>
                </span>
              )}
              {item.year && (
                <span className="px-3 py-1 bg-dark rounded-lg border border-border">
                  Año: <span className="text-white">{item.year}</span>
                </span>
              )}
              {item.horsepower && (
                <span className="px-3 py-1 bg-dark rounded-lg border border-border">
                  Potencia: <span className="text-white">{item.horsepower} HP</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interacciones */}
        <div className="flex items-center justify-between mt-10 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{item.likes || 0} me gusta</span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>0 comentarios</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserGalleryDetail;
