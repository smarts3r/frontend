import { useState, useCallback } from 'react';

// Define types for API requests
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Base API hook with loading, error, and retry functionality
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const request = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // In test environment, use relative URLs for MSW to intercept
      // In production, use full URLs with base URL
      let url: string;
      if (import.meta.env.NODE_ENV === 'test') {
        url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      } else {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      }

      // Set default headers
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      };

      // Add authentication token if available
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        const headers = new Headers(config.headers);
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        config.headers = headers;
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          message: errorData.message || `HTTP error! Status: ${response.status}`,
          status: response.status,
          code: errorData.code || 'REQUEST_FAILED'
        };
        setError(apiError);
        return null;
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        setData(null);
        return null;
      }

      // Handle different response types
      let result: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else if (contentType?.includes('text/')) {
        // For text responses, cast to T which should be string or compatible type
        const textResult = await response.text();
        result = textResult as T;
      } else if (contentType?.includes('application/octet-stream') || contentType?.includes('text/csv')) {
        // For binary data, return as Blob
        const blobResult = await response.blob();
        result = blobResult as T;
      } else {
        // Default to text for other content types
        const textResult = await response.text();
        result = textResult as T;
      }

      setData(result);
      return result;
    } catch (err) {
      // Only create a network error if this is a genuine network error
      // If the error already has status (from HTTP response), don't overwrite it
      const existingError = err as ApiError;
      if (existingError.status && existingError.status !== 0) {
        setError(existingError);
        return null;
      }

      const apiError: ApiError = {
        message: (err as Error).message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR'
      };
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, request, reset };
}

// Specific API hooks
export const useGet = <T,>() => {
  const { request, ...apiHook } = useApi<T>();

  const execute = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    return request(endpoint, {
      method: 'GET',
      ...options
    });
  }, [request]);

  return { ...apiHook, request, execute };
};

export const usePost = <T,>() => {
  const { request, ...apiHook } = useApi<T>();

  const execute = useCallback(async (endpoint: string, body?: unknown, options: RequestInit = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    });
  }, [request]);

  return { ...apiHook, request, execute };
};

export const usePut = <T,>() => {
  const { request, ...apiHook } = useApi<T>();

  const execute = useCallback(async (endpoint: string, body?: unknown, options: RequestInit = {}) => {
    return request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options
    });
  }, [request]);

  return { ...apiHook, request, execute };
};

export const useDelete = <T,>() => {
  const { request, ...apiHook } = useApi<T>();

  const execute = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    return request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }, [request]);

  return { ...apiHook, request, execute };
};