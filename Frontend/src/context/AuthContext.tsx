import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

// Basic User (Patient)
interface BaseUser {
  id: number; // Changed to number based on typical DB IDs
  email: string;
  firstName: string;
  lastName: string;
  roles: string[]; // Added roles
  imageUrl?: string;
  createdAt?: string; // Assuming ISO string format
}

// Pharmacy Staff User (Extends BaseUser or uses details from PharmacyStaffDto)
// Based on PharmacyStaffDto structure from backend edits
interface PharmacyStaffUser {
  id: number; // Staff ID
  pharmacyId: number;
  userId: number; // Corresponds to the User entity ID
  role: string; // e.g., "ADMIN", "CASHIER"
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  // User details duplicated for convenience
  firstName: string;
  lastName: string;
  email: string;
}

// Union type for the currently logged-in user
type CurrentUser = BaseUser | PharmacyStaffUser;

// Helper type guard
export function isPharmacyStaffUser(user: CurrentUser | null): user is PharmacyStaffUser {
  return user !== null && 'pharmacyId' in user;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  token: string | null;
  loading: boolean;
  setCurrentUser: (user: CurrentUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [token, setAuthStateToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define setToken which updates state and localStorage
  const setToken = useCallback((newToken: string | null) => {
    setAuthStateToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        setCurrentUser(null); // Ensure user is null if no token
        return;
      }

      setLoading(true); // Ensure loading is true while validating
      try {
        console.log('Validating token...');
        const response = await fetch(`${API_URL}/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData: BaseUser = await response.json(); // Backend returns UserDto here
          console.log('Token valid, user data:', userData);
          // Here, we only get BaseUser data from /validate.
          // We cannot distinguish fully between BaseUser and PharmacyStaffUser without another call
          // or modifying the /validate endpoint.
          // For now, we set the BaseUser data.
          // Components might need to check roles to infer type if needed immediately after load.
          // Login flow will set the more specific PharmacyStaffUser type.
          setCurrentUser(userData); 
        } else {
          console.log('Token validation failed:', response.status);
          setToken(null); // Clear invalid token
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setToken(null); // Clear token on error
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  // Depend on `token` so validation runs if it changes (e.g., on login/logout)
  // Also depend on `setToken` to avoid stale closure issues (though likely stable)
  }, [token, setToken]); 

  const logout = useCallback(() => {
    console.log('Logging out...');
    setCurrentUser(null);
    setToken(null);
    // Redirect to a relevant login page, perhaps based on previous user type?
    // For simplicity, redirecting to the main login page.
    navigate('/login');
  }, [setToken, navigate]);

  const value = {
    currentUser,
    token,
    loading,
    setCurrentUser,
    setToken,
    logout
  };

  // Render children only when loading is finished to prevent flicker
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null /* Or a global loading spinner */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
