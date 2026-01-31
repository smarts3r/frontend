import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useApi, useGet, usePost, usePut, useDelete } from '../useApi';

describe('useApi', () => {
  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => useApi<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle GET request successfully', async () => {
    const { result } = renderHook(() => useGet<any>());

    // Execute the GET request within act
    await act(async () => {
      await result.current.execute('/api/auth/me');
    });

    // Wait for the request to complete and data to be populated
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Check that the data was received correctly
    expect(result.current.data).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    });
  });

  test('should handle POST request successfully', async () => {
    const { result } = renderHook(() => usePost());

    // Execute the POST request within act
    await act(async () => {
      await result.current.execute('/api/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });

    // Wait for the request to complete and data to be populated
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Check that the data was received correctly
    expect(result.current.data).toEqual({
      token: 'mock-user-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      }
    });
  });

  test('should handle PUT request successfully', async () => {
    const { result } = renderHook(() => usePut());

    // Execute the PUT request within act
    await act(async () => {
      await result.current.execute('/api/products/1', {
        name: 'Updated Product',
        price: 39.99
      });
    });

    // Wait for the request to complete and data to be populated
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Check that the data was received correctly
    expect(result.current.data).toEqual({
      id: '1',
      name: 'Updated Product',
      price: 39.99,
      description: 'A test product',
      category: 'electronics',
      imageUrl: 'https://example.com/image.jpg',
      stock: 10,
      rating: 4.5
    });
  });

  test('should handle DELETE request successfully', async () => {
    const { result } = renderHook(() => useDelete());

    // Execute the DELETE request within act
    await act(async () => {
      await result.current.execute('/api/products/1');
    });

    // Wait for the request to complete and data to be populated
    await waitFor(() => {
      // For DELETE requests, we expect loading to become false
    });

    // For DELETE requests, the response might be null or an empty response
    // Check that loading is false and no error occurred
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle error responses', async () => {
    const { result } = renderHook(() => usePost());

    // Execute a request that will fail within act
    await act(async () => {
      await result.current.execute('/api/auth/login', {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    });

    // Wait for the request to complete and error to be populated
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    // Check that an error was received
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.status).toBe(401);
  });

  test('should reset state properly', async () => {
    const { result } = renderHook(() => useGet<any>());

    // Execute a request to populate state within act
    await act(async () => {
      await result.current.execute('/api/auth/me');
    });

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Verify data was loaded
    expect(result.current.data).not.toBeNull();

    // Reset the state within act
    await act(() => {
      result.current.reset();
    });

    // Check that state was reset
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});