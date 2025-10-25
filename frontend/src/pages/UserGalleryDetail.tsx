// frontend/src/pages/UserGalleryDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserGalleryItem } from '../services/userCarGalleryApi';
import { toast } from 'react-hot-toast';

const UserGalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<{ id: number; text: string; user: string; timestamp: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return navigate('/gallery');
      try {
        const data = await getUserGalleryItem(Number(id));
        setItem(data);
        setLikes(data.likes || 0);
        // Simulamos comentarios
        setComments([
          { id: 1, text: "¡Increíble auto! ¿Dónde lo conseguiste?", user: "Carlos_Racing", timestamp: "2h" },
          { id: 2, text: "Ese color es espectacular. ¿Es original?", user: "AutoFan99", timestamp: "5h" },
        ]);
      } catch (error) {
        console.error('Error fetching gallery item:', error);
        toast.error('Publicación no encontrada.');
        navigate('/gallery');
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      toast.success('¡Te gusta esta publicación!');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment,
      user: "Tú",
      timestamp: "Ahora",
    };
    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comentario publicado');
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando publicación...</p>
        </div>
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
    <div className="min-h-screen bg-dark text-text pb-16">
      {/* Hero con imagen a pantalla completa */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={item.image_url}
          alt={item.car_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight">{item.car_name}</h1>
          {item.description && <p className="text-xl text-white/90 mt-3 max-w-2xl">{item.description}</p>}
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12">
        <div className="max-w-4xl mx-auto bg-dark-light rounded-3xl p-8 shadow-card border border-border">
          {/* Autor */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {item.user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-white text-lg">{item.user?.username || 'Anónimo'}</p>
              <p className="text-text-secondary text-sm">{createdAt}</p>
            </div>
          </div>

          {/* Especificaciones técnicas */}
          {item.is_vehicle && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-text mb-5">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.brand && <Spec label="Marca" value={item.brand} />}
                {item.model && <Spec label="Modelo" value={item.model} />}
                {item.year && <Spec label="Año" value={item.year.toString()} />}
                {item.fuel_type && <Spec label="Combustible" value={item.fuel_type} />}
                {item.mileage && <Spec label="Kilometraje" value={`${item.mileage.toLocaleString()} km`} />}
                {item.engine_spec && <Spec label="Motor" value={item.engine_spec} />}
                {item.horsepower && <Spec label="Potencia" value={`${item.horsepower} HP`} />}
                {item.top_speed_kmh && <Spec label="Vel. Máx." value={`${item.top_speed_kmh} km/h`} />}
              </div>
            </div>
          )}

          {/* Interacción */}
          <div className="flex items-center justify-between py-4 border-t border-border/30">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${liked ? 'text-red-400' : 'text-text-secondary hover:text-red-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{likes}</span>
            </button>

            <Link
              to="/gallery"
              className="text-text-secondary hover:text-primary text-sm font-medium flex items-center gap-1"
            >
              ← Volver a la galería
            </Link>
          </div>

          {/* Comentarios */}
          <div className="mt-10 pt-6 border-t border-border/30">
            <h3 className="text-xl font-bold text-text mb-4">Comentarios ({comments.length})</h3>

            {/* Formulario */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full bg-dark border border-border rounded-2xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-primary text-text rounded-full text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {comment.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-dark/50 rounded-2xl p-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-white">{comment.user}</span>
                        <span className="text-text-secondary text-xs">· {comment.timestamp}</span>
                      </div>
                      <p className="text-text">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-dark/40 p-4 rounded-xl">
    <p className="text-text-secondary text-xs uppercase tracking-wider">{label}</p>
    <p className="text-white font-medium mt-1">{value}</p>
  </div>
);

export default UserGalleryDetail;