import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  Folder
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
}

export default function AdminSidebar({ isOpen, onClose, isConnected }: AdminSidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: t('admin.sidebar.dashboard') },
    { path: '/admin/orders', icon: ShoppingCart, label: t('admin.sidebar.orders') },
    { path: '/admin/products', icon: Package, label: t('admin.sidebar.products') },
    { path: '/admin/categories', icon: Folder, label: t('admin.sidebar.categories') },
    // { path: '/admin/users', icon: Users, label: t('admin.sidebar.users') },
    // { path: '/admin/settings', icon: Settings, label: t('admin.sidebar.settings') },
  ];

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside 
        className={`fixed lg:static inset-y-0 left-0 ${sidebarWidth} bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S3</span>
              </div>
              <span className="font-semibold text-gray-900">Smart S3r</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">S3</span>
            </div>
          )}
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
          </button>
          
          <button 
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.username || t('admin.sidebar.admin')}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">{isConnected ? t('admin.sidebar.live') : t('admin.sidebar.offline')}</span>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium ${collapsed ? 'justify-center w-full' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>{t('admin.sidebar.logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
