# 🚀 Quick Cloudinary Setup (5 minutes)

## Step 1: Get Your API Key

1. Go to: https://console.cloudinary.com/
2. Sign in
3. Go to **Settings** (gear icon) → **Security** tab
4. Copy your **API Key** (the number, not the secret)

## Step 2: Create Upload Preset

1. In Cloudinary Dashboard, go to **Settings** → **Upload** tab
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `dar_home_upload`
   - **Signing mode**: Select **Unsigned** ✅
   - **Folder**: `dar-home` (optional, for organization)
   - **Format**: `Auto` (for automatic optimization)
5. Click **Save**

## Step 3: Update .env File

Open `.env` file and update:

```env
VITE_CLOUDINARY_API_KEY=YOUR_API_KEY_HERE
VITE_CLOUDINARY_UPLOAD_PRESET=dar_home_upload
```

**Important**: 
- Replace `YOUR_API_KEY_HERE` with your actual API key from Step 1
- The API secret is already set (don't change it)
- The upload preset name should match what you created in Step 2

## Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test Upload

1. Go to `/admin/categories`
2. Click "Add Category" or edit existing
3. Click "Upload Image"
4. Select an image
5. Click "Save"
6. ✅ Image should upload successfully!

## ✅ Done!

Your images will now:
- Upload to Cloudinary (no Firebase Storage needed)
- Be automatically optimized
- Load fast via CDN
- No permission errors
- No CORS issues

## Troubleshooting

### "Upload preset not found"
- Make sure you created the preset in Cloudinary Dashboard
- Check the preset name matches in `.env`
- Make sure preset is set to **Unsigned**

### "Invalid API key"
- Verify API key in Cloudinary Dashboard → Settings → Security
- Make sure it's in `.env` file

### Still not working?
- Check browser console for errors
- Verify Cloudinary account is active
- Make sure you restarted the dev server after updating `.env`
