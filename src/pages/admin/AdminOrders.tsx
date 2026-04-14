import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getOrders, Order } from '@/services/orderService';
import { toast } from 'sonner';

const AdminOrders: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders', filterStatus],
    queryFn: () => getOrders(filterStatus !== 'all' ? { status: filterStatus as Order['status'] } : undefined),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`admin.status.${status}`) || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const csv = [
      [
        t('admin.orders.orderId'),
        t('admin.orders.customer'),
        t('admin.orders.email'),
        t('admin.orders.total'),
        t('admin.orders.status'),
        t('admin.orders.date'),
        isRTL ? 'عدد العناصر' : 'Items'
      ],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customer.name,
        order.customer.email,
        order.total.toLocaleString(),
        getStatusLabel(order.status),
        order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
        order.items.length,
      ]),
    ]
      .map(row => {
        // Handle CSV escaping (wrap in quotes if contains comma or quote)
        return row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',');
      })
      .join('\n');

    // Add BOM for UTF-8 to support Arabic characters in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t('admin.orders.exportSuccess') || (isRTL ? 'تم تصدير الطلبات بنجاح' : 'Orders exported successfully'));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t('admin.orders.title')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t('admin.orders.manageOrders')}
                </p>
              </div>
              <Button onClick={handleExportCSV} className="gap-2">
                <Download className="h-4 w-4" />
                {t('admin.orders.export')}
              </Button>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 mb-6 md:grid-cols-2"
            >
              <Input
                placeholder={t('admin.orders.searchOrders')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="all">{t('admin.orders.allStatus')}</option>
                <option value="pending">{t('admin.status.pending')}</option>
                <option value="processing">{t('admin.status.processing')}</option>
                <option value="shipped">{t('admin.status.shipped')}</option>
                <option value="delivered">{t('admin.status.delivered')}</option>
                <option value="cancelled">{t('admin.status.cancelled')}</option>
              </select>
            </motion.div>

            {/* Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    {t('admin.orders.noOrders')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.orderId')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.customer')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.email')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.total')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.status')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.date')}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {t('admin.orders.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium text-foreground">{order.orderNumber}</td>
                          <td className="px-4 py-3 text-foreground">{order.customer.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{order.customer.email}</td>
                          <td className="px-4 py-3 font-bold text-primary">
                            {order.total.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(order.status))}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </td>
                          <td className="px-4 py-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1"
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {t('admin.orders.view')}
                              </span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
    </AdminLayout>
  );
};

export default AdminOrders;