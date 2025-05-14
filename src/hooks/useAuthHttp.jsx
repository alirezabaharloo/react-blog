import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

const useAuthHttp = (url, options = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorMessage: ""
  });
  const [data, setData] = useState(null);
  const { tokens, refreshToken, logout, getAuthHeader } = useAuth();
  
  const customFetchFunction = async (url, options = {}) => {
    try {
      // Add authorization header if tokens exist
      if (tokens) {
        options.headers = {
          ...options.headers,
          ...getAuthHeader()
        };
      }
      
      const res = await fetch(url, options);
      
      // Handle 401 Unauthorized - Try to refresh token
      if (res.status === 401) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          // Retry the request with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`
          };
          const retryRes = await fetch(url, options);
          
          if (!retryRes.ok) {
            const errorData = await retryRes.json();
            throw new Error(errorData.detail || 'Failed to fetch data');
          }
          
          return await retryRes.json();
        } else {
          // If refresh token is invalid, logout user
          logout();
          throw new Error('Your session has expired. Please login again.');
        }
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = typeof errorData === 'object' 
          ? Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join('\n')
          : errorData.toString();
        throw new Error(errorMessage);
      }
      
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const sendRequest = useCallback(async (requestData = null) => {
    setIsLoading(true);
    setError({
      isError: false,
      errorMessage: ""
    });
    
    try {
      let responseData;
      
      if (requestData) {
        responseData = await customFetchFunction(url, {
          ...options,
          body: JSON.stringify(requestData)
        });
      } else {
        responseData = await customFetchFunction(url, options);
      }
      
      setData(responseData);
      return responseData;
    } catch (error) {
      setError({
        isError: true,
        errorMessage: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [url, options, tokens]);

  return {
    isLoading,
    isError: error.isError,
    data,
    sendRequest,
    errorMessage: error.errorMessage
  };
};

export default useAuthHttp; 