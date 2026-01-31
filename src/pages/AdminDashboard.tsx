import {
  BarChart3,
  DollarSign,
  Edit,
  Eye,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import type { Order, Product, User as UserType } from "@/types/";
import { useCurrencyFormat } from "@/lib/currency"; // Import useCurrencyFormat

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  usersGrowth: number;
}

export default function AdminDashboard() {
  console.log("AdminDashboard: component start");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  console.log("AdminDashboard: user", user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const formatCurrency = useCurrencyFormat();

  useEffect(() => {
    console.log("AdminDashboard: useEffect start", user);
    // Check if user is admin
    // if (user.role.toUpperCase() !== "ADMIN") {
    //   console.log("AdminDashboard: user not admin, redirecting");
    //   navigate("/");
    //   return;
    // }
    console.log("AdminDashboard: user is admin");

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock dashboard data - replace with actual API calls
        const mockStats: DashboardStats = {
          totalRevenue: 45678.9,
          totalOrders: 234,
          totalProducts: 89,
          totalUsers: 1234,
          revenueGrowth: 12.5,
          ordersGrowth: 8.3,
          productsGrowth: -2.1,
          usersGrowth: 15.7,
        };

        const mockRecentOrders: Order[] = [
          {
            id: 1,
            user_id: 1,
            product_id: 1,
            quantity: 2,
            created_at: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            user_id: 2,
            product_id: 2,
            quantity: 1,
            created_at: "2024-01-15T09:15:00Z",
          },
        ];

        const mockTopProducts: Product[] = [
          {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 299.99,
            category: "Electronics",
            img: "/api/placeholder/300/300",
          },
          {
            id: 2,
            name: "Smart Watch Pro",
            price: 449.99,
            category: "Electronics",
            img: "/api/placeholder/300/300",
          },
        ];

        const mockRecentUsers: UserType[] = [
          {
            id: 1,
            email: "john@example.com",
            role: "user",
            created_at: "2024-01-15T08:00:00Z",
          },
          {
            id: 2,
            email: "jane@example.com",
            role: "user",
            created_at: "2024-01-14T16:30:00Z",
          },
        ];

        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setTopProducts(mockTopProducts);
        setRecentUsers(mockRecentUsers);
        console.log("AdminDashboard: data loaded");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
        console.log("AdminDashboard: loading set to false");
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    growth: number;
    color?: "blue" | "green" | "purple" | "orange";
  }) => {
    console.log("StatCard: rendering", title);
    const isPositive = growth > 0;
    const colorClasses: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div
              className={`p-3 rounded-full ${colorClasses[color]} text-white`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"
                }`}
            >
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-600 ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  console.log("AdminDashboard: checking loading", loading);
  if (loading) {
    console.log("AdminDashboard: returning loading skeleton");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log("AdminDashboard: checking stats", stats);
  if (!stats) {
    console.log("AdminDashboard: returning error");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load dashboard
          </h1>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  console.log("AdminDashboard: rendering main");
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store and view analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/products")}>
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </Button>
          <Button variant="outline" onClick={() => navigate("/orders")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Orders
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          growth={stats.revenueGrowth}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          growth={stats.ordersGrowth}
          color="blue"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          growth={stats.productsGrowth}
          color="purple"
        />
        <StatCard
          title="Users"
          value={stats.totalUsers}
          icon={Users}
          growth={stats.usersGrowth}
          color="orange"
        />
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          User ID: {order.user_id} • Qty: {order.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.created_at!)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Processing</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-sm text-gray-600">234 sold</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((userItem) => (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{userItem.email}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {userItem.role}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {formatDate(userItem.created_at!)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          userItem.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {userItem.role}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/products/new")}
            >
              <Package className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/orders")}
            >
              <ShoppingCart className="h-6 w-6 mb-2" />
              View All Orders
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/users")}
            >
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
