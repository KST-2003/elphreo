import { create } from "zustand";

const useStore = create((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  scrollPosition: 0,
  setScrollPosition: (position) => set({ scrollPosition: position }),
}));

export default useStore;