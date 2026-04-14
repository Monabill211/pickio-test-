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

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerEmail?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

// Convert Firestore data to Order
const convertFirestoreOrder = (doc: any): Order => {
  const data = doc.data ? doc.data() : doc; // Handle both Firestore doc and plain object
  const docId = doc.id || doc.id || '';
  
  // Helper function to safely convert Firestore Timestamp to Date
  const toDate = (value: any): Date => {
    if (!value) return new Date();
    // If it's already a Date object
    if (value instanceof Date) return value;
    // If it's a Firestore Timestamp (has toDate method)
    if (value && typeof value.toDate === 'function') return value.toDate();
    // If it's a number (timestamp in milliseconds)
    if (typeof value === 'number') return new Date(value);
    // If it's a string, try to parse it
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    // If it's an object with seconds property (Firestore Timestamp structure)
    if (value && typeof value === 'object' && 'seconds' in value) {
      return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1000000);
    }
    // Default fallback
    return new Date();
  };
  
  return {
    id: docId,
    orderNumber: data.orderNumber || `ORD-${docId.slice(0, 6).toUpperCase()}`,
    customerId: data.customerId,
    customerEmail: data.customerEmail || data.customer?.email || '',
    customer: data.customer || {
      name: '',
      email: '',
      phone: '',
    },
    status: data.status || 'pending',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    deliveryAddress: data.deliveryAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    items: data.items || [],
    subtotal: data.subtotal || 0,
    shipping: data.shipping || 0,
    tax: data.tax || 0,
    total: data.total || 0,
    paymentMethod: data.paymentMethod || '',
    trackingNumber: data.trackingNumber,
    notes: data.notes,
  };
};

// Get all orders
export const getOrders = async (filters?: {
  status?: Order['status'];
  customerId?: string;
  customerEmail?: string;
}): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const constraints: QueryConstraint[] = [];
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.customerId) {
      constraints.push(where('customerId', '==', filters.customerId));
    }
    if (filters?.customerEmail) {
      constraints.push(where('customerEmail', '==', filters.customerEmail.toLowerCase()));
    }
    
    // Try with orderBy first
    try {
      if (constraints.length > 0) {
        constraints.push(orderBy('createdAt', 'desc'));
        const q = query(ordersRef, ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(convertFirestoreOrder);
      } else {
        // Get all orders with orderBy (for admin panel)
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(convertFirestoreOrder);
      }
    } catch (orderByError: any) {
      // If index error, fall back to getting all and sorting in memory
      if (orderByError?.code === 'failed-precondition' || orderByError?.code === 'unimplemented') {
        const ordersRef = collection(db, 'orders');
        const constraints: QueryConstraint[] = [];
        
        if (filters?.status) {
          constraints.push(where('status', '==', filters.status));
        }
        if (filters?.customerId) {
          constraints.push(where('customerId', '==', filters.customerId));
        }
        if (filters?.customerEmail) {
          constraints.push(where('customerEmail', '==', filters.customerEmail.toLowerCase()));
        }
        
        const q = constraints.length > 0 ? query(ordersRef, ...constraints) : query(ordersRef);
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(convertFirestoreOrder);
        // Sort in memory by createdAt descending
        return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      throw orderByError;
    }
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    // Final fallback: get all orders without any filters and sort in memory
    try {
      const ordersRef = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersRef);
      let orders = querySnapshot.docs.map(convertFirestoreOrder);
      
      // Apply filters in memory if needed
      if (filters?.status) {
        orders = orders.filter(order => order.status === filters.status);
      }
      if (filters?.customerId) {
        orders = orders.filter(order => order.customerId === filters.customerId);
      }
      if (filters?.customerEmail) {
        const emailLower = filters.customerEmail.toLowerCase();
        orders = orders.filter(order => 
          order.customerEmail?.toLowerCase() === emailLower || 
          order.customer?.email?.toLowerCase() === emailLower
        );
      }
      
      // Sort by createdAt descending
      return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (fallbackError) {
      console.error('Error in fallback order fetch:', fallbackError);
      throw fallbackError;
    }
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return null;
    }
    
    return convertFirestoreOrder(orderSnap);
  } catch (error) {
    
    throw error;
  }
};

// Subscribe to orders (real-time)
export const subscribeToOrders = (
  callback: (orders: Order[]) => void,
  filters?: {
    status?: Order['status'];
    customerId?: string;
  }
): (() => void) => {
  const ordersRef = collection(db, 'orders');
  const constraints: QueryConstraint[] = [];
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters?.customerId) {
    constraints.push(where('customerId', '==', filters.customerId));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  const q = query(ordersRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(convertFirestoreOrder);
    callback(orders);
  });
};

// Helper function to remove undefined values from an object
const removeUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = removeUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
};

// Add new order
export const addOrder = async (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const ordersRef = collection(db, 'orders');
    const now = Timestamp.now();
    
    // Generate order number
    const orderCount = (await getDocs(ordersRef)).size;
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;
    
    // Ensure items have productName as string
    const items = order.items.map(item => ({
      productId: item.productId,
      productName: typeof item.productName === 'string' ? item.productName : (item.productName || 'Product'),
      quantity: item.quantity,
      price: item.price,
      ...(item.color && { color: item.color }),
      ...(item.size && { size: item.size }),
      ...(item.image && { image: item.image }),
    }));
    
    // Build order data, excluding undefined values
    const orderData: any = {
      orderNumber,
      status: order.status,
      customer: order.customer,
      deliveryAddress: order.deliveryAddress,
      items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,
      createdAt: now,
      updatedAt: now,
    };
    
    // Add optional fields only if they exist
    if (order.customerId) {
      orderData.customerId = order.customerId;
    }
    if (order.notes) {
      orderData.notes = order.notes;
    }
    if (order.trackingNumber) {
      orderData.trackingNumber = order.trackingNumber;
    }
    // Store a canonical lower-cased customer email for easier server/client queries
    if (order.customer?.email) {
      try {
        orderData.customer = {
          ...orderData.customer,
          email: String(order.customer.email),
        };
        orderData.customerEmail = String(order.customer.email).toLowerCase();
      } catch (e) {
        // ignore
      }
    }
    
    // Remove any remaining undefined values
    const cleanedOrderData = removeUndefined(orderData);
    
    const docRef = await addDoc(ordersRef, cleanedOrderData);
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding order:', error);
    const errorMessage = error?.message || error?.code || 'Failed to create order';
    throw new Error(errorMessage);
  }
};

// Update order
export const updateOrder = async (id: string, updates: Partial<Order>): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', id);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Remove id, orderNumber, createdAt, updatedAt from updates
    delete updateData.id;
    delete updateData.orderNumber;
    delete updateData.createdAt;
    
    await updateDoc(orderRef, updateData);
  } catch (error) {
    
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', id);
    await deleteDoc(orderRef);
  } catch (error) {
    
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: Order['status'], trackingNumber?: string): Promise<void> => {
  const updates: any = { status };
  if (trackingNumber) {
    updates.trackingNumber = trackingNumber;
  }
  return updateOrder(id, updates);
};
