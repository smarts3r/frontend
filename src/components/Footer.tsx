import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing with email: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/img/logo.jpg"
                alt="Smart S3r"
                className="h-12 w-auto object-contain rounded"
              />
              <h3 className="text-2xl font-bold">Smart S3r</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your premier destination for quality electronics and tech gadgets.
              Experience shopping reimagined with professional service and
              competitive prices.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                Subscribe to Our Newsletter
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-l-full"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-r-full px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-400">
                Get exclusive offers and be the first to know about new
                products.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Shop by Category</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products?category=Laptops"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Mobiles"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                  Mobile Phones
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Audio"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Gaming"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Gaming
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Riyadh, Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-sm">support@smarts3r.com</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Smart S3r. All rights reserved. Made with ❤️ in Saudi
              Arabia.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
