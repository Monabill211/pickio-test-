import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFeaturedProducts } from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const DinerProducts: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const swiperRef = useRef<any>(null);

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
              {/* {t('featured.title')} */}
               غرف سفرة
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

        {/* Products Slider */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="relative">
            {/* Side arrow - previous */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted disabled:opacity-40"
              style={{ left: '-22px' }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Side arrow - next */}
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-muted disabled:opacity-40"
              style={{ right: '-22px' }}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
     
    <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation]}
              dir={isRTL ? 'rtl' : 'ltr'}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="!overflow-visible md:!overflow-hidden"
            >
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
                  <SwiperSlide key={product.id}>
                    <ProductCard product={cardProduct} index={index} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
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

export default DinerProducts;