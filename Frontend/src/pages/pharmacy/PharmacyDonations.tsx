import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PharmacyDonations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/pharmacy/dashboard')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Medicine Donation Management</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-purple-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Donation Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            This feature is coming soon. You'll be able to accept donated medicines from users, 
            verify their condition and expiry date, and sell donated medicines at discounted prices.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/pharmacy/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDonations; 