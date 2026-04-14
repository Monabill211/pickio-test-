/**
 * Pricing Utilities for Product Management
 * Handles price calculations, discounts, and formatting
 */

export interface PricingData {
  originalPrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  finalPrice: number;
  savings: number;
}

/**
 * Calculate pricing data from original and discount prices
 */
export const calculatePricing = (
  originalPrice: number,
  discountedPrice?: number
): PricingData => {
  const price = Math.max(0, originalPrice);
  const discount = discountedPrice ? Math.max(0, Math.min(discountedPrice, price)) : 0;
  const finalPrice = discount > 0 ? discount : price;
  const savings = price - finalPrice;
  const discountPercentage = price > 0 ? Math.round((savings / price) * 100) : 0;

  return {
    originalPrice: price,
    discountedPrice: discount > 0 ? discount : undefined,
    discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
    finalPrice,
    savings,
  };
};

/**
 * Calculate percentage off from original and discount prices
 */
export const getDiscountPercentage = (originalPrice: number, discountPrice: number): number => {
  if (originalPrice <= 0) return 0;
  const discount = Math.max(0, originalPrice - discountPrice);
  return Math.round((discount / originalPrice) * 100);
};

/**
 * Calculate discounted price from percentage
 */
export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  if (originalPrice <= 0 || discountPercentage <= 0) return originalPrice;
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return Math.max(0, originalPrice - discountAmount);
};

/**
 * Validate pricing
 */
export interface PricingValidation {
  isValid: boolean;
  errors: string[];
}

export const validatePricing = (
  originalPrice: number,
  discountedPrice?: number,
  stock?: number
): PricingValidation => {
  const errors: string[] = [];

  if (!originalPrice || originalPrice <= 0) {
    errors.push('Original price must be greater than 0 EGP');
  }

  if (originalPrice > 999999) {
    errors.push('Price cannot exceed 999,999 EGP');
  }

  if (discountedPrice && discountedPrice <= 0) {
    errors.push('Discount price must be greater than 0 EGP');
  }

  if (discountedPrice && discountedPrice >= originalPrice) {
    errors.push('Discount price must be less than original price');
  }

  if (stock !== undefined) {
    if (stock < 0) {
      errors.push('Stock cannot be negative');
    }
    if (stock > 999999) {
      errors.push('Stock cannot exceed 999,999 units');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format Egyptian Pound currency
 */
export const formatEGP = (amount: number): string => {
  return `${amount.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} EGP`;
};

/**
 * Format price for display in Arabic
 */
export const formatPriceAR = (amount: number): string => {
  return `${amount.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ج.م`;
};

/**
 * Get pricing badge text
 */
export const getPricingBadge = (discountPercentage?: number): string | null => {
  if (!discountPercentage || discountPercentage <= 0) return null;
  if (discountPercentage >= 50) return 'Hot Deal';
  if (discountPercentage >= 30) return 'Great Deal';
  if (discountPercentage >= 15) return 'Sale';
  return null;
};
