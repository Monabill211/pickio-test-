import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Check, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { registerUser } from '@/services/authService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();

  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors & { general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = isRTL ? 'الاسم الأول مطلوب' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = isRTL ? 'الاسم الأخير مطلوب' : 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = isRTL 
        ? 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام'
        : 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = isRTL ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      toast.success(isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      toast.info(isRTL ? 'تم إرسال رابط التحقق إلى بريدك الإلكتروني' : 'Verification email sent to your inbox');
      navigate('/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setErrors({ general: errorMessage });
      toast.error(isRTL ? `خطأ في إنشاء الحساب: ${errorMessage}` : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    return strength;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <UserPlus className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isRTL ? 'إنشاء حساب' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'انضم إلينا اليوم' : 'Join us today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isRTL ? 'الاسم الأول' : 'First Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input
                      type="text"
                      placeholder={isRTL ? 'أحمد' : 'John'}
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={cn(
                        "pl-10 rtl:pl-4 rtl:pr-10",
                        errors.firstName && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isRTL ? 'الاسم الأخير' : 'Last Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input
                      type="text"
                      placeholder={isRTL ? 'محمد' : 'Doe'}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={cn(
                        "pl-10 rtl:pl-4 rtl:pr-10",
                        errors.lastName && "border-destructive"
                      )}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "pl-10 rtl:pl-4 rtl:pr-10",
                      errors.email && "border-destructive"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "pl-10 pr-10 rtl:pl-10 rtl:pr-10",
                      errors.password && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-3"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            i < passwordStrength()
                              ? passwordStrength() <= 1
                                ? "bg-destructive"
                                : passwordStrength() <= 2
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength() <= 1
                        ? isRTL ? 'ضعيفة' : 'Weak'
                        : passwordStrength() <= 2
                        ? isRTL ? 'متوسطة' : 'Fair'
                        : isRTL ? 'قوية' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={cn(
                      "pl-10 pr-10 rtl:pl-10 rtl:pr-10",
                      errors.confirmPassword && "border-destructive"
                    )}
                  />
                  {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 rtl:right-auto rtl:left-3" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-10"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'أوافق على' : 'I agree to the'}{' '}
                    <Link to="#" className="text-primary hover:underline">
                      {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </Link>
                    {' '}{isRTL ? 'و' : 'and'}{' '}
                    <Link to="#" className="text-primary hover:underline">
                      {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-xs text-destructive mt-1">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-background border-t-foreground animate-spin" />
                    {isRTL ? 'جاري الإنشاء...' : 'Creating...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {isRTL ? 'إنشاء حساب' : 'Create Account'}
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  {isRTL ? 'أو' : 'Or'}
                </span>
              </div>
            </div>

            {/* Google Register */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                className="w-full gap-2 mb-6 hover:bg-primary/5 transition-colors"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const { signInWithGoogle } = await import('@/services/authService');
                    await signInWithGoogle();
                    toast.success(isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
                    setTimeout(() => navigate('/profile'), 500);
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
                    toast.error(isRTL ? `خطأ في إنشاء الحساب: ${errorMessage}` : errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isRTL ? 'إنشاء حساب بحساب Google' : 'Sign up with Google'}
              </Button>
            </motion.div>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {isRTL ? 'تسجيل الدخول' : 'Sign in'}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;