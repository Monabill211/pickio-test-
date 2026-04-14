import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Calendar, Image as ImageIcon, Eye, Trash2, CheckCircle, XCircle, Archive, MessageSquare, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage, type ContactMessage } from '@/services/contactService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const AdminContactMessages: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');

  // Fetch contact messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: getContactMessages,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: ContactMessage['status']; notes?: string }) =>
      updateContactMessageStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast.success(isRTL ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully');
      setSelectedMessage(null);
      setAdminNotes('');
    },
    onError: (error: any) => {
      toast.error(isRTL ? 'فشل تحديث الحالة' : 'Failed to update status');
      
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast.success(isRTL ? 'تم حذف الرسالة بنجاح' : 'Message deleted successfully');
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast.error(isRTL ? 'فشل حذف الرسالة' : 'Failed to delete message');
      
    },
  });

  const handleStatusChange = (messageId: string, newStatus: ContactMessage['status']) => {
    updateStatusMutation.mutate({ id: messageId, status: newStatus, notes: adminNotes || undefined });
  };

  const handleDelete = (messageId: string) => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      deleteMutation.mutate(messageId);
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const variants: Record<ContactMessage['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      new: { label: isRTL ? 'جديد' : 'New', variant: 'default' },
      read: { label: isRTL ? 'مقروء' : 'Read', variant: 'secondary' },
      replied: { label: isRTL ? 'تم الرد' : 'Replied', variant: 'outline' },
      archived: { label: isRTL ? 'مؤرشف' : 'Archived', variant: 'outline' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredMessages = statusFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.status === statusFilter);

  const newMessagesCount = messages.filter(msg => msg.status === 'new').length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-destructive">
          {isRTL ? 'خطأ في تحميل الرسائل' : 'Error loading messages'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isRTL ? 'رسائل العملاء' : 'Contact Messages'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isRTL ? 'إدارة رسائل العملاء والاستفسارات' : 'Manage customer messages and inquiries'}
            </p>
          </div>
          {newMessagesCount > 0 && (
            <Badge variant="default" className="text-lg px-4 py-2">
              {newMessagesCount} {isRTL ? 'جديد' : 'New'}
            </Badge>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={isRTL ? 'تصفية حسب الحالة' : 'Filter by status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
              <SelectItem value="new">{isRTL ? 'جديد' : 'New'}</SelectItem>
              <SelectItem value="read">{isRTL ? 'مقروء' : 'Read'}</SelectItem>
              <SelectItem value="replied">{isRTL ? 'تم الرد' : 'Replied'}</SelectItem>
              <SelectItem value="archived">{isRTL ? 'مؤرشف' : 'Archived'}</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            {isRTL ? 'إجمالي الرسائل' : 'Total messages'}: {filteredMessages.length}
          </div>
        </motion.div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border-2 border-dashed border-muted bg-muted/50 p-12 text-center"
          >
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isRTL ? 'لا توجد رسائل' : 'No messages'}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? 'لا توجد رسائل لعرضها' : 'No messages to display'}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(message.status)}
                      <h3 className="font-semibold text-lg text-foreground">
                        {message.subject}
                      </h3>
                    </div>
                    
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{message.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${message.email}`} className="hover:text-primary">
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${message.phone}`} className="hover:text-primary">
                          {message.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-2">
                      {message.message}
                    </p>
                    
                    {message.imageUrl && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <ImageIcon className="h-4 w-4" />
                        <a 
                          href={message.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {isRTL ? 'عرض الصورة' : 'View Image'}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setSelectedMessage(message);
                            setAdminNotes(message.adminNotes || '');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{message.subject}</DialogTitle>
                          <DialogDescription>
                            {isRTL ? 'تفاصيل الرسالة' : 'Message Details'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {isRTL ? 'الاسم' : 'Name'}
                              </label>
                              <p className="text-foreground">{message.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {isRTL ? 'البريد الإلكتروني' : 'Email'}
                              </label>
                              <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                {message.email}
                              </a>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {isRTL ? 'الهاتف' : 'Phone'}
                              </label>
                              <a href={`tel:${message.phone}`} className="text-primary hover:underline">
                                {message.phone}
                              </a>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                {isRTL ? 'التاريخ' : 'Date'}
                              </label>
                              <p className="text-foreground">
                                {message.createdAt.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {isRTL ? 'الرسالة' : 'Message'}
                            </label>
                            <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                          </div>
                          
                          {message.imageUrl && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                {isRTL ? 'صورة المنتج' : 'Product Image'}
                              </label>
                              <img
                                src={message.imageUrl}
                                alt="Product"
                                className="rounded-lg border border-border max-w-full h-auto"
                              />
                            </div>
                          )}
                          
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              {isRTL ? 'ملاحظات الإدارة' : 'Admin Notes'}
                            </label>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder={isRTL ? 'أضف ملاحظات...' : 'Add notes...'}
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            {message.status !== 'read' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(message.id, 'read')}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {isRTL ? 'تم القراءة' : 'Mark as Read'}
                              </Button>
                            )}
                            {message.status !== 'replied' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(message.id, 'replied')}
                                className="gap-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                {isRTL ? 'تم الرد' : 'Mark as Replied'}
                              </Button>
                            )}
                            {message.status !== 'archived' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(message.id, 'archived')}
                                className="gap-2"
                              >
                                <Archive className="h-4 w-4" />
                                {isRTL ? 'أرشفة' : 'Archive'}
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(message.id)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              {isRTL ? 'حذف' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
