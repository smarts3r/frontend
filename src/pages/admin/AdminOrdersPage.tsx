import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Check,
  MoreHorizontal,
  ArrowUpDown,
  Printer,
  FileSpreadsheet,
  Package,
  Clock,
  RotateCcw,
  CheckCircle,
  Calendar,
  X
} from 'lucide-react';
import { Card, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-react';
import { useGetAdminOrders, useUpdateAdminOrder, useBulkUpdateOrderStatus, useExportOrders } from '@/hooks/useAdmin';
import { useAdminSocket } from '@/hooks/useAdminSocket';
import { useCurrencyFormat } from '@/lib/currency';
import { toast } from 'sonner';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import type { AdminOrder } from '@/types';

type SortField = 'id' | 'customerName' | 'total' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedToday: number;
  todayGrowth: number;
  completedGrowth: number;
}

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const formatCurrency = useCurrencyFormat();
  const { data: ordersData, loading, getAdminOrders } = useGetAdminOrders();
  const { updateAdminOrder } = useUpdateAdminOrder();
  const { bulkUpdateOrderStatus } = useBulkUpdateOrderStatus();
  const { exportOrders } = useExportOrders();
  const { isConnected, newOrders, updatedOrders, clearNewOrders, clearUpdatedOrders } = useAdminSocket();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'created_at',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    getAdminOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
    }
  }, [ordersData]);

  useEffect(() => {
    if (newOrders.length > 0) {
      toast.success(t('admin.orders.newOrderReceived', { id: newOrders[0].id }));
      setOrders(prev => [newOrders[0], ...prev]);
      clearNewOrders();
    }
  }, [newOrders, clearNewOrders, t]);

  useEffect(() => {
    if (updatedOrders.length > 0) {
      const latestUpdate = updatedOrders[0];
      setOrders(prev => prev.map(order =>
        order.id.toString() === latestUpdate.orderId
          ? { ...order, status: latestUpdate.status as AdminOrder['status'] }
          : order
      ));
      clearUpdatedOrders();
    }
  }, [updatedOrders, clearUpdatedOrders]);

  const stats: OrderStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || '');
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;

    const yesterdayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || '');
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === yesterday.getTime();
    }).length;

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;

    const completedToday = orders.filter(o => {
      const orderDate = new Date(o.created_at || '');
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime() && o.status === 'delivered';
    }).length;

    const completedYesterday = orders.filter(o => {
      const orderDate = new Date(o.created_at || '');
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === yesterday.getTime() && o.status === 'delivered';
    }).length;

    const todayGrowth = yesterdayOrders === 0 ? 100 : Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100);
    const completedGrowth = completedYesterday === 0 ? 100 : Math.round(((completedToday - completedYesterday) / completedYesterday) * 100);

    return {
      todayOrders,
      pendingOrders,
      processingOrders,
      completedToday,
      todayGrowth,
      completedGrowth
    };
  }, [orders]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(term) ||
        order.customerName?.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(order => {
        const orderDate = new Date(order.created_at || '');
        return orderDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(order => {
        const orderDate = new Date(order.created_at || '');
        return orderDate <= toDate;
      });
    }

    result.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (sortConfig.field === 'customerName') {
        aValue = a.customerName || `User #${a.user_id}`;
        bValue = b.customerName || `User #${b.user_id}`;
      } else if (sortConfig.field === 'total') {
        aValue = a.total || 0;
        bValue = b.total || 0;
      } else if (sortConfig.field === 'created_at') {
        aValue = new Date(a.created_at || '').getTime();
        bValue = new Date(b.created_at || '').getTime();
      } else if (sortConfig.field === 'id') {
        aValue = a.id;
        bValue = b.id;
      } else if (sortConfig.field === 'status') {
        aValue = a.status || '';
        bValue = b.status || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedOrders.size === paginatedOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(paginatedOrders.map(o => o.id)));
    }
  };

  const handleSelectOrder = (orderId: number) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const openOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeOrderDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdateFromModal = async (orderId: string, status: string) => {
    setIsModalLoading(true);
    try {
      await updateAdminOrder(orderId, { status: status as AdminOrder['status'] });
      toast.success(t('admin.orders.statusUpdated', { id: orderId, status }));
      setOrders(prev => prev.map(order =>
        order.id.toString() === orderId
          ? { ...order, status: status as AdminOrder['status'] }
          : order
      ));
    } catch {
      toast.error(t('admin.orders.errors.statusUpdateFailed'));
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateAdminOrder(orderId, { status: status as AdminOrder['status'] });
      toast.success(t('admin.orders.statusUpdated', { id: orderId, status }));
      getAdminOrders();
    } catch {
      toast.error(t('admin.orders.errors.statusUpdateFailed'));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrders.size === 0) return;

    setUpdatingStatus(true);
    try {
      await bulkUpdateOrderStatus({
        orderIds: Array.from(selectedOrders).map(id => id.toString()),
        status: status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      });
      toast.success(t('admin.orders.bulkStatusUpdated', { count: selectedOrders.size, status }));
      setSelectedOrders(new Set());
      getAdminOrders();
    } catch {
      toast.error(t('admin.orders.errors.bulkUpdateFailed'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportOrders();
      toast.success(t('admin.orders.exported'));
    } catch {
      toast.error(t('admin.orders.errors.exportFailed'));
    }
  };

  const handleExportSelected = () => {
    if (selectedOrders.size === 0) return;

    const selectedData = orders.filter(o => selectedOrders.has(o.id));
    const csvContent = convertToCSV(selectedData);
    downloadCSV(csvContent, `selected-orders-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(t('admin.orders.exportedSelected', { count: selectedOrders.size }));
  };

  const handlePrintSelected = () => {
    if (selectedOrders.size === 0) return;

    const selectedData = orders.filter(o => selectedOrders.has(o.id));
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintHTML(selectedData));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const convertToCSV = (data: AdminOrder[]) => {
    const headers = ['Order ID', 'Customer', 'Email', 'Status', 'Total', 'Items', 'Date'];
    const rows = data.map(order => [
      order.id,
      order.customerName || `User #${order.user_id}`,
      order.customerEmail,
      order.status || 'pending',
      order.total || 0,
      order.orderItems?.length || 0,
      new Date(order.created_at || '').toLocaleDateString()
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = (data: AdminOrder[]) => {
    return `
      <html>
        <head>
          <title>Selected Orders - Smart S3r</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            h1 { text-align: center; }
            .header { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Smart S3r - Selected Orders</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>Total Orders: ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(order => `
                <tr>
                  <td>#${order.id}</td>
                  <td>${order.customerName || `User #${order.user_id}`}</td>
                  <td>${order.customerEmail}</td>
                  <td>${order.status || 'pending'}</td>
                  <td>${formatCurrency(order.total || 0)}</td>
                  <td>${new Date(order.created_at || '').toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const setQuickDateRange = (range: 'today' | 'week' | 'month') => {
    const today = new Date();
    const fromDate = new Date();

    if (range === 'today') {
      fromDate.setHours(0, 0, 0, 0);
    } else if (range === 'week') {
      fromDate.setDate(today.getDate() - 7);
    } else if (range === 'month') {
      fromDate.setMonth(today.getMonth() - 1);
    }

    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  const clearDateFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-gray-900" />
      : <ChevronDown className="w-4 h-4 text-gray-900" />;
  };

  if (loading && orders.length === 0) {
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.orders.title')}</h1>
          <p className="text-gray-600">{t('admin.orders.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? t('admin.orders.live') : t('admin.orders.offline')}
          </div>
          <Button color="gray" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            {t('admin.orders.exportAll')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              {stats.todayGrowth !== 0 && (
                <span className={`text-xs font-medium ${stats.todayGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.todayGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.todayGrowth)}% {t('admin.orders.vsYesterday')}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.todayOrders}</p>
            <p className="text-sm text-gray-600">{t('admin.orders.stats.todayOrders')}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-600">{t('admin.orders.stats.pending')}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <RotateCcw className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.processingOrders}</p>
            <p className="text-sm text-gray-600">{t('admin.orders.stats.processing')}</p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              {stats.completedGrowth !== 0 && (
                <span className={`text-xs font-medium ${stats.completedGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.completedGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.completedGrowth)}% {t('admin.orders.vsYesterday')}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completedToday}</p>
            <p className="text-sm text-gray-600">{t('admin.orders.stats.completedToday')}</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="From"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                placeholder="To"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Quick filters:</span>
            <button
              onClick={() => setQuickDateRange('today')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t('admin.orders.filters.today')}
            </button>
            <button
              onClick={() => setQuickDateRange('week')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t('admin.orders.filters.last7Days')}
            </button>
            <button
              onClick={() => setQuickDateRange('month')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t('admin.orders.filters.thisMonth')}
            </button>
            {(dateFrom || dateTo) && (
              <button
                onClick={clearDateFilters}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                {t('admin.orders.filters.clearDates')}
              </button>
            )}
          </div>
        </div>
      </Card>

      {selectedOrders.size > 0 && (
        <div className="mb-4 bg-gray-900 text-white rounded-xl shadow-lg transform transition-all animate-fadeIn">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold">{t('admin.orders.selected', { count: selectedOrders.size })}</span>
                <p className="text-sm text-gray-400">{t('admin.orders.chooseAction')}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value)}
                value=""
                disabled={updatingStatus}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
              >
                <option value="">{t('admin.orders.updateStatus')}</option>
                <option value="pending">{t('admin.orders.status.pending')}</option>
                <option value="confirmed">{t('admin.orders.status.confirmed')}</option>
                <option value="processing">{t('admin.orders.status.processing')}</option>
                <option value="shipped">{t('admin.orders.status.shipped')}</option>
                <option value="delivered">{t('admin.orders.status.delivered')}</option>
                <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
              </select>
              <button
                onClick={handlePrintSelected}
                disabled={updatingStatus}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                {t('admin.orders.print')}
              </button>
              <button
                onClick={handleExportSelected}
                disabled={updatingStatus}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {t('admin.orders.export')}
              </button>
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition-colors"
              >
                {t('admin.orders.clear')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginatedOrders.length > 0 && selectedOrders.size === paginatedOrders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.orders.table.orderNumber')}
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.orders.table.customer')}
                    <SortIcon field="customerName" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">{t('admin.orders.table.items')}</th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.orders.table.total')}
                    <SortIcon field="total" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.orders.table.status')}
                    <SortIcon field="status" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.orders.table.date')}
                    <SortIcon field="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">{t('admin.orders.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    {t('admin.orders.empty')}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{order.customerName || `User #${order.user_id}`}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t('admin.orders.itemCount', { count: order.orderItems?.length || 1 })}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(order.status)}`}>
                        {order.status || t('admin.orders.status.pending')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.created_at || '')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={t('admin.orders.viewOrderDetails')}
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <Dropdown
                          label=""
                          dismissOnClick={true}
                          renderTrigger={() => (
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                        >
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'confirmed')}>
                            <Check className="w-4 h-4 mr-2" /> {t('admin.orders.status.confirmed')}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'processing')}>
                            <Edit className="w-4 h-4 mr-2" /> {t('admin.orders.status.processing')}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'shipped')}>
                            <Check className="w-4 h-4 mr-2" /> {t('admin.orders.status.shipped')}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'delivered')}>
                            <Check className="w-4 h-4 mr-2 text-green-600" /> {t('admin.orders.status.delivered')}
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'cancelled')}>
                            <span className="text-red-600">{t('admin.orders.cancelOrder')}</span>
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {t('admin.orders.pagination.showing', { 
              from: ((currentPage - 1) * itemsPerPage) + 1, 
              to: Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length), 
              total: filteredAndSortedOrders.length 
            })}
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
              {t('admin.orders.pagination.page', { current: currentPage, total: totalPages })}
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
      </Card>

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        order={selectedOrder}
        onClose={closeOrderDetail}
        onStatusUpdate={handleStatusUpdateFromModal}
        isLoading={isModalLoading}
      />
    </div>
  );
}
