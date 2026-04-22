import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFeaturedProducts } from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';

const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Fetch featured products from Firebase
  const { data: featuredProducts = [], isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getFeaturedProducts(6),
  });


  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              {t('featured.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-muted-foreground"
            >
              {t('featured.subtitle')}
            </motion.p>
          </div>
          <Button asChild variant="outline" className="gap-2 hover:bg-red-200">
            <Link to="/shop">
              {t('common.viewAll')}
              <ArrowIcon className="h-4 w-4 " />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => {
              // Convert Firebase product to ProductCard format
              const cardProduct = {
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
                images: product.images,
                inStock: product.inStock,
                badge: product.badge,
                colors: product.colors,
                materials: product.materials,
              };
              return (
                <ProductCard key={product.id} product={cardProduct} index={index} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {isRTL ? 'لا توجد منتجات مميزة' : 'No featured products available'}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
