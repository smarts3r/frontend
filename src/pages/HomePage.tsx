import type React from "react";
import {
  FeaturedCategories,
  FeaturedProducts,
  HeroSection,
  TrustSignals,
} from "@/components/homepage";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Trust Signals / Why Choose Us */}
      <TrustSignals />
    </div>
  );
};
