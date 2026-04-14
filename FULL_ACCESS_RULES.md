# Firestore Rules - Full Access (Development Only)

## ⚠️ WARNING: These rules allow FULL ACCESS to your database!

These rules are **ONLY for development**. They allow anyone to read and write to ANY collection in your Firestore database.

## Rules to Copy/Paste in Firebase Console

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everything for development - NO SECURITY!
    // TODO: Update these rules for production!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **picchio-9020c**
3. Click **Firestore Database** → **Rules** tab
4. Replace ALL existing rules with the code above
5. Click **Publish**
6. Wait 20-30 seconds
7. Refresh your browser

## What This Allows

✅ Read from ANY collection
✅ Write to ANY collection
✅ Delete from ANY collection
✅ Create ANY collection
✅ No authentication required
✅ No restrictions

## Security Warning

🚨 **DO NOT USE IN PRODUCTION!**

These rules have **ZERO security**. Anyone with your Firebase config can:
- Read all your data
- Modify all your data
- Delete all your data
- Create new collections

## For Production

You MUST update these rules before going live:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories - public read, authenticated write
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Products - public read, authenticated write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other collections - require authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Current Status

✅ Updated in local file: `firestore.rules`
⏳ **You still need to publish in Firebase Console!**
