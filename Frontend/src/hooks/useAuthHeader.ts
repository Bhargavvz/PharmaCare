import { useAuth } from '../context/AuthContext';

export const useAuthHeader = () => {
  const { token } = useAuth();
  
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
};
