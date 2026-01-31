import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowUpDown
} from 'lucide-react';
import { Card, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-react';
import { useGetAdminOrders, useUpdateAdminOrder, useBulkUpdateOrderStatus, useExportOrders } from '@/hooks/useAdmin';
import { useAdminSocket } from '@/hooks/useAdminSocket';
import { useCurrencyFormat } from '@/lib/currency';
import { toast } from 'sonner';
import type { AdminOrder } from '@/types';

type SortField = 'id' | 'customerName' | 'total' | 'status' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormat();
  const { data: ordersData, loading, error, getAdminOrders } = useGetAdminOrders();
  const { updateAdminOrder } = useUpdateAdminOrder();
  const { bulkUpdateOrderStatus } = useBulkUpdateOrderStatus();
  const { exportOrders } = useExportOrders();
  const { isConnected, newOrders, updatedOrders, clearNewOrders, clearUpdatedOrders } = useAdminSocket();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'created_at',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    getAdminOrders();
  }, []);

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
    }
  }, [ordersData]);

  useEffect(() => {
    if (newOrders.length > 0) {
      toast.success(`New order received: #${newOrders[0].id}`);
      setOrders(prev => [newOrders[0], ...prev]);
      clearNewOrders();
    }
  }, [newOrders]);

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
  }, [updatedOrders]);

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

    result.sort((a, b) => {
      let aValue: any = a[sortConfig.field];
      let bValue: any = b[sortConfig.field];

      if (sortConfig.field === 'customerName') {
        aValue = a.customerName || `User #${a.user_id}`;
        bValue = b.customerName || `User #${b.user_id}`;
      }

      if (sortConfig.field === 'total') {
        aValue = a.total || 0;
        bValue = b.total || 0;
      }

      if (sortConfig.field === 'created_at') {
        aValue = new Date(a.created_at || '').getTime();
        bValue = new Date(b.created_at || '').getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortConfig]);

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

  const handleStatusUpdate = async (orderId: string, status: AdminOrder['status']) => {
    try {
      await updateAdminOrder(orderId, { status });
      toast.success(`Order #${orderId} updated to ${status}`);
      getAdminOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrders.size === 0) return;

    setUpdatingStatus(true);
    try {
      await bulkUpdateOrderStatus({
        orderIds: Array.from(selectedOrders).map(id => id.toString()),
        status: status as any
      });
      toast.success(`Updated ${selectedOrders.size} orders to ${status}`);
      setSelectedOrders(new Set());
      getAdminOrders();
    } catch (err) {
      toast.error('Failed to update orders');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportOrders();
      toast.success('Orders exported successfully');
    } catch (err) {
      toast.error('Failed to export orders');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
          <Button color="gray" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
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
        </div>
      </Card>

      {selectedOrders.size > 0 && (
        <Card className="mb-4 bg-gray-50">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">{selectedOrders.size} orders selected</span>
            <div className="flex gap-2">
              <select
                onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value)}
                value=""
                disabled={updatingStatus}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Update Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button color="gray" size="sm" onClick={() => setSelectedOrders(new Set())}>
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
                    Order #
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    <SortIcon field="customerName" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Items</th>
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center gap-1">
                    Total
                    <SortIcon field="total" />
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
                <th
                  className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <SortIcon field="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No orders found
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
                      {order.orderItems?.length || 1} items
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.created_at || '')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="p-1 hover:bg-gray-100 rounded"
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
                            <Check className="w-4 h-4 mr-2" /> Confirm
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'processing')}>
                            <Edit className="w-4 h-4 mr-2" /> Processing
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'shipped')}>
                            <Check className="w-4 h-4 mr-2" /> Shipped
                          </DropdownItem>
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'delivered')}>
                            <Check className="w-4 h-4 mr-2 text-green-600" /> Delivered
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem onClick={() => handleStatusUpdate(order.id.toString(), 'cancelled')}>
                            <span className="text-red-600">Cancel Order</span>
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
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
      </Card>
    </div>
  );
}
