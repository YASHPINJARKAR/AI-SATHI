import { Link } from 'react-router-dom';
import { ArrowRight, Mic, MapPin, Sparkles, MessageSquare } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">🤖</span>
          <span className="landing-logo-text">Ai Sathi</span>
        </div>
        <Link to="/dashboard" className="landing-launch-btn">
          Launch App <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Main Hero Section */}
      <main className="landing-hero">
        {/* Left Content */}
        <div className="landing-content">
          <div className="landing-pill animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <Sparkles size={14} /> Future of Smart Cities
          </div>
          
          <h1 className="landing-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Future of Smart Amravati <br/>
            <span className="text-gradient">Starts Here</span>
          </h1>
          
          <p className="landing-subtitle animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            A real-time AI-powered smart city assistant platform for public services, navigation, local businesses, and more.
          </p>
          
          <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard" className="landing-btn primary">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="landing-btn secondary">
              Talk to AI
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
              <div className="chat-bubble bot">Hello! How can I help you today?</div>
              <div className="chat-bubble user">Find nearby hospitals</div>
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
                <h4>Irwin Hospital</h4>
                <p>2.4 km away</p>
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
