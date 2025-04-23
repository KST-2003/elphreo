import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logout from "../components/Logout.jsx";
import useAuthStore from "../store/useAuthStore";
import usePlaceStore from "../store/usePlaceStore";
import useRestaurantStore from "../store/useRestaurantStore";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

function Profile() {
  const [activeTab, setActiveTab] = useState("Places");
  const [loading, setLoading] = useState(true);
  const [placeDetails, setPlaceDetails] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookmarkToRemove, setBookmarkToRemove] = useState(null);
  const [isPlaceBookmark, setIsPlaceBookmark] = useState(true);

  // Use refs to track initialization state
  const initialized = useRef(false);
  const placeDetailsFetched = useRef(false);
  const restaurantDetailsFetched = useRef(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const init = useAuthStore((state) => state.init);

  // Place store actions
  const {
    placeBookmarks,
    fetchBookmarks: fetchPlaceBookmarks,
    fetchPlaceDetails,
    unbookmarkPlace,
  } = usePlaceStore();

  // Restaurant store actions
  const {
    restaurantBookmarks,
    fetchBookmarks: fetchRestaurantBookmarks,
    fetchRestaurantDetails,
    unbookmarkRestaurant,
  } = useRestaurantStore();

  const tabs = ["Places", "Restaurants"];

  // First useEffect: Initialize auth and fetch bookmarks only once
  useEffect(() => {
    if (initialized.current) return;
    
    const initialize = async () => {
      try {
        await init();
        if (isAuthenticated && user) {
          await Promise.all([fetchPlaceBookmarks(), fetchRestaurantBookmarks()]);
        }
        setLoading(false);
        initialized.current = true;
      } catch (err) {
        console.error("Error initializing profile data:", err);
        setLoading(false);
      }
    };

    initialize();
  }, [isAuthenticated, user]);

  // Second useEffect: Fetch place details
  useEffect(() => {
    if (!initialized.current || placeDetailsFetched.current || placeBookmarks.length === 0) {
      return;
    }

    const fetchPlaceDetailsForBookmarks = async () => {
      try {
        const details = await Promise.all(
          placeBookmarks.map(async (bookmark) => {
            try {
              const detail = await fetchPlaceDetails(bookmark.content_id);
              return { ...bookmark, details: detail || null };
            } catch (error) {
              console.error(`[Profile] Error fetching place ${bookmark.content_id}:`, error);
              return null;
            }
          })
        );
        setPlaceDetails(details.filter((item) => item && item.details));
        placeDetailsFetched.current = true;
      } catch (error) {
        console.error("[Profile] Error fetching place details:", error);
      }
    };

    fetchPlaceDetailsForBookmarks();
  }, [placeBookmarks]);

  // Third useEffect: Fetch restaurant details
  useEffect(() => {
    if (!initialized.current || restaurantDetailsFetched.current || restaurantBookmarks.length === 0) {
      return;
    }

    const fetchRestaurantDetailsForBookmarks = async () => {
      try {
        const details = await Promise.all(
          restaurantBookmarks.map(async (bookmark) => {
            try {
              const detail = await fetchRestaurantDetails(bookmark.content_id);
              return { ...bookmark, details: detail || null };
            } catch (error) {
              console.error(`[Profile] Error fetching restaurant ${bookmark.content_id}:`, error);
              return null;
            }
          })
        );
        setRestaurantDetails(details.filter((item) => item && item.details));
        restaurantDetailsFetched.current = true;
      } catch (error) {
        console.error("[Profile] Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetailsForBookmarks();
  }, [restaurantBookmarks]);

  // Reset fetch flags when bookmarks change
  useEffect(() => {
    placeDetailsFetched.current = false;
  }, [placeBookmarks]);

  useEffect(() => {
    restaurantDetailsFetched.current = false;
  }, [restaurantBookmarks]);

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

  const handleConfirmRemoveBookmark = (e, bookmarkId, isPlace) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkToRemove(bookmarkId);
    setIsPlaceBookmark(isPlace);
    setShowModal(true);
  };

  const handleRemovePlaceBookmark = async () => {
    const bookmarkId = bookmarkToRemove;
    const previousPlaceDetails = [...placeDetails];
    setPlaceDetails(placeDetails.filter((item) => item.id !== bookmarkId));
    setShowModal(false);

    try {
      await unbookmarkPlace(bookmarkId);
    } catch (error) {
      console.error("[Profile] Error removing place bookmark:", error);
      setPlaceDetails(previousPlaceDetails);
    }
  };

  const handleRemoveRestaurantBookmark = async () => {
    const bookmarkId = bookmarkToRemove;
    const previousRestaurantDetails = [...restaurantDetails];
    setRestaurantDetails(restaurantDetails.filter((item) => item.id !== bookmarkId));
    setShowModal(false);

    try {
      await unbookmarkRestaurant(bookmarkId);
    } catch (error) {
      console.error("[Profile] Error removing restaurant bookmark:", error);
      setRestaurantDetails(previousRestaurantDetails);
    }
  };

  const handleConfirm = async () => {
    if (isPlaceBookmark) {
      await handleRemovePlaceBookmark();
    } else {
      await handleRemoveRestaurantBookmark();
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setBookmarkToRemove(null);
    setIsPlaceBookmark(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Are you sure you want to remove this Bookmark?
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">{user?.name || "User"}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Verified
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">
            Edit Profile
          </button>
          <a
            href={`tel:${user?.phoneNumber || "+1234567890"}`}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-center"
          >
            Call
          </a>
          <Logout />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`p-4 max-w-md mx-auto ${showModal ? "pointer-events-none" : ""}`}>
        {activeTab === "Places" && (
          <div className="space-y-4">
            {placeDetails.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No bookmarked places yet.
              </div>
            ) : (
              placeDetails.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden m-2 mb-4"
                >
                  <Link
                    to={`/places/${item.content_id}`}
                    className="block"
                  >
                    {item.details.photos && item.details.photos[0]?.url ? (
                      <img
                        src={item.details.photos[0].url}
                        alt={item.details.placeName || "Place image"}
                        className="w-full h-40 object-cover rounded-t-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-xl">
                        <span className="text-gray-500 text-sm">
                          {item.details.placeName || "No image"}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-800">
                        {item.details.placeName || "Unknown Place"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item.details.subdistrict?.district?.districtName || "Unknown District"},{" "}
                        {item.details.subdistrict?.subdistrictName || "Unknown Subdistrict"}
                      </p>
                      <div className="flex items-center mt-1">
                        {renderStars(item.details.rating)}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleConfirmRemoveBookmark(e, item.id, true)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Restaurants" && (
          <div className="space-y-4">
            {restaurantDetails.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No bookmarked restaurants yet.
              </div>
            ) : (
              restaurantDetails.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden m-2 mb-4"
                >
                  <Link
                    to={`/restaurants/${item.content_id}`}
                    className="block"
                  >
                    {item.details.photos && item.details.photos[0]?.url ? (
                      <img
                        src={item.details.photos[0].url}
                        alt={item.details.restaurantName || "Restaurant image"}
                        className="w-full h-40 object-cover rounded-t-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-xl">
                        <span className="text-gray-500 text-sm">
                          {item.details.restaurantName || "No image"}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-800">
                        {item.details.restaurantName || "Unknown Restaurant"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item.details.subdistrict?.district?.districtName || "Unknown District"},{" "}
                        {item.details.subdistrict?.subdistrictName || "Unknown Subdistrict"}
                      </p>
                      <div className="flex items-center mt-1">
                        {renderStars(item.details.rating)}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleConfirmRemoveBookmark(e, item.id, false)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;