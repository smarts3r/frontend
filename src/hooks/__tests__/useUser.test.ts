import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import {
  useGetUserProfile,
  useGetUserCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
  useGetUserWishlist,
  useToggleWishlist
} from '../useUser';

describe('User Hooks', () => {
  describe('useGetUserProfile', () => {
    test('should fetch user profile successfully', async () => {
      const { result } = renderHook(() => useGetUserProfile());

      // Execute getting user profile within act
      await act(async () => {
        await result.current.getUserProfile();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user profile was retrieved successfully
      expect(result.current.data).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      });
    });
  });

  describe('useGetUserCart', () => {
    test('should fetch user cart successfully', async () => {
      const { result } = renderHook(() => useGetUserCart());

      // Execute getting user cart within act
      await act(async () => {
        await result.current.getUserCart();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user cart was retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          productId: '1',
          quantity: 2,
          product: {
            id: '1',
            name: 'Test Product',
            description: 'A test product',
            price: 29.99,
            category: 'electronics',
            imageUrl: 'https://example.com/image.jpg',
            stock: 10,
            rating: 4.5
          }
        }
      ]);
    });
  });

  describe('useAddToCart', () => {
    test('should add item to cart successfully', async () => {
      const { result } = renderHook(() => useAddToCart());

      // Execute adding to cart within act
      let cartItem;
      await act(async () => {
        cartItem = await result.current.addToCart('1', 3);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the item was added to cart successfully
      expect(cartItem).toEqual({
        id: '2',
        productId: '1',
        quantity: 3,
        product: {
          id: '1',
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          category: 'electronics',
          imageUrl: 'https://example.com/image.jpg',
          stock: 10,
          rating: 4.5
        }
      });
    });
  });

  describe('useUpdateCartItem', () => {
    test('should update cart item successfully', async () => {
      const { result } = renderHook(() => useUpdateCartItem());

      // Execute updating cart item within act
      let updatedCartItem;
      await act(async () => {
        updatedCartItem = await result.current.updateCartItem('1', 5);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the cart item was updated successfully
      expect(updatedCartItem).toEqual({
        id: '1',
        productId: '1',
        quantity: 5,
        product: {
          id: '1',
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          category: 'electronics',
          imageUrl: 'https://example.com/image.jpg',
          stock: 10,
          rating: 4.5
        }
      });
    });

    test('should handle updating non-existent cart item', async () => {
      const { result } = renderHook(() => useUpdateCartItem());

      // Execute updating non-existent cart item within act
      let updatedCartItem;
      await act(async () => {
        updatedCartItem = await result.current.updateCartItem('999', 5);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(updatedCartItem).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useRemoveFromCart', () => {
    test('should remove item from cart successfully', async () => {
      const { result } = renderHook(() => useRemoveFromCart());

      // Execute removing from cart within act
      await act(async () => {
        await result.current.removeFromCart('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the item was removed from cart successfully
      expect(result.current.data).toBeNull();
    });

    test('should handle removing non-existent cart item', async () => {
      const { result } = renderHook(() => useRemoveFromCart());

      // Execute removing non-existent cart item within act
      await act(async () => {
        await result.current.removeFromCart('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useClearCart', () => {
    test('should clear cart successfully', async () => {
      const { result } = renderHook(() => useClearCart());

      // Execute clearing cart within act
      await act(async () => {
        await result.current.clearCart();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the cart was cleared successfully
      expect(result.current.data).toEqual({});
    });
  });

  describe('useGetUserWishlist', () => {
    test('should fetch user wishlist successfully', async () => {
      const { result } = renderHook(() => useGetUserWishlist());

      // Execute getting user wishlist within act
      await act(async () => {
        await result.current.getUserWishlist();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the user wishlist was retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          productId: '1',
          product: {
            id: '1',
            name: 'Test Product',
            description: 'A test product',
            price: 29.99,
            category: 'electronics',
            imageUrl: 'https://example.com/image.jpg',
            stock: 10,
            rating: 4.5
          }
        }
      ]);
    });
  });

  describe('useToggleWishlist', () => {
    test('should toggle wishlist item successfully', async () => {
      const { result } = renderHook(() => useToggleWishlist());

      // Execute toggling wishlist item within act
      let toggleResult;
      await act(async () => {
        toggleResult = await result.current.toggleWishlist('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the wishlist item was toggled successfully
      expect(toggleResult).toEqual({
        added: true
      });
    });
  });
});