import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Globe } from 'lucide-react';
import './LoginModal.css';
import { sendRegistrationEmail, sendLoginEmail } from '../emailService';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'

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
        
        // Send welcome / registration confirmation email from aisummit31@gmail.com
        await sendRegistrationEmail({ email: user.email, name: name });
        
        // Sign them out immediately so they have to verify first
        await signOut(auth);
        
        setSuccessMsg(
          language === 'mr' 
            ? 'नोंदणी यशस्वी! कृपया तुमचा ईमेल तपासा आणि सत्यापित करा.' 
            : language === 'hi'
            ? 'पंजीकरण सफल! कृपया अपना ईमेल सत्यापित करने के लिए इनबॉक्स जांचें।'
            : 'Registration successful! Please check your email to verify your account.'
        );
        setAuthMode('login');
        setPassword('');
        
      } else {
        // Login Existing User
        if (role === 'admin') {
          if (email === 'aisummit31@gmail.com' && password === 'AiAmravati@31') {
            login({
              name: 'Sarthi Admin',
              email: 'aisummit31@gmail.com',
              role: 'admin',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
            });
            resetState();
            navigate('/profile');
          } else {
            setError(
              language === 'mr' 
                ? 'अवैध ऍडमिन क्रेडेंशियल्स' 
                : language === 'hi'
                ? 'अमान्य एडमिन क्रेडेंशियल्स'
                : 'Invalid Admin Credentials'
            );
          }
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          await signOut(auth);
          setError(
            language === 'mr' 
              ? 'कृपया प्रथम तुमचा ईमेल सत्यापित करा.' 
              : language === 'hi'
              ? 'कृपया पहले अपना ईमेल सत्यापित करें।'
              : 'Please verify your email address first. Check your inbox.'
          );
          return;
        }
        
        // Send login confirmation email from aisummit31@gmail.com
        sendLoginEmail({ email: user.email, name: user.displayName || 'User' });
        
        login({
          name: user.displayName || 'User',
          email: user.email,
          role: 'user',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user.displayName || 'User').replace(/\s+/g, '')}`
        });
        resetState();
      }
    } catch (err) {
      console.error("Auth Error:", err.message);
      // Simplify error messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError(
          language === 'mr' 
            ? 'चुकीचा ईमेल किंवा पासवर्ड' 
            : language === 'hi'
            ? 'गलत ईमेल या पासवर्ड'
            : 'Invalid email or password'
        );
      } else if (err.code === 'auth/email-already-in-use') {
        setError(
          language === 'mr' 
            ? 'हा ईमेल आधीच नोंदणीकृत आहे' 
            : language === 'hi'
            ? 'यह ईमेल पहले से ही पंजीकृत है'
            : 'This email is already registered'
        );
      } else if (err.code === 'auth/weak-password') {
        setError(
          language === 'mr' 
            ? 'पासवर्ड किमान ६ अक्षरांचा असावा' 
            : language === 'hi'
            ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
            : 'Password should be at least 6 characters'
        );
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessMsg('');
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // On mobile, use redirect because popups are often blocked or problematic
        await signInWithRedirect(auth, googleProvider);
        // The page will redirect away. The result will be handled in AuthContext.jsx
      } else {
        // On desktop, use popup
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Send login confirmation email from aisummit31@gmail.com
        sendLoginEmail({ email: user.email, name: user.displayName || 'Google User' });
        
        login({
          name: user.displayName || 'Google User',
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user.displayName || 'User').replace(/\s+/g, '')}`
        });
        resetState();
      }
    } catch (err) {
      console.error("Google Login Error:", err.message);
      setError(
        language === 'mr' 
          ? `Google लॉगिन अयशस्वी: ${err.message}` 
          : language === 'hi'
          ? `Google लॉगिन विफल रहा: ${err.message}`
          : `Google Login Failed: ${err.message}`
      );
    }
  };

  const resetState = () => {
    setAuthMode('login');
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setSuccessMsg('');
    setRole('user');
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
          <h2>
            {authMode === 'login' 
              ? (language === 'mr' ? 'लॉगिन करा' : language === 'hi' ? 'लॉगिन करें' : 'Login') 
              : (language === 'mr' ? 'नवीन खाते तयार करा' : language === 'hi' ? 'नया खाता बनाएं' : 'Create an Account')}
          </h2>
          <p>
            {language === 'mr' ? 'सुरू ठेवण्यासाठी कृपया लॉगिन करा' : language === 'hi' ? 'जारी रखने के लिए कृपया लॉगिन करें' : 'Please authenticate to continue'}
          </p>
        </div>

        <div className="modal-body">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
            >
              <Lock size={18} />
              {language === 'mr' ? 'लॉगिन' : language === 'hi' ? 'लॉगिन' : 'Login'}
            </button>
            <button 
              className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
            >
              <User size={18} />
              {language === 'mr' ? 'नोंदणी करा' : language === 'hi' ? 'पंजीकरण करें' : 'Register'}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error" style={{color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
            
            {successMsg ? (
              <div className="auth-success-screen" style={{textAlign: 'center', padding: '20px 0'}}>
                <div style={{color: 'green', fontSize: '16px', marginBottom: '20px'}}>{successMsg}</div>
                <button type="button" className="btn btn-outline full-width" onClick={() => {setSuccessMsg(''); setAuthMode('login');}}>
                  {language === 'mr' ? 'लॉगिन वर परत जा' : language === 'hi' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}
                </button>
              </div>
            ) : (
              <>
                {authMode === 'register' && (
                  <div className="form-group">
                    <label>{language === 'mr' ? 'पूर्ण नाव' : language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="input" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={language === 'mr' ? 'तुमचे नाव प्रविष्ट करा' : language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                        required
                      />
                    </div>
                  </div>
                )}

                {authMode === 'login' && (
                  <div className="form-group">
                    <label style={{marginBottom: '6px'}}>{language === 'mr' ? 'लॉगिन प्रकार' : language === 'hi' ? 'लॉगिन प्रकार' : 'Login As'}</label>
                    <div className="role-selector-container">
                      <button
                        type="button"
                        className={`role-selector-btn ${role === 'user' ? 'active' : ''}`}
                        onClick={() => { setRole('user'); setError(''); }}
                      >
                        👤 {language === 'mr' ? 'वापरकर्ता' : language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                      </button>
                      <button
                        type="button"
                        className={`role-selector-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                      >
                        🛡️ {language === 'mr' ? 'प्रशासक' : language === 'hi' ? 'प्रशासक' : 'Admin'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>{language === 'mr' ? 'ईमेल पत्ता' : language === 'hi' ? 'ईमेल पता' : 'Email Address'}</label>
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
                  <label>{language === 'mr' ? 'पासवर्ड' : language === 'hi' ? 'पासवर्ड' : 'Password'}</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="input" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder={language === 'mr' ? 'पासवर्ड प्रविष्ट करा' : language === 'hi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg full-width">
                  {authMode === 'login' 
                    ? (language === 'mr' ? 'लॉगिन करा' : language === 'hi' ? 'लॉगिन करें' : 'Login') 
                    : (language === 'mr' ? 'नोंदणी करा' : language === 'hi' ? 'पंजीकरण करें' : 'Register')}
                </button>
              </>
            )}
          </form>

          <div className="auth-divider">
            <span>{language === 'mr' ? 'किंवा' : language === 'hi' ? 'या' : 'OR'}</span>
          </div>

          <button className="btn btn-outline btn-lg full-width google-btn" onClick={handleGoogleLogin}>
            <Globe size={20} className="google-icon" />
            {language === 'mr' ? 'Google द्वारे सुरू ठेवा' : language === 'hi' ? 'Google के साथ जारी रखें' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
