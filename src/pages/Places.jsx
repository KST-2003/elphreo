import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePlaceStore from '../store/usePlaceStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/api';
import SafeTopWrapper from '../components/SafeTopWrapper';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

const Places = () => {
  const { user } = useAuthStore();
  const {
    places,
    districts,
    subdistricts,
    categories,
    selectedDistrict,
    selectedSubdistrict,
    selectedCategory,
    loading,
    error,
    placeBookmarks,
    fetchPlaces,
    fetchDistricts,
    fetchSubdistricts,
    fetchCategories,
    fetchBookmarks,
    bookmarkPlace,
    unbookmarkPlace,
    setLocation,
    setSelectedDistrict,
    setSelectedSubdistrict,
    setSelectedCategory,
  } = usePlaceStore();

  const [initialized, setInitialized] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    if (user && !initialized) {
      console.log('[Places] Initializing data');
      const initializeData = async () => {
        try {
          // Debug session
          const userResponse = await api.get('/api/user');
          console.log('[Places] User session:', userResponse.data);

          // Debug cookies
          let debugResponse;
          try {
            debugResponse = await api.get('/api/debug-cookies');
            console.log('[Places] Debug cookies:', debugResponse.data);
          } catch (debugError) {
            console.error('[Places] Debug cookies error:', debugError.response?.data || debugError.message);
          }

          // Get user location or fallback to default
          try {
            const position = await new Promise((resolve, reject) => {
              if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
              }
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;
            console.log('[Places] User location obtained:', { latitude, longitude });
            await setLocation(latitude, longitude);
          } catch (locationError) {
            console.warn('[Places] Failed to get user location:', locationError.message);
            console.log('[Places] Falling back to default location (13.6615, 100.4033)');
            await setLocation(13.6615, 100.4033);
          }

          // Fetch districts, categories, bookmarks
          try {
            const [districtsResponse, categoriesResponse, bookmarksResponse] = await Promise.all([
              fetchDistricts(),
              fetchCategories(),
              fetchBookmarks(),
            ]);
            console.log('[Places] Districts response:', districtsResponse);
            console.log('[Places] Categories response:', categoriesResponse);
            console.log('[Places] Bookmarks response:', bookmarksResponse);
          } catch (fetchError) {
            console.error('[Places] Fetch error:', fetchError.response?.data || fetchError.message);
          }

          // Fetch places
          try {
            await fetchPlaces();
          } catch (placesError) {
            console.error('[Places] Fetch places error:', placesError.response?.data || placesError.message);
          }

          setInitialized(true);
        } catch (error) {
          console.error('[Places] Initialization error:', error.response?.data || error.message);
        }
      };
      initializeData();
    }
  }, [user, initialized, setLocation, fetchDistricts, fetchCategories, fetchBookmarks, fetchPlaces]);

  useEffect(() => {
    if (initialized && selectedDistrict !== 'nearme' && selectedDistrict !== 'all') {
      fetchSubdistricts(selectedDistrict);
    }
  }, [selectedDistrict, initialized, fetchSubdistricts]);

  const handleSearch = () => {
    console.log('[Places] Searching with filters:', {
      selectedDistrict,
      selectedSubdistrict,
      selectedCategory,
    });
    fetchPlaces(selectedDistrict, selectedSubdistrict, selectedCategory);
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    if (district !== 'nearme' && district !== 'all') {
      fetchSubdistricts(district);
    } else {
      setSelectedSubdistrict('all');
    }
  };

  const toggleBookmark = (placeID, bookmark) => {
    if (bookmark) {
      unbookmarkPlace(bookmark.id);
    } else {
      bookmarkPlace(placeID);
    }
  };

  useEffect(() => {
    console.log('[Places] Places data:', places);
    console.log('[Places] Bookmarks:', placeBookmarks);
    console.log('[Places] Districts:', districts);
  }, [places, placeBookmarks, districts]);

  const renderStars = (rating) => {
    const ratingValue = parseFloat(rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="text-yellow-500 text-sm">★</span>);
    }

    for (let i = fullStars; i < 5; i++) {
      stars.push(<span key={`star-${i}`} className="text-gray-300 text-sm">★</span>);
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="max-w-md mx-auto mt-3 overflow-y-auto h-screen no-scrollbar">
      {/* <SafeTopWrapper> */}
        <h1 className="text-2xl font-bold text-center mb-4">Where to Go</h1>
      {/* </SafeTopWrapper> */}
      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col space-y-4">
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="p-2 border rounded-lg"
          >
            <option value="nearme">Near Me</option>
            <option value="all">All Districts</option>
            {districts.map((district) => (
              <option key={district.districtID} value={district.districtID}>
                {district.districtName} ({district.thaiName})
              </option>
            ))}
          </select>

          <select
            value={selectedSubdistrict}
            onChange={(e) => setSelectedSubdistrict(e.target.value)}
            className="p-2 border rounded-lg"
            disabled={selectedDistrict === 'nearme' || selectedDistrict === 'all'}
          >
            <option value="all">All Subdistricts</option>
            {Array.isArray(subdistricts) && subdistricts.length > 0 ? (
              subdistricts.map((subdistrict) => (
                <option key={subdistrict.subdistrictID} value={subdistrict.subdistrictID}>
                  {subdistrict.subdistrictName}
                </option>
              ))
            ) : (
              <option disabled>No subdistricts available</option>
            )}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryTitle}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>

          <button
            onClick={handleSearch}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Places List */}
      <div className="space-y-4 mb-10 pb-30">
        {places.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500">No places found.</p>
        )}
        {places.map((place) => {
          if (!place.placeID) {
            console.error('[Places] Missing placeID for place:', place);
            return null;
          }
          const imageUrl = place.photos?.[0]?.url;
          const isFailed = failedImages.has(imageUrl);
          const bookmark = placeBookmarks.find((b) => b.content_id === place.placeID);
          return (
            <div
              key={place.placeID}
              className="relative bg-white rounded-xl shadow-md overflow-hidden m-2 mb-4"
            >
              <Link
                to={`/places/${place.placeID}`}
                onClick={() => console.log('[Places] Navigating to placeID:', place.placeID)}
                className="block"
              >
                {imageUrl && !isFailed ? (
                  <img
                    src={imageUrl}
                    alt={place.placeName || 'Place image'}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => {
                      console.error(
                        '[Places] Failed to load photo for placeID:',
                        place.placeID,
                        'URL:',
                        imageUrl
                      );
                      setFailedImages((prev) => new Set(prev).add(imageUrl));
                    }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-xl">
                    <span className="text-gray-500 text-sm">{place.placeName || 'No image'}</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">{place.placeName || 'Unknown Place'}</h2>
                  <p className="text-sm text-gray-600">
                    {place.subdistrict?.district?.districtName || 'Unknown District'},{' '}
                    {place.subdistrict?.subdistrictName || 'Unknown Subdistrict'}
                  </p>
                  <div className="flex items-center mt-1">{renderStars(place.rating)}</div>
                </div>
              </Link>
              <button
                onClick={() => toggleBookmark(place.placeID, bookmark)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
              >
                {bookmark ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Places;
