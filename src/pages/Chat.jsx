import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Sparkles, Clock, Volume2, Bot, User, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { quickActions } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import './Chat.css';

// ── Gemini AI Setup ──────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are **Ai Sathi** (AI साथी), a smart, friendly, and helpful digital assistant built specifically for the citizens of **Amravati city, Maharashtra, India**, but capable of answering any question from the user.

## Your Personality
- Warm, polite, and approachable
- Use emojis naturally to make conversations engaging 😊
- Be concise but informative
- When the user speaks in Marathi, respond in Marathi. When in English, respond in English.

## Your Knowledge Base — Amravati City & General Knowledge
You have deep knowledge about Amravati including:

### Hospitals & Healthcare
- Dr. PDMMC Hospital (Govt) — Shivaji Nagar, 24/7, Ph: 0721 2552353
- Shree Krishna Hospital — Rajapeth, 24/7, Ph: +91 9876543210
- Dayasagar Hospital — Navathe Square, 24/7
- IRSHA Hospital — Gadge Nagar, 24/7
- Radiant Super Speciality Hospital — Rukhmini Nagar, 24/7
- Zenith Hospital Tertiary Care Center — Walcut Compound, 24/7, Ph: 0721 2561234

### Restaurants & Food
- Aasra Restaurant — Bus Stand Road, Multi-cuisine, ⭐4.6
- The Oak Restaurant — Camp Road, Fine Dining, ⭐4.4
- Manbhavan Premium Thali — Rajkamal Square, Pure Veg, ⭐4.7
- Chinkara Restaurant — Badnera Road, Dhaba Style
- Varhadi Sugran — Shegaon Naka, Authentic Maharashtrian, ⭐4.5
- Biryani House — Near Railway Station, Famous Biryani, ⭐4.6
- CrossRoad Cafe — Shivaji Commercial Complex

### Education & Coaching
- SGBAU (Sant Gadge Baba Amravati University) — Tapovan
- GCOEA (Govt College of Engineering) — Kathora Naka
- Vidya Bharati Mahavidyalaya — Camp Road
- Sipna College of Engineering — Badnera Road
- P.R. Pote Patil College — Kathora Road
- HVPM Campus — Physical Education
- Bansal Coaching (JEE/NEET/MHT-CET)

### Government Services & Schemes
- PM-KISAN: ₹6,000/year for farmers. Docs: Aadhaar, 7/12, Bank Passbook. Office: Tahsildar
- PMFBY: Crop insurance. Office: Agriculture Office, Collectorate
- Ladki Bahin Yojana: ₹1,500/month for women (21-60, income <₹2.5L). Portal: Nari Shakti
- Ration Card: Apply at CSC or online. Timeline: 30 days
- MJPJAY: Free medical treatment up to ₹1.5L/year
- PM Awas Yojana (Urban): Housing for EWS/LIG
- Sanjay Gandhi Niradhar Pension: ₹1,500/month for elderly/disabled/widows

### Important Places & Landmarks
- Ambadevi Temple, Shri Krishna Mandir, Ekveera Devi Temple
- Chikhaldara Hill Station (nearby)
- Melghat Tiger Reserve
- Amravati Fort, Shivaji Park
- Cotton Market area

### Emergency Numbers
- Police: 100
- Ambulance: 108
- Fire: 101
- Women Helpline: 181
- Child Helpline: 1098
- District Collector Office: 0721 2662200

### Hotels & Stay
- Hotel Mehfil Inn — Camp Road, Luxury
- Hotel Excel Executive — Near Railway Station, Business
- Hotel Gouri Inn — Rajapeth Square, Affordable

## Response Guidelines
1. When asked about a place/service, provide: Name, Address, Phone, Timings, Rating if available
2. For government schemes, include: Eligibility, Documents needed, Where to apply, Timeline
3. For emergencies, respond with urgency and provide direct contact numbers
4. Answer ANY question the user asks, whether it's general knowledge, programming, math, advice, or anything else. Use your general knowledge capabilities.
5. Keep responses well-structured with bullet points and bold text for readability
6. Always be helpful and suggest related follow-up questions`;

export default function Chat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: language === 'mr'
        ? 'नमस्कार! मी **Ai Sathi** 🤖, तुमचा अमरावती डिजिटल सहाय्यक.\n\nमी तुम्हाला खालील गोष्टींमध्ये मदत करू शकतो:\n- 🏥 हॉस्पिटल व आरोग्य सेवा\n- 🍽️ रेस्टॉरंट व खाद्यपदार्थ\n- 🏛️ सरकारी योजना व सेवा\n- 📚 शिक्षण व कोचिंग\n- 📍 दिशा व ठिकाणे\n\nकाहीही विचारा!'
        : 'Hello! I\'m **Ai Sathi** 🤖, your Amravati digital assistant.\n\nI can help you with:\n- 🏥 Hospitals & Healthcare\n- 🍽️ Restaurants & Food\n- 🏛️ Government Schemes & Services\n- 📚 Education & Coaching\n- 📍 Directions & Places\n\nAsk me anything!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // ── Initialize Gemini Chat Session ────────────────────────────
  useEffect(() => {
    if (!genAI) {
      console.error('Gemini API key is missing! Set VITE_GEMINI_API_KEY in .env');
      setIsConnected(false);
      return;
    }
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: 'System instructions: ' + SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Understood! I am Ai Sathi, ready to help the citizens of Amravati and answer any question. How can I help you today? 😊' }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      });
      chatRef.current = chat;
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to initialize Gemini:', err);
      setIsConnected(false);
    }
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Text-to-Speech ────────────────────────────────────────────
  const speakText = useCallback((text) => {
    if (!isVoiceMode) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#\[\]]/g, '').replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceMode, language]);

  // ── Get AI Response via Gemini SDK ────────────────────────────
  const getAIResponse = async (query) => {
    try {
      if (!chatRef.current) {
        throw new Error('Gemini chat session not initialized');
      }

      const langHint = language === 'mr' ? ' (Please respond in Marathi)' : '';
      const result = await chatRef.current.sendMessage(query + langHint);
      const response = await result.response;
      const text = response.text();

      setIsConnected(true);
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      setIsConnected(false);
      return language === 'mr'
        ? '⚠️ माफ करा, AI सेवेशी जोडणी करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.'
        : '⚠️ Sorry, I had trouble connecting to the AI service. Please try again.';
    }
  };

  // ── Send Message ──────────────────────────────────────────────
  const handleSend = async (text = '') => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;

    const userMsg = { id: Date.now(), type: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await getAIResponse(messageText);

    const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);

    if (isVoiceMode) {
      speakText(responseText);
    }
  };

  // ── Keyboard Handler ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice Input ───────────────────────────────────────────────
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'mr'
        ? 'हा ब्राउझर व्हॉइस रिकग्निशन सपोर्ट करत नाही. कृपया Chrome वापरा.'
        : 'Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => {
        handleSend(transcript);
      }, 300);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ── Clear Chat ────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        text: language === 'mr'
          ? '🔄 चॅट रीसेट झाला! मी तुम्हाला कशी मदत करू शकतो?'
          : '🔄 Chat reset! How can I help you?',
        timestamp: new Date()
      }
    ]);

    // Reinitialize Gemini chat session
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: 'System instructions: ' + SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood! I am Ai Sathi, ready to help. 😊' }] },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        });
        chatRef.current = chat;
      } catch (err) {
        console.error('Failed to reinitialize Gemini:', err);
      }
    }
    setIsConnected(true);
  };

  // ── Format Markdown Response ──────────────────────────────────
  const formatMessage = (text) => {
    if (!text) return null;

    return text.split('\n').map((line, i) => {
      // Handle headings
      if (line.startsWith('### ')) {
        const content = line.slice(4);
        return <h4 key={i} className="msg-heading" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />;
      }
      if (line.startsWith('## ')) {
        const content = line.slice(3);
        return <h3 key={i} className="msg-heading" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />;
      }

      // Handle bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2);
        return <li key={i} className="msg-list-item" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />;
      }

      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
      if (numberedMatch) {
        return <li key={i} className="msg-list-item msg-numbered" dangerouslySetInnerHTML={{ __html: formatInline(numberedMatch[2]) }} />;
      }

      // Empty lines
      if (line.trim() === '') {
        return <br key={i} />;
      }

      // Regular paragraphs
      return <p key={i} className="msg-para" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
    });
  };

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/•/g, '&bull;');
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
            <h1>{language === 'mr' ? 'Ai Sathi चॅट' : 'Ai Sathi Chat'}</h1>
            <p className="chat-subtitle">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected
                ? (language === 'mr' ? 'Gemini AI शी जोडलेले • लाइव्ह' : 'Connected to Gemini AI • Live')
                : (language === 'mr' ? 'ऑफलाइन' : 'Disconnected')
              }
            </p>
          </div>
        </div>
        <div className="chat-lang-badges">
          <button
            className={`badge ${isVoiceMode ? 'badge-accent' : 'badge-outline'}`}
            onClick={() => {
              setIsVoiceMode(!isVoiceMode);
              if (isVoiceMode) window.speechSynthesis.cancel();
            }}
            title={language === 'mr' ? 'आवाज उत्तर टॉगल करा' : 'Toggle Voice Responses'}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            <Volume2 size={14} style={{ marginRight: '4px' }} />
            {isVoiceMode ? (language === 'mr' ? 'आवाज चालू' : 'Voice On') : (language === 'mr' ? 'आवाज बंद' : 'Voice Off')}
          </button>
          <button
            className="badge badge-outline"
            onClick={clearChat}
            style={{ cursor: 'pointer', border: 'none', marginLeft: '5px' }}
            title={language === 'mr' ? 'चॅट रीसेट करा' : 'Reset Chat'}
          >
            <RefreshCw size={14} style={{ marginRight: '4px' }} />
            {language === 'mr' ? 'रीसेट' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {/* Quick Actions — show only at start */}
        {messages.length <= 1 && (
          <div className="quick-actions animate-fade-in-up">
            <p className="quick-actions-title">{language === 'mr' ? '⚡ जलद प्रश्न:' : '⚡ Quick Questions:'}</p>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <button key={action.id} className="quick-action-btn" onClick={() => handleSend(action.query)}>
                  <span className="quick-action-icon">{action.icon}</span>
                  <div>
                    <span className="quick-action-label">{language === 'mr' ? action.labelMarathi : action.label}</span>
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
                <Bot size={16} />
              </div>
            )}
            {msg.type === 'user' && (
              <div className="message-avatar user-avatar">
                <User size={16} />
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
              <Bot size={16} />
            </div>
            <div className="message-content">
              <div className="message-bubble typing-bubble">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="typing-label">
                  {language === 'mr' ? 'Ai Sathi विचार करत आहे...' : 'Ai Sathi is thinking...'}
                </span>
              </div>
            </div>
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
            title={language === 'mr' ? 'आवाजाने बोला' : 'Speak with voice'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={language === 'mr' ? "तुमचा प्रश्न टाइप करा..." : "Type your question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            id="chat-input"
          />
          <button
            className={`send-btn ${input.trim() && !isTyping ? 'active' : ''}`}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            id="send-btn"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="chat-powered-by">
          ⚡ {language === 'mr' ? 'Google Gemini AI द्वारे संचालित' : 'Powered by Google Gemini AI'}
        </p>
      </div>
    </div>
  );
}
