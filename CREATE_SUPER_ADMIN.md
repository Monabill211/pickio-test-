# How to Create Super Admin User in Firebase

## Step 1: Enable Email/Password Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/picchio-9020c/authentication/providers)
2. Click on **Authentication** in the left sidebar
3. Click on **Sign-in method** tab
4. Find **Email/Password** in the list
5. Click on it and **Enable** it
6. Make sure both "Email" and "Password" are enabled
7. Click **Save**

## Step 2: Create Super Admin User

You have **3 options** to create the super admin:

### Option A: Using Firebase Console (Easiest)

1. Go to [Firebase Console - Authentication](https://console.firebase.google.com/project/picchio-9020c/authentication/users)
2. Click **Add user** button
3. Enter:
   - **Email**: `fahmyuiux@gmail.com`
   - **Password**: `Admin@123456`
   - **Disable email verification** (uncheck if checked)
4. Click **Add user**
5. **Important**: After creating the user, you need to add the user document to Firestore:
   - Go to [Firestore Database](https://console.firebase.google.com/project/picchio-9020c/firestore)
   - Click **Start collection** (if no collections exist) or navigate to `users` collection
   - Click **Add document**
   - **Document ID**: Copy the UID from Authentication (click on the user you just created to see the UID)
   - Add these fields:
     ```
     name: "Super Admin" (string)
     email: "fahmyuiux@gmail.com" (string)
     phone: "" (string)
     role: "admin" (string)
     status: "active" (string)
     orders: 0 (number)
     joinDate: [Current timestamp] (timestamp)
     createdAt: [Current timestamp] (timestamp)
     updatedAt: [Current timestamp] (timestamp)
     ```
   - Click **Save**

### Option B: Using Browser Console (After enabling Email/Password)

1. Open your app in browser: `http://localhost:8080`
2. Open browser console (F12)
3. Make sure Email/Password is enabled in Firebase Console first
4. Run this command:
   ```javascript
   window.createSuperAdmin('fahmyuiux@gmail.com', 'Admin@123456', 'Super Admin')
   ```
5. Wait for success message

### Option C: Using Admin Settings Page

1. Make sure Email/Password is enabled in Firebase Console first
2. Go to `/admin/settings` (you may need to login with demo credentials first)
3. Click **Create Super Admin** button in the header
4. Wait for success message

## Step 3: Verify

1. Go to [Firebase Console - Authentication](https://console.firebase.google.com/project/picchio-9020c/authentication/users)
2. You should see `fahmyuiux@gmail.com` in the users list
3. Go to [Firestore Database](https://console.firebase.google.com/project/picchio-9020c/firestore)
4. Navigate to `users` collection
5. You should see a document with the user's UID and `role: "admin"`

## Login Credentials

After creating the super admin:
- **Email**: `fahmyuiux@gmail.com`
- **Password**: `Admin@123456`
- **Login URL**: `http://localhost:8080/admin/login`

## Troubleshooting

### Error: "auth/configuration-not-found"
- **Solution**: Enable Email/Password authentication in Firebase Console (Step 1)

### Error: "auth/email-already-in-use"
- The user already exists in Firebase Auth
- You just need to add/update the Firestore document with `role: "admin"`

### Error: "Missing or insufficient permissions"
- Make sure Firestore rules allow write access to `users` collection
- Check `firestore.rules` file and publish it in Firebase Console
