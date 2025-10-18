// frontend/src/pages/UserGalleryDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserGalleryItem } from '../services/userCarGalleryApi';
import { toast } from 'react-hot-toast';

const UserGalleryDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<{ id: number; text: string; user: string; timestamp: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getUserGalleryItem(Number(id));
        setItem(data);
        setLikes(data.likes);
        setLiked(false);

        // Simular comentarios (como no hay backend, los generamos)
        setComments([
          { id: 1, text: "¡Increíble auto! ¿Dónde lo conseguiste?", user: "Carlos_Racing", timestamp: "2h" },
          { id: 2, text: "Ese color es espectacular. ¿Es original?", user: "AutoFan99", timestamp: "5h" },
        ]);
      } catch (error) {
        console.error('Error fetching gallery item:', error);
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
    if (newComment.trim() === '') return;
    const comment = {
      id: comments.length + 1,
      text: newComment,
      user: "Tú", // En producción, sería el nombre del usuario logueado
      timestamp: "Ahora",
    };
    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comentario publicado');
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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Autor y Fecha */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-dark-light rounded-xl border border-border">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {item.user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-white">{item.user?.username || 'Usuario anónimo'}</h3>
                <span className="text-text-secondary text-sm">@{item.user?.username?.toLowerCase() || 'usuario'}</span>
              </div>
              <p className="text-text-secondary text-sm">{createdAt}</p>
            </div>
          </div>

          {/* Especificaciones Técnicas (SOLO SI ES UN AUTO) */}
          {item.is_vehicle && (
            <div className="bg-dark-light p-6 rounded-xl border border-border mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {item.brand && <SpecRow label="Marca" value={item.brand} />}
                {item.model && <SpecRow label="Modelo" value={item.model} />}
                {item.year && <SpecRow label="Año" value={item.year.toString()} />}
                {item.fuel_type && <SpecRow label="Combustible" value={item.fuel_type} />}
                {item.mileage && <SpecRow label="Kilometraje" value={`${item.mileage.toLocaleString()} km`} />}
                {item.engine_spec && <SpecRow label="Motor" value={item.engine_spec} />}
                {item.horsepower && <SpecRow label="Potencia" value={`${item.horsepower} HP`} />}
                {item.top_speed_kmh && <SpecRow label="Velocidad Máxima" value={`${item.top_speed_kmh} km/h`} />}
              </div>
            </div>
          )}

          {/* Sección de Interacción (Like + Comentar) */}
          <div className="flex items-center justify-between py-3 border-y border-border my-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 group`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${liked ? 'text-red-500 fill-current' : 'text-text-secondary group-hover:text-red-500'}`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-medium">{likes}</span>
            </button>

            {/* ✅ ¡BOTÓN CAMBIADO A COMENTAR! */}
            <button className="flex items-center space-x-2 text-text-secondary hover:text-primary group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{comments.length}</span>
            </button>
          </div>

          {/* ✅ ¡NUEVA SECCIÓN DE COMENTARIOS! */}
          <div className="space-y-6 mt-8">
            <h3 className="text-xl font-bold text-text">Comentarios</h3>

            {/* Formulario para nuevo comentario */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full bg-dark-light border border-border rounded-2xl px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-primary text-text rounded-full text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de comentarios */}
            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {comment.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-dark-light rounded-2xl p-4 border border-border">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-white">{comment.user}</span>
                        <span className="text-text-secondary text-sm">@{comment.user.toLowerCase()}</span>
                        <span className="text-text-secondary text-sm">·</span>
                        <span className="text-text-secondary text-sm">{comment.timestamp}</span>
                      </div>
                      <p className="text-text">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-between mt-12 pt-6 border-t border-border">
            <Link
              to="/gallery"
              className="px-6 py-3 border border-text-secondary text-text-secondary hover:bg-text-secondary/10 rounded-lg transition-colors"
            >
              ← Volver a la Galería
            </Link>
            <Link
              to="/gallery/new"
              className="px-6 py-3 bg-green-600 text-text rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Publicar Automóvil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para las filas de especificaciones
const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-text-secondary">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default UserGalleryDetail;