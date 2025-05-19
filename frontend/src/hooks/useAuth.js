// src/hooks/useAuth.js
import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { useApiPost } from '../api';

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoading: isLoginLoading, error: loginError, post: loginRequest } = useApiPost();

  const {
    isLoading: isRegisterLoading,
    error: registerError,
    post: registerRequest,
  } = useApiPost();

  const login = useCallback(
    async (email, password) => {
      try {
        const data = await loginRequest('/auth/login', { email, password });
        if (data.token) {
          localStorage.setItem('token', data.token);
          setUser(data.user);
          return data;
        }
      } catch (err) {
        console.error('Login failed:', err);
        throw err;
      }
    },
    [loginRequest, setUser]
  );

  const register = useCallback(
    async (userData) => {
      try {
        const data = await registerRequest('/auth/register', userData);
        return data;
      } catch (err) {
        console.error('Registration failed:', err);
        throw err;
      }
    },
    [registerRequest]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate, setUser]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      return true;
    }
    return false;
  }, [setUser]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    isLoginLoading,
    loginError,
    isRegisterLoading,
    registerError,
    checkAuthStatus,
  };
};
