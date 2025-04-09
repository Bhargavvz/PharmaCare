import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { ok: true, json: async () => ({ message: 'Subscribed!'}) };

      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe to newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-slate-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <Building2 className="h-7 w-7 text-teal-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                PharmaCare+
              </span>
            </Link>
            <p className="text-sm text-gray-600">
              Your complete medicine management solution.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Pricing</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Contact</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Privacy Policy</Link></li> 
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-teal-600 transition duration-150 ease-in-out">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-3">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <button 
                type="submit"
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-white shadow-sm transition duration-300 ease-in-out transform ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 active:from-teal-700 active:to-teal-800 focus-visible:outline-teal-600 hover:-translate-y-px'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg> 
                ) : (
                  <ArrowRight className="h-4 w-4" /> 
                )}
                 <span className="sr-only">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PharmaCare+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;