// frontend/src/hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  consultation_id: number;
  content: string;
  created_at: string;
  sender: { username: string };
}

export const useChat = (userId: number, receiverId: number, consultationId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = `ws://localhost:8000/api/messages/ws/${userId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.error) {
        toast.error(msg.error);
      } else if (msg.consultation_id === consultationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    ws.current.onerror = () => toast.error('Error en la conexión de chat');
    ws.current.onclose = () => setConnected(false);

    // Reemplaza esa línea por:
fetch(`${import.meta.env.VITE_API_URL}/messages/consultation/${consultationId}`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => setMessages(data))
.catch(() => toast.error('No se pudo cargar el historial'));
    return () => {
      ws.current?.close();
    };
  }, [userId, receiverId, consultationId]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          receiver_id: receiverId,
          consultation_id: consultationId,
          content,
        })
      );
    }
  };

  return { messages, connected, sendMessage };
};