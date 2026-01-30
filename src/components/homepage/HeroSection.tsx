import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 py-16 lg:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 text-sm rounded-full font-medium w-fit shadow-md transition-all duration-300">
              {t("homePage.hero.badge")}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              {t("homePage.hero.title")}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {t("homePage.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/products" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-14 text-lg rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  {t("homePage.hero.ctaPrimary")}
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/offers" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-blue-300 text-blue-700 bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-400 h-14 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  {t("homePage.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Side - Professional Electronics Representation */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-3xl transform rotate-3 opacity-20"></div>

            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Circuit Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20,20 L60,20 L60,60 L100,60 L100,100 L140,100 L140,140 L180,140"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-blue-600"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="60"
                      cy="20"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="100"
                      cy="60"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="140"
                      cy="100"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                    <circle
                      cx="180"
                      cy="140"
                      r="4"
                      fill="currentColor"
                      className="text-blue-600"
                    />
                  </svg>
                </div>

                {/* Central Icon */}
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">
                    Professional Electronics
                  </p>
                  <p className="text-gray-500 text-sm">Quality & Innovation</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
