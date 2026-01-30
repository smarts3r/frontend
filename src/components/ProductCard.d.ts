import type React from "react";
import type { Product } from "@/types";
interface ProductCardProps {
    product: Product;
    isInCart?: boolean;
    onAddToCart?: (productId: number) => void;
    onToggleFavorite?: (productId: number) => void;
}
export declare const ProductCard: React.FC<ProductCardProps>;
export {};
