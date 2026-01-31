import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid3X3,
  LayoutList,
  Package,
  ArrowRight,
  TrendingUp,
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

// Category images mapping
const categoryImages: Record<string, string> = {
  "Electronics": "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=600&q=80",
  "Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  "Smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  "Audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "Accessories": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80",
  "Gaming": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
  "Wearables": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
  "Cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
};

const getCategoryImage = (categoryName: string): string => {
  if (categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }
  
  const matchedKey = Object.keys(categoryImages).find(key => 
    categoryName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(categoryName.toLowerCase())
  );
  
  if (matchedKey) {
    return categoryImages[matchedKey];
  }
  
  return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80";
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-3xl">
            <Badge color="blue" className="mb-4">All Collections</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Browse {categories?.length || 0} curated collections with {products?.length || 0}+ products
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md">
              <TextInput
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredCategories.length} categories
          </p>
          <div className="flex gap-2">
            <Button
              color={viewMode === "grid" ? "dark" : "light"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              color={viewMode === "list" ? "dark" : "light"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "space-y-4 max-w-3xl"
          }>
            {filteredCategories.map((category) => {
              const productCount = getProductCount(category.name);
              const imageUrl = getCategoryImage(category.name);
              
              if (viewMode === "grid") {
                return (
                  <div
                    key={category.id}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Package className="w-4 h-4" />
                            <span>{productCount} items</span>
                          </div>
                        </div>
                        
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white rounded-full p-2">
                            <ArrowRight className="w-4 h-4 text-gray-900" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              } else {
                return (
                  <Card 
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex items-center gap-4 p-2">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {productCount} products
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              }
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try different search terms" : "Categories will appear here"}
            </p>
            {searchTerm && (
              <Button color="light" size="sm" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Featured Section */}
        {filteredCategories.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-8 md:p-12">
                  <Badge color="yellow" className="mb-4">Trending</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Popular Right Now
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Discover what everyone is shopping for this week
                  </p>
                  <Button color="light" onClick={() => navigate("/products")}>
                    Explore All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="hidden md:block w-1/3">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
