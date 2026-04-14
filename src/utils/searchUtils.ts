/**
 * Normalize Arabic text for better search matching
 * Removes diacritics and normalizes Arabic characters
 */
export const normalizeArabic = (text: string): string => {
  // Remove Arabic diacritics (tashkeel)
  const diacritics = /[\u064B-\u065F\u0670]/g;
  let normalized = text.replace(diacritics, '');
  
  // Normalize common Arabic characters
  normalized = normalized
    .replace(/[إأآا]/g, 'ا') // Normalize Alef variations
    .replace(/ى/g, 'ي') // Normalize Yeh variations
    .replace(/ة/g, 'ه'); // Normalize Teh Marbuta to Heh
  
  return normalized.trim();
};

/**
 * Normalize text for search (handles both Arabic and English)
 */
export const normalizeSearchText = (text: string): string => {
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  
  if (hasArabic) {
    return normalizeArabic(text).toLowerCase();
  }
  
  return text.toLowerCase().trim();
};

/**
 * Check if search query matches text (handles Arabic and English)
 */
export const matchesSearch = (text: string, query: string): boolean => {
  if (!query.trim()) return true;
  
  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query);
  
  return normalizedText.includes(normalizedQuery);
};
