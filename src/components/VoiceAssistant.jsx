import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Volume2, VolumeX, Loader } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './VoiceAssistant.css';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

const SYSTEM_PROMPT = `You are Ai Sathi (AI साथी), a friendly voice assistant for Amravati city citizens. Keep answers SHORT and conversational (2-3 sentences max). Answer in the same language as the user speaks — Marathi or English. For Marathi use Devanagari script. Be warm and helpful.`;

export default function VoiceAssistant({ isOpen, onClose, initialLanguage }) {
  const { language } = useLanguage();
  const lang = initialLanguage || language;

  const [status, setStatus] = useState('idle'); // idle | listening | thinking | speaking | error
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [detectedLang, setDetectedLang] = useState(lang);

  const recognitionRef = useRef(null);
  const historyRef = useRef([
    { role: 'system', content: SYSTEM_PROMPT }
  ]);
  const utteranceRef = useRef(null);
  const voicesRef = useRef([]);
  const visualizerRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const cleanupAudio = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
    }
    if (visualizerRef.current) {
      visualizerRef.current.style.transform = 'scale(1)';
    }
  }, []);

  // Preload voices
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices() || [];
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);


  const getBestVoice = useCallback((langCode) => {
    const voices = voicesRef.current;
    if (!voices.length) return null;

    const searchLang = langCode.split('-')[0].toLowerCase(); // 'mr' or 'hi' or 'en'

    // 1. Exact locale match (e.g. 'en-IN', 'hi-IN', 'mr-IN')
    const exactMatch = voices.find(v =>
      v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // 2. Same language prefix (e.g. 'en', 'hi', 'mr')
    const langMatch = voices.find(v =>
      v.lang.toLowerCase().startsWith(searchLang)
    );
    if (langMatch) return langMatch;

    // 3. Fallback for Marathi: Hindi is extremely close, uses Devanagari script,
    // and is widely supported on Windows, Chrome, iOS, and Android.
    if (searchLang === 'mr') {
      const hindiMatch = voices.find(v =>
        v.lang.toLowerCase().startsWith('hi')
      );
      if (hindiMatch) return hindiMatch;
    }

    return null;
  }, []);

  const speak = useCallback((text, langCode) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#\[\]]/g, '').replace(/\n/g, '. ').substring(0, 500);
    const utt = new SpeechSynthesisUtterance(cleanText);

    const applyVoiceAndLang = () => {
      const voice = getBestVoice(langCode);
      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang;
      } else {
        // If absolutely no voice matches, fallback to hi-IN for Marathi, else use original langCode
        utt.lang = langCode === 'mr-IN' ? 'hi-IN' : langCode;
      }
      utt.rate = utt.lang.startsWith('en') ? 0.95 : 0.88;
    };

    if (voicesRef.current.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voicesRef.current = window.speechSynthesis.getVoices() || [];
        applyVoiceAndLang();
      };
    } else {
      applyVoiceAndLang();
    }

    utt.pitch = 1.05;
    utt.onstart = () => setStatus('speaking');
    utt.onend = () => setStatus('idle');
    utt.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      setStatus('idle');
    };

    utteranceRef.current = utt;
    // Chrome bug workaround: delay slightly
    setTimeout(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utt);
      }
    }, 100);
  }, [isMuted, getBestVoice]);

  const askAI = useCallback(async (text, langCode) => {
    setStatus('thinking');
    setResponse('');
    setErrorMsg('');

    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is missing! Set VITE_OPENROUTER_API_KEY in .env');
      }

      const langHint = langCode === 'mr-IN'
        ? ' (CRITICAL: respond ONLY in Marathi using Devanagari script, keep it short)'
        : ' (respond in English, keep it short)';

      const userText = text + langHint;
      historyRef.current.push({ role: 'user', content: userText });

      const reqBody = {
        model: OPENROUTER_MODEL,
        messages: historyRef.current
      };

      if (OPENROUTER_MODEL.includes('gpt-oss-120b')) {
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
      const botText = result.choices[0].message.content;

      historyRef.current.push({ role: 'assistant', content: botText });

      setResponse(botText);
      // Delay speak slightly to let React re-render first (Chrome async speech fix)
      setTimeout(() => speak(botText, langCode), 150);
    } catch (e) {
      console.error('AI error:', e);
      // Remove last user message if it failed so we don't pollute the history
      if (historyRef.current[historyRef.current.length - 1]?.role === 'user') {
        historyRef.current.pop();
      }
      const msg = (e?.message || '').toLowerCase();
      const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted') || e?.status === 429;
      const errText = isQuota
        ? (langCode === 'mr-IN'
            ? 'सर्व्हर व्यस्त आहे. कृपया 1 मिनिट थांबून पुन्हा प्रयत्न करा.'
            : 'Server is busy. Please wait 1 minute and try again.')
        : (langCode === 'mr-IN'
            ? 'माफ करा, काही तांत्रिक अडचण आली. पुन्हा प्रयत्न करा.'
            : 'Sorry, something went wrong. Please try again.');
      setResponse(errText);
      setStatus('error');
      setErrorMsg(errText);
    }
  }, [speak]);

  const startListening = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setErrorMsg('Voice recognition not supported. Please use Chrome browser.');
      setStatus('error');
      return;
    }

    // Stop any current speech
    window.speechSynthesis?.cancel();

    // Request microphone access using getUserMedia first to force browser permission prompt
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Setup audio visualizer
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            const updateVolume = () => {
              if (!visualizerRef.current) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              // Map average (0-255) to scale (1 to 1.35)
              const scale = 1 + (average / 255) * 0.45;
              visualizerRef.current.style.transform = `scale(${scale})`;
              animationRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        } catch (err) {
          console.error("Visualizer error:", err);
        }
      }
    } catch (e) {
      console.error('Microphone permission request failed:', e);
      setErrorMsg(
        detectedLang === 'mr'
          ? 'मायक्रोफोनला परवानगी नाकारली आहे. कृपया ब्राउझर URL बारमधील लॉक चिन्हावर क्लिक करून परवानगी द्या.'
          : 'Microphone access denied. Please click the lock icon in the browser URL bar to allow access.'
      );
      setStatus('error');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Detect language code for the selected language
    const langCode = detectedLang === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
      setResponse('');
      setErrorMsg('');
    };

    recognition.onresult = (event) => {
      try {
        recognition.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setStatus('thinking');
      recognitionRef.current = null;
      cleanupAudio();
      askAI(text, langCode);
    };

    recognition.onerror = (e) => {
      recognitionRef.current = null;
      cleanupAudio();
      if (e.error === 'not-allowed') {
        setErrorMsg(
          detectedLang === 'mr'
            ? 'मायक्रोफोनला परवानगी नाकारली आहे. कृपया ब्राउझर URL बारमधील लॉक चिन्हावर क्लिक करून परवानगी द्या.'
            : 'Microphone access denied. Please click the lock icon in the browser URL bar to allow access.'
        );
        setStatus('error');
      } else if (e.error === 'no-speech') {
        setStatus('idle');
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => {
      if (status === 'listening') setStatus('idle');
      recognitionRef.current = null;
      cleanupAudio();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (_err) {
      setStatus('idle');
    }
  }, [detectedLang, askAI, status]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_err) {
        console.error("Error aborting recognition:", _err);
      }
      recognitionRef.current = null;
    }
    window.speechSynthesis?.cancel();
    cleanupAudio();
    setStatus('idle');
  }, [cleanupAudio]);

  const handleMicClick = useCallback(() => {
    // Unlock Chrome's speech synthesis during the user gesture,
    // so subsequent async speak() calls work without requiring another gesture.
    if (window.speechSynthesis) {
      const unlock = new SpeechSynthesisUtterance('');
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
      setTimeout(() => window.speechSynthesis.cancel(), 50);
    }

    if (status === 'listening') {
      stopListening();
    } else if (status === 'speaking') {
      window.speechSynthesis?.cancel();
      setStatus('idle');
    } else {
      startListening();
    }
  }, [status, startListening, stopListening]);

  const handleClose = useCallback(() => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    cleanupAudio();
    setStatus('idle');
    setTranscript('');
    setResponse('');
    setErrorMsg('');
    historyRef.current = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];
    onClose();
  }, [onClose, cleanupAudio]);

  // Auto-start listening when opened
  useEffect(() => {
    if (isOpen) {
      let initLang = initialLanguage || language;
      if (initLang === 'hi') {
        initLang = 'mr'; // Fall back to Marathi if app is in Hindi since voice assistant is Marathi/English only
      }
      setDetectedLang(initLang);
      const timer = setTimeout(() => {
        startListening();
      }, 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const getLangLabel = (l) =>
    l === 'mr' ? 'मराठी' : 'English';

  const getPromptText = () => {
    if (status === 'listening')
      return detectedLang === 'mr' ? 'बोलत आहे...' : 'Listening...';
    if (status === 'thinking')
      return detectedLang === 'mr' ? 'विचार करत आहे...' : 'Thinking...';
    if (status === 'speaking')
      return detectedLang === 'mr' ? 'उत्तर देत आहे...' : 'Speaking...';
    return detectedLang === 'mr' ? 'मायक्रोफोन दाबा आणि बोला' : 'Tap mic and speak';
  };

  return (
    <div className="va-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="va-panel animate-fade-in-up">
        {/* Header */}
        <div className="va-header">
          <div className="va-header-left">
            <div className="va-orb-small" />
            <div>
              <h3 className="va-title">
                {detectedLang === 'mr' ? 'AI साथी - आवाज सहाय्यक' : 'AI Sathi - Voice Assistant'}
              </h3>
              <p className="va-subtitle">{getLangLabel(detectedLang)}</p>
            </div>
          </div>
          <div className="va-header-actions">
            <button
              className="va-icon-btn"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="va-icon-btn va-close-btn" onClick={handleClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Language Switcher — English & Marathi only */}
        <div className="va-lang-switcher">
          {['en', 'mr'].map(l => (
            <button
              key={l}
              className={`va-lang-btn ${detectedLang === l ? 'active' : ''}`}
              onClick={() => setDetectedLang(l)}
            >
              {getLangLabel(l)}
            </button>
          ))}
        </div>

        {/* Main Visual */}
        <div className="va-main">
          <div className={`va-robot-ring ${status}`}>
            <div ref={visualizerRef} className={`va-robot-inner ${status}`}>
              <button
                className={`va-mic-btn ${status}`}
                onClick={handleMicClick}
                aria-label="Toggle microphone"
              >
                {status === 'thinking' ? (
                  <Loader size={32} className="va-spin" />
                ) : status === 'listening' ? (
                  <MicOff size={32} />
                ) : (
                  <Mic size={32} />
                )}
              </button>
            </div>
          </div>

          <p className="va-prompt">{getPromptText()}</p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="va-transcript">
            <span className="va-transcript-label">
              {detectedLang === 'mr' ? 'तुम्ही म्हणालात:' : 'You said:'}
            </span>
            <p className="va-transcript-text">{transcript}</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="va-response">
            <span className="va-response-label">
              🤖 {detectedLang === 'mr' ? 'AI साथी:' : 'AI Sathi:'}
            </span>
            <p className="va-response-text">{response}</p>
            {!isMuted && (
              <button
                className="va-replay-btn"
                onClick={() => speak(response, detectedLang === 'mr' ? 'mr-IN' : 'en-IN')}
                title="Replay"
              >
                <Volume2 size={14} />
                {detectedLang === 'mr' ? 'पुन्हा ऐका' : 'Replay'}
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="va-error">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Footer */}
        <p className="va-footer">
          {detectedLang === 'mr'
            ? '🤖 दाबा • बोला • उत्तर मिळवा'
            : '🤖 Tap • Speak • Get Answer'}
        </p>
      </div>
    </div>
  );
}
