import { Filter, Search, X, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/common/ProductCard";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Label,
  RangeSlider,
  Select,
  TextInput,
} from "flowbite-react";
import { categoryService, productService } from "@/services";
import type { Product } from "@/types/api";
import { useCartStore } from "@/store/cartStore";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [priceInitialized, setPriceInitialized] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm) params.set("search", searchTerm);
    if (priceRange[0] !== 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 1000) params.set("maxPrice", priceRange[1].toString());
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

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);

        if (!productsData || !Array.isArray(productsData)) {
          throw new Error("Invalid products data received from server");
        }

        setProducts(productsData);
        setCategories(categoriesData || []);

        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price);
          const productMinPrice = Math.min(...prices);
          const productMaxPrice = Math.max(...prices);

          // Check for URL params first, otherwise use product price range
          const urlMinPrice = searchParams.get("minPrice");
          const urlMaxPrice = searchParams.get("maxPrice");
          const finalMinPrice = urlMinPrice ? Math.max(parseInt(urlMinPrice), productMinPrice) : productMinPrice;
          const finalMaxPrice = urlMaxPrice ? Math.min(parseInt(urlMaxPrice), productMaxPrice) : productMaxPrice;

          setPriceRange([finalMinPrice, finalMaxPrice]);
          setPriceInitialized(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.includes(searchTerm) ||
          product.category.includes(searchTerm),
      );
    }

    // Filter by price only after price range has been initialized from products
    if (priceInitialized) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1],
      );
    }

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
    priceInitialized,
  ]);

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
    setCurrentPage(1);
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto bg-white rounded-lg p-8 shadow-sm">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Products</h2>
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-gray-500 text-sm mb-6">The server may be experiencing issues. Please try again later.</p>
            <Button
              color="blue"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Discover Our Products
          </h1>
          <p className="text-gray-600 mb-6">
            Find your perfect match from our curated collection
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <TextInput
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              rightIcon={Search}
              sizing="lg"
              className="w-full"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <span className="text-gray-600 text-sm">
              {(filteredProducts?.length || 0)} products found
            </span>
            <Button
              color="light"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${isSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}
          >
            <Card>
              <div className="p-5">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <Button
                    color="light"
                    size="xs"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="mb-2 block font-medium text-gray-900">
                    Category
                  </Label>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </div>

                <hr className="border-gray-100 my-5" />

                {/* Price Range Filter */}
                <div className="mb-6">
                  <Label className="mb-3 block font-medium text-gray-900">
                    Price Range
                  </Label>
                  <div className="px-1">
                    <RangeSlider
                      min={products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0}
                      max={products.length > 0 ? Math.max(...products.map((p) => p.price)) : 5000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 my-5" />

                {/* Stock Status Filter */}
                <div className="mb-6">
                  <Label className="mb-3 block font-medium text-gray-900">
                    Stock Status
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Products" },
                      { value: "in-stock", label: "In Stock" },
                      { value: "backorder", label: "Backorder" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <Checkbox
                          id={option.value}
                          checked={selectedStock === option.value}
                          onChange={() => setSelectedStock(option.value)}
                        />
                        <Label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100 my-5" />

                {/* Tags Filter */}
                <div>
                  <Label className="mb-3 block font-medium text-gray-900">
                    Popular Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((tag) => (
                      <Badge
                        key={tag}
                        color={selectedTags.includes(tag) ? "dark" : "light"}
                        className="cursor-pointer"
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
              </div>
            </Card>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results count */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-sm hidden lg:block">
                {(filteredProducts?.length || 0)} product
                {(filteredProducts?.length || 0) !== 1 ? "s" : ""} found
              </span>
              {isSidebarOpen && (
                <Button
                  color="light"
                  size="xs"
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              )}
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  color="dark"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard
                        product={product}
                        onAddToCart={() => addItem(product, 1)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <Button
                      color="light"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrentPage = pageNum === currentPage;

                        if (
                          pageNum !== 1 &&
                          pageNum !== totalPages &&
                          Math.abs(pageNum - currentPage) > 1
                        ) {
                          if (Math.abs(pageNum - currentPage) === 2) {
                            return (
                              <span key={pageNum} className="text-gray-400 px-2">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <Button
                            key={pageNum}
                            color={isCurrentPage ? "dark" : "light"}
                            size="xs"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      color="light"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-4 text-sm text-gray-500">
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
