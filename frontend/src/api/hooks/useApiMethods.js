// Specialized hooks for HTTP methods
import { useCallback } from 'react';
import { useApi } from './useApi';

// Hook for GET requests
export const useApiGet = (initialData = null) => {
  const api = useApi(initialData);

  const get = useCallback(
    (url, params = {}, options = {}) => {
      return api.execute({ url, method: 'GET', params, ...options });
    },
    [api]
  );

  return { ...api, get };
};

// Hook for POST requests
export const useApiPost = (initialData = null) => {
  const api = useApi(initialData);

  const post = useCallback(
    (url, body = {}, options = {}) => {
      return api.execute({ url, method: 'POST', body, ...options });
    },
    [api]
  );

  return { ...api, post };
};

// Hook for PUT requests
export const useApiPut = (initialData = null) => {
  const api = useApi(initialData);

  const put = useCallback(
    (url, body = {}, options = {}) => {
      return api.execute({ url, method: 'PUT', body, ...options });
    },
    [api]
  );

  return { ...api, put };
};

// Hook for DELETE requests
export const useApiDelete = (initialData = null) => {
  const api = useApi(initialData);

  const del = useCallback(
    (url, options = {}) => {
      return api.execute({ url, method: 'DELETE', ...options });
    },
    [api]
  );

  return { ...api, del };
};
