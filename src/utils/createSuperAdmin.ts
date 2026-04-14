import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * Manually create a super admin user
 * Run this function once to create the super admin account
 */
export const createSuperAdmin = async (
  email: string = 'fahmyuiux@gmail.com',
  password: string = 'Admin@123456',
  name: string = 'Super Admin'
): Promise<void> => {
  try {
    console.log('Creating super admin user...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('User created in Firebase Auth:', user.uid);
    
    // Update display name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore with admin role
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      name: name,
      email: email,
      phone: '',
      role: 'admin', // Set as admin
      status: 'active',
      orders: 0,
      joinDate: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    console.log('Super admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('UID:', user.uid);
    
    return Promise.resolve();
  } catch (error: any) {
    console.error('Error creating super admin:', error);
    
    if (error.code === 'auth/configuration-not-found') {
      const errorMessage = 
        '❌ Email/Password authentication is not enabled in Firebase Console!\n\n' +
        'Please enable it first:\n' +
        '1. Go to https://console.firebase.google.com/project/picchio-9020c/authentication/providers\n' +
        '2. Click on "Email/Password"\n' +
        '3. Enable it and click Save\n\n' +
        'Then try again.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists. Checking Firestore...');
      
      // Try to update existing user to admin role
      try {
        const { getAuth } = await import('firebase/auth');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { doc, updateDoc, getDoc } = await import('firebase/firestore');
        
        // Sign in to get the user
        const signInCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const existingUser = signInCredential.user;
        
        // Update user role in Firestore
        const userDocRef = doc(db, 'users', existingUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            role: 'admin',
            updatedAt: Timestamp.now(),
          });
          console.log('Existing user updated to admin role');
        } else {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            name: name,
            email: email,
            phone: '',
            role: 'admin',
            status: 'active',
            orders: 0,
            joinDate: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          console.log('User document created with admin role');
        }
        
        // Sign out after updating
        const { signOut } = await import('firebase/auth');
        await signOut(getAuth());
        
        return Promise.resolve();
      } catch (updateError) {
        console.error('Error updating existing user:', updateError);
        throw new Error('Failed to create or update super admin user');
      }
    }
    
    throw error;
  }
};

// Export a function that can be called from browser console
if (typeof window !== 'undefined') {
  (window as any).createSuperAdmin = createSuperAdmin;
  console.log('Super admin creator available. Call window.createSuperAdmin() in console.');
}
