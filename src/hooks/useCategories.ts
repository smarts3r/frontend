import { useGet, usePost, usePut, useDelete } from './useApi';
import { useCallback } from 'react';

// Define types for categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category hooks
export const useGetCategories = () => {
  const { data, loading, error, execute, reset } = useGet<Category[]>();

  const getCategories = useCallback(async () => {
    return execute('/api/categories');
  }, [execute]);

  return { data, loading, error, getCategories, reset };
};

export const useGetCategoryById = () => {
  const { data, loading, error, execute, reset } = useGet<Category>();

  const getCategoryById = useCallback(async (id: string) => {
    return execute(`/api/categories/${id}`);
  }, [execute]);

  return { data, loading, error, getCategoryById, reset };
};

export const useCreateCategory = () => {
  const { data, loading, error, execute, reset } = usePost<Category>();

  const createCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    return execute('/api/categories', category);
  }, [execute]);

  return { data, loading, error, createCategory, reset };
};

export const useUpdateCategory = () => {
  const { data, loading, error, execute, reset } = usePut<Category>();

  const updateCategory = useCallback(async (id: string, category: Partial<Category>) => {
    return execute(`/api/categories/${id}`, category);
  }, [execute]);

  return { data, loading, error, updateCategory, reset };
};

export const useDeleteCategory = () => {
  const { data, loading, error, execute, reset } = useDelete<void>();

  const deleteCategory = useCallback(async (id: string) => {
    return execute(`/api/categories/${id}`);
  }, [execute]);

  return { data, loading, error, deleteCategory, reset };
};