import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Trash2,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  ShoppingCart,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserById, updateUser, deleteUser, User } from '@/services/userService';
import { getOrders } from '@/services/orderService';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'superadmin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin: Date;
  profileImage: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
}

const AdminUserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });

  const { data: userOrders = [] } = useQuery({
    queryKey: ['userOrders', id],
    queryFn: () => getOrders({ customerId: id! }),
    enabled: !!id,
  });

  useEffect(() => {
    if (userData) {
      const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]').length;
      
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        status: userData.status,
        createdAt: userData.joinDate,
        lastLogin: userData.updatedAt || userData.joinDate,
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.name,
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        totalOrders: userOrders.length,
        totalSpent,
        wishlistItems,
        verifiedEmail: true,
        verifiedPhone: false,
      });
      setLoading(false);
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userData, userLoading, userOrders]);

  useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData(user);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: keyof UserProfile['address'], value: string) => {
    setEditData((prev) => ({
      ...prev,
      address: {
        ...prev.address || {},
        [field]: value,
      },
    }));
  };

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<User>) => updateUser(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditing(false);
      setSuccessMessage('User profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => deleteUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/admin/users');
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const handleSave = async () => {
    if (!user || !id) return;
    setIsSaving(true);
    try {
      const updates: Partial<User> = {
        name: editData.name || user.name,
        email: editData.email || user.email,
        phone: editData.phone || user.phone,
        address: editData.address || user.address,
      };
      await updateUserMutation.mutateAsync(updates);
      setUser(editData as UserProfile);
    } catch (error) {
      
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: UserProfile['status']) => {
    if (!user || !id) return;
    setIsSaving(true);
    try {
      await updateUserMutation.mutateAsync({ status: newStatus as 'active' | 'blocked' });
      setUser({ ...user, status: newStatus });
      setEditData({ ...editData, status: newStatus });
      setSuccessMessage(`User status changed to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;
    setIsSaving(true);
    try {
      await deleteUserMutation.mutateAsync();
    } catch (error) {
      
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || userLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">User Not Found</h1>
          <p className="text-muted-foreground mb-6">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
        </Card>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground">User ID: {user.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground font-semibold">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground font-semibold">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground font-semibold">{user.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Account Role
                      </label>
                      <p className="text-foreground font-semibold capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Address Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.address?.street || ''}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                      />
                    ) : (
                      <p className="text-foreground">{user.address.street}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address?.city || ''}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground">{user.address.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State/Province
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address?.state || ''}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground">{user.address.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Zip Code
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address?.zipCode || ''}
                          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground">{user.address.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address?.country || ''}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                        />
                      ) : (
                        <p className="text-foreground">{user.address.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Account Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Account Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">Account Created</span>
                    <span className="font-semibold text-foreground">
                      {user.createdAt.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="font-semibold text-foreground">
                      {user.lastLogin.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Verification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Status & Security
                </h3>
                <div className="space-y-4">
                  {/* Account Status */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">Account Status</p>
                    <div className="flex gap-2">
                      {(['active', 'inactive', 'suspended'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={isSaving}
                          className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                            user.status === status
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email Verified</span>
                      {user.verifiedEmail ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone Verified</span>
                      {user.verifiedPhone ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Order Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Activity
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-primary">{user.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-foreground">
                      {user.totalSpent.toLocaleString()} EGP
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Wishlist Items</p>
                    <p className="text-lg font-bold text-foreground">{user.wishlistItems}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isSaving}
                    onClick={() => {
                      // Reset password logic
                      
                    }}
                  >
                    Reset Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isSaving}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
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
              className="bg-card rounded-lg p-6 max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete User?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserProfile;