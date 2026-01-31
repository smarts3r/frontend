import { Heart, ShoppingCart, Star, Trash2, ArrowLeft, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Spinner,
} from "flowbite-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCurrencyFormat } from "@/lib/currency";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const formatCurrency = useCurrencyFormat();

  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);

  const handleRemoveFromWishlist = async (productId: number) => {
    setIsRemoving(productId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      removeItem(productId);
      toast.success("Removed from wishlist");
    } finally {
      setIsRemoving(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    setIsAddingToCart(product.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addItem(product, 1);
      toast.success("Added to cart");
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
      toast.success("Wishlist cleared");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-sm p-8 sm:p-12">
            <div className="mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Start adding items you love to your wishlist!
              </p>
            </div>
            <Button color="dark" onClick={() => navigate("/products")}>
              <Package className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                My Wishlist
              </h1>
              <Badge color="gray" size="sm" className="hidden sm:inline-flex">
                {items.length} items
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              color="light"
              size="sm"
              onClick={() => navigate("/products")}
              className="flex-1 sm:flex-none"
            >
              <Package className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={handleClearWishlist}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </div>
        </div>

        {/* Mobile Item Count */}
        <div className="sm:hidden mb-4">
          <p className="text-gray-500 text-sm">{items.length} items saved</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card key={item.product_id} className="shadow-sm overflow-hidden group">
              {/* Product Image */}
              <div className="relative">
                <div 
                  className="aspect-square bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${item.product_id}`)}
                >
                  <img
                    src={item.product.img}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.product_id)}
                  disabled={isRemoving === item.product_id}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full shadow-sm transition-colors"
                >
                  {isRemoving === item.product_id ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                {/* Sale Badge */}
                {item.product.old_price && (
                  <Badge
                    color="red"
                    className="absolute top-2 left-2"
                  >
                    Sale
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Badge color="gray" size="xs" className="mb-2">
                  {item.product.category}
                </Badge>
                
                <h3 
                  className="font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/products/${item.product_id}`)}
                >
                  {item.product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(4.0)</span>
                </div>

                {/* Price & Stock */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.product.price)}
                    </span>
                    {item.product.old_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(item.product.old_price)}
                      </span>
                    )}
                  </div>
                  
                  {item.product.stock !== undefined && (
                    <p className={`text-xs mt-1 ${item.product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.product.stock > 0
                        ? `${item.product.stock} in stock`
                        : "Out of stock"}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    color="dark"
                    size="sm"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={isAddingToCart === item.product.id || item.product.stock === 0}
                    className="flex-1"
                  >
                    {isAddingToCart === item.product.id ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    color="light"
                    size="sm"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 sm:mt-12 text-center">
          <Button color="light" size="lg" onClick={() => navigate("/products")}>
            <Package className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
