// Axios instance setup
import axios from 'axios';
import { setupInterceptors } from './interceptors';

const api = axios.create({
  // baseURL: 'https://api.example.com',
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors
setupInterceptors(api);

export default api;
