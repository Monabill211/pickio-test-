import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
  Image,
  Settings,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContentItems, deleteContentItem, toggleContentPublish, type ContentItem } from '@/services/contentService';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  type: 'page' | 'banner' | 'faq' | 'testimonial' | 'blog';
  content_en: string;
  content_ar: string;
  image?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  views: number;
}

const AdminContent: React.FC = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContentItem['type'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const contentTypes = [
    { value: 'page', label: 'Pages', icon: FileText },
    { value: 'banner', label: 'Banners', icon: Image },
    { value: 'faq', label: 'FAQs', icon: Settings },
    { value: 'testimonial', label: 'Testimonials', icon: CheckCircle2 },
    { value: 'blog', label: 'Blog Posts', icon: FileText },
  ];

  // Fetch content items from Firebase
  const { data: contents = [], isLoading, isError } = useQuery<ContentItem[]>({
    queryKey: ['contentItems', filterType === 'all' ? undefined : filterType],
    queryFn: () => getContentItems(filterType === 'all' ? undefined : filterType),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteContentItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
      toast.success(isRTL ? 'تم حذف المحتوى بنجاح' : 'Content deleted successfully');
      setShowDeleteConfirm(null);
    },
    onError: (error: any) => {
      toast.error(isRTL ? `فشل حذف المحتوى: ${error.message}` : `Failed to delete content: ${error.message}`);
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => toggleContentPublish(id, published),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentItems'] });
      toast.success(isRTL ? 'تم تحديث حالة المحتوى' : 'Content status updated');
    },
    onError: (error: any) => {
      toast.error(isRTL ? `فشل تحديث الحالة: ${error.message}` : `Failed to update status: ${error.message}`);
    },
  });

  const filteredContents = useMemo(() => {
    return contents
      .filter((item) => {
        const matchesSearch =
          item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title_ar.includes(searchTerm) ||
          item.slug.includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (sortBy === 'views') {
          return b.views - a.views;
        } else {
          return a.title_en.localeCompare(b.title_en);
        }
      });
  }, [contents, searchTerm, sortBy]);

  const handleEdit = (id: string) => {
    toast.info(isRTL ? 'ميزة تعديل المحتوى قيد التطوير' : 'Content editing feature coming soon');
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTogglePublish = async (id: string) => {
    const item = contents.find((c) => c.id === id);
    if (item) {
      togglePublishMutation.mutate({ id, published: !item.published });
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    const typeObj = contentTypes.find((t) => t.value === type);
    return typeObj?.icon || FileText;
  };

  return (
    <AdminLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إنشاء وإدارة محتوى الموقع' : 'Create and manage website content'}
            </p>
          </div>
          <Button
            onClick={() => {
              toast.info(isRTL ? 'ميزة إنشاء المحتوى قيد التطوير' : 'Content creation feature coming soon');
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إنشاء محتوى' : 'Create Content'}
          </Button>
        </motion.div>


        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <div className="relative">
                  <Search
                    className={`absolute ${
                      isRTL ? 'right-3' : 'left-3'
                    } top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`}
                  />
                  <Input
                    type="text"
                    placeholder={
                      language === 'ar' ? 'البحث عن المحتوى...' : 'Search content by title or slug...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isRTL ? 'pr-10' : 'pl-10'}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'ar' ? 'نوع المحتوى' : 'Content Type'}
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as ContentItem['type'] | 'all')}
                    className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'ar' ? 'ترتيب حسب' : 'Sort By'}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'title')}
                    className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <option value="date">
                      {language === 'ar' ? 'الأحدث' : 'Latest Updated'}
                    </option>
                    <option value="views">
                      {language === 'ar' ? 'الأكثر مشاهدة' : 'Most Views'}
                    </option>
                    <option value="title">{language === 'ar' ? 'العنوان (أ-ي)' : 'Title (A-Z)'}</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className={`flex items-end ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'عرض' : 'Showing'}{' '}
                    <span className="font-bold text-foreground">{filteredContents.length}</span>{' '}
                    {language === 'ar' ? 'من' : 'of'}{' '}
                    <span className="font-bold text-foreground">{contents.length}</span>{' '}
                    {language === 'ar' ? 'عنصر' : 'items'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <p className="text-destructive">
                    {isRTL ? 'خطأ في تحميل المحتوى' : 'Error loading content'}
                  </p>
                </div>
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'لم يتم العثور على محتوى' : 'No content found'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted">
                    <tr>
                      <th className={`px-6 py-3 font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'العنوان' : 'Title'}
                      </th>
                      <th className={`px-6 py-3 font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'النوع' : 'Type'}
                      </th>
                      <th className={`px-6 py-3 font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'الكاتب' : 'Author'}
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-foreground">
                        {language === 'ar' ? 'المشاهدات' : 'Views'}
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-foreground">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th className={`px-6 py-3 font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'آخر تحديث' : 'Updated'}
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-foreground">
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContents.map((item, index) => {
                      const TypeIcon = getTypeIcon(item.type);
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div>
                              <p className="font-semibold text-foreground">
                                {language === 'ar' ? item.title_ar : item.title_en}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.slug}</p>
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize text-foreground font-medium">{item.type}</span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <span className="text-foreground">{item.author}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-bold text-primary">{item.views}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleTogglePublish(item.id)}
                              className="inline-flex items-center justify-center"
                            >
                              {item.published ? (
                                <Eye className="h-5 w-5 text-green-600" title="Published" />
                              ) : (
                                <EyeOff className="h-5 w-5 text-muted-foreground" title="Draft" />
                              )}
                            </button>
                          </td>
                          <td className={`px-6 py-4 text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                            {item.updatedAt.toLocaleDateString(
                              language === 'ar' ? 'ar-SA' : 'en-US'
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <button
                                onClick={() => handleEdit(item.id)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(item.id)}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contentTypes.map((type, index) => {
              const count = contents.filter((item) => item.type === type.value).length;
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="p-6">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
                      <div>
                        <p className="text-muted-foreground text-sm">{type.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
                      </div>
                      <Icon className="h-8 w-8 text-primary/30" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`bg-card rounded-lg p-6 max-w-sm shadow-2xl ${isRTL ? 'rtl' : 'ltr'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <h3 className={`text-lg font-bold text-foreground mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'حذف المحتوى؟' : 'Delete Content?'}
            </h3>
            <p className={`text-muted-foreground mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? 'هل أنت متأكد من حذف هذا المحتوى؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this content? This action cannot be undone.'}
            </p>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(null)}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  language === 'ar' ? 'حذف' : 'Delete'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminContent;