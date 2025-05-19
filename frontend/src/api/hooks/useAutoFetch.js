// Auto-fetching hook
import { useEffect } from 'react';
import { useApiGet } from './useApiMethods';

export const useAutoFetch = (url, options = {}) => {
  const {
    params = {},
    initialData = null,
    enabled = true,
    dependencies = [],
    onSuccess = null,
    onError = null,
  } = options;

  const api = useApiGet(initialData);

  useEffect(() => {
    if (!enabled || !url) return;

    const fetchData = async () => {
      try {
        const data = await api.get(url, params);
        if (onSuccess) onSuccess(data);
      } catch (error) {
        if (onError) onError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, ...dependencies]);

  return api;
};
