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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Galería de Usuarios</h1>
          <Link
            to="/gallery/new"
            className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors"
          >
            + Nueva Publicación
          </Link>
        </div>

        <div className="space-y-6">
          {galleryItems.length > 0 ? (
            galleryItems.map((item) => (
              <Link key={item.id} to={`/gallery/${item.id}`} className="block">
                <div className="bg-dark-light rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex gap-4">
                    <img
                      src={item.image_url}
                      alt={item.car_name}
                      className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text">{item.car_name}</h3>
                      <p className="text-text-secondary text-sm mt-1">
                        Por {item.user?.username || 'Anónimo'} · {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      {item.description && (
                        <p className="text-text mt-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                        <span>❤️ {item.likes} Me gusta</span>
                        <span>💬 0 Comentarios</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-lg">Aún no hay publicaciones. ¡Sé el primero en subir una foto!</p>
              <Link
                to="/gallery/new"
                className="mt-4 inline-block px-6 py-2 bg-primary text-text rounded-lg hover:bg-primary/90"
              >
                Publicar ahora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGallery;