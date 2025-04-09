import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-4 py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white mb-6 shadow-lg">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 mb-3">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          It looks like the page you were searching for doesn't exist or has been moved. 
          Don't worry, let's get you back on track.
        </p>
        <div className="mt-8">
          <Link
            to="/" 
            className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-base font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;