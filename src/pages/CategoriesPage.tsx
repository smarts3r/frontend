import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid3X3,
  List,
  Package,
  ArrowRight,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Tag,
} from "lucide-react";
import {
  Button,
  Card,
  TextInput,
  Spinner,
  Badge,
  Tabs,
  TabItem,
} from "flowbite-react";
import { useGetCategories } from "@/hooks/useCategories";
import { useGetProducts, Product } from "@/hooks/useProducts";
import { toast } from "sonner";

// Category images mapping for visual appeal
const categoryImages: Record<string, string> = {
  "Electronics": "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&q=80",
  "Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "Smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  "Audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "Accessories": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80",
  "Gaming": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  "Wearables": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
  "Cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
};

const getCategoryImage = (categoryName: string): string => {
  // Try to match exact name first
  if (categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }
  
  // Try partial match
  const matchedKey = Object.keys(categoryImages).find(key => 
    categoryName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(categoryName.toLowerCase())
  );
  
  if (matchedKey) {
    return categoryImages[matchedKey];
  }
  
  // Default tech image
  return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80";
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, loading, error, getCategories } = useGetCategories();
  const { data: rawProducts, getProducts } = useGetProducts();
  
  // Extract products array from API response (handles both { data: [...] } and [...] formats)
  const products = Array.isArray(rawProducts) 
    ? rawProducts 
    : (rawProducts as any)?.data || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    getCategories();
    getProducts();
  }, [getCategories, getProducts]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load categories");
    }
  }, [error]);

  // Calculate product count per category
  const getProductCount = (categoryName: string) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.filter((p: Product) => 
      p.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  // Filter categories
  const filteredCategories = categories?.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "popular") {
      return matchesSearch && getProductCount(category.name) > 5;
    }
    if (selectedTab === "new") {
      // Categories created in last 30 days (if we had createdAt)
      return matchesSearch;
    }
    
    return matchesSearch;
  }) || [];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center justify-center py-20">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse Categories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="shadow-sm">
            <div className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
              <p className="text-xs sm:text-sm text-gray-500">Categories</p>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{products?.length || 0}</p>
              <p className="text-xs sm:text-sm text-gray-500">Products</p>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">Hot</p>
              <p className="text-xs sm:text-sm text-gray-500">Trending</p>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">New</p>
              <p className="text-xs sm:text-sm text-gray-500">Arrivals</p>
            </div>
          </Card>
        </div>

        {/* Search and Controls */}
        <Card className="shadow-sm mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <TextInput
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
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
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Tabs */}
        <Tabs className="mb-6">
          <TabItem 
            active={selectedTab === "all"} 
            title="All Categories"
            onClick={() => setSelectedTab("all")}
          />
          <TabItem 
            active={selectedTab === "popular"} 
            title="Popular"
            onClick={() => setSelectedTab("popular")}
          />
          <TabItem 
            active={selectedTab === "new"} 
            title="New Arrivals"
            onClick={() => setSelectedTab("new")}
          />
        </Tabs>

        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "space-y-4"
          }>
            {filteredCategories.map((category) => {
              const productCount = getProductCount(category.name);
              const imageUrl = getCategoryImage(category.name);
              
              if (viewMode === "grid") {
                return (
                  <Card 
                    key={category.id} 
                    className="shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {/* Category Image */}
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Product Count Badge */}
                      <Badge 
                        color="blue" 
                        className="absolute top-3 right-3"
                      >
                        {productCount} products
                      </Badge>
                      
                      {/* Category Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-200 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Bar */}
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Tag className="w-4 h-4" />
                          <span>Starting from $99</span>
                        </div>
                        <Button color="light" size="xs">
                          Explore
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              } else {
                // List View
                return (
                  <Card 
                    key={category.id} 
                    className="shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                              {category.name}
                            </h3>
                            <Badge color="blue">{productCount} products</Badge>
                          </div>
                          
                          {category.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Package className="w-4 h-4" />
                            <span>Browse collection</span>
                          </div>
                          <Button color="dark" size="sm">
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
          <Card className="shadow-sm">
            <div className="p-8 sm:p-12 md:p-20 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Categories will appear here once they're added"}
              </p>
              {searchTerm && (
                <Button color="light" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Featured Banner */}
        <Card className="shadow-sm mt-8 sm:mt-12 overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
              alt="Featured"
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center">
              <div className="p-6 sm:p-8 max-w-lg">
                <Badge color="yellow" className="mb-3">Featured</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Discover Amazing Deals
                </h2>
                <p className="text-gray-200 mb-4 text-sm sm:text-base">
                  Browse through our extensive collection of products across all categories
                </p>
                <Button color="light" size="sm" onClick={() => navigate("/products")}>
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
