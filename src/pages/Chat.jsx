import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import { chatResponses, quickActions } from '../data/mockData';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: chatResponses.greetings[0], timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('hospital') || q.includes('हॉस्पिटल') || q.includes('doctor')) return chatResponses.hospital;
    if (q.includes('biryani') || q.includes('restaurant') || q.includes('food') || q.includes('खाणे')) return chatResponses.biryani;
    if (q.includes('event') || q.includes('कार्यक्रम') || q.includes('weekend')) return chatResponses.events;
    if (q.includes('pm-kisan') || q.includes('kisan') || q.includes('किसान') || q.includes('scheme') || q.includes('योजना')) return chatResponses.pmkisan;
    return chatResponses.default;
  };

  const handleSend = (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = { id: Date.now(), type: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResp = getAIResponse(messageText);
      const botMsg = { id: Date.now() + 1, type: 'bot', text: aiResp.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setSuggestions(aiResp.suggestions || []);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'mr-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/•/g, '&bull;');
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="page-container chat-page">
      {/* Header */}
      <div className="chat-header animate-fade-in-down">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <Sparkles size={24} />
          </div>
          <div>
            <h1>Ai Sathi Chat</h1>
            <p className="marathi-text">अमरावतीबद्दल काहीही विचारा • Ask anything about Amravati</p>
          </div>
        </div>
        <div className="chat-lang-badges">
          <span className="badge badge-accent">मराठी</span>
          <span className="badge badge-primary">English</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="quick-actions animate-fade-in-up">
            <p className="quick-actions-title">Quick Questions / जलद प्रश्न:</p>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <button key={action.id} className="quick-action-btn" onClick={() => handleSend(action.query)}>
                  <span className="quick-action-icon">{action.icon}</span>
                  <div>
                    <span className="quick-action-label">{action.label}</span>
                    <span className="quick-action-marathi marathi-text">{action.labelMarathi}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={msg.id} className={`message ${msg.type}`} style={{ animationDelay: `${idx * 50}ms` }}>
            {msg.type === 'bot' && (
              <div className="message-avatar bot-avatar">
                <Sparkles size={16} />
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                {formatMessage(msg.text)}
              </div>
              <span className="message-time">
                <Clock size={10} />
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="message bot typing-message">
            <div className="message-avatar bot-avatar">
              <Sparkles size={16} />
            </div>
            <div className="message-content">
              <div className="message-bubble typing-bubble">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && !isTyping && (
          <div className="suggestions animate-fade-in-up">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-btn" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoice}
            id="voice-toggle"
            title="Marathi voice input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Type in Marathi or English... / मराठी किंवा इंग्रजीत टाइप करा..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            id="chat-input"
          />
          <button
            className={`send-btn ${input.trim() ? 'active' : ''}`}
            onClick={() => handleSend()}
            disabled={!input.trim()}
            id="send-btn"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
