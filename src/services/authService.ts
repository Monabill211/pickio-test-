import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Convert Firebase User to AuthUser
export const convertFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<AuthUser> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(user, { displayName });

    // Send email verification
    try {
      await sendEmailVerification(user);
    } catch (error) {
      
    }

    // Create user document in Firestore with Firebase Auth UID
    try {
      // Use setDoc to use Firebase Auth UID as document ID
      const userDocRef = doc(db, 'users', user.uid);
      
      await setDoc(userDocRef, {
        name: displayName,
        email: email,
        phone: phone || '',
        role: 'customer',
        status: 'active',
        orders: 0,
        joinDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      
      // Don't throw - user is created in Auth, just document creation failed
    }

    return convertFirebaseUser(user);
  } catch (error: any) {
    
    
    // Provide user-friendly error messages
    let errorMessage = 'Registration failed';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already registered';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user document in Firestore if exists, or create if doesn't
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist (for users created before Firestore integration)
        await setDoc(userDocRef, {
          name: user.displayName || email.split('@')[0],
          email: email,
          phone: '',
          role: 'customer',
          status: 'active',
          orders: 0,
          joinDate: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      
      // Don't throw - login is successful, just document update failed
    }

    return convertFirebaseUser(user);
  } catch (error: any) {
    
    
    // Provide user-friendly error messages
    let errorMessage = 'Login failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    
    throw new Error('Failed to logout');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    
    
    let errorMessage = 'Failed to send password reset email';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(convertFirebaseUser(user));
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  return user ? convertFirebaseUser(user) : null;
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Update or create user document in Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document for new Google users
        await setDoc(userDocRef, {
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: '',
          role: 'customer',
          status: 'active',
          orders: 0,
          joinDate: Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      } else {
        // Update existing user document
        await setDoc(userDocRef, {
          name: user.displayName || userDoc.data()?.name || user.email?.split('@')[0] || 'User',
          email: user.email || userDoc.data()?.email || '',
          updatedAt: Timestamp.now(),
        }, { merge: true });
      }
    } catch (error) {
      // Don't throw - login is successful, just document update failed
    }

    return convertFirebaseUser(user);
  } catch (error: any) {
    let errorMessage = 'Google sign-in failed';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
    } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
      errorMessage = 'Sign-in is not available in this environment. Please use a different browser or method.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};
