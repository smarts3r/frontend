import { CheckCircle, Clock, Package, ShoppingBag, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_ORDERS = [
  {
    id: "#ORD-7752",
    date: "Jan 23, 2026",
    total: "EGP 62,000.00",
    status: "processing",
    items: 2,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=200&q=80", // Macbook
  },
  {
    id: "#ORD-7710",
    date: "Jan 20, 2026",
    total: "EGP 12,525.00",
    status: "shipped",
    items: 1,
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80", // Watch
  },
  {
    id: "#ORD-7689",
    date: "Dec 15, 2025",
    total: "EGP 4,500.00",
    status: "delivered",
    items: 3,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80", // Headphones
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 ml-1" />;
      case "shipped":
        return <Truck className="w-4 h-4 ml-1" />;
      case "processing":
        return <Clock className="w-4 h-4 ml-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-8 h-8" /> My Orders
        </h1>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Start New Order
        </Button>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.length > 0 ? (
          MOCK_ORDERS.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-gray-50/50 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Order Placed</p>
                      <p className="font-semibold text-gray-900">
                        {order.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Total</p>
                      <p className="font-semibold text-gray-900">
                        {order.total}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Order ID</p>
                      <p className="font-mono text-gray-900">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline">
                      View Invoice
                    </Button>
                    <Button size="sm">Track Order</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={order.img}
                      alt="Product thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={`${getStatusColor(order.status)} border-none shadow-none`}
                      >
                        {order.status.toUpperCase()}
                        {getStatusIcon(order.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      {order.items} item{order.items > 1 ? "s" : ""} in this
                      shipment
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {order.status === "delivered"
                        ? "Item was delivered successfully"
                        : "Arriving by next week"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven't bought anything yet.
            </p>
            <Button onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
