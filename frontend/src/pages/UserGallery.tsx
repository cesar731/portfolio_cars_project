// frontend/src/pages/UserGallery.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserGallery } from '../services/userCarGalleryApi';

const UserGallery = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
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
    <div className="min-h-screen bg-dark text-text">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-white mb-12">Galería de Usuarios</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.length > 0 ? (
            galleryItems.map((item) => (
              <Link
                key={item.id}
                to={`/gallery/${item.id}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl shadow-card bg-dark-light border border-border">
                  <img
                    src={item.image_url}
                    alt={item.car_name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold">{item.car_name}</h3>
                    {item.is_vehicle && item.year && (
                      <p className="text-primary mt-1">{item.year}</p>
                    )}
                    {item.description && (
                      <p className="text-text-secondary mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary text-lg">
                Aún no hay publicaciones. ¡Sé el primero en subir una foto!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGallery;