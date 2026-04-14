import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/data/products';
import { getCategories, subscribeToCategories } from '@/services/categoryService';

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const queryClient = useQueryClient();

  // Fetch categories from Firebase with React Query
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Subscribe to real-time updates
  React.useEffect(() => {
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      // Update the query cache with new data from real-time subscription
      queryClient.setQueryData(['categories'], updatedCategories);
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
            >
              {t('categories.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {t('categories.subtitle')}
            </motion.p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'جاري تحميل الفئات...' : 'Loading categories...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive font-medium mb-2">
                {isRTL ? 'حدث خطأ أثناء تحميل الفئات' : 'Error loading categories'}
              </p>
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoading && !isError && categories.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {categories.map((category, index) => (
              <motion.div key={category.id} variants={item}>
                <Link
                  to={`/shop?category=${category.id}`}
                  className="group relative block overflow-hidden rounded-3xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name[language]}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-background md:text-3xl">
                      {category.name[language]}
                    </h2>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-background/80">
                        {category.productCount} {isRTL ? 'منتج' : 'Products'}
                      </span>
                      <ArrowIcon className="h-5 w-5 text-background transition-transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2" />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground text-lg">
                {isRTL ? 'لا توجد فئات متاحة حالياً' : 'No categories available at the moment'}
              </p>
            </div>
          )}

          {/* Custom Design CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 overflow-hidden rounded-3xl bg-secondary p-8 text-center md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {isRTL ? 'تصميم مخصص؟' : 'Custom Design?'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {isRTL
                ? 'لم تجد ما تبحث عنه؟ فريقنا من المصممين المحترفين جاهز لتحويل أفكارك إلى واقع. تواصل معنا لتصميم قطعة أثاث فريدة تناسب ذوقك.'
                : "Couldn't find what you're looking for? Our team of professional designers is ready to turn your ideas into reality. Contact us to design a unique piece of furniture that suits your taste."}
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
