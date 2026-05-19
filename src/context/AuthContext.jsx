import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { isSignInWithEmailLink, signInWithEmailLink, getRedirectResult } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    // 1. Check for Mobile Google Login Redirect Result
    getRedirectResult(auth).then((result) => {
      if (result) {
        const firebaseUser = result.user;
        login({
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(firebaseUser.displayName || 'User').replace(/\\s+/g, '')}`
        });
      }
    }).catch((error) => {
      console.error("Redirect Login Error:", error);
    });

    // 2. Check if coming from a Firebase Email Link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            const firebaseUser = result.user;
            login({
              name: firebaseUser.displayName || 'Email User',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=EmailUser`
            });
            window.history.replaceState(null, '', window.location.pathname);
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error.message);
          });
      }
    } else {
      // 3. Load session from local storage
      const storedUser = localStorage.getItem('ai_sathi_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = (userData) => {
    // Save to local storage
    const userToSave = {
      id: Date.now().toString(),
      name: userData.name || 'User',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'User'}`,
      ...userData
    };
    setUser(userToSave);
    localStorage.setItem('ai_sathi_user', JSON.stringify(userToSave));
    setIsLoginModalOpen(false);
    
    // Execute any pending action that was interrupted by auth
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_sathi_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('ai_sathi_user', JSON.stringify(updatedUser));
  };

  const requireAuth = (actionCallback) => {
    if (user) {
      actionCallback();
    } else {
      setPendingAction(() => actionCallback);
      setIsLoginModalOpen(true);
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => {
      setIsLoginModalOpen(false);
      setPendingAction(null);
    },
    requireAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
