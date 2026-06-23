// // src/components/ChatWindow.jsx
// import React, { useState, useRef } from 'react';
// import axios from 'axios';

// function Sources({ chunks }) {
//   const [isOpen, setIsOpen] = useState(false);

//   if (!chunks || chunks.length === 0) return null;

//   return (
//     <div className="sources-container">
//       <button onClick={() => setIsOpen(!isOpen)} className="sources-button">
//         {isOpen ? 'Hide Sources' : 'Show Sources'}
//       </button>
//       {isOpen && (
//         <div className="sources-content">
//           <h4>Sources:</h4>
//           {chunks.map((chunk, index) => (
//             <div key={index} className="source-chunk">
//               <p>{chunk}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function ChatWindow({ activeMode, documentId }) {
//   const [messages, setMessages] = useState([
//     { sender: 'ai', text: 'I have read your document. Ask me anything!' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // session_id starts null — backend generates it on first message
//   const sessionIdRef = useRef(null);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'user', text: input };
//     const updatedMessages = [...messages, userMessage];
//     setMessages(updatedMessages);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // Build history in the format backend expects: {role, content}
//       // Exclude the initial AI greeting (index 0) and the message we just added
//       const history = updatedMessages
//         .slice(1, -1)           // skip greeting, skip current user message
//         .slice(-8)              // last 8 turns max
//         .map(msg => ({
//           role: msg.sender === 'user' ? 'user' : 'assistant',
//           content: msg.text
//         }));

//       const payload = {
//         question: input,
//         history,
//         use_case: activeMode,
//         document_id: documentId,
//         // send session_id if we already have one, omit on first message
//         ...(sessionIdRef.current && { session_id: sessionIdRef.current })
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/chat`,
//         payload
//       );
//       const data = response.data;

//       // Store session_id from first response and reuse forever
//       if (data.session_id && !sessionIdRef.current) {
//         sessionIdRef.current = data.session_id;
//       }

//       const aiMessage = {
//         sender: 'ai',
//         text: data.answer || 'Sorry, I encountered an error.',
//         sources: data.sources
//       };
//       setMessages(prev => [...prev, aiMessage]);

//     } catch (error) {
//       console.error('Chat error:', error);
//       setMessages(prev => [
//         ...prev,
//         { sender: 'ai', text: 'Failed to get a response from the server.' }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') handleSend();
//   };

//   const handleNewChat = async () => {
//     // Clear session on backend
//     if (sessionIdRef.current) {
//       try {
//         await axios.delete(
//           `${import.meta.env.VITE_BASE_URL}/session/${sessionIdRef.current}`
//         );
//       } catch (e) {
//         console.error('Failed to clear session:', e);
//       }
//       sessionIdRef.current = null;
//     }
//     // Reset messages to initial state
//     setMessages([
//       { sender: 'ai', text: 'I have read your document. Ask me anything!' }
//     ]);
//   };

//   return (
//     <div className="chat-window">
//       <div className="messages-area">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message-container ${msg.sender}`}>
//             <div className={`message ${msg.sender}`}>
//               <p>{msg.text}</p>
//             </div>
//             {msg.sender === 'ai' && <Sources chunks={msg.sources} />}
//           </div>
//         ))}
//         {isLoading && (
//         <div className="typing-indicator">
//           <span></span><span></span><span></span>
//         </div>
//       )}
//       </div>

//       <div className="input-area">
//         <button
//           onClick={handleNewChat}
//           className="new-chat-btn"
//           title="Clear conversation"
//         >
//           New chat
//         </button>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask a question..."
//           disabled={isLoading}
//         />
//         <button onClick={handleSend} disabled={isLoading}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;


// src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

/* ── timestamp helper ─────────────────────────────────────────── */
function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Sources accordion ────────────────────────────────────────── */
function Sources({ chunks }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="cw-sources">
      <button
        className={`cw-sources-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="cw-sources-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M2 8h8M2 12h6" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round"/>
          </svg>
        </span>
        {chunks.length} source{chunks.length > 1 ? 's' : ''}
        <span className={`cw-chevron ${isOpen ? 'open' : ''}`}>
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      <div className={`cw-sources-body ${isOpen ? 'open' : ''}`}>
        {chunks.map((chunk, i) => (
          <div key={i} className="cw-source-item">
            <span className="cw-source-num">{i + 1}</span>
            <p>{chunk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AI avatar ────────────────────────────────────────────────── */
function AiAvatar() {
  return (
    <div className="cw-avatar cw-avatar-ai" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="9" cy="13" r="2" fill="currentColor"/>
        <circle cx="15" cy="13" r="2" fill="currentColor"/>
        <path d="M9 4v3M15 4v3M7 4h2M13 4h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── User avatar ──────────────────────────────────────────────── */
function UserAvatar() {
  return (
    <div className="cw-avatar cw-avatar-user" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Send icon ────────────────────────────────────────────────── */
function SendIcon() {
  return (
    <svg className="cw-send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Plus / New chat icon ─────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   ChatWindow
═══════════════════════════════════════════════════════════════ */
function ChatWindow({ activeMode, documentId }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'I have read your document. Ask me anything!',
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input, time: timeNow() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    inputRef.current?.focus();

    try {
      const history = updatedMessages
        .slice(1, -1)
        .slice(-8)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));

      const payload = {
        question: input,
        history,
        use_case: activeMode,
        document_id: documentId,
        ...(sessionIdRef.current && { session_id: sessionIdRef.current }),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat`,
        payload
      );
      const data = response.data;

      if (data.session_id && !sessionIdRef.current) {
        sessionIdRef.current = data.session_id;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'Sorry, I encountered an error.',
          sources: data.sources,
          time: timeNow(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Failed to get a response from the server.',
          time: timeNow(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
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
    setMessages([
      { sender: 'ai', text: 'I have read your document. Ask me anything!', time: timeNow() },
    ]);
  };

  return (
    <div className="cw-root">

      {/* ── Messages ─────────────────────────────────────────── */}
      <div className="cw-messages">

        {messages.map((msg, i) => (
          <div key={i} className={`cw-row cw-row--${msg.sender}`}>

            {msg.sender === 'ai' && <AiAvatar />}

            <div className="cw-bubble-wrap">
              <div className={`cw-bubble cw-bubble--${msg.sender}`}>
                <p className="cw-text">{msg.text}</p>
              </div>
              {msg.time && (
                <span className="cw-time">{msg.time}</span>
              )}
              {msg.sender === 'ai' && <Sources chunks={msg.sources} />}
            </div>

            {msg.sender === 'user' && <UserAvatar />}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="cw-row cw-row--ai">
            <AiAvatar />
            <div className="cw-bubble-wrap">
              <div className="cw-bubble cw-bubble--ai cw-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="cw-divider" />

      {/* ── Input bar ────────────────────────────────────────── */}
      <div className="cw-input-bar">
        <button
          className="cw-new-btn"
          onClick={handleNewChat}
          title="New conversation"
        >
          <PlusIcon />
          <span>New</span>
        </button>

        <div className="cw-input-wrap">
          <textarea
            ref={inputRef}
            className="cw-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the document…"
            disabled={isLoading}
            rows={1}
          />
        </div>

        <button
          className={`cw-send-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          title="Send"
        >
          {isLoading ? (
            <span className="cw-spinner" />
          ) : (
            <SendIcon />
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;