import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens');
    if (storedTokens) {
      try {
        const accessToken = JSON.parse(storedTokens).access;
        const decodedToken = accessToken ? jwtDecode(accessToken) : null;
        setIsAuthenticated(!!decodedToken?.user_id);
      } catch (error) {
        console.error('Error parsing tokens:', error);
        localStorage.removeItem('tokens');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      try {
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens || !isAuthenticated) {
          if (isMounted) setIsAdmin(false);
          return;
        }

        const accessToken = JSON.parse(storedTokens).access;
        const response = await fetch('http://localhost:8000/api/admin/admin-access/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!isMounted) return;

        if (response.status === 403) {
          setIsAdmin(false);
        } else if (response.ok) {
          setIsAdmin(true);
        } else {
          console.error('Failed to check admin access');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        if (isMounted) setIsAdmin(false);
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);


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

  const logout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const refreshToken = async () => {
    try {
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error('No tokens found');
      }

      const accessToken = JSON.parse(storedTokens).access;
      const res = await fetch('http://localhost:8000/api/auth/get-refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      refreshToken,
      isAuthenticated,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 