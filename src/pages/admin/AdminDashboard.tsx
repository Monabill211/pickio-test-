import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertCircle,
  DollarSign,
  Users,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { getOrders } from '@/services/orderService';
import { getUsers } from '@/services/userService';
import { getProducts } from '@/services/productService';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductName } from '@/utils/safeProductAccess';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekOrders = orders.filter(order => new Date(order.createdAt) >= weekAgo);
  const weekSales = weekOrders.reduce((sum, order) => sum + order.total, 0);

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthOrders = orders.filter(order => new Date(order.createdAt) >= monthAgo);
  const monthSales = monthOrders.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const lowStockProducts = products.filter(product => (product.stock || 0) < 5);

  const stats = [
    {
      title: t('admin.dashboard.todaySales'),
      value: `${todaySales.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`,
      icon: DollarSign,
      trend: `+${todayOrders.length}`,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: t('admin.dashboard.thisWeek'),
      value: `${weekSales.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`,
      icon: TrendingUp,
      trend: `+${weekOrders.length}`,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: t('admin.dashboard.thisMonth'),
      value: `${monthSales.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`,
      icon: DollarSign,
      trend: `+${monthOrders.length}`,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: t('admin.dashboard.newOrders'),
      value: String(pendingOrders.length),
      icon: ShoppingCart,
      trend: `+${pendingOrders.length}`,
      color: 'bg-orange-500/10 text-orange-500',
    },
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('admin.dashboard.welcome')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.trend}</span>
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{t('admin.dashboard.recentOrders')}</h2>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t('admin.dashboard.noRecentOrders')}</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {order.total.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {t(`admin.status.${order.status}`)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/orders')}>
                    {t('admin.dashboard.viewAllOrders')}
                  </Button>
                </>
              )}
            </Card>
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-foreground">{t('admin.dashboard.lowStock')}</h2>
              </div>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t('admin.dashboard.allProductsInStock')}</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="p-3 rounded-lg bg-destructive/10">
                      <p className="font-semibold text-foreground text-sm">
                        {getProductName(
                          product.name ? { ar: product.name_ar, en: product.name_en } : product.name,
                          language as 'ar' | 'en',
                          'Product'
                        )}
                      </p>
                      <p className="text-xs text-destructive font-semibold">
                        {t('admin.dashboard.stock')}: {product.stock || 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;