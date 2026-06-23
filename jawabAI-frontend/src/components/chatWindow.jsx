// src/components/ChatWindow.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

function Sources({ chunks }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="sources-container">
      <button onClick={() => setIsOpen(!isOpen)} className="sources-button">
        {isOpen ? 'Hide Sources' : 'Show Sources'}
      </button>
      {isOpen && (
        <div className="sources-content">
          <h4>Sources:</h4>
          {chunks.map((chunk, index) => (
            <div key={index} className="source-chunk">
              <p>{chunk}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatWindow({ activeMode, documentId }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'I have read your document. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // session_id starts null — backend generates it on first message
  const sessionIdRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build history in the format backend expects: {role, content}
      // Exclude the initial AI greeting (index 0) and the message we just added
      const history = updatedMessages
        .slice(1, -1)           // skip greeting, skip current user message
        .slice(-8)              // last 8 turns max
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const payload = {
        question: input,
        history,
        use_case: activeMode,
        document_id: documentId,
        // send session_id if we already have one, omit on first message
        ...(sessionIdRef.current && { session_id: sessionIdRef.current })
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat`,
        payload
      );
      const data = response.data;

      // Store session_id from first response and reuse forever
      if (data.session_id && !sessionIdRef.current) {
        sessionIdRef.current = data.session_id;
      }

      const aiMessage = {
        sender: 'ai',
        text: data.answer || 'Sorry, I encountered an error.',
        sources: data.sources
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Failed to get a response from the server.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleSend();
  };

  const handleNewChat = async () => {
    // Clear session on backend
    if (sessionIdRef.current) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/session/${sessionIdRef.current}`
        );
      } catch (e) {
        console.error('Failed to clear session:', e);
      }
      sessionIdRef.current = null;
    }
    // Reset messages to initial state
    setMessages([
      { sender: 'ai', text: 'I have read your document. Ask me anything!' }
    ]);
  };

  return (
    <div className="chat-window">
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.sender}`}>
            <div className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
            {msg.sender === 'ai' && <Sources chunks={msg.sources} />}
          </div>
        ))}
        {isLoading && <div className="message ai"><p>Thinking...</p></div>}
      </div>

      <div className="input-area">
        <button
          onClick={handleNewChat}
          className="new-chat-btn"
          title="Clear conversation"
        >
          New chat
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;