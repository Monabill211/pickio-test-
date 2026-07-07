'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Static furniture categories - placeholder images via loremflickr (replace with real product photos later)
const categories = [
  {
    id: 'bedroom',
    name: 'غرف نوم',
    image: 'https://loremflickr.com/640/640/bedroom,furniture',
    count: 12,
  },
  {
    id: 'dining',
    name: 'غرف سفرة',
    image: 'https://loremflickr.com/640/640/dining,table',
    count: 8,
  },
  {
    id: 'living',
    name: 'انتريهات',
    image: 'https://loremflickr.com/640/640/sofa,livingroom',
    count: 15,
  },
  {
    id: 'lighting',
    name: 'إضاءة',
    image: 'https://loremflickr.com/640/640/lamp,lighting',
    count: 20,
  },
  {
    id: 'kitchen',
    name: 'مطابخ',
    image: 'https://loremflickr.com/640/640/kitchen,cabinets',
    count: 6,
  },
  {
    id: 'office',
    name: 'مكاتب',
    image: 'https://loremflickr.com/640/640/office,desk',
    count: 9,
  },
  {
    id: 'decor',
    name: 'ديكورات',
    image: 'https://loremflickr.com/640/640/homedecor,vase',
    count: 25,
  },
];

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

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

              تسوق حسب القسم المنزلي
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ marginTop: '12px' }}
              className="text-muted-foreground"
            >
              كل حاجة بيتك محتاجها في مكان واحد
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
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation]}
          dir="rtl"
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="!overflow-visible"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                className="group relative block w-full overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
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
                    {category.name}
                  </h3>
                  <div
                    className="flex items-center text-sm text-white/80"
                    style={{ gap: '8px', marginTop: '8px' }}
                  >
                    <span>{category.count} منتج</span>
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategoriesSection;