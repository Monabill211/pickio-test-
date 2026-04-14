# Quick Guide: Create Super Admin in Firebase Console

## You already have a user: `ahmedfahmy@gmail.com`

I can see you have a user in Firebase Authentication. You have **2 options**:

## Option 1: Use Existing User (Quickest)

1. **Update the existing user to admin role in Firestore:**
   - Go to [Firestore Database](https://console.firebase.google.com/project/picchio-9020c/firestore)
   - Navigate to `users` collection
   - Find the document with UID: `JVlwy83RVNWwitu6OUT9hM...` (from your screenshot)
   - If document doesn't exist, create it:
     - Click **Add document**
     - **Document ID**: `JVlwy83RVNWwitu6OUT9hM...` (the UID from Authentication)
     - Add these fields:
       ```
       name: "Super Admin" (string)
       email: "ahmedfahmy@gmail.com" (string)
       phone: "" (string)
       role: "admin" (string)
       status: "active" (string)
       orders: 0 (number)
       joinDate: [Current timestamp]
       createdAt: [Current timestamp]
       updatedAt: [Current timestamp]
       ```
   - If document exists, update the `role` field to `"admin"`

2. **Login with existing credentials:**
   - Email: `ahmedfahmy@gmail.com`
   - Password: (the password you set when creating this user)
   - Go to: `http://localhost:8080/admin/login`

## Option 2: Create New User `fahmyuiux@gmail.com`

1. **Create user in Firebase Authentication:**
   - Go to [Authentication Users](https://console.firebase.google.com/project/picchio-9020c/authentication/users)
   - Click **Add user**
   - Email: `fahmyuiux@gmail.com`
   - Password: `Admin@123456`
   - Click **Add user**
   - **Copy the User UID** (click on the user to see it)

2. **Create user document in Firestore:**
   - Go to [Firestore Database](https://console.firebase.google.com/project/picchio-9020c/firestore)
   - Navigate to `users` collection
   - Click **Add document**
   - **Document ID**: Paste the UID you copied
   - Add these fields:
     ```
     name: "Super Admin" (string)
     email: "fahmyuiux@gmail.com" (string)
     phone: "" (string)
     role: "admin" (string)
     status: "active" (string)
     orders: 0 (number)
     joinDate: [Current timestamp]
     createdAt: [Current timestamp]
     updatedAt: [Current timestamp]
     ```
   - Click **Save**

3. **Login:**
   - Email: `fahmyuiux@gmail.com`
   - Password: `Admin@123456`
   - Go to: `http://localhost:8080/admin/login`

## Troubleshooting the 400 Error

The 400 Bad Request error usually means:
- **Wrong password**: Make sure you're using the correct password
- **User doesn't exist**: Create the user first in Firebase Console
- **Email/Password not enabled**: Make sure it's enabled in Authentication → Sign-in method

## Quick Fix: Update Existing User to Admin

If you want to quickly make `ahmedfahmy@gmail.com` an admin:

1. Open browser console on your app
2. Run this (replace with actual password):
```javascript
// First, you need to know the password for ahmedfahmy@gmail.com
// Then run this in console after the app loads:

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

const auth = getAuth();
const email = 'ahmedfahmy@gmail.com';
const password = 'YOUR_PASSWORD_HERE'; // Replace with actual password

signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      await updateDoc(userDocRef, { role: 'admin' });
    } else {
      await setDoc(userDocRef, {
        name: 'Super Admin',
        email: email,
        phone: '',
        role: 'admin',
        status: 'active',
        orders: 0,
        joinDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    console.log('✅ User updated to admin!');
  })
  .catch(console.error);
```
