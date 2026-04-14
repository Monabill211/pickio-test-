import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, MapPin, Phone, Mail, User, CheckCircle2, Loader2, MessageCircle, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import { addOrder } from '@/services/orderService';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface CartItem {
  id: string;
  name: { [key: string]: string };
  price: number;
  image: string;
  quantity: number;
  color?: string;
}

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const queryClient = useQueryClient();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: isRTL ? 'مصر' : 'Egypt',
    paymentMethod: 'instapay',
    notes: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error(isRTL ? 'السلة فارغة' : 'Cart is empty');
      navigate('/cart');
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.street || !formData.city || !formData.zipCode) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map(item => {
        let productName = 'Product';
        
        if (typeof item.name === 'object' && item.name !== null) {
          // Handle object with language keys
          productName = item.name[language] || item.name.ar || item.name.en || 'Product';
        } else if (typeof item.name === 'string') {
          // Handle simple string
          productName = item.name;
        }
        
        return {
          productId: item.id,
          productName,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          image: item.image,
        };
      });

      const orderData: any = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        status: 'pending' as const,
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state || '',
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
      };

      // Only add optional fields if they have values
      if (user?.uid) {
        orderData.customerId = user.uid;
      }
      if (formData.notes && formData.notes.trim()) {
        orderData.notes = formData.notes.trim();
      }

      const orderId = await addOrder(orderData);
      
      // Invalidate orders queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success(isRTL ? 'تم إرسال الطلب بنجاح!' : 'Order placed successfully!', {
        duration: 5000,
        description: isRTL 
          ? 'سيتم التواصل معك قريباً لتأكيد الطلب' 
          : 'We will contact you soon to confirm your order',
      });
      
      // Navigate to order confirmation or profile
      setTimeout(() => {
        navigate(`/profile?order=${orderId}`);
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.message || error?.code || 'Unknown error';
      console.error('Order error:', error);
      toast.error(
        isRTL 
          ? `حدث خطأ أثناء إرسال الطلب: ${errorMessage}` 
          : `Error placing order: ${errorMessage}`,
        {
          duration: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <CheckCircle2 className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isRTL ? 'السلة فارغة' : 'Your Cart is Empty'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'أضف منتجات إلى السلة قبل المتابعة' : 'Add items to your cart before checkout'}
            </p>
            <Button onClick={() => navigate('/shop')} className="gap-2">
              {isRTL ? 'استكمل التسوق' : 'Continue Shopping'}
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {isRTL ? 'الدفع' : 'Checkout'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {isRTL ? 'معلومات العميل' : 'Customer Information'}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="fullName">{isRTL ? 'الاسم الكامل' : 'Full Name'} *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email'} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{isRTL ? 'رقم الهاتف' : 'Phone'} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {isRTL ? 'عنوان التوصيل' : 'Delivery Address'}
                  </h2>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="street">{isRTL ? 'العنوان' : 'Street Address'} *</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">{isRTL ? 'المدينة' : 'City'} *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">{isRTL ? 'المحافظة' : 'State'}</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="zipCode">{isRTL ? 'الرمز البريدي' : 'Zip Code'} *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">{isRTL ? 'الدولة' : 'Country'} *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="cursor-pointer flex-1">
                          {isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="instapay" id="instapay" />
                        <Label htmlFor="instapay" className="cursor-pointer flex-1">
                          {isRTL ? 'InstaPay' : 'InstaPay'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="vodafone" id="vodafone" />
                        <Label htmlFor="vodafone" className="cursor-pointer flex-1">
                          {isRTL ? 'محفظة فودافون' : 'Vodafone Wallet'}
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Payment Description */}
                  {(formData.paymentMethod === 'instapay' || formData.paymentMethod === 'vodafone') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-2">
                            {isRTL ? 'كيفية الدفع عبر المحفظة الإلكترونية' : 'How to Pay via Wallet'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {isRTL 
                              ? 'بعد تأكيد الطلب، سيتم إرسال تفاصيل الدفع إليك عبر WhatsApp. يرجى التواصل معنا لإتمام عملية الدفع.'
                              : 'After confirming your order, payment details will be sent to you via WhatsApp. Please contact us to complete the payment process.'}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                            onClick={() => {
                              const whatsappNumber = '201016434958';
                              const message = isRTL
                                ? `مرحباً، أريد إتمام عملية الدفع للطلب عبر ${formData.paymentMethod === 'instapay' ? 'InstaPay' : 'محفظة فودافون'}`
                                : `Hello, I want to complete payment for my order via ${formData.paymentMethod === 'instapay' ? 'InstaPay' : 'Vodafone Wallet'}`;
                              window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                            {isRTL ? 'تواصل معنا عبر WhatsApp' : 'Contact us via WhatsApp'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <Label htmlFor="notes">{isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-2 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder={isRTL ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                  />
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-24"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground line-clamp-1">
                          {item.name[language]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'الكمية' : 'Qty'}: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'الشحن' : 'Shipping'}</span>
                    <span className={cn(
                      "font-medium",
                      shipping === 0 ? "text-green-600" : "text-foreground"
                    )}>
                      {shipping === 0 ? (isRTL ? 'مجاني' : 'Free') : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'الضريبة' : 'Tax'}</span>
                    <span className="text-foreground font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span className="text-foreground">{isRTL ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-primary text-xl">{formatPrice(total)}</span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mb-3 gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isRTL ? 'جاري العمل...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {isRTL ? 'تأكيد الطلب' : 'Place Order'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/cart')}
                >
                  {isRTL ? 'العودة إلى السلة' : 'Back to Cart'}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
