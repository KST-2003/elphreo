// useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: null,

  setToken: (token) => {
    console.log('Setting token:', token); // Debug log
    localStorage.setItem("token", token);
    set({ token });
  },

  clearToken: () => {
    console.log('Clearing token'); // Debug log
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  setUser: (user) => {
    console.log('Setting user:', user); // Debug log
    set({ user });
  },

  get isAuthenticated() {
    const token = get().token;
    console.log('Checking isAuthenticated, token:', token); // Debug log
    return !!token;
  },
}));

export default useAuthStore;