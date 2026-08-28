import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Client Warning]:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);
