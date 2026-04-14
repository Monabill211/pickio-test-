import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getProducts, deleteProduct, updateProduct, subscribeToProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { toast } from 'sonner';
import type { Product } from '@/services/productService';

const AdminProducts: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      queryClient.setQueryData(['products'], updatedProducts);
    });

    return () => unsubscribe();
  }, [queryClient]);

  const filteredProducts = products.filter(product => {
    const name = language === 'ar' ? product.name_ar : product.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success(isRTL ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      toast.error(isRTL ? 'خطأ في حذف المنتج' : 'Error deleting product');
      
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleToggleVisibility = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      await updateProduct(id, { visible: !product.visible });
      toast.success(isRTL ? 'تم تحديث حالة المنتج' : 'Product visibility updated');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      toast.error(isRTL ? 'خطأ في تحديث المنتج' : 'Error updating product');
      
    }
  };

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isRTL ? 'المنتجات' : 'Products'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isRTL ? 'إدارة منتجات المتجر' : 'Manage your store products'}
                </p>
              </div>
              <Button className="gap-2" onClick={() => navigate('/admin/products/add')}>
                <Plus className="h-4 w-4" />
                {isRTL ? 'إضافة منتج' : 'Add Product'}
              </Button>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 mb-6 md:grid-cols-2"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rtl:left-auto rtl:right-3" />
                <Input
                  placeholder={isRTL ? 'ابحث عن منتج...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rtl:pl-4 rtl:pr-10"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {language === 'ar' ? category.name.ar : category.name.en}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Products Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'الصورة' : 'Image'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'الاسم' : 'Name'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'السعر' : 'Price'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'المخزون' : 'Stock'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {isRTL ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          {isRTL ? 'لا توجد منتجات' : 'No products found'}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <img
                              src={product.images?.[0] || '/placeholder.svg'}
                              alt={language === 'ar' ? product.name_ar : product.name_en}
                              className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {language === 'ar' ? product.name_ar : product.name_en}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {product.discountPrice ? (
                              <div>
                                <span className="line-through text-muted-foreground text-sm">
                                  ${product.price}
                                </span>
                                <span className="ml-2 text-primary font-semibold">
                                  ${product.discountPrice}
                                </span>
                              </div>
                            ) : (
                              `$${product.price}`
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'px-3 py-1 rounded-full text-xs font-semibold',
                              product.stock > 10 ? 'bg-green-100 text-green-800' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            )}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleVisibility(product.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              {product.visible ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isRTL 
                    ? 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.'
                    : 'Are you sure you want to delete this product? This action cannot be undone.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isRTL ? 'حذف' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </AdminLayout>
  );
};

export default AdminProducts;