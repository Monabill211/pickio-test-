'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Firebase
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  name: string | { ar?: string; en?: string };
  image: string;
  count: number;
}

// بتاخد اسم الكاتجوري سواء كان string أو object لغات {ar, en}
const getCategoryName = (name: Category['name']): string => {
  if (!name) return '';
  if (typeof name === 'string') return name;
  return name.ar || name.en || '';
};

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);
  const { isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);

        const allCategories: Category[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, 'id'>),
        }));

        // بنبدأ من الكاتجوري العاشرة (index 9) ونستبعد أول 9
        setCategories(allCategories.slice(9));
      } catch (error) {
        console.error('خطأ في جلب الكاتجوريز:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', 'count'],
    queryFn: () => getProducts({ visible: true }),
  });
  if (loading) {
    return (
      <section style={{ paddingBlock: 'clamp(48px, 8vw, 96px)' }} dir="rtl">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          جاري تحميل الأقسام...
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section style={{ paddingBlock: 'clamp(48px, 8vw, 96px)' }} dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-right"
          style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              {isRTL ? 'تسوق حسب القسم المنزلي' : 'Shop by Home Category'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ marginTop: '12px' }}
              className="text-muted-foreground"
            >
              {isRTL ? 'كل حاجة بيتك محتاجها في مكان واحد' : 'All your home essentials in one place'}
            </motion.p>
          </div>

          {/* Custom nav arrows */}
          <div className="flex" style={{ gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              aria-label="السابق"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              aria-label="التالي"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Slider */}
       <Swiper
  key={isRTL ? 'rtl' : 'ltr'}
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
            const categoryName = getCategoryName(category.name);
 const productCount = allProducts.filter(p => 
                p.category === category.id || p.categoryId === category.id
              ).length;
            return (
              <SwiperSlide key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="group relative block w-full overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={categoryName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-0"
                    style={{ padding: 'clamp(12px, 3vw, 24px)' }}
                  >
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                        {category.name[language]}
                    </h3>
                    <div
                      className="flex items-center text-sm text-white/80"
                      style={{ gap: '8px', marginTop: '8px' }}
                    >
                          {productCount} {isRTL ? 'منتج' : 'Products'}
                      <ArrowIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default CategoriesSection;