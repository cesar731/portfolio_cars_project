 
import React, { useState } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'advisor' | 'system';
  text: string;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'system', text: '¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'advisor',
        text: 'Gracias por contactarnos. Un asesor te responderá en breve.'
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-lg flex flex-col h-96">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg font-bold text-center">
        Asistencia en Línea
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-grow mr-2 px-3 py-1 border rounded-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-full px-4 py-1 text-sm"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;