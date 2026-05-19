import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { X, Mail, Smartphone, Globe } from 'lucide-react';
import './LoginModal.css';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, sendSignInLinkToEmail } from 'firebase/auth';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { language } = useLanguage();
  
  const [authMethod, setAuthMethod] = useState('email'); // default to email since it's easier to set up first
  const [step, setStep] = useState(1); // 1: input, 2: OTP/Link sent
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!identifier) return;
    
    // Firebase Magic Link Setup
    if (authMethod === 'email') {
      try {
        const actionCodeSettings = {
          // Redirect back to the current origin
          url: window.location.origin + '/dashboard', 
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, identifier, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', identifier);
        setStep(2);
      } catch (error) {
        console.error("Email Link Error:", error.message);
        alert(language === 'mr' ? 'ईमेल पाठवताना त्रुटी आली: ' + error.message : 'Error sending email: ' + error.message);
      }
    } else {
      // Note: Mobile OTP via Firebase requires Recaptcha setup.
      // For now, we will simulate it or prompt the user to use Email/Google.
      alert('Mobile OTP requires Recaptcha configuration in Firebase. Please use Google Login or Email for now.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      login({
        name: user.displayName || 'Google User',
        email: user.email,
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user.displayName || 'User').replace(/\\s+/g, '')}`
      });
      resetState();
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert(language === 'mr' ? 'Google लॉगिन अयशस्वी: ' + error.message : "Error logging in with Google: " + error.message);
    }
  };

  const resetState = () => {
    setAuthMethod('email');
    setStep(1);
    setIdentifier('');
    setName('');
  };

  const handleClose = () => {
    resetState();
    closeLoginModal();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>{language === 'mr' ? 'लॉगिन किंवा नोंदणी करा' : 'Login or Register'}</h2>
          <p>{language === 'mr' ? 'सुरू ठेवण्यासाठी कृपया लॉगिन करा' : 'Please authenticate to continue'}</p>
        </div>

        {step === 1 ? (
          <div className="modal-body">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMethod === 'email' ? 'active' : ''}`}
                onClick={() => setAuthMethod('email')}
              >
                <Mail size={18} />
                {language === 'mr' ? 'ईमेल' : 'Email'}
              </button>
              <button 
                className={`auth-tab ${authMethod === 'mobile' ? 'active' : ''}`}
                onClick={() => setAuthMethod('mobile')}
              >
                <Smartphone size={18} />
                {language === 'mr' ? 'मोबाईल' : 'Mobile'}
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSendLink}>
              <div className="form-group">
                <label>{language === 'mr' ? 'पूर्ण नाव (पर्यायी)' : 'Full Name (Optional)'}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder={language === 'mr' ? 'नाव प्रविष्ट करा' : 'Enter your name'}
                />
              </div>

              <div className="form-group">
                <label>
                  {authMethod === 'mobile' 
                    ? (language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number')
                    : (language === 'mr' ? 'ईमेल पत्ता' : 'Email Address')}
                </label>
                <div className="input-group">
                  {authMethod === 'mobile' ? (
                    <div className="prefix">+91</div>
                  ) : null}
                  <input 
                    type={authMethod === 'mobile' ? 'tel' : 'email'} 
                    className={`input ${authMethod === 'mobile' ? 'has-prefix' : ''}`}
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder={authMethod === 'mobile' ? '9876543210' : 'name@example.com'}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg full-width">
                {language === 'mr' ? 'लिंक पाठवा' : 'Send Login Link'}
              </button>
            </form>

            <div className="auth-divider">
              <span>{language === 'mr' ? 'किंवा' : 'OR'}</span>
            </div>

            <button className="btn btn-outline btn-lg full-width google-btn" onClick={handleGoogleLogin}>
              <Globe size={20} className="google-icon" />
              {language === 'mr' ? 'Google द्वारे सुरू ठेवा' : 'Continue with Google'}
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="otp-verification">
              <div className="otp-icon">
                <Mail size={32} />
              </div>
              <h3>{language === 'mr' ? 'ईमेल तपासा' : 'Check your Email'}</h3>
              <p className="otp-desc">
                {language === 'mr' 
                  ? `आम्ही ${identifier} वर एक लॉगिन लिंक पाठवली आहे. कृपया तुमच्या इनबॉक्समध्ये जा आणि लिंकवर क्लिक करा.` 
                  : `We sent a login link to ${identifier}. Please check your inbox and click the link to log in.`}
              </p>
              
              <button type="button" className="btn btn-ghost full-width mt-4" onClick={() => setStep(1)}>
                {language === 'mr' ? 'मागे जा' : 'Back'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
