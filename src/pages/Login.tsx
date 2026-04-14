import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { loginUser, resetPassword } from '@/services/authService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    if (!password) {
      newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await loginUser(email, password);
      toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
      navigate('/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setErrors({ general: errorMessage });
      toast.error(isRTL ? `خطأ في تسجيل الدخول: ${errorMessage}` : errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                <LogIn className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'أدخل بيانات حسابك للمتابعة' : 'Enter your credentials to continue'}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={cn(
                      "pl-10 rtl:pl-4 rtl:pr-10",
                      errors.email && "border-destructive focus-visible:ring-destructive"
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={cn(
                      "pl-10 pr-10 rtl:pl-10 rtl:pr-10",
                      errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'تذكرني' : 'Remember me'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error(isRTL ? 'يرجى إدخال البريد الإلكتروني أولاً' : 'Please enter your email first');
                      return;
                    }
                    try {
                      await resetPassword(email);
                      toast.success(isRTL ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'Password reset email sent');
                    } catch (error) {
                      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
                      toast.error(isRTL ? `خطأ: ${errorMessage}` : errorMessage);
                    }
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {isRTL ? 'هل نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
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
                    {isRTL ? 'جاري التحميل...' : 'Loading...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {isRTL ? 'تسجيل الدخول' : 'Login'}
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

            {/* Social Login */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const { signInWithGoogle } = await import('@/services/authService');
                    await signInWithGoogle();
                    toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
                    navigate('/profile');
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
                    toast.error(isRTL ? `خطأ في تسجيل الدخول: ${errorMessage}` : errorMessage);
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
                {isRTL ? 'تسجيل الدخول بحساب Google' : 'Continue with Google'}
              </Button>
            </motion.div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                {isRTL ? 'إنشاء حساب' : 'Sign up'}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;