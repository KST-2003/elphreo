import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRestaurantStore from '../store/useRestaurantStore';
import SafeTopWrapper from '../components/SafeTopWrapper';
import { ArrowLeftIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import useEmblaCarousel from 'embla-carousel-react';

const RestaurantDetails = () => {
  const { restaurantID } = useParams();
  const navigate = useNavigate();
  const parsedRestaurantID = parseInt(restaurantID);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const {
    restaurantDetails,
    loading,
    error,
    restaurantBookmarks,
    fetchRestaurantDetails,
    fetchBookmarks,
    bookmarkRestaurant,
    unbookmarkRestaurant,
  } = useRestaurantStore();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (restaurantID && !dataLoaded) {
        console.log('[RestaurantDetails] Fetching initial details and bookmarks for ID:', restaurantID);
        try {
          await Promise.all([fetchRestaurantDetails(restaurantID), fetchBookmarks()]);
          setDataLoaded(true);
        } catch (error) {
          console.error('[RestaurantDetails] Error loading initial data:', error);
        }
      }
    };
    
    loadInitialData();
  }, [restaurantID, fetchRestaurantDetails, fetchBookmarks, dataLoaded]);

  // Update bookmark state when restaurantBookmarks changes
  useEffect(() => {
    if (restaurantBookmarks && parsedRestaurantID) {
      const bookmark = restaurantBookmarks.find(b => b.content_id === parsedRestaurantID);
      setIsBookmarked(!!bookmark);
    }
  }, [restaurantBookmarks, parsedRestaurantID]);

  // Handle carousel selection
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
    return () => {
      if (emblaApi) emblaApi.off('select');
    };
  }, [emblaApi]);

  const toggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (bookmarkLoading) return;
    setBookmarkLoading(true);

    const existingBookmark = restaurantBookmarks.find(b => b.content_id === parsedRestaurantID);

    // Optimistic update
    setIsBookmarked(!isBookmarked);

    try {
      if (existingBookmark) {
        await unbookmarkRestaurant(existingBookmark.id);
      } else {
        await bookmarkRestaurant(parsedRestaurantID);
      }
    } catch (error) {
      console.error('[RestaurantDetails] Error toggling bookmark:', error);
      setIsBookmarked(existingBookmark ? true : false);
    }

    setBookmarkLoading(false);
  };

  if (loading && !dataLoaded) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurantDetails) return <p>No data found</p>;

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
    openingHours = [],
  } = restaurantDetails;

  const getGoogleMapEmbedUrl = () => {
    const API_KEY = import.meta.env.VITE_Maps_API_KEY;

    // Prioritize lat/lon for embedding to avoid parsing issues with shortened URLs
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      console.log('[RestaurantDetails] Using lat/lon for embed:', lat, lon);
      return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${lat},${lon}&zoom=15`;
    }

    // Fallback to gmapLink parsing
    if (gmapLink) {
      const mapRegex = /google\.com\/maps\/(?:place\/|.*?[@?])([-.\d]+),([-.\d]+)|q=([^&]+)/i;
      const match = gmapLink.match(mapRegex);

      if (match) {
        if (match[1] && match[2]) {
          console.log('[RestaurantDetails] Map URL with coordinates:', match[1], match[2]);
          return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${match[1]},${match[2]}&zoom=15`;
        } else if (match[3]) {
          const query = encodeURIComponent(match[3]);
          console.log('[RestaurantDetails] Map URL with query:', query);
          return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${query}`;
        }
      } else {
        console.warn('[RestaurantDetails] Invalid gmapLink format:', gmapLink);
      }
    }

    console.warn('[RestaurantDetails] No valid map data available');
    return null;
  };

  const renderStars = (rating) => {
    const ratingValue = parseFloat(rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="text-yellow-400">★</span>);
    }
    
    for (let i = fullStars; i < 5; i++) {
      stars.push(<span key={`star-${i}`} className="text-gray-300">★</span>);
    }
    
    return <div className="flex">{stars}</div>;
  };

  const mapEmbedUrl = getGoogleMapEmbedUrl();

  return (
    <div className="max-w-md mx-auto mt-0 overflow-y-auto h-screen no-scrollbar bg-gray-50 relative">
      <div className="z-50 fixed-safe-top">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-500 p-3 rounded-lg shadow"
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="relative">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {photos && photos.length > 0 ? (
              photos.map((photo) => (
                <div key={photo.photoID} className="embla__slide flex-[0_0_100%]">
                  <img
                    src={photo.url}
                    alt={`${restaurantName} photo`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('[RestaurantDetails] Failed to load photo:', photo.url);
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="embla__slide flex-[0_0_100%]">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Photos Available</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-lg">
          {rating || '-'}
        </div>
        
        {photos && photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-1">
            {photos.map((_, index) => (
              <div
                key={`dot-${index}`}
                className={`w-2 h-2 rounded-full ${
                  selectedIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 mb-20">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{restaurantName || '-'}</h1>
            <p className="text-lg text-gray-600">{thaiName || '-'}</p>
          </div>
          <button
            onClick={toggleBookmark}
            className="p-2"
            disabled={bookmarkLoading}
          >
            {isBookmarked ? (
              <HeartSolidIcon className="h-8 w-8 text-red-500" />
            ) : (
              <HeartOutlineIcon className="h-8 w-8 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="flex items-center mb-6">
          {renderStars(rating)}
          <span className="ml-2 text-gray-500">
            {postCategory?.postCategeoryName || '-'}
          </span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          {descriptionEnglish ? (
            <p className="text-gray-600 mb-2">{descriptionEnglish}</p>
          ) : (
            <p className="text-gray-400 mb-2">-</p>
          )}
          {descriptionThai && (
            <p className="text-gray-600 mb-2">{descriptionThai}</p>
          )}
          {descriptionMyanmar && (
            <p className="text-gray-600 mb-2">{descriptionMyanmar}</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
          <p className="text-gray-600 mb-2">
            {address || '-'}
            {postalCode && `, ${postalCode}`}
          </p>
          <p className="text-gray-600 mb-2">
            {subdistrict?.subdistrictName || '-'}
            {subdistrict?.district && `, ${subdistrict.district.districtName}`}
          </p>
          
          <div className="mt-4 h-48 rounded-lg overflow-hidden relative">
            {mapEmbedUrl && gmapLink ? (
              <a
                href={gmapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <iframe
                  src={mapEmbedUrl}
                  title={`${restaurantName} location`}
                  className="w-full h-full border-none rounded-lg"
                  loading="lazy"
                  allowFullScreen
                  onError={(e) => console.error('[RestaurantDetails] Failed to load map:', mapEmbedUrl)}
                ></iframe>
                <div className="absolute inset-0 z-10" />
              </a>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">Map Not Available</span>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
          
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Price Range:</span> {(priceRangeStart && priceRangeEnd) ? `฿${priceRangeStart} - ฿${priceRangeEnd}` : '-'}
          </p>
          
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Phone:</span>{' '}
            {phoneNumber ? (
              <a href={`tel:${phoneNumber}`} className="text-blue-500 hover:underline">
                {phoneNumber}
              </a>
            ) : (
              <span>-</span>
            )}
          </p>
          
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Category:</span> {category?.categoryTitle || '-'}
          </p>
        </section>

        {openingHours && openingHours.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Opening Hours</h2>
            <div className="space-y-2">
              {openingHours.map((hours, index) => (
                <p key={index} className="text-gray-600">
                  <span className="font-medium">{hours.day}:</span> {hours.openTime} - {hours.closeTime}
                </p>
              ))}
            </div>
          </section>
        )}

        {menuItems && menuItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Menu Items</h2>
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <p className="text-gray-600">{item.name}</p>
                  <p className="font-medium text-gray-600">฿{item.price}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            {gmapLink ? (
              <a
                href={gmapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google Maps
              </a>
            ) : (
              <span className="text-gray-400">No Google Maps Link</span>
            )}
            
            {fbLink ? (
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Facebook
              </a>
            ) : (
              <span className="text-gray-400">No Facebook Link</span>
            )}
            
            {igLink ? (
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Instagram
              </a>
            ) : (
              <span className="text-gray-400">No Instagram Link</span>
            )}
            
            {webLink ? (
              <a
                href={webLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Website
              </a>
            ) : (
              <span className="text-gray-400">No Website Link</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RestaurantDetails;