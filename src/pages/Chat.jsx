import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Mic, MicOff, Sparkles, Clock, Volume2, Bot, User, RefreshCw, Wifi, WifiOff, Image, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { quickActions } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

// ── Gemini AI Setup ──────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const GEMINI_MODEL = 'gemini-2.5-flash'; // Confirmed working model

const SYSTEM_PROMPT = `You are **Ai Sathi** (AI साथी), a smart, friendly, and helpful digital assistant built specifically for the citizens of **Amravati city, Maharashtra, India**, but capable of answering any question from the user.

## Your Personality
- Warm, polite, and approachable
- Use emojis naturally to make conversations engaging 😊
- Be concise but informative

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
  const { requireAuth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const getWelcomeText = useCallback(() => {
    if (language === 'mr') {
      return 'नमस्कार! मी **Ai Sathi** 🤖, तुमचा अमरावती डिजिटल सहाय्यक.\n\nमी तुम्हाला खालील गोष्टींमध्ये मदत करू शकतो:\n- 🏥 हॉस्पिटल व आरोग्य सेवा\n- 🍽️ रेस्टॉरंट व खाद्यपदार्थ\n- 🏛️ सरकारी योजना व सेवा\n- 📚 शिक्षण व कोचिंग\n- 📍 दिशा व ठिकाणे\n\nकाहीही विचारा!';
    } else if (language === 'hi') {
      return 'नमस्ते! मैं **Ai Sathi** 🤖, आपका अमरावती डिजिटल सहायक।\n\nमैं आपकी निम्नलिखित चीज़ों में मदद कर सकता हूँ:\n- 🏥 अस्पताल और स्वास्थ्य सेवा\n- 🍽️ रेस्तरां और भोजन\n- 🏛️ सरकारी योजनाएं और सेवाएं\n- 📚 शिक्षा और कोचिंग\n- 📍 दिशा-निर्देश और स्थान\n\nकुछ भी पूछें!';
    }
    return 'Hello! I\'m **Ai Sathi** 🤖, your Amravati digital assistant.\n\nI can help you with:\n- 🏥 Hospitals & Healthcare\n- 🍽️ Restaurants & Food\n- 🏛️ Government Schemes & Services\n- 📚 Education & Coaching\n- 📍 Directions & Places\n\nAsk me anything!';
  }, [language]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: getWelcomeText(),
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

  // Update welcome message if user switches language before chatting
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 1) {
        return [{
          id: 1,
          type: 'bot',
          text: getWelcomeText(),
          timestamp: new Date()
        }];
      }
      return prev;
    });
  }, [language, getWelcomeText]);

  // ── Initialize Gemini Chat Session ────────────────────────────
  useEffect(() => {
    if (!genAI) {
      console.error('Gemini API key is missing! Set VITE_GEMINI_API_KEY in .env');
      setIsConnected(false);
      return;
    }
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: 'System instructions: ' + SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Understood! I am Ai Sathi, ready to help the citizens of Amravati and answer any question. How can I help you today? 😊' }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      });
      chatRef.current = chat;
      setIsConnected(true);
      console.log('✅ Gemini API connected successfully using model:', GEMINI_MODEL);
    } catch (err) {
      console.error('❌ Failed to initialize Gemini:', err);
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
    
    const targetLang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;
    
    // Get voices (might need to handle async loading in some browsers)
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      // Look for exact match, then language match, then any Indian voice
      const preferredVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase() === targetLang.toLowerCase()) 
                          || voices.find(v => v.lang.toLowerCase().startsWith(language.toLowerCase()))
                          || (language === 'mr' || language === 'hi' ? voices.find(v => v.lang.includes('IN')) : null);
                          
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    utterance.rate = (language === 'mr' || language === 'hi') ? 0.9 : 1.0; 
    window.speechSynthesis.speak(utterance);
  }, [isVoiceMode, language]);
  
  // Ensure voices are loaded for Chrome/Android
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  // ── Image Upload ──────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Get AI Response via Gemini SDK ────────────────────────────
  const getAIResponse = async (query, base64Image = null) => {
    try {
      if (!chatRef.current) {
        throw new Error('Gemini chat session not initialized');
      }

      const langHint = language === 'mr' 
        ? ' (CRITICAL: You MUST respond entirely in Marathi language using Devanagari script. Do not use English words.)' 
        : language === 'hi'
        ? ' (CRITICAL: You MUST respond entirely in Hindi language using Devanagari script. Do not use English words.)'
        : ' (Please respond entirely in English.)';
      const fullQuery = query + langHint;
      
      let result;
      if (base64Image) {
        const base64Data = base64Image.split(',')[1];
        const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
        
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };
        
        const parts = [fullQuery || "What is in this image?", imagePart];
        result = await chatRef.current.sendMessage(parts);
      } else {
        result = await chatRef.current.sendMessage(fullQuery);
      }

      const response = await result.response;
      const text = response.text();

      setIsConnected(true);
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      setIsConnected(false);
      return language === 'mr'
        ? '⚠️ माफ करा, AI सेवेशी जोडणी करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.'
        : language === 'hi'
        ? '⚠️ क्षमा करें, एआई सेवा से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।'
        : '⚠️ Sorry, I had trouble connecting to the AI service. Please try again.';
    }
  };

  // ── Send Message ──────────────────────────────────────────────
  const handleSend = async (text = '') => {
    requireAuth(async () => {
      const messageText = text || input.trim();
      if ((!messageText && !selectedImage) || isTyping) return;

      const currentImage = selectedImage;

      const userMsg = { id: Date.now(), type: 'user', text: messageText, image: currentImage, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setSelectedImage(null);
      setIsTyping(true);

      const responseText = await getAIResponse(messageText, currentImage);

      const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (isVoiceMode) {
        speakText(responseText);
      }
    });
  };

  // ── Keyboard Handler ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice Input ───────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'mr'
        ? 'हा ब्राउझर व्हॉइस रिकग्निशन सपोर्ट करत नाही. कृपया Chrome वापरा.'
        : language === 'hi'
        ? 'यह ब्राउज़र वॉयस रिकग्निशन का समर्थन नहीं करता है। कृपया Chrome का उपयोग करें।'
        : 'Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setIsListening(true);
    setIsVoiceMode(true); // Auto-enable voice response when user speaks
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => {
        handleSend(transcript);
      }, 300);
    };
    
    recognition.onerror = (e) => {
      setIsListening(false);
      console.error('Speech recognition error:', e.error);
      if (e.error === 'not-allowed' && !window.isSecureContext) {
        alert(language === 'mr' 
          ? 'मायक्रोफोनला परवानगी नाकारली आहे. (लोकल HTTP नेटवर्कवर ब्राऊजर माइक ब्लॉक करतो. कृपया टाइप करा.)'
          : language === 'hi'
          ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत। (मोबाइल ब्राउज़र लोकल HTTP टेस्टिंग नेटवर्क पर माइक ब्लॉक करते हैं। कृपया टाइप करें।)'
          : 'Microphone access denied. (Mobile browsers block the mic on local HTTP testing networks. Please type instead.)');
      } else if (e.error === 'not-allowed') {
        alert(language === 'mr' ? 'कृपया मायक्रोफोनला परवानगी द्या.' : language === 'hi' ? 'कृपया माइक्रोफ़ोन एक्सेस की अनुमति दें।' : 'Please allow microphone access.');
      }
    };
    
    recognition.onend = () => setIsListening(false);
    
    try {
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
      setIsListening(false);
    }
  }, [language, isListening, handleSend]);

  // Auto-trigger voice assistant if URL has ?voice=true parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('voice') === 'true') {
      const timer = setTimeout(() => {
        toggleVoice();
      }, 300);
      
      // Clean up the URL query parameter
      navigate('/chat', { replace: true });
      
      return () => clearTimeout(timer);
    }
  }, [location.search, navigate, toggleVoice]);

  // ── Clear Chat ────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        text: language === 'mr'
          ? '🔄 चॅट रीसेट झाला! मी तुम्हाला कशी मदत करू शकतो?'
          : language === 'hi'
          ? '🔄 चैट रीसेट हो गया! मैं आपकी क्या मदद कर सकता हूँ?'
          : '🔄 Chat reset! How can I help you?',
        timestamp: new Date()
      }
    ]);

    // Reinitialize Gemini chat session
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
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
          {user && user.role === 'admin' && (
            <button 
              className="btn btn-ghost admin-chat-back-btn" 
              onClick={() => navigate('/profile')} 
              style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)', fontWeight: '600', transition: 'all 0.2s ease' }}
            >
              ⬅️ {language === 'mr' ? 'प्रशासक पोर्टल' : language === 'hi' ? 'एडमिन पोर्टल' : 'Admin Portal'}
            </button>
          )}
          <div className="chat-avatar">
            <Sparkles size={24} />
          </div>
          <div>
            <h1>{language === 'mr' ? 'Ai Sathi चॅट' : language === 'hi' ? 'Ai Sathi चैट' : 'Ai Sathi Chat'}</h1>
            <p className="chat-subtitle">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected
                ? (language === 'mr' ? 'Gemini AI शी जोडलेले • लाइव्ह' : language === 'hi' ? 'Gemini AI से जुड़ा हुआ • लाइव' : 'Connected to Gemini AI • Live')
                : (language === 'mr' ? 'ऑफलाइन' : language === 'hi' ? 'ऑफलाइन' : 'Disconnected')
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
            title={language === 'mr' ? 'आवाज उत्तर टॉगल करा' : language === 'hi' ? 'आवाज़ उत्तर टॉगल करें' : 'Toggle Voice Responses'}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            <Volume2 size={14} style={{ marginRight: '4px' }} />
            {isVoiceMode ? (language === 'mr' ? 'आवाज चालू' : 'Voice On') : (language === 'mr' ? 'आवाज बंद' : 'Voice Off')}
          </button>
          <button
            className="badge badge-outline"
            onClick={clearChat}
            style={{ cursor: 'pointer', border: 'none', marginLeft: '5px' }}
            title={language === 'mr' ? 'चॅट रीसेट करा' : language === 'hi' ? 'चैट रीसेट करें' : 'Reset Chat'}
          >
            <RefreshCw size={14} style={{ marginRight: '4px' }} />
            {language === 'mr' ? 'रीसेट' : language === 'hi' ? 'रीसेट' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages">
        {/* Quick Actions — show only at start */}
        {messages.length <= 1 && (
          <div className="quick-actions animate-fade-in-up">
            <p className="quick-actions-title">{language === 'mr' ? '⚡ जलद प्रश्न:' : language === 'hi' ? '⚡ त्वरित प्रश्न:' : '⚡ Quick Questions:'}</p>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <button key={action.id} className="quick-action-btn" onClick={() => handleSend(language === 'mr' ? action.queryMarathi : language === 'hi' ? action.queryHindi : action.query)}>
                  <span className="quick-action-icon">{action.icon}</span>
                  <div>
                    <span className="quick-action-label">{language === 'mr' ? action.labelMarathi : language === 'hi' ? (action.labelHindi || action.label) : action.label}</span>
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
              {msg.image && (
                <img src={msg.image} alt="User upload" className="message-image" />
              )}
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
                  {language === 'mr' ? 'Ai Sathi विचार करत आहे...' : language === 'hi' ? 'Ai Sathi सोच रहा है...' : 'Ai Sathi is thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        {selectedImage && (
          <div className="image-preview-container animate-fade-in-up">
            <img src={selectedImage} alt="Preview" className="image-preview" />
            <button className="remove-image-btn" onClick={() => setSelectedImage(null)} title="Remove image">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="chat-input-wrapper">
          <button
            className="image-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            title={language === 'mr' ? 'फोटो अपलोड करा' : language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Image'}
          >
            <Image size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleImageSelect}
          />
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoice}
            id="voice-toggle"
            title={language === 'mr' ? 'आवाजाने बोला' : language === 'hi' ? 'आवाज़ से बोलें' : 'Speak with voice'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            ref={inputRef}
            type="text"
            lang={language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'}
            dir="auto"
            className="chat-input"
            placeholder={language === 'mr' ? "तुमचा प्रश्न टाइप करा..." : language === 'hi' ? "अपना प्रश्न टाइप करें..." : "Type your question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            id="chat-input"
          />
          <button
            className={`send-btn ${(input.trim() || selectedImage) && !isTyping ? 'active' : ''}`}
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isTyping}
            id="send-btn"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="chat-powered-by">
          ⚡ {language === 'mr' ? 'Google Gemini AI द्वारे संचालित' : language === 'hi' ? 'Google Gemini AI द्वारा संचालित' : 'Powered by Google Gemini AI'}
        </p>
      </div>
    </div>
  );
}
