import { useGet, usePost, usePut, useDelete } from './useApi';
import { useCallback } from 'react';

// Define types for products
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Product hooks
export const useGetProducts = () => {
  const { data, loading, error, execute, reset } = useGet<Product[]>();

  const getProducts = useCallback(async () => {
    return execute('/api/products');
  }, [execute]);

  return { data, loading, error, getProducts, reset };
};

export const useGetProductById = () => {
  const { data, loading, error, execute, reset } = useGet<Product>();

  const getProductById = useCallback(async (id: string) => {
    return execute(`/api/products/${id}`);
  }, [execute]);

  return { data, loading, error, getProductById, reset };
};

export const useCreateProduct = () => {
  const { data, loading, error, execute, reset } = usePost<Product>();

  const createProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    return execute('/api/products', product);
  }, [execute]);

  return { data, loading, error, createProduct, reset };
};

export const useUpdateProduct = () => {
  const { data, loading, error, execute, reset } = usePut<Product>();

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    return execute(`/api/products/${id}`, product);
  }, [execute]);

  return { data, loading, error, updateProduct, reset };
};

export const useDeleteProduct = () => {
  const { data, loading, error, execute, reset } = useDelete<void>();

  const deleteProduct = useCallback(async (id: string) => {
    return execute(`/api/products/${id}`);
  }, [execute]);

  return { data, loading, error, deleteProduct, reset };
};

export const useGetUserProducts = () => {
  const { data, loading, error, execute, reset } = useGet<Product[]>();

  const getUserProducts = useCallback(async () => {
    return execute('/api/user/products');
  }, [execute]);

  return { data, loading, error, getUserProducts, reset };
};

export const useGetUserProductById = () => {
  const { data, loading, error, execute, reset } = useGet<Product>();

  const getUserProductById = useCallback(async (id: string) => {
    return execute(`/api/user/products/${id}`);
  }, [execute]);

  return { data, loading, error, getUserProductById, reset };
};