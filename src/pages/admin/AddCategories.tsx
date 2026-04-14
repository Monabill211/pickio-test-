import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { addCategory } from '@/services/categoryService';
import { testFirebaseConnection } from '@/utils/testFirebase';
import { toast } from 'sonner';

interface CategoryForm {
  name_ar: string;
  name_en: string;
  icon: string;
  image: string;
  productCount: number;
  order: number;
}

const AddCategories: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name_ar: '',
    name_en: '',
    icon: '',
    image: '',
    productCount: 0,
    order: 1,
  });

  const handleTestConnection = async () => {
    setLoading(true);
    const result = await testFirebaseConnection();
    setConnectionTest(result);
    setLoading(false);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: {
          ar: formData.name_ar,
          en: formData.name_en,
        },
        icon: formData.icon,
        image: formData.image,
        productCount: formData.productCount,
        order: formData.order,
      };

      const categoryId = await addCategory(categoryData);
      toast.success(
        isRTL
          ? `تم إضافة الفئة بنجاح! (ID: ${categoryId})`
          : `Category added successfully! (ID: ${categoryId})`
      );

      // Reset form
      setFormData({
        name_ar: '',
        name_en: '',
        icon: '',
        image: '',
        productCount: 0,
        order: formData.order + 1,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isRTL
          ? 'حدث خطأ أثناء إضافة الفئة'
          : 'Error adding category'
      );
    } finally {
      setLoading(false);
    }
  };

  const sampleCategories = [
    {
      name_ar: 'الأرائك',
      name_en: 'Sofas',
      icon: 'sofa',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      productCount: 24,
      order: 1,
    },
    {
      name_ar: 'غرف النوم',
      name_en: 'Bedrooms',
      icon: 'bed',
      image: 'https://images.unsplash.com/photo-1631889993954-6367b2c8d50a?w=800',
      productCount: 18,
      order: 2,
    },
    {
      name_ar: 'غرف السفرة',
      name_en: 'Dining',
      icon: 'utensils',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800',
      productCount: 15,
      order: 3,
    },
    {
      name_ar: 'الطاولات',
      name_en: 'Tables',
      icon: 'square',
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
      productCount: 32,
      order: 4,
    },
    {
      name_ar: 'الكراسي',
      name_en: 'Chairs',
      icon: 'armchair',
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      productCount: 28,
      order: 5,
    },
  ];

  const handleAddSample = async (sample: typeof sampleCategories[0]) => {
    setLoading(true);
    try {
      const categoryData = {
        name: {
          ar: sample.name_ar,
          en: sample.name_en,
        },
        icon: sample.icon,
        image: sample.image,
        productCount: sample.productCount,
        order: sample.order,
      };

      const categoryId = await addCategory(categoryData);
      toast.success(
        isRTL
          ? `تم إضافة "${sample.name_ar}" بنجاح!`
          : `Added "${sample.name_en}" successfully!`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isRTL
          ? 'حدث خطأ أثناء إضافة الفئة'
          : 'Error adding category'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'إضافة الفئات' : 'Add Categories'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL
              ? 'إضافة فئات جديدة إلى قاعدة البيانات'
              : 'Add new categories to the database'}
          </p>
        </div>

        {/* Connection Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {isRTL ? 'اختبار الاتصال بـ Firebase' : 'Test Firebase Connection'}
            </h2>
            <Button
              onClick={handleTestConnection}
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isRTL ? 'اختبار الاتصال' : 'Test Connection'}
            </Button>
          </div>
          {connectionTest && (
            <div
              className={`p-4 rounded-lg ${
                connectionTest.success
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {connectionTest.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <p
                  className={
                    connectionTest.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }
                >
                  {connectionTest.message}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Add Single Category Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            {isRTL ? 'إضافة فئة جديدة' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {isRTL ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, name_ar: e.target.value })
                  }
                  required
                  placeholder={isRTL ? 'مثال: الأرائك' : 'e.g., Sofas'}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {isRTL ? 'الاسم بالإنجليزية' : 'Name (English)'}
                </label>
                <Input
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  required
                  placeholder="e.g., Sofas"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {isRTL ? 'الأيقونة' : 'Icon'}
                </label>
                <Input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  required
                  placeholder="e.g., sofa"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {isRTL ? 'رابط الصورة' : 'Image URL'}
                </label>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
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
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
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
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isRTL ? 'إضافة الفئة' : 'Add Category'}
            </Button>
          </form>
        </motion.div>

        {/* Sample Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            {isRTL ? 'إضافة فئات نموذجية' : 'Add Sample Categories'}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {isRTL
              ? 'انقر على أي فئة لإضافتها إلى قاعدة البيانات'
              : 'Click on any category to add it to the database'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sampleCategories.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAddSample(sample)}
                disabled={loading}
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{sample.name_en}</span>
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {sample.name_ar}
                </span>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AddCategories;
