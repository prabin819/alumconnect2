// Request/response interceptors
export const setupInterceptors = (api) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth tokens
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle global errors
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        console.log('Unauthorized - redirecting to login');
        // logout() or refreshToken() implementation
      }

      return Promise.reject(error);
    }
  );
};
