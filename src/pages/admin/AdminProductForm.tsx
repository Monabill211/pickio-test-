import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductById, addProduct, updateProduct } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { uploadImage } from '@/services/storageService';
import { toast } from 'sonner';
import { calculatePricing, formatEGP, getDiscountPercentage } from '@/utils/pricingHelper';
import { getFormLabelClass, getFormErrorClass, getInputIconPosition, cnRtl, getButtonRowClass } from '@/utils/rtlHelper';
import { cn } from '@/lib/utils';

interface ProductFormData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  visible: boolean;
}

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isRTL, language } = useLanguage();

  const [formData, setFormData] = useState<ProductFormData>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    discountPrice: undefined,
    category: '',
    stock: 0,
    images: [],
    colors: [],
    sizes: [],
    materials: [],
    visible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  // Load product data if editing
  const { data: productData, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? getProductById(id) : null,
    enabled: !!id,
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        name_ar: productData.name_ar || '',
        name_en: productData.name_en || '',
        description_ar: productData.description_ar || '',
        description_en: productData.description_en || '',
        price: productData.price || 0,
        discountPrice: productData.discountPrice || productData.originalPrice,
        category: productData.category || productData.categoryId || '',
        stock: productData.stock || 0,
        images: productData.images || [],
        colors: productData.colors || [],
        sizes: productData.sizes || [],
        materials: productData.materials || [],
        visible: productData.visible !== false,
      });
    }
  }, [productData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate names
    if (!formData.name_en.trim()) {
      newErrors.name_en = isRTL ? 'اسم المنتج (الإنجليزية) مطلوب' : 'English product name is required';
    } else if (formData.name_en.trim().length < 3) {
      newErrors.name_en = isRTL ? 'يجب أن لا يقل الاسم عن 3 أحرف' : 'Name must be at least 3 characters';
    } else if (formData.name_en.trim().length > 100) {
      newErrors.name_en = isRTL ? 'يجب أن لا يزيد الاسم عن 100 حرف' : 'Name must not exceed 100 characters';
    }

    if (!formData.name_ar.trim()) {
      newErrors.name_ar = isRTL ? 'اسم المنتج (العربية) مطلوب' : 'Arabic product name is required';
    } else if (formData.name_ar.trim().length < 3) {
      newErrors.name_ar = isRTL ? 'يجب أن لا يقل الاسم عن 3 أحرف' : 'Name must be at least 3 characters';
    } else if (formData.name_ar.trim().length > 100) {
      newErrors.name_ar = isRTL ? 'يجب أن لا يزيد الاسم عن 100 حرف' : 'Name must not exceed 100 characters';
    }

    // Validate descriptions
    if (!formData.description_en.trim()) {
      newErrors.description_en = isRTL ? 'الوصف (الإنجليزية) مطلوب' : 'English description is required';
    } else if (formData.description_en.trim().length < 10) {
      newErrors.description_en = isRTL ? 'يجب أن لا يقل الوصف عن 10 أحرف' : 'Description must be at least 10 characters';
    } else if (formData.description_en.trim().length > 5000) {
      newErrors.description_en = isRTL ? 'يجب أن لا يزيد الوصف عن 5000 حرف' : 'Description must not exceed 5000 characters';
    }

    if (!formData.description_ar.trim()) {
      newErrors.description_ar = isRTL ? 'الوصف (العربية) مطلوب' : 'Arabic description is required';
    } else if (formData.description_ar.trim().length < 10) {
      newErrors.description_ar = isRTL ? 'يجب أن لا يقل الوصف عن 10 أحرف' : 'Description must be at least 10 characters';
    } else if (formData.description_ar.trim().length > 5000) {
      newErrors.description_ar = isRTL ? 'يجب أن لا يزيد الوصف عن 5000 حرف' : 'Description must not exceed 5000 characters';
    }

    // Validate pricing
    if (!formData.price || formData.price <= 0) {
      newErrors.price = isRTL ? 'السعر يجب أن يكون أكبر من 0 EGP' : 'Price must be greater than 0 EGP';
    } else if (formData.price > 999999) {
      newErrors.price = isRTL ? 'السعر لا يمكن أن يتجاوز 999,999 EGP' : 'Price cannot exceed 999,999 EGP';
    }

    if (formData.discountPrice && formData.discountPrice >= formData.price) {
      newErrors.discountPrice = isRTL 
        ? 'سعر البيع يجب أن يكون أقل من السعر الأصلي' 
        : 'Sale price must be less than original price';
    }

    // Validate stock
    if (formData.stock < 0) {
      newErrors.stock = isRTL ? 'المخزون لا يمكن أن يكون سالباً' : 'Stock cannot be negative';
    } else if (formData.stock > 999999) {
      newErrors.stock = isRTL ? 'المخزون لا يمكن أن يتجاوز 999,999 وحدة' : 'Stock cannot exceed 999,999 units';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = isRTL ? 'اختر فئة المنتج' : 'Please select a product category';
    }

    // Validate images
    if (formData.images.length === 0) {
      newErrors.images = isRTL ? 'أضف على الأقل صورة واحدة للمنتج' : 'Add at least one product image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const uploadPromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      const uploadPromise = uploadImage(file, 'products');
      uploadPromises.push(uploadPromise);
      
      // Track uploading state
      uploadPromise.then((url) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }));
        setUploadingImages((prev) => prev.filter((u) => u !== file.name));
      }).catch((error) => {
        toast.error(isRTL ? 'خطأ في رفع الصورة' : 'Error uploading image');
        setUploadingImages((prev) => prev.filter((u) => u !== file.name));
      });
      
      setUploadingImages((prev) => [...prev, file.name]);
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(isRTL ? 'تم رفع الصور بنجاح' : 'Images uploaded successfully');
    } catch (error) {
      // Error already handled in individual promises
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor],
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize],
      }));
      setNewSize('');
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial)) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial],
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productData = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        description_ar: formData.description_ar,
        description_en: formData.description_en,
        price: formData.price,
        discountPrice: formData.discountPrice,
        category: formData.category,
        categoryId: formData.category,
        stock: formData.stock,
        images: formData.images,
        colors: formData.colors,
        sizes: formData.sizes,
        materials: formData.materials,
        visible: formData.visible,
        inStock: formData.stock > 0,
      };

      if (id) {
        // Update existing product
        await updateProduct(id, productData);
        toast.success(isRTL ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
      } else {
        // Add new product
        await addProduct(productData);
        toast.success(isRTL ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(isRTL ? `خطأ في حفظ المنتج: ${errorMessage}` : errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('flex items-center', isRTL ? 'flex-row-reverse' : 'flex-row', 'justify-between')}
        >
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className={cn('text-3xl font-bold text-foreground', isRTL ? 'text-right' : 'text-left')}>
              {loadingProduct ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </div>
              ) : (
                id ? (isRTL ? 'تعديل المنتج' : 'Edit Product') : (isRTL ? 'إضافة منتج جديد' : 'Add New Product')
              )}
            </h1>
            <p className="text-muted-foreground">
              {id ? (isRTL ? 'تحديث تفاصيل المنتج' : 'Update product details') : (isRTL ? 'إنشاء منتج جديد' : 'Create a new product')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/products')}
            className={cn('gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}
          >
            <X className="h-4 w-4" />
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">General Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={getFormLabelClass(isRTL)}>
                    Product Name (English) *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Modern Sofa"
                    value={formData.name_en}
                    onChange={(e) => handleInputChange('name_en', e.target.value)}
                    className={errors.name_en ? 'border-destructive' : ''}
                  />
                  {errors.name_en && (
                    <p className={getFormErrorClass(isRTL)}>{errors.name_en}</p>
                  )}
                </div>

                <div>
                  <label className={getFormLabelClass(isRTL)}>
                    اسم المنتج (العربية) *
                  </label>
                  <Input
                    type="text"
                    placeholder="مثال: أريكة حديثة"
                    value={formData.name_ar}
                    onChange={(e) => handleInputChange('name_ar', e.target.value)}
                    className={errors.name_ar ? 'border-destructive' : ''}
                  />
                  {errors.name_ar && (
                    <p className={getFormErrorClass(isRTL)}>{errors.name_ar}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className={getFormLabelClass(isRTL)}>
                    Description (English) *
                  </label>
                  <textarea
                    placeholder="Describe the product..."
                    value={formData.description_en}
                    onChange={(e) => handleInputChange('description_en', e.target.value)}
                    rows={4}
                    className={cn(
                      'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                      isRTL ? 'text-right' : 'text-left',
                      errors.description_en ? 'border-destructive' : ''
                    )}
                  />
                  {errors.description_en && (
                    <p className={getFormErrorClass(isRTL)}>{errors.description_en}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className={getFormLabelClass(isRTL)}>
                    الوصف (العربية) *
                  </label>
                  <textarea
                    placeholder="وصف المنتج..."
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange('description_ar', e.target.value)}
                    rows={4}
                    className={cn(
                      'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary',
                      isRTL ? 'text-right' : 'text-left',
                      errors.description_ar ? 'border-destructive' : ''
                    )}
                  />
                  {errors.description_ar && (
                    <p className={getFormErrorClass(isRTL)}>{errors.description_ar}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pricing & Stock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className={cn('text-lg font-bold text-foreground mb-6 flex items-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                <DollarSign className="h-5 w-5" />
                {isRTL ? 'التسعير والمخزون' : 'Pricing & Stock'}
              </h2>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className={getFormLabelClass(isRTL)}>
                    {isRTL ? 'الفئة' : 'Category'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.category ? 'border-destructive focus:ring-destructive' : ''
                    }`}
                  >
                    <option value="">{isRTL ? 'اختر الفئة' : 'Select a category'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'ar' ? cat.name.ar : cat.name.en}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className={getFormErrorClass(isRTL)}>{errors.category}</p>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Original Price */}
                  <div>
                    <label className={getFormLabelClass(isRTL)}>
                      {isRTL ? 'السعر الأصلي' : 'Original Price'} (EGP) *
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className={cn(
                          'font-medium text-lg',
                          isRTL ? 'text-right' : 'text-left',
                          errors.price ? 'border-destructive focus-visible:ring-destructive' : ''
                        )}
                      />
                      <span className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium', isRTL ? 'left-3' : 'right-3')}>
                        EGP
                      </span>
                    </div>
                    {errors.price && (
                      <p className={getFormErrorClass(isRTL)}>{errors.price}</p>
                    )}
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className={getFormLabelClass(isRTL)}>
                      {isRTL ? 'سعر البيع (اختياري)' : 'Sale Price (Optional)'} (EGP)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder={isRTL ? 'اتركه فارغاً إذا لم يكن هناك خصم' : 'Leave empty if no discount'}
                        value={formData.discountPrice || ''}
                        onChange={(e) =>
                          handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        min="0"
                        step="0.01"
                        className={cn(
                          'font-medium text-lg',
                          isRTL ? 'text-right' : 'text-left',
                          formData.discountPrice && formData.discountPrice >= formData.price
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        )}
                      />
                      <span className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium', isRTL ? 'left-3' : 'right-3')}>
                        EGP
                      </span>
                    </div>
                    {formData.discountPrice && formData.discountPrice >= formData.price && (
                      <p className={getFormErrorClass(isRTL)}>
                        {isRTL ? 'سعر البيع يجب أن يكون أقل من السعر الأصلي' : 'Sale price must be less than original price'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing Summary Card */}
                {formData.price > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 p-4 space-y-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Original Price Display */}
                      <div className="text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {isRTL ? 'السعر الأصلي' : 'Original'}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {formatEGP(formData.price)}
                        </p>
                      </div>

                      {/* Discount Badge */}
                      {formData.discountPrice && formData.discountPrice > 0 && formData.discountPrice < formData.price && (
                        <>
                          <div className="flex items-center justify-center">
                            <TrendingDown className="h-5 w-5 text-destructive" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              {isRTL ? 'الخصم' : 'Discount'}
                            </p>
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-destructive">
                                -{getDiscountPercentage(formData.price, formData.discountPrice)}%
                              </p>
                              <p className="text-xs text-destructive/80">
                                {isRTL ? 'توفير' : 'Save'}: {formatEGP(formData.price - formData.discountPrice)}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Final Price Display */}
                      <div className="text-center">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {isRTL ? 'السعر النهائي' : 'Final Price'}
                        </p>
                        <p className={cn(
                          'text-lg font-bold',
                          formData.discountPrice && formData.discountPrice < formData.price
                            ? 'text-green-600 dark:text-green-500'
                            : 'text-foreground'
                        )}>
                          {formatEGP(formData.discountPrice && formData.discountPrice < formData.price ? formData.discountPrice : formData.price)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stock Quantity */}
                <div>
                  <label className={getFormLabelClass(isRTL)}>
                    {isRTL ? 'الكمية المتاحة' : 'Stock Quantity'} *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    min="0"
                    className={errors.stock ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.stock && (
                    <p className={getFormErrorClass(isRTL)}>{errors.stock}</p>
                  )}
                  <p className={cn('text-xs text-muted-foreground mt-1', isRTL ? 'text-right' : 'text-left')}>
                    {isRTL ? 'عدد الوحدات المتاحة للبيع' : 'Number of units available for sale'}
                  </p>
                </div>

                {/* Visibility Toggle */}
                <div className={cn('flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                    {formData.visible ? (
                      <Eye className="h-5 w-5 text-green-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-sm font-medium text-foreground">
                        {isRTL ? 'ظهور المنتج' : 'Product Visibility'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formData.visible 
                          ? (isRTL ? 'يظهر في المتجر' : 'Visible in store')
                          : (isRTL ? 'مخفي من المتجر' : 'Hidden from store')
                        }
                      </p>
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => handleInputChange('visible', e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                  </label>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Product Images</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Images *
                </label>
                <div className="relative rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                     <p className="text-sm text-foreground">Click to upload or drag and drop</p>
                     <p className="text-xs text-muted-foreground">PNG, JPG (will be compressed to max 100KB)</p>
                  </div>
                </div>
                {errors.images && (
                  <p className="text-xs text-destructive mt-1">{errors.images}</p>
                )}
              </div>

              {/* Image Gallery */}
              <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
                {formData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="h-5 w-5 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Product Options</h2>

              <div className="space-y-6">
                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Available Colors
                  </label>
                  <div className="flex gap-2 mb-3 items-center">
                    <input
                      type="color"
                      value={newColor || '#ffffff'}
                      onChange={e => setNewColor(e.target.value)}
                      className="w-10 h-10 rounded-full border border-border cursor-pointer"
                    />
                    <Button
                      type="button"
                      onClick={handleAddColor}
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Pick a color then add</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1"
                      >
                        <span className="w-6 h-6 rounded-full border border-border mr-2" style={{ backgroundColor: color }}></span>
                        <span className="text-sm font-medium text-foreground">{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Available Sizes
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      placeholder="e.g., Small, Medium, Large"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSize}
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map((size, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1"
                      >
                        <span className="text-sm font-medium text-foreground">{size}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Available Materials
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      placeholder="e.g., Leather, Fabric, Wood"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
                    />
                    <Button
                      type="button"
                      onClick={handleAddMaterial}
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1"
                      >
                        <span className="text-sm font-medium text-foreground">{material}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn('flex gap-3 sticky bottom-0 bg-background/80 backdrop-blur p-4 rounded-lg border border-border', getButtonRowClass(isRTL, 'end'))}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={cn('gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {id ? (isRTL ? 'تحديث المنتج' : 'Update Product') : (isRTL ? 'إضافة المنتج' : 'Add Product')}
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;