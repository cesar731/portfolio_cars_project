// frontend/src/pages/ChatPage.tsx
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useState, useRef, useEffect } from 'react';

const ChatPage = () => {
  const { user } = useAuth();
  const { advisorId } = useParams<{ advisorId: string }>();
  const navigate = useNavigate();
  const receiverId = Number(advisorId);
  const { messages, connected, sendMessage } = useChat(user?.id!, receiverId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col">
      <header className="bg-dark-light border-b border-border p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">←</button>
        <h2 className="text-xl">Chat con Asesor</h2>
        <span className={`ml-2 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? 'En línea' : 'Desconectado'}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
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
              <p>{msg.content}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-dark-light">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 bg-dark border border-border rounded text-text"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-text rounded hover:bg-primary/90"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;