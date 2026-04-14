# Quick Fix: Contact Messages Permission Error

## The Problem
You're getting: `FirebaseError: Missing or insufficient permissions` when submitting the contact form.

## The Solution

The rules in `firestore.rules` are correct, but they need to be **published in Firebase Console**.

### Step-by-Step Fix:

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/project/picchio-9020c/firestore/rules

2. **Copy these rules** (from your `firestore.rules` file):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.customerId) || 
        isAdmin()
      );
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && (
        isOwner(resource.data.customerId) || 
        isAdmin()
      );
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (
        isOwner(userId) || 
        isAdmin()
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        (isOwner(userId) && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'phone', 'updatedAt'])) ||
        isAdmin()
      );
      allow delete: if isAdmin();
    }
    
    // Contact Messages collection - IMPORTANT!
    match /contactMessages/{messageId} {
      allow create: if true; // Public can submit contact forms
      allow read, update, delete: if isAdmin();
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Paste in Firebase Console** and click **"Publish"**

4. **Wait 10-30 seconds** for rules to deploy

5. **Test the contact form** - it should work now!

## Why This Happens

Firestore rules are **NOT automatically synced** from your local file. You must manually publish them in Firebase Console.

## Alternative: Use Firebase CLI

If you have Firebase CLI installed:

```bash
cd /f/Pichio-website/dar-home
firebase deploy --only firestore:rules
```

But you need to be logged in first:
```bash
firebase login
```
