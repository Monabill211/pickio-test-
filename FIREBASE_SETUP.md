# Firebase Setup Guide

This project uses Firebase Firestore to store and manage categories dynamically.

## Prerequisites

1. A Firebase account (sign up at https://firebase.google.com/)
2. A Firebase project created

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or set up security rules for production
4. Select a location for your database

### 3. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app and copy the configuration values

### 4. Set Up Environment Variables

1. Copy `.env.example` to `.env` in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 5. Create Firestore Collections

Your Firestore database needs a `categories` collection. Each category document should have this structure:

```json
{
  "name": {
    "ar": "الأرائك",
    "en": "Sofas"
  },
  "icon": "sofa",
  "image": "https://example.com/image.jpg",
  "productCount": 24,
  "order": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 6. Add Sample Data (Optional)

You can add categories manually through the Firebase Console or use the admin panel if you've set it up.

Example categories to add:
- Sofas (الأرائك)
- Bedrooms (غرف النوم)
- Dining (غرف السفرة)
- Tables (الطاولات)
- Chairs (الكراسي)

### 7. Set Up Security Rules (Important for Production)

For development, you can use test mode. For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to categories for everyone
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## Features

- ✅ Real-time category updates
- ✅ Automatic data fetching with React Query
- ✅ Loading and error states
- ✅ Type-safe with TypeScript
- ✅ Optimistic updates

## Troubleshooting

### Categories not loading?

1. Check that your `.env` file has correct Firebase credentials
2. Verify Firestore is enabled in your Firebase project
3. Check browser console for errors
4. Ensure the `categories` collection exists in Firestore

### Real-time updates not working?

1. Check Firestore security rules allow read access
2. Verify your Firebase configuration is correct
3. Check browser console for connection errors

## Next Steps

- Set up Firebase Storage for category images
- Add authentication for admin features
- Set up proper security rules for production
