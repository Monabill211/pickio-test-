import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  category: string;
  categoryId?: string;
  stock: number;
  images: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  visible: boolean;
  badge?: 'new' | 'sale' | 'bestseller';
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Convert Firestore data to Product
const convertFirestoreProduct = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name_ar: data.name_ar || '',
    name_en: data.name_en || '',
    description_ar: data.description_ar || '',
    description_en: data.description_en || '',
    price: data.price || 0,
    originalPrice: data.originalPrice,
    discountPrice: data.discountPrice,
    category: data.category || '',
    categoryId: data.categoryId,
    stock: data.stock || 0,
    images: data.images || [],
    colors: data.colors || [],
    sizes: data.sizes || [],
    materials: data.materials || [],
    visible: data.visible !== false, // Default to true
    badge: data.badge,
    inStock: (data.stock || 0) > 0,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

// Get all products
export const getProducts = async (filters?: {
  category?: string;
  visible?: boolean;
  inStock?: boolean;
}): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [];
    
    // Apply filters
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters?.visible !== undefined) {
      constraints.push(where('visible', '==', filters.visible));
    }
    if (filters?.inStock !== undefined) {
      constraints.push(where('stock', filters.inStock ? '>' : '==', 0));
    }
    
    // Only add orderBy if we have a where clause, otherwise it requires an index
    // If we have filters, we need to be careful about composite indexes
    if (constraints.length > 0) {
      // If we have a where clause, we can't always use orderBy without an index
      // So we'll fetch all and sort in memory if needed
      const q = query(productsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(convertFirestoreProduct);
      
      // Sort in memory
      return products.sort((a, b) => {
        const aDate = a.createdAt?.getTime() || 0;
        const bDate = b.createdAt?.getTime() || 0;
        return bDate - aDate;
      });
    } else {
      // No filters, we can use orderBy directly
      constraints.push(orderBy('createdAt', 'desc'));
      const q = query(productsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertFirestoreProduct);
    }
  } catch (error: any) {
    // If it's an index error, try fetching without orderBy and sort in memory
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      
      try {
        const productsRef = collection(db, 'products');
        const constraints: QueryConstraint[] = [];
        
        if (filters?.category) {
          constraints.push(where('category', '==', filters.category));
        }
        if (filters?.visible !== undefined) {
          constraints.push(where('visible', '==', filters.visible));
        }
        if (filters?.inStock !== undefined) {
          constraints.push(where('stock', filters.inStock ? '>' : '==', 0));
        }
        
        // Fetch without orderBy
        const q = constraints.length > 0 ? query(productsRef, ...constraints) : query(productsRef);
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(convertFirestoreProduct);
        
        // Sort in memory
        return products.sort((a, b) => {
          const aDate = a.createdAt?.getTime() || 0;
          const bDate = b.createdAt?.getTime() || 0;
          return bDate - aDate;
        });
      } catch (fallbackError) {
        
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }
    
    return convertFirestoreProduct(productSnap);
  } catch (error) {
    
    throw error;
  }
};

// Subscribe to products (real-time)
export const subscribeToProducts = (
  callback: (products: Product[]) => void,
  filters?: {
    category?: string;
    visible?: boolean;
    inStock?: boolean;
  }
): (() => void) => {
  const productsRef = collection(db, 'products');
  const constraints: QueryConstraint[] = [];
  
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.visible !== undefined) {
    constraints.push(where('visible', '==', filters.visible));
  }
  if (filters?.inStock !== undefined) {
    constraints.push(where('stock', filters.inStock ? '>' : '==', 0));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  const q = query(productsRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(convertFirestoreProduct);
    callback(products);
  });
};

// Add new product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const productsRef = collection(db, 'products');
    const now = Timestamp.now();
    
    const productData = {
      ...product,
      inStock: (product.stock || 0) > 0,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(productsRef, productData);
    return docRef.id;
  } catch (error) {
    
    throw error;
  }
};

// Update product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Recalculate inStock if stock is being updated
    if (updates.stock !== undefined) {
      updateData.inStock = updates.stock > 0;
    }
    
    // Remove id, createdAt, updatedAt from updates
    delete updateData.id;
    delete updateData.createdAt;
    
    await updateDoc(productRef, updateData);
  } catch (error) {
    
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return getProducts({ category: categoryId, visible: true });
};

// Get featured products (visible products with badge, or first visible products if no badges)
export const getFeaturedProducts = async (limit?: number): Promise<Product[]> => {
  const products = await getProducts({ visible: true });
  // First try to get products with badges
  let featured = products.filter(p => p.badge && p.inStock);
  
  // If no featured products with badges, get first visible products
  if (featured.length === 0) {
    featured = products.filter(p => p.inStock);
  }
  
  if (limit) {
    return featured.slice(0, limit);
  }
  
  return featured;
};
