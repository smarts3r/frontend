import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card } from 'flowbite-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useGetAdminDashboard, useGetAdminOrders } from '@/hooks/useAdmin';
import { useAdminSocket } from '@/hooks/useAdminSocket';
import { useCurrencyFormat } from '@/lib/currency';
import { toast } from 'sonner';
import type { AdminDashboardData, AdminOrder } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormat();
  const { data: dashboardData, loading, error, getAdminDashboard } = useGetAdminDashboard();
  const { data: ordersData, getAdminOrders } = useGetAdminOrders();
  const { isConnected, newOrders, updatedStats, clearNewOrders } = useAdminSocket();
  
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    getAdminDashboard();
    getAdminOrders();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      setStats(dashboardData);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (ordersData) {
      setRecentOrders(ordersData.slice(0, 5));
    }
  }, [ordersData]);

  useEffect(() => {
    if (newOrders.length > 0) {
      toast.success(`New order received: #${newOrders[0].id}`);
      setRecentOrders(prev => [newOrders[0], ...prev.slice(0, 4)]);
      clearNewOrders();
      getAdminDashboard();
    }
  }, [newOrders]);

  useEffect(() => {
    if (updatedStats) {
      setStats(updatedStats);
    }
  }, [updatedStats]);

  const handleRefresh = () => {
    getAdminDashboard();
    getAdminOrders();
    toast.success('Dashboard refreshed');
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    growth, 
    color 
  }: { 
    title: string; 
    value: string; 
    icon: React.ElementType; 
    growth?: number; 
    color: string;
  }) => {
    const isPositive = (growth || 0) > 0;
    
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color} text-white`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          {growth !== undefined && (
            <div className="flex items-center mt-4">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(growth)}%
              </span>
              <span className="text-sm text-gray-600 ml-1">vs last month</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !stats) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load dashboard</h1>
        <p className="text-red-600 mb-4">{error.message || 'Unknown error occurred'}</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  const chartData = stats?.monthlySales || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'Live updates' : 'Offline'}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          growth={stats?.revenueGrowth}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={(stats?.totalOrders || 0).toString()}
          icon={ShoppingCart}
          growth={stats?.ordersGrowth}
          color="bg-blue-500"
        />
        <StatCard
          title="Products"
          value={(stats?.totalProducts || 0).toString()}
          icon={Package}
          growth={stats?.productsGrowth}
          color="bg-purple-500"
        />
        <StatCard
          title="Users"
          value={(stats?.totalUsers || 0).toString()}
          icon={Users}
          growth={stats?.usersGrowth}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number | undefined) => formatCurrency(value || 0)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#111827" 
                    strokeWidth={2}
                    dot={{ fill: '#111827', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName || `User #${order.user_id}`}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at || '')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.total || 0)}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
        >
          <Package className="w-8 h-8 text-gray-600 mb-3" />
          <p className="font-medium text-gray-900">Add Product</p>
          <p className="text-sm text-gray-600">Create a new product</p>
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
        >
          <ShoppingCart className="w-8 h-8 text-gray-600 mb-3" />
          <p className="font-medium text-gray-900">View Orders</p>
          <p className="text-sm text-gray-600">Manage all orders</p>
        </button>
        <button
          onClick={() => navigate('/admin/users')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
        >
          <Users className="w-8 h-8 text-gray-600 mb-3" />
          <p className="font-medium text-gray-900">Manage Users</p>
          <p className="text-sm text-gray-600">View user accounts</p>
        </button>
        <button
          onClick={() => navigate('/admin/settings')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
        >
          <TrendingUp className="w-8 h-8 text-gray-600 mb-3" />
          <p className="font-medium text-gray-900">Analytics</p>
          <p className="text-sm text-gray-600">View detailed reports</p>
        </button>
      </div>
    </div>
  );
}
