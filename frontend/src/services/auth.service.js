/*

import { api } from '../api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  registerAlumni: async (userData) => {
    const response = await api.post('/api/v1/auth/signup/alumni', userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  registerStudent: async (userData) => {
    const response = await api.post('/api/v1/auth/signup/alumni', userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async (userData) => {
    const response = await api.post('/api/v1/auth/logout', userData);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email) => {
    const response = await api.post('/api/v1/auth/forgotPassword', { email });
    return response.data;
  },

  resetPassword: async (accessToken, newPassword) => {
    const response = await api.post('/api/auth/v1/reset-password', { accessToken, newPassword });
    return response.data;
  },

  verifyEmail: async (accessToken) => {
    const response = await api.get('/auth/verify-email', token, { accessToken });
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getToken: () => {
    return localStorage.getItem('accessToken');
  },
};

*/

// src/services/authService.js
import { useApiPost, useApiGet, useApiPut, useApiDelete } from '@/api/hooks/useApiMethods';

/**
 * Hook for alumni signup functionality
 */
export const useAlumniSignup = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const signupAlumni = async (userData) => {
    try {
      return await post('/api/v1/signup/alumni', userData);
    } catch (err) {
      console.error('Alumni signup failed:', err);
      throw err;
    }
  };

  return { signupAlumni, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for student signup functionality
 */
export const useStudentSignup = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const signupStudent = async (userData) => {
    try {
      return await post('/api/v1/signup/student', userData);
    } catch (err) {
      console.error('Student signup failed:', err);
      throw err;
    }
  };

  return { signupStudent, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for user login functionality
 */
export const useLogin = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const login = async (credentials) => {
    try {
      return await post('/api/v1/login', credentials, { withCredentials: true });
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  return { login, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for user logout functionality
 */
export const useLogout = () => {
  const { post, isLoading, error, isSuccess } = useApiPost();

  const logout = async () => {
    try {
      return await post('/api/v1/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    }
  };

  return { logout, isLoading, error, isSuccess };
};

/**
 * Hook for retrieving current user information
 */
export const useCurrentUser = () => {
  const { get, isLoading, error, data, isSuccess, reset } = useApiGet();

  const getCurrentUser = async () => {
    try {
      return await get('/api/v1/me', {}, { withCredentials: true });
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      throw err;
    }
  };

  return { getCurrentUser, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for refreshing access token
 */
export const useRefreshToken = () => {
  const { post, isLoading, error, data, isSuccess } = useApiPost();

  const refreshAccessToken = async () => {
    try {
      return await post('/api/v1/refreshAccessToken', {}, { withCredentials: true });
    } catch (err) {
      console.error('Token refresh failed:', err);
      throw err;
    }
  };

  return { refreshAccessToken, isLoading, error, data, isSuccess };
};

/**
 * Hook for changing current password
 */
export const useChangePassword = () => {
  const { put, isLoading, error, isSuccess, reset } = useApiPut();

  const changePassword = async (passwordData) => {
    try {
      return await put('/api/v1/changeCurrentPassword', passwordData, { withCredentials: true });
    } catch (err) {
      console.error('Password change failed:', err);
      throw err;
    }
  };

  return { changePassword, isLoading, error, isSuccess, reset };
};

/**
 * Hook for updating alumni account
 */
export const useUpdateAlumniAccount = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const updateAccount = async (accountData) => {
    // Handle FormData for multipart/form-data (for profile picture)
    const isFormData = accountData instanceof FormData;

    // If not already FormData and has profile picture, convert to FormData
    const formData = isFormData ? accountData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(accountData).forEach((key) => {
        if (key === 'profilePicture' && accountData[key] instanceof File) {
          formData.append(key, accountData[key]);
        } else if (key !== 'profilePicture') {
          formData.append(key, accountData[key]);
        }
      });
    }

    try {
      return await put('/api/v1/updateAlumniAccount', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Alumni account update failed:', err);
      throw err;
    }
  };

  return { updateAccount, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for updating student account
 */
export const useUpdateStudentAccount = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const updateAccount = async (accountData) => {
    // Handle FormData for multipart/form-data (for profile picture)
    const isFormData = accountData instanceof FormData;

    // If not already FormData and has profile picture, convert to FormData
    const formData = isFormData ? accountData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(accountData).forEach((key) => {
        if (key === 'profilePicture' && accountData[key] instanceof File) {
          formData.append(key, accountData[key]);
        } else if (key !== 'profilePicture') {
          formData.append(key, accountData[key]);
        }
      });
    }

    try {
      return await put('/api/v1/updateStudentAccount', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Student account update failed:', err);
      throw err;
    }
  };

  return { updateAccount, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for changing profile picture
 */
export const useChangeProfilePicture = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const changeProfilePic = async (pictureFile) => {
    const formData = new FormData();
    formData.append('profilePicture', pictureFile);

    try {
      return await put('/api/v1/changeProfilePic', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Profile picture change failed:', err);
      throw err;
    }
  };

  return { changeProfilePic, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for deleting profile picture
 */
export const useDeleteProfilePicture = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteProfilePic = async () => {
    try {
      return await del('/api/v1/deleteProfilePic', { withCredentials: true });
    } catch (err) {
      console.error('Profile picture deletion failed:', err);
      throw err;
    }
  };

  return { deleteProfilePic, isLoading, error, isSuccess };
};

/**
 * Hook for deleting user account
 */
export const useDeleteUser = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteUser = async (userId) => {
    try {
      return await del(`/api/v1/deleteUser/${userId}`, { withCredentials: true });
    } catch (err) {
      console.error('User deletion failed:', err);
      throw err;
    }
  };

  return { deleteUser, isLoading, error, isSuccess };
};

/**
 * Hook for forgot password functionality
 */
export const useForgotPassword = () => {
  const { post, isLoading, error, isSuccess, reset } = useApiPost();

  const forgotPassword = async (email) => {
    try {
      return await post('/api/v1/forgotPassword', { email });
    } catch (err) {
      console.error('Forgot password request failed:', err);
      throw err;
    }
  };

  return { forgotPassword, isLoading, error, isSuccess, reset };
};

/**
 * Hook for reset password functionality
 */
export const useResetPassword = () => {
  const { post, isLoading, error, isSuccess, reset } = useApiPost();

  const resetPassword = async (resetToken, passwordData) => {
    try {
      return await post(`/api/v1/resetpassword/${resetToken}`, passwordData);
    } catch (err) {
      console.error('Password reset failed:', err);
      throw err;
    }
  };

  return { resetPassword, isLoading, error, isSuccess, reset };
};

/**
 * Hook for email verification
 */
export const useVerifyEmail = () => {
  const { get, isLoading, error, data, isSuccess } = useApiGet();

  const verifyEmail = async (token) => {
    try {
      return await get(`/api/v1/verify-email/${token}`);
    } catch (err) {
      console.error('Email verification failed:', err);
      throw err;
    }
  };

  return { verifyEmail, isLoading, error, data, isSuccess };
};

/**
 * Hook for resending verification email
 */
export const useResendVerificationEmail = () => {
  const { post, isLoading, error, isSuccess } = useApiPost();

  const resendVerificationEmail = async () => {
    try {
      return await post('/api/v1/resend-verification-email', {}, { withCredentials: true });
    } catch (err) {
      console.error('Resend verification email failed:', err);
      throw err;
    }
  };

  return { resendVerificationEmail, isLoading, error, isSuccess };
};
