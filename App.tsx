import React, { useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { useChat } from './hooks/useChat';

const App: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 shadow-md">
        <h1 className="text-xl font-bold text-center text-gray-200">Gemini Chat Bot</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      {error && (
        <div className="bg-red-900 border-t border-red-700 text-white p-3 text-center text-sm">
          <p className="font-bold">An error occurred:</p>
          <p>{error}</p>
        </div>
      )}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
