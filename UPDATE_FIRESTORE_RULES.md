# How to Update Firestore Security Rules

You're getting a "Missing or insufficient permissions" error because Firestore security rules are blocking writes. Here's how to fix it:

## Option 1: Update Rules via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **picchio-9020c**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories collection - allow read for everyone, write for everyone (for development)
    // TODO: Change to require authentication in production
    match /categories/{document=**} {
      allow read, write: if true;
    }
    
    // Products collection - allow read for everyone, write for everyone (for development)
    // TODO: Change to require authentication in production
    match /products/{document=**} {
      allow read, write: if true;
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **Publish**

## Option 2: Deploy Rules via Firebase CLI

If you're logged in to Firebase CLI:

```bash
cd /f/Pichio-website/dar-home
eval "$(fnm env --use-on-cd)"
fnm use 20
firebase deploy --only firestore:rules
```

## Option 3: Start in Test Mode (If Not Already Done)

If you haven't set up Firestore yet:

1. Go to Firebase Console → Firestore Database
2. Click **Create database**
3. Choose **Start in test mode** (allows all reads/writes for 30 days)
4. Select a location
5. Click **Enable**

## Security Notes

⚠️ **Important**: The rules above allow **anyone** to read and write to your database. This is fine for development but **NOT for production**.

### For Production, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories - public read, authenticated write
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Products - public read, authenticated write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

This requires:
1. Firebase Authentication setup
2. Custom claims for admin users
3. Proper authentication in your app

## Verify Rules Are Updated

After updating rules:
1. Wait a few seconds for rules to propagate
2. Try adding a category again
3. It should work now!
