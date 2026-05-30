import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { User, Mail, Phone, Camera, Save, MapPin, Briefcase, Calendar, Users, Star, MessageCircle, Trash2, ShieldCheck, BarChart3, LogOut, MessageSquare, Sun, Moon, Globe, Plus, Edit, Search } from 'lucide-react';
import { businesses, events } from '../data/mockData';
import './ProfilePage.css';

// Admin Dashboard Component
function AdminProfileView({ user, language, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { changeLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [usersList, setUsersList] = useState(() => JSON.parse(localStorage.getItem('ai_sathi_all_users') || '[]'));
  const [registrations, setRegistrations] = useState(() => JSON.parse(localStorage.getItem('ai_sathi_event_registrations') || '[]'));
  const [feedbacks, setFeedbacks] = useState(() => JSON.parse(localStorage.getItem('ai_sathi_feedbacks') || '[]'));

  // State for Active Tab and Lists
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'directory' | 'events'
  
  const [bizList, setBizList] = useState(() => {
    const local = localStorage.getItem('ai_sathi_businesses');
    if (local) return JSON.parse(local);
    localStorage.setItem('ai_sathi_businesses', JSON.stringify(businesses));
    return businesses;
  });

  const [evList, setEvList] = useState(() => {
    const local = localStorage.getItem('ai_sathi_events');
    if (local) return JSON.parse(local);
    localStorage.setItem('ai_sathi_events', JSON.stringify(events));
    return events;
  });

  // Filters and searches
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCategory, setDirectoryCategory] = useState('all');
  const [eventsSearch, setEventsSearch] = useState('');
  const [eventsCategory, setEventsCategory] = useState('all');

  // Business Modal form state
  const [showBizForm, setShowBizForm] = useState(false);
  const [bizFormMode, setBizFormMode] = useState('add'); // 'add' | 'edit'
  const [editingBizId, setEditingBizId] = useState(null);
  const [bizForm, setBizForm] = useState({
    name: '',
    nameMarathi: '',
    nameHindi: '',
    category: 'restaurant',
    rating: 4.5,
    reviews: 10,
    address: '',
    phone: '',
    hours: '11:00 AM - 11:00 PM',
    tags: '',
    image: '🍽️',
    isOpen: true
  });

  // Event Modal form state
  const [showEvForm, setShowEvForm] = useState(false);
  const [evFormMode, setEvFormMode] = useState('add'); // 'add' | 'edit'
  const [editingEvId, setEditingEvId] = useState(null);
  const [evForm, setEvForm] = useState({
    title: '',
    titleMarathi: '',
    titleHindi: '',
    category: 'tech',
    date: '',
    time: '10:00 AM',
    location: '',
    price: 'Free',
    description: '',
    attendees: 50,
    image: '💻',
    contact: '',
    organizer: '',
    maxPeople: 5
  });

  const t = {
    mr: {
      adminDashboard: "प्रशासक पोर्टल (Admin Portal)",
      overview: "आढावा",
      users: "नोंदणीकृत वापरकर्ते",
      registrations: "कार्यक्रम नोंदणी",
      feedback: "वापरकर्ता अभिप्राय",
      totalUsers: "एकूण वापरकर्ते",
      eventRegs: "कार्यक्रम नोंदणी",
      totalFeedbacks: "एकूण अभिप्राय",
      avgRating: "सरासरी रेटिंग",
      name: "नाव",
      email: "ईमेल",
      phone: "फोन",
      joinedDate: "नोंदणी तारीख",
      event: "कार्यक्रम",
      people: "लोक",
      notes: "विशेष टीप",
      rating: "रेटिंग",
      comment: "अभिप्राय",
      suggestion: "सूचना",
      actions: "कृती",
      delete: "हटवा",
      noData: "कोणतीही माहिती उपलब्ध नाही",
      adminBadge: "मुख्य प्रशासक",
      chatOpt: "AI चॅट वर जा",
      logoutOpt: "लॉग आउट",
      manageDir: "डिरेक्टरी व्यवस्थापन",
      manageEv: "कार्यक्रम व्यवस्थापन"
    },
    hi: {
      adminDashboard: "प्रशासक पोर्टल (Admin Portal)",
      overview: "अवलोकन",
      users: "पंजीकृत उपयोगकर्ता",
      registrations: "कार्यक्रम पंजीकरण",
      feedback: "उपयोगकर्ता प्रतिक्रिया",
      totalUsers: "कुल उपयोगकर्ता",
      eventRegs: "कार्यक्रम पंजीकरण",
      totalFeedbacks: "कुल प्रतिक्रियाएं",
      avgRating: "औसत रेटिंग",
      name: "नाम",
      email: "ईमेल",
      phone: "फ़ोन",
      joinedDate: "जुड़ने की तारीख",
      event: "कार्यक्रम",
      people: "लोग",
      notes: "विशेष टिप्पणी",
      rating: "रेटिंग",
      comment: "टिप्पणी",
      suggestion: "सुझाव",
      actions: "कार्रवाई",
      delete: "हटाएं",
      noData: "कोई डेटा उपलब्ध नहीं है",
      adminBadge: "मुख्य प्रशासक",
      chatOpt: "AI चैट पर जाएं",
      logoutOpt: "लॉग आउट",
      manageDir: "निर्देशिका प्रबंधन",
      manageEv: "कार्यक्रम प्रबंधन"
    },
    en: {
      adminDashboard: "Admin Portal",
      overview: "Overview",
      users: "Registered Users",
      registrations: "Event Registrations",
      feedback: "User Feedbacks",
      totalUsers: "Total Users",
      eventRegs: "Event Registrations",
      totalFeedbacks: "Total Feedbacks",
      avgRating: "Average Rating",
      name: "Name",
      email: "Email",
      phone: "Phone",
      joinedDate: "Joined Date",
      event: "Event",
      people: "People",
      notes: "Special Notes",
      rating: "Rating",
      comment: "Comment",
      suggestion: "Suggestion",
      actions: "Actions",
      delete: "Delete",
      noData: "No data available",
      adminBadge: "Super Admin",
      chatOpt: "AI Chat",
      logoutOpt: "Logout",
      manageDir: "Manage Directory",
      manageEv: "Manage Events"
    }
  };

  const currentT = t[language] || t.en;

  // Calculate average rating
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const handleDeleteFeedback = (id) => {
    const updated = feedbacks.filter(fb => fb.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('ai_sathi_feedbacks', JSON.stringify(updated));
  };

  const handleDeleteRegistration = (id) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    localStorage.setItem('ai_sathi_event_registrations', JSON.stringify(updated));
  };

  const handleDeleteUser = (id) => {
    const updated = usersList.filter(u => u.id !== id);
    setUsersList(updated);
    localStorage.setItem('ai_sathi_all_users', JSON.stringify(updated));
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  // Business CRUD actions
  const handleOpenAddBiz = () => {
    setBizForm({
      name: '',
      nameMarathi: '',
      nameHindi: '',
      category: 'restaurant',
      rating: 4.5,
      reviews: 10,
      address: '',
      phone: '',
      hours: '11:00 AM - 11:00 PM',
      tags: '',
      image: '🍽️',
      isOpen: true
    });
    setBizFormMode('add');
    setShowBizForm(true);
  };

  const handleOpenEditBiz = (biz) => {
    setBizForm({
      name: biz.name || '',
      nameMarathi: biz.nameMarathi || '',
      nameHindi: biz.nameHindi || '',
      category: biz.category || 'restaurant',
      rating: biz.rating || 4.5,
      reviews: biz.reviews || 0,
      address: biz.address || '',
      phone: biz.phone || '',
      hours: biz.hours || '11:00 AM - 11:00 PM',
      tags: biz.tags ? biz.tags.join(', ') : '',
      image: biz.image || '🍽️',
      isOpen: biz.isOpen !== undefined ? biz.isOpen : true
    });
    setEditingBizId(biz.id);
    setBizFormMode('edit');
    setShowBizForm(true);
  };

  const handleSaveBiz = (e) => {
    e.preventDefault();
    let updated;
    const tagArray = bizForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (bizFormMode === 'add') {
      const newBiz = {
        ...bizForm,
        id: Date.now(),
        rating: parseFloat(bizForm.rating),
        reviews: parseInt(bizForm.reviews),
        tags: tagArray
      };
      updated = [newBiz, ...bizList];
    } else {
      updated = bizList.map(b => b.id === editingBizId ? {
        ...b,
        ...bizForm,
        rating: parseFloat(bizForm.rating),
        reviews: parseInt(bizForm.reviews),
        tags: tagArray
      } : b);
    }
    setBizList(updated);
    localStorage.setItem('ai_sathi_businesses', JSON.stringify(updated));
    setShowBizForm(false);
  };

  const handleDeleteBiz = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const updated = bizList.filter(b => b.id !== id);
      setBizList(updated);
      localStorage.setItem('ai_sathi_businesses', JSON.stringify(updated));
    }
  };

  // Event CRUD actions
  const handleOpenAddEv = () => {
    setEvForm({
      title: '',
      titleMarathi: '',
      titleHindi: '',
      category: 'tech',
      date: '',
      time: '10:00 AM',
      location: '',
      price: 'Free',
      description: '',
      attendees: 50,
      image: '💻',
      contact: '',
      organizer: '',
      maxPeople: 5
    });
    setEvFormMode('add');
    setShowEvForm(true);
  };

  const handleOpenEditEv = (evt) => {
    setEvForm({
      title: evt.title || '',
      titleMarathi: evt.titleMarathi || '',
      titleHindi: evt.titleHindi || '',
      category: evt.category || 'tech',
      date: evt.date || '',
      time: evt.time || '10:00 AM',
      location: evt.location || '',
      price: evt.price || 'Free',
      description: evt.description || '',
      attendees: evt.attendees || 50,
      image: evt.image || '💻',
      contact: evt.contact || '',
      organizer: evt.organizer || '',
      maxPeople: evt.maxPeople || 5
    });
    setEditingEvId(evt.id);
    setEvFormMode('edit');
    setShowEvForm(true);
  };

  const handleSaveEv = (e) => {
    e.preventDefault();
    let updated;
    if (evFormMode === 'add') {
      const newEv = {
        ...evForm,
        id: Date.now(),
        attendees: parseInt(evForm.attendees),
        maxPeople: parseInt(evForm.maxPeople)
      };
      updated = [newEv, ...evList];
    } else {
      updated = evList.map(evt => evt.id === editingEvId ? {
        ...evt,
        ...evForm,
        attendees: parseInt(evForm.attendees),
        maxPeople: parseInt(evForm.maxPeople)
      } : evt);
    }
    setEvList(updated);
    localStorage.setItem('ai_sathi_events', JSON.stringify(updated));
    setShowEvForm(false);
  };

  const handleDeleteEv = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = evList.filter(evt => evt.id !== id);
      setEvList(updated);
      localStorage.setItem('ai_sathi_events', JSON.stringify(updated));
    }
  };

  return (
    <div className="page-container admin-dashboard unified-onepage">
      {/* Premium Dedicated Admin Header */}
      <div className="admin-header unified-admin-header">
        <div className="admin-title-section">
          <div className="admin-brand-logo">🛡️</div>
          <div>
            <h1>{currentT.adminDashboard}</h1>
            <p className="admin-subtitle">Logged in as: <strong>{user.email}</strong></p>
          </div>
        </div>
        
        {/* Dedicated Admin Actions */}
        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Toggle */}
          <div className="lang-dropdown-container">
            <button 
              className="btn btn-ghost btn-sm admin-action-icon-btn" 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)' }}
            >
              <Globe size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
              </span>
            </button>
            {langDropdownOpen && (
              <div className="lang-dropdown-menu mobile-lang-dropdown">
                <button onClick={() => { changeLanguage('en'); setLangDropdownOpen(false); }} className={language === 'en' ? 'active' : ''}>English</button>
                <button onClick={() => { changeLanguage('hi'); setLangDropdownOpen(false); }} className={language === 'hi' ? 'active' : ''}>हिन्दी</button>
                <button onClick={() => { changeLanguage('mr'); setLangDropdownOpen(false); }} className={language === 'mr' ? 'active' : ''}>मराठी</button>
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button 
            className="btn btn-ghost btn-sm admin-action-icon-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)' }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button 
            className="btn btn-secondary btn-sm admin-chat-nav-btn"
            onClick={() => navigate('/chat')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <MessageSquare size={16} />
            {currentT.chatOpt}
          </button>
          <button 
            className="btn btn-primary btn-sm admin-logout-btn" 
            onClick={handleLogoutClick}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#d32f2f', borderColor: '#d32f2f', fontWeight: '600' }}
          >
            <LogOut size={16} />
            {currentT.logoutOpt}
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="admin-tabs">
        <button className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 {currentT.overview}
        </button>
        <button className={`admin-tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>
          🏪 {currentT.manageDir}
        </button>
        <button className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
          🎉 {currentT.manageEv}
        </button>
      </div>

      {/* activeTab === 'overview' */}
      {activeTab === 'overview' && (
        <>
          {/* Metrics Row */}
          <div className="overview-stats-grid">
            <div className="admin-stat-card card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{background: 'rgba(57, 73, 171, 0.1)', color: '#3949ab'}}>
                  <Users size={24} />
                </div>
                <span className="stat-card-title">{currentT.totalUsers}</span>
              </div>
              <div className="stat-card-value">{usersList.length}</div>
            </div>

            <div className="admin-stat-card card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{background: 'rgba(233, 30, 99, 0.1)', color: '#e91e63'}}>
                  <Calendar size={24} />
                </div>
                <span className="stat-card-title">{currentT.eventRegs}</span>
              </div>
              <div className="stat-card-value">{registrations.length}</div>
            </div>

            <div className="admin-stat-card card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{background: 'rgba(0, 200, 83, 0.1)', color: '#00c853'}}>
                  <MessageCircle size={24} />
                </div>
                <span className="stat-card-title">{currentT.totalFeedbacks}</span>
              </div>
              <div className="stat-card-value">{feedbacks.length}</div>
            </div>

            <div className="admin-stat-card card">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper" style={{background: 'rgba(255, 109, 0, 0.1)', color: '#ff6d00'}}>
                  <Star size={24} />
                </div>
                <span className="stat-card-title">{currentT.avgRating}</span>
              </div>
              <div className="stat-card-value">{avgRating} <span className="stat-card-value-small">/ 5.0</span></div>
            </div>
          </div>

          {/* Unified Sections Stacked in a Single Page */}
          <div className="admin-unified-sections">
            
            {/* Section 1: User Directory */}
            <div className="admin-section-block admin-table-container card">
              <h2>👥 {currentT.users}</h2>
              {usersList.length === 0 ? (
                <div className="empty-table-message">{currentT.noData}</div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>{currentT.name}</th>
                        <th>{currentT.email}</th>
                        <th>{currentT.phone}</th>
                        <th>{currentT.joinedDate}</th>
                        <th>{currentT.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((usr) => (
                        <tr key={usr.id}>
                          <td className="font-weight-bold">{usr.name}</td>
                          <td>{usr.email}</td>
                          <td>{usr.phone}</td>
                          <td>{usr.joinedAt}</td>
                          <td>
                            <button className="delete-row-btn" onClick={() => handleDeleteUser(usr.id)} title={currentT.delete}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 2: Event Registrations */}
            <div className="admin-section-block">
              <h2 style={{ fontSize: '1.4rem', margin: '32px 0 16px', color: 'var(--text-primary)' }}>📅 {currentT.registrations}</h2>
              {registrations.length === 0 ? (
                <div className="empty-table-message card">{currentT.noData}</div>
              ) : (
                <div className="registrations-grid-layout">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="admin-reg-card card">
                      <div className="reg-card-top">
                        <div>
                          <h3>{reg.eventTitle}</h3>
                          <p className="reg-user-details">
                            <strong>{reg.userName}</strong> · {reg.userPhone} · {reg.userEmail}
                          </p>
                        </div>
                        <button className="delete-row-btn" onClick={() => handleDeleteRegistration(reg.id)} title={currentT.delete}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="reg-card-middle">
                        <div className="reg-meta-badge">
                          👥 {reg.people} {language === 'mr' ? 'लोक' : language === 'hi' ? 'लोग' : 'People'}
                        </div>
                        <div className="reg-meta-badge date-badge">📅 {reg.registeredAt}</div>
                      </div>
                      {reg.notes && reg.notes !== 'N/A' && (
                        <div className="reg-notes-box">
                          <strong>{currentT.notes}:</strong> {reg.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Feedback Submissions */}
            <div className="admin-section-block" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: '32px 0 16px', color: 'var(--text-primary)' }}>💬 {currentT.feedback}</h2>
              {feedbacks.length === 0 ? (
                <div className="empty-table-message card">{currentT.noData}</div>
              ) : (
                <div className="feedbacks-grid-layout">
                  {feedbacks.map((fb) => (
                    <div key={fb.id} className="admin-feedback-card card">
                      <div className="fb-card-header">
                        <div className="fb-card-user">
                          <h4>{fb.userName}</h4>
                          <span>{fb.userEmail} · {fb.submittedAt}</span>
                        </div>
                        <button className="delete-row-btn" onClick={() => handleDeleteFeedback(fb.id)} title={currentT.delete}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="fb-rating-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={16} fill={fb.rating >= star ? '#ff6d00' : 'none'} color="#ff6d00" />
                        ))}
                      </div>
                      <div className="fb-content-box">
                        <p><strong>{currentT.comment}:</strong> {fb.view}</p>
                        {fb.suggestion && (
                          <p className="fb-suggestion-text"><strong>{currentT.suggestion}:</strong> {fb.suggestion}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </>
      )}

      {/* activeTab === 'directory' */}
      {activeTab === 'directory' && (
        <div className="admin-section-block admin-table-container card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h2>🏪 {language === 'mr' ? 'व्यवसाय डिरेक्टरी व्यवस्थापन' : language === 'hi' ? 'व्यवसाय निर्देशिका प्रबंधन' : 'Business Directory Management'}</h2>
            <button className="btn btn-primary" onClick={handleOpenAddBiz} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
              <Plus size={16} /> {language === 'mr' ? 'नवीन जोडा' : language === 'hi' ? 'नया जोड़ें' : 'Add Business'}
            </button>
          </div>
          
          {/* Controls: Search & Category Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', position: 'relative', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px', background: 'var(--bg-secondary)' }}>
              <Search size={16} style={{ color: 'var(--text-tertiary)', marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder={language === 'mr' ? 'शोधा...' : 'Search listings...'}
                value={directorySearch} 
                onChange={(e) => setDirectorySearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            
            <select 
              className="input"
              value={directoryCategory} 
              onChange={(e) => setDirectoryCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '180px', padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            >
              <option value="all">All Categories</option>
              <option value="restaurant">Restaurant 🍽️</option>
              <option value="hospital">Hospital 🏥</option>
              <option value="pharmacy">Pharmacy 💊</option>
              <option value="school">School 🏫</option>
              <option value="college">College 🎓</option>
              <option value="coaching">Coaching 📚</option>
              <option value="hotel">Hotel 🏨</option>
              <option value="gym">Gym 🏋️</option>
              <option value="atm">ATM 🏧</option>
            </select>
          </div>

          {/* Directory Listings Table */}
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bizList.filter(b => {
                  const matchesSearch = b.name.toLowerCase().includes(directorySearch.toLowerCase()) || 
                    (b.nameMarathi && b.nameMarathi.includes(directorySearch)) ||
                    (b.nameHindi && b.nameHindi.includes(directorySearch)) ||
                    (b.tags && b.tags.some(tag => tag.toLowerCase().includes(directorySearch.toLowerCase())));
                  
                  const matchesCategory = directoryCategory === 'all' || b.category === directoryCategory;
                  return matchesSearch && matchesCategory;
                }).map(b => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>{b.image}</span>
                      <strong className="font-weight-bold">{b.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{b.nameMarathi}</div>
                    </td>
                    <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{b.category}</span></td>
                    <td>⭐ {b.rating} ({b.reviews})</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.address}>{b.address}</td>
                    <td>{b.phone || 'N/A'}</td>
                    <td>
                      <span className={`biz-status ${b.isOpen ? 'open' : 'closed'}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {b.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="delete-row-btn" onClick={() => handleOpenEditBiz(b)} title="Edit" style={{ color: 'var(--accent)' }}>
                          <Edit size={16} />
                        </button>
                        <button className="delete-row-btn" onClick={() => handleDeleteBiz(b.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* activeTab === 'events' */}
      {activeTab === 'events' && (
        <div className="admin-section-block admin-table-container card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h2>🎉 {language === 'mr' ? 'कार्यक्रम आणि उपक्रम व्यवस्थापन' : language === 'hi' ? 'कार्यक्रम और गतिविधियाँ प्रबंधन' : 'Events & Activities Management'}</h2>
            <button className="btn btn-primary" onClick={handleOpenAddEv} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
              <Plus size={16} /> {language === 'mr' ? 'नवीन जोडा' : language === 'hi' ? 'नया जोड़ें' : 'Add Event'}
            </button>
          </div>
          
          {/* Controls: Search & Category Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center', position: 'relative', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px', background: 'var(--bg-secondary)' }}>
              <Search size={16} style={{ color: 'var(--text-tertiary)', marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder={language === 'mr' ? 'शोधा...' : 'Search events...'}
                value={eventsSearch} 
                onChange={(e) => setEventsSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '100%', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            
            <select 
              className="input"
              value={eventsCategory} 
              onChange={(e) => setEventsCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '180px', padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            >
              <option value="all">All Categories</option>
              <option value="tech">Tech 💻</option>
              <option value="culture">Culture 🎭</option>
              <option value="sports">Sports ⚽</option>
              <option value="education">Education 🎓</option>
              <option value="health">Health 🩺</option>
              <option value="government">Government 🏛️</option>
            </select>
          </div>

          {/* Events Listings Table */}
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Organizer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {evList.filter(evt => {
                  const matchesSearch = evt.title.toLowerCase().includes(eventsSearch.toLowerCase()) ||
                    (evt.titleMarathi && evt.titleMarathi.includes(eventsSearch)) ||
                    (evt.titleHindi && evt.titleHindi.includes(eventsSearch)) ||
                    evt.location.toLowerCase().includes(eventsSearch.toLowerCase());
                  
                  const matchesCategory = eventsCategory === 'all' || evt.category === eventsCategory;
                  return matchesSearch && matchesCategory;
                }).map(evt => (
                  <tr key={evt.id}>
                    <td>
                      <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>{evt.image}</span>
                      <strong className="font-weight-bold">{evt.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{evt.titleMarathi}</div>
                    </td>
                    <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{evt.category}</span></td>
                    <td>
                      <div>📅 {evt.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>⏰ {evt.time}</div>
                    </td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={evt.location}>{evt.location}</td>
                    <td>
                      <span className={`event-price ${evt.price === 'Free' ? 'free' : 'paid'}`} style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {evt.price}
                      </span>
                    </td>
                    <td>
                      <div>{evt.organizer || 'Event Committee'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>📞 {evt.contact || 'N/A'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="delete-row-btn" onClick={() => handleOpenEditEv(evt)} title="Edit" style={{ color: 'var(--accent)' }}>
                          <Edit size={16} />
                        </button>
                        <button className="delete-row-btn" onClick={() => handleDeleteEv(evt.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Directory Listing Add/Edit Modal ── */}
      {showBizForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card card card-elevated" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{bizFormMode === 'add' ? '➕ Add New Listing' : '✏️ Edit Listing'}</h3>
              <button onClick={() => setShowBizForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', padding: 0 }}>×</button>
            </div>
            
            <form onSubmit={handleSaveBiz} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Business Name (English) *</label>
                  <input type="text" className="input" required value={bizForm.name} onChange={e => setBizForm({ ...bizForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Business Name (Marathi) *</label>
                  <input type="text" className="input" required value={bizForm.nameMarathi} onChange={e => setBizForm({ ...bizForm, nameMarathi: e.target.value })} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Business Name (Hindi)</label>
                  <input type="text" className="input" value={bizForm.nameHindi} onChange={e => setBizForm({ ...bizForm, nameHindi: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="input" value={bizForm.category} onChange={e => setBizForm({ ...bizForm, category: e.target.value })}>
                    <option value="restaurant">Restaurant</option>
                    <option value="hospital">Hospital</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="school">School</option>
                    <option value="college">College</option>
                    <option value="coaching">Coaching</option>
                    <option value="hotel">Hotel</option>
                    <option value="gym">Gym</option>
                    <option value="atm">ATM</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Rating (1-5) *</label>
                  <input type="number" step="0.1" min="1" max="5" className="input" required value={bizForm.rating} onChange={e => setBizForm({ ...bizForm, rating: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Reviews Count</label>
                  <input type="number" className="input" value={bizForm.reviews} onChange={e => setBizForm({ ...bizForm, reviews: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Emoji Icon *</label>
                  <input type="text" className="input" required placeholder="e.g. 🏥, 🍽️" value={bizForm.image} onChange={e => setBizForm({ ...bizForm, image: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input type="text" className="input" required value={bizForm.address} onChange={e => setBizForm({ ...bizForm, address: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="input" value={bizForm.phone} onChange={e => setBizForm({ ...bizForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Hours Open</label>
                  <input type="text" className="input" placeholder="e.g. 24 Hours Open, 9 AM - 9 PM" value={bizForm.hours} onChange={e => setBizForm({ ...bizForm, hours: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input type="text" className="input" placeholder="e.g. Heart Care, Emergency, ICU" value={bizForm.tags} onChange={e => setBizForm({ ...bizForm, tags: e.target.value })} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <input type="checkbox" id="isOpen" checked={bizForm.isOpen} onChange={e => setBizForm({ ...bizForm, isOpen: e.target.checked })} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                <label htmlFor="isOpen" style={{ cursor: 'pointer', fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>Is Currently Open?</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowBizForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Event Add/Edit Modal ── */}
      {showEvForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card card card-elevated" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{evFormMode === 'add' ? '➕ Add New Event' : '✏️ Edit Event'}</h3>
              <button onClick={() => setShowEvForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', padding: 0 }}>×</button>
            </div>
            
            <form onSubmit={handleSaveEv} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Event Title (English) *</label>
                  <input type="text" className="input" required value={evForm.title} onChange={e => setEvForm({ ...evForm, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Event Title (Marathi) *</label>
                  <input type="text" className="input" required value={evForm.titleMarathi} onChange={e => setEvForm({ ...evForm, titleMarathi: e.target.value })} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Event Title (Hindi)</label>
                  <input type="text" className="input" value={evForm.titleHindi} onChange={e => setEvForm({ ...evForm, titleHindi: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="input" value={evForm.category} onChange={e => setEvForm({ ...evForm, category: e.target.value })}>
                    <option value="tech">Tech</option>
                    <option value="culture">Culture</option>
                    <option value="sports">Sports</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="government">Government</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" className="input" required value={evForm.date} onChange={e => setEvForm({ ...evForm, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="text" className="input" required placeholder="e.g. 10:00 AM" value={evForm.time} onChange={e => setEvForm({ ...evForm, time: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Emoji Icon *</label>
                  <input type="text" className="input" required placeholder="e.g. 💻, 🎭" value={evForm.image} onChange={e => setEvForm({ ...evForm, image: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" className="input" required value={evForm.location} onChange={e => setEvForm({ ...evForm, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input type="text" className="input" required placeholder="e.g. Free, ₹200 per person" value={evForm.price} onChange={e => setEvForm({ ...evForm, price: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea className="input" rows="3" required value={evForm.description} onChange={e => setEvForm({ ...evForm, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Attendees Count</label>
                  <input type="number" className="input" value={evForm.attendees} onChange={e => setEvForm({ ...evForm, attendees: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Organizer Name</label>
                  <input type="text" className="input" placeholder="e.g. Tech Club" value={evForm.organizer} onChange={e => setEvForm({ ...evForm, organizer: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Max Registrants</label>
                  <input type="number" className="input" value={evForm.maxPeople} onChange={e => setEvForm({ ...evForm, maxPeople: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Organizer Contact</label>
                <input type="text" className="input" placeholder="e.g. +91 9800000000" value={evForm.contact} onChange={e => setEvForm({ ...evForm, contact: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEvForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage({ darkMode, setDarkMode }) {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    location: user?.location || '',
    profession: user?.profession || '',
    avatar: user?.avatar || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  // Toggle layout based on role
  if (user.role === 'admin') {
    return <AdminProfileView user={user} language={language} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Automatically save the new avatar when selected
        const newAvatar = reader.result;
        setFormData((prev) => ({ ...prev, avatar: newAvatar }));
        updateProfile({ ...formData, avatar: newAvatar });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container profile-page">
      <div className="profile-header">
        <h1>
          {language === 'mr' ? 'तुमची प्रोफाइल' : language === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
        </h1>
        <p>
          {language === 'mr' ? 'तुमची वैयक्तिक माहिती व्यवस्थापित करा' : language === 'hi' ? 'अपनी व्यक्तिगत जानकारी प्रबंधित करें' : 'Manage your personal information'}
        </p>
      </div>

      <div className="profile-content card">
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <img src={formData.avatar} alt="Avatar" className="profile-page-avatar" />
            <button 
              className="change-avatar-btn" 
              title="Change Avatar"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handlePhotoUpload} 
            />
          </div>
          <h3>{user.name}</h3>
          <p className="profile-role badge badge-primary">
            {language === 'mr' ? 'प्रमाणित वापरकर्ता' : language === 'hi' ? 'सत्यापित उपयोगकर्ता' : 'Verified User'}
          </p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={16} /> {language === 'mr' ? 'पूर्ण नाव' : language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
            <input 
              type="text" 
              name="name"
              className="input" 
              value={formData.name} 
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label><Mail size={16} /> {language === 'mr' ? 'ईमेल पत्ता' : language === 'hi' ? 'ईमेल पता' : 'Email Address'}</label>
            <input 
              type="email" 
              name="email"
              className="input" 
              value={formData.email} 
              onChange={handleChange}
              disabled={true} // Email usually shouldn't be edited easily
            />
          </div>

          <div className="form-group">
            <label><Phone size={16} /> {language === 'mr' ? 'मोबाईल नंबर' : language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
            <input 
              type="tel" 
              name="phone"
              className="input" 
              value={formData.phone} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label><Calendar size={16} /> {language === 'mr' ? 'वय' : language === 'hi' ? 'उम्र' : 'Age'}</label>
            <input 
              type="number" 
              name="age"
              className="input" 
              value={formData.age} 
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={language === 'mr' ? 'तुमचे वय प्रविष्ट करा' : language === 'hi' ? 'अपनी उम्र दर्ज करें' : 'Enter your age'}
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label><Users size={16} /> {language === 'mr' ? 'लिंग' : language === 'hi' ? 'लिंग' : 'Gender'}</label>
            <select 
              name="gender" 
              className="input" 
              value={formData.gender} 
              onChange={handleChange} 
              disabled={!isEditing}
            >
              <option value="">{language === 'mr' ? 'निवडा...' : language === 'hi' ? 'चुनें...' : 'Select...'}</option>
              <option value="Male">{language === 'mr' ? 'पुरुष' : language === 'hi' ? 'पुरुष' : 'Male'}</option>
              <option value="Female">{language === 'mr' ? 'महिला' : language === 'hi' ? 'महिला' : 'Female'}</option>
              <option value="Other">{language === 'mr' ? 'इतर' : language === 'hi' ? 'अन्य' : 'Other'}</option>
            </select>
          </div>

          <div className="form-group">
            <label><MapPin size={16} /> {language === 'mr' ? 'पत्ता / स्थान' : language === 'hi' ? 'पता / स्थान' : 'Address / Location'}</label>
            <input 
              type="text" 
              name="location"
              className="input" 
              value={formData.location} 
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={language === 'mr' ? 'उदा. अमरावती, महाराष्ट्र' : language === 'hi' ? 'उदा. अमरावती, महाराष्ट्र' : 'e.g. Amravati, Maharashtra'}
            />
          </div>

          <div className="form-group">
            <label><Briefcase size={16} /> {language === 'mr' ? 'व्यवसाय' : language === 'hi' ? 'व्यवसाय' : 'Profession'}</label>
            <select 
              name="profession" 
              className="input" 
              value={formData.profession} 
              onChange={handleChange} 
              disabled={!isEditing}
            >
              <option value="">{language === 'mr' ? 'निवडा...' : language === 'hi' ? 'चुनें...' : 'Select...'}</option>
              <option value="Student">{language === 'mr' ? 'विद्यार्थी' : language === 'hi' ? 'छात्र' : 'Student'}</option>
              <option value="Professional">{language === 'mr' ? 'नोकरी करणारा' : language === 'hi' ? 'पेशेवर' : 'Professional'}</option>
              <option value="Business Owner">{language === 'mr' ? 'व्यावसायिक' : language === 'hi' ? 'व्यवसायी' : 'Business Owner'}</option>
              <option value="Farmer">{language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'Farmer'}</option>
              <option value="Other">{language === 'mr' ? 'इतर' : language === 'hi' ? 'अन्य' : 'Other'}</option>
            </select>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                  {language === 'mr' ? 'रद्द करा' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {language === 'mr' ? 'जतन करा' : language === 'hi' ? 'सहेजें' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(true)}>
                {language === 'mr' ? 'प्रोफाइल संपादित करा' : language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
