import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import {
  useGetCategories,
  useGetCategoryById,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '../useCategories';

describe('Category Hooks', () => {
  describe('useGetCategories', () => {
    test('should fetch categories successfully', async () => {
      const { result } = renderHook(() => useGetCategories());

      // Execute getting categories within act
      await act(async () => {
        await result.current.getCategories();
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the categories were retrieved successfully
      expect(result.current.data).toEqual([
        {
          id: '1',
          name: 'Electronics',
          description: 'Electronic devices and accessories'
        }
      ]);
    });
  });

  describe('useGetCategoryById', () => {
    test('should fetch a category by ID successfully', async () => {
      const { result } = renderHook(() => useGetCategoryById());

      // Execute getting category by ID within act
      await act(async () => {
        await result.current.getCategoryById('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the category was retrieved successfully
      expect(result.current.data).toEqual({
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and accessories'
      });
    });

    test('should handle category not found', async () => {
      const { result } = renderHook(() => useGetCategoryById());

      // Execute getting category by non-existent ID within act
      await act(async () => {
        await result.current.getCategoryById('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useCreateCategory', () => {
    test('should create a category successfully', async () => {
      const { result } = renderHook(() => useCreateCategory());

      // Execute creating a category within act
      const newCategory = {
        name: 'Books',
        description: 'Various books and literature'
      };

      let createdCategory;
      await act(async () => {
        createdCategory = await result.current.createCategory(newCategory);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the category was created successfully
      expect(createdCategory).toEqual({
        ...newCategory,
        id: '2'  // The mock server assigns ID '2' to new categories
      });
    });
  });

  describe('useUpdateCategory', () => {
    test('should update a category successfully', async () => {
      const { result } = renderHook(() => useUpdateCategory());

      // Execute updating a category within act
      const updates = {
        name: 'Updated Electronics',
        description: 'Updated electronic devices and accessories'
      };

      let updatedCategory;
      await act(async () => {
        updatedCategory = await result.current.updateCategory('1', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the category was updated successfully
      expect(updatedCategory).toEqual({
        id: '1',
        name: 'Updated Electronics',
        description: 'Updated electronic devices and accessories'
      });
    });

    test('should handle updating non-existent category', async () => {
      const { result } = renderHook(() => useUpdateCategory());

      // Execute updating a non-existent category within act
      const updates = {
        name: 'Updated Category',
        description: 'Updated description'
      };

      let updatedCategory;
      await act(async () => {
        updatedCategory = await result.current.updateCategory('999', updates);
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(updatedCategory).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('useDeleteCategory', () => {
    test('should delete a category successfully', async () => {
      const { result } = renderHook(() => useDeleteCategory());

      // Execute deleting a category within act
      await act(async () => {
        await result.current.deleteCategory('1');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that the category was deleted successfully (204 response)
      expect(result.current.data).toBeNull();
    });

    test('should handle deleting non-existent category', async () => {
      const { result } = renderHook(() => useDeleteCategory());

      // Execute deleting a non-existent category within act
      await act(async () => {
        await result.current.deleteCategory('999');
      });

      // Wait for the request to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check that an error was returned
      expect(result.current.error).not.toBeNull();
    });
  });
});