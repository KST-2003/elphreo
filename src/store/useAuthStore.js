import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: null,

  setToken: (token) => {
    set({ token });
    localStorage.setItem("token", token);
  },

  clearToken: () => {
    set({ token: null, user: null });
    localStorage.removeItem("token");
  },

  setUser: (user) => set({ user }),

  // Computed property
  get isAuthenticated() {
    return !!get().token;
  },
}));

export default useAuthStore;
