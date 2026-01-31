import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button, Badge } from "flowbite-react";
import { productService } from "@/services";
import type { Product } from "@/types/api";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyFormat } from "@/lib/currency";

export default function HomePage() {
  const formatCurrency = useCurrencyFormat();
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAll();
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setError("Received invalid data from server");
          setProducts([]);
          return;
        }
        
        setProducts(data);
        
        const uniqueCategories = [...new Set(data.map((p: Product) => p.category))];
        setCategories(uniqueCategories.slice(0, 6));
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh] py-16 lg:py-24">
            <div className="max-w-xl">
              <Badge color="blue" className="mb-6 text-xs font-medium tracking-wider uppercase">
                New Collection 2024
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Premium Tech
                <span className="block text-blue-500">For Everyone</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Discover cutting-edge electronics, from smartphones to smart home devices. Quality tech at prices you'll love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button color="blue" size="lg" className="font-medium">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button color="dark" size="lg" outline className="border-slate-600 text-white hover:bg-slate-800">
                    Browse Categories
                  </Button>
                </Link>
              </div>
              
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-800">
                <div>
                  <p className="text-2xl font-bold text-white">50K+</p>
                  <p className="text-sm text-slate-500">Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">10K+</p>
                  <p className="text-sm text-slate-500">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9</p>
                  <p className="text-sm text-slate-500">Rating</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1498049860654-af1e5e5667ba?w=800&auto=format&fit=crop&q=60"
                  alt="Tech products"
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
            {[
              { label: "Free Shipping", sub: "Orders over $100" },
              { label: "Secure Payment", sub: "100% Protected" },
              { label: "24/7 Support", sub: "Always here" },
              { label: "Easy Returns", sub: "30-day policy" },
            ].map((item, index) => (
              <div key={index} className="p-6 text-center hover:bg-slate-50 transition-colors">
                <p className="font-medium text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 font-medium mb-2">Featured</p>
              <h2 className="text-3xl font-bold text-slate-900">Trending Products</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-slate-600 hover:text-blue-600 transition-colors">
              View all <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50 rounded-lg">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <p className="text-red-700 font-medium mb-2">{error}</p>
              <p className="text-red-500 text-sm mb-4">The server may be experiencing issues.</p>
              <Button 
                color="light" 
                size="sm" 
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400";
                        }}
                      />
                      {product.old_price && (
                        <Badge color="red" className="absolute top-3 left-3">
                          -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                        </Badge>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          color="dark"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product, 1);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Link>
                  
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{product.category}</p>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{formatCurrency(product.price)}</span>
                      {product.old_price && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.old_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-medium mb-2">Browse</p>
            <h2 className="text-3xl font-bold text-slate-900">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories.length > 0 ? categories : ["Electronics", "Laptops", "Phones", "Accessories", "Gaming", "Audio"]).map((category) => (
              <Link 
                key={category} 
                to={`/products?category=${category}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-slate-100">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-medium text-slate-900 text-sm">{category}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {categories.length > 0 
                      ? `${products.filter(p => p.category === category).length} items`
                      : "Explore"
                    }
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-blue-600 font-medium mb-2">Just In</p>
                <h2 className="text-3xl font-bold text-slate-900">New Arrivals</h2>
              </div>
              <Link to="/products" className="hidden sm:flex items-center text-slate-600 hover:text-blue-600 transition-colors">
                View all <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400";
                        }}
                      />
                      <Badge color="blue" className="absolute top-3 left-3">New</Badge>
                    </div>
                  </Link>
                  
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{product.category}</p>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{formatCurrency(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-slate-500">4.5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 lg:p-16 text-center lg:text-left">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge color="yellow" className="mb-4">Limited Offer</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-slate-400 text-lg mb-6">
                  Sign up now and receive exclusive deals, early access to sales, and special member-only discounts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register">
                    <Button color="blue" size="lg">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button color="dark" size="lg" outline className="border-slate-600 text-white hover:bg-slate-800">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl" />
                  <img
                    src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=60"
                    alt="Special offer"
                    className="relative rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-slate-500 mb-8">
              Stay updated with our latest products and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <Button color="dark" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-slate-400 mt-4">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
