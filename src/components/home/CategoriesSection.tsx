import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories } from '@/services/categoryService';
import { getProducts } from '@/services/productService';
import { cn } from '@/lib/utils';

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Fetch categories from Firebase
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // Fetch products to count per category
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', 'count'],
    queryFn: () => getProducts({ visible: true }),
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground md:text-4xl"
          >
            {t('categories.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            {t('categories.subtitle')}
          </motion.p>
        </div>

        {/* Categories Grid */}
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {categories.map((category, index) => {
              const productCount = allProducts.filter(p => 
                p.category === category.id || p.categoryId === category.id
              ).length;
              return (
                <motion.div key={category.id} variants={item}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={cn(
                      "group relative block w-full overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-lg",
                      index === 0 && "sm:col-span-2 lg:col-span-1"
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image || '/placeholder.svg'}
                        alt={category.name[language]}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      <h3 className="text-lg font-semibold text-background md:text-xl">
                        {category.name[language]}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-background/80">
                        <span>
                          {productCount} {isRTL ? 'منتج' : 'Products'}
                        </span>
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
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
