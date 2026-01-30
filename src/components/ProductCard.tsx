import { Heart, ShoppingCart } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="group overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
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
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
          onClick={() => onToggleFavorite?.(product.id)}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-5 flex flex-col grow bg-white">
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fa-solid fa-star text-[10px] ${
                i < 4 ? "text-yellow-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>

        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 hover:text-primary-color transition-colors grow">
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
          className={`w-full transition-all duration-300 font-semibold`}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart
            className={`w-4 h-4 ${isInCart ? "text-white" : "text-white"}`}
          />
          {isInCart ? t("productCard.inCart") : t("productCard.addToCart")}
        </Button>
      </CardContent>
    </Card>
  );
};
