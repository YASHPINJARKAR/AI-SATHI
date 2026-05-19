import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { X, Mail, Lock, User, Globe } from 'lucide-react';
import './LoginModal.css';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { language } = useLanguage();
  
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      if (authMode === 'register') {
        // Register New User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile with their name
        await updateProfile(user, { displayName: name });
        
        // Send Verification Email
        await sendEmailVerification(user);
        
        // Sign them out immediately so they have to verify first
        await signOut(auth);
        
        setSuccessMsg(language === 'mr' ? 'नोंदणी यशस्वी! कृपया तुमचा ईमेल तपासा आणि सत्यापित करा.' : 'Registration successful! Please check your email to verify your account.');
        setAuthMode('login');
        setPassword('');
        
      } else {
        // Login Existing User
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          await signOut(auth);
          setError(language === 'mr' ? 'कृपया प्रथम तुमचा ईमेल सत्यापित करा.' : 'Please verify your email address first. Check your inbox.');
          return;
        }
        
        login({
          name: user.displayName || 'User',
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user.displayName || 'User').replace(/\\s+/g, '')}`
        });
        resetState();
      }
    } catch (err) {
      console.error("Auth Error:", err.message);
      // Simplify error messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError(language === 'mr' ? 'चुकीचा ईमेल किंवा पासवर्ड' : 'Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError(language === 'mr' ? 'हा ईमेल आधीच नोंदणीकृत आहे' : 'This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError(language === 'mr' ? 'पासवर्ड किमान ६ अक्षरांचा असावा' : 'Password should be at least 6 characters');
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessMsg('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      login({
        name: user.displayName || 'Google User',
        email: user.email,
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user.displayName || 'User').replace(/\\s+/g, '')}`
      });
      resetState();
    } catch (err) {
      console.error("Google Login Error:", err.message);
      setError(language === 'mr' ? 'Google लॉगिन अयशस्वी' : 'Google Login Failed');
    }
  };

  const resetState = () => {
    setAuthMode('login');
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setSuccessMsg('');
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
          <h2>{authMode === 'login' 
            ? (language === 'mr' ? 'लॉगिन करा' : 'Login') 
            : (language === 'mr' ? 'नवीन खाते तयार करा' : 'Create an Account')}</h2>
          <p>{language === 'mr' ? 'सुरू ठेवण्यासाठी कृपया लॉगिन करा' : 'Please authenticate to continue'}</p>
        </div>

        <div className="modal-body">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
            >
              <Lock size={18} />
              {language === 'mr' ? 'लॉगिन' : 'Login'}
            </button>
            <button 
              className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
            >
              <User size={18} />
              {language === 'mr' ? 'नोंदणी करा' : 'Register'}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error" style={{color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
            
            {successMsg ? (
              <div className="auth-success-screen" style={{textAlign: 'center', padding: '20px 0'}}>
                <div style={{color: 'green', fontSize: '16px', marginBottom: '20px'}}>{successMsg}</div>
                <button type="button" className="btn btn-outline full-width" onClick={() => {setSuccessMsg(''); setAuthMode('login');}}>
                  {language === 'mr' ? 'लॉगिन वर परत जा' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <>
                {authMode === 'register' && (
                  <div className="form-group">
                    <label>{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="input" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={language === 'mr' ? 'तुमचे नाव प्रविष्ट करा' : 'Enter your full name'}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>{language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}</label>
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{language === 'mr' ? 'पासवर्ड' : 'Password'}</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="input" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder={language === 'mr' ? 'पासवर्ड प्रविष्ट करा' : 'Enter your password'}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg full-width">
                  {authMode === 'login' 
                    ? (language === 'mr' ? 'लॉगिन करा' : 'Login') 
                    : (language === 'mr' ? 'नोंदणी करा' : 'Register')}
                </button>
              </>
            )}
          </form>

          <div className="auth-divider">
            <span>{language === 'mr' ? 'किंवा' : 'OR'}</span>
          </div>

          <button className="btn btn-outline btn-lg full-width google-btn" onClick={handleGoogleLogin}>
            <Globe size={20} className="google-icon" />
            {language === 'mr' ? 'Google द्वारे सुरू ठेवा' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
