import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import { ChevronDown, LogOut, User, Menu, X, Heart, Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname.startsWith('/dashboard')) return true;
    if (path === '/pharmacy/dashboard' && location.pathname.startsWith('/pharmacy/dashboard')) return true;
    return location.pathname === path;
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoutClick = () => {
    logout();
    setIsUserMenuOpen(false);
    closeMobileMenu();
  };

  const navLinks = [
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Building2 className="h-7 w-7 text-teal-600" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  PharmaCare+
                </span>
              </Link>
            </div>

            {/* Desktop Navigation and Auth Area */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {/* Navigation Links */}
              <div className="flex space-x-8">
                {navLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150 ease-in-out ${
                      isActive(path)
                        ? 'border-teal-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Auth Area: User Menu or Login/Signup Buttons */}
              <div className="flex items-center ml-6">
                {currentUser ? (
                  <div className="relative" id="user-menu">
                    <button
                      onClick={toggleUserMenu}
                      className="group flex items-center space-x-2 p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-100 text-teal-600">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium hidden sm:block">{currentUser.firstName || currentUser.email.split('@')[0]}</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down"
                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                        </div>
                        <div className="py-1" role="none">
                          <Link
                            to={isPharmacyStaffUser(currentUser) ? "/pharmacy/dashboard" : "/dashboard"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem" tabIndex={-1} onClick={() => setIsUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem" tabIndex={-1} onClick={() => setIsUserMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 py-1" role="none">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                            role="menuitem" tabIndex={-1}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Login/Signup Buttons for Desktop */
                  <div className="flex items-center space-x-3">
                    <Link
                       to="/login"
                       className="group inline-flex items-center justify-center rounded-full py-2 px-5 text-sm font-semibold focus:outline-none bg-transparent ring-1 ring-inset ring-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-teal-600 focus-visible:ring-teal-300 transition duration-300 ease-in-out"
                    >
                      Login
                    </Link>
                    <Link
                       to="/signup"
                       className="group inline-flex items-center justify-center rounded-full py-2 px-5 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow hover:from-teal-600 hover:to-teal-700 hover:shadow-md active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-px"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */} 
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`} id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`block rounded-md px-3 py-2 text-base font-medium transition duration-150 ease-in-out ${
                  isActive(path)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                onClick={closeMobileMenu}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Area */}
          {currentUser ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <User className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser.firstName || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                   to={isPharmacyStaffUser(currentUser) ? "/pharmacy/dashboard" : "/dashboard"}
                   className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                   onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                   to="/dashboard/profile"
                   className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                   onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 px-5">
              <div className="flex flex-col space-y-3">
                 <Link
                    to="/login"
                    className="group w-full inline-flex items-center justify-center rounded-md py-2 px-4 text-base font-medium focus:outline-none bg-transparent ring-1 ring-inset ring-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition duration-300 ease-in-out"
                    onClick={closeMobileMenu}
                 >
                   Login
                 </Link>
                 <Link
                    to="/signup"
                    className="group w-full inline-flex items-center justify-center rounded-md py-2 px-4 text-base font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow hover:from-teal-600 hover:to-teal-700 active:from-teal-700 active:to-teal-800 transition duration-300 ease-in-out"
                    onClick={closeMobileMenu}
                 >
                   Sign Up
                 </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;