// frontend/src/pages/UserGallery.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserGallery } from '../services/userCarGalleryApi';
import { UserCarGalleryItem } from '../types';

const UserGallery = () => {
  const [galleryItems, setGalleryItems] = useState<UserCarGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
          <div className="h-10 w-10 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = galleryItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark text-text">
     
      <section
        className="relative w-full h-[100vh] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=70)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        }}
      >
        <h1 className="text-5xl md:text-7xl font-light text-white mb-3 drop-shadow-lg">
          Galería de Usuarios
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8">
          Descubre autos y proyectos de nuestra comunidad.
        </p>
        <Link
          to="/gallery/new"
          className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
        >
          + Nueva Publicación
        </Link>
      </section>

      {/* === CONTENIDO === */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {galleryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item, i) => (
                <Link key={item.id} to={`/gallery/${item.id}`}>
                  <article
                    className="bg-dark-light rounded-xl border border-border/30 overflow-hidden hover:border-primary/50 transition-all duration-300"
                    style={{ animation: `fadeIn 0.5s ease ${(i % 3) * 0.1}s both` }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.car_name}
                      loading="lazy"
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-white mb-1 line-clamp-1">
                        {item.car_name}
                      </h2>
                      <p className="text-text-secondary text-xs mb-2">
                        Por{' '}
                        <span className="text-white font-medium">
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
                        <p className="text-text text-sm line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}

                      {item.is_vehicle && (
                        <div className="flex flex-wrap gap-2 mb-3">
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
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-dark-light border border-border rounded-lg text-text hover:bg-primary/10 disabled:opacity-50"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition ${
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
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-text-secondary mb-3">
              Aún no hay publicaciones.
            </h2>
            <p className="text-text-secondary mb-6">
              Sé el primero en compartir tu auto o accesorio favorito.
            </p>
            <Link
              to="/gallery/new"
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Publicar ahora
            </Link>
          </div>
        )}
      </div>

      {/* Animación ligera */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserGallery;
