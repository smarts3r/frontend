import { useGet, usePost, usePut, useDelete } from './useApi';
import { Product } from './useProducts';
import { useCallback } from 'react';

// Define types for user-related data
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User hooks
export const useGetUserProfile = () => {
  const { data, loading, error, execute, reset } = useGet<UserProfile>();

  const getUserProfile = useCallback(async () => {
    return execute('/api/user/profile');
  }, [execute]);

  return { data, loading, error, getUserProfile, reset };
};

export const useGetUserCart = () => {
  const { data, loading, error, execute, reset } = useGet<CartItem[]>();

  const getUserCart = useCallback(async () => {
    return execute('/api/user/cart');
  }, [execute]);

  return { data, loading, error, getUserCart, reset };
};

export const useAddToCart = () => {
  const { data, loading, error, execute, reset } = usePost<CartItem>();

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    return execute('/api/user/cart', { productId, quantity });
  }, [execute]);

  return { data, loading, error, addToCart, reset };
};

export const useUpdateCartItem = () => {
  const { data, loading, error, execute, reset } = usePut<CartItem>();

  const updateCartItem = useCallback(async (cartItemId: string, quantity: number) => {
    return execute(`/api/user/cart/${cartItemId}`, { quantity });
  }, [execute]);

  return { data, loading, error, updateCartItem, reset };
};

export const useRemoveFromCart = () => {
  const { data, loading, error, execute, reset } = useDelete<void>();

  const removeFromCart = useCallback(async (cartItemId: string) => {
    return execute(`/api/user/cart/${cartItemId}`);
  }, [execute]);

  return { data, loading, error, removeFromCart, reset };
};

export const useClearCart = () => {
  const { data, loading, error, execute, reset } = usePost<void>();

  const clearCart = useCallback(async () => {
    return execute('/api/user/cart/clear');
  }, [execute]);

  return { data, loading, error, clearCart, reset };
};

export const useGetUserWishlist = () => {
  const { data, loading, error, execute, reset } = useGet<WishlistItem[]>();

  const getUserWishlist = useCallback(async () => {
    return execute('/api/user/wishlist');
  }, [execute]);

  return { data, loading, error, getUserWishlist, reset };
};

export const useToggleWishlist = () => {
  const { data, loading, error, execute, reset } = usePost<{ added: boolean }>();

  const toggleWishlist = useCallback(async (productId: string) => {
    return execute('/api/user/wishlist/toggle', { productId });
  }, [execute]);

  return { data, loading, error, toggleWishlist, reset };
};