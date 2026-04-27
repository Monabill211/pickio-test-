import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { cn } from '@/lib/utils';
import { matchesSearch } from '@/utils/searchUtils';
import { formatPrice } from '@/utils/formatPrice';
import type { Product } from '@/services/productService';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [itemsToShow, setItemsToShow] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories from Firebase first (needed for useEffect)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // Fetch products from Firebase
  const { data: allProducts = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products', 'visible'],
    queryFn: () => getProducts({ visible: true }),
  });

  // Calculate dynamic price range from products
  const priceRangeBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 50000 };
    
    const prices = allProducts.map(p => p.price).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 50000 };
    
    const min = Math.floor(Math.min(...prices) / 1000) * 1000; // Round down to nearest 1000
    const max = Math.ceil(Math.max(...prices) / 1000) * 1000; // Round up to nearest 1000
    
    return { min: Math.max(0, min), max: Math.max(10000, max) };
  }, [allProducts]);

  // Initialize price range when products load
  useEffect(() => {
    if (priceRangeBounds.max > 0 && priceRange[1] === 50000) {
      setPriceRange([priceRangeBounds.min, priceRangeBounds.max]);
    }
  }, [priceRangeBounds, priceRange]);


  // Get category and search from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Extract unique colors from products
  const colors = useMemo(() => {
    const colorSet = new Set<string>();
    allProducts.forEach(product => {
      product.colors?.forEach(color => colorSet.add(color));
    });
    return Array.from(colorSet).slice(0, 6);
  }, [allProducts]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by search query (improved Arabic support)
    if (searchQuery.trim()) {
      products = products.filter(product => {
        return matchesSearch(product.name_ar || '', searchQuery) ||
               matchesSearch(product.name_en || '', searchQuery) ||
               matchesSearch(product.description_ar || '', searchQuery) ||
               matchesSearch(product.description_en || '', searchQuery);
      });
    }

    // Filter by categories (check both category and categoryId)
    if (selectedCategories.length > 0) {
      products = products.filter(product => {
        const productCategory = String(product.category || '').trim();
        const productCategoryId = String(product.categoryId || '').trim();
        
        const matches = selectedCategories.some(selectedId => {
          const selected = String(selectedId).trim();
          return selected === productCategory || selected === productCategoryId;
        });
        
        return matches;
      });
    }

    // Filter by price range
    products = products.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by colors
    if (selectedColors.length > 0) {
      products = products.filter(product =>
        product.colors?.some(color => selectedColors.includes(color))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // Sort by badge or stock for popularity
        products.sort((a, b) => {
          const aBadge = a.badge === 'bestseller' ? 3 : a.badge === 'sale' ? 2 : a.badge === 'new' ? 1 : 0;
          const bBadge = b.badge === 'bestseller' ? 3 : b.badge === 'sale' ? 2 : b.badge === 'new' ? 1 : 0;
          return bBadge - aBadge;
        });
        break;
      case 'newest':
      default:
        products.sort((a, b) => {
          const aDate = a.createdAt?.getTime() || 0;
          const bDate = b.createdAt?.getTime() || 0;
          return bDate - aDate;
        });
    }

    return products;
  }, [allProducts, selectedCategories, priceRange, selectedColors, sortBy, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, itemsToShow);

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 12);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange([priceRangeBounds.min, priceRangeBounds.max]);
    setSortBy('newest');
    setSearchQuery('');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground">
          {t('common.categories')}
        </h3>
        <div className="space-y-3">
          {categories.map(category => {
            const productCount = allProducts.filter(p => 
              p.category === category.id || p.categoryId === category.id
            ).length;
            return (
              <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <span className="text-sm text-muted-foreground">
                  {category.name[language]} ({productCount})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground">
          {isRTL ? 'نطاق السعر' : 'Price Range'}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={priceRangeBounds.min}
          max={priceRangeBounds.max}
          step={Math.max(100, Math.floor(priceRangeBounds.max / 100))}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground">
          {isRTL ? 'الألوان' : 'Colors'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                selectedColors.includes(color)
                  ? "border-primary scale-110"
                  : "border-border"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1">
          {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
        </Button>
        <Button variant="outline" className='hover:bg-red-200' onClick={resetFilters}>
          {isRTL ? 'إعادة تعيين' : 'Reset'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {searchQuery ? (
                isRTL ? `نتائج البحث عن "${searchQuery}"` : `Search results for "${searchQuery}"`
              ) : (
                t('common.shop')
              )}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {searchQuery ? (
                isRTL 
                  ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'منتج' : 'منتجات'}`
                  : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} found`
              ) : (
                isRTL ? 'اكتشف مجموعتنا الكاملة من الأثاث الفاخر' : 'Discover our complete collection of luxury furniture'
              )}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  navigate('/shop');
                }}
              >
                {isRTL ? 'مسح البحث' : 'Clear Search'}
              </Button>
            )}
          </motion.div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24 rounded-2xl bg-card p-6 shadow-card"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    {isRTL ? 'الفلاتر' : 'Filters'}
                  </h2>
                  {(selectedCategories.length > 0 || selectedColors.length > 0 || 
                    priceRange[0] !== priceRangeBounds.min || priceRange[1] !== priceRangeBounds.max || searchQuery.trim()) && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-primary hover:underline"
                    >
                      {isRTL ? 'مسح' : 'Clear'}
                    </button>
                  )}
                </div>
                <FilterContent />
              </motion.div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="gap-2 lg:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                        {isRTL ? 'الفلاتر' : 'Filters'}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={isRTL ? 'right' : 'left'}>
                      <SheetHeader>
                        <SheetTitle>{isRTL ? 'الفلاتر' : 'Filters'}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} {isRTL ? 'منتج' : 'products'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={isRTL ? 'ترتيب حسب' : 'Sort by'} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem className='hover:bg-red-200' value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
                      <SelectItem className='hover:bg-red-200'  value="price-low">{isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</SelectItem>
                      <SelectItem className='hover:bg-red-200' value="price-high">{isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</SelectItem>
                      <SelectItem className='hover:bg-red-200' value="popular">{isRTL ? 'الأكثر شعبية' : 'Most Popular'}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 sm:flex ">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8 hover:bg-red-200"
                      onClick={() => setViewMode('grid')}

                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8 hover:bg-red-200"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : productsError ? (
                <div className="text-center py-12 text-destructive">
                  {isRTL ? 'خطأ في تحميل المنتجات' : 'Error loading products'}
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                    className={cn(
                      "grid gap-6",
                      viewMode === 'grid'
                        ? "sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    )}
                  >
                    {displayedProducts.map((product, index) => {
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
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard product={cardProduct} index={index} />
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Load More */}
                  {itemsToShow < filteredProducts.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 text-center"
                    >
                      <Button variant="outline" size="lg" className='hover:bg-red-200' onClick={handleLoadMore}>
                        {isRTL ? 'تحميل المزيد' : 'Load More'}
                      </Button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border-2 border-dashed border-muted bg-muted/50 p-12 text-center"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isRTL ? 'لم يتم العثور على منتجات' : 'No products found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isRTL ? 'حاول تعديل الفلاتر الخاصة بك' : 'Try adjusting your filters'}
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main><FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Shop;
