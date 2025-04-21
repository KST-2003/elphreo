import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Update to 'http://172.20.10.18:8000' for Capacitor
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  init: async () => {
    try {
      console.log('[AuthStore] Checking session');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/user', { headers });
      console.log('[AuthStore] Session active, user:', response.data);
      set({ user: response.data, isAuthenticated: true });
      return response.data;
    } catch (error) {
      console.log('[AuthStore] No active session:', error.response?.status);
      set({ user: null, isAuthenticated: false });
      return null;
    }
  },
  login: async (email, password) => {
    try {
      console.log('[AuthStore] Fetching CSRF cookie for login');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.post('/api/login', { email, password }, { headers });
      console.log('[AuthStore] Login response:', response.data);
      const user = response.data.user || response.data;
      set({ user, isAuthenticated: true });
      return response.data;
    } catch (error) {
      console.error('[AuthStore] Login failed:', error.response?.data?.message, error.response?.status);
      throw error;
    }
  },
  logout: async () => {
    try {
      console.log('[AuthStore] Fetching CSRF cookie for logout');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.post('/api/logout', {}, { headers });
      console.log('[AuthStore] Logout successful:', response.data);
      set({ user: null, isAuthenticated: false });
      return response.data;
    } catch (error) {
      console.error('[AuthStore] Logout failed:', error.response?.data?.message, error.response?.status);
      throw error;
    }
  },
}));

export default useAuthStore;