// src/contexts/PaginationContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context for pagination
const PaginationContext = createContext();

export const PaginationProvider = ({ children, initialPage = 1, initialLimit = 10 }) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // Go to specific page
  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setPage(pageNumber);
      }
    },
    [totalPages]
  );

  // Go to next page
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  // Go to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  // Change items per page
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    // Reset to first page when changing limit
    setPage(1);
  }, []);

  // Set total items (usually from API response)
  const setTotal = useCallback((total) => {
    setTotalItems(total);
  }, []);

  // Reset pagination
  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotalItems(0);
  }, [initialPage, initialLimit]);

  // Context value
  const contextValue = {
    page,
    limit,
    totalItems,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    setTotal,
    reset,
    // Pagination params ready to use in API requests
    paginationParams: {
      page,
      limit,
    },
  };

  return <PaginationContext.Provider value={contextValue}>{children}</PaginationContext.Provider>;
};

// Custom hook to use the pagination context
export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};

export default PaginationContext;
