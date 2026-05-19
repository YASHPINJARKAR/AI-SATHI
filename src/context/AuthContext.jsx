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

    // 4. Initialize mock data for Admin profile
    if (!localStorage.getItem('ai_sathi_all_users')) {
      const mockUsers = [
        { id: '1', name: 'Bhakti Kaner', email: 'bhakti@gmail.com', phone: '+91 8329046037', joinedAt: '2026-05-10' },
        { id: '2', name: 'Yash Pinjarkar', email: 'yash@gmail.com', phone: '+91 9405702530', joinedAt: '2026-05-12' },
        { id: '3', name: 'Trisha Bobade', email: 'trisha@gmail.com', phone: '+91 8261936781', joinedAt: '2026-05-15' },
        { id: '4', name: 'Sanket Thakare', email: 'sanket@gmail.com', phone: '+91 7057953073', joinedAt: '2026-05-18' }
      ];
      localStorage.setItem('ai_sathi_all_users', JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem('ai_sathi_event_registrations')) {
      const mockRegistrations = [
        {
          id: 'reg_1',
          userName: 'Bhakti Kaner',
          userEmail: 'bhakti@gmail.com',
          userPhone: '+91 8329046037',
          eventTitle: 'Shivaji Jayanti Festival',
          people: 2,
          notes: 'Coming with family',
          registeredAt: '2026-05-18'
        },
        {
          id: 'reg_2',
          userName: 'Yash Pinjarkar',
          userEmail: 'yash@gmail.com',
          userPhone: '+91 9405702530',
          eventTitle: 'SGBAU Youth Festival',
          people: 1,
          notes: 'Excited to attend!',
          registeredAt: '2026-05-19'
        }
      ];
      localStorage.setItem('ai_sathi_event_registrations', JSON.stringify(mockRegistrations));
    }

    if (!localStorage.getItem('ai_sathi_feedbacks')) {
      const mockFeedbacks = [
        {
          id: 'fb_1',
          userName: 'Bhakti Kaner',
          userEmail: 'bhakti@gmail.com',
          rating: 5,
          view: 'The chatbot gives fantastic answers in Marathi!',
          suggestion: 'Would love to see more scheme updates in directory.',
          submittedAt: '2026-05-18'
        },
        {
          id: 'fb_2',
          userName: 'Yash Pinjarkar',
          userEmail: 'yash@gmail.com',
          rating: 4,
          view: 'Excellent navigation support and user experience.',
          suggestion: 'Adding bus routing would be awesome.',
          submittedAt: '2026-05-19'
        }
      ];
      localStorage.setItem('ai_sathi_feedbacks', JSON.stringify(mockFeedbacks));
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
      role: userData.role || 'user',
      ...userData
    };
    setUser(userToSave);
    localStorage.setItem('ai_sathi_user', JSON.stringify(userToSave));

    // Store in all_users if role is user
    if (userToSave.role === 'user') {
      const allUsers = JSON.parse(localStorage.getItem('ai_sathi_all_users') || '[]');
      if (!allUsers.some(u => u.email === userToSave.email)) {
        allUsers.push({
          id: userToSave.id,
          name: userToSave.name,
          email: userToSave.email,
          phone: userToSave.phone || 'N/A',
          joinedAt: new Date().toLocaleDateString()
        });
        localStorage.setItem('ai_sathi_all_users', JSON.stringify(allUsers));
      }
    }

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
