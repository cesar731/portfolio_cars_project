// frontend/src/pages/UserGallery.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserGallery } from '../services/userCarGalleryApi';
import { UserCarGalleryItem } from '../types';

const UserGallery = () => {
  const [galleryItems, setGalleryItems] = useState<UserCarGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Mostrar 9 publicaciones por página

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

  // --- Paginación ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = galleryItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

  // --- Función para cambiar de página con scroll automático ---
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark text-text pb-20">
      {/* Encabezado con espaciado mejorado */}
      <section className="w-full text-center py-24 mb-16 bg-gradient-to-b from-dark to-dark-light">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
            Galería de Usuarios
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8">
            Descubre autos, proyectos y accesorios compartidos por nuestra comunidad.
          </p>
          <Link
            to="/gallery/new"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/30"
          >
            + Nueva Publicación
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* Publicaciones */}
        {galleryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((item) => (
                <Link key={item.id} to={`/gallery/${item.id}`} className="block group">
                  <article className="bg-dark-light rounded-2xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                    {/* Imagen */}
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.car_name}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-white group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {item.car_name}
                      </h2>

                      <p className="text-text-secondary text-xs mb-3">
                        Por{' '}
                        <span className="font-medium text-white">
                          {item.user?.username || 'Anónimo'}
                        </span>{' '}
                        ·{' '}
                        {new Date(item.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>

                      {item.description && (
                        <p className="text-text text-sm line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      )}

                      {item.is_vehicle && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.brand && (
                            <span className="text-xs bg-dark/60 text-text-secondary px-2.5 py-1 rounded-full">
                              {item.brand}
                            </span>
                          )}
                          {item.model && (
                            <span className="text-xs bg-dark/60 text-text-secondary px-2.5 py-1 rounded-full">
                              {item.model}
                            </span>
                          )}
                          {item.year && (
                            <span className="text-xs bg-dark/60 text-text-secondary px-2.5 py-1 rounded-full">
                              {item.year}
                            </span>
                          )}
                          {item.horsepower && (
                            <span className="text-xs bg-dark/60 text-text-secondary px-2.5 py-1 rounded-full">
                              {item.horsepower} HP
                            </span>
                          )}
                        </div>
                      )}

                      {/* Interacciones */}
                      <div className="flex items-center gap-5 text-sm text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-dark-light border border-border rounded-lg text-text hover:bg-primary/10 disabled:opacity-50"
                >
                  ← Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-primary text-white border-primary'
                        : 'bg-dark-light text-text border-border hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-dark-light border border-border rounded-lg text-text hover:bg-primary/10 disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
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
              className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
