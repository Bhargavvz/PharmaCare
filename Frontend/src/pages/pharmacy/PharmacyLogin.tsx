import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Building2, AlertCircle } from 'lucide-react';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const PharmacyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setToken } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasCorruptedState, setHasCorruptedState] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // Check for corrupted state - userData without token
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    if (userData && !token) {
      console.log('PharmacyLogin: Detected corrupted state - userData without token');
      setHasCorruptedState(true);
    }
  }, []);

  const clearStorageData = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToken(null);
    setHasCorruptedState(false);
    toast.success('Session data cleared. You can now log in again.');
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (currentUser && isPharmacyStaffUser(currentUser) && token) {
      console.log('Already logged in as pharmacy staff with valid token, redirecting to dashboard');
      navigate('/pharmacy/dashboard');
    }
  }, [currentUser, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting.');
      return;
    }
    
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      console.log('Attempting pharmacy login...');
      const response = await fetch(`${API_URL}/auth/pharmacy/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Get raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw API response:', rawResponse);
      
      // Parse JSON data (if possible)
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response format');
      }

      if (!response.ok) {
        console.error('Login failed with status:', response.status, response.statusText);
        throw new Error(data.message || 'Invalid credentials or not authorized');
      }

      console.log('Pharmacy login successful, response data:', JSON.stringify(data, null, 2));
      
      // Validate pharmacy staff data structure
      if (!data.pharmacyStaff || !data.token) {
        throw new Error('Invalid response format from server');
      }
      
      // First clear any existing data to avoid conflicts
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Create enhanced pharmacy staff with userType marker
      const enhancedPharmacyStaff = {
        ...data.pharmacyStaff,
        userType: 'pharmacy'
      };
      
      // Ensure required properties are present
      if (!enhancedPharmacyStaff.pharmacyId) {
        console.warn('PharmacyStaff data is missing pharmacyId property, attempting to fix');
        
        if (data.pharmacyStaff.pharmacy && data.pharmacyStaff.pharmacy.id) {
          console.log('Adding pharmacyId from pharmacy.id');
          enhancedPharmacyStaff.pharmacyId = data.pharmacyStaff.pharmacy.id;
        } else if (data.pharmacyId) {
          console.log('Adding pharmacyId from response root');
          enhancedPharmacyStaff.pharmacyId = data.pharmacyId;
        } else {
          throw new Error('Cannot determine pharmacy ID from server response');
        }
      }
      
      // Store token first, then user data
      console.log('Setting token in localStorage');
      localStorage.setItem('token', data.token);
      
      console.log('Setting userData in localStorage');
      localStorage.setItem('userData', JSON.stringify(enhancedPharmacyStaff));
      
      // Verify storage worked correctly
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      
      if (!storedToken || !storedUserData) {
        console.error('Failed to store authentication data');
        throw new Error('Failed to store authentication data. Please try again.');
      }
      
      // Update application state
      setToken(data.token);
      setCurrentUser(enhancedPharmacyStaff);
      
      toast.success('Login successful! Welcome back!');
      setLoginSuccess(true);
      
      // Use navigate instead of window.location for a more React-friendly approach
      setTimeout(() => {
        navigate('/pharmacy/dashboard');
      }, 500);
      
    } catch (error) {
      console.error('Pharmacy login error:', error);
      
      // Handle specific error cases
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.');
      } else if (error instanceof TypeError && error.message.includes('network')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Login failed');
      }
      
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {hasCorruptedState && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  We detected a problem with your session data. 
                </p>
                <button 
                  onClick={clearStorageData}
                  className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-600"
                >
                  Click here to fix it
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loginSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Login successful! Redirecting you to the dashboard...
                </p>
                <Link 
                  to="/pharmacy/dashboard"
                  className="mt-2 text-sm font-medium text-green-700 hover:text-green-600"
                >
                  Click here if you are not redirected
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-4">
             <Building2 className="h-8 w-8 text-emerald-600" />
             <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
               PharmaCare+ Pharmacy
             </span>
          </Link>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            Pharmacy Staff Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Need an account?{' '}
            <Link to="/pharmacy/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
              Register your pharmacy
            </Link>
          </p>
        </div>
        
        <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 py-2 sm:text-sm rounded-md transition duration-150 ease-in-out ${
                    errors.email 
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 py-2 sm:text-sm rounded-md transition duration-150 ease-in-out ${
                    errors.password 
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyLogin; 