import { useGet, usePost, usePut } from './useApi';
import { useCallback } from 'react';
import { Order } from '../types/api';

// Define types for admin data
export interface AdminDashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlySales: Array<{ month: string; sales: number }>;
}

export interface AdminOrder extends Order {
  customerEmail: string;
  customerName: string;
}

export interface BulkOrderStatusUpdate {
  orderIds: string[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Admin hooks
export const useGetAdminDashboard = () => {
  const { data, loading, error, execute, reset } = useGet<AdminDashboardData>();

  const getAdminDashboard = useCallback(async () => {
    return execute('/api/admin/dashboard');
  }, [execute]);

  return { data, loading, error, getAdminDashboard, reset };
};

export const useGetAdminOrders = () => {
  const { data, loading, error, execute, reset } = useGet<AdminOrder[]>();

  const getAdminOrders = useCallback(async () => {
    return execute('/api/admin/orders');
  }, [execute]);

  return { data, loading, error, getAdminOrders, reset };
};

export const useGetAdminOrderById = () => {
  const { data, loading, error, execute, reset } = useGet<AdminOrder>();

  const getAdminOrderById = useCallback(async (id: string) => {
    return execute(`/api/admin/orders/${id}`);
  }, [execute]);

  return { data, loading, error, getAdminOrderById, reset };
};

export const useUpdateAdminOrder = () => {
  const { data, loading, error, execute, reset } = usePut<AdminOrder>();

  const updateAdminOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    return execute(`/api/admin/orders/${id}`, updates);
  }, [execute]);

  return { data, loading, error, updateAdminOrder, reset };
};

export const useBulkUpdateOrderStatus = () => {
  const { data, loading, error, execute, reset } = usePost<void>();

  const bulkUpdateOrderStatus = useCallback(async (updateData: BulkOrderStatusUpdate) => {
    return execute('/api/admin/orders/bulk-status', updateData);
  }, [execute]);

  return { data, loading, error, bulkUpdateOrderStatus, reset };
};

export const useExportOrders = () => {
  const { data, loading, error, execute, reset } = useGet<Blob>();

  const exportOrders = useCallback(async () => {
    return execute('/api/admin/orders/export');
  }, [execute]);

  return { data, loading, error, exportOrders, reset };
};

export const useDownloadTemplate = () => {
  const { data, loading, error, execute, reset } = useGet<Blob>();

  const downloadTemplate = useCallback(async () => {
    return execute('/api/admin/csv/template');
  }, [execute]);

  return { data, loading, error, downloadTemplate, reset };
};

export const useExportProducts = () => {
  const { data, loading, error, execute, reset } = useGet<Blob>();

  const exportProducts = useCallback(async () => {
    return execute('/api/admin/csv/export');
  }, [execute]);

  return { data, loading, error, exportProducts, reset };
};

export const useImportProducts = () => {
  const { data, loading, error, execute, reset } = usePost<void>();

  const importProducts = useCallback(async (formData: FormData) => {
    return execute('/api/admin/csv/import', formData, {
      headers: {
        // Don't set Content-Type header for multipart/form-data
        // Let the browser set it with the boundary
      }
    });
  }, [execute]);

  return { data, loading, error, importProducts, reset };
};

export const useUploadFile = () => {
  const { data, loading, error, execute, reset } = usePost<{ url: string }>();

  const uploadFile = useCallback(async (formData: FormData) => {
    return execute('/api/admin/upload', formData, {
      headers: {
        // Don't set Content-Type header for multipart/form-data
        // Let the browser set it with the boundary
      }
    });
  }, [execute]);

  return { data, loading, error, uploadFile, reset };
};

export const useGetAdminStats = () => {
  const { data, loading, error, execute, reset } = useGet<Record<string, unknown>>();

  const getAdminStats = useCallback(async () => {
    return execute('/api/admin/stats');
  }, [execute]);

  return { data, loading, error, getAdminStats, reset };
};