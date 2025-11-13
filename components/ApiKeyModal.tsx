import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md mx-auto border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Enter Gemini API Key</h2>
        <p className="text-gray-400 mb-6">
          To use this chat bot, please provide your API key. Your key is used for this session and not stored. The application logic will use the key configured in the environment.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your API Key"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!key.trim()}
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
