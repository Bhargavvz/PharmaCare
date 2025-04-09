import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  QrCode,
  Settings,
  User,
  Users,
  X,
  Heart,
  Gift,
  LineChart,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarLink {
  name: string;
  to: string;
  icon: React.ElementType;
}

const sidebarLinks: SidebarLink[] = [
  { name: 'Dashboard', to: '/dashboard', icon: Home },
  { name: 'Medications', to: '/dashboard/medications', icon: Calendar },
  { name: 'Reminders', to: '/dashboard/reminders', icon: Bell },
  { name: 'Prescriptions', to: '/dashboard/prescriptions', icon: QrCode },
  { name: 'Donations', to: '/dashboard/donations', icon: Heart },
  { name: 'Family', to: '/dashboard/family', icon: Users },
  { name: 'Analytics', to: '/dashboard/analytics', icon: LineChart },
  { name: 'Rewards', to: '/dashboard/rewards', icon: Gift },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-menu-button]') && !target.closest('[data-menu-dropdown]')) {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-7 w-7 text-teal-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
              PharmaCare+
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to))
                      ? 'text-teal-700 bg-teal-100 font-semibold'
                      : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  <link.icon className={`w-5 h-5 mr-3 ${location.pathname === link.to ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600'}`} />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Settings and Logout */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            to="/dashboard/settings"
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 mb-1 ${
              location.pathname === '/dashboard/settings'
                ? 'text-teal-700 bg-teal-100 font-semibold'
                : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50'
            }`}
          >
            <Settings className={`w-5 h-5 mr-3 ${location.pathname === '/dashboard/settings' ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600'}`} />
            Settings
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Top navbar */}
        <header className="sticky top-0 right-0 left-0 lg:left-64 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden mr-3"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/dashboard'
                  ? 'Dashboard'
                  : location.pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notifications */}
              <div className="relative" data-menu-button>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                {isNotificationsOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 animate-fade-in-down"
                    role="menu" aria-orientation="vertical" aria-labelledby="notification-button" tabIndex={-1}
                    data-menu-dropdown
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 text-center text-sm text-gray-500 hover:bg-gray-50">
                        No new notifications
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link to="#" className="block text-center text-sm font-medium text-teal-600 hover:text-teal-700">
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative" data-menu-button>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 transition duration-150 ease-in-out"
                  aria-label="Open user menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center ring-1 ring-white/50">
                    <span className="text-sm font-medium text-white">
                      {currentUser?.firstName?.[0] || 'U'}{currentUser?.lastName?.[0] || ''}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {currentUser?.firstName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 origin-top-right rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 animate-fade-in-down"
                    role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}
                    data-menu-dropdown
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    </div>
                    <div className="py-1" role="none">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem" tabIndex={-1} onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2.5 text-gray-400" />
                        Your Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem" tabIndex={-1} onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2.5 text-gray-400" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1" role="none">
                      <button
                        onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        role="menuitem" tabIndex={-1}
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
