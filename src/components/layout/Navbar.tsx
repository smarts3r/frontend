import React, { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Navbar as FlowbiteNavbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
    Avatar,
    Button,
    TextInput
} from 'flowbite-react';
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    LogOut,
    LayoutDashboard,
    Globe,
    Info,
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

    const loadCategories = useCallback(async () => {
        await getCategories();
    }, [getCategories]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
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

    // Helper to style links
    const linkClasses = (path: string) => `
        flex items-center text-sm font-medium transition-colors duration-200
        ${isActive(path)
            ? 'text-blue-600 bg-blue-50/50'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'} 
        px-3 py-2 rounded-lg
    `;

    return (
        <FlowbiteNavbar
            fluid
            rounded
            // Key Change: Added sticky, backdrop-blur, and z-index ensures it stays on top clearly
            className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 py-3"
        >
            <div className="flex flex-wrap items-center justify-between w-full mx-auto max-w-7xl">

                {/* 1. Logo Section */}
                <div className="flex items-center gap-6">
                    <NavbarBrand as={Link} to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
                            SmartS3r
                        </span>
                    </NavbarBrand>

                    {/* Desktop Menu Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link to="/" className={linkClasses('/')}>
                            <HomeIcon className="w-4 h-4 mr-1.5" />
                            {t('navbar.home', 'Home')}
                        </Link>

                        <Link to="/products" className={linkClasses('/products')}>
                            <Package className="w-4 h-4 mr-1.5" />
                            {t('navbar.shop', 'Shop')}
                        </Link>

                        {/* Dropdown Styled */}
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <span className={`flex items-center ${linkClasses('/categories')} cursor-pointer`}>
                                    Categories
                                    <ChevronDown className="w-3 h-3 ml-1.5 opacity-70" />
                                </span>
                            }
                        >
                            <DropdownHeader className="bg-gray-50">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Categories</span>
                            </DropdownHeader>
                            <div className="grid grid-cols-1 min-w-[200px] p-1">
                                {categories?.slice(0, 6).map((category) => (
                                    <DropdownItem
                                        key={category.id}
                                        as={Link}
                                        to={`/products?category=${category.name}`}
                                        className="rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2"
                                    >
                                        {category.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <DropdownDivider />
                            <DropdownItem as={Link} to="/categories" className="text-blue-600 font-medium justify-center text-xs py-2">
                                View All
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                {/* 2. Search Bar - Centered & Modern */}
                <div className="hidden lg:flex flex-1 max-w-lg mx-6">
                    <form onSubmit={handleSearch} className="w-full relative group">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // Key Change: CSS Inputs for better height and focus state
                            className="w-full pl-11 pr-20 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 group-hover:bg-white group-hover:shadow-md group-hover:shadow-blue-500/5"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* 3. Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search Mobile Trigger (Optional if you want search icon on mobile header) */}

                    {/* Wishlist */}
                    <Link to="/wishlist" className="hidden sm:flex relative p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                        <Heart className="w-5 h-5" />
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="relative p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Language Divider */}
                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                    {/* Language */}
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <button className="p-2 text-gray-500 hover:text-gray-900 font-medium text-sm rounded-lg hover:bg-gray-100 transition-colors uppercase">
                                {i18n.language}
                            </button>
                        }
                    >
                        <DropdownItem onClick={() => changeLanguage('en')} className="gap-2">🇺🇸 English</DropdownItem>
                        <DropdownItem onClick={() => changeLanguage('ar')} className="gap-2">🇪🇬 العربية</DropdownItem>
                    </Dropdown>

                    {/* Profile */}
                    {isAuthenticated ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <div className="p-0.5 border-2 border-transparent hover:border-blue-500 rounded-full transition-all">
                                    <Avatar
                                        alt="User"
                                        img={user?.avatar}
                                        placeholderInitials={user?.username?.charAt(0).toUpperCase()}
                                        rounded
                                        size="sm"
                                    />
                                </div>
                            }
                        >
                            <div className="px-4 py-3 bg-gray-50">
                                <span className="block text-sm font-bold text-gray-900">{user?.username}</span>
                                <span className="block truncate text-xs text-gray-500">{user?.email}</span>
                            </div>
                            <DropdownDivider className="my-0" />
                            {user?.role === 'admin' && (
                                <DropdownItem as={Link} to="/admin" icon={LayoutDashboard}>Dashboard</DropdownItem>
                            )}
                            <DropdownItem as={Link} to="/profile" icon={User}>Profile</DropdownItem>
                            <DropdownItem as={Link} to="/orders" icon={Package}>Orders</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem onClick={handleLogout} icon={LogOut} className="text-red-600 bg-red-50 hover:bg-red-100">Sign out</DropdownItem>
                        </Dropdown>
                    ) : (
                        <div className="flex gap-2 ml-2">
                            <Link
                                to="/login"
                                className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 transition-colors"
                            >
                                Join
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Keep existing layout but improve padding/colors if needed) */}
            <NavbarCollapse className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {/* ... (نفس كود الموبايل بتاعك بس اتأكد تشيل ال classes القديمة اللي بتعمل conflict) ... */}
                {/* نصيحة: خلي خلفية الموبايل بيضا برضه عشان التناسق */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <TextInput
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </form>
                    {/* ... باقي اللينكات ... */}
                </div>
            </NavbarCollapse>
        </FlowbiteNavbar>
    );
};

export default Navbar;