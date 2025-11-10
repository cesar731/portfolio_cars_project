// frontend/src/pages/ChatPage.tsx
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useChat } from '../hooks/useChat';

const ChatPage = () => {
  const { user } = useAuth();
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();

  if (!user || !consultationId) {
    navigate('/login', { replace: true });
    return null;
  }

  const consultId = Number(consultationId);
  if (isNaN(consultId)) {
    toast.error('ID de consulta inválido');
    navigate('/my-consultations', { replace: true });
    return null;
  }

  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [consultationData, setConsultationData] = useState<any>(null);

  useEffect(() => {
    const validateChatAccess = async () => {
      try {
        const res = await api.get(`/consultations/${consultId}`);
        const consult = res.data;
        setConsultationData(consult);

        const isUser = consult.user_id === user.id;
        const isAdvisor = consult.advisor_id === user.id;
        const isValid = consult.status === 'responded' && (isUser || isAdvisor);

        if (!isValid) {
          toast.error('No tienes acceso a este chat.');
          navigate('/my-consultations', { replace: true });
          return;
        }

        const otherUserId = isUser ? consult.advisor_id : consult.user_id;
        setReceiverId(otherUserId);
      } catch (err) {
        toast.error('Error al verificar acceso al chat.');
        navigate('/my-consultations', { replace: true });
      }
    };
    validateChatAccess();
  }, [user.id, consultId, navigate]);

  const { messages, connected, sendMessage } = useChat(
    user.id,
    receiverId!,
    consultId
  );

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  if (receiverId === null) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <p className="text-text-secondary">Cargando chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col">
      <header className="bg-dark-light border-b border-border p-4 flex items-center">
        <button
          onClick={() => navigate('/my-consultations')}
          className="mr-4 text-text hover:text-primary transition-colors"
          aria-label="Volver"
        >
          ←
        </button>
        <h2 className="text-xl font-medium">
          Chat de Consulta: {consultationData?.subject || 'Sin asunto'}
        </h2>
        <span className={`ml-2 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? 'En línea' : 'Desconectado'}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-text-secondary text-center py-4">Inicia la conversación...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender_id === user.id
                    ? 'bg-primary text-text'
                    : 'bg-dark-light border border-border text-text'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-dark-light">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!input.trim() || !connected}
            className="px-4 py-2 bg-primary text-text rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;