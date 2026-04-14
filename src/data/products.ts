import sofa1 from '@/assets/products/sofa-1.jpg';
import bed1 from '@/assets/products/bed-1.jpg';
import dining1 from '@/assets/products/dining-1.jpg';
import table1 from '@/assets/products/table-1.jpg';
import chair1 from '@/assets/products/chair-1.jpg';

export interface Product {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  badge?: 'new' | 'sale' | 'bestseller';
  colors?: string[];
  materials?: string[];
}

export interface Category {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  icon: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'sofas',
    name: { ar: 'الأرائك', en: 'Sofas' },
    icon: 'sofa',
    image: sofa1,
    productCount: 24,
  },
  {
    id: 'beds',
    name: { ar: 'غرف النوم', en: 'Bedrooms' },
    icon: 'bed',
    image: bed1,
    productCount: 18,
  },
  {
    id: 'dining',
    name: { ar: 'غرف السفرة', en: 'Dining' },
    icon: 'utensils',
    image: dining1,
    productCount: 15,
  },
  {
    id: 'tables',
    name: { ar: 'الطاولات', en: 'Tables' },
    icon: 'square',
    image: table1,
    productCount: 32,
  },
  {
    id: 'chairs',
    name: { ar: 'الكراسي', en: 'Chairs' },
    icon: 'armchair',
    image: chair1,
    productCount: 28,
  },
];

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: { ar: 'أريكة مودرن فاخرة', en: 'Luxury Modern Sofa' },
    description: {
      ar: 'أريكة عصرية مريحة بتصميم أنيق وخامات عالية الجودة',
      en: 'Contemporary comfortable sofa with elegant design and high-quality materials',
    },
    price: 24999,
    originalPrice: 29999,
    category: 'sofas',
    image: sofa1,
    inStock: true,
    badge: 'sale',
    colors: ['Beige', 'Gray', 'Brown'],
    materials: ['Velvet', 'Linen'],
  },
  {
    id: '2',
    name: { ar: 'سرير ملكي فاخر', en: 'Royal Luxury Bed' },
    description: {
      ar: 'سرير ملكي بتصميم معاصر وراحة استثنائية',
      en: 'Royal bed with contemporary design and exceptional comfort',
    },
    price: 35999,
    category: 'beds',
    image: bed1,
    inStock: true,
    badge: 'bestseller',
    colors: ['Gray', 'Beige', 'Navy'],
    materials: ['Upholstered Fabric'],
  },
  {
    id: '3',
    name: { ar: 'طاولة سفرة خشب بلوط', en: 'Oak Dining Table Set' },
    description: {
      ar: 'طقم سفرة من خشب البلوط الفاخر مع كراسي مطابقة',
      en: 'Luxury oak wood dining set with matching chairs',
    },
    price: 18999,
    category: 'dining',
    image: dining1,
    inStock: true,
    badge: 'new',
    colors: ['Natural Oak', 'Walnut'],
    materials: ['Solid Oak Wood'],
  },
  {
    id: '4',
    name: { ar: 'طاولة قهوة رخام', en: 'Marble Coffee Table' },
    description: {
      ar: 'طاولة قهوة أنيقة بسطح رخامي وقاعدة ذهبية',
      en: 'Elegant coffee table with marble top and gold base',
    },
    price: 8999,
    originalPrice: 11999,
    category: 'tables',
    image: table1,
    inStock: true,
    badge: 'sale',
    colors: ['White Marble', 'Black Marble'],
    materials: ['Marble', 'Gold Metal'],
  },
  {
    id: '5',
    name: { ar: 'كرسي أكسنت تيراكوتا', en: 'Terracotta Accent Chair' },
    description: {
      ar: 'كرسي مميز بتصميم منحني وخامة مخملية فاخرة',
      en: 'Distinctive chair with curved design and luxurious velvet fabric',
    },
    price: 6999,
    category: 'chairs',
    image: chair1,
    inStock: true,
    badge: 'bestseller',
    colors: ['Terracotta', 'Olive', 'Navy'],
    materials: ['Velvet', 'Wood'],
  },
  {
    id: '6',
    name: { ar: 'أريكة زاوية عصرية', en: 'Modern Corner Sofa' },
    description: {
      ar: 'أريكة زاوية واسعة مثالية للغرف الكبيرة',
      en: 'Spacious corner sofa perfect for large living rooms',
    },
    price: 42999,
    category: 'sofas',
    image: sofa1,
    inStock: false,
  },
];

export const formatPrice = (price: number, currency: string = 'EGP'): string => {
  return `${price.toLocaleString()} ${currency === 'EGP' ? 'ج.م' : currency}`;
};
