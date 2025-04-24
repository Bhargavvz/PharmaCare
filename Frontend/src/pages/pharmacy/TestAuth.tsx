import React, { useState, useEffect } from 'react';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { toast } from 'react-hot-toast';

const TestAuth: React.FC = () => {
  const { currentUser, token, loading } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [mineEndpointResponse, setMineEndpointResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      const tokenData = localStorage.getItem('token');
      setLocalStorageData({
        userData: userData ? JSON.parse(userData) : null,
        token: tokenData,
      });
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      setLocalStorageData({ error: 'Failed to parse localStorage data' });
    }
  }, []);

  const testValidate = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        toast.error('No token found in localStorage');
        return;
      }

      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setApiResponse(data);
      toast.success('Validation API call completed');
    } catch (error) {
      console.error('Error calling validate endpoint:', error);
      setApiResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
      toast.error('Failed to validate token');
    } finally {
      setIsLoading(false);
    }
  };

  const testMineEndpoint = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        toast.error('No token found in localStorage');
        return;
      }

      const response = await fetch(`${API_URL}/pharmacies/mine`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setMineEndpointResponse(data);
      toast.success('Mine endpoint call completed');
    } catch (error) {
      console.error('Error calling mine endpoint:', error);
      setMineEndpointResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
      toast.error('Failed to fetch pharmacies');
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  if (loading) {
    return <div className="p-4">Loading authentication state...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Diagnostic Tool</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Authentication State</h2>
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={testValidate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Validate Endpoint
          </button>
          <button 
            onClick={testMineEndpoint}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Mine Endpoint
          </button>
          <button 
            onClick={clearStorage}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Storage & Reload
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">AuthContext State:</h3>
            <div>
              <p>Is Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Has Token: {token ? 'Yes' : 'No'}</p>
              <p>Is Pharmacy Staff: {isPharmacyStaffUser(currentUser) ? 'Yes' : 'No'}</p>
            </div>
            <pre className="bg-gray-200 p-2 mt-2 overflow-auto max-h-60 text-xs">{formatJson(currentUser)}</pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">localStorage Data:</h3>
            <pre className="bg-gray-200 p-2 overflow-auto max-h-60 text-xs">{formatJson(localStorageData)}</pre>
          </div>
        </div>
      </div>
      
      {apiResponse && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Validate Endpoint Response</h2>
          <pre className="bg-gray-200 p-2 overflow-auto max-h-60 text-xs">{formatJson(apiResponse)}</pre>
        </div>
      )}
      
      {mineEndpointResponse && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Mine Endpoint Response</h2>
          <pre className="bg-gray-200 p-2 overflow-auto max-h-60 text-xs">{formatJson(mineEndpointResponse)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAuth; 