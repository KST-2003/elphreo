import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  role: null,
  posts: [],
  setUser: (userData) => set({ user: userData, role: userData?.role || null }),
  setPosts: (posts) => set({ posts }),
}));

export default useStore;