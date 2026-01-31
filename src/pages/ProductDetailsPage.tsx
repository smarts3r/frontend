import {
  ArrowLeft,
  Heart,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  Spinner,
} from "flowbite-react";
import { productService } from "@/services";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/api";
import { useCurrencyFormat } from "@/lib/currency";

export const ProductDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addWishlistItem = useWishlistStore((state) => state.addItem);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const formatCurrency = useCurrencyFormat();

  const getOptimizedImageUrl = (url: string, width: number, height: number) => {
    if (!url) return "";

    if (url.includes("cloudinary.com")) {
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex !== -1) {
        const beforeUpload = url.substring(0, uploadIndex + 8);
        const afterUpload = url.substring(uploadIndex + 8);
        return `${beforeUpload}q_auto,f_auto,w_${width},h_${height}/${afterUpload}`;
      }
    }

    return url;
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await productService.getById(parseInt(id));
        setProduct(productData);

        setRelatedLoading(true);
        setRelatedError(null);
        try {
          const allProducts = await productService.getAll();
          
          if (!allProducts || !Array.isArray(allProducts)) {
            throw new Error("Invalid data received from server");
          }
          
          const related = allProducts
            .filter(
              (p) =>
                p.category === productData.category && p.id !== productData.id,
            )
            .slice(0, 8);
          setRelatedProducts(related);
        } catch (error) {
          console.error("Failed to fetch related products:", error);
          setRelatedError("Unable to load related products");
          setRelatedProducts([]);
        } finally {
          setRelatedLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error(t("productDetails.productNotFound"));
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id, t]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      addItem(product, quantity);
      toast.success(
        t("productDetails.productAdded", {
          quantity,
          name: t("language") === "ar" ? product.name : product.name,
        }),
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeWishlistItem(product.id);
      toast.success(t("productDetails.removeFromWishlist"));
    } else {
      addWishlistItem(product);
      toast.success(t("productDetails.addToWishlist"));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-12 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {t("productDetails.productNotFound")}
        </h1>
        <Link to="/products">
          <Button color="light">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("productDetails.backToProducts")}
          </Button>
        </Link>
      </div>
    );
  }

  const images = [product.img];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Back Button */}
      <Link to="/products" className="inline-block mb-6 md:mb-8">
        <Button color="light" size="sm" className="hover:bg-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("productDetails.backToProducts")}
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-3 md:space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img
              src={getOptimizedImageUrl(images[selectedImage], 800, 800)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-gray-900 ring-2 ring-gray-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={getOptimizedImageUrl(image, 80, 80)}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-5 md:space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Badge color="gray" size="sm" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <StarRating rating={4} />
            <span className="text-gray-500">4.0 · 24 {t("productDetails.reviews")}</span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.old_price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatCurrency(product.old_price)}
                </span>
                <Badge color="red" size="sm">
                  {t("productDetails.save")} {formatCurrency(product.old_price - product.price)}
                </Badge>
              </>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${product.stock !== undefined && product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className={product.stock !== undefined && product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {product.stock !== undefined && product.stock > 0
                ? `${product.stock} ${t("productDetails.inStock")}`
                : t("productDetails.outOfStock")}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              {t("productDetails.description")}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {product.description || t("productDetails.noDescriptionAvailable")}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">
                {t("productDetails.quantity")}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock !== undefined && quantity >= product.stock}
                  className="p-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                color="dark"
                className="flex-1"
                size="md"
              >
                {isAddingToCart ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {t("productDetails.adding")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("productCard.addToCart")}
                  </>
                )}
              </Button>
              <Button
                color="light"
                onClick={handleToggleWishlist}
                className={isInWishlist(product.id) ? "text-red-500 border-red-500" : ""}
                size="md"
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
              <Truck className="h-4 w-4 flex-shrink-0" />
              <span>{t("productDetails.freeShippingOnOrdersOver")}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span>{t("productDetails.yearWarrantyIncluded")}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg text-purple-700">
              <RefreshCw className="h-4 w-4 flex-shrink-0" />
              <span>{t("productDetails.dayReturnPolicy")}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-orange-700">
              <Package className="h-4 w-4 flex-shrink-0" />
              <span>Premium Quality</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t("productDetails.sku")}</span>
              <span className="text-gray-600">{product.sku || "N/A"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t("productDetails.category")}</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t("productDetails.stock")}</span>
              <span className="text-gray-600">{product.stock !== undefined ? `${product.stock} units` : "N/A"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t("productDetails.rating")}</span>
              <span className="text-gray-600">4.0 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16 md:mt-20">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {t("productDetails.relatedProducts.title")}
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            {t("productDetails.relatedProducts.subtitle")}
          </p>
        </div>

        {relatedError ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{relatedError}</p>
            <p className="text-gray-400 text-sm mt-1">Please try again later</p>
          </div>
        ) : relatedProducts.length === 0 && !relatedLoading ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No related products found</p>
            <Link to="/products" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedLoading
              ? [...Array(4)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-8 bg-gray-100 rounded" />
                    </div>
                  </Card>
                ))
              : relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/products/${relatedProduct.id}`} className="block">
                      <div className="aspect-square bg-gray-50">
                        <img
                          src={getOptimizedImageUrl(relatedProduct.img, 300, 300)}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-4 space-y-3">
                      <Link to={`/products/${relatedProduct.id}`}>
                        <h3 className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-base">
                            {formatCurrency(relatedProduct.price)}
                          </span>
                          {relatedProduct.old_price && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                              {formatCurrency(relatedProduct.old_price)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          color="light"
                          onClick={() => {
                            addItem(relatedProduct, 1);
                            toast.success(`${relatedProduct.name} added to cart`);
                          }}
                        >
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        )}
      </section>
    </div>
  );
};
