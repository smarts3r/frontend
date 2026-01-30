import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCategories } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.getTotalItems());
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    };

    return (
        <div className="font-sans">
            {/* Top Bar */}
            <div className="bg-[#0f172a] text-white py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse mr-8 rtl:ml-8">
                        <img src="/img/logo.jpg" alt="Smart S3r" className="h-10 w-auto rounded-lg" />
                        <span className="text-xl font-bold text-white tracking-tight">Smart S3r</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-auto hidden md:block px-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('navbar.search_placeholder', 'Search products...')}
                                className="w-full bg-[#1e293b] text-gray-300 rounded-lg py-2.5 px-4 pr-10 rtl:pl-10 rtl:pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Search
                                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-white transition-colors"
                                onClick={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4 rtl:space-x-reverse ml-4 rtl:mr-4">
                        {/* Language Switcher */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-300 hover:text-blue-500"
                                onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                            >
                                <Globe className="w-4 h-4 mr-1 rtl:ml-1" />
                                {i18n.language === 'en' ? 'Arabic' : 'English'}
                            </Button>
                        </div>

                        <Link to="/wishlist" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-500 transition-colors text-white">
                            <Heart className="w-5 h-5" />
                            <span className="hidden lg:inline text-sm font-medium">{t('navbar.wishlist', 'Wishlist')}</span>
                        </Link>
                        <Link to="/cart" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-500 transition-colors text-white relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden lg:inline text-sm font-medium">{t('navbar.cart', 'Cart')}</span>
                            {totalItems > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs rounded-full">
                                    {totalItems}
                                </Badge>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-500 transition-colors text-white hover:bg-transparent">
                                        <User className="w-5 h-5" />
                                        <span className="hidden lg:inline text-sm font-medium">{user?.username || 'User'}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {user?.role === 'admin' && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link to="/admin" className="cursor-pointer w-full flex items-center">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/orders" className="cursor-pointer w-full">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-blue-500 transition-colors text-white">
                                <User className="w-5 h-5" />
                                <span className="hidden lg:inline text-sm font-medium">{t('navbar.signin', 'Sign In')}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-[#0f172a] border-t border-gray-800 text-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-14">

                        {/* Mobile Menu Trigger & Categories */}
                        <div className="flex items-center gap-4 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white text-gray-900 border-none">
                                    <SheetHeader className="mb-6">
                                        <SheetTitle className="text-left text-2xl font-bold text-blue-600 flex items-center gap-2">
                                            <img src="/img/logo.jpg" alt="Smart S3r" className="h-8 w-auto rounded-lg" /> Smart S3r
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-6">
                                        <div className="flex flex-col space-y-3">
                                            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Menu</h3>
                                            <Link to="/" className="text-lg font-medium hover:text-blue-600 transition-colors">Home</Link>
                                            <Link to="/products" className="text-lg font-medium hover:text-blue-600 transition-colors">Shop</Link>
                                            <Link to="/about" className="text-lg font-medium hover:text-blue-600 transition-colors">About Us</Link>
                                            <Link to="/wishlist" className="text-lg font-medium hover:text-blue-600 transition-colors">Wishlist</Link>
                                            <Link to="/orders" className="text-lg font-medium hover:text-blue-600 transition-colors">My Orders</Link>
                                        </div>

                                        <div className="border-t border-gray-100 pt-6">
                                            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-3">Categories</h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {categories.map((cat) => (
                                                    <Link key={cat} to={`/products?category=${cat}`} className="text-gray-600 hover:text-blue-600 py-1">
                                                        {cat}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <span className="font-semibold text-lg">Menu</span>
                        </div>

                        {/* Desktop: Categories & Links */}
                        <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
                            {/* All Categories Button */}
                            <div className="relative">
                                <button
                                    className="flex items-center bg-[#1e293b] px-4 py-2 rounded-md space-x-2 rtl:space-x-reverse hover:bg-[#334155] transition-colors"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    <Menu className="w-5 h-5" />
                                    <span className="font-medium">{t('navbar.all_categories', 'All Categories')}</span>
                                </button>
                                {/* Dropdown */}
                                {isCategoryOpen && (
                                    <div className="absolute top-full left-0 rtl:right-0 w-56 bg-white text-gray-900 shadow-xl rounded-md mt-2 z-50 py-2 border border-gray-100 ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            {categories.map((cat) => (
                                                <Link key={cat} to={`/products?category=${cat}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                    {cat}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nav Links */}
                            <nav className="flex items-center space-x-8 rtl:space-x-reverse text-sm font-medium text-gray-300">
                                <Link to="/" className="hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md">{t('navbar.home', 'Home')}</Link>
                                <Link to="/products" className="hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md">{t('navbar.shop', 'Shop')}</Link>
                                <Link to="/about" className="hover:text-white transition-colors hover:bg-white/5 px-3 py-2 rounded-md">{t('navbar.about_us', 'About Us')}</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
