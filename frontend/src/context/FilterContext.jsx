// src/contexts/FilterContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context for filtering
const FilterContext = createContext();

export const FilterProvider = ({ children, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);

  // Add or update a single filter
  const setFilter = useCallback((key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

  // Add or update multiple filters at once
  const setMultipleFilters = useCallback((filterObject) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filterObject,
    }));
  }, []);

  // Remove a single filter
  const removeFilter = useCallback((key) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Check if a filter exists
  const hasFilter = useCallback(
    (key) => {
      return key in filters && filters[key] !== null && filters[key] !== undefined;
    },
    [filters]
  );

  // Get filter params object ready for API requests
  const getFilterParams = useCallback(() => {
    const params = {};

    // Only include filters with valid values
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        // Handle arrays (like for multi-select)
        if (Array.isArray(value) && value.length > 0) {
          params[key] = value.join(',');
        } else if (!Array.isArray(value) || value.length > 0) {
          params[key] = value;
        }
      }
    });

    return params;
  }, [filters]);

  // Context value
  const contextValue = {
    filters,
    setFilter,
    setMultipleFilters,
    removeFilter,
    clearFilters,
    hasFilter,
    getFilterParams,
    // For convenience, also provide a direct reference to the filter params
    filterParams: getFilterParams(),
  };

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
};

// Custom hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;
