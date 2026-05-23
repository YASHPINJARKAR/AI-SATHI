import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, MapPin, Sparkles, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
import './LandingPage.css';
import { useLanguage } from '../LanguageContext';
import SplineScene from '../components/SplineScene';

// ─── Public Spline scene: AI robot / smart-city orb ──────────────────────────
// Replace this URL with your own Spline scene link anytime
const SPLINE_SCENE_URL =
  'https://prod.spline.design/31VIZdegQnugXSDa/scene.splinecode';

export default function LandingPage({ darkMode, setDarkMode }) {
  const { language, changeLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">🤖</span>
          <span className="landing-logo-text">Ai Sathi</span>
        </div>
        <div className="landing-nav-actions">
          <div className="lang-dropdown-container">
            <button
              className="landing-icon-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
            >
              <Globe size={20} />
            </button>
            {langDropdownOpen && (
              <div className="lang-dropdown-menu mobile-lang-dropdown">
                <button onClick={() => { changeLanguage('en'); setLangDropdownOpen(false); }} className={language === 'en' ? 'active' : ''}>English</button>
                <button onClick={() => { changeLanguage('hi'); setLangDropdownOpen(false); }} className={language === 'hi' ? 'active' : ''}>हिन्दी</button>
                <button onClick={() => { changeLanguage('mr'); setLangDropdownOpen(false); }} className={language === 'mr' ? 'active' : ''}>मराठी</button>
              </div>
            )}
          </div>
          <button className="landing-icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="landing-hero">
        {/* Left Content */}
        <div className="landing-content">
          <div className="landing-pill animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <Sparkles size={14} />
            {language === 'mr' ? 'स्मार्ट शहरांचे भविष्य' : language === 'hi' ? 'स्मार्ट शहरों का भविष्य' : 'Future of Smart Cities'}
          </div>

          <h1 className="landing-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {language === 'mr' ? 'स्मार्ट अमरावतीचे भविष्य' : language === 'hi' ? 'स्मार्ट अमरावती का भविष्य' : 'Future of Smart Amravati'} <br />
            <span className="text-gradient">
              {language === 'mr' ? 'येथून सुरू होते' : language === 'hi' ? 'यहाँ से शुरू होता है' : 'Starts Here'}
            </span>
          </h1>

          <p className="landing-subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {language === 'mr'
              ? 'सार्वजनिक सेवा, नेव्हिगेशन, स्थानिक व्यवसाय आणि बरेच काही यासाठी रिअल-टाइम AI-सक्षम स्मार्ट सिटी असिस्टंट प्लॅटफॉर्म.'
              : language === 'hi'
              ? 'सार्वजनिक सेवाओं, नेविगेशन, स्थानीय व्यवसायों और बहुत कुछ के लिए एक वास्तविक समय एआई-संचालित स्मार्ट सिटी सहायक मंच।'
              : 'A real-time AI-powered smart city assistant platform for public services, navigation, local businesses, and more.'}
          </p>

          <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard" className="landing-btn primary">
              {language === 'mr' ? 'सुरुवात करा' : language === 'hi' ? 'शुरू करें' : 'Get Started'} <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="landing-btn secondary">
              {language === 'mr' ? 'AI शी बोला' : language === 'hi' ? 'एआई से बात करें' : 'Talk to AI'}
            </Link>
          </div>
        </div>

        {/* Right Visuals — Spline 3D + floating cards overlay */}
        <div className="landing-visuals animate-fade-in-up" style={{ animationDelay: '400ms' }}>

          {/* Glowing background orange orb */}
          <div className="glowing-orb"></div>

          {/* ── 3D Spline Scene ── */}
          <div className="spline-hero-container">
            <SplineScene scene={SPLINE_SCENE_URL} />
          </div>

          {/* ── Floating Glass Cards (overlaid on top of Spline) ── */}
          <div className="cards-group cards-group--overlay">
            {/* Chat card */}
            <div className="floating-card chat-card">
              <div className="card-header-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="chat-bubble bot">
                {language === 'mr' ? 'नमस्कार! मी तुम्हाला कशी मदत करू शकेन?' : language === 'hi' ? 'नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?' : 'Hello! How can I help you today?'}
              </div>
              <div className="chat-bubble user">
                {language === 'mr' ? 'जवळचे रुग्णालये शोधा' : language === 'hi' ? 'निकटतम अस्पताल खोजें' : 'Find nearby hospitals'}
              </div>
            </div>

            {/* Mic card */}
            <div className="floating-card mic-card">
              <Mic size={24} color="#ff6d00" />
              <div className="voice-waves">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            {/* Location card */}
            <div className="floating-card location-card">
              <div className="loc-icon">
                <MapPin size={24} color="#ff6d00" />
              </div>
              <div className="loc-info">
                <h4>
                  {language === 'mr' ? 'इर्विन हॉस्पिटल' : language === 'hi' ? 'इरविन अस्पताल' : 'Irwin Hospital'}
                </h4>
                <p>
                  {language === 'mr' ? '२.४ किमी दूर' : language === 'hi' ? '२.४ किमी दूर' : '2.4 km away'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Background Elements */}
      <div className="landing-bg-grid"></div>
    </div>
  );
}
