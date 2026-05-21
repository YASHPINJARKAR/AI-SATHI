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
  { path: '/dashboard', label: 'Dashboard', labelMarathi: 'डॅशबोर्ड', labelHindi: 'डैशबोर्ड', icon: LayoutDashboard },
  { path: '/chat', label: 'AI Chat', labelMarathi: 'AI चॅट', labelHindi: 'एआई चैट', icon: MessageCircle },
  { path: '/directory', label: 'Directory', labelMarathi: 'डिरेक्टरी', labelHindi: 'निर्देशिका', icon: Building2 },
  { path: '/events', label: 'Events', labelMarathi: 'कार्यक्रम', labelHindi: 'कार्यक्रम', icon: Calendar },
  { path: '/services', label: 'Gov Services', labelMarathi: 'सरकारी सेवा', labelHindi: 'सरकारी सेवाएं', icon: Landmark },
  { path: '/map', label: 'Map', labelMarathi: 'नकाशा', labelHindi: 'मानचित्र', icon: MapPin },
];

export default function Sidebar({ collapsed, setCollapsed, darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopLangOpen(false);
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
          <div className="lang-dropdown-container">
            <button className="mobile-action-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)} title="Language">
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
          
          <button className="mobile-action-btn" onClick={() => navigate('/chat')} title={language === 'mr' ? 'आवाज' : language === 'hi' ? 'आवाज़' : 'Voice'}>
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
                  {language === 'mr' ? 'अमरावती सहाय्यक' : language === 'hi' ? 'अमरावती सहायक' : 'Amravati Guide'}
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
                      <span className="nav-label">
                        {language === 'mr' ? item.labelMarathi : language === 'hi' ? item.labelHindi : item.label}
                      </span>
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
          {/* Language Selector */}
          <div className="sidebar-lang-container">
            <button 
              className="sidebar-lang-btn" 
              onClick={() => setDesktopLangOpen(!desktopLangOpen)} 
              title={language === 'mr' ? 'भाषा बदला' : language === 'hi' ? 'भाषा बदलें' : 'Change Language'}
              id="sidebar-lang-toggle"
            >
              <Globe size={18} />
              {!collapsed && (
                <>
                  <span>
                    {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'}
                  </span>
                  <span className="lang-chevron">▲</span>
                </>
              )}
            </button>
            {desktopLangOpen && (
              <div className="lang-dropdown-menu up-dropdown sidebar-lang-dropdown">
                <button onClick={() => { changeLanguage('en'); setDesktopLangOpen(false); }} className={language === 'en' ? 'active' : ''}>English</button>
                <button onClick={() => { changeLanguage('hi'); setDesktopLangOpen(false); }} className={language === 'hi' ? 'active' : ''}>हिन्दी</button>
                <button onClick={() => { changeLanguage('mr'); setDesktopLangOpen(false); }} className={language === 'mr' ? 'active' : ''}>मराठी</button>
              </div>
            )}
          </div>

          {/* Voice Assistant */}
          <button 
            className="sidebar-voice-btn" 
            onClick={() => navigate('/chat?voice=true')}
            title={language === 'mr' ? 'व्हॉइस असिस्टंट' : language === 'hi' ? 'वॉयस असिस्टेंट' : 'Voice Assistant'}
            id="sidebar-voice-toggle"
          >
            <Mic size={18} />
            {!collapsed && (
              <span>
                {language === 'mr' ? 'व्हॉइस असिस्टंट' : language === 'hi' ? 'वॉयस असिस्टेंट' : 'Voice Assistant'}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)} 
            title={darkMode ? (language === 'mr' ? 'प्रकाश मोड' : language === 'hi' ? 'लाइट मोड' : 'Light Mode') : (language === 'mr' ? 'गडद मोड' : language === 'hi' ? 'डार्क मोड' : 'Dark Mode')}
            id="sidebar-theme-toggle"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (
              <span>
                {darkMode 
                  ? (language === 'mr' ? 'प्रकाश मोड' : language === 'hi' ? 'लाइट मोड' : 'Light Mode') 
                  : (language === 'mr' ? 'गडद मोड' : language === 'hi' ? 'डार्क मोड' : 'Dark Mode')}
              </span>
            )}
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
