# Debugging Firebase Data Issues

## Issues Found

1. **Category Filtering Not Working**
   - Products might have `categoryId` but filter checks `category` first
   - Need to check both fields properly

2. **Featured Products Empty**
   - `getFeaturedProducts` only returns products with badges
   - If no products have badges, it returns empty array
   - Fixed: Now shows all visible products if no featured products with badges

## Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for logs:
     - "All Products:" - shows all products fetched
     - "Product categories:" - shows category fields for each product
     - "Selected Categories:" - shows which category is selected
     - "Available Categories:" - shows all categories

2. **Check Firebase Data**
   - Go to Firebase Console
   - Check `products` collection
   - Verify:
     - Products have `visible: true`
     - Products have `categoryId` set to category ID (not name)
     - Products have `category` field (can be ID or name)
     - Products have `images` array with at least one image

3. **Check Categories**
   - Go to Firebase Console
   - Check `categories` collection
   - Verify categories exist and have IDs matching what's in products

## Common Issues

### Products Not Showing in Shop
- **Cause**: Products don't have `visible: true`
- **Fix**: Set `visible: true` in admin panel

### Category Filter Not Working
- **Cause**: Product `categoryId` doesn't match category ID from URL
- **Fix**: Make sure when adding products, the category field is set to the category ID

### Featured Products Empty
- **Cause**: No products have badges set
- **Fix**: Either set badges on products OR the code now shows all visible products if no badges

## Testing

1. Add a product in admin panel
2. Make sure:
   - `visible` is checked
   - Category is selected (this sets both `category` and `categoryId`)
   - At least one image is uploaded
3. Go to home page - should see products
4. Click a category - should see filtered products
