import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
    Avatar
} from 'flowbite-react';
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    LogOut,
    LayoutDashboard,
    Package,
    Home as HomeIcon,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useGetCategories } from '@/hooks/useCategories';

export const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { data: categories, getCategories } = useGetCategories();
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getCategories();
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };

        fetchData();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);


    }, [getCategories]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const isActive = (path: string) => location.pathname === path;

    const linkClasses = (path: string) => `
        flex items-center text-sm font-semibold transition-all duration-300
        ${isActive(path)
            ? 'text-blue-600 bg-blue-50/80 shadow-sm border border-blue-100/50'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
        }
px-4 py-2 rounded-xl
    `;

    const getLangDisplay = (lang: string) => {
        switch (lang) {
            case 'ar': return { label: 'العربية', flag: '🇪🇬' };
            default: return { label: 'EN', flag: '🇺🇸' };
        }
    };

    return (
        <nav
            className={`transition-all duration-300 border-b border-gray-100 sticky top-0 z-50 py-6 md:py-3 sm:py-2 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/20'
                : 'bg-white/95 backdrop-blur-md shadow-sm'
                } `}
        >
            <div className="flex flex-wrap items-center justify-between w-full mx-auto max-w-7xl">


                <div className="flex items-center gap-6">
                    <div onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">

                        <span className="text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 hidden sm:block tracking-tight">
                            SmartS3r
                        </span>
                    </div>


                    <div className="hidden lg:flex items-center gap-1">
                        <Link to="/" className={linkClasses('/')}>
                            <HomeIcon className="w-4 h-4 mr-2" />
                            {t('navbar.home', 'Home')}
                        </Link>

                        <Link to="/products" className={linkClasses('/products')}>
                            <Package className="w-4 h-4 mr-2" />
                            {t('navbar.shop', 'Shop')}
                        </Link>

                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <span className={`group flex items-center ${linkClasses('/categories')} cursor-pointer`}>
                                    {t('navbar.categories', 'Categories')}
                                    <ChevronDown className="w-4 h-4 ml-1.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                                </span>
                            }
                        >
                            <DropdownHeader className="bg-gray-50/50 py-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Featured Categories</span>
                            </DropdownHeader>
                            <div className="grid grid-cols-1 min-w-[220px] p-2">
                                {categories?.slice(0, 6).map((category) => (
                                    <DropdownItem
                                        key={category.id}
                                        as={Link}
                                        to={`/products?category=${category.name}`}
                                        className="rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2.5 transition-colors"
                                    >
                                        {category.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <DropdownDivider className="my-1 border-gray-100" />
                            <DropdownItem as={Link} to="/categories" className="text-blue-600 font-bold justify-center text-xs py-3 hover:bg-blue-50 rounded-b-xl">
                                {t('navbar.view_all', 'View All Categories')}
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                {/* 2. Search Bar - Desktop */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                    <form onSubmit={handleSearch} className="w-full relative group">
                        <input
                            type="text"
                            placeholder={t('navbar.search_placeholder', 'Search for products...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-24 py-3 bg-gray-50/50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 group-hover:border-gray-200"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:shadow-blue-500/40 active:scale-95"
                        >
                            {t('navbar.search', 'Search')}
                        </button>
                    </form>
                </div>

                {/* 3. Right Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Wishlist */}
                    <Link to="/wishlist" className="hidden sm:flex relative p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all hover:scale-110">
                        <Heart className={`w - 5 h - 5 ${location.pathname === '/wishlist' ? 'fill-red-500 text-red-500' : ''} `} />
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all hover:scale-110">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-4 ring-white shadow-sm animate-in zoom-in">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block"></div>

                    {/* Language Switcher */}
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <div className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all uppercase tracking-wider cursor-pointer">
                                <span>{getLangDisplay(i18n.language).flag}</span>
                                <span>{getLangDisplay(i18n.language).label}</span>
                            </div>
                        }
                    >
                        <DropdownItem onClick={() => changeLanguage('en')} className="gap-2 font-medium">🇺🇸 English</DropdownItem>
                        <DropdownItem onClick={() => changeLanguage('ar')} className="gap-3 font-medium text-right">العربية 🇪🇬</DropdownItem>
                    </Dropdown>

                    {/* Profile */}
                    {isAuthenticated ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <div className="p-0.5 border-2 border-transparent hover:border-blue-500 rounded-2xl transition-all cursor-pointer">
                                    <Avatar
                                        alt="User"
                                        img={user?.avatar as string | undefined}
                                        placeholderInitials={user?.username?.charAt(0).toUpperCase()}
                                        rounded
                                        size="sm"
                                        className="rounded-xl overflow-hidden"
                                    />
                                </div>
                            }
                        >
                            <div className="px-5 py-4 bg-linear-to-br from-gray-50 to-white">
                                <span className="block text-sm font-black text-gray-900">{user?.username}</span>
                                <span className="block truncate text-xs text-gray-500 mt-0.5">{user?.email}</span>
                            </div>
                            <DropdownDivider className="my-0 border-gray-100" />
                            {user?.role?.toUpperCase() === "ADMIN" && (
                                <DropdownItem as={Link} to="/admin" icon={LayoutDashboard} className="font-semibold text-xs py-3">Dashboard</DropdownItem>
                            )}
                            <DropdownItem as={Link} to="/profile" icon={User} className="font-semibold text-xs py-3">Profile Settings</DropdownItem>
                            <DropdownItem as={Link} to="/orders" icon={Package} className="font-semibold text-xs py-3">Order History</DropdownItem>
                            <DropdownDivider className="my-0 border-gray-100" />
                            <DropdownItem onClick={handleLogout} icon={LogOut} className="text-red-600 bg-red-50/50 hover:bg-red-50 font-bold text-xs py-3">Sign out</DropdownItem>
                        </Dropdown>
                    ) : (
                        <div className="flex gap-2 ml-1">
                            <Link
                                to="/login"
                                className="hidden sm:block px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                            >
                                {t('navbar.login', 'Sign In')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
                            >
                                {t('navbar.join', 'Join')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors ml-1"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden w-full transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} `}>
                <div className="px-4 pt-2 pb-8 bg-white border-t border-gray-50 space-y-6">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative mt-4">
                        <input
                            type="text"
                            placeholder={t('navbar.search_placeholder', 'Search products...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </form>

                    {/* Mobile Main Links */}
                    <div className="space-y-1.5">
                        <Link
                            to="/"
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${isActive('/') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'} `}
                            onClick={() => setIsOpen(false)}
                        >
                            <HomeIcon className="w-5 h-5" />
                            {t('navbar.home', 'Home')}
                        </Link>
                        <Link
                            to="/products"
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${isActive('/products') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'} `}
                            onClick={() => setIsOpen(false)}
                        >
                            <Package className="w-5 h-5" />
                            {t('navbar.shop', 'Shop')}
                        </Link>
                    </div>

                    {/* Mobile Categories Section */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                {t('navbar.categories', 'Categories')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-1">
                            {categories?.slice(0, 6).map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.name}`}
                                    className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50/50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all text-center border border-transparent hover:border-blue-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                        <Link
                            to="/categories"
                            className="flex items-center justify-center mt-3 px-4 py-3.5 text-xs font-bold text-blue-600 bg-blue-50/50 rounded-2xl hover:bg-blue-50 transition-all active:scale-95"
                            onClick={() => setIsOpen(false)}
                        >
                            {t('navbar.view_all', 'View All Categories')}
                        </Link>
                    </div>

                    {!isAuthenticated && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                            <Link
                                to="/login"
                                className="px-4 py-4 text-sm font-bold text-gray-700 bg-gray-50 rounded-2xl text-center active:scale-95 transition-transform"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('navbar.login', 'Sign In')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-4 text-sm font-bold text-white bg-blue-600 rounded-2xl text-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('navbar.join', 'Join Now')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;