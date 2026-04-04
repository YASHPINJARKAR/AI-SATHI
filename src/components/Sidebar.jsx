import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, Building2, Calendar, Landmark,
  MapPin, ChevronLeft, ChevronRight, Sun, Moon, Menu, X, Mic
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', labelMarathi: 'डॅशबोर्ड', icon: LayoutDashboard },
  { path: '/chat', label: 'AI Chat', labelMarathi: 'AI चॅट', icon: MessageCircle },
  { path: '/directory', label: 'Directory', labelMarathi: 'डिरेक्टरी', icon: Building2 },
  { path: '/events', label: 'Events', labelMarathi: 'कार्यक्रम', icon: Calendar },
  { path: '/services', label: 'Gov Services', labelMarathi: 'सरकारी सेवा', icon: Landmark },
  { path: '/map', label: 'Map', labelMarathi: 'नकाशा', icon: MapPin },
];

export default function Sidebar({ collapsed, setCollapsed, darkMode, setDarkMode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} id="mobile-menu-toggle">
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} id="main-sidebar">
        {/* Header / Brand */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <span className="brand-emoji">🤖</span>
            </div>
            {!collapsed && (
              <div className="brand-text">
                <h1 className="brand-name">Ai Sathi</h1>
                <span className="brand-tagline marathi-text">अमरावती सहाय्यक</span>
              </div>
            )}
          </div>
          <button className="mobile-close-btn" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
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
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-label-marathi marathi-text">{item.labelMarathi}</span>
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
          {/* Voice Button */}
          <button className="sidebar-voice-btn" id="sidebar-voice-btn" title="Voice Assistant">
            <Mic size={18} />
            {!collapsed && <span>Voice / आवाज</span>}
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
