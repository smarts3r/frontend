import { useGet, usePost } from './useApi';
import { useCallback } from 'react';
import { Order, Product } from '../types/api';

// Define types for orders
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface UserOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
}

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: string;
}

// Order hooks
export const useGetUserOrders = () => {
  const { data, loading, error, execute, reset } = useGet<Order[]>();

  const getUserOrders = useCallback(async () => {
    return execute('/api/user/orders');
  }, [execute]);

  return { data, loading, error, getUserOrders, reset };
};

export const useGetUserOrderById = () => {
  const { data, loading, error, execute, reset } = useGet<Order>();

  const getUserOrderById = useCallback(async (id: string) => {
    return execute(`/api/user/orders/${id}`);
  }, [execute]);

  return { data, loading, error, getUserOrderById, reset };
};

export const useCreateOrder = () => {
  const { data, loading, error, execute, reset } = usePost<Order>();

  const createOrder = useCallback(async (orderData: CreateOrderData) => {
    return execute('/api/user/orders', orderData);
  }, [execute]);

  return { data, loading, error, createOrder, reset };
};

export const useCancelOrder = () => {
  const { data, loading, error, execute, reset } = usePost<Order>();

  const cancelOrder = useCallback(async (orderId: string) => {
    return execute(`/api/user/orders/${orderId}/cancel`);
  }, [execute]);

  return { data, loading, error, cancelOrder, reset };
};

export const useConfirmDelivery = () => {
  const { data, loading, error, execute, reset } = usePost<Order>();

  const confirmDelivery = useCallback(async (orderId: string) => {
    return execute(`/api/user/orders/${orderId}/confirm-delivery`);
  }, [execute]);

  return { data, loading, error, confirmDelivery, reset };
};

export const useGetOrderSummary = () => {
  const { data, loading, error, execute, reset } = useGet<OrderSummary>();

  const getOrderSummary = useCallback(async () => {
    return execute('/api/user/orders/summary');
  }, [execute]);

  return { data, loading, error, getOrderSummary, reset };
};