import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePlaceStore from '../store/usePlaceStore';
import SafeTopWrapper from '../components/SafeTopWrapper';
import { ArrowLeftIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import useEmblaCarousel from 'embla-carousel-react';

const PlaceDetails = () => {
  const { placeID } = useParams();
  const navigate = useNavigate();
  const parsedPlaceID = parseInt(placeID);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const {
    placeDetails,
    loading,
    error,
    placeBookmarks,
    fetchPlaceDetails,
    fetchBookmarks,
    bookmarkPlace,
    unbookmarkPlace,
  } = usePlaceStore();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (placeID && !dataLoaded) {
        console.log('[PlaceDetails] Fetching initial details and bookmarks for ID:', placeID);
        try {
          await Promise.all([fetchPlaceDetails(placeID), fetchBookmarks()]);
          setDataLoaded(true);
        } catch (error) {
          console.error('[PlaceDetails] Error loading initial data:', error);
        }
      }
    };
    
    loadInitialData();
  }, [placeID, fetchPlaceDetails, fetchBookmarks, dataLoaded]);

  // Update bookmark state when placeBookmarks changes
  useEffect(() => {
    if (placeBookmarks && parsedPlaceID) {
      const bookmark = placeBookmarks.find(b => b.content_id === parsedPlaceID);
      setIsBookmarked(!!bookmark);
    }
  }, [placeBookmarks, parsedPlaceID]);

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

    const existingBookmark = placeBookmarks.find(b => b.content_id === parsedPlaceID);

    // Optimistic update
    setIsBookmarked(!isBookmarked);

    try {
      if (existingBookmark) {
        await unbookmarkPlace(existingBookmark.id);
      } else {
        await bookmarkPlace(parsedPlaceID);
      }
    } catch (error) {
      console.error('[PlaceDetails] Error toggling bookmark:', error);
      setIsBookmarked(existingBookmark ? true : false);
    }

    setBookmarkLoading(false);
  };

  if (loading && !dataLoaded) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!placeDetails) return <p>No data found</p>;

  const {
    placeName,
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
  } = placeDetails;

  const getGoogleMapEmbedUrl = () => {
    const API_KEY = import.meta.env.VITE_Maps_API_KEY;

    // Prioritize lat/lon for embedding to avoid parsing issues with shortened URLs
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      console.log('[PlaceDetails] Using lat/lon for embed:', lat, lon);
      return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${lat},${lon}&zoom=15`;
    }

    // Fallback to gmapLink parsing
    if (gmapLink) {
      const mapRegex = /google\.com\/maps\/(?:place\/|.*?[@?])([-.\d]+),([-.\d]+)|q=([^&]+)/i;
      const match = gmapLink.match(mapRegex);

      if (match) {
        if (match[1] && match[2]) {
          console.log('[PlaceDetails] Map URL with coordinates:', match[1], match[2]);
          return `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${match[1]},${match[2]}&zoom=15`;
        } else if (match[3]) {
          const query = encodeURIComponent(match[3]);
          console.log('[PlaceDetails] Map URL with query:', query);
          return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${query}`;
        }
      } else {
        console.warn('[PlaceDetails] Invalid gmapLink format:', gmapLink);
      }
    }

    console.warn('[PlaceDetails] No valid map data available');
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
                    alt={`${placeName} photo`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('[PlaceDetails] Failed to load photo:', photo.url);
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
            <h1 className="text-3xl font-bold text-gray-800">{placeName || '-'}</h1>
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
          {/* <span className="ml-2 text-gray-500">
            {postCategory?.postCategeoryName || '-'}
          </span> */}
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
        title={`${placeName} location`}
        className="w-full h-full border-none rounded-lg"
        loading="lazy"
        allowFullScreen
        onError={(e) => console.error('[PlaceDetails] Failed to load map:', mapEmbedUrl)}
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

export default PlaceDetails;