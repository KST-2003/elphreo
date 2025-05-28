import { create } from 'zustand';
import api from '../api/api';

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
  placeBookmarks: [],
  cachedPlaceDetails: {},

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
      const response = await api.post('/api/places/location', { latitude, longitude });
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
      console.log('[PlaceStore] Fetching places with params:', {
        district: districtToUse,
        subdistrict: subdistrictToUse,
        category: categoryToUse,
      });
      const response = await api.get('/api/places/search', {
        params: {
          district: districtToUse,
          subdistrict: subdistrictToUse,
          category: categoryToUse,
        },
      });
      console.log('[PlaceStore] Places fetched:', response.data);
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
      const response = await api.get('/api/districts');
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
      const response = await api.get('/api/subdistricts', {
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
      const response = await api.get('/api/place-categories');
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
      console.log('[PlaceStore] Fetching place details:', id);
      const response = await api.get(`/api/places/${id}`);
      console.log('[PlaceStore] Place details fetched:', response.data);
      set((state) => ({
        placeDetails: response.data,
        cachedPlaceDetails: { ...state.cachedPlaceDetails, [id]: response.data },
        loading: false,
      }));
      return response.data;
    } catch (error) {
      console.error('[PlaceStore] Error fetching place details:', error.response?.data || error.message);
      set({ error: 'Failed to fetch place details', loading: false });
      throw error;
    }
  },

  fetchBookmarks: async () => {
    set({ loading: true, error: null });
    try {
      console.log('[PlaceStore] Fetching bookmarks');
      const response = await api.get('/api/bookmarks');
      console.log('[PlaceStore] Bookmarks fetched:', response.data);
      const placeBookmarks = response.data.filter((bookmark) => bookmark.content_type === 'place');
      set({ placeBookmarks, loading: false });
    } catch (error) {
      console.error('[PlaceStore] Error fetching bookmarks:', error.response?.data || error.message);
      set({ error: 'Failed to fetch bookmarks', loading: false, placeBookmarks: [] });
    }
  },

  bookmarkPlace: async (placeID) => {
    set({ loading: true, error: null });
    try {
      console.log('[PlaceStore] Bookmarking place:', placeID);
      const response = await api.post('/api/bookmarks', { content_type: 'place', content_id: placeID });
      console.log('[PlaceStore] Bookmark added:', response.data);
      set((state) => ({
        placeBookmarks: [...state.placeBookmarks, response.data.bookmark],
        loading: false,
      }));
    } catch (error) {
      console.error('[PlaceStore] Error bookmarking place:', error.response?.data || error.message);
      set({ error: 'Failed to bookmark place', loading: false });
    }
  },

  unbookmarkPlace: async (bookmarkId) => {
    set({ loading: true, error: null });
    try {
      console.log('[PlaceStore] Unbookmarking place, bookmark ID:', bookmarkId);
      await api.delete(`/api/bookmarks/${bookmarkId}`);
      console.log('[PlaceStore] Bookmark removed:', bookmarkId);
      set((state) => ({
        placeBookmarks: state.placeBookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
        loading: false,
      }));
    } catch (error) {
      console.error('[PlaceStore] Error unbookmarking place:', error.response?.data || error.message);
      set({ error: 'Failed to unbookmark place', loading: false });
    }
  },
}));

export default usePlaceStore;