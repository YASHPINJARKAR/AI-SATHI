import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Building2, Calendar, Landmark, MapPin, Mic, TrendingUp, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { businesses, events } from '../data/mockData';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import DeveloperModal from '../components/DeveloperModal';
import WeatherWidget from '../components/WeatherWidget';
import AmravatiInfoTree from '../components/AmravatiInfoTree';
import './Dashboard.css';

const stats = [
  { key: 'businesses', value: '500+', icon: Building2, color: '#3949ab' },
  { key: 'schemes', value: '10+', icon: Landmark, color: '#ff6d00' },
  { key: 'aiChats', value: '10K+', icon: MessageCircle, color: '#00c853' },
  { key: 'events', value: '25+', icon: Calendar, color: '#e91e63' },
];

const features = [
  { 
    title: 'Smart Chat', 
    titleMarathi: 'स्मार्ट चॅट', 
    titleHindi: 'स्मार्ट चैट', 
    desc: 'Ask anything about Amravati in Marathi, Hindi or English', 
    icon: '💬', 
    path: '/chat', 
    color: 'var(--primary)' 
  },
  { 
    title: 'Business Directory', 
    titleMarathi: 'व्यवसाय डिरेक्टरी', 
    titleHindi: 'व्यापार निर्देशिका', 
    desc: 'Find shops, hospitals, restaurants nearby', 
    icon: '🏪', 
    path: '/directory', 
    color: 'var(--accent)' 
  },
  { 
    title: 'Events & Activities', 
    titleMarathi: 'कार्यक्रम', 
    titleHindi: 'कार्यक्रम और गतिविधियाँ', 
    desc: 'Discover events happening in Amravati', 
    icon: '🎉', 
    path: '/events', 
    color: '#e91e63' 
  },
  { 
    title: 'Gov Services', 
    titleMarathi: 'सरकारी सेवा', 
    titleHindi: 'सरकारी सेवाएं', 
    desc: 'Schemes, documents, office locations', 
    icon: '🏛️', 
    path: '/services', 
    color: '#00c853' 
  },
  { 
    title: 'Location & Maps', 
    titleMarathi: 'नकाशा', 
    titleHindi: 'स्थान और मानचित्र', 
    desc: 'GPS-based nearby search with directions', 
    icon: '📍', 
    path: '/map', 
    color: '#2979ff' 
  },
  { 
    title: 'Voice Assistant', 
    titleMarathi: 'आवाज सहाय्यक', 
    titleHindi: 'आवाज़ सहायक', 
    desc: 'Speak in Hindi/Marathi — get instant answers', 
    icon: '🎤', 
    path: '/chat', 
    color: '#9c27b0' 
  },
];

export default function Dashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const getStatLabel = (key) => {
    const labels = {
      en: {
        businesses: 'Businesses',
        schemes: 'Gov Schemes',
        aiChats: 'AI Helpline Chats',
        events: 'Events'
      },
      mr: {
        businesses: 'व्यवसाय',
        schemes: 'सरकारी योजना',
        aiChats: 'AI हेल्पलाइन चॅट्स',
        events: 'कार्यक्रम'
      },
      hi: {
        businesses: 'व्यवसाय',
        schemes: 'सरकारी योजनाएं',
        aiChats: 'एआई हेल्पलाइन चैट',
        events: 'कार्यक्रम'
      }
    };
    return (labels[language] || labels.en)[key];
  };

  const topBusinesses = businesses.filter(b => b.rating >= 4.4).slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  const [feedback, setFeedback] = useState({ rating: 0, view: '', suggestion: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // Save to local storage
    const feedbacks = JSON.parse(localStorage.getItem('ai_sathi_feedbacks') || '[]');
    const newFeedback = {
      id: 'fb_' + Date.now(),
      userName: user ? user.name : 'Anonymous User',
      userEmail: user ? user.email : 'N/A',
      rating: feedback.rating,
      view: feedback.view,
      suggestion: feedback.suggestion,
      submittedAt: new Date().toLocaleDateString()
    };
    feedbacks.unshift(newFeedback); // Add to the top
    localStorage.setItem('ai_sathi_feedbacks', JSON.stringify(feedbacks));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback({ rating: 0, view: '', suggestion: '' });
    }, 3000);
  };

  return (
    <div className="page-container dashboard-page">
      {/* Hero */}
      <section className="hero animate-fade-in">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>
              {language === 'mr' ? 'AI-शक्तीवर चालणारा शहर मार्गदर्शक' : language === 'hi' ? 'एआई-संचालित शहर मार्गदर्शिका' : 'AI-Powered City Guide'}
            </span>
          </div>
          <h1 className="hero-title">
            {language === 'mr' 
              ? 'अमरावतीमध्ये स्वागत आहे' 
              : language === 'hi' 
              ? 'अमरावती में आपका स्वागत है' 
              : 'Ai Sathi - Smart Support for Amravati'} <span className="gradient-text"></span>
          </h1>
          <p className="hero-subtitle marathi-text">
            {language === 'mr' 
              ? 'अमरावतीचा AI सहाय्यक — तुम्हाला हवं ते शोधा, विचारा, जाणून घ्या' 
              : language === 'hi' 
              ? 'अमरावती का एआई सहायक — खोजें, पूछें और सब कुछ जानें' 
              : 'Amravati\'s AI Assistant — find, ask, and know anything you need'}
          </p>
          <p className="hero-desc">
            {language === 'mr' 
              ? 'अमरावतीसाठी तुमचा AI मार्गदर्शक. व्यवसाय, कार्यक्रम, सरकारी सेवा आणि बरेच काही शोधा.' 
              : language === 'hi' 
              ? 'अमरावती के लिए आपका एआई-संचालित डिजिटल गाइड। व्यवसाय, कार्यक्रम, सरकारी सेवाएं और बहुत कुछ खोजें।' 
              : 'Your AI-powered digital guide for Amravati. Find businesses, events, government services and more.'}
          </p>
          <div className="hero-actions">
            <Link to="/chat" className="btn btn-accent btn-lg">
              <MessageCircle size={20} />
              {language === 'mr' ? 'चॅट सुरू करा' : language === 'hi' ? 'चैट शुरू करें' : 'Start Chatting'}
            </Link>
            <Link to="/directory" className="btn btn-outline btn-lg">
              <Building2 size={20} />
              {language === 'mr' ? 'डिरेक्टरी पहा' : language === 'hi' ? 'निर्देशिका खोजें' : 'Explore Directory'}
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
            <div className="stat-label">{getStatLabel(stat.key)}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="section-header">
          <h2>
            {language === 'mr' ? 'Ai Sathi काय करू शकतो?' : language === 'hi' ? 'Ai Sathi क्या कर सकता है?' : 'What can Ai Sathi do?'}
          </h2>
        </div>
        <div className="features-grid">
          {features.map((f, idx) => (
            <Link to={f.path} key={idx} className="feature-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 70}ms` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">
                {language === 'mr' ? f.titleMarathi : language === 'hi' ? f.titleHindi : f.title}
              </h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-arrow">
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Top Rated */}
      <section className="section">
        <div className="section-header">
          <h2>
            {language === 'mr' ? 'अमरावतीमध्ये टॉप रेटेड' : language === 'hi' ? 'अमरावती में टॉप रेटेड' : 'Top Rated in Amravati'}
          </h2>
          <Link to="/directory" className="section-link">
            {language === 'mr' ? 'सर्व पहा' : language === 'hi' ? 'सभी देखें' : 'View All'} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="top-rated-grid">
          {topBusinesses.map((biz, idx) => (
            <div key={biz.id} className="top-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="top-card-icon">{biz.image}</div>
              <div className="top-card-info">
                <h4>
                  {language === 'mr' ? biz.nameMarathi : language === 'hi' ? (biz.nameHindi || biz.name) : biz.name}
                </h4>
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
          <h2>
            {language === 'mr' ? 'आगामी कार्यक्रम' : language === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events'}
          </h2>
          <Link to="/events" className="section-link">
            {language === 'mr' ? 'सर्व पहा' : language === 'hi' ? 'सभी देखें' : 'View All'} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="events-preview-grid">
          {upcomingEvents.map((evt, idx) => (
            <div key={evt.id} className="event-preview-card card card-interactive animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="event-preview-icon">{evt.image}</div>
              <div className="event-preview-info">
                <h4>
                  {language === 'mr' ? evt.titleMarathi : language === 'hi' ? (evt.titleHindi || evt.title) : evt.title}
                </h4>
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

      {/* Amravati Information Tree */}
      <AmravatiInfoTree />

      {/* Feedback Form */}
      <section className="section feedback-section">
        <div className="section-header">
          <h2>
            {language === 'mr' ? 'तुमचा अभिप्राय' : language === 'hi' ? 'आपकी प्रतिक्रिया' : 'Your Feedback'}
          </h2>
          <p>
            {language === 'mr' ? 'Ai Sathi ला सुधारण्यासाठी आम्हाला मदत करा' : language === 'hi' ? 'Ai Sathi को बेहतर बनाने में हमारी मदद करें' : 'Help us improve Ai Sathi'}
          </p>
        </div>
        <div className="card feedback-card animate-fade-in-up">
          {submitted ? (
            <div className="feedback-success">
              <Sparkles size={48} className="success-icon" style={{ color: 'var(--success)' }} />
              <h3>{language === 'mr' ? 'धन्यवाद!' : language === 'hi' ? 'धन्यवाद!' : 'Thank You!'}</h3>
              <p>
                {language === 'mr' ? 'तुमचा अभिप्राय यशस्वीरित्या पाठवला गेला आहे।' : language === 'hi' ? 'आपकी प्रतिक्रिया सफलतापूर्वक सबमिट कर दी गई है।' : 'Your feedback has been successfully submitted.'}
              </p>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>
                  {language === 'mr' ? 'वेबसाइटला रेटिंग द्या' : language === 'hi' ? 'वेबसाइट को रेट करें' : 'Rate the website'}
                </label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${feedback.rating >= star ? 'active' : ''}`}
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                    >
                      <Star size={28} fill={feedback.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>
                  {language === 'mr' ? 'Ai Sathi बद्दल तुमचे विचार' : language === 'hi' ? 'Ai Sathi के बारे में आपके विचार' : 'Express view for Ai Sathi'}
                </label>
                <textarea
                  className="input"
                  rows="3"
                  value={feedback.view}
                  onChange={(e) => setFeedback({ ...feedback, view: e.target.value })}
                  placeholder={language === 'mr' ? 'तुमचे अनुभव येथे लिहा...' : language === 'hi' ? 'अपने अनुभव यहाँ साझा करें...' : 'Share your experience here...'}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>
                  {language === 'mr' ? 'Ai Sathi साठी काही सूचना' : language === 'hi' ? 'Ai Sathi के लिए कोई सुझाव' : 'Any suggestions for Ai Sathi'}
                </label>
                <textarea
                  className="input"
                  rows="3"
                  value={feedback.suggestion}
                  onChange={(e) => setFeedback({ ...feedback, suggestion: e.target.value })}
                  placeholder={language === 'mr' ? 'तुमच्या सूचना येथे लिहा...' : language === 'hi' ? 'अपने सुझाव यहाँ लिखें...' : 'Write your suggestions here...'}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={!feedback.rating || !feedback.view}>
                {language === 'mr' ? 'सबमिट करा' : language === 'hi' ? 'सबमिट करें' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Dashboard Footer (Privacy & Developer Info) */}
      <footer className="dashboard-footer">
        <p className="privacy-text">
          {language === 'mr' 
            ? '🔒 तुमची गोपनीयता आमच्यासाठी महत्त्वाची आहे. तुमचा सर्व डेटा सुरक्षित ठेवला जातो आणि कोणत्याही तिसऱ्या पक्षाला विकला जात नाही।' 
            : language === 'hi' 
            ? '🔒 आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। आपका सारा डेटा सुरक्षित रखा जाता है और किसी तीसरे पक्ष के साथ साझा नहीं किया जाता है।' 
            : '🔒 Your privacy and security matter. All data is securely handled and never shared with third parties.'}
        </p>
        <button className="btn btn-outline dev-team-btn" onClick={() => setIsDevModalOpen(true)}>
          <Users size={16} /> {language === 'mr' ? 'डेव्हलपर्स' : language === 'hi' ? 'डेवलपर्स' : 'Developers'}
        </button>
      </footer>

      {/* Developer Modal Overlay */}
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />
    </div>
  );
}
