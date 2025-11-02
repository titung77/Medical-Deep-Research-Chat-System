import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatResponse, Source } from '../types';
import { chatService, WebSocketService } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  // Generate session ID on mount
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
  }, []);

  // Initialize WebSocket
  useEffect(() => {
    if (sessionId) {
      const ws = new WebSocketService(sessionId);
      setWsService(ws);

      ws.connect(
        (data) => {
          console.log('WebSocket message received:', data);
          
          if (data.type === 'response') {
            const response = data.data;
            setMessages(prev => {
              const updated = [...prev];
              const lastMessage = updated[updated.length - 1];
              
              if (lastMessage && lastMessage.isLoading) {
                lastMessage.isLoading = false;
                lastMessage.response = response.response;
                lastMessage.sources = response.sources;
              }
              
              return updated;
            });
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          setIsLoading(false);
        }
      );

      return () => {
        ws.disconnect();
      };
    }
  }, [sessionId]);

  const sendMessage = useCallback(async (
    message: string,
    includeWebSearch: boolean = true,
    includeLocalSearch: boolean = true
  ) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: message.trim(),
      timestamp: new Date(),
      isUser: true,
    };

    const aiMessage: ChatMessage = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: '',
      timestamp: new Date(),
      isUser: false,
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setIsLoading(true);

    try {
      // Try WebSocket first
      if (wsService && wsService.isConnected()) {
        wsService.sendMessage({
          type: 'chat',
          message: message.trim(),
          include_web_search: includeWebSearch,
          include_local_search: includeLocalSearch,
        });
      } else {
        // Fallback to REST API
        const response = await chatService.sendMessage(
          message.trim(),
          sessionId,
          includeWebSearch,
          includeLocalSearch
        );

        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          
          if (lastMessage && lastMessage.isLoading) {
            lastMessage.isLoading = false;
            lastMessage.response = response.response;
            lastMessage.sources = response.sources;
          }
          
          return updated;
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        
        if (lastMessage && lastMessage.isLoading) {
          lastMessage.isLoading = false;
          lastMessage.response = 'Sorry, I encountered an error while processing your request. Please try again.';
          lastMessage.sources = [];
        }
        
        return updated;
      });
      setIsLoading(false);
    }
  }, [sessionId, wsService]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    sessionId,
  };
};
