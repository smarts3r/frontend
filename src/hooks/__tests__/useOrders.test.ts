import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import {
  useGetUserOrders,
  useGetUserOrderById,
  useCreateOrder,
  useCancelOrder,
  useConfirmDelivery,
  useGetOrderSummary
} from '../useOrders';

describe('Order Hooks', () => {
  describe('useGetUserOrders', () => {
    test('should fetch user orders successfully', async () => {
      const { result } = renderHook(() => useGetUserOrders());

      // Execute getting user orders within act
      await act(async () => {
        await result.current.getUserOrders();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user orders were retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          userId: '1',
          items: [{
            id: '1',
            productId: '1',
            productName: 'Test Product',
            quantity: 2,
            price: 29.99
          }],
          totalAmount: 59.98,
          status: 'pending',
          shippingAddress: '123 Main St, City, State',
          paymentMethod: 'credit_card',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ]);
    });
  });

  describe('useGetUserOrderById', () => {
    test('should fetch a user order by ID successfully', async () => {
      const { result } = renderHook(() => useGetUserOrderById());

      // Execute getting user order by ID within act
      await act(async () => {
        await result.current.getUserOrderById('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user order was retrieved successfully
      expect(result.current.data).toEqual({
        id: '1',
        userId: '1',
        items: [{
          id: '1',
          productId: '1',
          productName: 'Test Product',
          quantity: 2,
          price: 29.99
        }],
        totalAmount: 59.98,
        status: 'pending',
        shippingAddress: '123 Main St, City, State',
        paymentMethod: 'credit_card',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      });
    });

    test('should handle order not found', async () => {
      const { result } = renderHook(() => useGetUserOrderById());

      // Execute getting order by non-existent ID within act
      await act(async () => {
        await result.current.getUserOrderById('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useCreateOrder', () => {
    test('should create an order successfully', async () => {
      const { result } = renderHook(() => useCreateOrder());

      // Execute creating an order within act
      const orderData = {
        items: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 }
        ],
        shippingAddress: '456 New Street, City, State',
        paymentMethod: 'paypal'
      };

      let createdOrder;
      await act(async () => {
        createdOrder = await result.current.createOrder(orderData);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the order was created successfully
      expect(createdOrder).toEqual({
        id: '2',
        userId: '1',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Test Product',
            quantity: 1,
            price: 29.99
          }
        ],
        paymentMethod: 'credit_card',
        shippingAddress: '123 Main St, City, State',
        status: 'pending',
        totalAmount: 29.99,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      });
    });
  });

  describe('useCancelOrder', () => {
    test('should cancel an order successfully', async () => {
      const { result } = renderHook(() => useCancelOrder());

      // Execute cancelling an order within act
      let cancelledOrder;
      await act(async () => {
        cancelledOrder = await result.current.cancelOrder('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the order was cancelled successfully
      expect(cancelledOrder).toEqual({
        id: '1',
        userId: '1',
        items: [{
          id: '1',
          productId: '1',
          productName: 'Test Product',
          quantity: 2,
          price: 29.99
        }],
        totalAmount: 59.98,
        status: 'cancelled',
        shippingAddress: '123 Main St, City, State',
        paymentMethod: 'credit_card',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      });
    });

    test('should handle cancelling non-existent order', async () => {
      const { result } = renderHook(() => useCancelOrder());

      // Execute cancelling non-existent order within act
      let cancelledOrder;
      await act(async () => {
        cancelledOrder = await result.current.cancelOrder('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(cancelledOrder).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useConfirmDelivery', () => {
    test('should confirm delivery successfully', async () => {
      const { result } = renderHook(() => useConfirmDelivery());

      // Execute confirming delivery within act
      let confirmedOrder;
      await act(async () => {
        confirmedOrder = await result.current.confirmDelivery('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the delivery was confirmed successfully
      expect(confirmedOrder).toEqual({
        id: '1',
        userId: '1',
        items: [{
          id: '1',
          productId: '1',
          productName: 'Test Product',
          quantity: 2,
          price: 29.99
        }],
        totalAmount: 59.98,
        status: 'delivered',
        shippingAddress: '123 Main St, City, State',
        paymentMethod: 'credit_card',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      });
    });

    test('should handle confirming delivery for non-existent order', async () => {
      const { result } = renderHook(() => useConfirmDelivery());

      // Execute confirming delivery for non-existent order within act
      let confirmedOrder;
      await act(async () => {
        confirmedOrder = await result.current.confirmDelivery('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(confirmedOrder).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useGetOrderSummary', () => {
    test('should fetch order summary successfully', async () => {
      const { result } = renderHook(() => useGetOrderSummary());

      // Execute getting order summary within act
      await act(async () => {
        await result.current.getOrderSummary();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the order summary was retrieved successfully
      expect(result.current.data).toEqual({
        totalOrders: 5,
        totalRevenue: 299.95,
        pendingOrders: 2,
        processingOrders: 1
      });
    });
  });
});