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

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'blocked';
  joinDate: Date;
  orders?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Convert Firestore data to User
const convertFirestoreUser = (doc: any): User => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone,
    role: data.role || 'customer',
    status: data.status || 'active',
    joinDate: data.joinDate?.toDate() || data.createdAt?.toDate() || new Date(),
    orders: data.orders || 0,
    address: data.address,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
};

// Get all users
export const getUsers = async (filters?: {
  role?: 'customer' | 'admin';
  status?: 'active' | 'blocked';
}): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const constraints: QueryConstraint[] = [];
    
    if (filters?.role) {
      constraints.push(where('role', '==', filters.role));
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    constraints.push(orderBy('joinDate', 'desc'));
    
    const q = query(usersRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertFirestoreUser);
  } catch (error) {
    
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return convertFirestoreUser(userSnap);
  } catch (error) {
    
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertFirestoreUser(querySnapshot.docs[0]);
  } catch (error) {
    
    throw error;
  }
};

// Subscribe to users (real-time)
export const subscribeToUsers = (
  callback: (users: User[]) => void,
  filters?: {
    role?: 'customer' | 'admin';
    status?: 'active' | 'blocked';
  }
): (() => void) => {
  const usersRef = collection(db, 'users');
  const constraints: QueryConstraint[] = [];
  
  if (filters?.role) {
    constraints.push(where('role', '==', filters.role));
  }
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  constraints.push(orderBy('joinDate', 'desc'));
  
  const q = query(usersRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map(convertFirestoreUser);
    callback(users);
  });
};

// Add new user
export const addUser = async (user: Omit<User, 'id' | 'joinDate' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const usersRef = collection(db, 'users');
    const now = Timestamp.now();
    
    const userData = {
      ...user,
      orders: user.orders || 0,
      joinDate: now,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(usersRef, userData);
    return docRef.id;
  } catch (error) {
    
    throw error;
  }
};

// Update user
export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Remove id, joinDate, createdAt, updatedAt from updates
    delete updateData.id;
    delete updateData.joinDate;
    delete updateData.createdAt;
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);
  } catch (error) {
    
    throw error;
  }
};

// Toggle user status
export const toggleUserStatus = async (id: string): Promise<void> => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error('User not found');
  }
  
  const newStatus = user.status === 'active' ? 'blocked' : 'active';
  return updateUser(id, { status: newStatus });
};

// Update user role
export const updateUserRole = async (id: string, role: 'customer' | 'admin'): Promise<void> => {
  return updateUser(id, { role });
};
