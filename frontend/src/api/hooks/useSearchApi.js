// Search with debouncing
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApiGet } from './useApiMethods';

export const useSearchApi = (initialData = null, debounceMs = 300) => {
  const api = useApiGet(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Store the timeout ID
  const debounceTimerRef = useRef(null);

  // Update searchTerm immediately but debounce the API call
  const updateSearchTerm = useCallback(
    (term) => {
      setSearchTerm(term);

      // Clear existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timeout
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearchTerm(term);
      }, debounceMs);
    },
    [debounceMs]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...api,
    searchTerm,
    debouncedSearchTerm,
    updateSearchTerm,
  };
};
