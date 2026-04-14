import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Save, X, Loader2, Image as ImageIcon, Upload, XCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFormLabelClass, cnRtl } from '@/utils/rtlHelper';
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
import { Category } from '@/data/products';
import {
  getCategories,
  updateCategory,
  deleteCategory,
  addCategory,
} from '@/services/categoryService';
import { uploadImage } from '@/services/storageService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminCategories: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state for editing/adding
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    icon: '',
    image: '',
    productCount: 0,
    order: 1,
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Filter categories based on search
  const filteredCategories = categories.filter((category) => {
    const name = language === 'ar' ? category.name.ar : category.name.en;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Start editing
  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setImagePreview(category.image);
    setImageFile(null);
    setFormData({
      name_ar: category.name.ar,
      name_en: category.name.en,
      icon: category.icon,
      image: category.image,
      productCount: category.productCount,
      order: ('order' in category ? (category as Category & { order?: number }).order : undefined) || 1,
    });
    setShowAddForm(false);
  };

  // Cancel editing/adding
  const handleCancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setImagePreview(null);
    setImageFile(null);
    setFormData({
      name_ar: '',
      name_en: '',
      icon: '',
      image: '',
      productCount: 0,
      order: categories.length + 1,
    });
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(isRTL ? 'الملف المحدد ليس صورة' : 'Selected file is not an image');
        return;
      }
      
      // Validate file size (max 5MB before compression, will be compressed to 100KB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB before compression
      const TARGET_SIZE = 100 * 1024; // 100KB after compression
      if (file.size > MAX_FILE_SIZE) {
        toast.error(isRTL ? `حجم الصورة كبير جداً (سيتم ضغطها إلى ${TARGET_SIZE / 1024}KB)` : `Image size too large (will be compressed to ${TARGET_SIZE / 1024}KB)`);
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (!editingId) {
      setFormData({ ...formData, image: '' });
    }
  };

  // Save category (edit or add)
  const handleSave = async () => {
    if (!formData.name_ar || !formData.name_en) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (!formData.image && !imageFile) {
      toast.error(isRTL ? 'يرجى إضافة صورة للفئة' : 'Please add an image for the category');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile, 'categories');
          toast.success(isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error uploading image';
          let displayMessage = errorMessage;
          
          if (errorMessage.includes('preset') || errorMessage.includes('Upload preset')) {
            displayMessage = isRTL
              ? 'يرجى إنشاء upload preset في Cloudinary Dashboard. راجع ملف CREATE_UPLOAD_PRESET.md'
              : 'Upload preset not found. Please create "dar_home_upload" preset in Cloudinary Dashboard. See CREATE_UPLOAD_PRESET.md';
          }
          
          toast.error(displayMessage);
          setLoading(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const categoryData = {
        name: {
          ar: formData.name_ar,
          en: formData.name_en,
        },
        icon: formData.icon,
        image: imageUrl,
        productCount: formData.productCount,
        order: formData.order,
      };

      if (editingId) {
        // Update existing category
        await updateCategory(editingId, categoryData);
        toast.success(isRTL ? 'تم تحديث الفئة بنجاح' : 'Category updated successfully');
        setEditingId(null);
      } else {
        // Add new category
        await addCategory(categoryData);
        toast.success(isRTL ? 'تم إضافة الفئة بنجاح' : 'Category added successfully');
        setShowAddForm(false);
      }

      // Refresh categories
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      // Reset form
      handleCancelEdit();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isRTL
          ? 'حدث خطأ أثناء حفظ الفئة'
          : 'Error saving category'
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await deleteCategory(deleteId);
      toast.success(isRTL ? 'تم حذف الفئة بنجاح' : 'Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isRTL
          ? 'حدث خطأ أثناء حذف الفئة'
          : 'Error deleting category'
      );
    } finally {
      setLoading(false);
    }
  };

  // Start adding new category
  const handleStartAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setImagePreview(null);
    setImageFile(null);
    setFormData({
      name_ar: '',
      name_en: '',
      icon: '',
      image: '',
      productCount: 0,
      order: categories.length + 1,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : 'flex-row')}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold text-foreground">
              {isRTL ? 'الفئات' : 'Categories'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isRTL ? 'إدارة فئات المنتجات' : 'Manage product categories'}
            </p>
          </div>
          <Button onClick={handleStartAdd} className="gap-2" disabled={showAddForm || editingId !== null}>
            <Plus className="h-4 w-4" />
            {isRTL ? 'إضافة فئة' : 'Add Category'}
          </Button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('relative', isRTL ? 'dir-rtl' : 'dir-ltr')}
        >
          <Search className={cn('absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
          <Input
            placeholder={isRTL ? 'ابحث عن فئة...' : 'Search categories...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={isRTL ? 'pr-10 text-right' : 'pl-10 text-left'}
          />
        </motion.div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className={cn('flex items-center justify-between mb-4', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <h2 className={cn('text-xl font-bold text-foreground', isRTL ? 'text-right' : 'text-left')}>
                {editingId
                  ? isRTL
                    ? 'تعديل الفئة'
                    : 'Edit Category'
                  : isRTL
                  ? 'إضافة فئة جديدة'
                  : 'Add New Category'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className={cn('grid gap-4 md:grid-cols-2', isRTL ? 'text-right' : 'text-left')}>
              <div>
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, name_ar: e.target.value })
                  }
                  required
                  placeholder={isRTL ? 'مثال: الأرائك' : 'e.g., Sofas'}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'الاسم بالإنجليزية' : 'Name (English)'}
                </label>
                <Input
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  required
                  placeholder="e.g., Sofas"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'الأيقونة' : 'Icon'}
                </label>
                <Input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="e.g., sofa"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              <div className="md:col-span-2">
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'صورة الفئة' : 'Category Image'}
                </label>
                
                {/* Image Preview */}
                {(imagePreview || formData.image) && (
                  <div className="relative mb-4 inline-block">
                    <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'h-full w-full flex items-center justify-center';
                            placeholder.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className={cn('absolute top-2 h-6 w-6', isRTL ? 'left-2' : 'right-2')}
                        onClick={handleRemoveImage}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className={cn('flex items-center gap-4', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={cn('w-full gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}
                      asChild
                    >
                      <span>
                        {uploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isRTL ? 'جاري الرفع...' : 'Uploading...'}
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            {isRTL ? 'رفع صورة' : 'Upload Image'}
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                  
                  {/* Or use URL */}
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'أو' : 'OR'}
                  </div>
                  
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }
                    }}
                    placeholder={isRTL ? 'أدخل رابط الصورة' : 'Enter image URL'}
                    className="flex-1"
                  />
                </div>
                <p className={cn('text-xs text-muted-foreground mt-2', isRTL ? 'text-right' : 'text-left')}>
                  {isRTL
                    ? 'يمكنك رفع صورة أو إدخال رابط صورة (الحد الأقصى 5MB)'
                    : 'Upload an image or enter image URL (max 5MB)'}
                </p>
              </div>
              <div>
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'عدد المنتجات' : 'Product Count'}
                </label>
                <Input
                  type="number"
                  value={formData.productCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productCount: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={getFormLabelClass(isRTL)}>
                  {isRTL ? 'الترتيب' : 'Order'}
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
            </div>
            <div className={cn('flex gap-2 mt-4', isRTL ? 'flex-row-reverse' : 'flex-row')}>
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} disabled={loading}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <p className="text-destructive">
              {isRTL ? 'حدث خطأ أثناء تحميل الفئات' : 'Error loading categories'}
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? isRTL
                  ? 'لا توجد فئات تطابق البحث'
                  : 'No categories match your search'
                : isRTL
                ? 'لا توجد فئات متاحة'
                : 'No categories available'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'rounded-lg border border-border bg-card p-6',
                  editingId === category.id && 'ring-2 ring-primary'
                )}
              >
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name[language]}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Hide broken image and show placeholder
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.image-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'image-placeholder h-full w-full flex items-center justify-center';
                            placeholder.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={cn('flex items-start justify-between gap-4', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                      <div className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
                        <h3 className="text-lg font-bold text-foreground">
                          {category.name[language]}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.name[language === 'ar' ? 'en' : 'ar']}
                        </p>
                        <div className={cn('flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                          <span>
                            {isRTL ? 'عدد المنتجات' : 'Products'}: {category.productCount}
                          </span>
                          <span>
                            {isRTL ? 'الأيقونة' : 'Icon'}: {category.icon || '-'}
                          </span>
                          <span>
                            {isRTL ? 'الترتيب' : 'Order'}: {'order' in category ? (category as Category & { order?: number }).order || '-' : '-'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={cn('flex items-center gap-2 flex-shrink-0', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStartEdit(category)}
                          disabled={editingId !== null || showAddForm}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                          disabled={editingId !== null || showAddForm}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? 'هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this category? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isRTL ? 'جاري الحذف...' : 'Deleting...'}
                </>
              ) : (
                isRTL ? 'حذف' : 'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCategories;
