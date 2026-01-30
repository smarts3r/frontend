// api.d.ts
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
}

export interface User {
  id: number;
  username?: string;
  email: string;
  password?: string;
  role: "admin" | "user";
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
  token: string;
  refreshToken: string;
}
