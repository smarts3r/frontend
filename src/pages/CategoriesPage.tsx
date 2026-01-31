import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid3X3,
  LayoutList,
  Package,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Card,
  TextInput,
  Spinner,
  Badge,
} from "flowbite-react";
import { useGetCategories } from "@/hooks/useCategories";
import { productService } from "@/services";
import type { Product } from "@/types/api";
import { toast } from "sonner";

// Category images mapping - using lowercase keys for case-insensitive matching
const categoryImages: Record<string, string> = {
  "electronics": "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&q=80",
  "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  "audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "accessories": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80",
  "gaming": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  "wearables": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
  "cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  "phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  "headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "pc": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "computers": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
};

const getCategoryImage = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Try exact match first (case-insensitive)
  if (categoryImages[normalizedName]) {
    return categoryImages[normalizedName];
  }
  
  // Try partial match - check if any key is contained in the category name
  const matchedKey = Object.keys(categoryImages).find(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );
  
  if (matchedKey) {
    return categoryImages[matchedKey];
  }
  
  // Try word-by-word matching
  const words = normalizedName.split(/\s+/);
  for (const word of words) {
    if (word.length > 2) { // Only check words longer than 2 characters
      const wordMatch = Object.keys(categoryImages).find(key => 
        key.includes(word) || word.includes(key)
      );
      if (wordMatch) {
        return categoryImages[wordMatch];
      }
    }
  }
  
  // Default tech image
  return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading, error, getCategories } = useGetCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    getCategories();
    
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    
    fetchProducts();
  }, [getCategories]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load categories");
    }
  }, [error]);

  const getProductCount = (categoryName: string) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.filter((p: Product) => 
      p.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const filteredCategories = categories?.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="xl" className="mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Collections
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Shop by Category
              </h1>
              <p className="text-gray-600">
                Explore {categories?.length || 0} curated collections featuring {products?.length || 0}+ premium products
              </p>
            </div>
            
            {/* Search */}
            <div className="w-full lg:w-96">
              <TextInput
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rightIcon={Search}
                sizing="lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredCategories.length}</span> categories found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">View:</span>
            <Button
              color={viewMode === "grid" ? "dark" : "light"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              color={viewMode === "list" ? "dark" : "light"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Categories */}
        {filteredCategories.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4 max-w-4xl"
          }>
            {filteredCategories.map((category) => {
              const productCount = getProductCount(category.name);
              const imageUrl = getCategoryImage(category.name);
              
              if (viewMode === "grid") {
                return (
                  <Card 
                    key={category.id}
                    className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        onError={(e) => {
                          // Fallback to default image on error
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";
                        }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <Badge color="blue" size="sm" className="w-fit mb-2">
                          {productCount} Products
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-white/80 text-sm line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <ArrowRight className="w-5 h-5 text-gray-900" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="px-5 py-4 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>Browse Collection</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              } else {
                // List View
                return (
                  <Card 
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex items-stretch">
                      {/* Image */}
                      <div className="w-32 sm:w-48 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";
                          }}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {category.name}
                            </h3>
                            <Badge color="blue" size="sm">
                              {productCount} items
                            </Badge>
                          </div>
                          {category.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">
                            Click to browse products
                          </span>
                          <Button color="light" size="sm">
                            View Products
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "We couldn't find any categories matching your search. Try different keywords."
                : "Categories will appear here once they're added to the store."}
            </p>
            {searchTerm && (
              <Button color="dark" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        {filteredCategories.length > 0 && (
          <div className="mt-16">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-gray-900 to-gray-800">
                  <Badge color="yellow" size="sm" className="mb-4">
                    Featured
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Discover Amazing Deals
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-lg">
                    Browse through our extensive collection of premium products across all categories. Find exactly what you need today.
                  </p>
                  <Button color="light" size="lg" onClick={() => navigate("/products")}>
                    Shop All Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <div className="hidden md:block w-2/5 bg-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                    alt="Featured"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
