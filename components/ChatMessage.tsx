import React from 'react';
import { Message, MessageRole } from '../types';

const UserIcon = () => (
  <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  </div>
);

const ModelIcon = () => (
  <div className="w-8 h-8 flex-shrink-0 bg-purple-500 rounded-full flex items-center justify-center">
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
    </svg>
  </div>
);

const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/g).filter(Boolean);
  
    return (
      <div className="prose prose-invert prose-sm max-w-none">
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const codeBlock = part.slice(3, -3).trim();
            const languageMatch = codeBlock.match(/^[a-z]+\n/);
            const language = languageMatch ? languageMatch[0].trim() : '';
            const code = languageMatch ? codeBlock.substring(language.length + 1) : codeBlock;
            
            return (
              <div key={index} className="bg-black rounded-md my-2">
                <div className="text-xs text-gray-400 px-4 py-1 bg-gray-800 rounded-t-md flex justify-between items-center">
                  <span>{language || 'code'}</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto"><code className={`language-${language}`}>{code}</code></pre>
              </div>
            );
          }
          return part.split('\n').map((line, i) => <p key={`${index}-${i}`} className="my-0">{line || '\u00A0'}</p>);
        })}
      </div>
    );
  };

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  if (message.role === MessageRole.MODEL && message.content === '') {
    return (
      <div className="flex items-start gap-4 my-4">
        <ModelIcon />
        <div className="max-w-xl xl:max-w-3xl rounded-lg px-4 py-3 shadow-md bg-gray-700 text-gray-200">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <ModelIcon />}
      <div
        className={`max-w-xl xl:max-w-3xl rounded-xl px-4 py-3 shadow-md text-base ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-200'
        }`}
      >
        <ContentRenderer content={message.content} />
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

export default ChatMessage;
