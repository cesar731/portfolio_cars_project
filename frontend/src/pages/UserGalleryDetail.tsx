// frontend/src/pages/UserGalleryDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserGalleryItem, likeGalleryItem } from '../services/userCarGalleryApi';
import { toast } from 'react-hot-toast';

const UserGalleryDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getUserGalleryItem(Number(id));
        setItem(data);
        setLikes(data.likes);
        // Verificar si el usuario ya dio like (simulado por ahora)
        // En producción, esto se haría con el usuario autenticado
        setLiked(false); 
      } catch (error) {
        console.error('Error fetching gallery item:', error);
        navigate('/gallery');
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!liked) {
      try {
        const response = await likeGalleryItem(Number(id));
        setLikes(response.likes);
        setLiked(true);
      } catch (error) {
        console.error('Error liking item:', error);
      }
    } else {
      // En producción, aquí se desactivaría el like.
      // Por simplicidad, lo dejamos como solo "like" sin deslike.
      // Puedes implementar un toggle más adelante.
    }
  };

  // ✅ ¡NUEVA FUNCIÓN! Para copiar el enlace al portapapeles
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('¡Enlace copiado al portapapeles!');
    } catch (err) {
      toast.error('Error al copiar el enlace.');
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-text-secondary">Cargando publicación...</p>
      </div>
    );
  }

  const createdAt = new Date(item.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="text-sm text-text-secondary">
          <Link to="/" className="hover:text-primary">Inicio</Link> / 
          <Link to="/gallery" className="hover:text-primary">Galería</Link> / 
          <span>{item.car_name}</span>
        </nav>
      </div>

      {/* Hero Section - Imagen Principal */}
      <section className="relative h-[70vh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.image_url})` }}>
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="w-full p-8 text-white">
            <h1 className="text-4xl md:text-6xl font-light leading-tight">{item.car_name}</h1>
            {item.is_vehicle && item.year && (
              <p className="mt-2 text-lg opacity-90">{item.year}</p>
            )}
            {item.description && (
              <p className="mt-4 text-xl">{item.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Autor y Fecha */}
          <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-text-secondary">
                {item.user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-white">{item.user?.username || 'Usuario anónimo'}</p>
                <p className="text-text-secondary text-sm">{createdAt}</p>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM10 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM14 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6z" />
              </svg>
              <span className="font-medium">{likes} likes</span>
            </button>
          </div>

          {/* Especificaciones Técnicas (SOLO SI ES UN AUTO) */}
          {item.is_vehicle && (
            <div className="bg-dark-light p-8 rounded-xl border border-border mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {item.brand && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Marca</span>
                    <span className="text-white font-bold">{item.brand}</span>
                  </div>
                )}
                {item.model && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Modelo</span>
                    <span className="text-white font-bold">{item.model}</span>
                  </div>
                )}
                {item.year && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Año</span>
                    <span className="text-white font-bold">{item.year}</span>
                  </div>
                )}
                {item.fuel_type && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Combustible</span>
                    <span className="text-white font-bold">{item.fuel_type}</span>
                  </div>
                )}
                {item.mileage && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Kilometraje</span>
                    <span className="text-white font-bold">{item.mileage.toLocaleString()} km</span>
                  </div>
                )}
                {item.engine_spec && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Motor</span>
                    <span className="text-white font-bold">{item.engine_spec}</span>
                  </div>
                )}
                {item.horsepower && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Potencia</span>
                    <span className="text-white font-bold">{item.horsepower} HP</span>
                  </div>
                )}
                {item.top_speed_kmh && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Velocidad Máxima</span>
                    <span className="text-white font-bold">{item.top_speed_kmh} km/h</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Descripción General (siempre visible) */}
          {item.description && !item.is_vehicle && (
            <div className="bg-dark-light p-8 rounded-xl border border-border mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Descripción</h3>
              <p className="text-text-secondary leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <Link
              to="/gallery"
              className="px-6 py-3 border border-text-secondary text-text-secondary hover:bg-text-secondary/10 rounded-lg transition-colors"
            >
              ← Volver a la Galería
            </Link>
            <div className="flex gap-4">
              {/* ✅ ¡BOTÓN DE COMPARTIR FUNCIONAL! */}
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Compartir
              </button>
              {/* ✅ ¡BOTÓN PARA PUBLICAR OTRO AUTO! */}
              <Link
                to="/gallery/new"
                className="px-6 py-3 bg-green-600 text-text rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Publicar Automovil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGalleryDetail;