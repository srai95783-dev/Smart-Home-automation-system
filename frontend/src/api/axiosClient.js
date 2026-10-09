import axios from 'axios';

/**
 * Centralized Axios instance configured for communicating with
 * the Java Spring Boot Backend.
 * 
 * - Base URL: http://localhost:8080/api
 * - Request Interceptor: Automatically injects JWT Bearer Token into headers
 * - Response Interceptor: Handles 401 Unauthorized errors gracefully
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized / Token Expiry
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Unwraps ApiResponse from Spring Boot directly
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default axiosClient;
