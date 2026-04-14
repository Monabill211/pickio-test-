import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is already logged in on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user document from Firestore to check role
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Only allow admin users to access admin panel
            if (userData.role === 'admin' || userData.role === 'superadmin') {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                role: userData.role === 'superadmin' ? 'superadmin' : 'admin',
                createdAt: userData.createdAt?.toDate() || new Date(),
              });
            } else {
              // Not an admin, sign them out
              await signOut(auth);
              setUser(null);
            }
          } else {
            // User document doesn't exist, sign them out
            await signOut(auth);
            setUser(null);
          }
        } catch (error) {
          
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user document from Firestore to check role
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error('User not found in system');
      }

      const userData = userDoc.data();

      // Only allow admin users to access admin panel
      if (userData.role !== 'admin' && userData.role !== 'superadmin') {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }

      // Set admin user
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        role: userData.role === 'superadmin' ? 'superadmin' : 'admin',
        createdAt: userData.createdAt?.toDate() || new Date(),
      });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      // Provide user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please create the user in Firebase Console first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/configuration-not-found') {
        throw new Error('Email/Password authentication is not enabled. Please enable it in Firebase Console.');
      }
      
      // Log the full error for debugging
      
      throw new Error(errorMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};