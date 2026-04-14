import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Settings {
  // General
  storeName: string;
  storeName_ar?: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeAddress_ar?: string;
  storeCity: string;
  storeCity_ar?: string;
  storeCountry: string;
  storeCountry_ar?: string;

  // Website
  websiteUrl: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  marketingEmails: boolean;

  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordMinLength: number;

  // Appearance
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;

  // Business
  currency: string;
  taxRate: number;
  shippingFlatRate: number;
  freeShippingThreshold: number;

  // API & Integrations
  stripeApiKey: string;
  paypalClientId?: string;
  smtpServer: string;
  smtpPort: number;

  // Metadata
  updatedAt: Date;
  updatedBy?: string;
}

const SETTINGS_DOC_ID = 'app_settings';

// Default settings
const defaultSettings: Omit<Settings, 'updatedAt'> = {
  storeName: 'pickio Furniture Store',
  storeName_ar: 'دار البيت للأثاث',
  storeEmail: 'pickiofurniture@gmail.com',
  storePhone: '+20 10 16434958',
  storeAddress: '7 Ismat Al-Khudari Street, off Al-Nuzha Street, behind Al-Leithi Car Showroom, Nasr City',
  storeAddress_ar: '٧ شارع عصمت الخضري متفرع من شارع النزهه خلف معرض سيارات الليثي للسيارات مدينة نصر',
  storeCity: 'Cairo',
  storeCity_ar: 'القاهرة',
  storeCountry: 'Egypt',
  storeCountry_ar: 'مصر',
  websiteUrl: 'https://darhome.com',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  emailNotifications: true,
  smsNotifications: false,
  orderNotifications: true,
  marketingEmails: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
  passwordMinLength: 8,
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  accentColor: '#ec4899',
  darkMode: false,
  currency: 'EGP',
  taxRate: 20,
  shippingFlatRate: 200,
  freeShippingThreshold: 5000,
  stripeApiKey: '',
  paypalClientId: '',
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
};

// Convert Firestore data to Settings
const convertFirestoreSettings = (data: any): Settings => {
  return {
    ...defaultSettings,
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Get settings
export const getSettings = async (): Promise<Settings> => {
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return convertFirestoreSettings(settingsSnap.data());
    } else {
      // Create default settings if they don't exist
      const newSettings: Omit<Settings, 'updatedAt'> & { updatedAt: Timestamp } = {
        ...defaultSettings,
        updatedAt: Timestamp.now(),
      };
      await setDoc(settingsRef, newSettings);
      return convertFirestoreSettings(newSettings);
    }
  } catch (error) {
    throw error;
  }
};

// Update settings
export const updateSettings = async (settings: Partial<Settings>, userId?: string): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const currentSettings = await getSettings();

    const updatedData: any = {
      ...currentSettings,
      ...settings,
      updatedAt: Timestamp.now(),
    };

    // Only include updatedBy if userId is provided (Firestore doesn't allow undefined)
    if (userId) {
      updatedData.updatedBy = userId;
    }

    await setDoc(settingsRef, updatedData, { merge: true });
  } catch (error) {
    throw error;
  }
};
