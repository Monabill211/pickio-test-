import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Printer,
  Download,
  MessageSquare,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOrderById, updateOrder, Order } from '@/services/orderService';
import { toast } from 'sonner';
import { downloadInvoiceAsPDF } from '@/utils/invoiceGenerator';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

const AdminOrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL, language } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setNewStatus(orderData.status);
      setTrackingNumber(orderData.trackingNumber || '');
      setLoading(false);
    } else if (!orderLoading) {
      setLoading(false);
    }
  }, [orderData, orderLoading]);

  const statusOptions = [
    { value: 'pending', label: t('admin.status.pending'), color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'processing', label: t('admin.status.processing'), color: 'bg-blue-100 text-blue-800', icon: Package },
    { value: 'shipped', label: t('admin.status.shipped'), color: 'bg-purple-100 text-purple-800', icon: Truck },
    { value: 'delivered', label: t('admin.status.delivered'), color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    { value: 'cancelled', label: t('admin.status.cancelled'), color: 'bg-red-100 text-red-800', icon: AlertCircle },
  ];

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: { ar: string; en: string } } = {
      cash: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
      instapay: { ar: 'InstaPay', en: 'InstaPay' },
      vodafone: { ar: 'محفظة فودافون', en: 'Vodafone Wallet' },
      card: { ar: 'بطاقة ائتمانية', en: 'Credit Card' },
    };
    return labels[method]?.[language] || method;
  };

  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation({
    mutationFn: (updates: Partial<Order>) => updateOrder(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success(t('admin.orderDetails.updateSuccess') || 'Order updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || (t('admin.orderDetails.updateError') || 'Failed to update order'));
    },
  });

  const handleStatusChange = async () => {
    if (!order || !newStatus) return;
    setIsSaving(true);
    try {
      await updateOrderMutation.mutateAsync({ status: newStatus as Order['status'] });
      setOrder({ ...order, status: newStatus as Order['status'] });
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!order || !newNote) return;
    setIsSaving(true);
    try {
      const updatedNotes = (order.notes || '') + '\n' + newNote;
      await updateOrderMutation.mutateAsync({ notes: updatedNotes });
      setOrder({ ...order, notes: updatedNotes });
      setNewNote('');
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!order || !trackingNumber) return;
    setIsSaving(true);
    try {
      await updateOrderMutation.mutateAsync({ trackingNumber });
      setOrder({ ...order, trackingNumber });
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    // Create a printable version of the order
    const printContent = document.getElementById('order-details-content');
    if (!printContent || !order) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html lang="${language}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>${order.orderNumber} - ${t('admin.orderDetails.orderSummary')}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            direction: ${isRTL ? 'rtl' : 'ltr'};
            background: #fff;
            color: #000;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #000;
          }
          .print-header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .print-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .print-section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .print-table th,
          .print-table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: ${isRTL ? 'right' : 'left'};
          }
          .print-table th {
            background: #f5f5f5;
            font-weight: bold;
          }
          .print-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .print-info-item {
            margin-bottom: 10px;
          }
          .print-info-label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${order.orderNumber}</h1>
          <p>${t('admin.orderDetails.placedOn')} ${order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
        </div>
        ${printContent.innerHTML}
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      downloadInvoiceAsPDF(order, language);
      toast.success(t('admin.orderDetails.downloadingInvoice'));
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(t('admin.orderDetails.invoiceError'));
    }
  };

  if (loading || orderLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('admin.orderDetails.orderNotFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('admin.orderDetails.orderNotFoundDesc')}</p>
          <Button onClick={() => navigate('/admin/orders')}>{t('admin.orderDetails.backToOrders')}</Button>
        </Card>
      </AdminLayout>
    );
  }

  const currentStatus = statusOptions.find((s) => s.value === order.status);
  const StatusIcon = currentStatus?.icon || Clock;

  return (
    <AdminLayout>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>
      <div className="space-y-6" id="order-details-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-muted-foreground hover:text-foreground transition-colors no-print"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{order.orderNumber}</h1>
              <p className="text-muted-foreground">
                {t('admin.orderDetails.placedOn')} {order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>
          <div className="flex gap-2 no-print">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                {t('admin.orderDetails.print')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t('admin.orderDetails.invoice')}
              </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="no-print"
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.orderDetails.orderStatus')}</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <StatusIcon className="h-6 w-6" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{t('admin.orderDetails.currentStatus')}</p>
                      <p className="text-lg font-semibold text-foreground">
                        {currentStatus?.label || order.status}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        currentStatus?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {currentStatus?.label}
                    </span>
                  </div>

                  {/* Update Status */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('admin.orderDetails.updateStatus')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleStatusChange}
                        disabled={isSaving || newStatus === order.status}
                      >
                        {t('admin.orderDetails.update')}
                      </Button>
                    </div>
                  </div>

                  {/* Tracking */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('admin.orderDetails.trackingNumber')}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder={t('admin.orderDetails.enterTracking')}
                      />
                      <Button onClick={handleUpdateTracking} disabled={isSaving}>
                        {t('admin.orderDetails.update')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.orderDetails.orderItems')}</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.productId || `item-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.color && `Color: ${item.color}`}
                          {item.color && item.size && ' • '}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {item.quantity} × {item.price.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </p>
                        <p className="text-sm text-primary font-bold">
                          {(item.quantity * item.price).toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="no-print"
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('admin.orderDetails.orderNotes')}
                </h2>
                
                {order.notes && (
                  <div className="mb-4 p-4 rounded-lg bg-muted">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{order.notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={t('admin.orderDetails.addNote')}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={isSaving || !newNote.trim()}
                    className="w-full"
                  >
                    {t('admin.orderDetails.addNoteButton')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 print-section">
                <h3 className="font-bold text-foreground mb-4">{t('admin.orderDetails.customerInformation')}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('admin.orderDetails.name')}</p>
                    <p className="font-semibold text-foreground">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {t('admin.orders.email')}
                    </p>
                    <a
                      href={`mailto:${order.customer.email}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {order.customer.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {t('admin.orderDetails.phone') || 'Phone'}
                    </p>
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {order.customer.phone}
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 print-section">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('admin.orderDetails.deliveryAddress')}
                </h3>
                <address className="not-italic text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                  <p>{order.deliveryAddress.zipCode}</p>
                  <p>{order.deliveryAddress.country}</p>
                </address>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">{t('admin.orderDetails.orderSummary')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('admin.orderDetails.subtotal')}</span>
                    <span>{order.subtotal.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('admin.orderDetails.shipping')}</span>
                    <span>{order.shipping.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('admin.orderDetails.tax')}</span>
                    <span>{order.tax.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-foreground">
                    <span>{t('admin.orders.total')}</span>
                    <span className="text-primary">{order.total.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Payment & Order Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="no-print"
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">{t('admin.orderDetails.additionalInfo')}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">{t('admin.orderDetails.paymentMethod')}</p>
                    <p className="font-semibold text-foreground">{getPaymentMethodLabel(order.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {t('admin.orderDetails.orderDate')}
                    </p>
                    <p className="font-semibold text-foreground">
                      {order.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;