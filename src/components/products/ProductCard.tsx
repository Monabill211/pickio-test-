import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/utils/formatPrice';
import { getProductName } from '@/utils/safeProductAccess';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  badge?: 'new' | 'sale' | 'bestseller';
  colors?: string[];
  materials?: string[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => String(item.id) === String(product.id));
    setIsWishlisted(isInWishlist);
  }, [product.id]);

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'sale':
        return 'destructive';
      case 'new':
        return 'default';
      case 'bestseller':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'sale':
        return t('common.sale');
      case 'new':
        return t('common.newArrival');
      case 'bestseller':
        return t('common.bestSeller');
      default:
        return badge;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.inStock) {
      return;
    }

    setIsAddingToCart(true);

    // Dispatch cart action (assuming you have a cart context/store)
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    // Store in localStorage or dispatch to your cart state management
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event to update header count
    window.dispatchEvent(new Event('cartUpdated'));

    // Show toast notification
    const productName = getProductName(product.name, language as 'ar' | 'en', 'Product');
    toast.success(`${productName} ${isRTL ? 'تمت إضافته إلى السلة' : 'added to cart'}`);
    
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.findIndex((item: any) => item.id === product.id);

    if (index > -1) {
      wishlist.splice(index, 1);
      setIsWishlisted(false);
    } else {
      wishlist.push({ id: product.id, name: product.name });
      setIsWishlisted(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Dispatch event to update header count
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    // Show toast notification
    const productName = getProductName(product.name, language as 'ar' | 'en', 'Product');
    if (index > -1) {
      toast.info(`${productName} ${isRTL ? 'تمت إزالته من المفضلة' : 'removed from wishlist'}`);
    } else {
      toast.success(`${productName} ${isRTL ? 'تمت إضافته إلى المفضلة' : 'added to wishlist'}`);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-card transition-shadow duration-300 hover:shadow-product">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name[language]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <Badge
              variant={getBadgeVariant(product.badge)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10"
            >
              {getBadgeLabel(product.badge)}
            </Badge>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10">
              <span className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
                {t('common.outOfStock')}
              </span>
            </div>
          )}

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-4 bottom-4 flex gap-2"
          >
            <Button
              size="sm"
              className="flex-1 gap-2"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('common.addToCart')}
              </span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleToggleWishlist}
              aria-label="Add to wishlist"
              className={cn(
                "transition-colors",
                isWishlisted && "bg-primary/20 text-primary"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-all",
                  isWishlisted && "fill-current"
                )}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleViewDetails}
              aria-label="View product details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name[language]}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description[language]}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-lg",
                      i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-muted"
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating?.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs font-semibold text-destructive">
                -
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                %
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 flex gap-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="h-4 w-4 rounded-full border border-border cursor-pointer transition-all hover:border-primary"
                  style={{
                    backgroundColor: getColorValue(color),
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Stock Status */}
          {product.inStock && (
            <p className="mt-2 text-xs font-medium text-green-600">
              {t('common.inStock')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
