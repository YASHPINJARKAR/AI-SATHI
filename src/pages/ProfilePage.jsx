import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { User, Mail, Phone, Camera, Save, MapPin, Briefcase, Calendar, Users } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
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
        <h1>{language === 'mr' ? 'तुमची प्रोफाइल' : 'Your Profile'}</h1>
        <p>{language === 'mr' ? 'तुमची वैयक्तिक माहिती व्यवस्थापित करा' : 'Manage your personal information'}</p>
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
              disabled={true} // Email usually shouldn't be edited easily
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

          <div className="form-group">
            <label><Calendar size={16} /> {language === 'mr' ? 'वय' : 'Age'}</label>
            <input 
              type="number" 
              name="age"
              className="input" 
              value={formData.age} 
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={language === 'mr' ? 'तुमचे वय प्रविष्ट करा' : 'Enter your age'}
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label><Users size={16} /> {language === 'mr' ? 'लिंग' : 'Gender'}</label>
            <select 
              name="gender" 
              className="input" 
              value={formData.gender} 
              onChange={handleChange} 
              disabled={!isEditing}
            >
              <option value="">{language === 'mr' ? 'निवडा...' : 'Select...'}</option>
              <option value="Male">{language === 'mr' ? 'पुरुष' : 'Male'}</option>
              <option value="Female">{language === 'mr' ? 'महिला' : 'Female'}</option>
              <option value="Other">{language === 'mr' ? 'इतर' : 'Other'}</option>
            </select>
          </div>

          <div className="form-group">
            <label><MapPin size={16} /> {language === 'mr' ? 'पत्ता / स्थान' : 'Address / Location'}</label>
            <input 
              type="text" 
              name="location"
              className="input" 
              value={formData.location} 
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={language === 'mr' ? 'उदा. अमरावती, महाराष्ट्र' : 'e.g. Amravati, Maharashtra'}
            />
          </div>

          <div className="form-group">
            <label><Briefcase size={16} /> {language === 'mr' ? 'व्यवसाय' : 'Profession'}</label>
            <select 
              name="profession" 
              className="input" 
              value={formData.profession} 
              onChange={handleChange} 
              disabled={!isEditing}
            >
              <option value="">{language === 'mr' ? 'निवडा...' : 'Select...'}</option>
              <option value="Student">{language === 'mr' ? 'विद्यार्थी' : 'Student'}</option>
              <option value="Professional">{language === 'mr' ? 'नोकरी करणारा' : 'Professional'}</option>
              <option value="Business Owner">{language === 'mr' ? 'व्यावसायिक' : 'Business Owner'}</option>
              <option value="Farmer">{language === 'mr' ? 'शेतकरी' : 'Farmer'}</option>
              <option value="Other">{language === 'mr' ? 'इतर' : 'Other'}</option>
            </select>
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
