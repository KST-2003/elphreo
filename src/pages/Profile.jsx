import React, { useState, useEffect } from 'react';
import Logout from '../components/Logout.jsx';
import useAuthStore from '../store/useAuthStore';

function Profile() {
  const [activeTab, setActiveTab] = useState('Places');
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const init = useAuthStore((state) => state.init);

  const tabs = ['Places', 'Restaurants'];

  useEffect(() => {
    const initialize = async () => {
      try {
        await init(); // Initialize auth store to check for user session
        setLoading(false);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setLoading(false);
      }
    };

    initialize();
  }, [init]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
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
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 
              1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 
              6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">{user?.name || 'User'}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 
                  3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 
                  9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified
              </span>
            </div>
            <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">
            Edit Profile
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium">
            Call
          </button>
          <Logout />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">

        {activeTab === 'Restaurants' && (
          <div className="text-center text-gray-500">No bookmark restaurants yet.</div>
        )}

        {activeTab === 'Places' && (
          <div className="text-center text-gray-500">No bookmark places yet.</div>
        )}
      </div>
    </div>
  );
}

export default Profile;