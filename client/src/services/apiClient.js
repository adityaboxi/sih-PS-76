import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin + '/api' : 'http://localhost:3000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const requestCache = new Map();

export const cachedGet = async (url, ttlMs = 30000) => {
  const cached = requestCache.get(url);
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }
  try {
    const res = await apiClient.get(url);
    requestCache.set(url, { data: res.data, timestamp: Date.now() });
    return res.data;
  } catch (err) {
    if (cached) return cached.data;
    throw err;
  }
};
