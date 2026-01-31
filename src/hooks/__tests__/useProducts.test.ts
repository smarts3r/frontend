import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import {
  useGetProducts,
  useGetProductById,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useGetUserProducts
} from '../useProducts';

describe('Product Hooks', () => {
  describe('useGetProducts', () => {
    test('should fetch products successfully', async () => {
      const { result } = renderHook(() => useGetProducts());

      // Execute getting products within act
      await act(async () => {
        await result.current.getProducts();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the products were retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          category: 'electronics',
          imageUrl: 'https://example.com/image.jpg',
          stock: 10,
          rating: 4.5
        }
      ]);
    });
  });

  describe('useGetProductById', () => {
    test('should fetch a product by ID successfully', async () => {
      const { result } = renderHook(() => useGetProductById());

      // Execute getting product by ID within act
      await act(async () => {
        await result.current.getProductById('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the product was retrieved successfully
      expect(result.current.data).toEqual({
        id: '1',
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        category: 'electronics',
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        rating: 4.5
      });
    });

    test('should handle product not found', async () => {
      const { result } = renderHook(() => useGetProductById());

      // Execute getting product by non-existent ID within act
      await act(async () => {
        await result.current.getProductById('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useCreateProduct', () => {
    test('should create a product successfully', async () => {
      const { result } = renderHook(() => useCreateProduct());

      // Execute creating a product within act
      const newProduct = {
        name: 'New Product',
        description: 'A new test product',
        price: 39.99,
        category: 'books',
        imageUrl: 'https://example.com/new-image.jpg',
        stock: 5
      };

      let createdProduct;
      await act(async () => {
        createdProduct = await result.current.createProduct(newProduct);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the product was created successfully
      expect(createdProduct).toEqual({
        ...newProduct,
        id: '2'  // The mock server assigns ID '2' to new products
      });
    });
  });

  describe('useUpdateProduct', () => {
    test('should update a product successfully', async () => {
      const { result } = renderHook(() => useUpdateProduct());

      // Execute updating a product within act
      const updates = {
        name: 'Updated Product Name',
        price: 49.99
      };

      let updatedProduct;
      await act(async () => {
        updatedProduct = await result.current.updateProduct('1', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the product was updated successfully
      expect(updatedProduct).toEqual({
        id: '1',
        name: 'Updated Product Name',
        description: 'A test product',
        price: 49.99,
        category: 'electronics',
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        rating: 4.5
      });
    });

    test('should handle updating non-existent product', async () => {
      const { result } = renderHook(() => useUpdateProduct());

      // Execute updating a non-existent product within act
      const updates = {
        name: 'Updated Product Name',
        price: 49.99
      };

      let updatedProduct;
      await act(async () => {
        updatedProduct = await result.current.updateProduct('999', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(updatedProduct).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useDeleteProduct', () => {
    test('should delete a product successfully', async () => {
      const { result } = renderHook(() => useDeleteProduct());

      // Execute deleting a product within act
      await act(async () => {
        await result.current.deleteProduct('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the product was deleted successfully (204 response)
      expect(result.current.data).toBeNull();
    });

    test('should handle deleting non-existent product', async () => {
      const { result } = renderHook(() => useDeleteProduct());

      // Execute deleting a non-existent product within act
      await act(async () => {
        await result.current.deleteProduct('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useGetUserProducts', () => {
    test('should fetch user products successfully', async () => {
      const { result } = renderHook(() => useGetUserProducts());

      // Execute getting user products within act
      await act(async () => {
        await result.current.getUserProducts();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user products were retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          category: 'electronics',
          imageUrl: 'https://example.com/image.jpg',
          stock: 10,
          rating: 4.5
        }
      ]);
    });
  });
});