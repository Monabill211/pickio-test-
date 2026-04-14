import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ContentItem {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  type: 'page' | 'banner' | 'faq' | 'testimonial' | 'blog';
  content_en: string;
  content_ar: string;
  image?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  authorId?: string;
  views: number;
  metaDescription_en?: string;
  metaDescription_ar?: string;
  tags?: string[];
}

// Convert Firestore data to ContentItem
const convertFirestoreContent = (doc: any): ContentItem => {
  const data = doc.data();
  return {
    id: doc.id,
    title_en: data.title_en || '',
    title_ar: data.title_ar || '',
    slug: data.slug || '',
    type: data.type || 'page',
    content_en: data.content_en || '',
    content_ar: data.content_ar || '',
    image: data.image,
    published: data.published ?? true,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    author: data.author || 'Admin',
    authorId: data.authorId,
    views: data.views || 0,
    metaDescription_en: data.metaDescription_en,
    metaDescription_ar: data.metaDescription_ar,
    tags: data.tags || [],
  };
};

// Get all content items
export const getContentItems = async (type?: ContentItem['type']): Promise<ContentItem[]> => {
  try {
    const contentsRef = collection(db, 'content');
    let q;

    if (type) {
      q = query(contentsRef, where('type', '==', type), orderBy('updatedAt', 'desc'));
    } else {
      q = query(contentsRef, orderBy('updatedAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreContent);
  } catch (error) {
    throw error;
  }
};

// Get single content item by ID
export const getContentItem = async (id: string): Promise<ContentItem | null> => {
  try {
    const contentRef = doc(db, 'content', id);
    const contentSnap = await getDoc(contentRef);

    if (contentSnap.exists()) {
      return convertFirestoreContent(contentSnap);
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get content item by slug
export const getContentItemBySlug = async (slug: string): Promise<ContentItem | null> => {
  try {
    const contentsRef = collection(db, 'content');
    const q = query(contentsRef, where('slug', '==', slug), where('published', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return convertFirestoreContent(querySnapshot.docs[0]);
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Add new content item
export const addContentItem = async (
  content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'views'>,
  authorId?: string
): Promise<string> => {
  try {
    const contentsRef = collection(db, 'content');
    const now = Timestamp.now();

    const contentData = {
      ...content,
      authorId,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(contentsRef, contentData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Update content item
export const updateContentItem = async (
  id: string,
  updates: Partial<Omit<ContentItem, 'id' | 'createdAt' | 'views'>>
): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(contentRef, updateData);
  } catch (error) {
    throw error;
  }
};

// Delete content item
export const deleteContentItem = async (id: string): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', id);
    await deleteDoc(contentRef);
  } catch (error) {
    throw error;
  }
};

// Increment views
export const incrementContentView = async (id: string): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', id);
    const contentSnap = await getDoc(contentRef);

    if (contentSnap.exists()) {
      const currentViews = contentSnap.data().views || 0;
      await updateDoc(contentRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    // Don't throw - this is a non-critical operation
  }
};

// Toggle publish status
export const toggleContentPublish = async (id: string, published: boolean): Promise<void> => {
  try {
    const contentRef = doc(db, 'content', id);
    await updateDoc(contentRef, {
      published,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};
