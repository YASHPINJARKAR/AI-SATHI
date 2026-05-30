import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { UserCircle, LogOut, User } from 'lucide-react';
import './TopRightProfile.css';

export default function TopRightProfile() {
  const { user, openLoginModal, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="top-right-container">
        <div className="top-right-profile">
          <button className="btn btn-primary btn-sm" onClick={openLoginModal}>
            <UserCircle size={18} />
            <span className="hide-mobile">
              {language === 'mr' ? 'लॉगिन करा' : language === 'hi' ? 'लॉगिन करें' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="top-right-container">


      <div className="top-right-profile" ref={dropdownRef}>
        <button className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src={user.avatar} alt="Profile" className="profile-avatar" />
        </button>

      {dropdownOpen && (
        <div className="profile-dropdown animate-scale-in">
          <div className="dropdown-header">
            <div className="dropdown-user-info">
              <h4>{user.name}</h4>
              <p>{user.email || user.phone}</p>
            </div>
          </div>
          <div className="dropdown-body">
            <button className="dropdown-item" onClick={handleProfileClick}>
              <User size={16} />
              {language === 'mr' ? 'माझी प्रोफाइल' : language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <LogOut size={16} />
              {language === 'mr' ? 'लॉग आउट' : language === 'hi' ? 'लॉग आउट' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
