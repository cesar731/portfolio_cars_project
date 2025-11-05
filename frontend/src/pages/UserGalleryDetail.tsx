// frontend/src/pages/UserGalleryDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { likeGalleryEntry } from '../services/userCarGalleryApi';

const UserGalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!id) {
        navigate('/gallery');
        return;
      }
      try {
        const res = await api.get(`/user-car-gallery/${id}`);
        setGallery(res.data);
      } catch (err) {
        toast.error('Entrada no encontrada.');
        navigate('/gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!gallery) return;
    try {
      const res = await likeGalleryEntry(gallery.id);
      setGallery({ ...gallery, likes: res.likes });
      toast.success('¡Like enviado!');
    } catch (err) {
      toast.error('No se pudo dar like.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando publicación...</p>
      </div>
    );
  }

  if (!gallery) return null;

  return (
    <div className="min-h-screen bg-dark text-text">
      <header className="bg-dark-light border-b border-border px-6 py-4">
        <button
          onClick={() => navigate('/gallery')}
          className="text-primary hover:text-primary/80 flex items-center gap-2"
        >
          ← Volver a Galería
        </button>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-text">{gallery.car_name}</h1>
          {gallery.brand && (
            <p className="text-text-secondary">
              {gallery.brand} {gallery.model} • {gallery.year}
            </p>
          )}
        </div>
        <img
          src={gallery.image_url}
          alt={gallery.car_name}
          className="w-full h-96 object-cover rounded-xl mb-6 border border-border"
        />
        <div className="bg-dark-light p-6 rounded-xl mb-6">
          <p className="text-text-secondary whitespace-pre-line">{gallery.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.81 0-1.568-.44-1.831-1.111l-3.5-7A2 2 0 016 11h4.764" />
            </svg>
            {gallery.likes || 0} likes
          </button>
          <span className="text-text-secondary text-sm">
            Publicado por: {gallery.user?.username || 'Usuario'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserGalleryDetail;