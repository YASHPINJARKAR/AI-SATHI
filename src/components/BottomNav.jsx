import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageCircle, Building2, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './BottomNav.css';

const navItems = [
  { path: '/', label: 'Home', labelMarathi: 'मुख्यपृष्ठ', icon: LayoutDashboard },
  { path: '/directory', label: 'Directory', labelMarathi: 'डिरेक्टरी', icon: Building2 },
  { path: '/chat', label: 'AI Chat', labelMarathi: 'AI चॅट', icon: MessageCircle },
  { path: '/events', label: 'Events', labelMarathi: 'कार्यक्रम', icon: Calendar },
  { path: '/map', label: 'Map', labelMarathi: 'नकाशा', icon: MapPin },
];

export default function BottomNav() {
  const { language } = useLanguage();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <item.icon size={22} className="bottom-nav-icon" />
          <span className="bottom-nav-label">
            {language === 'mr' ? item.labelMarathi : item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
