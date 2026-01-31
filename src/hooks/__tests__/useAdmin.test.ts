import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import {
  useGetAdminDashboard,
  useGetAdminOrders,
  useGetAdminOrderById,
  useUpdateAdminOrder,
  useBulkUpdateOrderStatus,
  useGetAdminStats,
  useExportOrders,
  useDownloadTemplate,
  useExportProducts,
  useImportProducts,
  useUploadFile
} from '../useAdmin';

describe('Admin Hooks', () => {
  beforeAll(() => {
    // Set admin token for all admin tests
    localStorage.setItem('token', 'mock-admin-token');
  });

  afterAll(() => {
    // Clean up token
    localStorage.removeItem('token');
  });
  describe('useGetAdminDashboard', () => {
    test('should fetch admin dashboard data successfully', async () => {
      const { result } = renderHook(() => useGetAdminDashboard());

      // Execute getting admin dashboard within act
      await act(async () => {
        await result.current.getAdminDashboard();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the admin dashboard data was retrieved successfully
      expect(result.current.data).toEqual({
        totalUsers: 100,
        totalProducts: 50,
        totalOrders: 200,
        totalRevenue: 15000,
        monthlySales: [
          { month: 'Jan', sales: 1200 },
          { month: 'Feb', sales: 1500 },
          { month: 'Mar', sales: 1800 }
        ]
      });
    });
  });

  describe('useGetAdminOrders', () => {
    test('should fetch admin orders successfully', async () => {
      const { result } = renderHook(() => useGetAdminOrders());

      // Execute getting admin orders within act
      await act(async () => {
        await result.current.getAdminOrders();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the admin orders were retrieved successfully
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
          updatedAt: '2023-01-01T00:00:00Z',
          customerEmail: 'customer@example.com',
          customerName: 'Customer Name'
        }
      ]);
    });
  });

  describe('useGetAdminOrderById', () => {
    test('should fetch an admin order by ID successfully', async () => {
      const { result } = renderHook(() => useGetAdminOrderById());

      // Execute getting admin order by ID within act
      await act(async () => {
        await result.current.getAdminOrderById('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the admin order was retrieved successfully
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
        updatedAt: '2023-01-01T00:00:00Z',
        customerEmail: 'customer@example.com',
        customerName: 'Customer Name'
      });
    });

    test('should handle admin order not found', async () => {
      const { result } = renderHook(() => useGetAdminOrderById());

      // Execute getting admin order by non-existent ID within act
      await act(async () => {
        await result.current.getAdminOrderById('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useUpdateAdminOrder', () => {
    test('should update an admin order successfully', async () => {
      const { result } = renderHook(() => useUpdateAdminOrder());

      // Execute updating an admin order within act
      const updates = {
        status: 'processing',
        shippingAddress: '789 Updated Address, City, State'
      };

      let updatedOrder;
      await act(async () => {
        updatedOrder = await result.current.updateAdminOrder('1', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the admin order was updated successfully
      expect(updatedOrder).toEqual({
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
        status: 'processing', // Updated status
        shippingAddress: '789 Updated Address, City, State', // Updated address
        paymentMethod: 'credit_card',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        customerEmail: 'customer@example.com',
        customerName: 'Customer Name'
      });
    });

    test('should handle updating non-existent admin order', async () => {
      const { result } = renderHook(() => useUpdateAdminOrder());

      // Execute updating non-existent admin order within act
      const updates = {
        status: 'processing'
      };

      let updatedOrder;
      await act(async () => {
        updatedOrder = await result.current.updateAdminOrder('999', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(updatedOrder).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useBulkUpdateOrderStatus', () => {
    test('should bulk update order status successfully', async () => {
      const { result } = renderHook(() => useBulkUpdateOrderStatus());

      // Execute bulk updating order status within act
      const updateData = {
        orderIds: ['1', '2', '3'],
        status: 'shipped'
      };

      let bulkUpdateResult;
      await act(async () => {
        bulkUpdateResult = await result.current.bulkUpdateOrderStatus(updateData);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the bulk update was successful
      expect(bulkUpdateResult).toEqual({});
    });
  });

  describe('useGetAdminStats', () => {
    test('should fetch admin stats successfully', async () => {
      const { result } = renderHook(() => useGetAdminStats());

      // Execute getting admin stats within act
      await act(async () => {
        await result.current.getAdminStats();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the admin stats were retrieved successfully
      expect(result.current.data).toEqual({
        revenue: 15000,
        orders: 200,
        customers: 100
      });
    });
  });

  describe('useExportOrders', () => {
    test('should export orders successfully', async () => {
      const { result } = renderHook(() => useExportOrders());

      // Execute exporting orders within act
      let exportedBlob;
      await act(async () => {
        exportedBlob = await result.current.exportOrders();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the export was successful (returns a Blob)
      expect(exportedBlob).toBeInstanceOf(Blob);
    });
  });

  describe('useDownloadTemplate', () => {
    test('should download template successfully', async () => {
      const { result } = renderHook(() => useDownloadTemplate());

      // Execute downloading template within act
      let templateBlob;
      await act(async () => {
        templateBlob = await result.current.downloadTemplate();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the download was successful (returns a Blob)
      expect(templateBlob).toBeInstanceOf(Blob);
    });
  });

  describe('useExportProducts', () => {
    test('should export products successfully', async () => {
      const { result } = renderHook(() => useExportProducts());

      // Execute exporting products within act
      let exportedProductsBlob;
      await act(async () => {
        exportedProductsBlob = await result.current.exportProducts();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the export was successful (returns a Blob)
      expect(exportedProductsBlob).toBeInstanceOf(Blob);
    });
  });

  describe('useImportProducts', () => {
    test('should import products successfully', async () => {
      const { result } = renderHook(() => useImportProducts());

      // Create a mock FormData for import
      const formData = new FormData();
      const mockFile = new File(['content'], 'products.csv', { type: 'text/csv' });
      formData.append('file', mockFile);

      // Execute importing products within act
      let importResult;
      await act(async () => {
        importResult = await result.current.importProducts(formData);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the import was successful
      expect(importResult).toEqual({});
    });
  });

  describe('useUploadFile', () => {
    test('should upload file successfully', async () => {
      const { result } = renderHook(() => useUploadFile());

      // Create a mock FormData for upload
      const formData = new FormData();
      const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      formData.append('file', mockFile);

      // Execute uploading file within act
      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadFile(formData);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the upload was successful
      expect(uploadResult).toEqual({
        url: 'https://example.com/uploaded/image.jpg'
      });
    });
  });
});