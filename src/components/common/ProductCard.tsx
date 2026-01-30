import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/api";
import { useCurrencyFormat } from "@/lib/currency";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const addItemToWishlist = useWishlistStore((state) => state.addItem);
  const removeItemFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );
  const formatCurrency = useCurrencyFormat();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart();
    } else {
      addItem(product, 1);
    }
    toast.success(`Added ${product.name} to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeItemFromWishlist(product.id);
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      addItemToWishlist(product);
      toast.success(`Added ${product.name} to wishlist`);
    }
  };

  const discountPercentage = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;

  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-gray-100 bg-white transform hover:-translate-y-1">
      {/* Product Image Section */}
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-100 p-6 flex-shrink-0"
      >
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 hover:scale-105 transition-transform">
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* Wishlist Heart */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all duration-200 p-0"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </Button>

        <img
          src={
            product.img ||
            "https://placehold.co/400x500/e8ddd7/ffffff?text=Product"
          }
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Hover Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 via-black/10 to-transparent">
          <div className="flex justify-center gap-2">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="shadow-lg bg-white text-gray-900 hover:bg-black hover:text-white transition-all duration-200 rounded-full px-4 py-2 text-xs font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
            <Link to={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="shadow-lg bg-white/90 hover:bg-white hover:scale-105 transition-all duration-200 rounded-full px-4 py-2 text-xs font-medium"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <CardContent className="p-4 flex flex-col flex-1 h-full bg-white">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {product.category}
          </Badge>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="block mb-3">
          <h3
            className="font-semibold text-gray-900 text-sm leading-tight hover:text-blue-600 transition-colors group-hover:text-blue-600 line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating Display */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">(4.0)</span>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mb-3">
            {product.stock > 0 ? (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200"
              >
                In Stock ({product.stock})
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200"
              >
                Backorder
              </Badge>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.old_price && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.old_price)}
              </span>
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Save {discountPercentage}%
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-9 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-semibold h-9 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
