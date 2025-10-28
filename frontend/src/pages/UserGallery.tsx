// frontend/src/pages/UserGallery.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserGallery } from '../services/userCarGalleryApi';
import { UserCarGalleryItem } from '../types';

const UserGallery = () => {
  const [galleryItems, setGalleryItems] = useState<UserCarGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getUserGallery();
        setGalleryItems(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text pb-16">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Galería de Usuarios</h1>
            <p className="text-text-secondary mt-2">
              Descubre autos, accesorios y pasión compartida por nuestra comunidad.
            </p>
          </div>
          <Link
            to="/gallery/new"
            className="px-5 py-2.5 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
          >
            + Nueva Publicación
          </Link>
        </div>

        {/* Lista de publicaciones - estilo Twitter, optimizado para PC */}
        {galleryItems.length > 0 ? (
          <div className="space-y-8">
            {galleryItems.map((item) => (
              <Link key={item.id} to={`/gallery/${item.id}`} className="block group">
                <article className="bg-dark-light rounded-2xl p-6 border border-border/20 hover:border-primary/40 transition-colors">
                  {/* Imagen arriba (responsive en PC) */}
                  <div className="mb-5 rounded-xl overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.car_name}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>

                  {/* Contenido */}
                  <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                    {item.car_name}
                  </h2>

                  <p className="text-text-secondary text-sm mb-3">
                    Por <span className="font-medium text-white">{item.user?.username || 'Anónimo'}</span> ·{' '}
                    {new Date(item.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  {item.description && (
                    <p className="text-text leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}

                  {/* Especificaciones (solo si es vehículo) */}
                  {item.is_vehicle && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.brand && (
                        <span className="text-xs bg-dark/50 text-text-secondary px-2.5 py-1 rounded">
                          {item.brand}
                        </span>
                      )}
                      {item.model && (
                        <span className="text-xs bg-dark/50 text-text-secondary px-2.5 py-1 rounded">
                          {item.model}
                        </span>
                      )}
                      {item.year && (
                        <span className="text-xs bg-dark/50 text-text-secondary px-2.5 py-1 rounded">
                          {item.year}
                        </span>
                      )}
                      {item.horsepower && (
                        <span className="text-xs bg-dark/50 text-text-secondary px-2.5 py-1 rounded">
                          {item.horsepower} HP
                        </span>
                      )}
                    </div>
                  )}

                  {/* Interacciones */}
                  <div className="flex items-center gap-5 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>0 comentarios</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-text-secondary mb-4">
              Aún no hay publicaciones.
            </h2>
            <p className="text-text-secondary max-w-md mx-auto mb-6">
              Sé el primero en compartir tu auto o accesorio favorito.
            </p>
            <Link
              to="/gallery/new"
              className="inline-block px-6 py-2.5 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Publicar ahora
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGallery;