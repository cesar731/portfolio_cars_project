// frontend/src/pages/AccessoryDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  createAccessoryComment,
  getAccessoryComments,
  Comment as CommentType,
} from '../services/accessoryCommentApi';

const AccessoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [accessory, setAccessory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FILES_URL = import.meta.env.VITE_FILES_URL;

  useEffect(() => {
    const fetchAccessory = async () => {
      if (!id) {
        navigate('/accessories');
        return;
      }
      try {
        const response = await api.get(`/accessories/${id}`);
        setAccessory(response.data);
      } catch (error) {
        console.error('Error fetching accessory:', error);
        toast.error('No se pudo cargar el accesorio.');
        navigate('/accessories');
      } finally {
        setLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        const data = await getAccessoryComments(Number(id));
        setComments(data);
      } catch (err) {
        // si falla, mostramos vacío
      }
    };

    fetchAccessory();
    loadComments();
  }, [id, navigate]);

  // Multi-imágenes
  const imageUrls: string[] =
    accessory?.images && accessory.images.length > 0
      ? accessory.images.map((img: any) => `${FILES_URL}${img.image_url}`)
      : accessory?.image_url
      ? [`${FILES_URL}${accessory.image_url}`]
      : [`${FILES_URL}/uploads/no-image.png`];

  const [mainImage, setMainImage] = useState<string>(imageUrls[0] ?? `${FILES_URL}/uploads/no-image.png`);

  // Cuando accessory cambia recargar mainImage
  useEffect(() => {
    if (imageUrls && imageUrls.length > 0) setMainImage(imageUrls[0]);
  }, [accessory?.images, accessory?.image_url]);

  const handleAddToCart = () => {
    if (!user) {
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
    addToCart(accessory.id, quantity);
    toast.success(`¡${quantity} unidad(es) de ${accessory.name} agregadas al carrito!`);
    setQuantity(1);
  };

  const handleAddComment = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const comment = await createAccessoryComment(Number(id), newComment, replyingTo || undefined);
      if (replyingTo) {
        setComments(prev => prev.map(c => c.id === replyingTo ? { ...c, replies: [...(c.replies || []), comment] } : c));
      } else {
        setComments(prev => [comment, ...prev]);
      }
      setNewComment('');
      setReplyingTo(null);
      toast.success('Comentario publicado.');
    } catch (err) {
      toast.error('Error al publicar el comentario.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setReplyingTo(commentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando accesorio...</p>
      </div>
    );
  }

  if (!accessory) return null;

  return (
    <div className="min-h-screen bg-dark text-text">
      <header className="bg-dark-light border-b border-border px-6 py-4">
        <button onClick={() => navigate('/accessories')} className="text-primary hover:text-primary/80 flex items-center gap-2">← Volver a Accesorios</button>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img src={mainImage} alt={accessory.name} className="w-full max-h-96 object-contain rounded-lg border border-border" />

            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {imageUrls.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Vista ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${imgUrl === mainImage ? 'border-primary' : 'border-border'}`}
                  onClick={() => setMainImage(imgUrl)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold">{accessory.name}</h1>
            <p className="text-text-secondary">{accessory.category || '—'}</p>

            <p className="text-3xl font-bold text-primary mt-6">${accessory.price.toLocaleString()}</p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Stock disponible</span>
                <span className={accessory.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                  {accessory.stock > 0 ? `${accessory.stock} unidades` : 'Agotado'}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-text-secondary mb-2">Cantidad:</label>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-dark border border-border rounded-md">-</button>
                <input type="number" value={quantity} min="1" max={accessory.stock} onChange={e => setQuantity(Math.max(1, Math.min(accessory.stock, parseInt(e.target.value) || 1)))} className="w-12 text-center bg-dark border border-border rounded-md text-text" />
                <button onClick={() => setQuantity(Math.min(accessory.stock, quantity + 1))} className="w-8 h-8 flex items-center justify-center bg-dark border border-border rounded-md">+</button>
              </div>
              <button disabled={accessory.stock <= 0} onClick={handleAddToCart} className={`w-full py-3 rounded-lg font-medium ${accessory.stock > 0 ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600 cursor-not-allowed'}`}>{accessory.stock > 0 ? 'Agregar al carrito' : 'Agotado'}</button>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text mb-6">Comentarios ({comments.length})</h2>

          <div className="mb-6">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} placeholder="Escribe un comentario..." className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => { setNewComment(''); setReplyingTo(null); }} className="px-3 py-1 text-text-secondary">Cancelar</button>
              <button onClick={handleAddComment} disabled={!newComment.trim() || submitting} className="px-3 py-1 bg-primary text-text rounded-lg">Enviar</button>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-dark-light p-4 rounded-lg border border-border/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{comment.username.charAt(0)}</div>
                  <div>
                    <span className="font-medium text-text">{comment.username}</span>
                    <span className="text-text-secondary text-sm ml-2">· {new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-text-secondary mb-4">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleReply(comment.id)} className="text-primary hover:text-primary/80 text-sm font-medium">Responder</button>
                </div>
                {replyingTo === comment.id && (
                  <div className="mt-4 p-3 bg-dark/50 rounded-lg">
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Responde a ${comment.username}...`} className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => setReplyingTo(null)} className="mr-2 px-3 py-1 text-text-secondary text-xs font-medium hover:text-text">Cancelar</button>
                      <button onClick={handleAddComment} disabled={!newComment.trim() || submitting} className="px-3 py-1 bg-primary text-text rounded-lg text-xs font-medium">Enviar</button>
                    </div>
                  </div>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-border/30 space-y-4">
                    <h4 className="text-sm font-medium text-text">Respuestas ({comment.replies.length})</h4>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-dark/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">{reply.username.charAt(0)}</div>
                          <span className="font-medium text-text">{reply.username}</span>
                          <span className="text-text-secondary text-xs">· {new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-text-secondary">{reply.content}</p>
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
