import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  sources?: any[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        include_web_search: true,
        include_local_search: true
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🏥 Medical Deep-Research Chat System</h1>
        <p>AI-powered medical research assistant</p>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
            <h2>Welcome to Medical Research Assistant</h2>
            <p>Ask me about medical topics, treatments, or research findings.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
            <div>{message.text}</div>
            {message.sources && message.sources.length > 0 && (
              <div className="sources">
                <strong>Sources:</strong>
                {message.sources.map((source, index) => (
                  <a 
                    key={index} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    [{index + 1}] {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="loading"></div>
            <span style={{ marginLeft: '0.5rem' }}>Thinking...</span>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about medical topics, research, treatments..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
