// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useCurrentUser, useLogin, useLogout, useRefreshToken } from '../services';

// // Create context
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { getCurrentUser } = useCurrentUser();
//   const { refreshAccessToken } = useRefreshToken();
//   const { logout } = useLogout();

//   // Load user on initial mount
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const userData = await getCurrentUser();
//         setUser(userData);
//       } catch (err) {
//         console.error('Failed to load user:', err);
//         setError(err);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   // Refresh token function that can be called when needed
//   const refreshToken = useCallback(async () => {
//     try {
//       const result = await refreshAccessToken();
//       return result;
//     } catch (err) {
//       console.error('Token refresh failed:', err);
//       setUser(null);
//       throw err;
//     }
//   }, [refreshAccessToken]);

//   // Handle user login
//   const loginUser = useCallback(async (userData) => {
//     setUser(userData);
//   }, []);

//   // Handle user logout
//   const logoutUser = useCallback(async () => {
//     try {
//       await logout();
//       setUser(null);
//     } catch (err) {
//       console.error('Logout failed:', err);
//       throw err;
//     }
//   }, [logout]);

//   // Update user information
//   const updateUser = useCallback((userData) => {
//     setUser((prevUser) => ({ ...prevUser, ...userData }));
//   }, []);

//   // Context value
//   const contextValue = {
//     user,
//     isAuthenticated: !!user,
//     loading,
//     error,
//     loginUser,
//     logoutUser,
//     refreshToken,
//     updateUser,
//   };

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // Save tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Set user data
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      // Save tokens if registration also logs the user in
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
