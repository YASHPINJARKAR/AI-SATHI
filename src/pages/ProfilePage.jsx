import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="page-container profile-page">
      <div className="profile-header">
        <h1>{language === 'mr' ? 'तुमची प्रोफाइल' : 'Your Profile'}</h1>
        <p>{language === 'mr' ? 'तुमची वैयक्तिक माहिती व्यवस्थापित करा' : 'Manage your personal information'}</p>
      </div>

      <div className="profile-content card">
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <img src={user.avatar} alt="Avatar" className="profile-page-avatar" />
            <button className="change-avatar-btn" title="Change Avatar">
              <Camera size={16} />
            </button>
          </div>
          <h3>{user.name}</h3>
          <p className="profile-role badge badge-primary">
            {language === 'mr' ? 'प्रमाणित वापरकर्ता' : 'Verified User'}
          </p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={16} /> {language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</label>
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
            <label><Mail size={16} /> {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}</label>
            <input 
              type="email" 
              name="email"
              className="input" 
              value={formData.email} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label><Phone size={16} /> {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}</label>
            <input 
              type="tel" 
              name="phone"
              className="input" 
              value={formData.phone} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {language === 'mr' ? 'जतन करा' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(true)}>
                {language === 'mr' ? 'प्रोफाइल संपादित करा' : 'Edit Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
