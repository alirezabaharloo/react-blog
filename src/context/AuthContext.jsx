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

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/get-access-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, error: data.error }
      }
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify({access: data.access, refresh: data.refresh}));
      setTokens({access: data.access, refresh: data.refresh});
      
      // Set user username in the localStorage
      localStorage.setItem('user', JSON.stringify({username: data.username}));
      setUser({username: data.username});
      
      setIsAuthenticated(true);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' };
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
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, error: data }
      }
            
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' };
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


  const refreshToken = async () => {
    const res = await fetch('http://localhost:8000/api/auth/get-refresh-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      },
    });
    
    const data = await res.json();
    return data;
  }


  const getAuthHeader = () => {
    return {
      'Authorization': `Bearer ${tokens.access}`
    };
  }


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