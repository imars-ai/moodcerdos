'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, isConfigValid } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth || !isConfigValid) {
      setError('Firebase no está configurado. Revisa las variables de entorno.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Error signing in:", err);
      setError('Error al iniciar sesión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError('Error al cerrar sesión: ' + err.message);
    }
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    isFirebaseConfigured: !!isConfigValid,
  };
}
