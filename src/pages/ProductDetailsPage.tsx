import {
  ArrowLeft,
  Heart,
  Package,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/api";
import { useCurrencyFormat } from "@/lib/currency";

type ProductDetailsPageProps = [];

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const addWishlistItem = useWishlistStore((state) => state.addItem);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const formatCurrency = useCurrencyFormat();

  // Function to get optimized Cloudinary image URL
  const getOptimizedImageUrl = (url: string, width: number, height: number) => {
    if (!url) return "";

    // Check if it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // Extract the public ID and transform the URL
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex !== -1) {
        const beforeUpload = url.substring(0, uploadIndex + 8); // include '/upload'
        const afterUpload = url.substring(uploadIndex + 8);
        return `${beforeUpload}q_auto,f_auto,w_${width},h_${height}/${afterUpload}`;
      }
    }

    return url; // Return original URL if not Cloudinary
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch main product
        const productData = await productService.getById(parseInt(id));
        setProduct(productData);

        // Fetch related products based on category
        setRelatedLoading(true);
        try {
          const allProducts = await productService.getAll();
          const related = allProducts
            .filter(
              (p) =>
                p.category === productData.category && p.id !== productData.id,
            )
            .slice(0, 8); // Limit to 8 related products
          setRelatedProducts(related);
        } catch (error) {
          console.error("Failed to fetch related products:", error);
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("productDetails.productNotFound")}
          </h1>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("productDetails.backToProducts")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Create image array (in real app, this would come from product data)
  const images = [product.img]; // For now, using single image with duplicates for thumbnails

  // Generate star rating component
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/products">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("productDetails.backToProducts")}
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
            <img
              src={getOptimizedImageUrl(images[selectedImage], 800, 800)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-black ring-2 ring-gray-200"
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

        {/* Product Information */}
        <div className="space-y-6">
          {/* Category Badge and Title */}
          <div>
            <Badge
              variant="secondary"
              className="mb-3 bg-gray-100 text-gray-700"
            >
              {product.category}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={4} />
            <span className="text-sm text-gray-600">
              4.0 · 24 {t("productDetails.reviews")}
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.old_price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.old_price)}
                </span>
              )}
            </div>
            {product.old_price && (
              <Badge variant="destructive" className="w-fit bg-red-500">
                {t("productDetails.save")} {formatCurrency(product.old_price - product.price)}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock !== undefined && product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  {product.stock} {t("productDetails.inStock")}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">
                  {t("productDetails.outOfStock")}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {t("productDetails.description")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                t("productDetails.noDescriptionAvailable")}
            </p>
          </div>

          {/* Quantity Selector and Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {t("productDetails.quantity")}
              </h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10"
                >
                  -
                </Button>
                <span className="w-16 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={
                    product.stock !== undefined && quantity >= product.stock
                  }
                  className="w-10 h-10"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                size="lg"
              >
                {isAddingToCart ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("productCard.addToCart")}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className={`transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? "text-red-500 border-red-500 hover:bg-red-50"
                    : "hover:text-red-500 hover:border-red-500"
                }`}
                size="lg"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product Benefits */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Benefits & Guarantees</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm p-3 bg-green-50 rounded-lg">
                <Truck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{t("productDetails.freeShippingOnOrdersOver")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span>{t("productDetails.yearWarrantyIncluded")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-purple-50 rounded-lg">
                <RefreshCw className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <span>{t("productDetails.dayReturnPolicy")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-orange-50 rounded-lg">
                <Package className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <span>Premium Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">{t("productDetails.sku")}:</span>
              <span className="text-gray-600">{product.sku || "N/A"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">
                {t("productDetails.category")}:
              </span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">
                {t("productDetails.stock")}:
              </span>
              <span className="text-gray-600">
                {product.stock !== undefined ? `${product.stock} units` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">
                {t("productDetails.rating")}:
              </span>
              <span className="text-gray-600">4.0 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("productDetails.relatedProducts.title")}
            </h2>
            <p className="text-gray-600">
              {t("productDetails.relatedProducts.subtitle")}
            </p>
          </div>

          <div className="relative">
            <Carousel
              className="w-full"
              opts={{ slidesToScroll: 1, align: "start" }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {relatedLoading
                  ? [...Array(4)].map((_, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                      >
                        <div className="h-full">
                          <Card className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <Skeleton className="w-full aspect-square rounded-lg" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  : relatedProducts.map((relatedProduct) => (
                      <CarouselItem
                        key={relatedProduct.id}
                        className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                      >
                        <div className="h-full">
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Product Image */}
                                <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
                                  <img
                                    src={getOptimizedImageUrl(
                                      relatedProduct.img,
                                      200,
                                      200,
                                    )}
                                    alt={relatedProduct.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>

                                {/* Product Name */}
                                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {relatedProduct.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-lg">
                                      {formatCurrency(relatedProduct.price)}
                                    </span>
                                    {relatedProduct.old_price && (
                                      <span className="text-sm text-gray-500 line-through ml-2">
                                        {formatCurrency(relatedProduct.old_price)}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quick Add to Cart */}
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      addItem(relatedProduct, 1);
                                      toast.success(
                                        `${relatedProduct.name} added to cart`,
                                      );
                                    }}
                                    className="transition-all duration-300 transform hover:scale-105"
                                  >
                                    <ShoppingCart className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              {!relatedLoading && relatedProducts.length > 4 && (
                <>
                  <CarouselPrevious className="hidden md:flex -left-12 bg-white border-gray-200 hover:bg-gray-50" />
                  <CarouselNext className="hidden md:flex -right-12 bg-white border-gray-200 hover:bg-gray-50" />
                </>
              )}
            </Carousel>
          </div>
        </section>
      )}
    </div>
  );
};
