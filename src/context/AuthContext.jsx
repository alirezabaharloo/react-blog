import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load tokens from localStorage on initial render
  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens');
    const storedUser = localStorage.getItem('user');
    
    if (storedTokens && storedUser) {
      setTokens(JSON.parse(storedTokens));
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Login user
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/get-access-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Invalid credentials. Please try again.';
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify(data));
      setTokens(data);
      
      // Get user info
      await fetchUserProfile(data.access);
      
      setIsAuthenticated(true);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = [];
        
        // Handle different error formats
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${value}`);
            }
          });
        } else {
          errorMessages.push(errorData.toString());
        }
        
        throw new Error(errorMessages.join('\n'));
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Fetch user profile
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Refresh token
  const refreshToken = async () => {
    if (!tokens || !tokens.refresh) {
      logout();
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/get-refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });
      
      if (!response.ok) {
        throw new Error('Unable to refresh token');
      }
      
      const data = await response.json();
      const updatedTokens = { ...tokens, access: data.access };
      
      localStorage.setItem('tokens', JSON.stringify(updatedTokens));
      setTokens(updatedTokens);
      
      return data.access;
    } catch (error) {
      logout();
      return null;
    }
  };

  // Get auth header
  const getAuthHeader = () => {
    return tokens ? { 'Authorization': `Bearer ${tokens.access}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      user,
      tokens,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      refreshToken,
      getAuthHeader,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 