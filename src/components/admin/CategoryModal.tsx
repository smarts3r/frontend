import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Pencil, X, Folder, FileText, Image, AlertCircle, Loader2 } from 'lucide-react';
import type { Category } from '@/types/types';

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  category?: Category;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export default function CategoryModal({
  isOpen,
  mode,
  category,
  onClose,
  onSubmit,
  isLoading = false
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      if (mode === 'edit' && category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          image: category.image || ''
        });
      } else {
        setFormData({ name: '', description: '', image: '' });
      }
      setFormErrors({});
      setImageError(false);
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, category]);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, input, textarea, [tabindex]:not([tabindex="-1"])'
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
    const errors: { name?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.name]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image.trim()
    });
  }, [formData, onSubmit, validateForm]);

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
    if (field === 'image') {
      setImageError(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isImageUrlValid = formData.image.trim() && !imageError;

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
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn"
        >
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
                  {mode === 'edit' ? 'Edit Category' : 'Create Category'}
                </h2>
                {mode === 'edit' && category?.created_at && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created: {new Date(category.created_at).toLocaleDateString()}
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

        <div className="px-6 py-6 space-y-5">
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Folder className="w-5 h-5" />
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
                Category Name <span className="text-red-500">*</span>
              </label>
            </div>
            {formErrors.name && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{formErrors.name}</p>
              </div>
            )}
          </div>

          <div>
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
                maxLength={200}
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
                Optional - max 200 characters
              </p>
              <span className={`text-xs ${formData.description.length >= 190 ? 'text-amber-600' : 'text-gray-400'}`}>
                {formData.description.length}/200
              </span>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Image className="w-5 h-5" />
              </div>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                disabled={isLoading}
                className={`w-full pl-11 pr-4 pt-6 pb-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all peer ${
                  isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder=" "
              />
              <label
                htmlFor="image"
                className={`absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                  formData.image ? 'top-3 text-xs text-gray-700' : ''
                }`}
              >
                Image URL
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Recommended: 400x400px square image
            </p>
          </div>

          {isImageUrlValid && (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <div className="p-3 border-b border-gray-200 bg-white">
                <span className="text-sm font-medium text-gray-700">Image Preview</span>
              </div>
              <div className="p-4">
                <div className="relative rounded-lg overflow-hidden bg-white border border-gray-100 max-h-48">
                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.image.trim() && imageError && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-center justify-center gap-3 text-gray-500">
              <Image className="w-8 h-8" />
              <span className="text-sm">Invalid image URL or image failed to load</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              mode === 'edit' ? 'Update Category' : 'Create Category'
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
