import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, onAuthStateChange, getCurrentUser } from '@/services/authService';

interface UserAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user immediately
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
