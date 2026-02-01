import { useEffect, useRef, useCallback, useState } from 'react';
import {
  Package,
  X,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Printer,
  Mail,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCurrencyFormat } from '@/lib/currency';
import type { AdminOrder } from '@/types';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: AdminOrder | null;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  isLoading?: boolean;
}

interface ExtendedAdminOrder extends AdminOrder {
  paymentMethod?: string;
  paymentStatus?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Placed', color: 'yellow' },
  { key: 'confirmed', label: 'Confirmed', color: 'blue' },
  { key: 'processing', label: 'Processing', color: 'indigo' },
  { key: 'shipped', label: 'Shipped', color: 'purple' },
  { key: 'delivered', label: 'Delivered', color: 'green' }
] as const;

export default function OrderDetailModal({
  isOpen,
  order,
  onClose,
  onStatusUpdate,
  isLoading = false
}: OrderDetailModalProps) {
  const formatCurrency = useCurrencyFormat();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  const extendedOrder = order as ExtendedAdminOrder | null;

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmStatus) {
          setConfirmStatus(null);
        } else {
          onClose();
        }
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, confirmStatus]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEmailCustomer = useCallback(() => {
    if (!extendedOrder?.customerEmail) return;

    const subject = encodeURIComponent(`Order #${extendedOrder.id} - Smart S3r`);
    const body = encodeURIComponent(
      `Dear ${extendedOrder.customerName || 'Customer'},\n\n` +
      `Thank you for your order #${extendedOrder.id}.\n\n` +
      `Order Total: ${formatCurrency(extendedOrder.total || 0)}\n` +
      `Status: ${extendedOrder.status || 'Pending'}\n\n` +
      `You can track your order status in your account.\n\n` +
      `Best regards,\nSmart S3r Team`
    );

    window.open(`mailto:${extendedOrder.customerEmail}?subject=${subject}&body=${body}`, '_blank');
  }, [extendedOrder, formatCurrency]);

  const handleStatusClick = (status: string) => {
    if (!extendedOrder) return;

    const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === extendedOrder.status);
    const newStatusIndex = STATUS_STEPS.findIndex(s => s.key === status);

    if (newStatusIndex < currentStatusIndex) {
      setConfirmStatus(status);
    } else {
      onStatusUpdate(extendedOrder.id.toString(), status);
    }
  };

  const confirmStatusUpdate = () => {
    if (confirmStatus && extendedOrder) {
      onStatusUpdate(extendedOrder.id.toString(), confirmStatus);
      setConfirmStatus(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepStatus = (stepKey: string) => {
    if (!extendedOrder?.status || extendedOrder.status === 'cancelled') return 'pending';

    const currentIndex = STATUS_STEPS.findIndex(s => s.key === extendedOrder.status);
    const stepIndex = STATUS_STEPS.findIndex(s => s.key === stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (!isOpen || !extendedOrder) return null;

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
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .modal-backdrop { position: static !important; background: white !important; }
          .modal-content {
            position: static !important;
            max-height: none !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
        }
        .print-only { display: none; }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn no-print"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn modal-backdrop" />

        <div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scaleIn modal-content"
        >
          {confirmStatus && (
            <div className="absolute inset-0 bg-white/90 z-50 flex items-center justify-center p-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Status Change</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to change the order status to{' '}
                  <span className="font-medium capitalize">{confirmStatus}</span>?
                  This will move the order backwards in the workflow.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setConfirmStatus(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Package className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                    Order #{extendedOrder.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(extendedOrder.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Print order"
                  title="Print Order"
                >
                  <Printer className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 print-body">
            {extendedOrder.status === 'cancelled' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">This order has been cancelled</span>
                </div>
              </div>
            ) : (
              <div className="no-print">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Status</h3>
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.map((step, index) => {
                    const stepStatus = getStepStatus(step.key);
                    const isClickable = !isLoading && extendedOrder.status !== 'cancelled';

                    return (
                      <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <button
                          onClick={() => isClickable && handleStatusClick(step.key)}
                          disabled={!isClickable}
                          className={`flex flex-col items-center gap-1 group ${
                            isClickable ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              stepStatus === 'completed'
                                ? 'bg-green-500 text-white'
                                : stepStatus === 'current'
                                ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                                : 'bg-gray-200 text-gray-400'
                            } ${isClickable && stepStatus !== 'current' ? 'group-hover:ring-2 group-hover:ring-gray-300' : ''}`}
                          >
                            {stepStatus === 'completed' ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              stepStatus === 'current'
                                ? 'text-blue-600'
                                : stepStatus === 'completed'
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </button>
                        {index < STATUS_STEPS.length - 1 && (
                          <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                            <div
                              className={`h-full transition-all ${
                                stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                              style={{ width: stepStatus === 'completed' ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Customer</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-gray-900">
                      {extendedOrder.customerName || `User #${extendedOrder.user_id}`}
                    </p>
                    <p className="text-sm text-gray-600">{extendedOrder.customerEmail}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Shipping Address</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="text-gray-500 italic">Address not available</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Order Details</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(extendedOrder.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">
                        {extendedOrder.paymentMethod || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        (extendedOrder.paymentStatus === 'paid')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {extendedOrder.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Order Total</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(extendedOrder.subtotal || extendedOrder.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(extendedOrder.shipping || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(extendedOrder.tax || 0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(extendedOrder.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Order
                  </button>
                  <button
                    onClick={handleEmailCustomer}
                    disabled={!extendedOrder.customerEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-4 h-4" />
                    Email Customer
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">Order Items</h3>
                <span className="text-xs text-gray-500">
                  ({extendedOrder.orderItems?.length || 0} items)
                </span>
              </div>
              <div className="space-y-3">
                {extendedOrder.orderItems && extendedOrder.orderItems.length > 0 ? (
                  extendedOrder.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product?.img ? (
                          <img
                            src={item.product.img}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.name || `Product #${item.product_id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.product?.sku || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items found for this order
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={extendedOrder.status || 'pending'}
                onChange={(e) => handleStatusClick(e.target.value)}
                disabled={isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="print-only">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Smart S3r</h1>
            <p className="text-gray-600">Order Receipt</p>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Order #{extendedOrder.id}</h2>
            <p className="text-gray-600">{formatDate(extendedOrder.created_at)}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
              <p className="text-gray-700">{extendedOrder.customerName || `User #${extendedOrder.user_id}`}</p>
              <p className="text-gray-700">{extendedOrder.customerEmail}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
              <p className="text-gray-700 capitalize">{extendedOrder.status || 'Pending'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-700">Product</th>
                  <th className="text-center py-2 text-gray-700">Qty</th>
                  <th className="text-right py-2 text-gray-700">Price</th>
                  <th className="text-right py-2 text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {extendedOrder.orderItems?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">{item.product?.name || `Product #${item.product_id}`}</td>
                    <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                    <td className="py-2 text-right text-gray-700">{formatCurrency(item.unit_price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">{formatCurrency(extendedOrder.subtotal || extendedOrder.total || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-gray-900">{formatCurrency(extendedOrder.shipping || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-gray-900">{formatCurrency(extendedOrder.tax || 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>{formatCurrency(extendedOrder.total || 0)}</span>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p>Smart S3r - www.smarts3r.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
