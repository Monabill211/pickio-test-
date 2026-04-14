import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';
import { getProducts } from '@/services/productService';

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      const ids = wishlist.map((item: any) => String(item.id || item));
      setWishlistIds(ids);
    }
    setIsLoading(false);
  }, []);

  // Convert Firebase products to display format and filter by wishlist
  const wishlistItems = allProducts
    .filter(product => wishlistIds.includes(String(product.id)))
    .map(product => ({
      ...product,
      name: {
        ar: product.name_ar || '',
        en: product.name_en || '',
      },
      description: {
        ar: product.description_ar || '',
        en: product.description_en || '',
      },
      image: product.images?.[0] || '',
    }));

  const handleRemoveFromWishlist = (id: string) => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      const updated = wishlist.filter((item: any) => String(item.id) !== String(id));
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setWishlistIds(updated.map((item: any) => String(item.id || item)));
      // Dispatch event to update header count
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => String(item.id) === String(product.id));

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleMoveToCart = (product: any) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product.id);
  };

  if (isLoading || productsLoading) {
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

  if (isLoading || productsLoading) {
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

  if (wishlistItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isRTL ? 'المفضلة فارغة' : 'Your Wishlist is Empty'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 'لم تضف أي منتجات إلى المفضلة بعد' : 'You haven\'t added any items to your wishlist yet'}
            </p>
            <Button onClick={() => navigate('/shop')} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {isRTL ? 'استكشف المنتجات' : 'Explore Products'}
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
            <span className="text-foreground">{isRTL ? 'المفضلة' : 'Wishlist'}</span>
          </motion.div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {isRTL ? 'قائمة المفضلة' : 'My Wishlist'}
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {isRTL ? 'منتج' : 'items'}
            </p>
          </div>

          {/* Wishlist Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted group">
                  <img
                    src={product.image || product.images?.[0] || ''}
                    alt={product.name?.[language] || product.name_ar || product.name_en || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 rtl:right-auto rtl:left-3 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-destructive text-destructive" />
                  </button>

                  {/* Sale Badge */}
                  {product.badge === 'sale' && (
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-destructive text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {isRTL ? 'عرض' : 'Sale'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Name */}
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name?.[language] || (language === 'ar' ? product.name_ar : product.name_en) || 'Product'}
                  </h3>

                  {/* Description */}
                  {(product.description || product.description_ar || product.description_en) && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                      {product.description?.[language] || product.description_ar || product.description_en || ''}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <p className={cn(
                    "text-xs font-medium mb-4",
                    product.inStock ? "text-green-600" : "text-destructive"
                  )}>
                    {product.inStock ? (
                      isRTL ? 'متوفر' : 'In Stock'
                    ) : (
                      isRTL ? 'غير متوفر' : 'Out of Stock'
                    )}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMoveToCart(product)}
                      disabled={!product.inStock}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isRTL ? 'إضافة' : 'Add'}
                      </span>
                    </Button>
                    <Button
                      onClick={() => navigate(`/product/${product.id}`)}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isRTL ? 'عرض' : 'View'}
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue Shopping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button onClick={() => navigate('/shop')} variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {isRTL ? 'متابعة التسوق' : 'Continue Shopping'}
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;