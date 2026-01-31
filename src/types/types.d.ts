export interface Product {
  id: number;
  img: string;
  name: string;
  price: number;
  old_price?: number;
  category: string;
  sku?: string;
  stock?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  orderItems?: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    product?: Product;
  }>;
}

export interface User {
  id: number;
  username?: string;
  email: string;
  password?: string;
  role: "ADMIN" | "user";
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  profile?: Profile;
}

export interface Profile {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlySales: Array<{ month: string; sales: number }>;
  revenueGrowth?: number;
  ordersGrowth?: number;
  productsGrowth?: number;
  usersGrowth?: number;
}

export interface AdminOrder extends Order {
  customerEmail: string;
  customerName: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  orderItems?: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    product?: Product;
  }>;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
