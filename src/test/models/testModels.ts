// Test models and validation schemas

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | "ADMIN";
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
}

export interface MockCategory {
  id: string;
  name: string;
  description: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  items: MockOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface MockCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: MockProduct;
}

export interface MockWishlistItem {
  id: string;
  productId: string;
  product: MockProduct;
}

// Validation utilities
export const validateMockUser = (user: any): MockUser => {
  if (!user || typeof user !== 'object') {
    throw new Error('Invalid user data');
  }

  const required = ['id', 'email', 'firstName', 'lastName', 'role'];
  const missing = required.filter(field => !user[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  return user as MockUser;
};

export const validateMockProduct = (product: any): MockProduct => {
  if (!product || typeof product !== 'object') {
    throw new Error('Invalid product data');
  }

  const required = ['id', 'name', 'description', 'price', 'category', 'imageUrl', 'stock', 'rating'];
  const missing = required.filter(field => !(field in product));

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  return product as MockProduct;
};

export const validateMockCategory = (category: any): MockCategory => {
  if (!category || typeof category !== 'object') {
    throw new Error('Invalid category data');
  }

  const required = ['id', 'name', 'description'];
  const missing = required.filter(field => !(field in category));

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  return category as MockCategory;
};