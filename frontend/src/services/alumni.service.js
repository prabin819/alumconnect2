import { api } from '../api';

export const alumniService = {
  getAlumniProfile: async (id) => {
    const response = await api.get(`/alumni/${id}`);
    return response.data;
  },

  updateAlumniProfile: async (id, profileData) => {
    const response = await api.put(`/alumni/${id}`, profileData);
    return response.data;
  },

  searchAlumni: async (params) => {
    const response = await api.get('/alumni/search', { params });
    return response.data;
  },

  getAlumniByIndustry: async (industry) => {
    const response = await api.get(`/alumni/industry/${industry}`);
    return response.data;
  },

  getAlumniByYear: async (year) => {
    const response = await api.get(`/alumni/year/${year}`);
    return response.data;
  },

  createJobPosting: async (jobData) => {
    const response = await api.post('/job-postings', jobData);
    return response.data;
  },

  getJobPostings: async (params) => {
    const response = await api.get('/job-postings', { params });
    return response.data;
  },

  updateJobPosting: async (id, jobData) => {
    const response = await api.put(`/job-postings/${id}`, jobData);
    return response.data;
  },

  deleteJobPosting: async (id) => {
    const response = await api.delete(`/job-postings/${id}`);
    return response.data;
  },
};
