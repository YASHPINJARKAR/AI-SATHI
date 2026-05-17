import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Check system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="app-layout">
            <Sidebar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <TopRightProfile />
            <main 
              className={`main-content ${collapsed ? 'collapsed' : ''}`}
              onClick={() => {
                if (!collapsed && window.innerWidth > 768) {
                  setCollapsed(true);
                }
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/events" element={<Events />} />
                <Route path="/services" element={<Services />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <FloatingChatButton />
            <BottomNav />
            <LoginModal />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
