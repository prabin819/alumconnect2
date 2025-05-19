import { api } from '../api';

export const studentService = {
  getStudentProfile: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  updateStudentProfile: async (id, profileData) => {
    const response = await api.put(`/students/${id}`, profileData);
    return response.data;
  },

  searchStudents: async (params) => {
    const response = await api.get('/students/search', { params });
    return response.data;
  },

  getStudentsByDepartment: async (department) => {
    const response = await api.get(`/students/department/${department}`);
    return response.data;
  },

  getStudentsByYear: async (year) => {
    const response = await api.get(`/students/year/${year}`);
    return response.data;
  },

  requestMentorship: async (mentorshipData) => {
    const response = await api.post('/mentorship-requests', mentorshipData);
    return response.data;
  },

  getMentorshipRequests: async (params) => {
    const response = await api.get('/mentorship-requests', { params });
    return response.data;
  },

  updateMentorshipRequest: async (id, status) => {
    const response = await api.put(`/mentorship-requests/${id}/status`, { status });
    return response.data;
  },
};
