import { create } from 'zustand';
import api from '../api/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  init: async () => {
    try {
      console.log('[AuthStore] Checking session');
      const response = await api.get('/api/user');
      console.log('[AuthStore] Session active, user:', response.data);
      set({ user: response.data, isAuthenticated: true });
      return response.data;
    } catch (error) {
      console.log('[AuthStore] No active session:', error.response?.status, error.response?.data);
      set({ user: null, isAuthenticated: false });
      return null;
    }
  },
  login: async (email, password) => {
    try {
      console.log('[AuthStore] Logging in:', { email });
      const response = await api.post('/api/login', { email, password });
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
      console.log('[AuthStore] Logging out');
      const response = await api.post('/api/logout', {});
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