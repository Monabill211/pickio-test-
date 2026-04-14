# Firestore Setup Guide - Manual Method

Since Firebase CLI requires Node.js 20+, you can set up Firestore directly through the Firebase Console.

## Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **picchio-9020c**
3. Click **Firestore Database** in the left sidebar
4. Click **Create database**
5. Choose **Start in test mode** (for development)
6. Select a location (e.g., `us-central1` or closest to your users)
7. Click **Enable**

## Step 2: Create Categories Collection

1. Once Firestore is enabled, click **Start collection**
2. Collection ID: `categories`
3. Click **Next**

## Step 3: Add Your First Category Document

### Document 1: Sofas
- **Document ID**: `sofas` (or leave auto-generated)
- **Fields**:
  - `name` (Type: **map**)
    - `ar`: `الأرائك` (Type: string)
    - `en`: `Sofas` (Type: string)
  - `icon`: `sofa` (Type: string)
  - `image`: `https://your-image-url.jpg` (Type: string) - Use your actual image URL
  - `productCount`: `24` (Type: number)
  - `order`: `1` (Type: number)
  - `createdAt`: Click timestamp icon → Select current time
  - `updatedAt`: Click timestamp icon → Select current time

Click **Save**

### Document 2: Bedrooms
- **Document ID**: `beds`
- **Fields**:
  - `name` (map): `ar` = `غرف النوم`, `en` = `Bedrooms`
  - `icon`: `bed`
  - `image`: `https://your-image-url.jpg`
  - `productCount`: `18`
  - `order`: `2`
  - `createdAt`: (timestamp)
  - `updatedAt`: (timestamp)

### Document 3: Dining
- **Document ID**: `dining`
- **Fields**:
  - `name` (map): `ar` = `غرف السفرة`, `en` = `Dining`
  - `icon`: `utensils`
  - `image`: `https://your-image-url.jpg`
  - `productCount`: `15`
  - `order`: `3`
  - `createdAt`: (timestamp)
  - `updatedAt`: (timestamp)

### Document 4: Tables
- **Document ID**: `tables`
- **Fields**:
  - `name` (map): `ar` = `الطاولات`, `en` = `Tables`
  - `icon`: `square`
  - `image`: `https://your-image-url.jpg`
  - `productCount`: `32`
  - `order`: `4`
  - `createdAt`: (timestamp)
  - `updatedAt`: (timestamp)

### Document 5: Chairs
- **Document ID**: `chairs`
- **Fields**:
  - `name` (map): `ar` = `الكراسي`, `en` = `Chairs`
  - `icon`: `armchair`
  - `image`: `https://your-image-url.jpg`
  - `productCount`: `28`
  - `order`: `5`
  - `createdAt`: (timestamp)
  - `updatedAt`: (timestamp)

## Step 4: Test Your Setup

1. Go back to your app
2. Visit `/categories` page
3. Categories should load from Firestore!

## Tips

- **Image URLs**: You can use Firebase Storage to upload images, or use external URLs
- **Product Count**: This will be updated automatically when you add products later
- **Order**: Used to sort categories (lower numbers appear first)

## Security Rules (Important for Production)

For now, test mode allows all reads/writes. For production, update security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{document=**} {
      allow read: if true;  // Everyone can read
      allow write: if request.auth != null;  // Only authenticated users
    }
  }
}
```

To update rules:
1. Go to Firestore Database
2. Click **Rules** tab
3. Update the rules
4. Click **Publish**
