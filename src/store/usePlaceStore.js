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

const usePlaceStore = create((set, get) => ({
  places: [],
  districts: [],
  subdistricts: [],
  categories: [],
  selectedDistrict: 'nearme',
  selectedSubdistrict: 'all',
  selectedCategory: 'all',
  loading: false,
  error: null,
  fetchInProgress: false,
  placeDetails: null,

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
      console.log('[PlaceStore] Setting location:', { latitude, longitude });
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.post('/api/places/location', { latitude, longitude }, { headers });
      console.log('[PlaceStore] Location set:', response.data);
    } catch (error) {
      console.error('[PlaceStore] Error setting location:', error.response?.data || error.message);
    }
  },

  fetchPlaces: async (district, subdistrict, category) => {
    const districtToUse = district || get().selectedDistrict;
    const subdistrictToUse = subdistrict || get().selectedSubdistrict;
    const categoryToUse = category || get().selectedCategory;

    if (get().fetchInProgress) {
      console.log('[PlaceStore] Fetch already in progress, skipping');
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
      console.log('[PlaceStore] Fetching places with params:', {
        district: districtToUse,
        subdistrict: subdistrictToUse,
        category: categoryToUse,
      });
      const response = await api.get('/api/places/search', {
        headers,
        params: {
          district: districtToUse,
          subdistrict: subdistrictToUse,
          category: categoryToUse,
        },
      });
      console.log('[PlaceStore] Places fetched:', response.data);
      response.data.forEach((place) => {
        console.log(`[PlaceStore] Place ID: ${place.placeID}, Photos:`, place.photos);
      });
      set({
        places: Array.isArray(response.data) ? response.data : [],
        loading: false,
        fetchInProgress: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch places';
      console.error('[PlaceStore] Error fetching places:', message, {
        status: error.response?.status,
        data: error.response?.data,
      });
      set({ error: message, loading: false, places: [], fetchInProgress: false });
    }
  },

  fetchDistricts: async () => {
    try {
      console.log('[PlaceStore] Fetching districts');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/districts', { headers });
      console.log('[PlaceStore] Districts fetched:', response.data);
      set({ districts: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[PlaceStore] Error fetching districts:', error.response?.data || error.message);
      set({ districts: [] });
    }
  },

  fetchSubdistricts: async (districtID) => {
    if (!districtID || districtID === 'nearme' || districtID === 'all') {
      set({ subdistricts: [] });
      return;
    }

    try {
      console.log('[PlaceStore] Fetching subdistricts for district:', districtID);
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
      console.log('[PlaceStore] Subdistricts fetched:', response.data);
      set({ subdistricts: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[PlaceStore] Error fetching subdistricts:', error.response?.data || error.message);
      set({ subdistricts: [] });
    }
  },

  fetchCategories: async () => {
    try {
      console.log('[PlaceStore] Fetching place categories');
      await api.get('/sanctum/csrf-cookie');
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
      const response = await api.get('/api/place-categories', { headers });
      console.log('[PlaceStore] Categories fetched:', response.data);
      set({ categories: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('[PlaceStore] Error fetching categories:', error.response?.data || error.message);
      set({ categories: [] });
    }
  },

  fetchPlaceDetails: async (id) => {
    set({ loading: true, error: null });
  
    try {
      console.log('[usePlaceStore] Fetching CSRF cookie');
      await api.get('/sanctum/csrf-cookie');
  
      const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
  
      const headers = {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      };
  
      const response = await api.get(`/api/places/${id}`, { headers });
  
      console.log('[usePlaceStore] Place details fetched:', response.data);
      set({ placeDetails: response.data, loading: false });
  
    } catch (err) {
      console.error('[usePlaceStore] Error fetching place details:', err.response?.data || err.message);
      set({ error: 'Failed to fetch place details', loading: false });
    }
  }
  
}));

export default usePlaceStore;