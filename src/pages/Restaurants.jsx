import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useRestaurantStore from '../store/useRestaurantStore';
import useAuthStore from '../store/useAuthStore';
import SafeTopWrapper from '../components/SafeTopWrapper';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

const Restaurants = () => {
  const { user } = useAuthStore();
  const {
    restaurants,
    districts,
    subdistricts,
    categories,
    selectedDistrict,
    selectedSubdistrict,
    selectedCategory,
    loading,
    error,
    restaurantBookmarks,
    fetchRestaurants,
    fetchDistricts,
    fetchSubdistricts,
    fetchCategories,
    fetchBookmarks,
    bookmarkRestaurant,
    unbookmarkRestaurant,
    setLocation,
    setSelectedDistrict,
    setSelectedSubdistrict,
    setSelectedCategory,
  } = useRestaurantStore();

  const [initialized, setInitialized] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    if (user && !initialized) {
      console.log('[Restaurants] Initializing data');
      const initializeData = async () => {
        await setLocation(13.6615, 100.4033);
        await Promise.all([fetchDistricts(), fetchCategories(), fetchBookmarks()]);
        await fetchRestaurants();
        setInitialized(true);
      };
      initializeData();
    }
  }, [user, initialized]);

  useEffect(() => {
    if (initialized && selectedDistrict !== 'nearme' && selectedDistrict !== 'all') {
      fetchSubdistricts(selectedDistrict);
    }
  }, [selectedDistrict, initialized]);

  const handleSearch = () => {
    console.log('[Restaurants] Searching with filters:', {
      selectedDistrict,
      selectedSubdistrict,
      selectedCategory,
    });
    fetchRestaurants(selectedDistrict, selectedSubdistrict, selectedCategory);
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

  const toggleBookmark = (restaurantID, bookmark) => {
    if (bookmark) {
      unbookmarkRestaurant(bookmark.id);
    } else {
      bookmarkRestaurant(restaurantID);
    }
  };

  useEffect(() => {
    console.log('[Restaurants] Restaurants data:', restaurants);
    console.log('[Restaurants] Bookmarks:', restaurantBookmarks);
  }, [restaurants, restaurantBookmarks]);

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
      <SafeTopWrapper>
        <h1 className="text-2xl font-bold text-center mb-4">Where to Eat</h1>
      </SafeTopWrapper>
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
                <option
                  key={subdistrict.subdistrictID}
                  value={subdistrict.subdistrictID}
                >
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
            <option value="all">All Cuisines</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              subdistricts.map((subdistrict) => (
                <option
                  key={subdistrict.subdistrictID}
                  value={subdistrict.subdistrictID}
                >
                  {subdistrict.subdistrictName}
                </option>
              ))
            ) : (
              <option disabled>No cuisines available</option>
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

      {/* Restaurants List */}
      <div className="space-y-4 mb-28">
        {restaurants.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500">No restaurants found.</p>
        )}
        {restaurants.map((restaurant) => {
          if (!restaurant.restaurantID) {
            console.error('[Restaurants] Missing restaurantID for restaurant:', restaurant);
            return null;
          }
          const imageUrl = restaurant.photos?.[0]?.url;
          const isFailed = failedImages.has(imageUrl);
          const bookmark = restaurantBookmarks.find((b) => b.content_id === restaurant.restaurantID);
          return (
            <div
              key={restaurant.restaurantID}
              className="relative bg-white rounded-xl shadow-md overflow-hidden m-2 mb-4"
            >
              <Link
                to={`/restaurants/${restaurant.restaurantID}`}
                onClick={() => console.log('[Restaurants] Navigating to restaurantID:', restaurant.restaurantID)}
                className="block"
              >
                {imageUrl && !isFailed ? (
                  <img
                    src={imageUrl}
                    alt={restaurant.restaurantName || 'Restaurant image'}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => {
                      console.error('[Restaurants] Failed to load photo for restaurantID:', restaurant.restaurantID, 'URL:', imageUrl);
                      setFailedImages((prev) => new Set(prev).add(imageUrl));
                    }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-xl">
                    <span className="text-gray-500 text-sm">{restaurant.restaurantName || 'No image'}</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">{restaurant.restaurantName || 'Unknown Restaurant'}</h2>
                  <p className="text-sm text-gray-600">
                    {restaurant.subdistrict?.district?.districtName || 'Unknown District'},{' '}
                    {restaurant.subdistrict?.subdistrictName || 'Unknown Subdistrict'}
                  </p>
                  <div className="flex items-center mt-1">
                    {renderStars(restaurant.rating)}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => toggleBookmark(restaurant.restaurantID, bookmark)}
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

export default Restaurants;