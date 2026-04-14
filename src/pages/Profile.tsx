import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X, Heart, ShoppingBag, Settings, Loader2, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { logoutUser } from '@/services/authService';
import { getUserById, updateUser } from '@/services/userService';
import { getOrders } from '@/services/orderService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useUserAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Fetch user data from Firestore using UID
  const { data: userData, isLoading: userLoading, refetch: refetchUser } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: () => user?.uid ? getUserById(user.uid) : null,
    enabled: !!user?.uid,
  });

  // Fetch user orders - also check by email if customerId is missing
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['userOrders', user?.uid, user?.email],
    queryFn: async () => {
      if (!user?.uid && !user?.email) return [];
      
      try {
        const allUserOrders: any[] = [];
        
        // Try by customerId first
        if (user?.uid) {
          const ordersById = await getOrders({ customerId: user.uid });
          allUserOrders.push(...ordersById);
        }
        
        // Also try by email to catch guest orders or orders with email match
        if (user?.email) {
          const userEmail = user.email.toLowerCase();
          const ordersByEmail = await getOrders({ customerEmail: userEmail });
          // Add orders that aren't already in the list (avoid duplicates)
          ordersByEmail.forEach(order => {
            if (!allUserOrders.find(o => o.id === order.id)) {
              allUserOrders.push(order);
            }
          });
        }
        
        // If still no orders, try fallback: get all and filter client-side
        if (allUserOrders.length === 0 && user?.email) {
          const userEmail = user.email.toLowerCase();
          const allOrders = await getOrders();
          const filteredOrders = allOrders.filter(order => 
            (order.customer?.email || '').toLowerCase() === userEmail ||
            order.customerEmail?.toLowerCase() === userEmail
          );
          allUserOrders.push(...filteredOrders);
        }
        
        // Sort by createdAt descending
        return allUserOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
    },
    enabled: !!(user?.uid || user?.email),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Refetch orders when navigating with order parameter
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam && user) {
      // Small delay to ensure order is saved
      setTimeout(() => {
        refetchOrders();
      }, 1000);
    }
  }, [searchParams, user, refetchOrders]);

  // Get wishlist count from localStorage
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(wishlist.length);
  }, []);

  // Initialize profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.uid || '',
    firstName: userData?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || '',
    lastName: userData?.name?.split(' ').slice(1).join(' ') || user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: userData?.phone || '',
    address: userData?.address?.street || '',
    city: userData?.address?.city || '',
    country: userData?.address?.country || '',
    zipCode: userData?.address?.zipCode || '',
    avatar: user?.photoURL || undefined,
  });

  const [editData, setEditData] = useState(profile);

  // Update profile when userData changes
  useEffect(() => {
    if (userData && user) {
      const nameParts = userData.name.split(' ');
      const updatedProfile = {
        id: user.uid,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || userData.email || '',
        phone: userData.phone || '',
        address: userData.address?.street || '',
        city: userData.address?.city || '',
        country: userData.address?.country || '',
        zipCode: userData.address?.zipCode || '',
        avatar: user.photoURL || undefined,
      };
      setProfile(updatedProfile);
      setEditData(updatedProfile);
    } else if (user) {
      const nameParts = (user.displayName || user.email?.split('@')[0] || '').split(' ');
      const updatedProfile = {
        id: user.uid,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        avatar: user.photoURL || undefined,
      };
      setProfile(updatedProfile);
      setEditData(updatedProfile);
    }
  }, [userData, user]);

  if (authLoading || userLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-4"
          >
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isRTL ? 'لم تقم بتسجيل الدخول' : 'Not Logged In'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isRTL ? 'يرجى تسجيل الدخول لعرض ملفك الشخصي' : 'Please log in to view your profile'}
              </p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button onClick={() => navigate('/login')} className="flex-1">
                  {isRTL ? 'تسجيل الدخول' : 'Login'}
                </Button>
                <Button onClick={() => navigate('/register')} variant="outline" className="flex-1">
                  {isRTL ? 'إنشاء حساب' : 'Register'}
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    try {
      // Update user in Firestore
      const name = `${editData.firstName} ${editData.lastName}`.trim();
      await updateUser(user.uid, {
        name,
        phone: editData.phone,
        address: {
          street: editData.address,
          city: editData.city,
          state: '',
          zipCode: editData.zipCode,
          country: editData.country,
        },
      });

      setProfile(editData);
      setIsEditing(false);
      refetchUser(); // Refresh user data
      toast.success(isRTL ? 'تم حفظ الملف الشخصي بنجاح' : 'Profile saved successfully');
    } catch (error) {
      
      toast.error(isRTL ? 'خطأ في حفظ الملف الشخصي' : 'Error saving profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success(isRTL ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
      navigate('/');
    } catch (error) {
      
      toast.error(isRTL ? 'خطأ في تسجيل الخروج' : 'Error logging out');
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {isRTL ? 'حسابي' : 'My Profile'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isRTL ? 'إدارة معلومات حسابك والطلبات' : 'Manage your account information and orders'}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-5 mb-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'الطلبات' : 'Orders'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <Heart className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-bold text-foreground">{wishlistCount}</p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'المفضلة' : 'Wishlist'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-semibold text-foreground line-clamp-1">
                {profile.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-card p-6 text-center col-span-2 md:col-span-1"
            >
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold text-foreground line-clamp-1">
                {profile.city}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? 'المدينة' : 'City'}
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Profile Card */}
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" id="profile-tabs">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">
                    {isRTL ? 'البيانات الشخصية' : 'Personal'}
                  </TabsTrigger>
                  <TabsTrigger value="address">
                    {isRTL ? 'العنوان' : 'Address'}
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    {isRTL ? 'الأمان' : 'Security'}
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="rounded-lg border border-border p-6 mt-4">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? 'الاسم الأول' : 'First Name'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={editData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder={isRTL ? 'الاسم الأول' : 'First Name'}
                          />
                        ) : (
                          <p className="text-foreground font-medium">{profile.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? 'الاسم الأخير' : 'Last Name'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={editData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder={isRTL ? 'الاسم الأخير' : 'Last Name'}
                          />
                        ) : (
                          <p className="text-foreground font-medium">{profile.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'}
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Address Tab */}
                <TabsContent value="address" className="rounded-lg border border-border p-6 mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? 'العنوان' : 'Address'}
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder={isRTL ? 'العنوان' : 'Address'}
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.address}</p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? 'المدينة' : 'City'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={editData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder={isRTL ? 'المدينة' : 'City'}
                          />
                        ) : (
                          <p className="text-foreground font-medium">{profile.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {isRTL ? 'البلد' : 'Country'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={editData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder={isRTL ? 'البلد' : 'Country'}
                          />
                        ) : (
                          <p className="text-foreground font-medium">{profile.country}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {isRTL ? 'الرمز البريدي' : 'Zip Code'}
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder={isRTL ? 'الرمز البريدي' : 'Zip Code'}
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.zipCode}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="rounded-lg border border-border p-6 mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                      </h3>
                      <Button variant="outline" className="w-full sm:w-auto">
                        {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                      </Button>
                    </div>

                    <hr className="border-border" />

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        {isRTL ? 'الجلسات النشطة' : 'Active Sessions'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {isRTL ? 'تسجيل دخول من جهاز واحد' : 'Logged in from 1 device'}
                      </p>
                      <Button variant="outline" size="sm">
                        {isRTL ? 'تسجيل خروج من جميع الأجهزة' : 'Logout from All Devices'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <X className="h-4 w-4" />
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    {isRTL ? 'تعديل البيانات' : 'Edit Profile'}
                  </Button>
                )}
              </div>

              {/* Quick Links */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-3">
                <h3 className="font-semibold text-foreground mb-4">
                  {isRTL ? 'روابط سريعة' : 'Quick Links'}
                </h3>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    // Scroll to orders section or show orders tab
                    const ordersSection = document.getElementById('orders-section');
                    if (ordersSection) {
                      ordersSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isRTL ? 'طلباتي' : 'My Orders'}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/wishlist')}
                >
                  <Heart className="h-4 w-4" />
                  {isRTL ? 'المفضلة' : 'Wishlist'}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setActiveTab('security');
                    // Scroll to tabs section smoothly
                    setTimeout(() => {
                      const tabsSection = document.getElementById('profile-tabs');
                      tabsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  {isRTL ? 'الإعدادات' : 'Settings'}
                </Button>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isRTL ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            id="orders-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-lg border border-border bg-card p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {isRTL ? 'طلباتي' : 'My Orders'}
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {isRTL ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}
                </p>
                <Button onClick={() => navigate('/shop')} variant="outline">
                  {isRTL ? 'ابدأ التسوق' : 'Start Shopping'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Show order details in a modal or navigate
                      toast.info(isRTL ? `رقم الطلب: ${order.orderNumber}` : `Order: ${order.orderNumber}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {isRTL ? 'رقم الطلب' : 'Order'} #{order.orderNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
                            style: 'currency',
                            currency: 'EGP',
                          }).format(order.total)}
                        </p>
                        <span
                          className={cn(
                            'inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1',
                            order.status === 'delivered' && 'bg-green-100 text-green-800',
                            order.status === 'processing' && 'bg-blue-100 text-blue-800',
                            order.status === 'shipped' && 'bg-purple-100 text-purple-800',
                            order.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                            order.status === 'cancelled' && 'bg-red-100 text-red-800'
                          )}
                        >
                          {order.status === 'delivered' && (isRTL ? 'تم التسليم' : 'Delivered')}
                          {order.status === 'processing' && (isRTL ? 'جاري العمل' : 'Processing')}
                          {order.status === 'shipped' && (isRTL ? 'تم الشحن' : 'Shipped')}
                          {order.status === 'pending' && (isRTL ? 'قيد الانتظار' : 'Pending')}
                          {order.status === 'cancelled' && (isRTL ? 'ملغاة' : 'Cancelled')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {order.items.length} {isRTL ? 'منتج' : 'items'} • {order.paymentMethod === 'cash' ? (isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery') : order.paymentMethod === 'instapay' ? 'InstaPay' : order.paymentMethod === 'vodafone' ? (isRTL ? 'محفظة فودافون' : 'Vodafone Wallet') : order.paymentMethod}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-semibold">{isRTL ? 'رقم التتبع' : 'Tracking'}:</span> {order.trackingNumber}
                      </p>
                    )}
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-foreground mb-1">
                              {t('common.notesFromStore')}
                            </p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {order.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;