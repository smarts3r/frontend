import { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Folder,
  Package,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { Card, Button } from 'flowbite-react';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { Category } from '@/types/types';
import CategoryModal, { type CategoryFormData } from '@/components/admin/CategoryModal';

type SortField = 'name' | 'productCount' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function AdminCategoriesPage() {
  const { data: categoriesData, loading: loadingCategories, error: errorCategories, execute: executeGet } = useGet<Category[]>();
  const { loading: creating, execute: executeCreate } = usePost<Category>();
  const { loading: updating, execute: executeUpdate } = usePut<Category>();
  const { loading: deleting, execute: executeDelete } = useDelete<void>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const fetchCategories = async () => {
    await executeGet('/api/categories');
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(category =>
        category.name.toLowerCase().includes(term) ||
        (category.description && category.description.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      if (sortConfig.field === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.field === 'productCount') {
        aValue = a.productCount || 0;
        bValue = b.productCount || 0;
      } else if (sortConfig.field === 'created_at') {
        aValue = new Date(a.created_at || '').getTime();
        bValue = new Date(b.created_at || '').getTime();
      }

      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [categories, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedCategories.length / itemsPerPage);
  const paginatedCategories = filteredAndSortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    const payload = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      image: data.image.trim() || undefined
    };

    if (editingCategory) {
      const result = await executeUpdate(`/api/categories/${editingCategory.id}`, payload);
      if (result) {
        toast.success('Category updated successfully');
        fetchCategories();
        closeModal();
      } else {
        toast.error('Failed to update category');
      }
    } else {
      const result = await executeCreate('/api/categories', payload);
      if (result) {
        toast.success('Category created successfully');
        fetchCategories();
        closeModal();
      } else {
        toast.error('Failed to create category');
      }
    }
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    const result = await executeDelete(`/api/categories/${categoryToDelete.id}`);
    if (result !== null) {
      toast.success('Category deleted successfully');
      fetchCategories();
      closeDeleteModal();
    } else {
      toast.error('Failed to delete category');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-gray-900" />
      : <ChevronDown className="w-4 h-4 text-gray-900" />;
  };

  if (loadingCategories && categories.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-12 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (errorCategories && categories.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load categories</h1>
        <button 
          onClick={fetchCategories}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <Folder className="w-4 h-4" />
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Description</th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('productCount')}
                >
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Products
                    <SortIcon field="productCount" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Folder className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                      <p className="truncate">{category.description || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {category.productCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCategories.length)} of {filteredAndSortedCategories.length} categories
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>

      <CategoryModal
        isOpen={isModalOpen}
        mode={editingCategory ? 'edit' : 'add'}
        category={editingCategory || undefined}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isLoading={creating || updating}
      />

      {deleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Delete Category</h2>
              </div>
            </div>
            
            <div className="px-6 py-6">
              {categoryToDelete && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  {categoryToDelete.image ? (
                    <img 
                      src={categoryToDelete.image} 
                      alt={categoryToDelete.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Folder className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{categoryToDelete.name}</p>
                    <p className="text-sm text-gray-500">
                      {categoryToDelete.productCount || 0} products
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Warning</p>
                  <p className="text-sm text-amber-700 mt-1">
                    {categoryToDelete?.productCount && categoryToDelete.productCount > 0 
                      ? `This category has ${categoryToDelete.productCount} product${categoryToDelete.productCount > 1 ? 's' : ''}. Deleting it will make these products uncategorized.`
                      : 'This action cannot be undone. The category will be permanently removed.'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Deleting...
                  </>
                ) : (
                  'Delete Category'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
