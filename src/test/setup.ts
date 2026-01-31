import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { server } from './mock-server';

// Admin token provided by user
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZAZW1haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY5Nzg2MDI4LCJleHAiOjE3Njk3ODY5Mjh9.pS1LP1RvXbPIYHoqew-qsHrKhmqdvgNidCiXvWD-d7k";

// Start server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Set up admin token before each test
beforeEach(() => {
  // Mock localStorage with dynamic token storage
  let storedToken: string | null = ADMIN_TOKEN;
  
  const localStorageMock = {
    getItem: vi.fn((key: string) => {
      if (key === 'token') return storedToken;
      return null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      if (key === 'token') storedToken = value;
    }),
    removeItem: vi.fn((key: string) => {
      if (key === 'token') storedToken = null;
    }),
    clear: vi.fn(() => {
      storedToken = null;
    }),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
});