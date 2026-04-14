import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Settings,
  Globe,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Palette,
  Database,
  Shield,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { createSuperAdmin } from '@/utils/createSuperAdmin';
import { toast } from 'sonner';
import { getSettings, updateSettings, type Settings } from '@/services/settingsService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminSettings: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'website' | 'notifications' | 'security' | 'appearance' | 'business' | 'api'>('general');
  const [editSettings, setEditSettings] = useState<Partial<Settings>>({});
  const [showApiKeys, setShowApiKeys] = useState({
    stripe: false,
    paypal: false,
  });

  // Fetch settings from Firebase
  const { data: settings, isLoading, isError } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updates: Partial<Settings>) => updateSettings(updates, user?.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    },
    onError: (error: any) => {
      toast.error(isRTL ? `فشل حفظ الإعدادات: ${error.message}` : `Failed to save settings: ${error.message}`);
    },
  });

  // Initialize editSettings when settings are loaded
  useEffect(() => {
    if (settings) {
      setEditSettings(settings);
    }
  }, [settings]);

  const handleInputChange = (field: keyof Settings, value: any) => {
    setEditSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper to safely get value from editSettings
  const getValue = (field: keyof Settings, defaultValue: any = '') => {
    return editSettings[field] ?? settings?.[field] ?? defaultValue;
  };

  const handleSave = async () => {
    if (!settings) return;
    updateSettingsMutation.mutate(editSettings);
  };

  const handleReset = () => {
    if (settings) {
      setEditSettings(settings);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !settings) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-destructive">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="text-lg">{isRTL ? 'خطأ في تحميل الإعدادات' : 'Error loading settings'}</p>
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'website' as const, label: 'Website', icon: Globe },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'business' as const, label: 'Business', icon: MapPin },
    { id: 'api' as const, label: 'API & Integrations', icon: Database },
  ];

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
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your store configuration</p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await createSuperAdmin('fahmyuiux@gmail.com', 'Admin@123456', 'Super Admin');
                toast.success('Super admin user created successfully! Email: fahmyuiux@gmail.com, Password: Admin@123456');
              } catch (error: any) {
                if (error.message?.includes('already exists') || error.code === 'auth/email-already-in-use') {
                  toast.success('Super admin user already exists and has been updated to admin role');
                } else {
                  toast.error(error.message || 'Failed to create super admin');
                }
              }
            }}
          >
            Create Super Admin
          </Button>
        </motion.div>


        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <div className="flex overflow-x-auto border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Store Name
                      </label>
                      <Input
                        value={editSettings.storeName || ''}
                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Store Email
                      </label>
                      <Input
                        type="email"
                        value={getValue('storeEmail', '')}
                        onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Store Phone
                      </label>
                      <Input
                        type="tel"
                        value={getValue('storePhone', '')}
                        onChange={(e) => handleInputChange('storePhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Store Address
                      </label>
                      <Input
                        value={getValue('storeAddress', '')}
                        onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City
                      </label>
                      <Input
                        value={getValue('storeCity', '')}
                        onChange={(e) => handleInputChange('storeCity', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country
                      </label>
                      <Input
                        value={getValue('storeCountry', '')}
                        onChange={(e) => handleInputChange('storeCountry', e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Website Settings */}
              {activeTab === 'website' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Website URL
                    </label>
                    <Input
                      type="url"
                      value={getValue('websiteUrl', '')}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('maintenanceMode', false)}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Maintenance Mode</span>
                    </label>
                    <p className="text-xs text-muted-foreground ml-7">
                      Enable to show maintenance message to all visitors
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('allowRegistration', true)}
                        onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Allow Registration</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('requireEmailVerification', false)}
                        onChange={(e) =>
                          handleInputChange('requireEmailVerification', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Require Email Verification
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('emailNotifications', true)}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Email Notifications</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('smsNotifications', false)}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">SMS Notifications</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('orderNotifications', true)}
                        onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Order Notifications</span>
                    </label>
                    <p className="text-xs text-muted-foreground ml-7">
                      Receive notifications for new orders
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('marketingEmails', true)}
                        onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Marketing Emails</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('twoFactorAuth', false)}
                        onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Two-Factor Authentication
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      value={getValue('sessionTimeout', 30)}
                      onChange={(e) =>
                        handleInputChange('sessionTimeout', parseInt(e.target.value) || 0)
                      }
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password Minimum Length
                    </label>
                    <Input
                      type="number"
                      value={getValue('passwordMinLength', 8)}
                      onChange={(e) =>
                        handleInputChange('passwordMinLength', parseInt(e.target.value) || 0)
                      }
                      min="6"
                    />
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={getValue('primaryColor', '#3b82f6')}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={getValue('primaryColor', '#3b82f6')}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={getValue('secondaryColor', '#8b5cf6')}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={getValue('secondaryColor', '#8b5cf6')}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={getValue('accentColor', '#ec4899')}
                          onChange={(e) => handleInputChange('accentColor', e.target.value)}
                          className="h-10 w-20 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={getValue('accentColor', '#ec4899')}
                          onChange={(e) => handleInputChange('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getValue('darkMode', false)}
                        onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">Enable Dark Mode</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Business Settings */}
              {activeTab === 'business' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Currency
                      </label>
                      <select
                        value={getValue('currency', 'EGP')}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="EGP">EGP (Egyptian Pound)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="SAR">SAR (Saudi Riyal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tax Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={getValue('taxRate', 20)}
                        onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Flat Shipping Rate
                      </label>
                      <Input
                        type="number"
                        value={getValue('shippingFlatRate', 200)}
                        onChange={(e) =>
                          handleInputChange('shippingFlatRate', parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Free Shipping Threshold
                      </label>
                      <Input
                        type="number"
                        value={getValue('freeShippingThreshold', 5000)}
                        onChange={(e) =>
                          handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* API & Integrations */}
              {activeTab === 'api' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stripe API Key
                    </label>
                    <div className="relative">
                      <Input
                        type={showApiKeys.stripe ? 'text' : 'password'}
                        value={getValue('stripeApiKey', '')}
                        onChange={(e) => handleInputChange('stripeApiKey', e.target.value)}
                        placeholder="sk_live_..."
                      />
                      <button
                        onClick={() =>
                          setShowApiKeys((prev) => ({
                            ...prev,
                            stripe: !prev.stripe,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKeys.stripe ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      PayPal Client ID
                    </label>
                    <div className="relative">
                      <Input
                        type={showApiKeys.paypal ? 'text' : 'password'}
                        value={getValue('paypalClientId', '')}
                        onChange={(e) => handleInputChange('paypalClientId', e.target.value)}
                        placeholder="AXxxx..."
                      />
                      <button
                        onClick={() =>
                          setShowApiKeys((prev) => ({
                            ...prev,
                            paypal: !prev.paypal,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKeys.paypal ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        SMTP Server
                      </label>
                      <Input
                        value={getValue('smtpServer', 'smtp.gmail.com')}
                        onChange={(e) => handleInputChange('smtpServer', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        SMTP Port
                      </label>
                      <Input
                        type="number"
                        value={getValue('smtpPort', 587)}
                        onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 justify-end sticky bottom-0 bg-background/80 backdrop-blur p-4 rounded-lg border border-border"
        >
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={updateSettingsMutation.isPending}
          >
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="gap-2"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isRTL ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;