import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// بتاخد اسم الكاتجوري سواء كان string أو object لغات {ar, en}
const getCategoryName = (name: any, language: string): string => {
  if (!name) return '';
  if (typeof name === 'string') return name;
  if (typeof name === 'object') return name[language] || name.ar || name.en || '';
  return '';
};

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Fetch categories from Firebase
  const { data: allCategories = [], isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // هات أول 9 كاتجوريز بس ومتجيبش أي حاجة بعدها
  const categories = (allCategories ?? []).filter(Boolean).slice(0, 9);

  // Fetch products to count per category
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', 'count'],
    queryFn: () => getProducts({ visible: true }),
  });

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              تسوق حسب القسم المكتبي
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              كل حاجة مكتبك محتاجها في مكان واحد
            </motion.p>
          </div>

          {/* Custom nav arrows */}
          {categories.length > 0 && (
            <div className="mt-6 flex gap-3 md:mt-0">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                aria-label="Previous"
              >
                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                aria-label="Next"
              >
                {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Categories Slider */}
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : categoriesError ? (
          <div className="text-center py-12 text-muted-foreground">
            {isRTL ? 'حصل خطأ في تحميل الأقسام' : 'Error loading categories'}
          </div>
        ) : categories.length > 0 ? (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            dir={isRTL ? 'rtl' : 'ltr'}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="!overflow-visible"
          >
            {categories.map((category) => {
              const productCount = allProducts.filter(
                (p) => p.category === category.id || p.categoryId === category.id
              ).length;

              const categoryName = getCategoryName(category.name, language);

              return (
                <SwiperSlide key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className="group relative block w-full overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image || '/placeholder.svg'}
                        alt={categoryName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      <h3 className="text-lg font-semibold text-background md:text-xl">
                        {categoryName}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-background/80">
                        <span>
                          {productCount} {isRTL ? 'منتج' : 'Products'}
                        </span>
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {isRTL ? 'لا توجد فئات' : 'No categories available'}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;