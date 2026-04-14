import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { isRTL, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: isRTL ? 'لوحة التحكم' : 'Dashboard', 
      href: '/admin',
      badge: null 
    },
    { 
      icon: Package, 
      label: isRTL ? 'المنتجات' : 'Products', 
      href: '/admin/products',
      badge: null 
    },
    { 
      icon: FolderOpen, 
      label: isRTL ? 'الفئات' : 'Categories', 
      href: '/admin/categories',
      badge: null 
    },
    { 
      icon: ShoppingCart, 
      label: isRTL ? 'الطلبات' : 'Orders', 
      href: '/admin/orders',
      badge: null 
    },
    { 
      icon: Users, 
      label: isRTL ? 'المستخدمون' : 'Users', 
      href: '/admin/users',
      badge: null 
    },
    { 
      icon: Mail, 
      label: isRTL ? 'رسائل العملاء' : 'Contact Messages', 
      href: '/admin/contact-messages',
      badge: null 
    },
    { 
      icon: FileText, 
      label: isRTL ? 'المحتوى' : 'Content', 
      href: '/admin/content',
      badge: null 
    },
    { 
      icon: Settings, 
      label: isRTL ? 'الإعدادات' : 'Settings', 
      href: '/admin/settings',
      badge: null 
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex h-screen bg-background" style={{ direction: 'ltr' }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always on Left */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card transition-all",
          !sidebarOpen && 'hidden lg:block'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              D
            </div>
            <span className="text-lg font-bold text-foreground">pickio</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3 mb-3">
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'مسجل دخول كـ' : 'Logged in as'}
            </p>
            <p className="font-semibold text-foreground text-sm truncate">
              {user?.email}
            </p>
            <p className={cn(
              "text-xs font-semibold mt-1",
              user?.role === 'superadmin' ? 'text-primary' : 'text-amber-600'
            )}>
              {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full gap-2"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            {isRTL ? 'تسجيل خروج' : 'Logout'}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="flex flex-1 flex-col overflow-hidden ml-64"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">
                {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            <div className={cn(
              "hidden sm:flex items-center gap-3 border-l border-border",
              isRTL ? 'pr-4' : 'pl-4'
            )}>
              <div className={cn("flex flex-col", isRTL ? 'items-start' : 'items-end')}>
                <p className="text-sm font-semibold text-foreground">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;