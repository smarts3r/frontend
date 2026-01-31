import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AdminOrder, AdminDashboardData } from '@/types/api';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAdminSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newOrders, setNewOrders] = useState<AdminOrder[]>([]);
  const [updatedOrders, setUpdatedOrders] = useState<{orderId: string; status: string}[]>([]);
  const [updatedStats, setUpdatedStats] = useState<AdminDashboardData | null>(null);
  
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (!accessToken || user?.role !== 'ADMIN') {
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('admin-join');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('new-order', (order: AdminOrder) => {
      setNewOrders(prev => [order, ...prev]);
    });

    newSocket.on('order-status-changed', (data: { orderId: string; status: string }) => {
      setUpdatedOrders(prev => [data, ...prev]);
    });

    newSocket.on('stats-update', (stats: AdminDashboardData) => {
      setUpdatedStats(stats);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [accessToken, user]);

  const clearNewOrders = useCallback(() => {
    setNewOrders([]);
  }, []);

  const clearUpdatedOrders = useCallback(() => {
    setUpdatedOrders([]);
  }, []);

  return {
    socket,
    isConnected,
    newOrders,
    updatedOrders,
    updatedStats,
    clearNewOrders,
    clearUpdatedOrders,
  };
};
