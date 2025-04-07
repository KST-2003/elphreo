// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Logout from '../components/Logout.jsx';
import useAuthStore from '../store/useAuthStore.js';
import axios from 'axios';

function Profile() {
  const [activeTab, setActiveTab] = useState('Posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate(); // Add useNavigate

  const tabs = ['Posts', 'Noti', 'Chats'];

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Profile: isAuthenticated:', isAuthenticated, 'token:', token); // Debug log
      if (!isAuthenticated) {
        setError('Please log in to view your profile.');
        setLoading(false);
        navigate('/login'); // Redirect to login
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const userData = {
          name: response.data.name,
          email: response.data.email,
        };
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response) {
          console.log('Response status:', err.response.status);
          console.log('Response data:', err.response.data);
          if (err.response.status === 401) {
            setError('Session expired. Please log in again.');
            useAuthStore.getState().clearToken(); // Clear token on 401
            navigate('/login'); // Redirect to login
          } else {
            setError('Failed to fetch user data: ' + (err.response.data.message || 'Unknown error'));
          }
        } else if (err.request) {
          console.log('No response received:', err.request);
          setError('Failed to connect to the server. Please check if the backend is running.');
        } else {
          console.log('Error message:', err.message);
          setError('An unexpected error occurred: ' + err.message);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, isAuthenticated, setUser, navigate]);

  if (!isAuthenticated && !loading) {
    navigate('/login'); // Redirect to login
    return null;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-200">
        {/* Profile Info */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          {/* Username and Handle */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">{user?.name || 'User'}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified
              </span>
            </div>
            <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">
            Edit Profile
          </button>
          <a
            href="tel:66-4567-5661"
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-center"
          >
            Call
          </a>
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

      {/* Post Section */}
      {activeTab === 'Posts' && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold">{user?.name || 'User'}</h2>
                <span className="text-gray-500 text-sm">{user?.email || 'email@example.com'} · Apr 24</span>
              </div>
              <p className="text-gray-900">
                <span className="text-red-600 font-bold">Big announcement</span> - after two years of beta, Subframe is now open to everyone!
              </p>
              <p className="mt-2 text-gray-900">
                Subframe is the best way to build UI, fast. It’s a design tool that lets you visually build UI using real components, then{" "}
                <span className="text-yellow-500 font-bold">export it as React / Tailwind code</span>{" "}
                👇
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for Noti and Chats */}
      {activeTab === 'Noti' && (
        <div className="p-4 text-center text-gray-500">
          No notifications yet.
        </div>
      )}
      {activeTab === 'Chats' && (
        <div className="p-4 text-center text-gray-500">
          No chats yet.
        </div>
      )}
    </div>
  );
}

export default Profile;