import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useLogin, useRegister, useLogout, useRefreshToken, useGetCurrentUser } from '../useAuth';

describe('Authentication Hooks', () => {
  describe('useLogin', () => {
    test('should login successfully and store token', async () => {
      const { result } = renderHook(() => useLogin());

      // Execute login within act
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password'
        });
      });

      // Wait for the request to complete and data to be populated
      await waitFor(() => {
        expect(result.current.data).not.toBeNull();
      });

      // Check that the login was successful
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

      // Check that token was stored in localStorage
      expect(localStorage.getItem('token')).toBe('mock-user-token');
    });

    test('should handle admin login successfully', async () => {
      const { result } = renderHook(() => useLogin());

      // Execute admin login with provided credentials
      await act(async () => {
        await result.current.login({
          email: 'dev@email.com',
          password: 'dev132'
        });
      });

      // Wait for the request to complete and data to be populated
      await waitFor(() => {
        expect(result.current.data).not.toBeNull();
      });

      // Check that the admin login was successful
      expect(result.current.data).toEqual({
        token: 'mock-admin-token',
        user: {
          id: '2',
          email: 'dev@email.com',
          firstName: "ADMIN",
          lastName: 'User',
          role: "ADMIN"
        }
      });

      // Check that admin token was stored in localStorage
      expect(localStorage.getItem('token')).toBe('mock-admin-token');
    });

    test('should handle login failure', async () => {
      const { result } = renderHook(() => useLogin());

      // Execute login with invalid credentials
      result.current.login({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });

      // Wait for the request to complete and error to be populated
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Check that login failed
      expect(result.current.data).toBeNull();
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.status).toBe(401);
    });
  });

  describe('useRegister', () => {
    test('should register successfully and store token', async () => {
      const { result } = renderHook(() => useRegister());

      // Execute registration
      result.current.register({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      });

      // Wait for the request to complete and data to be populated
      await waitFor(() => {
        expect(result.current.data).not.toBeNull();
      });

      // Check that the registration was successful
      expect(result.current.data).toEqual({
        token: 'mock-register-token',
        user: {
          id: '3',
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User'
        }
      });

      // Check that token was stored in localStorage
      expect(localStorage.getItem('token')).toBe('mock-register-token');
    });
  });

  describe('useLogout', () => {
    test('should logout successfully and remove token', async () => {
      // Pre-populate localStorage with a token
      localStorage.setItem('token', 'some-token');

      const { result } = renderHook(() => useLogout());

      // Execute logout
      result.current.logout();

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the logout was successful
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();

      // Check that token was removed from localStorage
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('useRefreshToken', () => {
    test('should refresh token successfully', async () => {
      const { result } = renderHook(() => useRefreshToken());

      // Execute token refresh
      result.current.refreshToken();

      // Wait for the request to complete and data to be populated
      await waitFor(() => {
        expect(result.current.data).not.toBeNull();
      });

      // Check that the token refresh was successful
      expect(result.current.data).toEqual({
        token: 'mock-refreshed-token'
      });

      // Check that the new token was stored in localStorage
      expect(localStorage.getItem('token')).toBe('mock-refreshed-token');
    });
  });

  describe('useGetCurrentUser', () => {
    test('should get current user successfully', async () => {
      const { result } = renderHook(() => useGetCurrentUser());

      // Execute getting current user
      result.current.getCurrentUser();

      // Wait for the request to complete and data to be populated
      await waitFor(() => {
        expect(result.current.data).not.toBeNull();
      });

      // Check that the user was retrieved successfully
      expect(result.current.data).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      });
    });
  });
});