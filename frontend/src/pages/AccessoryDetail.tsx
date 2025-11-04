// frontend/src/pages/AccessoryDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
  replies?: Comment[];
}

const AccessoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Captura la ubicación actual
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [accessory, setAccessory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      if (!id) {
        navigate('/accessories');
        return;
      }

      try {
        const response = await api.get(`/accessories/${id}`);
        setAccessory(response.data);

        // Comentarios simulados (reemplazar con API real cuando esté lista)
        setComments([
          {
            id: 1,
            user: 'Carlos_Racing',
            text: '¡Excelente calidad! Lo instalé en mi Porsche y quedó perfecto.',
            date: 'hace 2 días',
            replies: [
              {
                id: 101,
                user: 'AleronShop',
                text: '¡Gracias por tu comentario, Carlos! Nos alegra saber que te gustó.',
                date: 'hace 1 día',
              },
            ],
          },
          {
            id: 2,
            user: 'AutoFan99',
            text: '¿Es compatible con modelos anteriores al 2020?',
            date: 'hace 5 días',
            replies: [],
          },
        ]);
      } catch (error) {
        console.error('Error fetching accessory:', error);
        toast.error('No se pudo cargar el accesorio.');
        navigate('/accessories');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessory();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      // ✅ Redirige al login y guarda la ruta actual
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!accessory) return;
    if (quantity < 1) {
      toast.error('La cantidad debe ser al menos 1.');
      return;
    }
    if (quantity > accessory.stock) {
      toast.error(`Solo hay ${accessory.stock} unidades disponibles.`);
      return;
    }

    // ✅ Agrega al carrito (el contexto maneja la lógica de API)
    addToCart(accessory.id, quantity);
    toast.success(`¡${quantity} unidad(es) de ${accessory.name} agregadas al carrito!`);
    setQuantity(1);
  };

  const handleAddComment = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!newComment.trim()) return;
    setComments([
      { id: Date.now(), user: user.username, text: newComment, date: 'ahora', replies: [] },
      ...comments,
    ]);
    setNewComment('');
    toast.success('Comentario publicado.');
  };

  const handleReply = (commentId: number) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setReplyingTo(commentId);
  };

  const handlePostReply = (parentCommentId: number) => {
    if (!user || !newComment.trim()) return;
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              { id: Date.now(), user: user.username, text: newComment, date: 'ahora' },
            ],
          };
        }
        return comment;
      })
    );
    setNewComment('');
    setReplyingTo(null);
    toast.success('Respuesta publicada.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando accesorio...</p>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 mb-4">Accesorio no encontrado</h2>
          <button
            onClick={() => navigate('/accessories')}
            className="px-6 py-3 bg-primary text-text rounded-lg hover:bg-primary/90"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = [
    accessory.image_url || 'https://via.placeholder.com/800x600?text=Accesorio+Principal',
    'https://via.placeholder.com/800x600?text=Perspectiva+1',
    'https://via.placeholder.com/800x600?text=Perspectiva+2',
    'https://via.placeholder.com/800x600?text=Instalado',
  ];

  return (
    <div className="min-h-screen bg-dark text-text">
      <header className="bg-dark-light border-b border-border px-6 py-4">
        <button
          onClick={() => navigate('/accessories')}
          className="text-primary hover:text-primary/80 flex items-center gap-2"
        >
          ← Volver a Accesorios
        </button>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={accessory.image_url || 'https://via.placeholder.com/800x600?text=Accesorio'}
                alt={accessory.name}
                className="w-full max-h-96 object-cover rounded-lg border border-border"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img.trim()}
                  alt={`Perspectiva ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold text-text">{accessory.name}</h1>
            <p className="text-text-secondary mt-1">{accessory.category || '—'}</p>
            <div className="mt-6">
              <p className="text-3xl font-bold text-primary">${accessory.price.toLocaleString()}</p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Stock disponible</span>
                <span className={accessory.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                  {accessory.stock > 0 ? `${accessory.stock} unidades` : 'Agotado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Estado</span>
                <span className={accessory.is_published ? 'text-green-400' : 'text-red-400'}>
                  {accessory.is_published ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text mb-2">Descripción</h2>
              <p className="text-text-secondary">{accessory.description || 'Sin descripción.'}</p>
            </div>

            <div className="mt-8">
              <label className="block text-text-secondary mb-2">Cantidad:</label>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-dark border border-border rounded-md text-text hover:bg-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(accessory.stock, parseInt(e.target.value) || 1)))
                  }
                  min="1"
                  max={accessory.stock}
                  className="w-12 text-center bg-dark border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setQuantity(Math.min(accessory.stock, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center bg-dark border border-border rounded-md text-text hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <button
                disabled={accessory.stock <= 0}
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-lg font-medium ${
                  accessory.stock > 0
                    ? 'bg-primary text-text hover:bg-primary/90'
                    : 'bg-gray-600 text-white cursor-not-allowed'
                }`}
              >
                {accessory.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
              </button>
              <button
                onClick={() => navigate('/accessories')}
                className="w-full mt-3 py-3 text-primary border border-primary rounded-lg hover:bg-primary/10"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text mb-6">Comentarios ({comments.length})</h2>
          <div className="bg-dark-light p-4 rounded-lg mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 text-sm font-medium"
              >
                Publicar
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-dark-light p-4 rounded-lg border border-border/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {comment.user.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-text">{comment.user}</span>
                    <span className="text-text-secondary text-sm ml-2">· {comment.date}</span>
                  </div>
                </div>
                <p className="text-text-secondary mb-4">{comment.text}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Responder
                  </button>
                </div>
                {replyingTo === comment.id && (
                  <div className="mt-4 p-3 bg-dark/50 rounded-lg">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={`Responde a ${comment.user}...`}
                      className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="mr-2 px-3 py-1 text-text-secondary text-xs font-medium hover:text-text"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        className="px-3 py-1 bg-primary text-text rounded-lg text-xs font-medium hover:bg-primary/90"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-border/30 space-y-4">
                    <h4 className="text-sm font-medium text-text">Respuestas ({comment.replies.length})</h4>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-dark/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {reply.user.charAt(0)}
                          </div>
                          <span className="font-medium text-text">{reply.user}</span>
                          <span className="text-text-secondary text-xs">· {reply.date}</span>
                        </div>
                        <p className="text-text-secondary">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryDetail;