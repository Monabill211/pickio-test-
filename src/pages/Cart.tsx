import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import { getButtonRowClass, cnRtl } from '@/utils/rtlHelper';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  name: { [key: string]: string };
  price: number;
  image: string;
  quantity: number;
  color?: string;
}

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch event to update header count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    updateCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    updateCart(updated);
  };

  const handleApplyPromo = () => {
    // Simple promo code validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      setPromoCode('');
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      setPromoCode('');
    } else {
      alert(isRTL ? 'كود غير صحيح' : 'Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = (subtotal - discountAmount) * 0.15;
  const total = subtotal - discountAmount + shipping + tax;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
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
            <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isRTL ? 'سلة التسوق فارغة' : 'Your Cart is Empty'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'لم تضف أي منتجات إلى سلة التسوق بعد' : 'You haven\'t added any items to your cart yet'}
            </p>
            <Button onClick={() => navigate('/shop')} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {isRTL ? 'استكمل التسوق' : 'Continue Shopping'}
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <button onClick={() => navigate('/')} className="hover:text-foreground">
              {t('common.home')}
            </button>
            <span>/</span>
            <span className="text-foreground">{isRTL ? 'سلة التسوق' : 'Cart'}</span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {isRTL ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>

        <div className={cn('grid gap-8', isRTL ? 'lg:grid-cols-3 lg:direction-rtl' : 'lg:grid-cols-3')}>
          {/* Cart Items */}
          <div className={cn('lg:col-span-2 space-y-4', isRTL ? 'lg:order-2' : 'lg:order-1')}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn('rounded-lg border border-border bg-card p-4 flex gap-4', isRTL ? 'flex-row-reverse' : 'flex-row')}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className={cn('flex items-start justify-between gap-4 mb-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h3 className={cn('font-semibold text-foreground line-clamp-1', isRTL ? 'text-right' : 'text-left')}>
                          {item.name[language]}
                        </h3>
                        {item.color && (
                          <p className="text-sm text-muted-foreground">
                            {isRTL ? 'اللون' : 'Color'}: {item.color}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-primary whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                      <div className={cn('flex items-center border border-border rounded-lg', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 font-semibold min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-24"
            >
              <h2 className="text-xl font-bold text-foreground mb-6">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className={cn('block text-sm font-medium text-foreground mb-2', isRTL ? 'text-right' : 'text-left')}>
                  {isRTL ? 'كود الخصم' : 'Promo Code'}
                </label>
                <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <Input
                    placeholder={isRTL ? 'أدخل الكود' : 'Enter code'}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button
                    onClick={handleApplyPromo}
                    variant="outline"
                    className="gap-2"
                    disabled={!promoCode}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className={cn('flex justify-between text-sm', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <span className={cn('text-muted-foreground', isRTL ? 'text-left' : 'text-right')}>
                    {isRTL ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className={cn('text-foreground font-medium', isRTL ? 'text-left' : 'text-right')}>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className={cn('flex justify-between text-sm text-green-600', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                    <span>{isRTL ? 'الخصم' : 'Discount'} ({discount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className={cn('flex justify-between text-sm', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <span className={cn('text-muted-foreground', isRTL ? 'text-left' : 'text-right')}>
                    {isRTL ? 'الشحن' : 'Shipping'}
                  </span>
                  <span className={cn(
                    "font-medium",
                    shipping === 0 ? "text-green-600" : "text-foreground"
                  )}>
                    {shipping === 0 ? (
                      <span className="text-green-600">{isRTL ? 'مجاني' : 'Free'}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className={cn('flex justify-between text-sm', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <span className={cn('text-muted-foreground', isRTL ? 'text-left' : 'text-right')}>
                    {isRTL ? 'الضريبة' : 'Tax'}
                  </span>
                  <span className={cn('text-foreground font-medium', isRTL ? 'text-left' : 'text-right')}>{formatPrice(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className={cn('flex justify-between text-lg font-bold mb-6', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                <span className={cn('text-foreground', isRTL ? 'text-left' : 'text-right')}>{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className={cn('text-primary text-xl', isRTL ? 'text-left' : 'text-right')}>{formatPrice(total)}</span>
              </div>

              {/* Checkout Button */}
              <Button 
                className={cn('w-full mb-3 gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {isRTL ? 'متابعة الدفع' : 'Proceed to Checkout'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/shop')}
              >
                {isRTL ? 'استكمل التسوق' : 'Continue Shopping'}
              </Button>

              {/* Free Shipping Info */}
              {shipping > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    {isRTL 
                      ? `أضف ${formatPrice(500 - subtotal)} لتحصل على شحن مجاني`
                      : `Add ${formatPrice(500 - subtotal)} for free shipping`
                    }
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;