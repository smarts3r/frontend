import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/";
import axios, { type AxiosResponse, type AxiosRequestConfig } from "axios";

// Define types for API requests
type Category = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

type User = {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @description Request interceptor to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

// Generic API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Request wrapper with error handling
export async function apiRequest<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 0;
      const message = error.response?.data?.message ||
        error.message ||
        `HTTP ${status}: ${error.response?.statusText || 'Unknown error'}`;
      const code = error.response?.data?.code;

      throw new ApiError(message, status, code);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`, 0, "NETWORK_ERROR");
    }

    throw new ApiError("Unknown error occurred", 0, "UNKNOWN_ERROR");
  }
}

// Enhanced API hook with loading, error, and retry functionality
export function useApi<T, P = void>(
  fetcher: (params?: P) => Promise<T>,
  options: {
    immediate?: boolean;
    retryCount?: number;
    retryDelay?: number;
  } = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastParams, setLastParams] = useState<P | undefined>();

  const { immediate = false, retryCount = 3, retryDelay = 1000 } = options;

  const execute = useCallback(
    async (params?: P, retries = retryCount): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setLastParams(params);

      try {
        const result = await fetcher(params);
        setData(result);
        return result;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
              err instanceof Error ? err.message : "Unknown error",
              0,
            );

        if (retries > 0 && apiError.status >= 500) {
          // Retry on server errors
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return execute(params, retries - 1);
        }

        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetcher, retryCount, retryDelay],
  );

  const retry = useCallback(() => {
    if (lastParams !== undefined) {
      return execute(lastParams);
    }
    return execute();
  }, [execute, lastParams]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setLastParams(undefined);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset,
  };
}

// Specific API functions
export const api = {
  // Products
  getProducts: () => apiRequest<Product[]>("/api/products"),
  getProduct: (id: string | number) =>
    apiRequest<Product>(`/api/products/${id}`),
  createProduct: (product: Partial<Product>) =>
    apiRequest("/api/products", {
      method: "POST",
      data: product,
    }),
  updateProduct: (id: string | number, product: Partial<Product>) =>
    apiRequest(`/api/products/${id}`, {
      method: "PUT",
      data: product,
    }),
  deleteProduct: (id: string | number) =>
    apiRequest(`/api/products/${id}`, {
      method: "DELETE",
    }),

  // User-specific endpoints (from user.routes.ts)
  getAvailableProducts: () => apiRequest<Product[]>("/api/user/products"),
  getUserProduct: (id: string | number) =>
    apiRequest<Product>(`/api/user/products/${id}`),
  getMyOrders: () => apiRequest("/api/user/orders"),
  getMyOrder: (id: string | number) => apiRequest(`/api/user/orders/${id}`),
  createOrder: (orderData: { items: Array<{ productId: string | number; quantity: number }> }) =>
    apiRequest("/api/user/orders", {
      method: "POST",
      data: orderData,
    }),
  cancelMyOrder: (id: string | number) =>
    apiRequest(`/api/user/orders/${id}/cancel`, {
      method: "POST",
    }),
  confirmDelivery: (id: string | number) =>
    apiRequest(`/api/user/orders/${id}/confirm-delivery`, {
      method: "POST",
    }),
  getOrderSummary: () => apiRequest("/api/user/orders/summary"),
  getUserProfile: () => apiRequest("/api/user/profile"),
  getMyCart: () => apiRequest("/api/user/cart"),
  addToCart: (productId: string | number, quantity: number) =>
    apiRequest("/api/user/cart", {
      method: "POST",
      data: { productId, quantity },
    }),
  updateCartItem: (id: string | number, quantity: number) =>
    apiRequest(`/api/user/cart/${id}`, {
      method: "PUT",
      data: { quantity },
    }),
  clearCart: () => apiRequest("/api/user/cart", {
    method: "DELETE",
  }),
  getMyWishlist: () => apiRequest("/api/user/wishlist"),
  toggleWishlist: (productId: string | number) =>
    apiRequest("/api/user/wishlist/toggle", {
      method: "POST",
      data: { productId },
    }),

  // Categories
  getCategories: () => apiRequest<Category[]>("/api/categories"),
  getCategory: (id: string | number) =>
    apiRequest<Category>(`/api/categories/${id}`),
  createCategory: (category: Partial<Category>) =>
    apiRequest("/api/categories", {
      method: "POST",
      data: category,
    }),
  updateCategory: (id: string | number, category: Partial<Category>) =>
    apiRequest(`/api/categories/${id}`, {
      method: "PUT",
      data: category,
    }),
  deleteCategory: (id: string | number) =>
    apiRequest(`/api/categories/${id}`, {
      method: "DELETE",
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      data: credentials,
    }),
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      data: userData,
    }),
  logout: () => apiRequest("/api/auth/logout", {
    method: "POST",
  }),
  refreshToken: () => apiRequest("/api/auth/refresh", {
    method: "POST",
  }),

  // Admin
  getAdminDashboard: () => apiRequest("/api/admin/dashboard"),
  getAdminOrders: () => apiRequest("/api/admin/orders"),
  getAdminOrder: (id: string | number) => apiRequest(`/api/admin/orders/${id}`),
  updateAdminOrder: (id: string | number, orderData: { status?: string; shippedAt?: string }) =>
    apiRequest(`/api/admin/orders/${id}`, {
      method: "PATCH",
      data: orderData,
    }),
  bulkUpdateOrderStatus: (orderIds: string[], status: string) =>
    apiRequest("/api/admin/orders/bulk-status", {
      method: "PATCH",
      data: { orderIds, status },
    }),
  exportOrders: () => apiRequest("/api/admin/orders/export"),
  downloadTemplate: () => apiRequest("/api/admin/csv/template"),
  exportProducts: () => apiRequest("/api/admin/csv/export"),
  importProducts: (formData: FormData) =>
    apiRequest("/api/admin/csv/import", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  uploadImage: (formData: FormData) =>
    apiRequest("/api/admin/upload", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
