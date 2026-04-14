import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Test Firebase connection and Firestore access
 */
export const testFirebaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Test 1: Check if we can access Firestore
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      message: `✅ Firebase connection successful! Found ${categories.length} categories.`,
      details: {
        categoriesCount: categories.length,
        categories: categories,
        firestoreConnected: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.message : String(error),
        firestoreConnected: false,
      },
    };
  }
};

/**
 * Test reading a specific category
 */
export const testReadCategory = async (categoryId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (categorySnap.exists()) {
      return {
        success: true,
        message: `✅ Category "${categoryId}" found!`,
        data: {
          id: categorySnap.id,
          ...categorySnap.data(),
        },
      };
    } else {
      return {
        success: false,
        message: `❌ Category "${categoryId}" not found in Firestore.`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Error reading category: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
