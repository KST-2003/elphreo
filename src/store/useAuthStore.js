import { create } from "zustand";
import { Preferences } from "@capacitor/preferences";

const getTokenFromStorage = async () => {
  const { value } = await Preferences.get({ key: "token" });
  return value || null;
};

const setTokenInStorage = async (token) => {
  await Preferences.set({ key: "token", value: token });
};

const removeTokenFromStorage = async () => {
  await Preferences.remove({ key: "token" });
};

const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  init: async () => {
    const token = await getTokenFromStorage();
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },

  setToken: async (token) => {
    set({ token, isAuthenticated: !!token });
    await setTokenInStorage(token);
    console.log("setToken - New state:", token);
  },

  clearToken: async () => {
    set({ token: null, user: null, isAuthenticated: false });
    await removeTokenFromStorage();
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
