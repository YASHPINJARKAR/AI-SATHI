import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Directory from './pages/Directory';
import Events from './pages/Events';
import Services from './pages/Services';
import MapPage from './pages/MapPage';
import FloatingChatButton from './components/FloatingChatButton';
import BottomNav from './components/BottomNav';
import TopRightProfile from './components/TopRightProfile';
import LoginModal from './components/LoginModal';
import ProfilePage from './pages/ProfilePage';
import ParticleBackground from './components/ParticleBackground';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent({ collapsed, setCollapsed, darkMode, setDarkMode }) {
  const location = useLocation();
  const { user } = useAuth();
  const isLandingPage = location.pathname === '/';
  const isAdminMode = user && user.role === 'admin';

  // Force Admin users to ONLY access the standalone profile overview page and AI Chat
  if (isAdminMode && location.pathname !== '/profile' && location.pathname !== '/chat') {
    return <Navigate to="/profile" replace />;
  }

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <ParticleBackground isDarkMode={darkMode} />
      {!isAdminMode && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {!isAdminMode && <TopRightProfile darkMode={darkMode} setDarkMode={setDarkMode} />}
      <main
        className={`main-content ${collapsed ? 'collapsed' : ''} ${isAdminMode ? 'admin-mode' : ''}`}
        onClick={() => {
          if (!collapsed && window.innerWidth > 768 && !isAdminMode) {
            setCollapsed(true);
          }
        }}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/events" element={<Events />} />
          <Route path="/services" element={<Services />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </main>
      <FloatingChatButton />
      {!isAdminMode && <BottomNav />}
      <LoginModal />
    </div>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Default to light theme regardless of system preference
  useEffect(() => {
    // We can leave this empty or use it to load saved preferences later
    // setDarkMode(false); is already handled by the initial state
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
