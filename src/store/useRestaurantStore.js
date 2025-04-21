import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.post('/api/restaurants/location', { latitude, longitude }, { headers });
      console.log('[RestaurantStore] Location set:', response.data);
    } catch (error) {
      console.error('[RestaurantStore] Error setting location:', error.response?.data || error.message);
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
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      console.log('[RestaurantStore] Fetching restaurants with params:', {
        district: districtToUse,
        subdistrict: subdistrictToUse,
        category: categoryToUse,
      });
      const response = await api.get('/api/restaurants/search', {
        headers,
        params: {
          district: districtToUse,
          subdistrict: subdistrictToUse,
          category: categoryToUse,
        },
      });
      console.log('[RestaurantStore] Restaurants fetched:', response.data);
      response.data.forEach((restaurant) => {
        console.log(`[RestaurantStore] Restaurant ID: ${restaurant.restaurantID}, Photos:`, restaurant.photos);
      });
      set({
        restaurants: Array.isArray(response.data) ? response.data : [],
        loading: false,
        fetchInProgress: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch restaurants';
      console.error('[RestaurantStore] Error fetching restaurants:', message, {
        status: error.response?.status,
        data: error.response?.data,
      });
      set({ error: message, loading: false, restaurants: [], fetchInProgress: false });
    }
  },

  fetchDistricts: async () => {
    try {
      console.log('[RestaurantStore] Fetching districts');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/districts', { headers });
      console.log('[RestaurantStore] Districts fetched:', response.data);
      set({ districts: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[RestaurantStore] Error fetching districts:', error.response?.data || error.message);
      set({ districts: [] });
    }
  },

  fetchSubdistricts: async (districtID) => {
    if (!districtID || districtID === 'nearme' || districtID === 'all') {
      set({ subdistricts: [] });
      return;
    }

    try {
      console.log('[RestaurantStore] Fetching subdistricts for district:', districtID);
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/subdistricts', {
        headers,
        params: { districtID },
      });
      console.log('[RestaurantStore] Subdistricts fetched:', response.data);
      set({ subdistricts: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[RestaurantStore] Error fetching subdistricts:', error.response?.data || error.message);
      set({ subdistricts: [] });
    }
  },

  fetchCategories: async () => {
    try {
      console.log('[RestaurantStore] Fetching restaurant categories');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/restaurant-categories', { headers });
      console.log('[RestaurantStore] Categories fetched:', response.data);
      set({ categories: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[RestaurantStore] Error fetching categories:', error.response?.data || error.message);
      set({ categories: [] });
    }
  },

  fetchRestaurantDetails: async (id) => {
    set({ loading: true, error: null });
  
    try {
      console.log('[useRestaurantStore] Fetching CSRF cookie');
      await api.get('/sanctum/csrf-cookie');
  
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
  
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
  
      const response = await api.get(`/api/restaurants/${id}`, { headers });
  
      console.log('[useRestaurantStore] Restaurant details fetched:', response.data);
      set({ restaurantDetails: response.data, loading: false });
  
    } catch (err) {
      console.error('[useRestaurantStore] Error fetching restaurant details:', err.response?.data || err.message);
      set({ error: 'Failed to fetch restaurant details', loading: false });
    }
  }
}));

export default useRestaurantStore;