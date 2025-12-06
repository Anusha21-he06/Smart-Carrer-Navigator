import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Check for demo user
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Firebase Login Failed (Expected if no valid config)", error);
      alert("Firebase Config missing or invalid. Using Demo Mode.");
      demoLogin();
    }
  };

  const demoLogin = () => {
    const mockUser: any = {
      uid: 'demo-123',
      displayName: 'Alex Demo',
      email: 'alex@example.com',
      photoURL: 'https://picsum.photos/100/100'
    };
    localStorage.setItem('demo_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore firebase errors on mock
    }
    localStorage.removeItem('demo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, demoLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};