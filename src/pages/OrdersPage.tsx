import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ChevronRight,
  Search,
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Label,
  Select,
  TextInput,
  Spinner,
  Tabs,
  TabItem,
} from "flowbite-react";
import { toast } from "sonner";
import { useGetUserOrders, useCancelOrder } from "@/hooks/useOrders";
import { useCurrencyFormat } from "@/lib/currency";

type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    img: string;
  };
};

type ExtendedOrder = {
  id: number;
  user_id: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
};

const statusConfig = {
  pending: { color: "yellow", icon: Clock, label: "Pending" },
  confirmed: { color: "blue", icon: CheckCircle, label: "Confirmed" },
  processing: { color: "purple", icon: Package, label: "Processing" },
  shipped: { color: "indigo", icon: Truck, label: "Shipped" },
  delivered: { color: "green", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "red", icon: XCircle, label: "Cancelled" },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const formatCurrency = useCurrencyFormat();
  
  const { data: rawOrders, loading, error, getUserOrders } = useGetUserOrders();
  const { cancelOrder, loading: cancelLoading } = useCancelOrder();
  
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const orders = rawOrders as ExtendedOrder[] | null;

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders");
    }
  }, [error]);

  const filteredOrders = orders?.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const handleCancelOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      const result = await cancelOrder(orderId.toString());
      if (result) {
        toast.success("Order cancelled successfully");
        getUserOrders();
      } else {
        toast.error("Failed to cancel order");
      }
    }
  };

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge color={config.color as any}>
        <Icon className="w-3 h-3 mr-1 inline" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              color="light"
              size="sm"
              onClick={() => navigate("/profile")}
              className="hidden sm:flex"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              My Orders
            </h1>
          </div>
          <Button color="dark" size="sm" onClick={() => navigate("/products")}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Start New Order</span>
            <span className="sm:hidden">New Order</span>
          </Button>
        </div>

        {/* Filters & Search */}
        <Card className="mb-4 sm:mb-6 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <TextInput
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 sm:p-6 bg-gray-50/50 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">Order ID</p>
                        <p className="font-semibold text-gray-900">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">Date</p>
                        <p className="font-semibold text-gray-900">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">Total</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">Status</p>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        color="light"
                        size="xs"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <Eye className="w-3 h-3 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          color="red"
                          size="xs"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancelLoading}
                        >
                          <XCircle className="w-3 h-3 mr-1 sm:mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === order.id && (
                  <div className="p-4 sm:p-6 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                      Order Items
                    </h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item: OrderItem) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                              {item.product?.img ? (
                                <img
                                  src={item.product.img}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 sm:w-8 sm:h-8 m-auto text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {item.product?.name || `Product #${item.product_id}`}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No items available</p>
                    )}

                    {order.shipping_address && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                          Shipping Address
                        </h5>
                        <p className="text-gray-600 text-sm">{order.shipping_address}</p>
                      </div>
                    )}

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button color="light" size="sm" className="w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </Button>
                      {order.status === "shipped" && (
                        <Button color="dark" size="sm" className="w-full sm:w-auto">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="shadow-sm">
            <div className="p-8 sm:p-12 md:p-20 text-center">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters or search"
                  : "Looks like you haven't placed any orders yet."}
              </p>
              <Button color="dark" onClick={() => navigate("/products")}>
                Start Shopping
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Summary */}
        {orders && orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
            {[
              { label: "Total Orders", value: orders.length },
              { label: "Pending", value: orders.filter((o) => o.status === "pending").length },
              { label: "Processing", value: orders.filter((o) => o.status === "processing").length },
              { label: "Shipped", value: orders.filter((o) => o.status === "shipped").length },
              { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-sm">
                <div className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
