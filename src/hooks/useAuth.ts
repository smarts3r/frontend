import { usePost, useGet } from './useApi';
import { useCallback } from 'react';

// Define types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

// Authentication hooks
export const useLogin = () => {
  const { data, loading, error, execute, reset } = usePost<{ token: string; user: User }>();

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await execute('/api/auth/login', credentials);

    // Store token in localStorage if login is successful
    if (result && result.token) {
      localStorage.setItem('token', result.token);
    }

    return result;
  }, [execute]);

  return { data, loading, error, login, reset };
};

export const useRegister = () => {
  const { data, loading, error, execute, reset } = usePost<{ token: string; user: User }>();

  const register = useCallback(async (userData: RegisterData) => {
    const result = await execute('/api/auth/register', userData);

    // Store token in localStorage if registration is successful
    if (result && result.token) {
      localStorage.setItem('token', result.token);
    }

    return result;
  }, [execute]);

  return { data, loading, error, register, reset };
};

export const useLogout = () => {
  const { data, loading, error, execute, reset } = usePost<void>();

  const logout = useCallback(async () => {
    const result = await execute('/api/auth/logout');

    // Remove token from localStorage after logout
    localStorage.removeItem('token');

    return result;
  }, [execute]);

  return { data, loading, error, logout, reset };
};

export const useRefreshToken = () => {
  const { data, loading, error, execute, reset } = usePost<{ token: string }>();

  const refreshToken = useCallback(async () => {
    const result = await execute('/api/auth/refresh');

    // Update token in localStorage if refresh is successful
    if (result && result.token) {
      localStorage.setItem('token', result.token);
    }

    return result;
  }, [execute]);

  return { data, loading, error, refreshToken, reset };
};

export const useGetCurrentUser = () => {
  const { data, loading, error, execute, reset } = useGet<User>();

  const getCurrentUser = useCallback(async () => {
    return execute('/api/auth/me');
  }, [execute]);

  return { data, loading, error, getCurrentUser, reset };
};