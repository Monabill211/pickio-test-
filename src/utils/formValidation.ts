/**
 * Form Validation Utilities
 * Provides consistent validation functions for all forms in the application
 */

export interface ValidationError {
  field: string;
  message: string;
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (multiple formats)
export const validatePhone = (phone: string): boolean => {
  // Accept E.164 format, basic US/EU, or common format with +
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password: string, minLength: number = 8): boolean => {
  // Must have uppercase, lowercase, number, and min length
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  return password.length >= minLength && passwordRegex.test(password);
};

// URL validation
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Number validation
export const validateNumber = (value: any, min?: number, max?: number): boolean => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// Product name validation
export const validateProductName = (name: string, minLength: number = 3, maxLength: number = 100): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Product description validation
export const validateProductDescription = (description: string, minLength: number = 10, maxLength: number = 5000): boolean => {
  const trimmed = description.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Price validation
export const validatePrice = (price: any): boolean => {
  const num = Number(price);
  return !isNaN(num) && num > 0;
};

// Stock validation
export const validateStock = (stock: any): boolean => {
  const num = Number(stock);
  return !isNaN(num) && num >= 0 && Number.isInteger(num);
};

// Image URL validation
export const validateImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = parsedUrl.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.endsWith(ext)) || url.includes('image');
  } catch {
    return false;
  }
};

// Form validation results
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Product form validation
export const validateProductForm = (data: {
  name_ar?: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  price?: any;
  stock?: any;
  category?: string;
  images?: string[];
}): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name_ar?.trim()) {
    errors.name_ar = 'اسم المنتج (العربية) مطلوب';
  } else if (!validateProductName(data.name_ar)) {
    errors.name_ar = 'يجب أن يكون الاسم بين 3 و 100 حرف';
  }

  if (!data.name_en?.trim()) {
    errors.name_en = 'Product name (English) is required';
  } else if (!validateProductName(data.name_en)) {
    errors.name_en = 'Name must be between 3 and 100 characters';
  }

  if (!data.description_ar?.trim()) {
    errors.description_ar = 'الوصف (العربية) مطلوب';
  } else if (!validateProductDescription(data.description_ar)) {
    errors.description_ar = 'يجب أن يكون الوصف بين 10 و 5000 حرف';
  }

  if (!data.description_en?.trim()) {
    errors.description_en = 'Description (English) is required';
  } else if (!validateProductDescription(data.description_en)) {
    errors.description_en = 'Description must be between 10 and 5000 characters';
  }

  if (!validatePrice(data.price)) {
    errors.price = 'السعر يجب أن يكون أكبر من 0';
  }

  if (!validateStock(data.stock)) {
    errors.stock = 'المخزون يجب أن يكون رقم موجب';
  }

  if (!data.category) {
    errors.category = 'اختر فئة المنتج';
  }

  if (!data.images || data.images.length === 0) {
    errors.images = 'أضف على الأقل صورة واحدة للمنتج';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Contact form validation
export const validateContactForm = (data: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.subject?.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Register form validation
export const validateRegisterForm = (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to terms and conditions';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Login form validation
export const validateLoginForm = (data: {
  email?: string;
  password?: string;
}): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Checkout form validation
export const validateCheckoutForm = (data: {
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.street?.trim()) {
    errors.street = 'Street address is required';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!data.zipCode?.trim()) {
    errors.zipCode = 'Zip code is required';
  }

  if (!data.country?.trim()) {
    errors.country = 'Country is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
