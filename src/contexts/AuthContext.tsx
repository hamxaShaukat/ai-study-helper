// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect} from 'react';
import type{ReactNode} from 'react'; 
import type{User} from 'firebase/auth';
import {
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showAuthModal: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [autoModalShown, setAutoModalShown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Auto-show modal for new users after 5 seconds
      if (!user && !autoModalShown) {
        console.log('Setting up auto-modal timer...');
        const timer = setTimeout(() => {
          console.log('Auto-modal timer triggered - showing modal');
          setShowAuthModal(true);
          setAutoModalShown(true);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, [autoModalShown]);

  // Alternative approach: Show modal after initial load
  useEffect(() => {
    if (!loading && !user && !autoModalShown) {
      console.log('App loaded, setting auto-modal...');
      const timer = setTimeout(() => {
        console.log('Showing auto-modal after delay');
        setShowAuthModal(true);
        setAutoModalShown(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, autoModalShown]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setShowAuthModal(false);
    return result;
  };

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setShowAuthModal(false);
    return result;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setShowAuthModal(false);
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setAutoModalShown(false); // Reset so modal can show again if they log out
  };

  const openAuthModal = () => {
    console.log('Opening auth modal from context');
    setShowAuthModal(true);
    setAutoModalShown(true); // Mark as shown so auto-modal doesn't trigger again
  };

  const closeAuthModal = () => {
    console.log('Closing auth modal from context');
    setShowAuthModal(false);
    setAutoModalShown(true); // Mark as shown so auto-modal doesn't trigger again
  };

  const value = {
    user,
    loading,
    showAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};