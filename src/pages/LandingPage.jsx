import { Link } from 'react-router-dom';
import { ArrowRight, Mic, MapPin, Sparkles, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
import './LandingPage.css';
import { useLanguage } from '../LanguageContext';

export default function LandingPage({ darkMode, setDarkMode }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">🤖</span>
          <span className="landing-logo-text">Ai Sathi</span>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-icon-btn" onClick={toggleLanguage} title={language === 'mr' ? 'English' : 'मराठी'}>
            <Globe size={20} />
          </button>
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
            <Sparkles size={14} /> {language === 'mr' ? 'स्मार्ट शहरांचे भविष्य' : 'Future of Smart Cities'}
          </div>
          
          <h1 className="landing-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {language === 'mr' ? 'स्मार्ट अमरावतीचे भविष्य' : 'Future of Smart Amravati'} <br/>
            <span className="text-gradient">{language === 'mr' ? 'येथून सुरू होते' : 'Starts Here'}</span>
          </h1>
          
          <p className="landing-subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {language === 'mr' 
              ? 'सार्वजनिक सेवा, नेव्हिगेशन, स्थानिक व्यवसाय आणि बरेच काही यासाठी रिअल-टाइम AI-सक्षम स्मार्ट सिटी असिस्टंट प्लॅटफॉर्म.'
              : 'A real-time AI-powered smart city assistant platform for public services, navigation, local businesses, and more.'}
          </p>
          
          <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard" className="landing-btn primary">
              {language === 'mr' ? 'सुरुवात करा' : 'Get Started'} <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="landing-btn secondary">
              {language === 'mr' ? 'AI शी बोला' : 'Talk to AI'}
            </Link>
          </div>
        </div>

        {/* Right Visuals */}
        <div className="landing-visuals animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {/* Glowing Orb */}
          <div className="glowing-orb"></div>
          
          <div className="cards-group">
            {/* Floating Glass Cards */}
            <div className="floating-card chat-card">
              <div className="card-header-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="chat-bubble bot">{language === 'mr' ? 'नमस्कार! मी तुम्हाला कशी मदत करू शकेन?' : 'Hello! How can I help you today?'}</div>
              <div className="chat-bubble user">{language === 'mr' ? 'जवळचे रुग्णालये शोधा' : 'Find nearby hospitals'}</div>
            </div>

            <div className="floating-card mic-card">
              <Mic size={24} color="#ff6d00" />
              <div className="voice-waves">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            <div className="floating-card location-card">
              <div className="loc-icon">
                <MapPin size={24} color="#ff6d00" />
              </div>
              <div className="loc-info">
                <h4>{language === 'mr' ? 'इर्विन हॉस्पिटल' : 'Irwin Hospital'}</h4>
                <p>{language === 'mr' ? '२.४ किमी दूर' : '2.4 km away'}</p>
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
