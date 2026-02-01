import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Filter,
  Download,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  EyeOff,
  Check,
  MoreHorizontal
} from 'lucide-react';
import { Card, Button, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownItem } from 'flowbite-react';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { useCurrencyFormat } from '@/lib/currency';
import { toast } from 'sonner';
import type { Product, Category } from '@/types/types';
import ProductModal from '@/components/admin/ProductModal';
import type { ProductFormData } from '@/components/admin/ProductModal';

type SortField = 'name' | 'price' | 'stock' | 'category' | 'status';
type SortDirection = 'asc' | 'desc';
type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

interface AdminProduct extends Product {
  category_name?: string;
}

export default function AdminProductsPage() {
  const { data: productsData, loading: loadingProducts, error: errorProducts, execute: executeGetProducts } = useGet<AdminProduct[]>();
  const { data: categoriesData, execute: executeGetCategories } = useGet<Category[]>();
  const { loading: creating, execute: executeCreate } = usePost<AdminProduct>();
  const { loading: updating, execute: executeUpdate } = usePut<AdminProduct>();
  const { loading: deleting, execute: executeDelete } = useDelete<void>();
  const { loading: importing, execute: executeImport } = usePost<void>();
  const { loading: exporting, execute: executeExport } = useGet<Blob>();
  const { loading: downloadingTemplate, execute: executeDownloadTemplate } = useGet<Blob>();

  const formatCurrency = useCurrencyFormat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
    }
  }, [productsData]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const fetchProducts = async () => {
    await executeGetProducts('/api/products');
  };

  const fetchCategories = async () => {
    await executeGetCategories('/api/categories');
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStockStatus = (stock: number): { label: string; className: string } => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-800' };
    if (stock < 5) return { label: 'Low Stock', className: 'bg-red-100 text-red-800' };
    return { label: 'In Stock', className: 'bg-green-100 text-green-800' };
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.sku && product.sku.toLowerCase().includes(term))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(product =>
        product.category_id.toString() === categoryFilter
      );
    }

    if (stockFilter !== 'all') {
      result = result.filter(product => {
        const stock = product.stock || 0;
        if (stockFilter === 'in_stock') return stock >= 5;
        if (stockFilter === 'low_stock') return stock > 0 && stock < 5;
        if (stockFilter === 'out_of_stock') return stock === 0;
        return true;
      });
    }

    result.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      if (sortConfig.field === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.field === 'price') {
        aValue = a.price;
        bValue = b.price;
      } else if (sortConfig.field === 'stock') {
        aValue = a.stock || 0;
        bValue = b.stock || 0;
      } else if (sortConfig.field === 'category') {
        aValue = a.category?.toLowerCase() || '';
        bValue = b.category?.toLowerCase() || '';
      } else if (sortConfig.field === 'status') {
        aValue = a.status;
        bValue = b.status;
      }

      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, categoryFilter, stockFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
    }
  };

  const handleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    const payload = {
      name: data.name.trim(),
      price: data.price,
      old_price: data.old_price,
      stock: data.stock,
      category_id: data.category_id,
      description: data.description?.trim() || undefined,
      sku: data.sku?.trim() || undefined,
      img: data.image?.trim() || undefined,
      status: data.status
    };

    if (editingProduct) {
      const result = await executeUpdate(`/api/products/${editingProduct.id}`, payload);
      if (result) {
        toast.success('Product updated successfully');
        fetchProducts();
        closeModal();
      } else {
        toast.error('Failed to update product');
      }
    } else {
      const result = await executeCreate('/api/products', payload);
      if (result) {
        toast.success('Product created successfully');
        fetchProducts();
        closeModal();
      } else {
        toast.error('Failed to create product');
      }
    }
  };

  const openDeleteModal = (product: AdminProduct) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    const result = await executeDelete(`/api/products/${productToDelete.id}`);
    if (result !== null) {
      toast.success('Product deleted successfully');
      fetchProducts();
      closeDeleteModal();
    } else {
      toast.error('Failed to delete product');
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedProducts.size === 0) return;
    setBulkDeleteModalOpen(true);
  };

  const closeBulkDeleteModal = () => {
    setBulkDeleteModalOpen(false);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    const deletePromises = Array.from(selectedProducts).map(id =>
      executeDelete(`/api/products/${id}`)
    );

    await Promise.all(deletePromises);
    toast.success(`${selectedProducts.size} products deleted successfully`);
    setSelectedProducts(new Set());
    fetchProducts();
    closeBulkDeleteModal();
  };

  const handleBulkCategoryChange = async (categoryId: string) => {
    if (selectedProducts.size === 0 || categoryId === '') return;

    const updatePromises = Array.from(selectedProducts).map(id =>
      executeUpdate(`/api/products/${id}`, { category_id: Number(categoryId) })
    );

    await Promise.all(updatePromises);
    toast.success(`Updated category for ${selectedProducts.size} products`);
    setSelectedProducts(new Set());
    fetchProducts();
  };

  const handleBulkStatusToggle = async () => {
    if (selectedProducts.size === 0) return;

    const productsToUpdate = products.filter(p => selectedProducts.has(p.id));
    const allActive = productsToUpdate.every(p => p.status === 'active');
    const newStatus = allActive ? 'inactive' : 'active';

    const updatePromises = Array.from(selectedProducts).map(id =>
      executeUpdate(`/api/products/${id}`, { status: newStatus })
    );

    await Promise.all(updatePromises);
    toast.success(`Set ${selectedProducts.size} products to ${newStatus}`);
    setSelectedProducts(new Set());
    fetchProducts();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const result = await executeImport('/api/admin/csv/import', formData, {
      headers: {}
    });

    if (result !== null) {
      toast.success('Products imported successfully');
      fetchProducts();
    } else {
      toast.error('Failed to import products');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    const result = await executeExport('/api/admin/csv/export');
    if (result) {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Products exported successfully');
    } else {
      toast.error('Failed to export products');
    }
  };

  const handleDownloadTemplate = async () => {
    const result = await executeDownloadTemplate('/api/admin/csv/template');
    if (result) {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded successfully');
    } else {
      toast.error('Failed to download template');
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

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  if (loadingProducts && products.length === 0) {
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

  if (errorProducts && products.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load products</h1>
        <button 
          onClick={fetchProducts}
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button color="gray" onClick={handleImportClick} disabled={importing}>
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importing...' : 'Import'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <Button color="gray">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          >
            <DropdownItem onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export Products
            </DropdownItem>
            <DropdownItem onClick={handleDownloadTemplate}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Download Template
            </DropdownItem>
          </Dropdown>
          <Button color="gray" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as StockFilter)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="all">All Stock</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock (&lt;5)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {selectedProducts.size > 0 && (
        <Card className="mb-4 bg-gray-50">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-sm text-gray-600">{selectedProducts.size} products selected</span>
            <div className="flex flex-wrap gap-2">
              <select
                onChange={(e) => handleBulkCategoryChange(e.target.value)}
                value=""
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Change Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button color="gray" size="sm" onClick={handleBulkStatusToggle}>
                <Eye className="w-4 h-4 mr-1" />
                Toggle Status
              </Button>
              <Button color="gray" size="sm" onClick={openBulkDeleteModal} className="bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button color="gray" size="sm" onClick={() => setSelectedProducts(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginatedProducts.length > 0 && selectedProducts.size === paginatedProducts.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Image</th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Price
                    <SortIcon field="price" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-1">
                    Stock
                    <SortIcon field="stock" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    <SortIcon field="category" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock || 0);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {product.img ? (
                          <img 
                            src={product.img} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          {product.sku && (
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(product.price)}</p>
                          {product.old_price && (
                            <p className="text-xs text-gray-500 line-through">
                              {formatCurrency(product.old_price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.className}`}>
                          {product.stock || 0} - {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getCategoryName(product.category_id)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.status === 'active' ? (
                            <><Eye className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
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

      <ProductModal
        isOpen={isModalOpen}
        mode={editingProduct ? 'edit' : 'add'}
        product={editingProduct || undefined}
        categories={categories}
        onClose={closeModal}
        onSubmit={handleProductSubmit}
        isLoading={creating || updating}
      />

      <Modal show={deleteModalOpen} onClose={closeDeleteModal} size="md">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Product
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button 
            color="gray" 
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={bulkDeleteModalOpen} onClose={closeBulkDeleteModal} size="md">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Bulk Delete Products
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedProducts.size} products</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={closeBulkDeleteModal}>
            Cancel
          </Button>
          <Button 
            color="gray" 
            onClick={handleBulkDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? 'Deleting...' : 'Delete All'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
