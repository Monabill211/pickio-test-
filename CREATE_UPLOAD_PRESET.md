# 🔴 CRITICAL: Create Cloudinary Upload Preset

The error "Upload preset not found" means the preset `dar_home_upload` doesn't exist in your Cloudinary account.

## ⚡ Quick Fix (5 minutes)

### Step 1: Login to Cloudinary
1. Go to: **https://console.cloudinary.com/**
2. Sign in with your account
3. Make sure you're viewing cloud: **dlkayagta**

### Step 2: Navigate to Upload Settings
1. Click **Settings** icon (⚙️ gear icon) in the top right corner
2. Click **Upload** tab in the left sidebar
3. Scroll down to find **Upload presets** section

### Step 3: Create New Preset
1. Click **Add upload preset** button (or **Add** button)
2. A form will appear

### Step 4: Fill in Preset Details

**Preset name:**
```
dar_home_upload
```
⚠️ **Must be exactly this name** (case-sensitive)

**Signing mode:**
- Click the dropdown
- Select **Unsigned** ✅
- **This is CRITICAL** - must be Unsigned for client-side uploads

**Folder (optional):**
```
dar-home
```

**Other settings (leave as default):**
- Format: Auto
- Quality: Auto
- Everything else: Default

### Step 5: Save
1. Click **Save** button at the bottom
2. You should see a success message
3. The preset should appear in the list

### Step 6: Verify
1. Check the preset list - you should see `dar_home_upload`
2. Make sure it shows **Unsigned** in the signing mode column

### Step 7: Restart Your App
```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

### Step 8: Test Upload
1. Go to `/admin/categories`
2. Try uploading an image
3. Should work now! ✅

## Visual Guide

```
Cloudinary Dashboard
│
├─ Settings (⚙️ icon, top right)
│  └─ Upload (left sidebar tab)
│     └─ Scroll down to "Upload presets"
│        └─ Click "Add upload preset"
│           ├─ Preset name: dar_home_upload
│           ├─ Signing mode: Unsigned ✅
│           ├─ Folder: dar-home
│           └─ Click "Save"
```

## Common Issues

### Can't find "Upload presets" section
- Make sure you're in **Settings** → **Upload** tab
- Scroll down - it's below other settings
- Look for a section titled "Upload presets"

### "Unsigned" option not available
- Make sure you're creating a NEW preset (not editing existing)
- Some accounts might need to enable unsigned uploads first
- Check Cloudinary account settings

### Preset created but still getting error
1. **Verify preset name** - Must be exactly `dar_home_upload` (no spaces, case-sensitive)
2. **Check signing mode** - Must be "Unsigned"
3. **Restart dev server** - Environment variables load on startup
4. **Clear browser cache** - Ctrl+Shift+Delete
5. **Check .env file** - Should have `VITE_CLOUDINARY_UPLOAD_PRESET=dar_home_upload`

## Alternative: Use Different Preset Name

If you want to use a different name:

1. Create preset with your name (e.g., `my_preset`)
2. Update `.env`:
   ```env
   VITE_CLOUDINARY_UPLOAD_PRESET=my_preset
   ```
3. Restart server

## Still Not Working?

1. **Check Cloudinary Dashboard:**
   - Go to Settings → Upload → Upload presets
   - Verify `dar_home_upload` exists
   - Verify it's set to "Unsigned"

2. **Check .env file:**
   ```bash
   cat .env | grep CLOUDINARY
   ```
   Should show:
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=dar_home_upload
   ```

3. **Restart everything:**
   - Stop dev server completely
   - Start again: `npm run dev`
   - Hard refresh browser: Ctrl+Shift+R

4. **Check browser console:**
   - Look for the exact error message
   - Check if preset name matches

## Why This Is Required

Cloudinary requires an upload preset for client-side (unsigned) uploads. This is a security feature that:
- Prevents unauthorized uploads
- Allows you to set upload limits and transformations
- Keeps your API secret secure

The preset acts as a "template" that defines how images should be uploaded.
