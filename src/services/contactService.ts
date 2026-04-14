import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  imageUrl?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  repliedAt?: Date;
  adminNotes?: string;
}

// Convert Firestore data to ContactMessage
const convertFirestoreContact = (doc: any): ContactMessage => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    subject: data.subject || '',
    message: data.message || '',
    imageUrl: data.imageUrl,
    status: data.status || 'new',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    repliedAt: data.repliedAt?.toDate(),
    adminNotes: data.adminNotes,
  };
};

// Add new contact message
export const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    const messagesRef = collection(db, 'contactMessages');
    const now = Timestamp.now();
    
    const messageData = {
      ...message,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(messagesRef, messageData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get all contact messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const messagesRef = collection(db, 'contactMessages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreContact);
  } catch (error) {
    throw error;
  }
};

// Update contact message status
export const updateContactMessageStatus = async (
  id: string,
  status: ContactMessage['status'],
  adminNotes?: string
): Promise<void> => {
  try {
    const messageRef = doc(db, 'contactMessages', id);
    const updates: any = {
      status,
      updatedAt: Timestamp.now(),
    };
    
    if (status === 'replied') {
      updates.repliedAt = Timestamp.now();
    }
    
    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }
    
    await updateDoc(messageRef, updates);
  } catch (error) {
    throw error;
  }
};

// Delete contact message
export const deleteContactMessage = async (id: string): Promise<void> => {
  try {
    const messageRef = doc(db, 'contactMessages', id);
    await deleteDoc(messageRef);
  } catch (error) {
    throw error;
  }
};
