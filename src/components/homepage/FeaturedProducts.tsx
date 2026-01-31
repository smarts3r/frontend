import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services";
import type { Product } from "@/types/api";
import { useCartStore } from "@/store/cartStore";

// Product skeleton loader
const ProductSkeleton = () => (
  <div className="flex flex-col h-full">
    <Skeleton className="w-full aspect-square rounded-xl mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        // Take first 8 products for featured section
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("homePage.featuredProducts.title")}
          </h2>
          <p className="text-gray-600">
            {t("homePage.featuredProducts.subtitle")}
          </p>
        </div>

        <Link
          to="/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          {t("homePage.featuredProducts.seeAll")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Products Carousel/Grid */}
      <div className="relative">
        {loading ? (
          // Show skeletons while loading
          <Carousel
            className="w-full"
            opts={{ slidesToScroll: 1, align: "start" }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...Array(4)].map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                >
                  <div className="h-full">
                    <ProductSkeleton />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Carousel
            className="w-full"
            opts={{ slidesToScroll: 1, align: "start" }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                    <div className="h-full">
                      <ProductCard
                        product={product}
                        onAddToCart={() => addItem(product, 1)}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <div className="w-full py-16 text-center bg-gray-50 rounded-xl border border-dashed text-gray-400">
                  No featured products found.
                </div>
              )}
            </CarouselContent>

            {/* Navigation Buttons */}
            {products.length > 4 && (
              <>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white border-gray-200 hover:bg-gray-50" />
                <CarouselNext className="hidden md:flex -right-12 bg-white border-gray-200 hover:bg-gray-50" />
              </>
            )}
          </Carousel>
        )}
      </div>

      {/* View All Products Button for Mobile */}
      <div className="text-center mt-8 md:hidden">
        <Link to="/products">
          <Button
            variant="outline"
            className="rounded-full px-8 transition-all duration-300"
          >
            {t("homePage.featuredProducts.seeAll")}
          </Button>
        </Link>
      </div>
    </section>
  );
};
