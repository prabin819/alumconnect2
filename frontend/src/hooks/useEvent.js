// src/hooks/useEvents.js
import { useCallback } from 'react';
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '../api';

export const useEvents = () => {
  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
    get: fetchEvents,
  } = useApiGet([]);

  const {
    data: eventDetails,
    isLoading: isEventDetailsLoading,
    error: eventDetailsError,
    get: fetchEventDetails,
  } = useApiGet(null);

  const { isLoading: isCreatingEvent, error: createEventError, post: createEvent } = useApiPost();

  const { isLoading: isUpdatingEvent, error: updateEventError, put: updateEvent } = useApiPut();

  const { isLoading: isDeletingEvent, error: deleteEventError, del: deleteEvent } = useApiDelete();

  const {
    isLoading: isRegisteringForEvent,
    error: registerEventError,
    post: registerForEvent,
  } = useApiPost();

  const getEvents = useCallback(
    (params) => {
      return fetchEvents('/events', params);
    },
    [fetchEvents]
  );

  const getEventById = useCallback(
    (id) => {
      return fetchEventDetails(`/events/${id}`);
    },
    [fetchEventDetails]
  );

  const createNewEvent = useCallback(
    (eventData) => {
      return createEvent('/events', eventData);
    },
    [createEvent]
  );

  const updateExistingEvent = useCallback(
    (id, eventData) => {
      return updateEvent(`/events/${id}`, eventData);
    },
    [updateEvent]
  );

  const deleteExistingEvent = useCallback(
    (id) => {
      return deleteEvent(`/events/${id}`);
    },
    [deleteEvent]
  );

  const registerForEventById = useCallback(
    (eventId) => {
      return registerForEvent(`/events/${eventId}/register`);
    },
    [registerForEvent]
  );

  return {
    events,
    isEventsLoading,
    eventsError,
    getEvents,

    eventDetails,
    isEventDetailsLoading,
    eventDetailsError,
    getEventById,

    createNewEvent,
    isCreatingEvent,
    createEventError,

    updateExistingEvent,
    isUpdatingEvent,
    updateEventError,

    deleteExistingEvent,
    isDeletingEvent,
    deleteEventError,

    registerForEventById,
    isRegisteringForEvent,
    registerEventError,
  };
};
