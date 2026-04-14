import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/data/products';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Get all categories from Firebase
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name || { ar: '', en: '' },
        icon: data.icon || '',
        image: data.image || '',
        productCount: data.productCount || 0,
      });
    });
    
    return categories;
  } catch (error) {
    
    throw error;
  }
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    const categorySnap = await getDoc(categoryRef);
    
    if (categorySnap.exists()) {
      const data = categorySnap.data();
      return {
        id: categorySnap.id,
        name: data.name || { ar: '', en: '' },
        icon: data.icon || '',
        image: data.image || '',
        productCount: data.productCount || 0,
      };
    }
    
    return null;
  } catch (error) {
    
    throw error;
  }
};

/**
 * Subscribe to categories changes (real-time updates)
 */
export const subscribeToCategories = (
  callback: (categories: Category[]) => void
): (() => void) => {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, orderBy('order', 'asc'));
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot<DocumentData>) => {
      const categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name || { ar: '', en: '' },
          icon: data.icon || '',
          image: data.image || '',
          productCount: data.productCount || 0,
        });
      });
      callback(categories);
    },
    (error) => {
      
    }
  );
  
  return unsubscribe;
};

/**
 * Add a new category
 */
export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const docRef = await addDoc(categoriesRef, {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    
    throw error;
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (
  id: string,
  updates: Partial<Omit<Category, 'id'>>
): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryRef);
  } catch (error) {
    
    throw error;
  }
};

/**
 * Get product count for a category
 */
export const getCategoryProductCount = async (categoryId: string): Promise<number> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', categoryId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    
    return 0;
  }
};
