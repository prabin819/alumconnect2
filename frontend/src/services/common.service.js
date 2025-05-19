import { api } from '../api';

export const commonService = {
  uploadFile: async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getEvents: async (params) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getMessages: async (params) => {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
};
