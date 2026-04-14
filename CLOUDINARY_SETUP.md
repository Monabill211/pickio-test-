# Cloudinary Setup Guide

Cloudinary is now configured for image uploads. You need to set up an upload preset in Cloudinary Dashboard.

## Step 1: Get Your API Key

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Sign in to your account
3. Go to **Settings** → **Security**
4. Copy your **API Key** (not the secret - that's already in .env)

## Step 2: Update .env File

Open `.env` file and update:

```env
VITE_CLOUDINARY_API_KEY=your_actual_api_key_here
```

## Step 3: Create Upload Preset (Recommended)

### Option A: Unsigned Upload Preset (Easiest)

1. Go to Cloudinary Dashboard → **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set:
   - **Preset name**: `dar_home_upload` (or any name)
   - **Signing mode**: **Unsigned** ✅
   - **Folder**: `dar-home` (optional)
5. Click **Save**
6. Copy the preset name
7. Update `.env`:
   ```env
   VITE_CLOUDINARY_UPLOAD_PRESET=dar_home_upload
   ```

### Option B: Signed Upload (More Secure)

If you prefer signed uploads, you'll need to create a server-side endpoint to sign the upload request. For now, unsigned is fine for development.

## Step 4: Test Upload

1. Restart your dev server: `npm run dev`
2. Go to `/admin/categories`
3. Try uploading an image
4. It should upload to Cloudinary successfully!

## Features

✅ **Automatic image optimization**
✅ **Automatic format conversion**
✅ **CDN delivery** (fast loading)
✅ **No CORS issues**
✅ **No permission errors**
✅ **Automatic resizing** (800x800 max)

## Image Transformations

Images are automatically:
- Resized to max 800x800px
- Optimized for web
- Served via CDN

## Folder Structure

Images are organized in Cloudinary:
- Categories: `categories/`
- Products: `products/`
- Other: as specified

## Security Notes

- **API Secret** is in `.env` but won't be exposed to frontend (Vite only includes VITE_* vars)
- **Upload Preset** should be unsigned for client-side uploads
- For production, consider using signed uploads with server-side signing

## Troubleshooting

### "Upload preset not found"
- Make sure you created the upload preset in Cloudinary Dashboard
- Check the preset name matches in `.env`

### "Invalid API key"
- Verify your API key in Cloudinary Dashboard
- Update `.env` with correct API key

### Still getting errors?
- Check browser console for detailed error messages
- Verify Cloudinary account is active
- Check upload preset is set to "Unsigned"
