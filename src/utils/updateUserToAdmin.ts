/**
 * Utility to update an existing Firebase Auth user to admin role in Firestore
 * Use this if you already have a user in Firebase Authentication
 */

import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Update an existing user to admin role
 * @param email - User's email address
 * @param password - User's password
 * @param name - Display name (optional, defaults to email)
 */
export const updateUserToAdmin = async (
  email: string,
  password: string,
  name?: string
): Promise<void> => {
  try {
    console.log('🔄 Updating user to admin role...');
    console.log('📧 Email:', email);
    
    const auth = getAuth();
    
    // Sign in with the user's credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Signed in successfully. UID:', user.uid);
    
    // Get or create user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    const displayName = name || user.displayName || email.split('@')[0];
    
    if (userDoc.exists()) {
      // Update existing document
      console.log('📝 Updating existing user document...');
      await updateDoc(userDocRef, {
        role: 'admin',
        updatedAt: Timestamp.now(),
      });
      console.log('✅ User document updated with admin role');
    } else {
      // Create new document
      console.log('📝 Creating user document...');
      await setDoc(userDocRef, {
        name: displayName,
        email: email,
        phone: '',
        role: 'admin',
        status: 'active',
        orders: 0,
        joinDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ User document created with admin role');
    }
    
    // Sign out
    await signOut(auth);
    console.log('✅ Signed out');
    
    console.log('\n🎉 User updated to admin successfully!');
    console.log('📧 Email:', email);
    console.log('🆔 UID:', user.uid);
    console.log('\n✅ You can now login at /admin/login');
    
  } catch (error: any) {
    console.error('❌ Error updating user to admin:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found. Please create the user in Firebase Console first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
    throw error;
  }
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).updateUserToAdmin = updateUserToAdmin;
  console.log('💡 User to admin updater available!');
  console.log('📝 Run: window.updateUserToAdmin("email@example.com", "password")');
}
