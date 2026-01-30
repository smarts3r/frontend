import {
  ChevronDown,
  Globe,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

interface Category {
  id: number;
  name: string;
  category: string;
}

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Get cart count from Zustand store for real-time reactivity
  const cartCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/img/logo.jpg"
            alt="Smart S3r"
            className="h-10 w-auto object-contain rounded"
          />
          <span className="hidden sm:inline text-lg font-bold text-gray-900">
            Smart S3r
          </span>
        </Link>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`${t("search")}`}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-color"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-color font-medium transition-colors"
            >
              {t("home")}
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-color font-medium transition-colors"
              >
                <span>{t("categories")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.category}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className="text-gray-700 hover:text-primary-color font-medium transition-colors"
            >
              {t("shop")}
            </Link>

            <Link
              to="/about-us"
              className="text-gray-700 hover:text-primary-color font-medium transition-colors"
            >
              {t("about_us")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-color transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  {i18n.language === "ar" ? "العربية" : "English"}
                </span>
              </button>

              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setIsLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      i18n.changeLanguage("ar");
                      setIsLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-color font-medium transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                to="/signup"
                className="bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-primary-color/90 transition-colors"
              >
                {t("signup")}
              </Link>
            </div>

            <Link
              to="/login"
              className="sm:hidden text-gray-700 hover:text-primary-color transition-colors"
            >
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-color transition-colors"
            >
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-color text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-primary-color font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>

              <div>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-color font-medium transition-colors"
                >
                  <span>{t("categories")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.category}`}
                        className="block text-gray-600 hover:text-primary-color transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className="block text-gray-700 hover:text-primary-color font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("shop")}
              </Link>

              <Link
                to="/about-us"
                className="block text-gray-700 hover:text-primary-color font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("about_us")}
              </Link>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center text-gray-700 hover:text-primary-color font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center bg-primary-color text-white py-2 rounded-lg hover:bg-primary-color/90 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("signup")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
