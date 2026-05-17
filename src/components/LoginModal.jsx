import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { X, Mail, Phone, Smartphone, Globe } from 'lucide-react';
import './LoginModal.css';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { language } = useLanguage();
  
  const [authMethod, setAuthMethod] = useState('mobile'); // 'mobile', 'email'
  const [step, setStep] = useState(1); // 1: input, 2: OTP
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier) return;
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) return;
    // Simulate successful verification
    login({
      name: name || (authMethod === 'mobile' ? 'Mobile User' : 'Email User'),
      [authMethod === 'mobile' ? 'phone' : 'email']: identifier
    });
    resetState();
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const loginEmail = authMethod === 'email' && identifier ? identifier : 'user@gmail.com';
    const loginName = name || 'Google User';
    
    login({
      name: loginName,
      email: loginEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginName.replace(/\s+/g, '')}`
    });
    resetState();
  };

  const resetState = () => {
    setAuthMethod('mobile');
    setStep(1);
    setIdentifier('');
    setOtp('');
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
                className={`auth-tab ${authMethod === 'mobile' ? 'active' : ''}`}
                onClick={() => setAuthMethod('mobile')}
              >
                <Smartphone size={18} />
                {language === 'mr' ? 'मोबाईल' : 'Mobile'}
              </button>
              <button 
                className={`auth-tab ${authMethod === 'email' ? 'active' : ''}`}
                onClick={() => setAuthMethod('email')}
              >
                <Mail size={18} />
                {language === 'mr' ? 'ईमेल' : 'Email'}
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSendOtp}>
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
                {language === 'mr' ? 'OTP पाठवा' : 'Send OTP'}
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
                {authMethod === 'mobile' ? <Smartphone size={32} /> : <Mail size={32} />}
              </div>
              <h3>{language === 'mr' ? 'OTP प्रविष्ट करा' : 'Enter OTP'}</h3>
              <p className="otp-desc">
                {language === 'mr' 
                  ? `${identifier} वर पाठवलेला कोड प्रविष्ट करा` 
                  : `Enter the code sent to ${identifier}`}
              </p>

              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <input 
                    type="text" 
                    className="input otp-input" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-accent btn-lg full-width">
                  {language === 'mr' ? 'सत्यापित करा' : 'Verify & Login'}
                </button>
                <button type="button" className="btn btn-ghost full-width mt-2" onClick={() => setStep(1)}>
                  {language === 'mr' ? 'मागे जा' : 'Back'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
