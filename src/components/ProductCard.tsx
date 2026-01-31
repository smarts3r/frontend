import { Heart, ShoppingCart } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card } from "flowbite-react";
import { useCurrencyFormat } from "@/lib/currency";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isInCart?: boolean;
  onAddToCart?: (productId: number) => void;
  onToggleFavorite?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInCart = false,
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();
  const formatCurrency = useCurrencyFormat();
  const discountPercentage = product.old_price
    ? Math.floor(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : null;

  return (
    <div className="group max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />

        {discountPercentage && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-sm">
            -{discountPercentage}%
          </span>
        )}

        <Button
          color="light"
          size="icon"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
          onClick={() => onToggleFavorite?.(product.id)}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < 4 ? "text-yellow-400" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 hover:text-blue-600 transition-colors grow">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-black text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.old_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.old_price)}
            </span>
          )}
        </div>

        <Button
          color={isInCart ? "green" : "blue"}
          className="w-full transition-all duration-300 font-semibold"
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart ? t("productCard.inCart") : t("productCard.addToCart")}
        </Button>
      </div>
    </div>
  );
};
