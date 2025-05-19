// Core API hook
import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../client';
import { formatErrorMessage } from '../utils/errorHandler';

export const useApi = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const abortControllerRef = useRef(null);

  // Reset state function
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, [initialData]);

  // Cancel any ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Execute request function
  const execute = useCallback(
    async ({
      url,
      method = 'GET',
      body = null,
      params = {},
      headers = {},
      withCredentials = false,
      preventMultiple = true,
    }) => {
      // Cancel previous request if preventMultiple is true
      if (preventMultiple) {
        cancel();
      }

      // Create new AbortController
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Reset error state
      setError(null);
      setIsLoading(true);
      setIsSuccess(false);

      try {
        const response = await api({
          url,
          method,
          data: body,
          params,
          headers,
          signal,
          withCredentials,
        });

        setData(response.data);
        setIsSuccess(true);
        return response.data;
      } catch (err) {
        // Don't update state if request was aborted
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log('Request aborted:', url);
          return;
        }

        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw formattedError; // Allow caller to catch the error as well
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      }
    },
    [cancel]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    execute,
    reset,
    cancel,
    // Additional state getters
    isIdle: !isLoading && !isSuccess && !error,
    isError: !!error,
  };
};
