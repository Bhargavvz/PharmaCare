import { AxiosError } from 'axios';

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Handle Axios errors with the new response format
    const errorData = error.response?.data;
    
    if (errorData?.message) {
      return errorData.message;
    }
    
    if (errorData?.error) {
      return errorData.error;
    }

    // Fallback status code messages
    switch (error.response?.status) {
      case 401:
        return 'Invalid credentials';
      case 409:
        return 'Email already exists';
      case 400:
        return 'Invalid input data';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An error occurred during authentication';
    }
  }
  
  // Handle other types of errors
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleAuthError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    console.error('Authentication error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  } else {
    console.error('Authentication error:', error);
  }
};
