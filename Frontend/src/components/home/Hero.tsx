import React from 'react';
import { Bell, Heart, Building2, Package, Receipt, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden">
      {/* Optional: Add subtle background elements here if desired later */}
      {/* <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full opacity-30 blur-3xl"></div> */}
      {/* <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center lg:pb-24 z-10">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl mt-40">
          Your Complete{' '}
          <span className="relative whitespace-nowrap text-teal-600">
            {/* Optional: Add subtle underline/highlight effect */}
            {/* <svg className="absolute inset-x-0 bottom-0 h-2 text-teal-300" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 C 20 10, 80 0, 100 5" stroke="currentColor" fill="none" strokeWidth="1"/></svg> */}
            <span className="relative">Medicine Management</span>
          </span>{' '}
          Solution
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg tracking-tight text-slate-600">
          Track medications, set reminders, and contribute to community health with our intelligent platform.
        </p>

        <div className="mt-12 flex flex-col items-center">
          {/* Button Section */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {!currentUser ? (
              <>
                {/* Patient Login */}
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Patient Login
                </Link>
                {/* Patient Signup */}
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none bg-transparent ring-1 ring-inset ring-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-teal-600 focus-visible:ring-teal-300 transition duration-300 ease-in-out"
                >
                  Patient Signup
                </Link>
                {/* Pharmacy Login */}
                <Link
                  to="/pharmacy/login"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:from-emerald-700 active:to-emerald-800 focus-visible:outline-emerald-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                 >
                  <Building2 className="mr-2 h-4 w-4" />
                  Pharmacy Login
                </Link>
                {/* Pharmacy Signup */}
                <Link
                  to="/pharmacy/signup"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none bg-transparent ring-1 ring-inset ring-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-emerald-600 focus-visible:ring-emerald-300 transition duration-300 ease-in-out"
                 >
                  <Building2 className="mr-2 h-4 w-4" />
                  Pharmacy Signup
                </Link>
              </>
            ) : (
              <>
                {/* Go to Patient Dashboard */}
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </Link>
                {/* Go to Pharmacy Management */}
                <Link
                  to="/pharmacy/dashboard"
                  className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:from-emerald-700 active:to-emerald-800 focus-visible:outline-emerald-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                 >
                  <Building2 className="mr-2 h-4 w-4" />
                  Pharmacy Management
                </Link>
              </>
            )}
          </div>

          {/* View Features Link - kept subtle */}
          <div className="mt-8">
            <Link
              to="/features"
              className="text-sm font-medium text-teal-600 hover:text-teal-800 transition duration-300 ease-in-out"
            >
              Learn more about features &rarr;
            </Link>
          </div>
        </div>

        {/* Pharmacy Features Section */}
        <div className="mt-24 lg:mt-32">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-12">Pharmacy Management Tools</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card: Inventory */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-5">
                <Package className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Inventory Management</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Track medicines, expiry dates, and get low stock alerts</p>
            </div>

            {/* Feature Card: Billing */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-5">
                <Receipt className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Billing System</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Generate bills with QR codes and prescription integration</p>
            </div>

            {/* Feature Card: Donations */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-5">
                <Heart className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Donation Management</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Accept and verify donated medicines from users</p>
            </div>

            {/* Feature Card: Analytics */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-5">
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Analytics & Reporting</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Track sales, inventory trends, and expiry dates</p>
            </div>

            {/* Feature Card: Staff */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-5">
                <Users className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Staff Management</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Role-based access control for pharmacy staff</p>
            </div>

            {/* Feature Card: Reminders */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 mb-5">
                <Bell className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="font-display text-lg font-medium text-gray-900">Smart Reminders</h3>
              <p className="mt-2 text-sm text-slate-600 text-center">Never miss important inventory or billing tasks</p>
            </div>
          </div>
        </div>

        {/* Social Proof/Stats Section */}
        <div className="mt-24">
          <p className="text-lg font-medium text-gray-800">Trusted by thousands worldwide</p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600">50K+</div>
              <div className="mt-1 text-sm text-slate-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600">100K+</div>
              <div className="mt-1 text-sm text-slate-600">Medications Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600">25K+</div>
              <div className="mt-1 text-sm text-slate-600">Medicines Donated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;