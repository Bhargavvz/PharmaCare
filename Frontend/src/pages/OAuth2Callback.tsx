import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';
import { API_URL } from '../config';

const OAuth2Callback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndSetToken = async () => {
      try {
        const token = searchParams.get('token');
        const errorMsg = searchParams.get('error');
        
        if (errorMsg) {
          setError(decodeURIComponent(errorMsg));
          toast.error(`Authentication error: ${decodeURIComponent(errorMsg)}`);
          navigate('/login');
          return;
        }
        
        if (!token) {
          setError('No authentication token received');
          toast.error('Failed to authenticate with Google: No token received');
          navigate('/login');
          return;
        }

        // Validate token with backend
        try {
          const response = await axios.get(`${API_URL}/auth/validate`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Store the token
          localStorage.setItem('token', token);
          setToken(token);
          
          // Store user data
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          
          // Show success message
          toast.success('Successfully signed in with Google!');
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (validationError) {
          console.error('Token validation error:', validationError);
          setError('Token validation failed');
          toast.error('Authentication failed: Invalid or expired token');
          navigate('/login');
        }
      } catch (e) {
        console.error('OAuth callback error:', e);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred during authentication');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    validateAndSetToken();
  }, [searchParams, navigate, setToken, setUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Authentication Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default OAuth2Callback; 