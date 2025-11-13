import { useState, useRef, useCallback } from 'react';
import { Message, MessageRole } from '../types';
import { GoogleGenAI, Chat } from '@google/genai';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRole.MODEL,
      content: "Hello! I'm a Gemini-powered chatbot. Ask me anything!",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    const newUserMessage: Message = { role: MessageRole.USER, content: message };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      if (!chatRef.current) {
        // Fix: The constructor for GoogleGenAI expects an object with an apiKey property.
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          // Optionally, add system instructions here
        });
      }
      
      const chat = chatRef.current;
      const resultStream = await chat.sendMessageStream({ message });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: MessageRole.MODEL, content: '' }]);

      for await (const chunk of resultStream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(errorMessage);
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === MessageRole.MODEL && lastMessage.content === '') {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = `Sorry, something went wrong: ${errorMessage}`;
          return newMessages;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};
