import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);

  const handleRemoveFromWishlist = async (productId: number) => {
    setIsRemoving(productId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      removeItem(productId);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    setIsAddingToCart(product.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addItem(product);
    } finally {
      setIsAddingToCart(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600">
              Start adding items you love to your wishlist!
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist ({items.length} items)
        </h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card
            key={item.product_id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="p-4">
              <div className="relative">
                <img
                  src={item.product.img}
                  alt={item.product.name}
                  className="w-full h-48 object-contain bg-gray-50 p-4 rounded-md mb-3"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFromWishlist(item.product_id)}
                  disabled={isRemoving === item.product_id}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-700 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {item.product.old_price && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 left-2"
                  >
                    Sale
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
              <div>
                <Badge variant="secondary" className="text-xs">
                  {item.product.category}
                </Badge>
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mt-2 mb-1">
                  {item.product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">(4.0)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    EGP {item.product.price}
                  </span>
                  {item.product.old_price && (
                    <span className="text-sm text-gray-500 line-through">
                      EGP {item.product.old_price}
                    </span>
                  )}
                </div>

                {item.product.stock !== undefined && (
                  <p
                    className={`text-sm ${item.product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.product.stock > 0
                      ? `${item.product.stock} in stock`
                      : "Out of stock"}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(item.product)}
                  disabled={
                    isAddingToCart === item.product.id ||
                    item.product.stock === 0
                  }
                  className="flex-1"
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart === item.product.id
                    ? "Adding..."
                    : "Add to Cart"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/products/${item.product_id}`)}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/products")}
          size="lg"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
