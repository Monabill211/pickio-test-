# Firebase Configuration & Google Sign-In Setup

## Fixing "auth/unauthorized-domain" Error

The **auth/unauthorized-domain** error occurs when the domain where your app is deployed is not registered in Firebase Console.

### Steps to Fix:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project "picchio-9020c"

2. **Navigate to Authentication Settings**
   - Click on **Authentication** (left sidebar)
   - Click on **Settings** tab
   - Look for "Authorized domains" section

3. **Add Your Domain**
   - Click **Add domain** button
   - Add your Netlify domain (e.g., `your-site.netlify.app`)
   - If developing locally, add: `localhost` and `127.0.0.1`

4. **Google OAuth Configuration**
   - Go to **Sign-in method** tab
   - Find **Google** provider and ensure it's **Enabled**
   - Update OAuth Redirect URIs if needed

### Authorized Domains Configuration:

**For Netlify Deployment:**
```
- your-site.netlify.app
- pickpio.netlify.app
- dar-home.netlify.app
(add the exact domain you're using)
```

**For Local Development:**
```
- localhost
- 127.0.0.1
```

**For Custom Domain:**
```
- yourdomain.com
- www.yourdomain.com
```

## Google OAuth Configuration

### 1. Create OAuth Consent Screen
- Go to Google Cloud Console: https://console.cloud.google.com
- Navigate to "OAuth consent screen"
- Select "External" user type
- Fill in required fields:
  - App name: "Pickio Store"
  - User support email: your-email@gmail.com
  - Developer contact: your-email@gmail.com

### 2. Create OAuth 2.0 Credentials
- Go to "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client ID"
- Select "Web application"
- Add Authorized JavaScript origins:
  ```
  http://localhost
  http://127.0.0.1:5173 (for Vite dev)
  https://pickpio.netlify.app
  https://dar-home.netlify.app
  https://yourdomain.com
  ```
- Add Authorized redirect URIs:
  ```
  http://localhost:5173
  https://pickpio.netlify.app
  https://dar-home.netlify.app
  https://yourdomain.com
  ```

### 3. Update Firebase Configuration

Ensure your `.env` or vercel/netlify environment variables contain:

```env
VITE_FIREBASE_API_KEY=AIzaSyAIBaUUH-Jq5ymhpdtyds30fiX7zm2TFRg
VITE_FIREBASE_AUTH_DOMAIN=picchio-9020c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=picchio-9020c
VITE_FIREBASE_STORAGE_BUCKET=picchio-9020c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=167835346816
VITE_FIREBASE_APP_ID=1:167835346816:web:52388f6c7c924582980365
VITE_FIREBASE_MEASUREMENT_ID=G-45BYZLEF7S
```

## Troubleshooting Firebase Errors

### Error: "auth/unauthorized-domain"
- Solution: Add domain to Firebase Console > Authentication > Settings > Authorized domains

### Error: "auth/invalid-api-key"
- Solution: Check Firebase configuration values in `.env`

### Error: "auth/network-request-failed"
- Solution: Check internet connection or try different browser

### Error: "auth/popup-blocked"
- Solution: Allow popups in browser settings for your domain

## Testing Google Sign-In Locally

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:5173/register`
3. Click "Sign up with Google"
4. Complete OAuth flow

## Production Deployment Checklist

- [ ] Add Netlify domain to Firebase Authorized Domains
- [ ] Deploy environment variables with Firebase keys
- [ ] Enable Google OAuth in Firebase Console
- [ ] Test Google Sign-In on production domain
- [ ] Enable Firestore Database
- [ ] Configure Storage rules
- [ ] Set up Firestore security rules

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| auth/unauthorized-domain | Domain not in whitelist | Add to Firebase Console |
| auth/popup-blocked | Browser blocks popup | Allow popups or use redirect method |
| auth/network-error | Network issues | Check internet connection |
| auth/operation-not-supported | Old browser/environment | Use modern browser or polyfills |

## Using redirect instead of popup (alternative)

If popups don't work, you can use redirect method:

```typescript
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const provider = new GoogleAuthProvider();
await signInWithRedirect(auth, provider);
```

But this requires CORS configuration and additional setup.
