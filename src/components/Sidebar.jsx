import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, Building2, Calendar, Landmark,
  MapPin, ChevronLeft, ChevronRight, Sun, Moon, Menu, X, Mic, Globe
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', labelMarathi: 'डॅशबोर्ड', icon: LayoutDashboard },
  { path: '/chat', label: 'AI Chat', labelMarathi: 'AI चॅट', icon: MessageCircle },
  { path: '/directory', label: 'Directory', labelMarathi: 'डिरेक्टरी', icon: Building2 },
  { path: '/events', label: 'Events', labelMarathi: 'कार्यक्रम', icon: Calendar },
  { path: '/services', label: 'Gov Services', labelMarathi: 'सरकारी सेवा', icon: Landmark },
  { path: '/map', label: 'Map', labelMarathi: 'नकाशा', icon: MapPin },
];

export default function Sidebar({ collapsed, setCollapsed, darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <div className="mobile-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-emoji">🤖</span>
          <span className="brand-name">Ai Sathi</span>
        </div>
        
        <div className="mobile-top-actions">
          <button className="mobile-action-btn" onClick={toggleLanguage} title={language === 'mr' ? 'English' : 'मराठी'}>
            <Globe size={20} />
          </button>
          
          <button className="mobile-action-btn" onClick={() => navigate('/chat')} title={language === 'mr' ? 'आवाज' : 'Voice'}>
            <Mic size={20} />
          </button>
          
          <button className="mobile-action-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} id="main-sidebar">
        {/* Header / Brand */}
        <div className="sidebar-header">
          <div className="brand" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            <div className="brand-icon">
              <span className="brand-emoji">🤖</span>
            </div>
            {!collapsed && (
              <div className="brand-text">
                <h1 className="brand-name">Ai Sathi</h1>
                <span className="brand-tagline marathi-text">
                  {language === 'mr' ? 'अमरावती सहाय्यक' : 'Amravati Guide'}
                </span>
              </div>
            )}
          </div>
          <button className="mobile-close-btn" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation (Hidden on mobile as we use BottomNav) */}
        <nav className="sidebar-nav desktop-only-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <span className="nav-icon">
                    <item.icon size={20} />
                  </span>
                  {!collapsed && (
                    <div className="nav-label-group">
                      <span className="nav-label">{language === 'mr' ? item.labelMarathi : item.label}</span>
                    </div>
                  )}
                  {!collapsed && (
                    <span className="nav-indicator" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Language Toggle */}
          <button className="theme-toggle" onClick={toggleLanguage} id="lang-toggle">
            <Globe size={18} />
            {!collapsed && <span>{language === 'mr' ? 'English' : 'मराठी'}</span>}
          </button>

          {/* Voice Button */}
          <button className="sidebar-voice-btn" id="sidebar-voice-btn" title="Voice Assistant">
            <Mic size={18} />
            {!collapsed && <span>{language === 'mr' ? 'आवाज' : 'Voice'}</span>}
          </button>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} id="theme-toggle">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Collapse Toggle (desktop only) */}
          <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} id="collapse-toggle">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
