

// export const baseURL = "http://192.168.1.34/api";
// export const baseURL = 'http://localhost:8000:8000';

// export const baseURL = 'http://localhost:8000';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.34:8000', // Laravel backend
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatically add X-XSRF-TOKEN for POST, PUT, DELETE requests
api.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
      await api.get('/sanctum/csrf-cookie'); // Fetch CSRF cookie
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      } else {
        console.warn('[API] XSRF-TOKEN cookie not found');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;