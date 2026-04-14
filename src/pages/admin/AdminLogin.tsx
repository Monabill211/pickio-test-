import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);

    try {
      await login(demoEmail, demoPassword);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <LogIn className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage pickio</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-lg text-sm flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  disabled={isLoading}
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a
                href="#"
                className="text-primary hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setError('Password recovery not implemented yet');
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 text-base font-semibold"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Demo Credentials</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold mb-3">
              Click to auto-fill credentials:
            </p>

            {/* Super Admin Demo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
              disabled={isLoading}
              className="w-full p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 text-left"
            >
              <div className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                👑 Super Admin
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                admin@example.com
              </div>
            </motion.button>

            {/* Admin Demo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleDemoLogin('user@example.com', 'user123')}
              disabled={isLoading}
              className="w-full p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 transition-colors disabled:opacity-50 text-left"
            >
              <div className="font-semibold text-green-900 dark:text-green-100 text-sm">
                🔑 Admin
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 font-mono">
                user@example.com
              </div>
            </motion.button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>🔐 Demo Admin Panel for pickio Furniture Store</p>
              <p className="text-xs">Contact support for access issues</p>
            </div>
          </div>
        </div>

        {/* Bottom Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <p>
            This is a demonstration admin panel. Real credentials would be managed by Firebase Auth.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;