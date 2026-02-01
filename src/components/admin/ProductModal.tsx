import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  Pencil,
  X,
  Package,
  Folder,
  Hash,
  DollarSign,
  Tag,
  Boxes,
  FileText,
  Image,
  Upload,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Product, Category } from '@/types/types';

export interface ProductFormData {
  name: string;
  category_id: number;
  price: number;
  old_price?: number;
  stock: number;
  sku?: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
}

interface ProductModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export default function ProductModal({
  isOpen,
  mode,
  product,
  categories,
  onClose,
  onSubmit,
  isLoading = false
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category_id: 0,
    price: 0,
    old_price: undefined,
    stock: 0,
    sku: '',
    description: '',
    image: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    category_id?: string;
    price?: string;
    old_price?: string;
    stock?: string;
  }>({});
  const [imageError, setImageError] = useState(false);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      if (mode === 'edit' && product) {
        setFormData({
          name: product.name,
          category_id: product.category_id,
          price: product.price,
          old_price: product.old_price,
          stock: product.stock || 0,
          sku: product.sku || '',
          description: product.description || '',
          image: product.img || '',
          status: product.status
        });
        setImageTab(product.img ? 'url' : 'url');
      } else {
        setFormData({
          name: '',
          category_id: 0,
          price: 0,
          old_price: undefined,
          stock: 0,
          sku: '',
          description: '',
          image: '',
          status: 'active'
        });
        setImageTab('url');
        setUploadedFile(null);
      }
      setFormErrors({});
      setImageError(false);
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, product]);

  // Handle keyboard events
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  const validateForm = useCallback((): boolean => {
    const errors: {
      name?: string;
      category_id?: string;
      price?: string;
      old_price?: string;
      stock?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.category_id || formData.category_id === 0) {
      errors.category_id = 'Please select a category';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.old_price !== undefined && formData.old_price <= formData.price) {
      errors.old_price = 'Old price should be greater than regular price';
    }

    if (formData.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    onSubmit({
      name: formData.name.trim(),
      category_id: formData.category_id,
      price: formData.price,
      old_price: formData.old_price,
      stock: formData.stock,
      sku: formData.sku?.trim() || undefined,
      description: formData.description?.trim() || undefined,
      image: formData.image?.trim() || undefined,
      status: formData.status
    });
  }, [formData, onSubmit, validateForm]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNumberChange = (field: 'price' | 'old_price' | 'stock', value: string) => {
    const numValue = value === '' ? (field === 'stock' ? 0 : undefined) : Number(value);
    handleInputChange(field, numValue as number);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImageError(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // For now, we'll just use the file name as a placeholder
      // In a real implementation, you'd upload the file and get a URL
      const objectUrl = URL.createObjectURL(file);
      handleImageUrlChange(objectUrl);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isImageUrlValid = formData.image?.trim() && !imageError;
  const isLowStock = formData.stock >= 0 && formData.stock < 5;

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(1rem);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />
        
        <div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn"
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b border-gray-200 ${mode === 'edit' ? 'bg-gray-50' : 'bg-white'} rounded-t-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${mode === 'edit' ? 'bg-gray-200' : 'bg-gray-100'}`}>
                  {mode === 'edit' ? (
                    <Pencil className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                    {mode === 'edit' ? 'Edit Product' : 'Add Product'}
                  </h2>
                  {mode === 'edit' && product?.id && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ID: {product.id} {product.created_at && `• Created: ${new Date(product.created_at).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column - Basic Info */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Package className="w-5 h-5" />
                    </div>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all peer ${
                        formErrors.name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                      } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.name ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      Product Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {formErrors.name && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{formErrors.name}</p>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Folder className="w-5 h-5" />
                    </div>
                    <select
                      id="category_id"
                      value={formData.category_id || ''}
                      onChange={(e) => handleInputChange('category_id', Number(e.target.value))}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all appearance-none bg-white peer ${
                        formErrors.category_id
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                      } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''} ${!formData.category_id ? 'text-gray-500' : 'text-gray-900'}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="category_id"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.category_id ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.category_id && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{formErrors.category_id}</p>
                    </div>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Hash className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all peer ${
                        isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="sku"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.sku ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      SKU
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Stock */}
              <div className="space-y-5">
                {/* Price */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => handleNumberChange('price', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all peer ${
                        formErrors.price
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                      } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="price"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.price ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {formErrors.price && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{formErrors.price}</p>
                    </div>
                  )}
                </div>

                {/* Old Price */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Tag className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      id="old_price"
                      step="0.01"
                      min="0"
                      value={formData.old_price || ''}
                      onChange={(e) => handleNumberChange('old_price', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all peer ${
                        formErrors.old_price
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                      } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="old_price"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.old_price ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      Old Price
                    </label>
                  </div>
                  {formErrors.old_price && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{formErrors.old_price}</p>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleNumberChange('stock', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all peer ${
                        formErrors.stock
                          ? 'border-red-500 focus:border-red-500'
                          : isLowStock
                          ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                          : 'border-gray-300 focus:border-gray-900'
                      } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="stock"
                      className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                        formData.stock !== undefined ? 'top-3 text-xs text-gray-700' : ''
                      }`}
                    >
                      Stock <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {formErrors.stock && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{formErrors.stock}</p>
                    </div>
                  )}
                  {isLowStock && !formErrors.stock && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm text-amber-600">Low stock warning</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mt-5">
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  maxLength={500}
                  className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none peer ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="description"
                  className={`absolute left-11 top-3 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs ${
                    formData.description ? 'top-1.5 text-xs text-gray-700' : ''
                  }`}
                >
                  Description
                </label>
              </div>
              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-gray-500">
                  Optional - max 500 characters
                </p>
                <span className={`text-xs ${(formData.description?.length || 0) >= 450 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {formData.description?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Image Section with Tabs */}
            <div className="mt-5">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      imageTab === 'url'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Image className="w-4 h-4" />
                      URL
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      imageTab === 'upload'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </div>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 bg-gray-50">
                  {imageTab === 'url' ? (
                    <div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Image className="w-5 h-5" />
                        </div>
                        <input
                          type="url"
                          id="image_url"
                          value={formData.image}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          disabled={isLoading}
                          className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all peer ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="image_url"
                          className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                            formData.image ? 'top-3 text-xs text-gray-700' : ''
                          }`}
                        >
                          Image URL
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Enter a valid image URL (e.g., https://example.com/image.jpg)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {isImageUrlValid && (
                    <div className="mt-4">
                      <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 max-h-48">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="w-full h-48 object-cover"
                          onError={() => setImageError(true)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleImageUrlChange('');
                            setUploadedFile(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.image?.trim() && imageError && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-center gap-3 text-gray-500">
                      <Image className="w-8 h-8" />
                      <span className="text-sm">Invalid image URL or image failed to load</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="mt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => !isLoading && handleInputChange('status', formData.status === 'active' ? 'inactive' : 'active')}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                  } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {formData.status === 'active' ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Inactive</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                mode === 'edit' ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
