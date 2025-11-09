// frontend/src/pages/UserGalleryDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  createGalleryComment,
  getGalleryComments,
  GalleryComment,
} from '../services/galleryCommentApi';
import { likeGalleryEntry } from '../services/userCarGalleryApi';

const UserGalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    if (!id) return;
    try {
      const data = await getGalleryComments(Number(id));
      setComments(data);
    } catch (err) {
      toast.error('No se pudieron cargar los comentarios.');
    }
  };

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
    loadComments();
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

  const handleAddComment = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await createGalleryComment(Number(id), newComment, replyingTo || undefined);
      // ✅ Recargamos TODO para garantizar que las respuestas aparezcan
      await loadComments();
      setNewComment('');
      setReplyingTo(null);
      toast.success('Comentario publicado.');
    } catch (err) {
      toast.error('Error al publicar el comentario.');
      console.error(err);
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
        <div className="flex items-center justify-between mb-8">
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

        {/* Sección de comentarios */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-6">Comentarios ({comments.length})</h2>
          <div className="bg-dark-light p-4 rounded-lg mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? 'Escribe tu comentario...' : 'Inicia sesión para comentar'}
              disabled={!user}
              className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={!user || !newComment.trim() || submitting}
                className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
              >
                {submitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-dark-light p-4 rounded-lg border border-border/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {comment.username.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-text">{comment.username}</span>
                    <span className="text-text-secondary text-sm ml-2">
                      · {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-text-secondary mb-4">{comment.content}</p>
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
                      placeholder={`Responde a ${comment.username}...`}
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
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || submitting}
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
                            {reply.username.charAt(0)}
                          </div>
                          <span className="font-medium text-text">{reply.username}</span>
                          <span className="text-text-secondary text-xs">
                            · {new Date(reply.created_at).toLocaleDateString()}
                          </span>
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

export default UserGalleryDetail;