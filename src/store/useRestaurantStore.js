import { create } from 'zustand';
import api from '../api/api'; // Use centralized Axios instance

const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  districts: [],
  subdistricts: [],
  categories: [],
  selectedDistrict: 'nearme',
  selectedSubdistrict: 'all',
  selectedCategory: 'all',
  loading: false,
  error: null,
  fetchInProgress: false,
  restaurantDetails: null,
  restaurantBookmarks: [],
  cachedRestaurantDetails: {},

  setSelectedDistrict: (district) => {
    set({ selectedDistrict: district, selectedSubdistrict: 'all' });
    if (district !== 'nearme' && district !== 'all') {
      get().fetchSubdistricts(district);
    }
  },

  setSelectedSubdistrict: (subdistrict) => set({ selectedSubdistrict: subdistrict }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setLocation: async (latitude, longitude) => {
    try {
      console.log('[RestaurantStore] Setting location:', { latitude, longitude });
      const response = await api.post('/api/restaurants/location', { latitude, longitude });
      console.log('[RestaurantStore] Location set:', response.data);
      return response.data;
    } catch (error) {
      console.error('[RestaurantStore] Error setting location:', error.response?.data || error.message);
      throw error;
    }
  },

  fetchRestaurants: async (district, subdistrict, category) => {
    const districtToUse = district || get().selectedDistrict;
    const subdistrictToUse = subdistrict || get().selectedSubdistrict;
    const categoryToUse = category || get().selectedCategory;

    if (get().fetchInProgress) {
      console.log('[RestaurantStore] Fetch already in progress, skipping');
      return;
    }

    set({ loading: true, error: null, fetchInProgress: true });
    try {
      console.log('[RestaurantStore] Fetching restaurants with params:', {
        district: districtToUse,
        subdistrict: subdistrictToUse,
        category: categoryToUse,
      });
      const response = await api.get('/api/restaurants/search', {
        params: {
          district: districtToUse,
          subdistrict: subdistrictToUse,
          category: categoryToUse,
        },
      });
      const restaurants = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      console.log('[RestaurantStore] Restaurants fetched:', restaurants);
      set({
        restaurants,
        loading: false,
        fetchInProgress: false,
      });
      return restaurants;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch restaurants';
      console.error('[RestaurantStore] Error fetching restaurants:', message, {
        status: error.response?.status,
        data: error.response?.data,
      });
      set({ error: message, loading: false, restaurants: [], fetchInProgress: false });
      throw error;
    }
  },

  fetchDistricts: async () => {
    try {
      console.log('[RestaurantStore] Fetching districts');
      const response = await api.get('/api/districts');
      const districts = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      console.log('[RestaurantStore] Districts fetched:', districts);
      set({ districts });
      return districts;
    } catch (error) {
      console.error('[RestaurantStore] Error fetching districts:', error.response?.data || error.message);
      set({ districts: [] });
      throw error;
    }
  },

  fetchSubdistricts: async (districtID) => {
    if (!districtID || districtID === 'nearme' || districtID === 'all') {
      set({ subdistricts: [] });
      return [];
    }

    try {
      console.log('[RestaurantStore] Fetching subdistricts for district:', districtID);
      const response = await api.get('/api/subdistricts', {
        params: { districtID },
      });
      const subdistricts = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      console.log('[RestaurantStore] Subdistricts fetched:', subdistricts);
      set({ subdistricts });
      return subdistricts;
    } catch (error) {
      console.error('[RestaurantStore] Error fetching subdistricts:', error.response?.data || error.message);
      set({ subdistricts: [] });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      console.log('[RestaurantStore] Fetching restaurant categories');
      const response = await api.get('/api/restaurant-categories');
      const categories = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      console.log('[RestaurantStore] Categories fetched:', categories);
      set({ categories });
      return categories;
    } catch (error) {
      console.error('[RestaurantStore] Error fetching categories:', error.response?.data || error.message);
      set({ categories: [] });
      throw error;
    }
  },

  fetchRestaurantDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      console.log('[RestaurantStore] Fetching restaurant details:', id);
      const response = await api.get(`/api/restaurants/${id}`);
      console.log('[RestaurantStore] Restaurant details fetched:', response.data);
      set((state) => ({
        restaurantDetails: response.data,
        cachedRestaurantDetails: { ...state.cachedRestaurantDetails, [id]: response.data },
        loading: false,
      }));
      return response.data;
    } catch (error) {
      console.error('[RestaurantStore] Error fetching restaurant details:', error.response?.data || error.message);
      set({ error: 'Failed to fetch restaurant details', loading: false });
      throw error;
    }
  },

  fetchBookmarks: async () => {
    set({ loading: true, error: null });
    try {
      console.log('[RestaurantStore] Fetching bookmarks');
      const response = await api.get('/api/bookmarks');
      const restaurantBookmarks = response.data.filter((bookmark) => bookmark.content_type === 'restaurant');
      console.log('[RestaurantStore] Bookmarks fetched:', restaurantBookmarks);
      set({ restaurantBookmarks, loading: false });
      return restaurantBookmarks;
    } catch (error) {
      console.error('[RestaurantStore] Error fetching bookmarks:', error.response?.data || error.message);
      set({ error: 'Failed to fetch bookmarks', loading: false, restaurantBookmarks: [] });
      throw error;
    }
  },

  bookmarkRestaurant: async (restaurantID) => {
    set({ loading: true, error: null });
    try {
      console.log('[RestaurantStore] Bookmarking restaurant:', restaurantID);
      const response = await api.post('/api/bookmarks', {
        content_type: 'restaurant',
        content_id: restaurantID,
      });
      console.log('[RestaurantStore] Bookmark added:', response.data);
      set((state) => ({
        restaurantBookmarks: [...state.restaurantBookmarks, response.data.bookmark],
        loading: false,
      }));
      return response.data.bookmark;
    } catch (error) {
      console.error('[RestaurantStore] Error bookmarking restaurant:', error.response?.data || error.message);
      set({ error: 'Failed to bookmark restaurant', loading: false });
      throw error;
    }
  },

  unbookmarkRestaurant: async (bookmarkId) => {
    set({ loading: true, error: null });
    try {
      console.log('[RestaurantStore] Unbookmarking restaurant, bookmark ID:', bookmarkId);
      await api.delete(`/api/bookmarks/${bookmarkId}`);
      console.log('[RestaurantStore] Bookmark removed:', bookmarkId);
      set((state) => ({
        restaurantBookmarks: state.restaurantBookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
        loading: false,
      }));
      return bookmarkId;
    } catch (error) {
      console.error('[RestaurantStore] Error unbookmarking restaurant:', error.response?.data || error.message);
      set({ error: 'Failed to unbookmark restaurant', loading: false });
      throw error;
    }
  },
}));

export default useRestaurantStore;