import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, Loader2, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getUsers, toggleUserStatus, updateUserRole, addUser, User } from '@/services/userService';
import { registerUser } from '@/services/authService';
import { toast } from 'sonner';

const AdminUsers: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as 'customer' | 'admin',
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', filterRole],
    queryFn: () => getUsers(filterRole !== 'all' ? { role: filterRole as 'customer' | 'admin' } : undefined),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isRTL ? 'تم تحديث حالة المستخدم' : 'User status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || (isRTL ? 'فشل تحديث الحالة' : 'Failed to update status'));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'customer' | 'admin' }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isRTL ? 'تم تحديث دور المستخدم' : 'User role updated');
    },
    onError: (error: any) => {
      toast.error(error.message || (isRTL ? 'فشل تحديث الدور' : 'Failed to update role'));
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      // Register user in Firebase Auth
      const [firstName, ...lastNameParts] = userData.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      const { doc, setDoc, Timestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: userData.name });
      
      // Create user document in Firestore with the specified role
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        status: 'active',
        orders: 0,
        joinDate: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isRTL ? 'تم إضافة المستخدم بنجاح' : 'User added successfully');
      setIsAddUserOpen(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
      });
    },
    onError: (error: any) => {
      toast.error(error.message || (isRTL ? 'فشل إضافة المستخدم' : 'Failed to add user'));
    },
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    return matchesSearch;
  });

  const handleToggleBlock = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleMakeAdmin = (id: string, currentRole: 'customer' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    updateRoleMutation.mutate({ id, role: newRole });
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
                  {isRTL ? 'المستخدمون' : 'Users'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isRTL ? 'إدارة مستخدمي المتجر' : 'Manage store users'}
                </p>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {isRTL ? 'إضافة مستخدم' : 'Add User'}
                  </Button>
                </DialogTrigger>
                <DialogContent className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
                  <DialogHeader>
                    <DialogTitle>{isRTL ? 'إضافة مستخدم جديد' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                      {isRTL ? 'قم بإنشاء حساب مستخدم جديد في النظام' : 'Create a new user account in the system'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isRTL ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder={isRTL ? 'أحمد محمد' : 'John Doe'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isRTL ? 'كلمة المرور' : 'Password'}
                      </label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isRTL ? 'رقم الهاتف' : 'Phone (Optional)'}
                      </label>
                      <Input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        placeholder="+20 100 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {isRTL ? 'الدور' : 'Role'}
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'customer' | 'admin' })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="customer">{isRTL ? 'عميل' : 'Customer'}</option>
                        <option value="admin">{isRTL ? 'مسؤول' : 'Admin'}</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserOpen(false)}
                      disabled={addUserMutation.isPending}
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button
                      onClick={() => {
                        if (!newUser.name || !newUser.email || !newUser.password) {
                          toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                          return;
                        }
                        addUserMutation.mutate(newUser);
                      }}
                      disabled={addUserMutation.isPending}
                      className="gap-2"
                    >
                      {addUserMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isRTL ? 'جاري الإضافة...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          {isRTL ? 'إضافة' : 'Add User'}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  placeholder={isRTL ? 'ابحث عن مستخدم...' : 'Search users...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rtl:pl-4 rtl:pr-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
              >
                <option value="all">{isRTL ? 'جميع الأدوار' : 'All Roles'}</option>
                <option value="customer">{isRTL ? 'عميل' : 'Customer'}</option>
                <option value="admin">{isRTL ? 'مسؤول' : 'Admin'}</option>
              </select>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    {isRTL ? 'لا يوجد مستخدمون' : 'No users found'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {isRTL ? 'الاسم' : 'Name'}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {isRTL ? 'البريد الإلكتروني' : 'Email'}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {isRTL ? 'الهاتف' : 'Phone'}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {isRTL ? 'الطلبات' : 'Orders'}
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          {isRTL ? 'الدور' : 'Role'}
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium text-foreground cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{user.phone || '-'}</td>
                          <td className="px-4 py-3 text-foreground">{user.orders || 0}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'px-3 py-1 rounded-full text-xs font-semibold',
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            )}>
                              {user.role === 'admin' ? (isRTL ? 'مسؤول' : 'Admin') : (isRTL ? 'عميل' : 'Customer')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'px-3 py-1 rounded-full text-xs font-semibold',
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}>
                              {user.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'محظور' : 'Blocked')}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <Button
                              size="sm"
                              variant={user.role === 'admin' ? 'default' : 'outline'}
                              onClick={() => handleMakeAdmin(user.id, user.role)}
                              className="gap-1"
                              disabled={toggleStatusMutation.isPending || updateRoleMutation.isPending}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.status === 'blocked' ? 'default' : 'destructive'}
                              onClick={() => handleToggleBlock(user.id)}
                              className="gap-1"
                              disabled={toggleStatusMutation.isPending || updateRoleMutation.isPending}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
    </AdminLayout>
  );
};

export default AdminUsers;