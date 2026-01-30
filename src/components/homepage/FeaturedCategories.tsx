import {
  Camera,
  Gamepad2,
  Headphones,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services";

// Category icon mapping for electronics
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("laptop") || name.includes("computer"))
    return <Laptop className="w-8 h-8" />;
  if (name.includes("phone") || name.includes("mobile"))
    return <Smartphone className="w-8 h-8" />;
  if (name.includes("watch") || name.includes("wearable"))
    return <Watch className="w-8 h-8" />;
  if (name.includes("headphone") || name.includes("audio"))
    return <Headphones className="w-8 h-8" />;
  if (name.includes("camera") || name.includes("photo"))
    return <Camera className="w-8 h-8" />;
  if (name.includes("tablet")) return <Tablet className="w-8 h-8" />;
  if (name.includes("monitor") || name.includes("display"))
    return <Monitor className="w-8 h-8" />;
  if (name.includes("game") || name.includes("gaming"))
    return <Gamepad2 className="w-8 h-8" />;
  return <Laptop className="w-8 h-8" />; // Default icon
};

// Category color mapping for professional look
const getCategoryColor = (index: number) => {
  const colors = [
    "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200",
    "bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 hover:from-slate-200 hover:to-gray-200",
    "bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700 hover:from-purple-200 hover:to-violet-200",
    "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200",
  ];
  return colors[index % colors.length];
};

// Fallback categories if API fails
const fallbackCategories = [
  { name: "Laptops & Computers", slug: "laptops-computers" },
  { name: "Mobile Phones", slug: "mobile-phones" },
  { name: "Smart Watches", slug: "smart-watches" },
  { name: "Audio & Headphones", slug: "audio-headphones" },
  { name: "Cameras & Photography", slug: "cameras-photography" },
  { name: "Tablets", slug: "tablets" },
  { name: "Monitors & Displays", slug: "monitors-displays" },
  { name: "Gaming", slug: "gaming" },
];

interface Category {
  name: string;
  slug: string;
  description?: string;
}

export const FeaturedCategories: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        if (Array.isArray(data) && data.length > 0) {
          // Transform API data to expected format
          const transformedCategories = data.map((cat, index) => {
            if (typeof cat === "string") {
              return {
                name: cat,
                slug: cat.toLowerCase().replace(/\s+/g, "-"),
                description: undefined,
              };
            }

            const categoryObj = cat as Record<string, unknown>;
            const name = (categoryObj.name ||
              categoryObj.title ||
              `Category ${index + 1}`) as string;
            const slug = (categoryObj.slug ||
              `${name}`.toLowerCase().replace(/\s+/g, "-") ||
              `category-${index}`) as string;

            return {
              name,
              slug,
              description: categoryObj.description as string | undefined,
            };
          });
          setCategories(transformedCategories);
        } else {
          // Use fallback categories
          setCategories(fallbackCategories.slice(0, 8)); // Limit to 8 for grid
        }
      } catch (error) {
        console.warn("Failed to fetch categories, using fallback:", error);
        setCategories(fallbackCategories.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Category skeleton loader
  const CategorySkeleton = () => (
    <Card className="h-full">
      <CardContent className="p-6 text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("homePage.categories.title")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("homePage.categories.subtitle")}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? // Show skeletons while loading
            [...Array(8)].map((_, index) => <CategorySkeleton key={index} />)
          : categories.map((category, index) => (
              <Link
                to={`/products?category=${encodeURIComponent(category.slug || category.name)}`}
                key={category.slug || category.name}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 bg-white shadow-md cursor-pointer">
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Category Icon */}
                    <div
                      className={`p-4 rounded-full ${getCategoryColor(index)} mx-auto w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md`}
                    >
                      {getCategoryIcon(category.name)}
                    </div>

                    {/* Category Name */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Call to Action */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-full transition-all duration-300"
                    >
                      {t("homePage.categories.browseCategory")}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* View All Categories Button */}
      <div className="text-center mt-12">
        <Link to="/categories">
          <Button
            variant="outline"
            className="rounded-full px-8 transition-all duration-300"
          >
            {t("homePage.viewAll")}
          </Button>
        </Link>
      </div>
    </section>
  );
};
