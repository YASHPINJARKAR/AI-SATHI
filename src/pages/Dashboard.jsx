import { Link } from 'react-router-dom';
import { MessageCircle, Building2, Calendar, Landmark, MapPin, Mic, TrendingUp, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { businesses, events } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import './Dashboard.css';

const stats = [
  { label: 'Businesses', value: '500+', icon: Building2, color: '#3949ab' },
  { label: 'Gov Schemes', value: '10+', icon: Landmark, color: '#ff6d00' },
  { label: 'Active Users', value: '7L+', icon: Users, color: '#00c853' },
  { label: 'Events', value: '25+', icon: Calendar, color: '#e91e63' },
];

const features = [
  { title: 'Smart Chat', titleMarathi: 'स्मार्ट चॅट', desc: 'Ask anything about Amravati in Marathi or English', icon: '💬', path: '/chat', color: 'var(--primary)' },
  { title: 'Business Directory', titleMarathi: 'व्यवसाय डिरेक्टरी', desc: 'Find shops, hospitals, restaurants nearby', icon: '🏪', path: '/directory', color: 'var(--accent)' },
  { title: 'Events & Activities', titleMarathi: 'कार्यक्रम', desc: 'Discover events happening in Amravati', icon: '🎉', path: '/events', color: '#e91e63' },
  { title: 'Gov Services', titleMarathi: 'सरकारी सेवा', desc: 'Schemes, documents, office locations', icon: '🏛️', path: '/services', color: '#00c853' },
  { title: 'Location & Maps', titleMarathi: 'नकाशा', desc: 'GPS-based nearby search with directions', icon: '📍', path: '/map', color: '#2979ff' },
  { title: 'Voice Assistant', titleMarathi: 'आवाज सहाय्यक', desc: 'Speak in Marathi — get instant answers', icon: '🎤', path: '/chat', color: '#9c27b0' },
];

export default function Dashboard() {
  const { language } = useLanguage();
  const topBusinesses = businesses.filter(b => b.rating >= 4.4).slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="page-container dashboard-page">
      {/* Hero */}
      <section className="hero animate-fade-in">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered City Guide</span>
          </div>
          <h1 className="hero-title">
            {language === 'mr' ? 'सोबत आपले स्वागत आहे' : 'Welcome to'} <span className="gradient-text">Ai Sathi</span>
          </h1>
          <p className="hero-subtitle marathi-text">
            {language === 'mr' ? 'अमरावतीचा AI सहाय्यक — तुम्हाला हवं ते शोधा, विचारा, जाणून घ्या' : 'Amravati\'s AI Assistant — find, ask, and know anything you need'}
          </p>
          <p className="hero-desc">
            {language === 'mr' ? 'अमरावतीसाठी तुमचा AI मार्गदर्शक. व्यवसाय, कार्यक्रम, सरकारी सेवा आणि बरेच काही शोधा.' : 'Your AI-powered digital guide for Amravati. Find businesses, events, government services and more.'}
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn btn-accent btn-lg">
              <MessageCircle size={20} />
              {language === 'mr' ? 'चॅट सुरू करा' : 'Start Chatting'}
            </Link>
            <Link to="/directory" className="btn btn-outline btn-lg">
              <Building2 size={20} />
              {language === 'mr' ? 'डिरेक्टरी पहा' : 'Explore Directory'}
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-graphic">
            <div className="hero-circle c1"></div>
            <div className="hero-circle c2"></div>
            <div className="hero-circle c3"></div>
            <div className="hero-emoji">🤖</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="section-header">
          <h2>{language === 'mr' ? 'Ai Sathi काय करू शकतो?' : 'What can Ai Sathi do?'}</h2>
        </div>
        <div className="features-grid">
          {features.map((f, idx) => (
            <Link to={f.path} key={idx} className="feature-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 70}ms` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{language === 'mr' ? f.titleMarathi : f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-arrow">
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="section">
        <div className="section-header">
          <h2>{language === 'mr' ? 'अमरावतीमध्ये टॉप रेटेड' : 'Top Rated in Amravati'}</h2>
          <Link to="/directory" className="section-link">
            {language === 'mr' ? 'सर्व पहा' : 'View All'} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="top-rated-grid">
          {topBusinesses.map((biz, idx) => (
            <div key={biz.id} className="top-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="top-card-icon">{biz.image}</div>
              <div className="top-card-info">
                <h4>{language === 'mr' ? biz.nameMarathi : biz.name}</h4>
                <div className="top-card-meta">
                  <span className="top-rating"><Star size={12} fill="currentColor" /> {biz.rating}</span>
                  <span className="top-distance"><MapPin size={12} /> {biz.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section">
        <div className="section-header">
          <h2>{language === 'mr' ? 'आगामी कार्यक्रम' : 'Upcoming Events'}</h2>
          <Link to="/events" className="section-link">
            {language === 'mr' ? 'सर्व पहा' : 'View All'} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="events-preview-grid">
          {upcomingEvents.map((evt, idx) => (
            <div key={evt.id} className="event-preview-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="event-preview-icon">{evt.image}</div>
              <div className="event-preview-info">
                <h4>{language === 'mr' ? evt.titleMarathi : evt.title}</h4>
                <div className="event-preview-meta">
                  <span><Calendar size={12} /> {new Date(evt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  <span><MapPin size={12} /> {evt.location}</span>
                </div>
              </div>
              <span className={`event-price-badge ${evt.price === 'Free' ? 'free' : ''}`}>{evt.price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
