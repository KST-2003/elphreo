import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useRestaurantStore from '../store/useRestaurantStore';
import useAuthStore from '../store/useAuthStore';
import SafeTopWrapper from '../components/SafeTopWrapper';

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
    fetchRestaurants,
    fetchDistricts,
    fetchSubdistricts,
    fetchCategories,
    setLocation,
    setSelectedDistrict,
    setSelectedSubdistrict,
    setSelectedCategory,
  } = useRestaurantStore();

  const [initialized, setInitialized] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set()); // Track failed image URLs

  useEffect(() => {
    if (user && !initialized) {
      console.log('[Restaurants] Initializing data');
      const initializeData = async () => {
        await setLocation(13.6615, 100.4033);
        await Promise.all([fetchDistricts(), fetchCategories()]);
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

  // Log restaurants data for debugging
  useEffect(() => {
    console.log('[Restaurants] Restaurants data:', restaurants);
  }, [restaurants]);

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-3 overflow-y-auto h-screen no-scrollbar">
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
              categories.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryTitle}
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
            {loading ? 'Searching...' : 'Search'}
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
          return (
            <Link
              to={`/restaurants/${restaurant.restaurantID}`}
              key={restaurant.restaurantID}
              onClick={() => console.log('[Restaurants] Navigating to restaurantID:', restaurant.restaurantID)}
              className="block bg-white rounded-lg shadow p-4 flex flex-col space-y-2 hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                {imageUrl && !isFailed ? (
                  <img
                    src={imageUrl}
                    alt={restaurant.restaurantName || 'Restaurant image'}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('[Restaurants] Failed to load photo for restaurantID:', restaurant.restaurantID, 'URL:', imageUrl);
                      setFailedImages((prev) => new Set(prev).add(imageUrl));
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-500 text-sm">{restaurant.restaurantName || 'No image'}</span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{restaurant.restaurantName}</h2>
                  <p className="text-sm text-gray-600">{restaurant.thaiName}</p>
                  <p className="text-sm text-yellow-500">
                    Rating: {restaurant.rating || 'N/A'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {restaurant.subdistrict?.district?.districtName || 'Unknown District'}
              </p>
              <p className="text-sm text-gray-500">
                {restaurant.category?.categoryTitle || 'Uncategorized'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Restaurants;