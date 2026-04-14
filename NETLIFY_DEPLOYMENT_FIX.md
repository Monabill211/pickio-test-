# Netlify SPA Routing Fix - Admin Panel 404 Error

## Problem
After deployment, accessing `https://pickiofurniture.com/admin/login` returns 404 "Page not found" even though it works locally.

## Root Cause
Netlify is looking for a physical file at `/admin/login` instead of serving `index.html` for the React SPA.

## Solution Applied
Two redirect configurations have been added:

### 1. `netlify.toml` (Root of project)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
```

### 2. `public/_redirects` (Copied to `dist/_redirects` during build)
```
/*    /index.html   200
```

## Deployment Steps

### Option A: Git Deployment (Recommended)
1. **Commit the new files:**
   ```bash
   git add netlify.toml public/_redirects
   git commit -m "fix: Add Netlify SPA redirects for admin routes"
   git push
   ```

2. **Netlify will automatically:**
   - Detect the push
   - Run `npm run build`
   - Deploy from `dist/` directory
   - Apply redirects from both `netlify.toml` and `dist/_redirects`

3. **Wait for deployment to complete** (check Netlify dashboard)

4. **Test:** Visit `https://pickiofurniture.com/admin/login`

### Option B: Manual Deployment
1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Verify `dist/_redirects` exists:**
   ```bash
   cat dist/_redirects
   ```
   Should show: `/*    /index.html   200`

3. **Deploy `dist/` folder** to Netlify (via drag & drop or CLI)

## Verification Checklist

After deployment, verify:
- ✅ `netlify.toml` is in the repository root
- ✅ `public/_redirects` is in the `public/` folder
- ✅ `dist/_redirects` exists after build (in `dist/` root)
- ✅ Netlify build logs show redirects being applied
- ✅ `https://pickiofurniture.com/admin/login` loads (not 404)

## Troubleshooting

### If still getting 404:

1. **Check Netlify Build Logs:**
   - Go to Netlify Dashboard → Site → Deploys
   - Check if `_redirects` file is detected
   - Look for "Redirect rules" in build output

2. **Clear Netlify Cache:**
   - Netlify Dashboard → Site → Deploys → Trigger deploy → Clear cache and deploy site

3. **Verify Build Output:**
   ```bash
   npm run build
   ls -la dist/ | grep redirects
   ```
   Should show `_redirects` file

4. **Check Netlify Site Settings:**
   - Site Settings → Build & deploy → Build settings
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Force Redeploy:**
   - Netlify Dashboard → Deploys → Trigger deploy

## How It Works

1. User visits `https://pickiofurniture.com/admin/login`
2. Netlify receives request for `/admin/login`
3. `_redirects` rule matches: `/*` → `/index.html` (200)
4. Netlify serves `index.html` with HTTP 200 status
5. React app loads in browser
6. React Router (BrowserRouter) handles `/admin/login` route
7. AdminLogin component renders ✅

## Important Notes

- **Both files are needed:** `netlify.toml` for build config, `_redirects` as fallback
- **The redirect must return 200** (not 301/302) to preserve the URL
- **`force = true`** ensures this rule takes precedence
- **After adding files, you MUST redeploy** for changes to take effect
