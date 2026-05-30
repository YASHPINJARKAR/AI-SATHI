import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Mic, MicOff, Sparkles, Clock, Volume2, Bot, User, RefreshCw, Wifi, WifiOff, Image, X } from 'lucide-react';
import { quickActions } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

// ── OpenRouter AI Setup ──────────────────────────────────────────
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-oss-120b:free";
const OPENROUTER_VISION_MODEL = import.meta.env.VITE_OPENROUTER_VISION_MODEL || "google/gemini-2.5-flash";


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
1. When asked about a place/service/hospital/ATM, provide: Name, Address, Phone, Timings, Rating if available.
2. For hospitals, ATMs, restaurants, and other physical places, you MUST dynamically generate:
   - A Google Maps directions link in this format: [Directions](https://www.google.com/maps/dir/?api=1&destination=PLACE_NAME_Amravati) (where PLACE_NAME is the name of the place, URL-encoded or spaces replaced by '+', e.g. [Directions](https://www.google.com/maps/dir/?api=1&destination=Shree+Krishna+Hospital+Amravati))
   - A Photos link using Google Image Search in this format: [Photos](https://www.google.com/search?tbm=isch&q=PLACE_NAME_Amravati) (e.g. [Photos](https://www.google.com/search?tbm=isch&q=Shree+Krishna+Hospital+Amravati))
   - A Call link if a phone number is available in this format: [Call: PHONE_NUMBER](tel:PHONE_NUMBER) (e.g. [Call: 07212552353](tel:07212552353))
3. CRITICAL: Never refuse to answer or give generic fallback answers for places/ATMs/hospitals not explicitly listed in your knowledge base. Instead, use your general knowledge to suggest suitable places/options in Amravati and dynamically construct their Directions and Photos links based on their names.
4. For government schemes, include: Eligibility, Documents needed, Where to apply, Timeline
5. For emergencies, respond with urgency and provide direct contact numbers
6. Answer ANY question the user asks, whether it's general knowledge, programming, math, advice, or anything else. Use your general knowledge capabilities.
7. Keep responses well-structured with bullet points and bold text for readability
8. Always be helpful and suggest related follow-up questions`;


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
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const handleSendRef = useRef(null); // keeps toggleVoice closure fresh
  const recognitionRef = useRef(null);

  // Cleanup speech recognition and synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.error('Error aborting speech recognition on unmount:', err);
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  // ── Initialize OpenRouter Connection Status ───────────────────
  useEffect(() => {
    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing! Set VITE_OPENROUTER_API_KEY in .env');
      setIsConnected(false);
      return;
    }
    setIsConnected(true);
    console.log('✅ OpenRouter API configured successfully using model:', OPENROUTER_MODEL);
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Text-to-Speech ────────────────────────────────────────────
  const voicesLoadedRef = useRef([]);

  // Load voices as soon as they are available (Chrome loads them async)
  useEffect(() => {
    const loadVoices = () => {
      voicesLoadedRef.current = window.speechSynthesis.getVoices() || [];
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakText = useCallback((text, force = false) => {
    if (!isVoiceMode && !force) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#\[\]]/g, '').replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set the lang tag — browser uses this even without an explicit voice
    const targetLang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;

    // Only assign a voice when we find a REAL language match.
    // Never fall back to a Hindi/Indian voice for English or Marathi —
    // doing so overrides the lang tag and forces Hindi speech.
    const voices = voicesLoadedRef.current;
    if (voices.length > 0) {
      // 1. Exact locale match (e.g. 'en-IN', 'hi-IN')
      let matched = voices.find(v =>
        v.lang.replace('_', '-').toLowerCase() === targetLang.toLowerCase()
      );
      // 2. Same language prefix (e.g. 'en', 'hi', 'mr')
      if (!matched) {
        matched = voices.find(v =>
          v.lang.toLowerCase().startsWith(language.toLowerCase())
        );
      }
      // Only set if we actually found a match — don't force an unrelated voice
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.rate = (language === 'mr' || language === 'hi') ? 0.9 : 1.0;
    // Small delay — Chrome bug workaround
    setTimeout(() => window.speechSynthesis.speak(utterance), 80);
  }, [isVoiceMode, language]);

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

  // ── Get AI Response via OpenRouter API ─────────────────────────
  const getAIResponse = async (query, base64Image = null, history = []) => {
    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is missing! Set VITE_OPENROUTER_API_KEY in .env');
      }

      const langHint = language === 'mr'
        ? ' (CRITICAL: You MUST respond entirely in Marathi language using Devanagari script. Do not use English words.)'
        : language === 'hi'
          ? ' (CRITICAL: You MUST respond entirely in Hindi language using Devanagari script. Do not use English words.)'
          : ' (Please respond entirely in English.)';
      const fullQuery = query + langHint;

      const apiMessages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        }
      ];

      // Build history
      history.forEach(msg => {
        if (msg.id === 1) return; // Skip welcome message
        const role = msg.type === 'bot' ? 'assistant' : 'user';
        if (msg.image) {
          apiMessages.push({
            role,
            content: [
              { type: 'text', text: msg.text },
              { type: 'image_url', image_url: { url: msg.image } }
            ]
          });
        } else {
          apiMessages.push({
            role,
            content: msg.text
          });
        }
      });

      // Add user query
      if (base64Image) {
        apiMessages.push({
          role: 'user',
          content: [
            { type: 'text', text: fullQuery },
            { type: 'image_url', image_url: { url: base64Image } }
          ]
        });
      } else {
        apiMessages.push({
          role: 'user',
          content: fullQuery
        });
      }

      // Check if any message contains an image to route to the vision model
      const hasImage = base64Image || history.some(msg => msg.image);
      const targetModel = hasImage ? OPENROUTER_VISION_MODEL : OPENROUTER_MODEL;

      const reqBody = {
        model: targetModel,
        messages: apiMessages
      };

      if (!hasImage && targetModel.includes('gpt-oss-120b')) {
        reqBody.reasoning = { enabled: true };
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Ai Sathi"
        },
        body: JSON.stringify(reqBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.choices[0].message.content;

      setIsConnected(true);
      return text;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      setIsConnected(false);
      return language === 'mr'
        ? '⚠️ माफ करा, AI सेवेशी जोडणी करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.'
        : language === 'hi'
          ? '⚠️ क्षमा करें, एआई सेवा से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : '⚠️ Sorry, I had trouble connecting to the AI service. Please try again.';
    }
  };

  // ── Send Message ──────────────────────────────────────────────
  const handleSend = useCallback(async (text = '') => {
    // Prime speech synthesis on user gesture before async call
    if (isVoiceMode && window.speechSynthesis) {
      const unlock = new SpeechSynthesisUtterance('');
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }
    requireAuth(async () => {
      const messageText = text || input.trim();
      if ((!messageText && !selectedImage) || isTyping) return;

      const currentImage = selectedImage;

      const userMsg = { id: Date.now(), type: 'user', text: messageText, image: currentImage, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setSelectedImage(null);
      setIsTyping(true);

      const responseText = await getAIResponse(messageText, currentImage, messages);

      const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (isVoiceMode) {
        speakText(responseText);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, selectedImage, isTyping, isVoiceMode, speakText, requireAuth]);

  // Keep a ref so toggleVoice always has the freshest handleSend
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  // ── Keyboard Handler ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice Input ───────────────────────────────────────────────
  const toggleVoice = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'mr'
        ? 'हा ब्राउझर व्हॉइस रिकग्निशन सपोर्ट करत नाही. कृपया Chrome वापरा.'
        : language === 'hi'
          ? 'यह ब्राउज़र वॉयस रिकग्निशन का समर्थन नहीं करता है। कृपया Chrome का उपयोग करें।'
          : 'Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.error('Error aborting speech recognition:', err);
        }
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // Prime speech synthesis on user gesture
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const unlock = new SpeechSynthesisUtterance('');
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }

    // Force prompt using getUserMedia
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Clean up the stream immediately after checking permission
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.error('Microphone permission request failed:', e);
      if (!window.isSecureContext) {
        alert(language === 'mr'
          ? 'मायक्रोफोनला परवानगी नाकारली आहे. असुरक्षित कनेक्शन (HTTP) मुळे ब्राउझर माइक ब्लॉक करतो. कृपया localhost किंवा HTTPS वापरा.'
          : language === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत। असुरक्षित कनेक्शन (HTTP) के कारण ब्राउज़र माइक ब्लॉक करता है। कृपया localhost या HTTPS का उपयोग करें।'
            : 'Microphone access denied. Browser blocks mic on unsecure HTTP connections. Please use localhost or HTTPS.');
      } else {
        alert(language === 'mr'
          ? 'मायक्रोफोनला परवानगी नाकारली आहे. कृपया ब्राउझर URL बारमधील लॉक चिन्हावर क्लिक करून परवानगी द्या.'
          : language === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया ब्राउज़र URL बार में लॉक आइकन पर क्लिक करके अनुमति दें।'
            : 'Microphone access denied. Please click the lock icon in the browser URL bar to allow access.');
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    setIsListening(true);
    setIsVoiceMode(true); // Auto-enable voice response when user speaks

    recognition.onresult = (event) => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
        recognitionRef.current = null;
      }
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input — use ref to always get the freshest handleSend
      setTimeout(() => {
        handleSendRef.current(transcript);
      }, 300);
    };

    recognition.onerror = (e) => {
      recognitionRef.current = null;
      setIsListening(false);
      console.error('Speech recognition error:', e.error);
      if (e.error === 'not-allowed') {
        alert(language === 'mr'
          ? 'मायक्रोफोनला परवानगी नाकारली आहे. कृपया ब्राउझर URL बारमधील लॉक चिन्हावर क्लिक करून परवानगी द्या.'
          : language === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया ब्राउज़र URL बार में लॉक आइकन पर क्लिक करके अनुमति दें।'
            : 'Microphone access denied. Please click the lock icon in the browser URL bar to allow access.');
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [language, isListening]); // handleSend accessed via ref — no stale closure

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
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>')
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
                ? (language === 'mr' ? 'OpenRouter AI शी जोडलेले • लाइव्ह' : language === 'hi' ? 'OpenRouter AI से जुड़ा हुआ • लाइव' : 'Connected to OpenRouter AI • Live')
                : (language === 'mr' ? 'ऑफलाइन' : language === 'hi' ? 'ऑफलाइन' : 'Disconnected')
              }
            </p>
          </div>
        </div>
        <div className="chat-lang-badges">
          <button
            className={`badge ${isVoiceMode ? 'badge-accent' : 'badge-outline'}`}
            onClick={() => {
              const nextMode = !isVoiceMode;
              setIsVoiceMode(nextMode);
              if (nextMode) {
                if (window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  const unlock = new SpeechSynthesisUtterance('');
                  unlock.volume = 0;
                  window.speechSynthesis.speak(unlock);
                }
              } else {
                window.speechSynthesis.cancel();
              }
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
              <div className="message-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span className="message-time">
                  <Clock size={10} />
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.type === 'bot' && (
                  <button
                    className="msg-speak-btn"
                    onClick={() => speakText(msg.text, true)}
                    title={language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Speak message'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <Volume2 size={13} />
                  </button>
                )}
              </div>
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
          ⚡ {language === 'mr' ? 'OpenRouter AI द्वारे संचालित' : language === 'hi' ? 'OpenRouter AI द्वारा संचालित' : 'Powered by OpenRouter AI'}
        </p>
      </div>
    </div>
  );
}
