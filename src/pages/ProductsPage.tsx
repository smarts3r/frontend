import { Filter, Search, ShoppingCart, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/common/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { categoryService, productService } from "@/services";
import type { Product } from "@/types/api";
import { useCartStore } from "@/store/cartStore"; // Import useCartStore

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([70, 500]);
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const addItem = useCartStore((state) => state.addItem); // Get addItem from store


  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm) params.set("search", searchTerm);
    if (priceRange[0] !== 70) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 500) params.set("maxPrice", priceRange[1].toString());
    if (selectedStock !== "all") params.set("stock", selectedStock);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [
    selectedCategory,
    searchTerm,
    priceRange,
    selectedStock,
    selectedTags,
    currentPage,
    setSearchParams,
  ]);

  // Initialize from URL parameters
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams.get("page")]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);

        // Set price range based on actual products
        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
          console.log("💰 Price range initialized:", [minPrice, maxPrice]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Stock filter
    if (selectedStock !== "all") {
      filtered = filtered.filter((product) => {
        if (selectedStock === "in-stock") {
          return (product.stock ?? 0) > 0;
        } else if (selectedStock === "backorder") {
          return (product.stock ?? 0) <= 0;
        }
        return true;
      });
    }

    // Tags filter (using category as a simple tag system for now)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.includes(product.category),
      );
    }

    setFilteredProducts(filtered);
  }, [
    products,
    selectedCategory,
    searchTerm,
    priceRange,
    selectedStock,
    selectedTags,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil((filteredProducts?.length || 0) / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(startIndex, startIndex + productsPerPage)
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSelectedStock("all");
    setSelectedTags([]);
    setCurrentPage(1); // Reset to first page
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-2 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
            <span className="font-medium">
              ✨ FREE SHIPPING ON ALL ORDERS ABOVE 900+ ✨
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Promotional Banners */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-3 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
          <span className="font-medium">
            ✨ FREE SHIPPING ON ALL ORDERS ABOVE 900+ ✨
          </span>
          <span className="mx-4">|</span>
          <span className="font-medium">
            💝 FREE SKINCARE CONSULTATION WITH LICENSED PROFESSIONALS 💝
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 text-center">
            Discover Our Products
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find your perfect match from our curated collection
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 py-6 text-base border-pink-200 focus:border-pink-400 rounded-full"
              />
            </div>
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <span className="text-gray-700">
              {(filteredProducts?.length || 0)} products found
            </span>
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${isSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">Category</h3>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full border-pink-200 bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="all" className="hover:bg-pink-50">
                        All Categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="hover:bg-pink-50 focus:bg-pink-50"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="mb-8" />

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Price Range
                  </h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      max={
                        products.length > 0
                          ? Math.max(...products.map((p) => p.price))
                          : 5000
                      }
                      min={
                        products.length > 0
                          ? Math.min(...products.map((p) => p.price))
                          : 0
                      }
                      step={10}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>EGP {priceRange[0]}</span>
                      <span>EGP {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Stock Status Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Stock Status
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: "all", label: "All Products" },
                      { value: "in-stock", label: "In Stock" },
                      { value: "backorder", label: "Backorder" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.value}
                          checked={selectedStock === option.value}
                          onCheckedChange={() => setSelectedStock(option.value)}
                        />
                        <label
                          htmlFor={option.value}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Tags Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className={`cursor-pointer px-3 py-1 ${selectedTags.includes(tag)
                            ? "bg-pink-500 hover:bg-pink-600 text-white"
                            : "border-pink-200 text-pink-700 hover:bg-pink-50"
                          }`}
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag],
                          );
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results count and mobile filter close */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 hidden lg:block">
                {(filteredProducts?.length || 0)} product
                {(filteredProducts?.length || 0) !== 1 ? "s" : ""} found
              </span>
              {isSidebarOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Filters
                </Button>
              )}
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-4xt-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard
                        product={product}
                        onAddToCart={() => addItem(product, 1)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="px-4 py-2"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrentPage = pageNum === currentPage;
                        const isNearCurrent =
                          Math.abs(pageNum - currentPage) <= 2;

                        if (
                          !isNearCurrent &&
                          pageNum !== 1 &&
                          pageNum !== totalPages
                        ) {
                          return null;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 ${isCurrentPage
                                ? "bg-pink-500 text-white"
                                : "hover:bg-pink-50 border-pink-200 text-gray-700"
                              }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-4 text-sm text-gray-600">
                  Showing {startIndex + 1}-
                  {Math.min(
                    startIndex + productsPerPage,
                    filteredProducts?.length || 0,
                  )}{" "}
                  of {filteredProducts?.length || 0} products
                  {totalPages > 1 && (
                    <span className="ml-2">
                      | Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
