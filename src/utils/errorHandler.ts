/**
 * Centralized error handling and user-friendly error messages
 * Handles Firebase errors, form validation, and API errors
 */

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  severity: 'info' | 'warning' | 'error';
  actionText?: string;
  actionUrl?: string;
}

// Firebase Authentication Errors
export const firebaseAuthErrors: Record<string, ErrorDetails> = {
  'auth/email-already-in-use': {
    code: 'auth/email-already-in-use',
    message: 'Email is already registered',
    userMessage: 'This email is already registered. Please log in or use a different email.',
    severity: 'warning',
    actionText: 'Log In',
    actionUrl: '/login',
  },
  'auth/weak-password': {
    code: 'auth/weak-password',
    message: 'Password is too weak',
    userMessage: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
    severity: 'warning',
  },
  'auth/invalid-email': {
    code: 'auth/invalid-email',
    message: 'Invalid email address',
    userMessage: 'Please enter a valid email address.',
    severity: 'warning',
  },
  'auth/user-not-found': {
    code: 'auth/user-not-found',
    message: 'User not found',
    userMessage: 'No account found with this email. Please register first.',
    severity: 'warning',
    actionText: 'Register',
    actionUrl: '/register',
  },
  'auth/wrong-password': {
    code: 'auth/wrong-password',
    message: 'Incorrect password',
    userMessage: 'The password you entered is incorrect. Please try again.',
    severity: 'warning',
  },
  'auth/user-disabled': {
    code: 'auth/user-disabled',
    message: 'Account disabled',
    userMessage: 'This account has been disabled. Please contact support.',
    severity: 'error',
  },
  'auth/too-many-requests': {
    code: 'auth/too-many-requests',
    message: 'Too many failed attempts',
    userMessage: 'Too many failed login attempts. Please try again later.',
    severity: 'warning',
  },
  'auth/popup-closed-by-user': {
    code: 'auth/popup-closed-by-user',
    message: 'Sign-in popup was closed',
    userMessage: 'You closed the sign-in popup. Please try again.',
    severity: 'info',
  },
  'auth/cancelled-popup-request': {
    code: 'auth/cancelled-popup-request',
    message: 'Sign-in was cancelled',
    userMessage: 'Sign-in was cancelled. Please try again.',
    severity: 'info',
  },
  'auth/popup-blocked': {
    code: 'auth/popup-blocked',
    message: 'Popup was blocked',
    userMessage: 'Popup was blocked by your browser. Please allow popups and try again.',
    severity: 'warning',
  },
  'auth/unauthorized-domain': {
    code: 'auth/unauthorized-domain',
    message: 'Domain not authorized',
    userMessage: 'This domain is not authorized for Google sign-in. Please contact support.',
    severity: 'error',
  },
  'auth/operation-not-supported-in-this-environment': {
    code: 'auth/operation-not-supported-in-this-environment',
    message: 'Operation not supported',
    userMessage: 'Sign-in is not available in this environment. Please use a different browser.',
    severity: 'error',
  },
  'auth/network-request-failed': {
    code: 'auth/network-request-failed',
    message: 'Network error',
    userMessage: 'Network error occurred. Please check your internet connection and try again.',
    severity: 'warning',
  },
};

// Firestore Errors
export const firestoreErrors: Record<string, ErrorDetails> = {
  'permission-denied': {
    code: 'permission-denied',
    message: 'Permission denied',
    userMessage: 'You do not have permission to access this resource.',
    severity: 'error',
  },
  'not-found': {
    code: 'not-found',
    message: 'Resource not found',
    userMessage: 'The requested resource was not found.',
    severity: 'warning',
  },
  'already-exists': {
    code: 'already-exists',
    message: 'Resource already exists',
    userMessage: 'This resource already exists. Please use a different name.',
    severity: 'warning',
  },
  'failed-precondition': {
    code: 'failed-precondition',
    message: 'Failed precondition',
    userMessage: 'Operation failed. Please check your input and try again.',
    severity: 'warning',
  },
  'unavailable': {
    code: 'unavailable',
    message: 'Service unavailable',
    userMessage: 'Service is temporarily unavailable. Please try again later.',
    severity: 'warning',
  },
};

// Storage Errors
export const storageErrors: Record<string, ErrorDetails> = {
  'storage/object-not-found': {
    code: 'storage/object-not-found',
    message: 'File not found',
    userMessage: 'The file you are looking for was not found.',
    severity: 'warning',
  },
  'storage/bucket-not-found': {
    code: 'storage/bucket-not-found',
    message: 'Storage bucket not found',
    userMessage: 'Storage service is not configured properly. Please contact support.',
    severity: 'error',
  },
  'storage/project-not-found': {
    code: 'storage/project-not-found',
    message: 'Project not found',
    userMessage: 'Storage service is not configured. Please contact support.',
    severity: 'error',
  },
  'storage/quota-exceeded': {
    code: 'storage/quota-exceeded',
    message: 'Storage quota exceeded',
    userMessage: 'Storage quota has been exceeded. Please contact support.',
    severity: 'error',
  },
  'storage/unauthenticated': {
    code: 'storage/unauthenticated',
    message: 'Authentication required',
    userMessage: 'You must be logged in to upload files.',
    severity: 'warning',
  },
  'storage/unauthorized': {
    code: 'storage/unauthorized',
    message: 'Permission denied',
    userMessage: 'You do not have permission to upload files.',
    severity: 'error',
  },
};

/**
 * Get error details from error code or message
 */
export const getErrorDetails = (error: any): ErrorDetails => {
  if (!error) {
    return {
      code: 'unknown',
      message: 'Unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'error',
    };
  }

  const code = error.code || error.name || '';
  const message = error.message || String(error);

  // Check Firebase Auth errors
  if (code in firebaseAuthErrors) {
    return firebaseAuthErrors[code];
  }

  // Check Firestore errors
  if (code in firestoreErrors) {
    return firestoreErrors[code];
  }

  // Check Storage errors
  if (code in storageErrors) {
    return storageErrors[code];
  }

  // Check if it contains common error patterns
  if (message.includes('PERMISSION_DENIED') || message.includes('permission-denied')) {
    return {
      code: 'permission-denied',
      message: 'Permission denied',
      userMessage: 'You do not have permission to perform this action.',
      severity: 'error',
    };
  }

  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return {
      code: 'network-error',
      message: 'Network error',
      userMessage: 'Network error occurred. Please check your internet connection and try again.',
      severity: 'warning',
    };
  }

  // Default error
  return {
    code: code || 'unknown-error',
    message: message,
    userMessage: message || 'An error occurred. Please try again.',
    severity: 'error',
  };
};

/**
 * Get user-friendly error message in the specified language
 */
export const getUserErrorMessage = (error: any, isRTL: boolean = false): string => {
  const errorDetails = getErrorDetails(error);
  
  const arMessages: Record<string, string> = {
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد مختلف.',
    'auth/weak-password': 'يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على أحرف كبيرة وصغيرة وأرقام.',
    'auth/invalid-email': 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
    'auth/user-not-found': 'لم يتم العثور على حساب بهذا البريد الإلكتروني. يرجى التسجيل أولاً.',
    'auth/wrong-password': 'كلمة المرور التي أدخلتها غير صحيحة. يرجى المحاولة مرة أخرى.',
    'auth/user-disabled': 'تم تعطيل هذا الحساب. يرجى التواصل مع الدعم.',
    'auth/too-many-requests': 'عدد محاولات الدخول الفاشلة كثير جداً. يرجى المحاولة لاحقاً.',
    'auth/popup-closed-by-user': 'لقد أغلقت نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    'auth/popup-blocked': 'تم حجب النافذة المنبثقة من قبل متصفحك. يرجى السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.',
    'auth/unauthorized-domain': 'هذا النطاق غير مصرح له بتسجيل الدخول عبر Google. يرجى التواصل مع الدعم.',
    'network-error': 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
  };

  if (isRTL && arMessages[errorDetails.code]) {
    return arMessages[errorDetails.code];
  }

  return errorDetails.userMessage;
};
