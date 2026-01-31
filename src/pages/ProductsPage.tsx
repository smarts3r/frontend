import { Filter, Search, X, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/common/ProductCard";
import {
  Badge,
  Button,
  Checkbox,
  Label,
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

  // Initialize states from URL params
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    return [
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 1000,
    ];
  });
  const [selectedStock, setSelectedStock] = useState<string>(
    searchParams.get("stock") || "all",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get("tags");
    return tags ? tags.split(",") : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get("page") || "1");
  });
  const [productsPerPage] = useState(12);
  const [productPriceRange, setProductPriceRange] = useState<[number, number]>([0, 1000]);
  const addItem = useCartStore((state) => state.addItem);

  // Update URL when filters change
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

  // Sync state with URL params when they change externally
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    const urlSearch = searchParams.get("search") || "";
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlStock = searchParams.get("stock") || "all";
    const urlTags = searchParams.get("tags");
    const urlPage = parseInt(searchParams.get("page") || "1");

    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlStock !== selectedStock) setSelectedStock(urlStock);
    if (urlPage !== currentPage) setCurrentPage(urlPage);

    const newMinPrice = urlMinPrice ? parseInt(urlMinPrice) : 0;
    const newMaxPrice = urlMaxPrice ? parseInt(urlMaxPrice) : 1000;
    if (newMinPrice !== priceRange[0] || newMaxPrice !== priceRange[1]) {
      setPriceRange([newMinPrice, newMaxPrice]);
    }

    const newTags = urlTags ? urlTags.split(",") : [];
    if (JSON.stringify(newTags) !== JSON.stringify(selectedTags)) {
      setSelectedTags(newTags);
    }
  }, [searchParams]);

  // Fetch products
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

        // Set product price range for display
        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setProductPriceRange([minPrice, maxPrice]);
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
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
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

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [
    products,
    selectedCategory,
    searchTerm,
    priceRange,
    selectedStock,
    selectedTags,
  ]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange([0, 1000]);
    setSelectedStock("all");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const allTags = [...new Set(products.map((p) => p.category))].filter(Boolean);

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
              {filteredProducts.length} products found
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${isSidebarOpen
              ? "fixed inset-0 z-50 bg-white p-4 lg:static lg:p-0 lg:bg-transparent"
              : "hidden lg:block"
              }`}
          >
            {isSidebarOpen && (
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-4">
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
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Min Price</Label>
                    <TextInput
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
                      }}
                      min={0}
                      max={priceRange[1]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Max Price</Label>
                    <TextInput
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1000;
                        setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                      }}
                      min={priceRange[0]}
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Product prices range: ${productPriceRange[0]} - ${productPriceRange[1]}
                </p>
              </div>

              <hr className="border-gray-100 my-5" />

              {/* Stock Filter */}
              <div className="mb-6">
                <Label className="mb-3 block font-medium text-gray-900">
                  Availability
                </Label>
                <Select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full"
                >
                  <option value="all">All Items</option>
                  <option value="in-stock">In Stock</option>
                  <option value="backorder">Out of Stock</option>
                </Select>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <>
                  <hr className="border-gray-100 my-5" />
                  <div className="mb-6">
                    <Label className="mb-3 block font-medium text-gray-900">
                      Categories
                    </Label>
                    <div className="space-y-2">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                          />
                          <Label
                            htmlFor={`tag-${tag}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Apply Button */}
              <div className="lg:hidden mt-6">
                <Button
                  color="dark"
                  className="w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex flex-wrap justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                {filteredProducts.length > 0 && (
                  <span className="text-gray-500 ml-1">
                    (page {currentPage} of {totalPages})
                  </span>
                )}
              </p>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {selectedCategory !== "all" && (
                  <Badge color="info" className="flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {(priceRange[0] !== 0 || priceRange[1] !== 1000) && (
                  <Badge color="info" className="flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, 1000])} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedStock !== "all" && (
                  <Badge color="info" className="flex items-center gap-1">
                    {selectedStock === "in-stock" ? "In Stock" : "Out of Stock"}
                    <button onClick={() => setSelectedStock("all")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addItem(product, 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters</p>
                <Button color="light" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  color="light"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          color={currentPage === pageNum ? "dark" : "light"}
                          size="sm"
                          onClick={() => paginate(pageNum)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    // Show ellipsis
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  color="light"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
