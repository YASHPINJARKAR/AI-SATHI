import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { User, Mail, Phone, Camera, Save, MapPin, Briefcase, Calendar, Users, Star, MessageCircle, Trash2, ShieldCheck, BarChart3, LogOut, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
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
      logoutOpt: "लॉग आउट"
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
      logoutOpt: "लॉग आउट"
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
      logoutOpt: "Logout"
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
