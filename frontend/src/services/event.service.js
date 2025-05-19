// src/services/eventService.js
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '../hooks/useApiMethods';
import { useAutoFetch } from '../hooks/useAutoFetch';

/**
 * Hook for fetching all events
 */
export const useEvents = (options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch('/api/v1/events', {
    initialData,
    enabled,
    dependencies,
  });
};

/**
 * Hook for fetching a single event by ID
 */
export const useEvent = (eventId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(eventId ? `/api/v1/events/${eventId}` : null, {
    initialData,
    enabled: enabled && !!eventId,
    dependencies: [eventId, ...dependencies],
  });
};

/**
 * Hook for fetching events by user ID
 */
export const useUserEvents = (userId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(userId ? `/api/v1/events/user/${userId}` : null, {
    initialData,
    enabled: enabled && !!userId,
    dependencies: [userId, ...dependencies],
  });
};

/**
 * Hook for creating a new event
 */
export const useCreateEvent = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const createEvent = async (eventData) => {
    // Handle FormData for multipart/form-data (for event image)
    const isFormData = eventData instanceof FormData;

    // If not already FormData and has image, convert to FormData
    const formData = isFormData ? eventData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(eventData).forEach((key) => {
        if (key === 'imageUrl' && eventData[key] instanceof File) {
          formData.append(key, eventData[key]);
        } else if (key !== 'imageUrl' || eventData[key] !== null) {
          // Only append if the value is not null
          if (typeof eventData[key] === 'object' && !(eventData[key] instanceof File)) {
            formData.append(key, JSON.stringify(eventData[key]));
          } else {
            formData.append(key, eventData[key]);
          }
        }
      });
    }

    try {
      return await post('/api/v1/events', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Event creation failed:', err);
      throw err;
    }
  };

  return { createEvent, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for updating an event
 */
export const useUpdateEvent = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const updateEvent = async (eventId, eventData) => {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    // Handle FormData for multipart/form-data (for event image)
    const isFormData = eventData instanceof FormData;

    // If not already FormData and has image, convert to FormData
    const formData = isFormData ? eventData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(eventData).forEach((key) => {
        if (key === 'imageUrl' && eventData[key] instanceof File) {
          formData.append(key, eventData[key]);
        } else if (key !== 'imageUrl' || eventData[key] !== null) {
          // Only append if the value is not null
          if (typeof eventData[key] === 'object' && !(eventData[key] instanceof File)) {
            formData.append(key, JSON.stringify(eventData[key]));
          } else {
            formData.append(key, eventData[key]);
          }
        }
      });
    }

    try {
      return await put(`/api/v1/events/${eventId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Event update failed:', err);
      throw err;
    }
  };

  return { updateEvent, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for deleting an event
 */
export const useDeleteEvent = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteEvent = async (eventId) => {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      return await del(`/api/v1/events/${eventId}`, { withCredentials: true });
    } catch (err) {
      console.error('Event deletion failed:', err);
      throw err;
    }
  };

  return { deleteEvent, isLoading, error, isSuccess };
};

/**
 * Hook for booking an event
 */
export const useBookEvent = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const bookEvent = async (eventId) => {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      return await post(`/api/v1/events/${eventId}/book`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Event booking failed:', err);
      throw err;
    }
  };

  return { bookEvent, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for canceling an event registration
 */
export const useCancelEventRegistration = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const cancelRegistration = async (eventId) => {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      return await del(`/api/v1/events/${eventId}/cancel`, { withCredentials: true });
    } catch (err) {
      console.error('Event registration cancellation failed:', err);
      throw err;
    }
  };

  return { cancelRegistration, isLoading, error, isSuccess };
};
