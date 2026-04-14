import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superadmin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, loading, user } = useAdminAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent mx-auto"
          />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has required role (optional)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'superadmin') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-background"
      >
        <div className="max-w-md text-center space-y-6 p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto"
          >
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M6.25 18h11.5M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2"
              />
            </svg>
          </motion.div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Required role: <span className="font-semibold text-foreground">{requiredRole}</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Current role: <span className="font-semibold text-foreground">{user?.role}</span>
            </p>
            <a
              href="/admin"
              className="inline-block w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Go back to dashboard
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;