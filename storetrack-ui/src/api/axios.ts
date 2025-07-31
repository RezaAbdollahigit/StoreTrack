// src/api/axios.ts
import axios from 'axios';

// Use environment variables for the base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// TODO: Add interceptors later for auth tokens
// apiClient.interceptors.request.use(...)

export default apiClient;