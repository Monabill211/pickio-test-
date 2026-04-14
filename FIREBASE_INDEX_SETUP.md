# Firebase Index Setup

## Issue
When querying products with `where('visible', '==', true)` and `orderBy('createdAt', 'desc')`, Firebase requires a composite index.

## Solution 1: Automatic Fallback (Already Implemented)
The code now automatically handles this by:
1. Catching the index error
2. Fetching products without `orderBy`
3. Sorting in memory

**This works immediately - no action needed!**

## Solution 2: Create the Index (Optional - Better Performance)

If you want better performance, you can create the index:

1. **Click the link in the error message** - Firebase will open the index creation page
2. OR manually:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `picchio-9020c`
   - Go to **Firestore Database** → **Indexes** tab
   - Click **Create Index**
   - Configure:
     - **Collection ID**: `products`
     - **Fields to index**:
       - Field: `visible` | Order: Ascending
       - Field: `createdAt` | Order: Descending
     - Click **Create**

3. Wait for the index to build (usually takes a few minutes)

## Current Status
✅ **Code is fixed** - Works without index (sorts in memory)
⚠️ **Index recommended** - For better performance with large datasets

The app will work fine without the index, but creating it will improve query performance.
