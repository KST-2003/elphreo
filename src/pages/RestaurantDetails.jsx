import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRestaurantStore from '../store/useRestaurantStore';
import SafeTopWrapper from '../components/SafeTopWrapper';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const RestaurantDetails = () => {
  const { restaurantID } = useParams();
  const navigate = useNavigate();

  const { restaurantDetails, loading, error, fetchRestaurantDetails } = useRestaurantStore();

  useEffect(() => {
    if (restaurantID) {
      console.log('[RestaurantDetails] Fetching details for ID:', restaurantID);
      fetchRestaurantDetails(restaurantID);
    }
  }, [restaurantID, fetchRestaurantDetails]);
console.log('[RestaurantDetails] restaurantDetails:', restaurantDetails);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurantDetails) return <p>No data found 2343</p>;

  // Only destructure after we know restaurantDetails is not null
  const {
    restaurantName,
    thaiName,
    rating,
    priceRangeStart,
    priceRangeEnd,
    phoneNumber,
    address,
    postalCode,
    descriptionEnglish,
    descriptionThai,
    descriptionMyanmar,
    gmapLink,
    fbLink,
    igLink,
    webLink,
    lat,
    lon,
    subdistrict,
    category,
    postCategory,
    photos = [],
    menuItems = [],
    openingHours = []
  } = restaurantDetails;

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-3 overflow-y-auto h-screen no-scrollbar">
      <SafeTopWrapper>
        <button
          onClick={() => navigate('/restaurants')}
          className="flex items-center text-gray-600 mb-4 hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back 
        </button>
      </SafeTopWrapper>
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{restaurantName}</h1>
        {thaiName && <p className="text-lg text-gray-600">{thaiName}</p>}
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">★ {rating ?? 'N/A'}</span>
          {postCategory && (
            <span className="ml-2 text-sm text-gray-500">
              ({postCategory.postCategeoryName ?? 'Uncategorized'})
            </span>
          )}
        </div>
        {category && (
          <p className="text-sm text-gray-500 mt-1">{category.categoryTitle ?? 'Uncategorized'}</p>
        )}
      </div>

      {photos.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Photos</h2>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => {
              console.log('[RestaurantDetails] Photo URL:', photo.url);
              return photo.url ? (
                <img
                  key={photo.photoID}
                  src={photo.url}
                  alt={`${restaurantName} photo`}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('[RestaurantDetails] Failed to load photo:', photo.url);
                    e.target.style.display = 'none'; // Hide broken image
                  }}
                />
              ) : (
                <div
                  key={photo.photoID}
                  className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg"
                >
                  <span className="text-gray-500 text-sm">{`${restaurantName} photo`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
        {descriptionEnglish && (
          <p className="text-gray-600 mb-2">{descriptionEnglish}</p>
        )}
        {descriptionThai && (
          <p className="text-gray-600 mb-2">{descriptionThai}</p>
        )}
        {descriptionMyanmar && (
          <p className="text-gray-600 mb-2">{descriptionMyanmar}</p>
        )}
        {address && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Address:</span> {address}
            {postalCode && `, ${postalCode}`}
          </p>
        )}
        {subdistrict && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Location:</span>{' '}
            {subdistrict.subdistrictName ?? 'Unknown Subdistrict'}
            {subdistrict.district && `, ${subdistrict.district.districtName}`}
          </p>
        )}
        {priceRangeStart && priceRangeEnd && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Price Range:</span> ฿{priceRangeStart} - ฿{priceRangeEnd}
          </p>
        )}
        {phoneNumber && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Phone:</span>{' '}
            <a href={`tel:${phoneNumber}`} className="text-blue-500 hover:underline">
              {phoneNumber}
            </a>
          </p>
        )}
        {lat && lon && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Coordinates:</span> {lat}, {lon}
          </p>
        )}
      </div>

      {openingHours && openingHours.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Opening Hours</h2>
          <div className="space-y-1">
            {openingHours.map((hours, index) => (
              <p key={index} className="text-gray-600">
                <span className="font-medium">{hours.day}:</span> {hours.openTime} - {hours.closeTime}
              </p>
            ))}
          </div>
        </div>
      )}

      {menuItems && menuItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Popular Menu Items</h2>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <p className="text-gray-700">{item.name}</p>
                <p className="font-medium">฿{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(gmapLink || fbLink || igLink || webLink) && (
        <div className="bg-white rounded-lg shadow p-6 mb-24">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Links</h2>
          <div className="flex flex-wrap gap-4">
            {gmapLink && (
              <a
                href={gmapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google Maps
              </a>
            )}
            {fbLink && (
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Facebook
              </a>
            )}
            {igLink && (
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Instagram
              </a>
            )}
            {webLink && (
              <a
                href={webLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;