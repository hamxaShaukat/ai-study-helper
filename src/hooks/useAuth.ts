// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { auth } from '../lib/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalTriggered, setModalTriggered] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        
        // Auto-show modal for new users after 5 seconds
        if (!user && !modalTriggered) {
          const timer = setTimeout(() => {
            setShowAuthModal(true);
            setModalTriggered(true);
          }, 5000); // 5 seconds
          
          return () => clearTimeout(timer);
        }
      });
  
      return () => unsubscribe();
    }, [modalTriggered]);
  
    const signIn = async (email: string, password: string) => {
      try {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
        return result;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const signUp = async (email: string, password: string) => {
      try {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
        return result;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const signInWithGoogle = async () => {
      try {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setShowAuthModal(false);
        return result;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const logout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        throw error;
      }
    };
  
    const openAuthModal = () => {
      setShowAuthModal(true);
      setModalTriggered(true);
    };
  
    const closeAuthModal = () => setShowAuthModal(false);
  
    return {
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
  };