import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductById, getProducts } from '@/services/productService';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch product from Firebase
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? getProductById(id) : null,
    enabled: !!id,
  });

  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert Firebase product to display format (before hooks)
  const displayProduct = product ? {
    id: product.id,
    name: {
      ar: product.name_ar,
      en: product.name_en,
    },
    description: {
      ar: product.description_ar,
      en: product.description_en,
    },
    price: product.price,
    originalPrice: product.originalPrice || product.discountPrice,
    category: product.category || product.categoryId || '',
    image: product.images?.[0] || '',
    images: product.images || [],
    inStock: product.inStock,
    badge: product.badge,
    colors: product.colors || [],
    materials: product.materials || [],
  } : null;

  // Fetch related products (must be before early returns)
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['relatedProducts', displayProduct?.category, id],
    queryFn: async () => {
      if (!displayProduct?.category) return [];
      const allProducts = await getProducts({ visible: true });
      return allProducts
        .filter(p => 
          (p.category === displayProduct.category || p.categoryId === displayProduct.category) &&
          p.id !== displayProduct.id
        )
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          name: { ar: p.name_ar, en: p.name_en },
          description: { ar: p.description_ar, en: p.description_en },
          price: p.price,
          originalPrice: p.originalPrice || p.discountPrice,
          category: p.category || p.categoryId || '',
          image: p.images?.[0] || '',
          images: p.images,
          inStock: p.inStock,
          badge: p.badge,
          colors: p.colors,
          materials: p.materials,
        }));
    },
    enabled: !!displayProduct?.category,
  });

  // Set default color when product loads
  React.useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Early returns after all hooks
  if (isLoading) {
    return (
      
      <div className="flex min-h-screen flex-col">
 {displayProduct && (
  <Helmet>
    <title>
      {displayProduct.name[language]} | أثاث مكتبي فاخر
    </title>

    <meta
      name="description"
      content={(displayProduct.description[language] || "").substring(0, 150)}
    />

    <meta property="og:title" content={displayProduct.name[language]} />
    <meta
      property="og:description"
      content={(displayProduct.description[language] || "").substring(0, 150)}
    />
    <meta property="og:image" content={displayProduct.image} />
  </Helmet>
)}
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || !displayProduct) {
    return (
      <div className="flex min-h-screen flex-col">
        

        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {isRTL ? 'المنتج غير موجود' : 'Product Not Found'}
            </h1>
            <p className="text-muted-foreground mb-2">
              {isRTL ? 'عذراً، لم نتمكن من العثور على هذا المنتج' : 'Sorry, we couldn\'t find this product'}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              ID: {id}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/shop')} variant="default">
                {isRTL ? 'العودة للمتجر' : 'Back to Shop'}
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: displayProduct.id,
      name: displayProduct.name,
      price: displayProduct.price,
      image: displayProduct.image,
      color: selectedColor,
      quantity: quantity,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => 
      String(item.id) === String(displayProduct.id) && item.color === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event to update header count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show toast notification
    toast.success(`${quantity} x ${displayProduct.name[language]} ${isRTL ? 'تمت إضافته إلى السلة' : 'added to cart'}`);
  };

  const handleToggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.findIndex((item: any) => String(item.id) === String(displayProduct.id));

    if (index > -1) {
      wishlist.splice(index, 1);
      setIsWishlisted(false);
    } else {
      wishlist.push({ id: displayProduct.id, name: displayProduct.name });
      setIsWishlisted(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Dispatch event to update header count
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    // Show toast notification
    if (isWishlisted) {
      toast.info(`${displayProduct.name[language]} ${isRTL ? 'تمت إزالته من المفضلة' : 'removed from wishlist'}`);
    } else {
      toast.success(`${displayProduct.name[language]} ${isRTL ? 'تمت إضافته إلى المفضلة' : 'added to wishlist'}`);
    }
  };

  const getColorValue = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'beige': '#D4B896',
      'gray': '#9CA3AF',
      'brown': '#8B5A2B',
      'navy': '#1E3A5F',
      'terracotta': '#C86B4B',
      'olive': '#6B8E23',
      'white marble': '#F5F5F5',
      'black marble': '#2D2D2D',
      'natural oak': '#C4A77D',
      'walnut': '#5C4033',
    };

    return colorMap[color.toLowerCase()] || '#E5E5E5';
  };

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
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">
              {t('common.home')}
            </button>
            <span>/</span>
            <button onClick={() => navigate('/shop')} className="hover:text-foreground transition-colors">
              {t('common.shop')}
            </button>
            <span>/</span>
            <span className="text-foreground">{displayProduct.name[language]}</span>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-muted aspect-square">
                <img
                  src={displayProduct.images?.[currentImageIndex] || displayProduct.image || '/placeholder.svg'}
                  alt={displayProduct.name[language]}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />

                {/* Badge */}
                {displayProduct.badge && (
                  <Badge
                    variant={displayProduct.badge === 'sale' ? 'destructive' : 'default'}
                    className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10"
                  >
                    {displayProduct.badge === 'sale' ? t('common.sale') : displayProduct.badge}
                  </Badge>
                )}

                {/* Image Navigation */}
                {displayProduct.images && displayProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev - 1 + displayProduct.images.length) % displayProduct.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background transition-colors rtl:left-auto rtl:right-4"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev + 1) % displayProduct.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background transition-colors rtl:right-auto rtl:left-4"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {displayProduct.images && displayProduct.images.length > 0 && (
                <div className="flex gap-2">
                  {displayProduct.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-20 w-20 rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all",
                        currentImageIndex === idx ? "border-primary" : "border-transparent hover:border-muted-foreground"
                      )}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img
                        src={img}
                        alt={product.name_ar || product.name_en}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Title & Rating */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {displayProduct.name[language]}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating?.toFixed(1)} ({isRTL ? 'تقييمات' : 'Reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(displayProduct.originalPrice)}
                </span>
                {product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant="destructive">
                      {displayProduct.originalPrice ? Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.price) * 100) : 0}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {displayProduct.description[language]}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={cn(
                  "font-medium text-sm",
                  displayProduct.inStock ? "text-green-600" : "text-destructive"
                )}>
                  {displayProduct.inStock ? t('common.inStock') : isRTL? ' ينتج حسب الطلب ': 'Made to order'}
                </p>
              </div>

              {/* Color Selection */}
              {displayProduct.colors && displayProduct.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-foreground">
                    {isRTL ? 'اللون' : 'Color'}
                  </h3>
                  <div className="flex gap-3 items-center">
                    {displayProduct.colors.map(color => {
                      // Accept hex, rgb, or named color
                      let colorValue = color;
                      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                        colorValue = color;
                      } else if (/^[A-Za-z]+$/.test(color)) {
                        colorValue = getColorValue(color);
                      } else {
                        colorValue = '#E5E5E5'; // fallback gray
                      }
                      return (
                        <label key={color} className="flex flex-col items-center cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={color}
                            checked={selectedColor === color}
                            onChange={() => setSelectedColor(color)}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                              selectedColor === color
                                ? "border-primary scale-110 ring-2 ring-primary ring-offset-2"
                                : "border-border hover:border-primary"
                            )}
                            style={{ backgroundColor: colorValue }}
                            title={color}
                            aria-label={`Select ${color}`}
                          />
                          {/* <span className="mt-1 text-xs text-muted-foreground">{color}</span> */}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="mb-8 flex gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('common.addToCart')}</span>
                  <span className="sm:hidden">{isRTL ? 'إضافة' : 'Add'}</span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={cn(
                    "transition-all hover:bg-red-300",
                    isWishlisted && "bg-primary/10 text-primary border-primary "
                  )}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isWishlisted && "fill-current"
                    )}
                  />
                </Button>

                <Button size="lg" variant="outline" aria-label="Share product" className='hover:bg-red-300'>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid gap-4 md:grid-cols-2 rounded-lg border border-border p-4 bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">SKU</p>
                  <p className="font-semibold text-foreground">
                    {product.name_ar ? (isRTL ? product.name_ar : product.name_en) : '-'}
                    </p>  
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    {isRTL ? 'الفئة' : 'Category'}
                  </p>
                  <p className="font-semibold text-foreground capitalize">
                    {/* Show category name if available */}
                    {product.categoryId ? (isRTL ? product.categoryId || product.categoryId : product.categoryId || product.categoryId) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    {isRTL ? 'الكمية المتاحة' : 'Stock Quantity'}
                  </p>
                  <p className="font-semibold text-foreground">
                    {product.stock ?? displayProduct.inStock ?? '-'}
                  </p>
                </div>
                {displayProduct.materials && displayProduct.materials.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {isRTL ? 'المادة' : 'Material'}
                    </p>
                    <p className="font-semibold text-foreground">
                      {displayProduct.materials.join(', ')}
                    </p>
                  </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {isRTL ? 'المقاسات' : 'Sizes'}
                    </p>
                    <p className="font-semibold text-foreground">
                      {product.sizes.join(' / ')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">
                  {isRTL ? 'الوصف' : 'Description'}
                </TabsTrigger>
                <TabsTrigger value="details">
                  {isRTL ? 'التفاصيل' : 'Details'}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  {isRTL ? 'التقييمات' : 'Reviews'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="rounded-lg border border-border p-6 mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {displayProduct.description[language]}
                </p>
              </TabsContent>

              <TabsContent value="details" className="rounded-lg border border-border p-6 mt-4">
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="font-semibold text-foreground min-w-32">
                      {isRTL ? 'المادة' : 'Material'}
                    </span>
                    <span className="text-muted-foreground">Premium Wood</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-semibold text-foreground min-w-32">
                      {isRTL ? 'الأبعاد' : 'Dimensions'}
                    </span>
                    <span className="text-muted-foreground">Varies by model</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-semibold text-foreground min-w-32">
                      {isRTL ? 'الضمان' : 'Warranty'}
                    </span>
                    <span className="text-muted-foreground">2 Years</span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="reviews" className="rounded-lg border border-border p-6 mt-4">
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد تقييمات حالياً' : 'No reviews yet'}
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 pb-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 'منتجات ذات صلة' : 'Related Products'}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relProduct, index) => (
                  <motion.button
                    key={relProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => navigate(`/product/${relProduct.id}`)}
                    className="text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-3 group">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name[language]}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {relProduct.name[language]}
                    </h3>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(relProduct.originalPrice)}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default ProductDetail;