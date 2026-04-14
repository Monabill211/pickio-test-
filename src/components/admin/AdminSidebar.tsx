import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Tag,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      label: isRTL ? 'لوحة التحكم' : 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: isRTL ? 'المنتجات' : 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: isRTL ? 'الفئات' : 'Categories',
      href: '/admin/categories',
      icon: Tag,
    },
    {
      label: isRTL ? 'الطلبات' : 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      label: isRTL ? 'المستخدمون' : 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: isRTL ? 'رسائل العملاء' : 'Contact Messages',
      href: '/admin/contact-messages',
      icon: Mail,
    },
    {
      label: isRTL ? 'المحتوى' : 'Content',
      href: '/admin/content',
      icon: FileText,
    },
    {
      label: isRTL ? 'التقارير' : 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      label: isRTL ? 'الإعدادات' : 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const SidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">
          {isRTL ? 'إدارة' : 'Admin'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isRTL ? 'لوحة التحكم' : 'Control Panel'}
        </p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border space-y-3">
        <Button variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          {isRTL ? 'تسجيل الخروج' : 'Logout'}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card fixed h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center p-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.aside
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="lg:hidden fixed inset-0 z-30 w-64 bg-card border-r border-border overflow-y-auto"
        >
          {SidebarContent}
        </motion.aside>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;