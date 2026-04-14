/**
 * Utility functions for safe product data access
 * Prevents TypeError when accessing product properties that might be undefined
 */

export const getProductName = (
  name: any,
  language: 'ar' | 'en' = 'ar',
  fallback: string = 'Product'
): string => {
  // Handle null or undefined
  if (!name) return fallback;

  // Handle object with language keys (updated format)
  if (typeof name === 'object' && name !== null) {
    if (language in name && typeof name[language] === 'string') {
      return name[language];
    }
    if ('ar' in name && typeof name.ar === 'string') {
      return name.ar;
    }
    if ('en' in name && typeof name.en === 'string') {
      return name.en;
    }
  }

  // Handle string directly
  if (typeof name === 'string') {
    return name;
  }

  return fallback;
};

export const getProductDescription = (
  description: any,
  language: 'ar' | 'en' = 'ar',
  fallback: string = ''
): string => {
  // Handle null or undefined
  if (!description) return fallback;

  // Handle object with language keys
  if (typeof description === 'object' && description !== null) {
    if (language in description && typeof description[language] === 'string') {
      return description[language];
    }
    if ('ar' in description && typeof description.ar === 'string') {
      return description.ar;
    }
    if ('en' in description && typeof description.en === 'string') {
      return description.en;
    }
  }

  // Handle string directly
  if (typeof description === 'string') {
    return description;
  }

  return fallback;
};

export const getCategoryName = (
  categoryName: any,
  language: 'ar' | 'en' = 'ar',
  fallback: string = 'Category'
): string => {
  // Handle null or undefined
  if (!categoryName) return fallback;

  // Handle object with language keys
  if (typeof categoryName === 'object' && categoryName !== null) {
    if (language in categoryName && typeof categoryName[language] === 'string') {
      return categoryName[language];
    }
    if ('ar' in categoryName && typeof categoryName.ar === 'string') {
      return categoryName.ar;
    }
    if ('en' in categoryName && typeof categoryName.en === 'string') {
      return categoryName.en;
    }
  }

  // Handle string directly
  if (typeof categoryName === 'string') {
    return categoryName;
  }

  return fallback;
};
