/**
 * Standalone script to create super admin user
 * This can be run directly in browser console or imported
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIBaUUH-Jq5ymhpdtyds30fiX7zm2TFRg",
  authDomain: "picchio-9020c.firebaseapp.com",
  projectId: "picchio-9020c",
  storageBucket: "picchio-9020c.firebasestorage.app",
  messagingSenderId: "167835346816",
  appId: "1:167835346816:web:52388f6c7c924582980365",
  measurementId: "G-45BYZLEF7S",
};

/**
 * Create super admin user
 * Run this in browser console after enabling Email/Password in Firebase Console
 */
export const createSuperAdminStandalone = async (
  email: string = 'fahmyuiux@gmail.com',
  password: string = 'Admin@123456',
  name: string = 'Super Admin'
) => {
  try {
    console.log('🚀 Starting super admin creation...');
    console.log('📧 Email:', email);
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    let user;
    let userUid: string;
    
    try {
      // Try to create new user
      console.log('📝 Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      userUid = user.uid;
      console.log('✅ User created in Firebase Auth. UID:', userUid);
      
      // Update display name
      await updateProfile(user, { displayName: name });
      console.log('✅ Display name updated');
      
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('⚠️ User already exists in Firebase Auth. Signing in...');
        
        // Sign in to get the existing user
        const signInCredential = await signInWithEmailAndPassword(auth, email, password);
        user = signInCredential.user;
        userUid = user.uid;
        console.log('✅ Signed in to existing user. UID:', userUid);
      } else if (authError.code === 'auth/configuration-not-found') {
        throw new Error(
          '❌ Email/Password authentication is not enabled in Firebase Console!\n\n' +
          'Please enable it first:\n' +
          '1. Go to https://console.firebase.google.com/project/picchio-9020c/authentication/providers\n' +
          '2. Click on "Email/Password"\n' +
          '3. Enable it and click Save'
        );
      } else {
        throw authError;
      }
    }
    
    // Create or update user document in Firestore
    const userDocRef = doc(db, 'users', userUid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      console.log('📝 User document exists. Updating role to admin...');
      await updateDoc(userDocRef, {
        role: 'admin',
        updatedAt: Timestamp.now(),
      });
      console.log('✅ User document updated with admin role');
    } else {
      console.log('📝 Creating user document in Firestore...');
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
      console.log('✅ User document created with admin role');
    }
    
    // Sign out
    await signOut(auth);
    console.log('✅ Signed out');
    
    console.log('\n🎉 Super admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 UID:', userUid);
    console.log('\n✅ You can now login at /admin/login');
    
    return {
      success: true,
      uid: userUid,
      email,
      message: 'Super admin created successfully!'
    };
    
  } catch (error: any) {
    console.error('❌ Error creating super admin:', error);
    
    if (error.code === 'auth/configuration-not-found') {
      console.error('\n⚠️ IMPORTANT: Email/Password authentication is not enabled!\n');
      console.error('Please enable it in Firebase Console:');
      console.error('https://console.firebase.google.com/project/picchio-9020c/authentication/providers');
    }
    
    throw error;
  }
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).createSuperAdminStandalone = createSuperAdminStandalone;
  console.log('💡 Super admin creator available!');
  console.log('📝 Run: window.createSuperAdminStandalone()');
}
