import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAIBaUUH-Jq5ymhpdtyds30fiX7zm2TFRg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "picchio-9020c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "picchio-9020c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "picchio-9020c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "167835346816",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:167835346816:web:52388f6c7c924582980365",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-45BYZLEF7S",
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;
let analytics: Analytics | null = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  
  // Initialize Analytics only in browser environment and if supported
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  
  // Initialize Analytics if not already initialized
  if (typeof window !== 'undefined' && !analytics) {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
}

export { app, db, storage, auth, analytics };
export default app;
